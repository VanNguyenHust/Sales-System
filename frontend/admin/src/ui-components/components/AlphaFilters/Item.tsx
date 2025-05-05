import React from "react";

import { isElementOfType, wrapWithComponent } from "../../utils/components";

import { Pane, PaneProps } from "./Pane";

export interface ItemProps
  extends Pick<PaneProps, "limitWidth" | "autofocusFirstNode" | "children" | "onScrolledToBottom"> {}

export function Item({ children, ...rest }: ItemProps) {
  const childrenArray = React.Children.toArray(children);
  if (isElementOfType(childrenArray[0], Pane)) {
    return childrenArray;
  }
  return wrapWithComponent(childrenArray, Pane, { ...rest, sectioned: true });
}
