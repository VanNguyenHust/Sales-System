import React from "react";
import styled from "@emotion/styled";

export interface CardSubsectionProps {
  /** Nội dung trong subsection */
  children?: React.ReactNode;
}

export function Subsection({ children }: CardSubsectionProps) {
  return <StyledSubsection>{children}</StyledSubsection>;
}

const StyledSubsection = styled.div`
  & + & {
    margin-top: ${(p) => p.theme.spacing(4)};
    padding-top: ${(p) => p.theme.spacing(4)};
    border-top: ${(p) => p.theme.shape.borderDivider};
  }
`;
