export type BreakpointsKey = keyof ThemeBreakpointTokens;

export type BreakpointsDirection = "up" | "down" | "only";

export interface BreakpointsTokenGroup extends Record<BreakpointsDirection, (key: BreakpointsKey) => string> {}

export interface BreakpointsValues {
  values: { [key in BreakpointsKey]: number };
  keys: BreakpointsKey[];
  directions: BreakpointsDirection[];
  unit: string;
  tokenGroups: BreakpointsTokenGroup;
}

const values: BreakpointsValues["values"] = {
  xs: 0,
  sm: 490,
  md: 768,
  lg: 1040,
  xl: 1440,
};

const keys: BreakpointsValues["keys"] = ["xs", "sm", "md", "lg", "xl"];
const directions: BreakpointsValues["directions"] = ["up", "down", "only"];
const unit: BreakpointsValues["unit"] = "px";
const step = 1;

export const breakpointsValues: BreakpointsValues = {
  values,
  keys,
  directions,
  unit,
  tokenGroups: {
    up: (key) => `(min-width:${values[key]}${unit})`,
    down: (key) => `(max-width:${values[key] - step}${unit})`,
    only: (key) => `(width:${values[key]}${unit})`,
  },
};

export interface ThemeBreakpointTokens {
  /** Phones */
  xs: string;
  /** Small tablets */
  sm: string;
  /** Tablets */
  md: string;
  /** Laptops */
  lg: string;
  /** Desktops */
  xl: string;
}

export interface ThemeBreakpoints {
  values: ThemeBreakpointTokens;
  up: (key: BreakpointsKey) => string;
  down: (key: BreakpointsKey) => string;
  only: (key: BreakpointsKey) => string;
}

export function createBreakpoints(): ThemeBreakpoints {
  return {
    values: {
      xs: `${values.xs}${unit}`,
      sm: `${values.sm}${unit}`,
      md: `${values.md}${unit}`,
      lg: `${values.lg}${unit}`,
      xl: `${values.xl}${unit}`,
    },
    up: (key) => `@media ${breakpointsValues.tokenGroups.up(key)}`,
    down: (key) => `@media ${breakpointsValues.tokenGroups.down(key)}`,
    only: (key) => `@media ${breakpointsValues.tokenGroups.only(key)}`,
  };
}
