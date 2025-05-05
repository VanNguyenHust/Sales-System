import React, { useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useComboboxHeader } from "./context";

export interface HeaderItemProps {
  /**
   * Ngăn item bởi đường viền
   * @default true
   * */
  divider?: boolean;
  /** Bỏ padding mặc định */
  flush?: boolean;
  /** Nội dung header item */
  children: React.ReactNode;
}

export function HeaderItem({ children, divider = true, ...rest }: HeaderItemProps) {
  const { setTextFieldFocusedIn } = useComboboxHeader();

  const handleMouseDown = useCallback(() => {
    setTextFieldFocusedIn?.(true);
  }, [setTextFieldFocusedIn]);

  return (
    <StyledHeaderItem divider={divider} {...rest} tabIndex={-1} onMouseDown={handleMouseDown}>
      {children}
    </StyledHeaderItem>
  );
}

const StyledHeaderItem = styled.div<Omit<HeaderItemProps, "children">>`
  padding: ${(p) => (p.flush ? 0 : p.theme.spacing(1, 3))};
  ${(p) =>
    p.divider &&
    css`
      :not(:first-of-type) {
        border-top: ${p.theme.shape.borderDivider};
      }
    `}
`;
