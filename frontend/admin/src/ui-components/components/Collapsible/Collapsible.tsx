import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface Transition {
  /** Khoảng thời gian animation. */
  duration?: string;
  /** Kiểu animation. */
  timingFunction?: string;
}

export interface CollapsibleProps {
  /** Id của collapsible. */
  id?: string;
  /** Cho phép hiển thị nội dung bên trong khi in hay không */
  expandOnPrint?: boolean;
  /** State quản lý trạng thái đóng/mở. */
  open: boolean;
  /** Animation khi đóng/mở. Khi set bằng false hoặc không truyền vào đối tượng Transition sẽ không có animation. */
  transition?: boolean | Transition;

  /** Callback khi animation hoàn tất. */
  onAnimationEnd?(): void;

  /** Nội dung cần hiển thị. */
  children?: React.ReactNode;
}

type AnimationState = "idle" | "measuring" | "animating";

/**
 * Dùng để đặt phần thông tin dài trong một khối cho phép người dùng có thể thu gọn hoặc mở rộng
 */
export function Collapsible({
  id,
  expandOnPrint,
  open,
  transition = true,
  children,
  onAnimationEnd,
}: CollapsibleProps) {
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(open);
  const [animationState, setAnimationState] = useState<AnimationState>("idle");
  const containerRef = useRef<HTMLDivElement>(null);

  const isFullyOpen = animationState === "idle" && open && isOpen;
  const isFullyClosed = animationState === "idle" && !open && !isOpen;
  const content = expandOnPrint || !isFullyClosed ? children : null;

  const transitionDisabled = isTransitionDisabled(transition);

  const transitionStyles =
    typeof transition === "object"
      ? {
          transitionDuration: transition.duration,
          transitionTimingFunction: transition.timingFunction,
        }
      : undefined;

  const styles: CSSProperties = {
    ...transitionStyles,
    maxHeight: isFullyOpen ? "none" : `${height}px`,
    overflow: isFullyOpen ? "visible" : "hidden",
  };

  const handleCompleteAnimation = useCallback(
    ({ target }: React.TransitionEvent<HTMLDivElement>) => {
      if (target === containerRef.current) {
        setAnimationState("idle");
        setIsOpen(open);
        onAnimationEnd && onAnimationEnd();
      }
    },
    [onAnimationEnd, open]
  );

  const startAnimation = useCallback(() => {
    if (transitionDisabled) {
      setIsOpen(open);
      setAnimationState("idle");

      if (open && containerRef.current) {
        setHeight(containerRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    } else {
      setAnimationState("measuring");
    }
  }, [open, transitionDisabled]);

  useEffect(() => {
    if (open !== isOpen) {
      startAnimation();
    }
    // startAnimation should only be fired if the open state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isOpen]);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    setHeight(containerRef.current.scrollHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    switch (animationState) {
      case "idle":
        break;
      case "measuring":
        setHeight(containerRef.current.scrollHeight);
        setAnimationState("animating");
        break;
      case "animating":
        setHeight(open ? containerRef.current.scrollHeight : 0);
    }
  }, [animationState, open, isOpen]);

  return (
    <StyledCollapsible
      id={id}
      isFullyClosed={isFullyClosed}
      style={styles}
      ref={containerRef}
      onTransitionEnd={handleCompleteAnimation}
      aria-hidden={!open}
    >
      {content}
    </StyledCollapsible>
  );
}

const StyledCollapsible = styled.div<{
  expandOnPrint?: boolean;
  isFullyClosed?: boolean;
  transition?: boolean | Transition;
}>`
  padding-top: 0;
  padding-bottom: 0;
  transition-property: max-height;
  transition-duration: ${(p) => p.theme.motion.duration100};
  transition-timing-function: ${(p) => p.theme.motion.transformEaseInOut};
  overflow: hidden;
  ${(p) =>
    p.isFullyClosed &&
    css`
      display: none;
    `}
  ${(p) =>
    p.expandOnPrint &&
    css`
      @media print {
        max-height: none !important;
        overflow: visible;
        display: block;
      }
    `}
`;

const zeroDurationRegex = /^0(ms|s)$/;

function isTransitionDisabled(transitionProp: Transition | boolean) {
  if (typeof transitionProp === "boolean") {
    return !transitionProp;
  }

  const { duration } = transitionProp;
  if (duration && zeroDurationRegex.test(duration.trim())) {
    return true;
  }
  return false;
}
