import React, { ElementType, SyntheticEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import styled from "@emotion/styled";
import {
  arrow,
  autoUpdate,
  safePolygon,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  type UseHoverProps,
  useInteractions,
} from "@floating-ui/react";

import { ThemeSpacingArgument } from "../../themes/createSpacing";
import { useTheme } from "../../themes/ThemeContext";
import { PreferredPosition } from "../../types";
import { getFloatingOptions } from "../../utils/floating";
import { findFirstFocusableNode, findFirstFocusableNodeIncludingDisabled } from "../../utils/focus";
import { focusRing } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { getZIndexForLayerFromNode } from "../../utils/zIndex";
import { WithinContentTopBarContext } from "../Frame/context";
import { StyledArrow } from "../Popover/StyledArrow";
import { Portal } from "../Portals";

export interface TooltipProps {
  /**Nội dung hiển thị trong tooltip */
  content: React.ReactNode;
  /**Thành phần kích hoạt tooltip*/
  children?: React.ReactNode;
  /** Ẩn tooltip ngay khi con trỏ di chuyển ra ngoài activator */
  dismissOnMouseOut?: boolean;
  /**Mặc định hiển thị tooltip */
  active?: boolean;
  /**Độ trễ khi hiện tooltip theo milliseconds */
  hoverDelay?: number;
  /**
   * Toolip và activator được bọc bởi
   * @default "span"
   * */
  activatorWrapper?: string;
  /**
   * Vị trí tooltip khi xuẩt hiện
   * @default "above"
   * */
  preferredPosition?: PreferredPosition;
  /**Nó là khoảng trống giữa đường viền tooltip nội dung bên trong */
  padding?: ThemeSpacingArgument;
  /**
   * Độ rộng của tooltip
   * @default "default"
   * */
  width?: "default" | "wide";
  /** Giữ cho tooltip mở sau khi click vào activator */
  persistOnClick?: boolean;
  /**Hành động khi hiện tooltip */
  onOpen?: () => void;
  /**Hành động khi ẩn tooltip */
  onClose?: () => void;
  /** Override z-index mặc định (519) */
  zIndexOverride?: number;
}

const bubbleHandlerKeys: { [key: string]: string } = {
  onPointerDown: "pointerdown",
  onPointerEnter: "pointerenter",
  onKeyDown: "keydown",
  onMouseDown: "mousedown",
  onMouseUp: "mouseup",
  onMouseMove: "mousemove",
  onMouseLeave: "mouseleave",
  onFocus: "focus",
  onBlur: "blur",
  onClick: "click",
};

const captureHandlerKeys: { [key: string]: string } = {
  onPointerDownCapture: "pointerdown",
  onMouseDownCapture: "mousedown",
  onClickCapture: "click",
};

/**
 * Tooltip là những nhãn hiển thị nổi giải thích ngắn gọn chức năng của một phần tử giao diện người dùng
 */
export function Tooltip({
  active: activeProp,
  children,
  content,
  dismissOnMouseOut,
  hoverDelay,
  onOpen,
  onClose,
  padding = 2,
  persistOnClick,
  activatorWrapper = "span",
  preferredPosition = "above",
  width = "default",
  zIndexOverride,
}: TooltipProps) {
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [activatorNode, setActivatorNode] = useState<HTMLElement>();
  const [isOpen, setOpen] = useState(Boolean(activeProp));
  const id = useUniqueId("Tooltip");
  const refClicked = useRef(false);

  const theme = useTheme();
  const withinContentTopBar = useContext(WithinContentTopBarContext);
  const topBarOffset = useMemo(
    () => (withinContentTopBar ? parseInt(theme.components.topBar.height) : undefined),
    [theme.components.topBar.height, withinContentTopBar]
  );
  const arrowRef = useRef<HTMLDivElement>(null);
  const { refs, context, floatingStyles, middlewareData, placement, isPositioned } = useFloating<HTMLDivElement>({
    open: isOpen,
    onOpenChange: (open, _, reason) => {
      setOpen(open);
      if (open) {
        onOpen?.();
      } else {
        refClicked.current = false;
        onClose?.();
        if (activatorNode && reason === "escape-key") {
          const focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode);
          if (focusableActivator) {
            focusableActivator.focus();
          }
        }
      }
    },
    whileElementsMounted: autoUpdate,
    strategy: "absolute",
    ...getFloatingOptions({
      preferredAlignment: "center",
      preferredPosition,
      sizeMiddleware: size(
        () => ({
          rootBoundary: {
            x: 0,
            y: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          },
          apply({ availableWidth, elements }) {
            const margin = 8;
            const border = 1;
            availableWidth -= margin * 2 + border * 2;
            const configWidth =
              width === "wide" ? theme.components.tooltip.maxWidth.wide : theme.components.tooltip.maxWidth.default;
            elements.floating.style.maxWidth = `${Math.min(availableWidth, configWidth)}px`;
          },
        }),
        [width]
      ),
      arrowMiddleware: arrow({ element: arrowRef }),
      topBarOffset,
    }),
  });

  const dismiss = useDismiss(context);

  const closeFn = useMemo((): NonNullable<UseHoverProps["handleClose"]> => {
    const safePolygonCloseFn = safePolygon();
    const fn: NonNullable<UseHoverProps["handleClose"]> = (args) => {
      const safePolyMouseMove = safePolygonCloseFn(args);
      return function onMouseMove(event) {
        if (!persistOnClick || !refClicked.current) {
          if (dismissOnMouseOut) {
            args.onClose();
          } else {
            safePolyMouseMove(event);
          }
        }
      };
    };

    fn.__options = {
      blockPointerEvents: false,
    };
    return fn;
  }, [dismissOnMouseOut, persistOnClick]);

  const hover = useHover(context, {
    enabled: activeProp !== false,
    move: false,
    delay: hoverDelay
      ? {
          open: hoverDelay,
        }
      : undefined,
    handleClose: closeFn,
  });
  const focus = useFocus(context, {
    enabled: activeProp !== false,
  });
  const { getFloatingProps, getReferenceProps } = useInteractions([hover, focus, dismiss]);

  const handleSetReference = (node: HTMLElement | null) => {
    let activatorNode = node;
    if (node && node.firstElementChild && node.firstElementChild instanceof HTMLElement) {
      activatorNode = node.firstElementChild;
    }
    if (activatorNode) {
      setActivatorNode(activatorNode);
      refs.setReference(activatorNode);
    }
    if (refs.domReference.current) {
      setZIndex(getZIndexForLayerFromNode(refs.domReference.current));
    }
  };

  useEffect(() => {
    const refProps = getReferenceProps();
    const eventMap: {
      [key: string]: {
        handler: any;
        capture?: boolean;
      };
    } = {};
    for (const reactEventName in refProps) {
      const handler = toReactEvent(refProps[reactEventName] as any);
      if (reactEventName in bubbleHandlerKeys) {
        const eventName = bubbleHandlerKeys[reactEventName];
        eventMap[eventName] = {
          handler,
        };
        refs.domReference.current?.addEventListener(eventName, eventMap[eventName].handler);
      } else if (reactEventName in captureHandlerKeys) {
        const eventName = captureHandlerKeys[reactEventName];
        eventMap[eventName] = { handler, capture: true };
        refs.domReference.current?.addEventListener(
          eventName,
          eventMap[eventName].handler,
          eventMap[eventName].capture
        );
      }
    }

    const toggleClicked = () => {
      refClicked.current = !refClicked.current;
    };
    refs.domReference.current?.addEventListener("click", toggleClicked);
    return () => {
      for (const eventName in eventMap) {
        refs.domReference.current?.removeEventListener(
          eventName,
          eventMap[eventName].handler,
          eventMap[eventName].capture
        );
      }
      refs.domReference.current?.removeEventListener("click", toggleClicked);
    };
  }, [getReferenceProps, refs.domReference]);

  useEffect(() => {
    if (activeProp === false) {
      setOpen(false);
    }
  }, [activeProp]);

  useEffect(() => {
    const firstFocusable = refs.domReference.current ? findFirstFocusableNode(refs.domReference.current) : null;
    const accessibilityNode = firstFocusable || refs.domReference.current;

    if (!accessibilityNode) return;

    accessibilityNode.tabIndex = 0;
    accessibilityNode.setAttribute("aria-describedby", id);
    accessibilityNode.setAttribute("data-ui-tooltip-activator", "true");
  }, [id, refs.domReference]);

  let overlay: JSX.Element | undefined = undefined;
  if (isOpen) {
    const arrowMarkup = (
      <StyledArrow
        ref={arrowRef}
        tooltip
        style={{
          top: middlewareData.arrow?.y,
          left: middlewareData.arrow?.x,
        }}
        placement={placement}
      />
    );
    overlay = (
      <StyledTooltipOverlay
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: zIndexOverride ?? zIndex,
          opacity: !isPositioned ? 0 : undefined,
        }}
        {...getFloatingProps()}
        tabIndex={undefined}
      >
        {arrowMarkup}
        <StyledTooltipContent role="tooltip" id={id} $padding={padding}>
          {content}
        </StyledTooltipContent>
      </StyledTooltipOverlay>
    );
  }

  const portal = activatorNode ? <Portal idPrefix="tooltip">{overlay}</Portal> : null;

  return (
    <StyledTooltipWrapper ref={handleSetReference} as={activatorWrapper as ElementType}>
      {children}
      {portal}
    </StyledTooltipWrapper>
  );
}

function toReactEvent(handler: any) {
  return (event: SyntheticEvent) => {
    if (!event.nativeEvent) {
      event.nativeEvent = event as unknown as Event;
    }
    handler?.(event);
  };
}

const StyledTooltipWrapper = styled.div`
  &[data-ui-tooltip-activator],
  [data-ui-tooltip-activator] {
    outline: 0;
    ${(p) => focusRing(p.theme)}

    &:focus-visible {
      ${(p) => focusRing(p.theme, { style: "focused" })}
    }
  }
`;

const StyledTooltipOverlay = styled.div`
  z-index: ${(p) => p.theme.zIndex.popover};
`;

const StyledTooltipContent = styled.div<{
  $padding: ThemeSpacingArgument;
}>`
  position: relative;
  border: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.components.tooltip.borderColor};
  box-shadow: ${(p) => p.theme.shadow.popover};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background: ${(p) => p.theme.components.tooltip.backgroundColor};
  word-break: break-word;
  color: ${(p) => p.theme.components.tooltip.textColor};
  padding: ${(p) => p.theme.spacing(p.$padding)};
`;
