import styled from "@emotion/styled";
import { Stack, Text } from "@/ui-components";

import EmptyLoupeIcon from "app/assets/icon/empty-loupe.svg";

export function EmptySearchResult() {
  return (
    <StyledEmptySearchResult>
      <StyledImg src={EmptyLoupeIcon} />
      <Stack vertical alignment="center" distribution="center" spacing="extraTight">
        <Text as="h4" variant="headingLg">
          Không tìm thấy dữ liệu phù hợp với kết quả tìm kiếm
        </Text>
        <Text as="p" color="subdued">
          Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm
        </Text>
      </Stack>
    </StyledEmptySearchResult>
  );
}

const StyledEmptySearchResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(4)};
  padding: ${(p) => p.theme.spacing(4)};
  height: 100%;
`;

const StyledImg = styled.img`
  height: 80px;
  width: 80px;
`;
