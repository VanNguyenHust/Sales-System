import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export interface ConnectedProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  segmented?: boolean;
}

export function Connected({ left, right, children, segmented }: ConnectedProps) {
  const leftItemMarkup = left ? <StyledItem>{left}</StyledItem> : null;
  const rightItemMarkup = right ? <StyledItem>{right}</StyledItem> : null;
  const primaryMarkup = children ? <StyledItem primary>{children}</StyledItem> : null;
  const isSegmented = (!!leftItemMarkup || !!rightItemMarkup) && segmented;

  return (
    <StyledConnected segmented={isSegmented}>
      {leftItemMarkup}
      {primaryMarkup}
      {rightItemMarkup}
    </StyledConnected>
  );
}

const StyledItem = styled.div<{
  primary?: boolean;
}>`
  position: relative;
  flex: ${(p) => (p.primary ? "1 1 auto" : "0 0 auto")};
`;

const StyledConnected = styled.div<{
  segmented?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  ${(p) =>
    p.segmented &&
    css`
      gap: 0;
      [data-segment-control] {
        border-radius: 0;
      }
      > :first-of-type [data-segment-control] {
        border-top-left-radius: ${p.theme.shape.borderRadius("base")};
        border-bottom-left-radius: ${p.theme.shape.borderRadius("base")};
      }
      > :last-child [data-segment-control] {
        border-top-right-radius: ${p.theme.shape.borderRadius("base")};
        border-bottom-right-radius: ${p.theme.shape.borderRadius("base")};
      }
    `}
`;
