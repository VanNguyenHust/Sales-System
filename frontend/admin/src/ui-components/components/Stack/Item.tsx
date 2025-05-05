import React from "react";
import styled from "@emotion/styled";

interface StackItemProps {
  /** Fill item trong stack */
  fill?: boolean;
  /** Nội dung item */
  children?: React.ReactNode;
}

export function Item({ fill, children }: StackItemProps) {
  return <StyledItem $fill={fill}>{children}</StyledItem>;
}

export const StyledItem = styled.div<{
  $fill: StackItemProps["fill"];
}>`
  flex: ${(p) => (p.$fill ? "1 1 auto" : "0 0 auto")};
  min-width: 0;
  max-width: 100%;
`;
