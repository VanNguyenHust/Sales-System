import React from "react";

import { Button, ButtonProps } from "../components/Button";
import { ComplexAction } from "../types";

export function buttonsFrom(action: ComplexAction, overrides?: Partial<ButtonProps>): React.ReactElement<ButtonProps>;
export function buttonsFrom(
  actions: ComplexAction[],
  overrides?: Partial<ButtonProps>
): React.ReactElement<ButtonProps>[];
export function buttonsFrom(actions: ComplexAction[] | ComplexAction, overrides: Partial<ButtonProps> = {}) {
  if (Array.isArray(actions)) {
    return actions.map((action, index) => buttonFrom(action, overrides, index));
  } else {
    const action = actions;
    return buttonFrom(action, overrides);
  }
}

export function buttonFrom(
  { content, onAction, ...action }: ComplexAction,
  overrides?: Partial<ButtonProps>,
  key?: any
) {
  const primary = action.destructive === undefined ? overrides?.primary : false;
  return (
    <Button key={key} onClick={onAction} {...action} {...overrides} primary={primary}>
      {content}
    </Button>
  );
}
