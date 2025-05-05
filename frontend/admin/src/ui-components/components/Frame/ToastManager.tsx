import React, { createRef, memo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import { useDeepCallback } from "../../utils/useDeepCallback";
import { useDeepEffect } from "../../utils/useDeepEffect";
import { Portal } from "../Portals";

import { Toast, ToastProps } from "./Toast";

const TOAST_TRANSLATE_IN = "--ui-toast-manager-translate-y-in";
const TOAST_TRANSLATE_OUT = "--ui-toast-manager-translate-y-out";

export interface ToastID {
  id: string;
}
export type ToastPropsWithID = ToastProps & ToastID;

export interface ToastManagerProps {
  toastMessages: ToastPropsWithID[];
}
export const ToastManager = memo(function ToastManager({ toastMessages }: ToastManagerProps) {
  const toastNodes: React.RefObject<HTMLDivElement | null>[] = [];
  const theme = useTheme();

  const updateToasts = useDeepCallback(() => {
    let targetInPos = 0;
    toastMessages.forEach((_, index) => {
      const currentToast = toastNodes[index];
      if (!currentToast.current) return;
      targetInPos += currentToast.current.clientHeight;
      currentToast.current.style.setProperty(TOAST_TRANSLATE_IN, `-${targetInPos}px`);
      currentToast.current.style.setProperty(
        TOAST_TRANSLATE_OUT,
        `calc(${-targetInPos}px + ${theme.components.toast.transformHeight})`
      );
    });
  }, [toastMessages, toastNodes]);

  useDeepEffect(() => {
    updateToasts();
  }, [toastMessages]);

  const toastsMarkup = toastMessages.map((toast, index) => {
    const toastNode = createRef<HTMLDivElement | null>();
    toastNodes[index] = toastNode;

    return (
      <StyledCSSTransition
        nodeRef={toastNodes[index]}
        key={toast.id}
        timeout={{ enter: 0, exit: 400 }}
        classNames="Toast"
      >
        <div ref={toastNode}>
          <Toast {...toast} />
        </div>
      </StyledCSSTransition>
    );
  });

  return (
    <Portal idPrefix="toastManager">
      <StyledToastManager>
        <TransitionGroup component={null}>{toastsMarkup}</TransitionGroup>
      </StyledToastManager>
    </Portal>
  );
});

const StyledToastManager = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.toast};
  right: ${(p) => p.theme.spacing(0)};
  left: ${(p) => p.theme.spacing(0)};
  text-align: center;
  bottom: ${(p) => p.theme.spacing(16)};
  display: flex;
  flex-direction: column;
  align-items: center;
  ${TOAST_TRANSLATE_OUT}: ${(p) => p.theme.components.toast.transformHeight};
  ${TOAST_TRANSLATE_IN}: 0;
`;

const StyledCSSTransition = styled(CSSTransition)`
  position: absolute;
  display: inline-flex;
  opacity: 0;
  transition: transform ${(p) => p.theme.motion.duration400} ease,
    opacity ${(p) => p.theme.motion.duration400} ${(p) => p.theme.motion.transformEase};
  transform: translateY(var(${TOAST_TRANSLATE_OUT}));
  &.Toast-enter,
  &.Toast-exit {
    opacity: 0;
    transform: translateY(var(${TOAST_TRANSLATE_OUT}));
  }
  &.Toast-enter-done {
    opacity: 1;
    transform: translateY(var(${TOAST_TRANSLATE_IN}));
  }
`;
