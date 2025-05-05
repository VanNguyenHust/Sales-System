import React, { useCallback, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { focusFirstFocusableNode } from "../../utils/focus";
import { boundary, layer } from "../../utils/shared";
import { useEventListener } from "../../utils/useEventListener";
import { useToggle } from "../../utils/useToggle";
import { WithinContentContext } from "../../utils/within-content";
import { TrapFocus } from "../TrapFocus";

import { DialogPositionedContext } from "./context";

export type ModalSize = "small" | "medium" | "large" | "extraLarge" | "fullScreen";
interface DialogProps {
  instant?: boolean;
  size: ModalSize;
  limitHeight?: boolean;
  children?: React.ReactNode;
  onClose?(): void;
}

export function Dialog({ instant, children, size, limitHeight, onClose, ...props }: DialogProps) {
  const containerNode = useRef<HTMLDivElement>(null);
  const { value: isPositioned, setTrue: setTruePositioned, setFalse: setFalsePositioned } = useToggle(true);

  const onPressEscape = useCallback(
    (event: KeyboardEvent) => {
      event.code === "Escape" && onClose?.();
    },
    [onClose]
  );

  useEventListener("keyup", onPressEscape);

  useEffect(() => {
    if (containerNode.current && !containerNode.current.contains(document.activeElement)) {
      focusFirstFocusableNode(containerNode.current);
    }
  }, []);

  const contentMarkup = (
    <StyledContainer ref={containerNode} {...layer.props}>
      <WithinContentContext.Provider value>
        <DialogPositionedContext.Provider value={isPositioned}>
          <TrapFocus>
            <StyledDialog tabIndex={-1}>
              <StyledModal size={size} limitHeight={limitHeight} {...boundary.props}>
                {children}
              </StyledModal>
            </StyledDialog>
          </TrapFocus>
        </DialogPositionedContext.Provider>
      </WithinContentContext.Provider>
    </StyledContainer>
  );

  return instant ? (
    contentMarkup
  ) : (
    <FadeUp
      {...props}
      nodeRef={containerNode}
      timeout={200}
      onEnter={setFalsePositioned}
      onEntered={setTruePositioned}
      mountOnEnter
      unmountOnExit
      classNames="fadeUp"
    >
      {contentMarkup}
    </FadeUp>
  );
}

const FadeUp = styled(CSSTransition)`
  &.fadeUp-enter,
  &.fadeUp-appear {
    opacity: 0;
    transform: translateY(50%);
  }
  &.fadeUp-enter-active,
  &.fadeUp-appear-active {
    opacity: 1;
    transform: translateY(0);
    transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
  }
  &.fadeUp-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.fadeUp-exit-active {
    opacity: 0;
    transform: translateY(50%);
    transition: transform ease ${(p) => p.theme.motion.duration200}, opacity ease ${(p) => p.theme.motion.duration200};
  }
`;

const StyledContainer = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.modal};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
  ${(p) => p.theme.breakpoints.up("md")} {
    justify-content: center;
  }
`;

const StyledDialog = styled.div`
  &:focus {
    outline: 0;
  }
`;

const StyledModal = styled.div<{
  size?: DialogProps["size"];
  limitHeight?: boolean;
}>`
  position: fixed;
  pointer-events: initial;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - ${(p) => p.theme.spacing(16)});
  background: ${(p) => p.theme.colors.surface};
  box-shadow: ${(p) => p.theme.shadow.modal};

  ${(p) => p.theme.breakpoints.down("md")} {
    bottom: 0;
    max-height: 100%;
  }

  ${(p) => p.theme.breakpoints.up("md")} {
    position: relative;
    margin: 0 auto;
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
    max-width: ${(p) => p.theme.components.modal.maxWidth};
  }

  ${(p) =>
    p.limitHeight &&
    css`
      ${p.theme.breakpoints.up("md")} {
        @media (min-height: 660px) {
          max-height: 600px;
        }
      }
    `}

  ${(p) => {
    switch (p.size) {
      case "small":
        return css`
          ${p.theme.breakpoints.up("sm")} {
            max-width: ${p.theme.components.modal.maxWidthSm};
            margin: 0 auto;
          }
        `;

      case "large":
        return css`
          ${p.theme.breakpoints.up("md")} {
            max-width: calc(100% - ${p.theme.spacing(16)});
          }

          ${p.theme.breakpoints.up("lg")} {
            max-width: ${p.theme.components.modal.maxWidthLg};
          }
        `;

      case "extraLarge":
        return css`
          ${p.theme.breakpoints.up("md")} {
            max-width: calc(100% - ${p.theme.spacing(16)});
          }

          ${p.theme.breakpoints.up("lg")} {
            max-width: ${p.theme.components.modal.maxWidthExtraLg};
          }
        `;

      case "fullScreen":
        return css`
          height: 100%;
          ${p.theme.breakpoints.up("md")} {
            height: unset;
          }
        `;
      default:
        return null;
    }
  }}
`;
