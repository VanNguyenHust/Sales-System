import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useFilterItem } from "./context";

export interface ItemProps {
  /** Nội dung hiển thị trong item */
  children?: React.ReactNode | ((inShortcut: boolean) => React.ReactNode);
  /**
   * Có đường viền bao ngoài trong sheet filter
   * @deprecated
   * */
  bordered?: boolean;
  /**
   * Bỏ padding mặc định
   * @deprecated
   * */
  flush?: boolean;
  /**
   * min width khi hiển thị trên shortcut
   * @deprecated
   * */
  minWidth?: number | string;
  /**
   * Tùy chỉnh hoặc sử dụng width mặc định cho shortcut
   */
  fixedShortcutWidth?: boolean | number;
}

export function Item({ bordered, flush, minWidth, fixedShortcutWidth, children }: ItemProps) {
  const { inShortcut = false } = useFilterItem();

  const childrenMarkup = typeof children === "function" ? children(inShortcut) : children;

  if (inShortcut) {
    return (
      <StyledShortcutItem flush={flush} fixedShortcutWidth={fixedShortcutWidth} style={{ minWidth }}>
        {childrenMarkup}
      </StyledShortcutItem>
    );
  }
  return (
    <StyledItem bordered={bordered} flush={flush}>
      {childrenMarkup}
    </StyledItem>
  );
}

const StyledItem = styled.div<{
  bordered?: boolean;
  flush?: boolean;
}>`
  padding: ${(p) => (p.flush ? p.theme.spacing(0) : p.theme.spacing(2, 3, 2))};
  ${(p) =>
    p.bordered &&
    css`
      border: ${p.theme.shape.borderBase};
      border-radius: ${p.theme.shape.borderRadius("base")};
    `}
`;

const StyledShortcutItem = styled.div<{
  flush?: boolean;
  fixedShortcutWidth?: boolean | number;
}>`
  padding: ${(p) => (p.flush ? p.theme.spacing(0, 0, 3, 0) : p.theme.spacing(3))};
  ${(p) => {
    if (p.fixedShortcutWidth) {
      return css`
        width: ${typeof p.fixedShortcutWidth === "number"
          ? `${p.fixedShortcutWidth}px`
          : `calc(${p.theme.components.filters.defaultWidth} - ${p.theme.spacing(6)})`};
      `;
    }
  }}
`;
