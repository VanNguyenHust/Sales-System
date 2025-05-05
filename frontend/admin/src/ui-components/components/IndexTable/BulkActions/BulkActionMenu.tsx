import React from "react";

import { MenuGroupDescriptor } from "../../../types";
import { useToggle } from "../../../utils/useToggle";
import { ActionList } from "../../ActionList";
import { Popover } from "../../Popover";

import { BulkActionButton } from "./BulkActionButton";

export interface BulkActionsMenuProps extends MenuGroupDescriptor {}

export function BulkActionMenu({ title, actions }: BulkActionsMenuProps) {
  const { value: isVisible, toggle: toggleMenuVisibility } = useToggle(false);

  return (
    <Popover
      active={isVisible}
      activator={<BulkActionButton disclosure onAction={toggleMenuVisibility} content={title} />}
      onClose={toggleMenuVisibility}
      preferInputActivator
    >
      <ActionList items={actions} onActionAnyItem={toggleMenuVisibility} />
    </Popover>
  );
}
