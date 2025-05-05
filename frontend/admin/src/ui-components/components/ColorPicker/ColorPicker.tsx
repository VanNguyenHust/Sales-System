import React, { useCallback, useMemo } from "react";
import { type RgbaColor, RgbaColorPicker, type RgbColor, RgbColorPicker } from "react-colorful";
import styled from "@emotion/styled";

import { Color, HSBAColor } from "./types";
import { hsbToRgb, rgbToHsb } from "./utils";

export interface ColorPickerProps {
  /** id của picker */
  id?: string;
  /** full chiều dài */
  fullWidth?: boolean;
  /** Cho phép người dùng chọn giá trị alpha */
  allowAlpha?: boolean;
  /** Giá trị màu */
  color: Color;
  /** Callback khi màu được chọn */
  onChange(color: HSBAColor): void;
}

/** Được dùng để chủ shop chọn màu sắc một cách trực quan */
export const ColorPicker = ({ id, allowAlpha, onChange, color: colorProp, fullWidth }: ColorPickerProps) => {
  const providedAlpha = allowAlpha && colorProp.alpha !== undefined ? colorProp.alpha : 1;
  const color = useMemo((): RgbaColor | RgbColor => {
    const rgb = hsbToRgb(colorProp);
    return {
      r: rgb.red,
      g: rgb.green,
      b: rgb.blue,
      a: allowAlpha ? providedAlpha : undefined,
    };
  }, [colorProp, allowAlpha, providedAlpha]);

  const handleChange = useCallback(
    (value: RgbaColor | RgbColor) => {
      const selectedAlpha = (value as RgbaColor).a;
      const alpha = allowAlpha && selectedAlpha !== undefined ? selectedAlpha : providedAlpha;
      const { hue, saturation, brightness } = rgbToHsb({
        red: value.r,
        green: value.g,
        blue: value.b,
      });
      onChange({
        hue,
        saturation,
        brightness,
        alpha,
      });
    },
    [allowAlpha, onChange, providedAlpha]
  );

  const pickerMarkup = allowAlpha ? (
    <RgbaColorPicker color={color as RgbaColor} onChange={handleChange} />
  ) : (
    <RgbColorPicker color={color} onChange={handleChange} />
  );

  return (
    <StyledColorPicker fullWidth={fullWidth} id={id}>
      {pickerMarkup}
    </StyledColorPicker>
  );
};

const StyledColorPicker = styled.div<{
  fullWidth?: boolean;
}>`
  display: flex;
  user-select: none;
  .react-colorful {
    cursor: pointer;
    width: ${(p) => (p.fullWidth ? "100%" : "10rem")};
    height: 10rem;
  }
  .react-colorful__pointer {
    width: 1.125rem;
    height: 1.125rem;
  }
`;
