import type { ThemeColorsMode } from "./createColors";
import { shapeTokens as defaultShapeTokens } from "./defaultTheme";

export interface ThemeShapeTokens {
  borderRadius05: string;
  borderRadius1: string;
  borderRadius2: string;
  borderRadius3: string;
  borderRadius4: string;
  borderRadius5: string;
  borderRadius6: string;
  borderRadiusFull: string;
  borderRadiusBase: string;
  borderRadiusLarge: string;
  borderRadiusHalf: string;

  borderWidth1: string;
  borderWidth2: string;
  borderWidth3: string;
  borderWidth4: string;
  borderWidth5: string;
  borderBase: string;
  borderDark: string;
  borderTransparent: string;
  borderDivider: string;
  borderDividerOnDark: string;
}

const borderRadiusMap = {
  0.5: "borderRadius05",
  1: "borderRadius1",
  2: "borderRadius2",
  3: "borderRadius3",
  4: "borderRadius4",
  5: "borderRadius5",
  6: "borderRadius6",
  "05": "borderRadius05",
  base: "borderRadiusBase",
  large: "borderRadiusLarge",
  half: "borderRadiusHalf",
  full: "borderRadiusFull",
} as const;

const borderWidthMap = {
  1: "borderWidth1",
  2: "borderWidth2",
  3: "borderWidth3",
  4: "borderWidth4",
  5: "borderWidth5",
} as const;

export type BorderRadiusAliasOrScale = "base" | "large" | "half" | "full" | "05" | "1" | "2" | "3" | "4" | "5" | "6";
export type ThemeBorderRadiusArgument = BorderRadiusAliasOrScale | keyof typeof borderRadiusMap;
export type ThemeBorderWidthArgument = keyof typeof borderWidthMap;

export interface ThemeShape {
  borderRadius: (value: ThemeBorderRadiusArgument) => string;
  borderWidth: (value: ThemeBorderWidthArgument) => string;
  /** Đường viền cơ bản */
  borderBase: string;
  borderTransparent: string;
  /** Đường viền ngăn cách giữa các element */
  borderDivider: string;
}

export type ThemeShapeInput = Partial<ThemeShapeTokens>;

export function createShape(mode: ThemeColorsMode, options: ThemeShapeInput): ThemeShape {
  const tokens = {
    ...defaultShapeTokens,
    ...options,
  };

  const { borderDark, borderDividerOnDark, ...withoutDarkTokens } = tokens;
  withoutDarkTokens.borderBase = mode === "dark" ? borderDark : withoutDarkTokens.borderBase;
  withoutDarkTokens.borderDivider = mode === "dark" ? borderDividerOnDark : withoutDarkTokens.borderDivider;

  const borderRadius = (value: ThemeBorderRadiusArgument) => {
    return withoutDarkTokens[borderRadiusMap[value]];
  };

  const borderWidth = (value: ThemeBorderWidthArgument) => {
    return withoutDarkTokens[borderWidthMap[value]];
  };

  return {
    borderRadius,
    borderWidth,
    borderBase: withoutDarkTokens.borderBase,
    borderTransparent: withoutDarkTokens.borderTransparent,
    borderDivider: withoutDarkTokens.borderDivider,
  };
}
