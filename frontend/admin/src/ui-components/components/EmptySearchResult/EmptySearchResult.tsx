import React from "react";
import styled from "@emotion/styled";
import { SearchSmallIcon } from "@/ui-icons";

import { Stack } from "../Stack";
import { Text } from "../Text";

export interface EmptySearchResultProps {
  /** Tiêu đề cho việc không có kết quả tìm kiếm */
  title: string;
  /** Mô tả trạng thái không có kết quả tìm kiếm */
  description?: string;
  /** Có kèm icon minh họa */
  withIllustration?: boolean;
}

export function EmptySearchResult({ title, description, withIllustration }: EmptySearchResultProps) {
  const descriptionMarkup = description ? <p>{description}</p> : null;
  const illustrationMarkup = withIllustration ? (
    <StyledIcon>
      <SearchSmallIcon />
    </StyledIcon>
  ) : null;
  return (
    <Stack alignment="center" vertical>
      {illustrationMarkup}
      <Text variant="headingLg" as="p">
        {title}
      </Text>
      <Text color="subdued" as="span" variant="bodyMd">
        {descriptionMarkup}
      </Text>
    </Stack>
  );
}

const StyledIcon = styled.span`
  display: block;
  height: ${(p) => p.theme.spacing(16)};
  width: ${(p) => p.theme.spacing(16)};
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  color: ${(p) => p.theme.colors.icon};
  svg {
    position: relative;
    display: block;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
`;
