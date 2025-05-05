import React from "react";
import styled from "@emotion/styled";

export interface FooterHelpProps {
  /**
   * Nội dung bên trong thẻ footer
   */
  children?: React.ReactNode;
}

/**
 * Thường chứa những hướng dẫn của website nằm ở cuối nội dung.
 */
export const FooterHelp = ({ children }: FooterHelpProps) => {
  return (
    <StyledFooterHelp>
      <StyledContent>{children}</StyledContent>
    </StyledFooterHelp>
  );
};

const StyledFooterHelp = styled.div`
  display: flex;
  justify-content: center;
  margin: ${(p) => p.theme.spacing(4, 0)};
  width: 100%;

  ${(p) => p.theme.breakpoints.up("md")} {
    margin: ${(p) => p.theme.spacing(5)} auto;
  }
`;

const StyledContent = styled.div`
  font-size: ${(p) => p.theme.typography.fontSize100};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  border: none;
  text-transform: initial;
  letter-spacing: initial;
`;
