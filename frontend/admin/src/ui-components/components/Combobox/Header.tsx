import React from "react";
import styled from "@emotion/styled";

import { isElementOfType, wrapWithComponent } from "../../utils/components";
import { Popover } from "../Popover";

import { HeaderItem } from "./HeaderItem";
import { HeaderSearch } from "./HeaderSearch";

export interface HeaderProps {
  /** Nội dung header */
  children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const itemMarkup = React.Children.map(children, (child) => {
    const shouldWrap = !isElementOfType(child, HeaderSearch);
    if (!shouldWrap) {
      return child;
    }
    return wrapWithComponent(child, HeaderItem, {} as HeaderProps);
  });
  return (
    <Popover.Pane>
      <StyledHeader>{itemMarkup}</StyledHeader>
    </Popover.Pane>
  );
}

const StyledHeader = styled.div``;
