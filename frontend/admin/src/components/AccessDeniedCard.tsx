import React from "react";
import styled from "@emotion/styled";
import { EmptyState, Link, Stack, Text } from "@/ui-components";

import AccessDeniedSVG from "app/assets/images/access-denied-card.svg";
import { useSelector } from "src/types";

interface Props {
  showContact?: boolean;
}

export default function AccessDeniedCard({ showContact = true }: Props) {
  const tenant = useSelector((state) => state.tenant.tenant);
  return (
    <div style={{ padding: 16 }}>
      <Stack vertical alignment="center" spacing="tight">
        <img src={AccessDeniedSVG} alt="Access Denied" />
        <Text as="h6" variant="bodyMd" fontWeight="medium">
          Bạn không có quyền truy cập chức năng này.
        </Text>
        {showContact && tenant && tenant.email ? (
          <Text variant="bodySm" as="p" fontWeight="regular" color="subdued">
            Hãy liên hệ với <Link url={`mailto:${tenant.email}`}>{tenant.email}</Link> để được cấp quyền.
          </Text>
        ) : null}
      </Stack>
    </div>
  );
}
