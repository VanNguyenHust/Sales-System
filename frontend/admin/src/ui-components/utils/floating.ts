import { autoPlacement, flip, offset, type Placement, shift, useFloating } from "@floating-ui/react";

import { PreferredAlignment, PreferredPosition } from "../types";

type FloatingOptions = NonNullable<Parameters<typeof useFloating>[0]>;
type Middleware = NonNullable<FloatingOptions["middleware"]>[number];

type Options = {
  preferredAlignment: PreferredAlignment;
  preferredPosition: PreferredPosition;
  arrowMiddleware?: Middleware;
  hideMiddleware?: Middleware;
  sizeMiddleware: Middleware;
  topBarOffset?: number;
};

export function getFloatingOptions({
  preferredAlignment,
  preferredPosition,
  arrowMiddleware,
  sizeMiddleware,
  hideMiddleware,
  topBarOffset,
}: Options) {
  const shiftMiddleware = shift({
    padding: 8,
  });
  return preferredPosition !== "mostSpace"
    ? {
        placement: getPlacement(preferredPosition, preferredAlignment),
        middleware: [
          offset(6),
          flip(() => ({
            crossAxis: false,
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
          })),
          shiftMiddleware,
          hideMiddleware ?? null,
          arrowMiddleware ?? null,
          sizeMiddleware,
        ],
      }
    : {
        middleware: [
          offset(6),
          shiftMiddleware,
          hideMiddleware ?? null,
          autoPlacement(() => ({
            allowedPlacements: getAutoAllowedPlacements(preferredAlignment),
            rootBoundary: {
              x: 0,
              y: 0,
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight,
            },
          })),
          arrowMiddleware ?? null,
          sizeMiddleware,
        ],
      };
}

function getPlacement(position: PreferredPosition, alignment: PreferredAlignment): Placement | undefined {
  switch (position) {
    case "above":
      switch (alignment) {
        case "left":
          return "top-start";
        case "right":
          return "top-end";
        default:
          return "top";
      }
    case "below":
      switch (alignment) {
        case "left":
          return "bottom-start";
        case "right":
          return "bottom-end";
        default:
          return "bottom";
      }
    default:
      return undefined;
  }
}

function getAutoAllowedPlacements(alignment: PreferredAlignment): Placement[] {
  switch (alignment) {
    case "left":
      return ["top-start", "bottom-start"];
    case "right":
      return ["top-end", "bottom-end"];
    default:
      return ["top", "bottom"];
  }
}
