import React from "react";
import styled from "@emotion/styled";

import { unstyledButton } from "../../utils/styles";
import { ActionList, ActionListProps } from "../ActionList";
import { Popover } from "../Popover";

export interface MenuProps {
  /** Thành phần điều khiển Popover */
  activatorContent: React.ReactNode;
  /** Danh sách hành động trong Popover */
  actions: ActionListProps["sections"];
  /** Menu có đang mở hay không? */
  open: boolean;
  /** Hàm gọi lại mở menu */
  onOpen(): void;
  /** Hàm gọi lại đóng menu */
  onClose(): void;
}

export function Menu({ activatorContent, actions, open, onOpen, onClose }: MenuProps) {
  return (
    <Popover
      activator={
        <StyledActivator type="button" onClick={onOpen}>
          {activatorContent}
        </StyledActivator>
      }
      active={open}
      onClose={onClose}
      preferredAlignment="right"
    >
      <ActionList onActionAnyItem={onClose} sections={actions} />
    </Popover>
  );
}

const StyledActivator = styled.button`
  ${unstyledButton}
  padding: calc((${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(0.5)}) / 2) ${(p) => p.theme.spacing(2)};
  color: ${(p) => p.theme.colors.text};
  min-width: ${(p) => p.theme.components.form.controlHeight};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  &:hover {
    background: ${(p) => p.theme.colors.actionSecondaryHovered};
  }
  &:active,
  &[data-state="open"] {
    background: ${(p) => p.theme.colors.actionSecondaryPressed};
  }
  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;
