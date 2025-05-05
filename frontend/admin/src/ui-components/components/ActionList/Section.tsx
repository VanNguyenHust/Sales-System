import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ActionListItemDescriptor, ActionListSection } from "../../types";
import { Text } from "../Text";

import { Item } from "./Item";
import { StyledActionList } from "./StyledActionList";

interface SectionProps {
  section: ActionListSection;
  hasMultipleSections: boolean;
  isFirst?: boolean;
  onActionAnyItem?: ActionListItemDescriptor["onAction"];
}

export function Section({ section, hasMultipleSections, isFirst, onActionAnyItem }: SectionProps) {
  const handleAction = (itemOnAction: ActionListItemDescriptor["onAction"]) => {
    return () => {
      itemOnAction?.();
      onActionAnyItem?.();
    };
  };
  const actionMarkup = section.items.map(({ content, helpText, onAction, ...item }, index) => {
    return (
      <li key={item.id ?? `${content}-${index}`}>
        <Item content={content} helpText={helpText} onAction={handleAction(onAction)} {...item} />
      </li>
    );
  });

  const titleMarkup = section.title ? (
    <StyledTextWrapper>
      <Text as="p" variant="headingXs" fontWeight="medium">
        {section.title}
      </Text>
    </StyledTextWrapper>
  ) : null;

  const sectionMarkup = (
    <>
      {titleMarkup}
      <StyledSubSection hasTitle={hasMultipleSections && titleMarkup !== null}>{actionMarkup}</StyledSubSection>
    </>
  );
  return hasMultipleSections ? (
    <StyledSectionGroup isFirst={isFirst}>{sectionMarkup}</StyledSectionGroup>
  ) : (
    sectionMarkup
  );
}

const StyledSectionGroup = styled.li<{
  isFirst?: boolean;
}>`
  ${(p) =>
    !p.isFirst &&
    css`
      border-top: ${p.theme.shape.borderDivider};
    `}
`;
const StyledTextWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(4, 4, 2, 4)};
`;

const StyledSubSection = styled(StyledActionList)<{
  hasTitle: boolean;
}>`
  padding: ${(p) => p.theme.spacing(2)};
  ${(p) =>
    p.hasTitle &&
    css`
      padding-top: 0;
    `}
`;
