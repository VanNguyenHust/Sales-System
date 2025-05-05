import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useUniqueId } from "../../utils/uniqueId";

import { SectionContext } from "./context";

export interface SectionProps {
  /** Nội dung của section */
  children?: React.ReactNode;
  /** Tiêu đề của section */
  title: React.ReactNode;
  /**
   * Đường viền bên dưới section
   * @default true
   * */
  divider?: boolean;
}

export function Section({ children, title, divider = true }: SectionProps) {
  const sectionId = useUniqueId("ListboxSection");
  return (
    <SectionContext.Provider value={sectionId}>
      <li role="presentation">
        {title}
        <StyledSection role="group" divider={divider}>
          {children}
        </StyledSection>
      </li>
    </SectionContext.Provider>
  );
}

const StyledSection = styled.ul<{ divider: SectionProps["divider"] }>`
  list-style-type: none;
  padding: 0;
  margin: 0;
  ${(p) =>
    p.divider &&
    css`
      border-bottom: ${p.theme.shape.borderDivider};
    `}
`;
