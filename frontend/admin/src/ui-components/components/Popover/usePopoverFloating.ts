import { useContext, useMemo, useRef } from "react";
import { useTheme } from "@emotion/react";
import {
  arrow,
  autoUpdate,
  hide,
  type OpenChangeReason,
  size,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

import { PreferredAlignment, PreferredPosition } from "../../types";
import { getFloatingOptions } from "../../utils/floating";
import { boundary, scrollable } from "../../utils/shared";
import { WithinContentTopBarContext } from "../Frame/context";

type Options = {
  open?: boolean;
  onClose?(reason?: OpenChangeReason): void;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fluidContent?: boolean;
  preferredAlignment: PreferredAlignment;
  preferredPosition: PreferredPosition;
  arrow?: boolean;
  fixed?: boolean;
};

type FloatingReturn = ReturnType<typeof useFloating>;
type UseInteractionsReturn = ReturnType<typeof useInteractions>;

type UsePopoverFloatingReturn = FloatingReturn & {
  arrowRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  getFloatingProps: UseInteractionsReturn["getFloatingProps"];
};

export function usePopoverFloating({
  preferredPosition,
  preferredAlignment,
  fullHeight,
  fullWidth,
  fluidContent,
  open,
  onClose,
  arrow: arrowProp,
  fixed,
}: Options): UsePopoverFloatingReturn {
  const theme = useTheme();
  const arrowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const withinContentTopBar = useContext(WithinContentTopBarContext);
  const topBarOffset = useMemo(
    () => (withinContentTopBar ? parseInt(theme.components.topBar.height) : undefined),
    [theme.components.topBar.height, withinContentTopBar]
  );

  const floating: FloatingReturn = useFloating<HTMLDivElement>({
    open,
    onOpenChange: (open, _, reason) => {
      if (!open) {
        onClose?.(reason);
      }
    },
    whileElementsMounted: autoUpdate,
    strategy: fixed ? "fixed" : "absolute",
    ...getFloatingOptions({
      topBarOffset,
      preferredAlignment,
      preferredPosition,
      sizeMiddleware: size(
        () => ({
          padding: topBarOffset
            ? {
                top: topBarOffset,
              }
            : undefined,
          rootBoundary: {
            x: 0,
            y: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          },
          apply({ availableHeight, availableWidth, elements }) {
            if (!contentRef.current) {
              return;
            }
            const margin = 16;
            const border = 1;
            availableWidth -= margin * 2 + border * 2;
            availableHeight -= margin + border;
            if (fluidContent) {
              contentRef.current.style.maxHeight = `${availableHeight}px`;
              contentRef.current.style.maxWidth = `${availableWidth}px`;
            } else {
              contentRef.current.style.maxHeight = `${
                fullHeight ? availableHeight : Math.min(availableHeight, theme.components.popover.maxHeight)
              }px`;
              contentRef.current.style.maxWidth = fullWidth
                ? ""
                : `${Math.min(availableWidth, theme.components.popover.maxWidth)}px`;
              contentRef.current.style.width = fullWidth
                ? `${Math.min(elements.reference.getBoundingClientRect().width, availableWidth)}px`
                : "";
            }
          },
        }),
        [fullWidth, fullHeight, fluidContent]
      ),
      arrowMiddleware: arrowProp ? arrow({ element: arrowRef }) : null,
      hideMiddleware: hide((state) => {
        const boundary = getBoundaryElementNode(state.elements.reference as Element);
        const layoutViewport = {
          x: 0,
          y: 0,
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        };
        return {
          boundary: boundary ? boundary : layoutViewport,
          padding:
            !boundary && topBarOffset
              ? {
                  top: topBarOffset,
                }
              : undefined,
          rootBoundary: layoutViewport,
        };
      }),
    }),
  });

  const dismiss = useDismiss(floating.context);

  const { getFloatingProps } = useInteractions([dismiss]);
  return {
    ...floating,
    arrowRef,
    contentRef,
    getFloatingProps,
  };
}

function getBoundaryElementNode(node: Element) {
  return node.closest(`${boundary.selector},${scrollable.selector}`);
}
