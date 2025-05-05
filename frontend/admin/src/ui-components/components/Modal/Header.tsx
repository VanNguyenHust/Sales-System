import React, { isValidElement } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Stack } from "../Stack";
import { Text } from "../Text";

import { CloseButton } from "./CloseButton";

interface HeaderProps {
  divider?: boolean;
  children?: React.ReactNode;
  onClose(): void;
}

export function Header({ children, divider, onClose }: HeaderProps) {
  if (!children) {
    return (
      <StyledTitleHidden>
        <CloseButton onClick={onClose} />
      </StyledTitleHidden>
    );
  }
  const titleMarkup = isValidElement(children) ? (
    children
  ) : (
    <Text variant="headingLg" as="h2" fontWeight="medium">
      {children}
    </Text>
  );
  return (
    <StyledHeader divider={divider}>
      <Stack alignment="center" distribution="equalSpacing" wrap={false}>
        <Stack.Item fill>{titleMarkup}</Stack.Item>
        <CloseButton onClick={onClose} />
      </Stack>
    </StyledHeader>
  );
}

const StyledHeader = styled.div<{
  divider?: boolean;
}>`
  padding: ${(p) => p.theme.spacing(2, 5)};
  ${(p) =>
    p.divider &&
    css`
      border-bottom: ${p.theme.shape.borderDivider};
    `}
`;

const StyledTitleHidden = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: ${(p) => p.theme.spacing(2)};
`;
