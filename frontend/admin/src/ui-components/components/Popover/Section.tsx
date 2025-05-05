import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

export const Section = ({ children }: PropsWithChildren) => {
  return (
    <StyledSection>
      <StyledSectionContent>{children}</StyledSectionContent>
    </StyledSection>
  );
};

const StyledSection = styled.div`
  & + & {
    border-top: ${(p) => p.theme.shape.borderDivider};
  }
`;

const StyledSectionContent = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
`;
