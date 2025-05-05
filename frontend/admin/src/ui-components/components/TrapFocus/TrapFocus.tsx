import React, { useEffect, useRef, useState } from "react";

import {
  findFirstKeyboardFocusableNode,
  findLastKeyboardFocusableNode,
  focusFirstFocusableNode,
  focusFirstKeyboardFocusableNode,
  focusLastKeyboardFocusableNode,
} from "../../utils/focus";
import { useFocusManager } from "../../utils/focus-manager";
import { portal } from "../../utils/shared";
import { useEventListener } from "../../utils/useEventListener";
import { Focus } from "../Focus";

export interface TrapFocusProps {
  trapping?: boolean;
  children?: React.ReactNode;
}

/** Sử dụng cho overlay component như Modal, Sheet, ... để duy trì tabIndex xung quanh overlay đó */
export function TrapFocus({ trapping = true, children }: TrapFocusProps) {
  const { canSafelyFocus } = useFocusManager({ trapping });
  const focusTrapWrapper = useRef<HTMLDivElement>(null);
  const [disableFocus, setDisableFocus] = useState(true);

  useEffect(() => {
    const disable =
      canSafelyFocus && !(focusTrapWrapper.current && focusTrapWrapper.current.contains(document.activeElement))
        ? !trapping
        : true;

    setDisableFocus(disable);
  }, [canSafelyFocus, trapping]);

  const handleFocusIn = (event: FocusEvent) => {
    const containerContentsHaveFocus =
      focusTrapWrapper.current && focusTrapWrapper.current.contains(document.activeElement);

    if (
      trapping === false ||
      !focusTrapWrapper.current ||
      containerContentsHaveFocus ||
      (event.target instanceof Element && event.target.matches(`${portal.selector} *`))
    ) {
      return;
    }

    if (
      canSafelyFocus &&
      event.target instanceof HTMLElement &&
      focusTrapWrapper.current !== event.target &&
      !focusTrapWrapper.current.contains(event.target)
    ) {
      focusFirstFocusableNode(focusTrapWrapper.current);
    }
  };

  const handleTab = (event: KeyboardEvent) => {
    if (event.key !== "Tab") {
      return;
    }
    if (trapping === false || !focusTrapWrapper.current) {
      return;
    }

    const firstFocusableNode = findFirstKeyboardFocusableNode(focusTrapWrapper.current);
    const lastFocusableNode = findLastKeyboardFocusableNode(focusTrapWrapper.current);

    if (event.target === lastFocusableNode && !event.shiftKey) {
      event.preventDefault();
      focusFirstKeyboardFocusableNode(focusTrapWrapper.current);
    }

    if (event.target === firstFocusableNode && event.shiftKey) {
      event.preventDefault();
      focusLastKeyboardFocusableNode(focusTrapWrapper.current);
    }
  };

  useEventListener("focusin", handleFocusIn);
  useEventListener("keydown", handleTab);

  return (
    <Focus disabled={disableFocus} root={focusTrapWrapper.current}>
      <div ref={focusTrapWrapper}>{children}</div>
    </Focus>
  );
}
