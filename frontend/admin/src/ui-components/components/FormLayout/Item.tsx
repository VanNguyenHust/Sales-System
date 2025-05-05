import React from "react";
import styled from "@emotion/styled";

export interface ItemProps {
  children?: React.ReactNode;
}

export function Item({ children }: ItemProps) {
  return children ? <StyledItem>{children}</StyledItem> : null;
}

export const StyledItem = styled.div`
  flex: 1 1 ${(p) => p.theme.components.form.itemMinWidth};
  margin-top: ${(p) => p.theme.spacing(4)};
  margin-left: ${(p) => p.theme.spacing(5)};
  max-width: calc(100% - ${(p) => p.theme.spacing(5)});
`;
