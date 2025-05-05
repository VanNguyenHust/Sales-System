/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/unified-signatures */

export type SpaceScale =
  | "0"
  | "025"
  | "05"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24"
  | "28"
  | "32";

export type BorderWidthScale = "0" | "025" | "05" | "1";

type ThemeSpacingKey = `space${SpaceScale}`;

type ThemeSpacingTokens = { [key in ThemeSpacingKey]: number };

const spacingMap = {
  0: "space0",
  0.25: "space025",
  0.5: "space05",
  1: "space1",
  2: "space2",
  3: "space3",
  4: "space4",
  5: "space5",
  6: "space6",
  8: "space8",
  10: "space10",
  12: "space12",
  16: "space16",
  20: "space20",
  24: "space24",
  28: "space28",
  32: "space32",
} as const;

const spacingStringMap: { [key in SpaceScale]: ThemeSpacingKey } = {
  "0": "space0",
  "025": "space025",
  "05": "space05",
  "1": "space1",
  "2": "space2",
  "3": "space3",
  "4": "space4",
  "5": "space5",
  "6": "space6",
  "8": "space8",
  "10": "space10",
  "12": "space12",
  "16": "space16",
  "20": "space20",
  "24": "space24",
  "28": "space28",
  "32": "space32",
};

export type ThemeSpacingOptions = Partial<ThemeSpacingTokens>;

export type ThemeSpacingArgument = keyof typeof spacingMap;

export interface ThemeSpacing {
  (): string;
  (value: ThemeSpacingArgument | SpaceScale): string;
  (topBottom: ThemeSpacingArgument | SpaceScale, rightLeft: ThemeSpacingArgument | SpaceScale): string;
  (
    top: ThemeSpacingArgument | SpaceScale,
    rightLeft: ThemeSpacingArgument | SpaceScale,
    bottom: ThemeSpacingArgument | SpaceScale
  ): string;
  (
    top: ThemeSpacingArgument | SpaceScale,
    right: ThemeSpacingArgument | SpaceScale,
    bottom: ThemeSpacingArgument | SpaceScale,
    left: ThemeSpacingArgument | SpaceScale
  ): string;
  scale(value: ThemeSpacingArgument | SpaceScale): number;
  borderWidthScale(value: BorderWidthScale): string;
}

function createDefaultTokens(unit = 4): ThemeSpacingTokens {
  const rs: { [key: string]: number } = {};
  const spacings = spacingMap as { [key: number]: string };
  for (const key in spacings) {
    const token = spacings[key];
    rs[token] = parseFloat(key) * unit;
  }
  return rs as any;
}

export function createSpacing(options: ThemeSpacingOptions = {}): ThemeSpacing {
  const tokens = {
    ...createDefaultTokens(),
    ...options,
  };
  const scale = (value: ThemeSpacingArgument | SpaceScale): number => {
    const scaleToken = typeof value === "string" ? spacingStringMap[value] : spacingMap[value];
    return tokens[scaleToken];
  };

  const spacing: ThemeSpacing = (...args: (ThemeSpacingArgument | SpaceScale)[]): string => {
    if (process.env.NODE_ENV !== "production") {
      if (!(args.length <= 4)) {
        console.error(`Too many arguments provided, expected between 0 and 4, got ${args.length}`);
      }
    }

    if (args.length === 0) {
      args[0] = 1;
    }

    return args.map((value) => `${scale(value)}px`).join(" ");
  };

  spacing.scale = scale;
  spacing.borderWidthScale = (value) => {
    return `${scale(value)}px`;
  };

  return spacing;
}
