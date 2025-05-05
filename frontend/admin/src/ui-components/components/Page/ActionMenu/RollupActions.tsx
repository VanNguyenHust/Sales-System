import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { MoreHorizontalIcon } from "@/ui-icons";

import { ActionListItemDescriptor, ActionListSection } from "../../../types";
import { useToggle } from "../../../utils/useToggle";
import { ActionList } from "../../ActionList";
import { Button } from "../../Button";
import { Popover } from "../../Popover";

export interface RollupActionsProps {
  items?: ActionListItemDescriptor[];
  sections?: ActionListSection[];
}

export function RollupActions({ items = [], sections = [] }: RollupActionsProps) {
  const { value: isOpenPopover, toggle: togglePopover, setFalse: closePopover } = useToggle(false);

  if (items.length === 0 && sections.length === 0) {
    return null;
  }

  const activatorMarkup = (
    <StyledMoreButton pressed={isOpenPopover}>
      <Button icon={MoreHorizontalIcon} onClick={togglePopover} />
    </StyledMoreButton>
  );

  return (
    <Popover
      active={isOpenPopover}
      activator={activatorMarkup}
      preferredAlignment="right"
      onClose={closePopover}
      hideOnPrint
    >
      <ActionList items={items} sections={sections} onActionAnyItem={closePopover} />
    </Popover>
  );
}

const StyledMoreButton = styled.div<{
  pressed?: boolean;
}>`
  button {
    &:hover {
      background: ${(p) => p.theme.colors.backgroundHoverred};
    }
    ${(p) =>
      p.pressed &&
      css`
        background: ${p.theme.colors.surfacePressed};
        color: ${p.theme.colors.text};
      `}
  }
`;
