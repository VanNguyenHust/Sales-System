import styled from "@emotion/styled";
import { Stack, Tag } from "@/ui-components";

import { TruncatedText } from "../TruncatedText";

export interface TagListProps {
  tags: string[];
  limit?: number;
  onRemove?: (tag: string) => void;
  onMoreClick?: () => void;
}

export function TagList({ tags, limit = tags.length, onRemove, onMoreClick }: TagListProps) {
  const tagsMarkup = tags.slice(0, limit).map((tag) => (
    <Tag key={`${tag}-tag`} onRemove={onRemove ? () => onRemove(tag) : undefined}>
      <TruncatedText hoverDelay={1000}>{tag}</TruncatedText>
    </Tag>
  ));
  const rollupMarkup =
    tags.length > limit ? (
      <Tag onClick={onMoreClick}>
        <StyledContent>+{tags.length - limit}</StyledContent>
      </Tag>
    ) : null;
  return (
    <Stack spacing="extraTight">
      {tagsMarkup}
      {rollupMarkup}
    </Stack>
  );
}

const StyledContent = styled.span`
  color: ${(p) => p.theme.colors.interactive};
`;
