import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "@emotion/styled";

import { layer } from "../../utils/shared";
import { useEventListener } from "../../utils/useEventListener";
import { Backdrop } from "../Backdrop";
import { Portal } from "../Portals";
import { TrapFocus } from "../TrapFocus";

export interface SheetProps {
  /** Có mở Sheet */
  open: boolean;
  /** Nội dung trong Sheet */
  children: React.ReactNode;
  /** Callback khi đóng Sheet */
  onClose(): void;
  /** Callback khi Sheet được mở hoàn toàn */
  onEntered?(): void;
  /** Callback khi Sheet bắt đầu thoát */
  onExit?(): void;
  /** ARIA label cho Sheet */
  accessibilityLabel?: string;
}

/**
 * Sheet xuất hiện từ cạnh của màn hình được dùng để cung cấp hành động/thông tin bổ trợ cho trang
 * */
export function Sheet({ open, children, accessibilityLabel, onClose, onEntered, onExit }: SheetProps) {
  const containerNode = useRef<HTMLDivElement>(null);

  useEventListener("keyup", (event: KeyboardEvent) => {
    if (event.code === "Escape" && open) {
      onClose();
    }
  });

  return (
    <Portal idPrefix="sheet">
      <CSSTransition
        appear
        in={open}
        nodeRef={containerNode}
        timeout={200}
        mountOnEnter
        unmountOnExit
        classNames="fadeRight"
        onEntered={onEntered}
        onExit={onExit}
      >
        <StyledContainer ref={containerNode} {...layer.props}>
          <TrapFocus trapping={open}>
            <StyledSheet role="dialog" aria-label={accessibilityLabel} tabIndex={-1}>
              <StyledWrapper>{children}</StyledWrapper>
            </StyledSheet>
          </TrapFocus>
        </StyledContainer>
      </CSSTransition>
      {open ? <Backdrop onClick={onClose} /> : null}
    </Portal>
  );
}

const StyledContainer = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.modal};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  will-change: transform, opacity;

  &.fadeRight-enter,
  &.fadeRight-appear {
    opacity: 0;
    transform: translateY(100%);
  }
  &.fadeRight-enter-active,
  &.fadeRight-appear-active {
    opacity: 1;
    transform: translateY(0);
    transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
  }
  &.fadeRight-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.fadeRight-exit-done,
  &.fadeRight-exit-active {
    opacity: 0;
    transform: translateY(100%);
    transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
  }

  ${(p) => p.theme.breakpoints.up("sm")} {
    left: auto;
    width: ${(p) => p.theme.components.filters.defaultWidth};
    &.fadeRight-enter,
    &.fadeRight-appear {
      opacity: 0;
      transform: translateX(100%);
    }
    &.fadeRight-enter-active,
    &.fadeRight-appear-active {
      opacity: 1;
      transform: translateX(0);
      transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
    }
    &.fadeRight-exit {
      opacity: 1;
      transform: translateX(0);
    }
    &.fadeRight-exit-done,
    &.fadeRight-exit-active {
      opacity: 0;
      transform: translateX(100%);
      transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
    }
  }
`;

const StyledSheet = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &:focus {
    outline: 0;
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  box-shadow: ${(p) => p.theme.shadow.popover};
  background-color: ${(p) => p.theme.colors.surface};
`;
