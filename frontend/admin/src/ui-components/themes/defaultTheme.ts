import type { ThemeColorTokens } from "./createColors";
import type {
  ThemeComponentBadgeTokens,
  ThemeComponentDataTableTokens,
  ThemeComponentIndexTableTokens,
  ThemeComponentNavigationTokens,
  ThemeComponentRangeSliderTokens,
  ThemeComponentScrollBarTokens,
  ThemeComponentToastTokens,
  ThemeComponentToggleButtonTokens,
  ThemeComponentTooltipTokens,
} from "./createComponents";
import type { ThemeMotionTokens } from "./createMotion";
import type { ThemeShadowTokens } from "./createShadow";
import type { ThemeShapeTokens } from "./createShape";
import type { ThemeTypographyTokens } from "./createTypography";

const colors = {
  light0: "#FFFFF",
  lightGray: "#F4F4F4",
  ghostWhite: "#F4F6F8",
  black20: "#DEDFE1",

  grey100: "#f6f6f7",
  grey110: "#f1f2f3",
  grey120: "#edeeef",

  ink0: "#FFFFFF",
  ink5: "#F3F4F5",
  ink20: "#EEEFEF",
  ink30: "#E8EAEB",
  ink40: "#A3A8AF",
  ink60: "#747C87",
  ink80: "#46515F",
  ink100: "#0F1824",
  blackStroke: "#D3D5D7",
  blackMagic: "#3d2800",
  bordeaux: "#490B1C",

  blue5: "#F2F9FF",
  blue10: "#E6F4FF",
  blue15: "#D9EDFF",
  blue20: "#CCE7FF",
  blue40: "#99CFFF",
  blue60: "#66B8FF",
  blue80: "#33A0FF",
  blue100: "#0088FF",
  blue120: "#007CE8", // blue focus on figma
  blueGradient: "linear-gradient(65.71deg, #0088FF 28.29%, #33A0FF 97.55%)",
  royalBlue: "#5364FE",
  vistaBlue: "#92E6B5",

  green5: "#F3FCF9",
  green10: "#E7FBF3",
  green15: "#DBF8ED",
  green20: "#CFF6E7",
  green40: "#9FEDCF",
  green60: "#6FE3B6",
  green80: "#3FDA9E",
  green100: "#0FD186",
  green120: "#0DB473",
  greenGradient: "linear-gradient(62.06deg, #0FD186 25.88%, #3FDA9E 100%)",
  darkGreen: "#002F19",
  deepTeal: "#002D2D",

  yellow5: "#FFFBF2",
  yellow10: "#FFF7E7",
  yellow15: "#FFF3DA",
  yellow20: "#FFEFCD",
  yellow40: "#FFDF9B",
  yellow60: "#FFCE6A",
  yellow80: "#FFBE38",
  yellow100: "#FFAE06",
  yellow120: "#E49C06",
  yellowGradient: "linear-gradient(66.01deg, #FFAE06 37.34%, #FFBE38 101.09%)",
  gambogeOrange: "#E49C06",
  grandis: "#FFC96B",

  red5: "#FFF6F6",
  red10: "#FFEEEE",
  red15: "#FFE5E5",
  red20: "#FFDBDB",
  red40: "#FFB8B8",
  red60: "#FF9494",
  red80: "#FF7070",
  red100: "#FF4D4D",
  red120: "#EE4747",
  redGradient: "linear-gradient(64.1deg, #FF4D4D 22.64%, #FF7070 102.8%)",
  crimsonRed: "#EE4747",
  darkRed: "#4F0E1F",

  lavenderMist: "#EEF2FD",
  midnightBlue: "rgba(24, 37, 55, 0.4)",
  melon: "#FFC4B0",
  riptide: "#91E0D6",
  pink: "#FDC9D0",

  /** Sử dụng cho Navigation scoll bar menu */
  menu100: "#2B4263",
  /** Sử dụng cho Navigation hover */
  menu200: "#243041",
  /** Sử dụng cho BG Navigation */
  menu300: "#182537",
};

export const colorTokens: ThemeColorTokens = {
  background: "#f9f9f9",
  backgroundHoverred: colors.grey110,
  backgroundSelected: colors.grey120,
  backgroundPressed: colors.grey120,
  backgroundStrong: colors.grey120,
  surface: colors.ink0,
  surfaceDark: colors.blue100,
  surfaceHovered: colors.ink5,
  surfaceDisabled: colors.ink5,
  surfaceSubdued: colors.ink5,
  surfacePressed: colors.ink20,
  surfaceSelected: colors.blue5,
  surfaceSelectedHovered: colors.blue10,
  surfaceSelectedPressed: colors.blue5,
  surfaceNeutral: colors.ink20,
  surfaceNeutralHovered: colors.blackStroke,
  surfaceNeutralSuccess: colors.green5,
  surfaceNeutralCritical: colors.red5,
  surfaceNeutralInfo: colors.blue5,
  surfaceNeutralWarning: colors.yellow10,
  surfaceSuccess: colors.green5,
  surfaceHighlight: colors.blue5,
  surfaceAttention: colors.yellow5,
  surfaceWarning: colors.yellow5,
  surfaceCritical: colors.red5,
  surfaceCriticalSubdued: colors.red10,
  surfaceCriticalSubduedHovered: colors.red15,
  surfaceCriticalSubduedPressed: colors.red20,
  surfacePrimarySelected: colors.blue20,
  surfacePrimarySelectedHovered: colors.blue10,
  surfacePrimarySelectedPressed: colors.blue40,

  backdrop: "rgba(0, 0, 0, 0.5)",

  actionPrimary: colors.blue100,
  actionPrimaryHovered: colors.blue80,
  actionPrimaryPressed: colors.blue120,
  textOnPrimary: colors.ink0,

  actionPrimaryOutline: colors.ink0,
  actionPrimaryOutlineHovered: colors.blue5,
  actionPrimaryOutlinePressed: colors.blue10,

  textPrimary: colors.blue100,
  textPrimaryHovered: colors.blue80,
  textPrimaryPressed: colors.blue120,

  actionSecondary: colors.ink0,
  actionSecondaryHovered: colors.ink5,
  actionSecondaryPressed: colors.ink20,

  actionCritical: colors.red100,
  actionCriticalHovered: colors.red80,
  actionCriticalPressed: colors.red120,
  actionCriticalDisabled: colors.red60,

  actionCriticalOutline: colors.ink0,
  actionCriticalOutlineHovered: colors.red5,
  actionCriticalOutlinePressed: colors.red10,

  textOnCritical: colors.ink0,
  textCritical: colors.red120,

  textWarning: colors.yellow120,
  textSuccess: colors.green120,
  textHighlight: colors.blue120,

  interactive: colors.blue100,
  interactiveHovered: colors.blue80,
  interactivePressed: colors.blue120,
  interactivePressedOnDark: colors.blue60,

  interactiveCritical: colors.red100,
  interactiveCriticalHovered: colors.red80,
  interactiveCriticalPressed: colors.red120,

  text: colors.ink100,
  textDisabled: colors.ink60,
  textSubdued: colors.ink60,
  textSlim: colors.ink80,
  textPlaceholder: colors.ink40,
  borderSubdued: colors.blackStroke,
  borderDisabled: colors.ink30,
  borderDisabledDarker: colors.black20,
  border: colors.blackStroke,
  borderDarker: colors.ink40,
  borderNeutralSubdued: colors.blackStroke,
  borderHovered: colors.ink60,
  divider: colors.ink30,
  dividerDark: colors.ink30,

  icon: colors.ink40,
  iconPressed: colors.ink80,
  iconHovered: colors.ink60,
  iconSubdued: colors.ink30,
  iconDisabled: colors.ink30,
  iconSuccess: colors.green120,
  iconCritical: colors.red120,
  iconWarning: colors.yellow120,
  iconHighlight: colors.blue120,

  borderSuccess: colors.green120,
  borderWarning: colors.yellow120,
  borderCritical: colors.red120,
  borderInformation: colors.blue120,
  borderHighlight: colors.blue40,
  borderInteractiveFocus: colors.blue100,

  decorativeOneText: "#66511E",
  decorativeTwoText: "#762424",
  decorativeThreeText: "#1F622E",
  decorativeFourText: "#244F76",
  decorativeFiveText: "#482476",

  decorativeOneSurface: "#FFE9B2",
  decorativeTwoSurface: "#FFB2B2",
  decorativeThreeSurface: "#BEF4CA",
  decorativeFourSurface: "#B2DAFF",
  decorativeFiveSurface: "#D7B8FF",
  decorativeSixSurface: colors.blue60,
} as ThemeColorTokens;

export const shapeTokens: ThemeShapeTokens = {
  borderRadius05: "2px",
  borderRadius1: "4px",
  borderRadius2: "8px",
  borderRadius3: "12px",
  borderRadius4: "16px",
  borderRadius5: "20px",
  borderRadius6: "30px",
  borderRadiusFull: "9999px",
  borderRadiusBase: "6px",
  borderRadiusLarge: "8px",
  borderRadiusHalf: "50%",
  borderWidth1: "1px",
  borderWidth2: "2px",
  borderWidth3: "3px",
  borderWidth4: "4px",
  borderWidth5: "5px",
  borderBase: `1px solid ${colorTokens.borderSubdued}`,
  borderDark: `1px solid ${colorTokens.border}`,
  borderTransparent: "1px solid transparent",
  borderDivider: `1px solid ${colorTokens.divider}`,
  borderDividerOnDark: `1px solid ${colorTokens.dividerDark}`,
};

export const shadowTokens: ThemeShadowTokens = {
  shadowTransparent: "0 0 0 0 transparent",
  shadowFaint: "0 1px 0 0 rgba(22, 29, 37, 0.05)",
  shadowBase: "0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15)",
  shadowDeep: "0 0 0 1px rgba(6, 44, 82, 0.1), 0 2px 16px rgba(33, 43, 54, 0.08)",
  shadowButton: "0 1px 0 rgba(0, 0, 0, 0.05)",
  shadowTopBar: "0 2px 2px -1px rgba(0, 0, 0, 0.15)",
  shadowCard: "0px 1px 3px 1px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
  shadowPopover: "0 3px 6px -3px rgba(23, 24, 24, 0.08), 0 8px 20px -4px rgba(23, 24, 24, 0.12)",
  shadowLayer: "0 31px 41px 0 rgba(32, 42, 53, 0.2), 0 2px 16px 0 rgba(32, 42, 54, 0.08)",
  shadowModal: "0 26px 80px rgba(0, 0, 0, 0.2), 0 0px 1px rgba(0, 0, 0, 0.2)",
  shadowInsetButton: "inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
  shadowInsetButtonPressed: "inset 0 1px 0 rgba(0, 0, 0, 0.15)",
  shadowPageAction: "0px 2px 4px rgba(168, 168, 168, 0.25)",
  shadowTopBarSearchPopover: "-4px 4px 20px 0px rgba(168, 168, 168, 0.50);",
};

export const motionTokens: ThemeMotionTokens = {
  duration0: "0ms",
  duration50: "50ms",
  duration100: "100ms",
  duration150: "150ms",
  duration200: "200ms",
  duration250: "250ms",
  duration300: "300ms",
  duration350: "350ms",
  duration400: "400ms",
  duration450: "450ms",
  duration500: "500ms",
  duration5000: "5000ms",
  keyframeFadeIn: "to { opacity: 1 }",
  keyframeSpin: "to { transform: rotate(1turn) }",
  transformEase: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  transformEaseInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
};

export const typographyTokens: ThemeTypographyTokens = {
  fontFamilySans:
    "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontFamilyMono: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
  fontSize75: "0.75rem",
  fontSize100: "0.875rem",
  fontSize200: "1rem",
  fontSize300: "1.25rem",
  fontSize350: "1.375rem",
  fontSize400: "1.5rem",
  fontSize500: "1.75rem",
  fontSize600: "2rem",
  fontSize700: "2.5rem",
  fontWeightLight: 300,
  fontWeightRegular: 450,
  fontWeightMedium: 550,
  fontWeightSemiBold: 600,
  fontWeightBold: 600,
  fontLineHeight1: "1rem",
  fontLineHeight2: "1.25rem",
  fontLineHeight3: "1.5rem",
  fontLineHeight4: "1.75rem",
  fontLineHeight5: "2rem",
  fontLineHeight6: "2.5rem",
  fontLineHeight7: "3rem",
};

export const navigationTokens: ThemeComponentNavigationTokens = {
  backgroundColor: colors.menu300,
  backgroundHoveredColor: colors.menu200,
  backgroundPressedColor: colors.menu100,
  backgroundSelectedColor: colors.menu100,
  textColor: colors.ink20,
  textSelectedColor: colors.ink20,
  textDisabledColor: colors.ink60,
  textSecondarySelectedColor: colors.blue60,
  iconColor: colors.ink40,
  iconSelectedColor: colors.ink20,
  dividerColor: colors.ink80,
};

export const toastTokens: ThemeComponentToastTokens = {
  iconColor: colors.ink0,
  backgroundCriticalColor: colors.red120,
  backgroundColor: colors.blue100,
  backgroundSuccessColor: colors.green120,
  textPrimaryColor: colors.ink0,
  transformHeight: "150px",
};

export const toggleButtonTokens: ThemeComponentToggleButtonTokens = {
  backgroundSwitchOn: colors.blue20,
  backgroundSwitchOff: colors.ink30,
  backgroundSliderRoundOff: colors.ink60,
  backgroundSliderRoundOn: colors.blue100,
  backgroundSwitchDisabled: colors.ink30,
  backgroundSliderRoundDisabled: colors.black20,
  backgroundSliderRoundCheckedDisabled: colors.ink40,
  shadowSliderRound: "0px 2px 4px rgba(168, 168, 168, 0.25)",
};

export const scrollBarTokens: ThemeComponentScrollBarTokens = {
  scrollBarTrackColor: colors.ink20,
  scrollBarThumbColor: colors.ink40,
  scrollBarThumbHoverColor: colors.ink40,
};

export const badgeTokens: ThemeComponentBadgeTokens = {
  textColor: colors.ink60,
  borderColor: colors.blackStroke,
  backgroundColor: colors.ink5,
  textSuccessColor: colors.green120,
  borderSuccessColor: colors.green40,
  backgroundSuccessColor: colors.green5,
  textWarningColor: colors.gambogeOrange,
  borderWarningColor: colors.yellow40,
  backgroundWarningColor: colors.yellow5,
  textCriticalColor: colors.red120,
  borderCriticalColor: colors.red40,
  backgroundCriticalColor: colors.red5,
  textHighlightColor: colors.blue120,
  borderHighlightColor: colors.blue40,
  backgroundHighlightColor: colors.blue5,
  textNewColor: colors.ink0,
  borderNewColor: "transparent",
  backgroundNewColor: colors.red120,
};

export const indexTableTokens: ThemeComponentIndexTableTokens = {
  headerBackgroundColor: colors.ghostWhite,
  translateOffset: "35px",
};

export const dataTableTokens: ThemeComponentDataTableTokens = {
  zebraBackgroundColor: colors.ghostWhite,
  firstColumnMaxWidth: "145px",
};

export const tooltipTokens: ThemeComponentTooltipTokens = {
  backgroundColor: colors.menu200,
  textColor: "#ffffff",
  borderColor: colors.menu100,
};

export const rangeSliderTokens: ThemeComponentRangeSliderTokens = {
  trackColor: colors.blue10,
  runnableTrackColor: colors.blue100,
  thumbOutlineColor: "rgba(204, 231, 255, 0.5)",
  thumbColor: colors.blue100,
  disabledRunnableTrackColor: colors.ink40,
  disabledThumbColor: colors.ink40,
  disabledTrackColor: colors.ink20,
};
