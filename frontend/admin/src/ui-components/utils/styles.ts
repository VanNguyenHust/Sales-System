import { css } from "@emotion/react";

import type { ThemeColors } from "../themes/createColors";
import { ColorBackgroundAlias, ColorBorderAlias, ColorTextAlias, Theme } from "../themes/types";

export const unstyledButton = css`
  appearance: none;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

export const visuallyHidden = css`
  position: absolute !important;
  top: 0;
  width: 1px !important;
  height: 1px !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip-path: inset(50%) !important;
  border: 0 !important;
  white-space: nowrap !important;
`;

type FocusRingOption = {
  size?: "base" | "wide";
  style?: "base" | "focused";
  borderWidth?: string | number;
};

export const focusRing = (theme: Theme, options?: FocusRingOption) => {
  const { size = "base", style = "base", borderWidth = 0 } = options || {};
  const focusRingOffset = borderWidth === 0 || borderWidth === "0" ? "-1px" : `calc(-1 * calc(${borderWidth} + 1px))`;
  if (style === "base") {
    return css`
      position: relative;
      &::after {
        content: "";
        position: absolute;
        z-index: 1;
        top: ${focusRingOffset};
        right: ${focusRingOffset};
        bottom: ${focusRingOffset};
        left: ${focusRingOffset};
        display: block;
        pointer-events: none;
        box-shadow: 0 0 0 ${focusRingOffset} ${theme.colors.borderInteractiveFocus};
        border-radius: ${size === "wide" ? theme.shape.borderRadius("large") : theme.shape.borderRadius("base")};
      }
    `;
  } else {
    return css`
      &::after {
        box-shadow: 0 0 0 0.125rem ${theme.colors.borderInteractiveFocus};
        outline: ${theme.shape.borderWidth(1)} solid transparent;
      }
    `;
  }
};

export const noFocusRing = css`
  &::after {
    content: none;
  }
`;

export const backgroundColorMap: { [key in ColorBackgroundAlias]: keyof ThemeColors } = {
  bg: "background",
  "bg-hoverred": "backgroundHoverred",
  "bg-pressed": "backgroundPressed",
  "bg-selected": "backgroundSelected",
  "bg-strong": "backgroundStrong",
  "bg-surface": "surface",
  "bg-surface-subdued": "surfaceSubdued",
  "bg-surface-disabled": "surfaceDisabled",
  "bg-surface-hovered": "surfaceHovered",
  "bg-surface-pressed": "surfacePressed",
  "bg-surface-selected": "surfaceSelected",
  "bg-surface-selected-hovered": "surfaceSelectedHovered",
  "bg-surface-selected-pressed": "surfaceSelectedPressed",
  "bg-surface-success": "surfaceSuccess",
  "bg-surface-critical": "surfaceCritical",
  "bg-surface-warning": "surfaceWarning",
  "bg-surface-highlight": "surfaceHighlight",
  "bg-surface-neutral": "surfaceNeutral",
  "bg-surface-neutral-hovered": "surfaceNeutralHovered",
  "bg-surface-neutral-disabled": "surfaceNeutralDisabled",
  "bg-surface-neutral-subdued": "surfaceNeutralSubdued",
  "bg-surface-neutral-critical": "surfaceNeutralCritical",
  "bg-surface-neutral-success": "surfaceNeutralSuccess",
  "bg-surface-neutral-info": "surfaceNeutralInfo",
  "bg-surface-neutral-warning": "surfaceNeutralWarning",
};

export const textColorMap: { [key in ColorTextAlias]: keyof ThemeColors } = {
  text: "text",
  "text-disabled": "textDisabled",
  "text-subdued": "textSubdued",
  "text-slim": "textSlim",
  "text-primary": "textPrimary",
  "text-success": "textSuccess",
  "text-critical": "textCritical",
  "text-warning": "textWarning",
  "text-highlight": "textHighlight",
};

export const borderColorMap: { [key in ColorBorderAlias]: keyof ThemeColors } = {
  border: "border",
  "border-subdued": "borderSubdued",
  "border-warning": "borderWarning",
  "border-success": "borderSuccess",
  "border-critical": "borderCritical",
  "border-information": "borderInformation",
  "border-highlight": "borderHighlight",
  "border-hovered": "borderHovered",
  "border-disabled": "borderDisabled",
};
