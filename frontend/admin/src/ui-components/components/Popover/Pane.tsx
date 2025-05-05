import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { Scrollable } from "../Scrollable";

import { Section } from "./Section";

export interface PaneProps {
  /** Tự động bọc nội dung trong Section */
  sectioned?: boolean;
  /** Nội dung trong Pane */
  children?: React.ReactNode;
  /** Đặt height, max-height cho Pane */
  height?: string;
  /** Cố định Pane ở đầu Popover */
  fixed?: boolean;
  /**
   * Ngăn page scroll khi scroll tới cuối Scrollable của Pane
   * @default false
   */
  captureOverscroll?: boolean;
  /** Callback khi scroll đến cuối pane */
  onScrolledToBottom?(): void;
}

export const Pane = ({ children, fixed, height, sectioned, captureOverscroll, onScrolledToBottom }: PaneProps) => {
  const content = sectioned ? wrapWithComponent(children, Section, {}) : children;
  const style = height ? { height, maxHeight: height, minHeight: height } : undefined;

  return fixed ? (
    <StyledPane style={style} fixed captureOverscroll={captureOverscroll}>
      {content}
    </StyledPane>
  ) : (
    <StyledPane
      as={Scrollable}
      style={style}
      onScrolledToBottom={onScrolledToBottom}
      captureOverscroll={captureOverscroll}
    >
      {content}
    </StyledPane>
  );
};

const StyledPane = styled.div<{
  fixed?: boolean;
  onScrolledToBottom?: PaneProps["onScrolledToBottom"];
  captureOverscroll?: PaneProps["captureOverscroll"];
}>`
  flex: 1 1 auto;
  max-width: 100%;
  :not(:first-of-type) {
    border-top: ${(p) => p.theme.shape.borderDivider};
  }
  ${(p) =>
    p.fixed &&
    css`
      overflow: visible;
      flex: 0 0 auto;
    `}

  ${(p) =>
    p.captureOverscroll &&
    css`
      overscroll-behavior: contain;
    `}
`;
