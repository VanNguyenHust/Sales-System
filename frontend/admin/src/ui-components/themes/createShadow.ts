import { shadowTokens as defaultShadowTokens } from "./defaultTheme";

export interface ThemeShadowTokens {
  shadowTransparent: string;
  shadowFaint: string;
  shadowBase: string;
  shadowDeep: string;
  shadowButton: string;
  shadowTopBar: string;
  shadowCard: string;
  shadowPopover: string;
  shadowLayer: string;
  shadowModal: string;
  shadowInsetButton: string;
  shadowInsetButtonPressed: string;
  shadowPageAction: string;
  shadowTopBarSearchPopover: string;
}

export interface ThemeShadow {
  transparent: string;
  faint: string;
  base: string;
  deep: string;
  button: string;
  topBar: string;
  card: string;
  popover: string;
  layer: string;
  modal: string;
  insetButton: string;
  insetButtonPressed: string;
  pageAction: string;
  topBarSearchPopover: string;
}

export type ThemeShadowInput = Partial<ThemeShadowTokens>;

export function createShadow(options: ThemeShadowInput): ThemeShadow {
  const tokens = {
    ...defaultShadowTokens,
    ...options,
  };
  return {
    transparent: tokens.shadowTransparent,
    base: tokens.shadowBase,
    faint: tokens.shadowFaint,
    deep: tokens.shadowDeep,
    button: tokens.shadowButton,
    topBar: tokens.shadowTopBar,
    card: tokens.shadowCard,
    popover: tokens.shadowPopover,
    layer: tokens.shadowLayer,
    modal: tokens.shadowModal,
    insetButton: tokens.shadowInsetButton,
    insetButtonPressed: tokens.shadowInsetButtonPressed,
    pageAction: tokens.shadowPageAction,
    topBarSearchPopover: tokens.shadowTopBarSearchPopover,
  };
}
