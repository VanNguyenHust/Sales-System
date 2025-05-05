import React from "react";
import styled from "@emotion/styled";

import { Text } from "../Text";

interface HeaderProps {
  /** Nội dung bên trong header */
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const content =
    typeof children === "string" ? (
      <StyledLabel>
        <Text as="span" variant="headingXs" color="subdued">
          {children}
        </Text>
      </StyledLabel>
    ) : (
      children
    );
  return <StyledHeader>{content}</StyledHeader>;
}

const StyledHeader = styled.div``;

const StyledLabel = styled.div`
  padding: ${(p) => p.theme.spacing(2, 3)};
`;
