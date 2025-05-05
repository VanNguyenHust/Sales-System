import React from "react";
import styled from "@emotion/styled";

import { ActionListSection, MenuActionDescriptor, MenuGroupDescriptor } from "../../../types";

import { Actions } from "./Actions";
import { RollupActions } from "./RollupActions";

export interface ActionMenuProps {
  actions?: MenuActionDescriptor[];
  groups?: MenuGroupDescriptor[];
  rollup?: boolean;
  onActionRollup?(hasRolledUp: boolean): void;
}

export function ActionMenu({ actions = [], groups = [], rollup, onActionRollup }: ActionMenuProps) {
  if (!actions.length && !groups.length) {
    return null;
  }
  let contentMarkup: JSX.Element;
  if (rollup) {
    const rollupSections = groups.map(convertGroupToSection);
    contentMarkup = <RollupActions items={actions} sections={rollupSections} />;
  } else {
    contentMarkup = <Actions actions={actions} groups={groups} onActionRollup={onActionRollup} />;
  }

  return <StyledActionMenu>{contentMarkup}</StyledActionMenu>;
}

const StyledActionMenu = styled.h1`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  @media print {
    display: none !important;
  }
`;

function convertGroupToSection({ title, actions, disabled }: MenuGroupDescriptor): ActionListSection {
  return {
    title,
    items: actions.map((action) => ({
      ...action,
      disabled: disabled || action.disabled,
    })),
  };
}
