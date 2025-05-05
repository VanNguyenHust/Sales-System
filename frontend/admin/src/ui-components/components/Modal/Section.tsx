import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export interface SectionProps {
  /** Nội dung section */
  children?: React.ReactNode;
  /** Bỏ padding tự sinh */
  flush?: boolean;
  /** Subdued section */
  subdued?: boolean;
  /** Không có title - sẽ thêm padding-right để không bị nút dismiss che */
  titleHidden?: boolean;
}

export function Section({ children, ...rest }: SectionProps) {
  return <StyledSection {...rest}>{children}</StyledSection>;
}

const StyledSection = styled.section<Omit<SectionProps, "children">>`
  flex: 0 0 auto;
  &:not(:last-of-type) {
    border-bottom: ${(p) => p.theme.shape.borderDivider};
  }

  padding: ${(p) => (p.flush ? 0 : p.theme.spacing(5))};
  ${(p) =>
    p.titleHidden &&
    css`
      padding-right: ${p.theme.spacing(12)};
    `}

  ${(p) =>
    p.subdued &&
    css`
      background-color: ${p.theme.colors.surfaceSubdued};
    `}
`;
