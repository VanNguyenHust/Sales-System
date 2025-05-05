import type { BreakpointsKey } from "../themes/createBreakpoints";
import { Theme } from "../themes/types";

type ResponsivePropConfig<T = string> = {
  [Breakpoint in BreakpointsKey]?: T;
};

export type ResponsiveProp<T> = T | ResponsivePropConfig<T>;

export function getResponsiveStyle<T>(
  theme: Theme,
  cssProp: keyof React.CSSProperties,
  responsiveValue: ResponsiveProp<T> | undefined | null,
  valueTransformer?: (value: T) => string | number
): any {
  if (responsiveValue === null || responsiveValue === undefined) {
    return;
  }
  const transformer = valueTransformer ?? defaultValueTransfomer;
  if (isResponsiveValue(responsiveValue)) {
    return Object.fromEntries(
      Object.entries(responsiveValue).map(([breakpoint, breakpointValue]) => [
        theme.breakpoints.up(breakpoint as BreakpointsKey),
        {
          [cssProp]: transformer(breakpointValue),
        },
      ])
    );
  }
  return {
    [cssProp]: transformer(responsiveValue),
  };
}

function isResponsiveValue<T>(value: ResponsiveProp<T>): value is ResponsivePropConfig<T> {
  return typeof value === "object" && !Array.isArray(value);
}

function defaultValueTransfomer<T>(value: T) {
  return value;
}

export function sanitizeCustomProperties(styles: React.CSSProperties): React.CSSProperties | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nonNullValues = Object.entries(styles).filter(([_, value]) => value !== null && value !== undefined);

  return nonNullValues.length ? Object.fromEntries(nonNullValues) : undefined;
}
