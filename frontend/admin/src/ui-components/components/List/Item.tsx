import React from "react";
import styled from "@emotion/styled";

export interface ItemProps {
  /** Nội dung của Item */
  children?: React.ReactNode;
}

export function Item({ children }: ItemProps) {
  return <StyledItem>{children}</StyledItem>;
}

export const StyledItem = styled.li`
  &:last-child {
    margin-bottom: 0;
  }
`;
