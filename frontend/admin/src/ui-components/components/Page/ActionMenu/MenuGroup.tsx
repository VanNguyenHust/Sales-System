import React, { useCallback } from "react";

import { ActionListSection, MenuGroupDescriptor } from "../../../types";
import { ActionList } from "../../ActionList";
import { Popover } from "../../Popover";

import { SecondaryAction } from "./SecondaryAction";

type Props = MenuGroupDescriptor & {
  active?: boolean;
  onClick?(openActions: () => void): void;
  onOpen(title: string): void;
  onClose(title: string): void;
  sections?: ActionListSection[];
};

export function MenuGroup({ active, disabled, title, icon, actions, sections, onClose, onOpen, onClick }: Props) {
  const handleClose = useCallback(() => {
    onClose(title);
  }, [onClose, title]);

  const handleOpen = useCallback(() => {
    onOpen(title);
  }, [onOpen, title]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(handleOpen);
    } else {
      handleOpen();
    }
  }, [onClick, handleOpen]);

  return (
    <Popover
      active={Boolean(active)}
      activator={
        <SecondaryAction icon={icon} disabled={disabled} disclosure onClick={handleClick} pressed={Boolean(active)}>
          {title}
        </SecondaryAction>
      }
      onClose={handleClose}
      hideOnPrint
      preferredAlignment="center"
    >
      <ActionList items={actions} sections={sections} onActionAnyItem={handleClose} />
    </Popover>
  );
}
