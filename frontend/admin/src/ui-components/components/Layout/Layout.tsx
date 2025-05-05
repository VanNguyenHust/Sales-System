import React from "react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";

import { AnnotatedSection } from "./AnnotatedSection";
import { Section } from "./Section";

export interface LayoutProps {
  /** Tự động wrap nội dung trong layout */
  sectioned?: boolean;
  /** Nội dung layout */
  children?: React.ReactNode;
}

/**
 * Có thể chia 1/2/3 cột, các cột có thể phân vai trò chính/phụ hoặc kích thước bằng nhau.
 * Có thể ở trạng thái "annotated", thường dùng cho settings với mô tả
 */
export const Layout: React.FC<LayoutProps> & {
  Section: typeof Section;
  AnnotatedSection: typeof AnnotatedSection;
} = ({ children, sectioned }) => {
  const content = sectioned ? wrapWithComponent(children, Section, {}) : children;
  return <StyledLayout>{content}</StyledLayout>;
};

Layout.Section = Section;
Layout.AnnotatedSection = AnnotatedSection;

const StyledLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin-top: calc(-1 * ${(p) => p.theme.spacing(4)});
  margin-left: calc(-1 * ${(p) => p.theme.spacing(4)});

  @media print {
    a,
    button {
      color: ${(p) => p.theme.colors.text};
    }
  }
`;
