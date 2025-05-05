import React, { ComponentProps, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Focus } from "../Focus";
import { Popover } from "../Popover";

import { useFilterItem } from "./context";

export type PaneProps = Pick<
  ComponentProps<typeof Popover.Pane>,
  "fixed" | "onScrolledToBottom" | "children" | "sectioned"
> & {
  /** Tự động focus vào node đầu tiên */
  autofocusFirstNode?: boolean;
  /**
   * Giới hạn chiều rộng cho Pane khi ở trong shortcut
   */
  limitWidth?: boolean | number;
};

export function Pane({ sectioned, autofocusFirstNode, children, limitWidth = false, ...rest }: PaneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { inShortcut = false } = useFilterItem();
  const content = (
    <Popover.Pane {...rest}>
      <StyledFiltersPane ref={ref} inShortcut={inShortcut} limitWidth={limitWidth} sectioned={sectioned}>
        {children}
      </StyledFiltersPane>
    </Popover.Pane>
  );
  return autofocusFirstNode ? <Focus root={ref}>{content}</Focus> : content;
}

const StyledFiltersPane = styled.div<{
  sectioned?: boolean;
  limitWidth?: boolean | number;
  inShortcut?: boolean;
}>`
  padding: ${(p) => (p.sectioned ? p.theme.spacing(3) : 0)};

  ${(p) => {
    if (p.inShortcut && p.limitWidth !== false)
      return css`
        width: ${typeof p.limitWidth === "number"
          ? `${p.limitWidth}px`
          : `calc(${p.theme.components.filters.defaultWidth} - ${p.theme.spacing(6)})`};
      `;
    return null;
  }}
`;
