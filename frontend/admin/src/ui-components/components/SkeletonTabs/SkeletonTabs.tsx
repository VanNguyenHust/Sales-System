import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { SkeletonBodyText } from "../SkeletonBodyText";

export interface SkeletonTabsProps {
  /**
   * Số tab
   * @default 2
   * */
  count?: number;
  /** Mở rộng các tab theo kích thước của container */
  fitted?: boolean;
}

/**
 * SkeletonTabs được dùng là skeleton các nội dung đang chờ load cho Tabs
 */
export function SkeletonTabs({ count = 2, fitted }: SkeletonTabsProps) {
  return (
    <StyledSkeletonTabs fitted={fitted}>
      {Array.from({ length: count }, (_, key) => (
        <StyledSkeletonTab key={key} long={key % 2 === 1} data-testid="skeleton-tab-item">
          <SkeletonBodyText lines={1} />
        </StyledSkeletonTab>
      ))}
    </StyledSkeletonTabs>
  );
}

const StyledSkeletonTabs = styled.div<{
  fitted?: boolean;
}>`
  display: flex;
  width: 100%;
  border-bottom: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.borderSubdued};
  ${(p) =>
    p.fitted &&
    css`
      flex-wrap: nowrap;
      > * {
        flex: 1 1 100%;
      }
    `}
`;

const StyledSkeletonTab = styled.div<{
  long: boolean;
}>`
  width: ${(p) => (p.long ? 120 : 80)}px;
  position: relative;
  padding: calc(${(p) => p.theme.spacing(4)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(4)};

  &:first-of-type::before {
    background-color: ${(p) => p.theme.colors.borderHovered};
  }

  &::before {
    content: "";
    position: absolute;
    bottom: -1px;
    left: ${(p) => p.theme.spacing(3)};
    right: ${(p) => p.theme.spacing(3)};
    height: ${(p) => p.theme.shape.borderWidth(3)};
    border-top-left-radius: ${(p) => p.theme.shape.borderRadius(1)};
    border-top-right-radius: ${(p) => p.theme.shape.borderRadius(1)};
  }
`;
