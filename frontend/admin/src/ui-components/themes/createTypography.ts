import { typographyTokens as defaultTypographyTokens } from "./defaultTheme";

export interface ThemeTypographyTokens {
  fontFamilySans: string;
  fontFamilyMono: string;
  fontSize75: string;
  fontSize100: string;
  fontSize200: string;
  fontSize300: string;
  fontSize350: string;
  fontSize400: string;
  fontSize500: string;
  fontSize600: string;
  fontSize700: string;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  /** @deprecated Remove in future */
  fontWeightSemiBold: number;
  fontWeightBold: number;
  fontLineHeight1: string;
  fontLineHeight2: string;
  fontLineHeight3: string;
  fontLineHeight4: string;
  fontLineHeight5: string;
  fontLineHeight6: string;
  fontLineHeight7: string;
}

export interface ThemeTypography extends ThemeTypographyTokens {}

export type ThemeTypographyInput = Partial<ThemeTypographyTokens>;

export function createTypography(options: ThemeTypographyInput): ThemeTypography {
  const tokens = {
    ...defaultTypographyTokens,
    ...options,
  } as ThemeTypography;
  return tokens;
}
