import { keyframes } from "@emotion/react";

import { motionTokens as defaultMotionTokens } from "./defaultTheme";

export interface ThemeMotionTokens {
  duration0: string;
  duration50: string;
  duration100: string;
  duration150: string;
  duration200: string;
  duration250: string;
  duration300: string;
  duration350: string;
  duration400: string;
  duration450: string;
  duration500: string;
  duration5000: string;
  keyframeFadeIn: string;
  keyframeSpin: string;
  transformEase: string;
  transformEaseInOut: string;
}

export interface ThemeMotion extends ThemeMotionTokens {}

export type ThemeMotionInput = Partial<ThemeMotionTokens>;

export function createMotion(options: ThemeMotionInput): ThemeMotion {
  const tokens = {
    ...defaultMotionTokens,
    ...options,
  } as ThemeMotion;

  // transform to keyframe name
  tokens.keyframeFadeIn = keyframes(tokens.keyframeFadeIn);
  tokens.keyframeSpin = keyframes(tokens.keyframeSpin);

  return tokens;
}
