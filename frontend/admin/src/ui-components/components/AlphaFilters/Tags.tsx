import React from "react";
import styled from "@emotion/styled";

import { useToggle } from "../../utils/useToggle";
import { Tag } from "../Tag";

import { TagRollup } from "./TagRollup";

interface TagsProps {
  items: { key: string; label: string; onRemove(key: string): void }[];
  disabled?: boolean;
  tagsRollupAfter?: number;
}

export const Tags = ({ items, tagsRollupAfter, disabled }: TagsProps) => {
  const { value: expanded, toggle: toggleExpanded } = useToggle(false);
  const tagsMarkup = items.map((item) => {
    return (
      <Tag key={item.key} onRemove={() => item.onRemove(item.key)} disabled={disabled} large>
        {item.label}
      </Tag>
    );
  });

  const activeTagsMarkup = tagsRollupAfter ? tagsMarkup.slice(0, tagsRollupAfter) : tagsMarkup;

  const additionalTags = tagsRollupAfter ? tagsMarkup.slice(tagsRollupAfter) : [];

  const additionalTagsMarkup =
    tagsRollupAfter && additionalTags.length > 0 && !expanded ? (
      <TagRollup key="rollup" onClick={toggleExpanded} large>
        +{additionalTags.length}
      </TagRollup>
    ) : (
      additionalTags
    );

  return (
    <StyledTags>
      {activeTagsMarkup}
      {additionalTagsMarkup}
    </StyledTags>
  );
};

const StyledTags = styled.div`
  display: flex;
  padding-top: ${(p) => p.theme.spacing(4)};
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(2)};
`;
