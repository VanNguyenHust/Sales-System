import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Text } from "@/ui-components";

import AccessDeniedUrl from "app/assets/images/access-denied.svg";
import { useSelector } from "app/types";

export default function AccessDeniedState({ hasSpacing }: { hasSpacing?: boolean }) {
  const tenantState = useSelector((state) => state.tenant.tenant);
  return (
    <StyledAccessDeniedState hasSpacing={hasSpacing}>
      <img src={AccessDeniedUrl} alt="Bạn không có quyền truy cập chức năng này" width={100} height={100} />
      <StyledContent>
        <Text as="p" variant="headingMd" fontWeight="medium">
          Bạn không có quyền truy cập chức năng này
        </Text>
        <Text as="p" color="subdued">
          Hãy liên hệ với{" "}
          <Text as="span" fontWeight="bold">
            {tenantState?.store_owner}
          </Text>{" "}
          để được cấp quyền
        </Text>
      </StyledContent>
    </StyledAccessDeniedState>
  );
}

const StyledAccessDeniedState = styled.div<{ hasSpacing?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${(p) =>
    p.hasSpacing &&
    css`
      padding: ${p.theme.spacing(5)};
    `}
`;

const StyledContent = styled.div`
  margin-top: ${(p) => p.theme.spacing(1)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
`;
