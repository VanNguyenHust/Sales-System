import { createBreakpoints } from "./createBreakpoints";
import { createColors, ThemeColorsInput } from "./createColors";
import { createComponents, ThemeComponentsInput } from "./createComponents";
import { createMotion, ThemeMotionInput } from "./createMotion";
import { createShadow, ThemeShadowInput } from "./createShadow";
import { createShape, ThemeShapeInput } from "./createShape";
import { createSpacing, ThemeSpacingOptions } from "./createSpacing";
import { createTypography, ThemeTypographyInput } from "./createTypography";
import { createZIndex } from "./createZIndex";
import { Theme } from "./types";

export interface ThemeInput {
  name?: string;
  colors?: ThemeColorsInput;
  spacing?: ThemeSpacingOptions;
  shape?: ThemeShapeInput;
  shadow?: ThemeShadowInput;
  motion?: ThemeMotionInput;
  typography?: ThemeTypographyInput;
  components?: ThemeComponentsInput;
}

export function createTheme(options: ThemeInput = {}): Theme {
  const {
    colors: colorsInput = {},
    spacing: spacingInput = {},
    shape: shapeInput = {},
    shadow: shadowInput = {},
    motion: motionInput = {},
    typography: typographyInput = {},
    components: componentsInput = {},
  } = options;

  const colors = createColors(colorsInput);
  const spacing = createSpacing(spacingInput);
  const breakpoints = createBreakpoints();
  const shape = createShape(colors.mode, shapeInput);
  const zIndex = createZIndex();
  const shadow = createShadow(shadowInput);
  const motion = createMotion(motionInput);
  const typography = createTypography(typographyInput);
  const components = createComponents(componentsInput);

  const theme: Theme = {
    name: options.name || colors.mode === "dark" ? "Dark" : "Light",
    isDark: colors.mode === "dark",
    isLight: colors.mode === "light",
    colors,
    spacing,
    breakpoints,
    shape,
    zIndex,
    shadow,
    motion,
    typography,
    components,
  };

  return theme;
}
