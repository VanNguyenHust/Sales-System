import { ThemeBreakpoints } from "./createBreakpoints";
import { ThemeColors } from "./createColors";
import { ThemeComponents } from "./createComponents";
import { ThemeMotion } from "./createMotion";
import { ThemeShadow } from "./createShadow";
import { ThemeShape } from "./createShape";
import { ThemeSpacing } from "./createSpacing";
import { ThemeTypography } from "./createTypography";
import { ThemeZIndex } from "./createZIndex";

export { type BorderRadiusAliasOrScale } from "./createShape";
export type { BorderWidthScale, SpaceScale } from "./createSpacing";

/**
 * Sapo theme
 */
export interface Theme {
  name: string;
  isDark: boolean;
  isLight: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  shape: ThemeShape;
  zIndex: ThemeZIndex;
  shadow: ThemeShadow;
  motion: ThemeMotion;
  typography: ThemeTypography;
  components: ThemeComponents;
}

export type ColorBackgroundAlias =
  | "bg"
  | "bg-hoverred"
  | "bg-pressed"
  | "bg-selected"
  | "bg-strong"
  | "bg-surface"
  | "bg-surface-subdued"
  | "bg-surface-disabled"
  | "bg-surface-hovered"
  | "bg-surface-pressed"
  | "bg-surface-selected"
  | "bg-surface-selected-hovered"
  | "bg-surface-selected-pressed"
  | "bg-surface-success"
  | "bg-surface-critical"
  | "bg-surface-warning"
  | "bg-surface-highlight"
  | "bg-surface-neutral"
  | "bg-surface-neutral-hovered"
  | "bg-surface-neutral-disabled"
  | "bg-surface-neutral-subdued"
  | "bg-surface-neutral-critical"
  | "bg-surface-neutral-success"
  | "bg-surface-neutral-warning"
  | "bg-surface-neutral-info";

export type ColorTextAlias =
  | "text"
  | "text-disabled"
  | "text-subdued"
  | "text-slim"
  | "text-primary"
  | "text-success"
  | "text-critical"
  | "text-warning"
  | "text-highlight";

export type ColorBorderAlias =
  | "border"
  | "border-subdued"
  | "border-warning"
  | "border-success"
  | "border-critical"
  | "border-information"
  | "border-highlight"
  | "border-hovered"
  | "border-disabled";

export type ShadowAliasOrScale = "card" | "modal" | "popover" | "base" | "button" | "transparent";
