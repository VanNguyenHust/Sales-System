import React from "react";

import { ActionListItemDescriptor, ActionListSection } from "../../types";

import { Section } from "./Section";
import { StyledActionList } from "./StyledActionList";

export interface ActionListProps {
  /** Danh sách các hành động */
  items?: ActionListItemDescriptor[];
  /** Danh sách nhóm các hành động */
  sections?: ActionListSection[];
  /** Callback khi bất kì hành động nào được click */
  onActionAnyItem?: ActionListItemDescriptor["onAction"];
}

/**
 * Danh sách các hành động hoặc lựa chọn,
 * thường được đặt trong một Popover để tạo dropdown menu hoặc cho phép chủ shop lựa chọn từ danh sách lựa chọn.
 */
export function ActionList({ items, sections = [], onActionAnyItem }: ActionListProps) {
  let finalSections: ActionListSection[] = [];
  if (items) {
    finalSections = [{ items }, ...sections];
  } else if (sections) {
    finalSections = sections;
  }

  const hasMultipleSections = finalSections.length > 1;

  const sectionMarkup = finalSections.map((section, index) => {
    return section.items.length > 0 ? (
      <Section
        key={section.title || index}
        section={section}
        hasMultipleSections={hasMultipleSections}
        onActionAnyItem={onActionAnyItem}
        isFirst={index === 0}
      />
    ) : null;
  });

  return <StyledActionList as={hasMultipleSections ? "ul" : "div"}>{sectionMarkup}</StyledActionList>;
}
