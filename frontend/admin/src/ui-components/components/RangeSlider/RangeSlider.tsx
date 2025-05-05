import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import type { Action, Error } from "../../types";
import { useUniqueId } from "../../utils/uniqueId";
import { HelpIndicatorProps } from "../HelpIndicator";
import { Labelled, LabelledProps } from "../Labelled";

export interface RangeSliderProps {
  /** Giá trị của Slider */
  value?: number;
  /** Callback nếu value của Slider thay đổi */
  onChange?(value: number): void;
  /** Nội dung label */
  label?: React.ReactNode;
  /** Hành động của label */
  labelAction?: Action;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Thông tin mô tả form Slider */
  helpText?: string;
  /** Thuộc tính role cho Slider */
  role?: string;
  /** Lỗi hiển thị bên dưới Slider */
  error?: Error | boolean;
  /** Tên của Slider */
  name?: string;
  /** Giá trị tối thiểu của Slider
   * @default 0
   */
  min?: number;
  /** Giá trị tối đa của Slider
   * @default 100
   */
  max?: number;
  /** Bước nhảy của Slider
   * @default 1
   */
  step?: number;
  /** Id của Slider */
  id?: string;
  /** Trạng thái disabled của Slider */
  disabled?: boolean;
  /** Phần tử trước giá trị */
  prefix?: React.ReactNode;
  /** Phần tử sau giá trị */
  suffix?: React.ReactNode;
}
/**
 * Sử dụng để tạo thanh trượt có giới hạn
 */
export const RangeSlider = ({
  id: idProp,
  value,
  label,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  name,
  role,
  error,
  suffix,
  prefix,
  helpText,
  labelAction,
  labelTooltip,
}: RangeSliderProps) => {
  const id = useUniqueId("RangeSlider", idProp);
  const sliderRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const valueColor = disabled
    ? theme.components.rangeSlider.disabledRunnableTrackColor
    : error
    ? theme.colors.interactiveCritical
    : theme.components.rangeSlider.runnableTrackColor;
  const availableColor = disabled
    ? theme.components.rangeSlider.disabledTrackColor
    : error
    ? theme.colors.surfaceCritical
    : theme.components.rangeSlider.trackColor;

  const handleChangeSliderColor = useCallback(() => {
    if (sliderRef.current) {
      const sValue = Number(sliderRef.current.value) || 0;
      sliderRef.current.style.background = `linear-gradient(to right, ${valueColor} 0%, ${valueColor}
        ${((sValue - min) / (max - min)) * 100}%
        , ${availableColor} ${((sValue - min) / (max - min)) * 100}%, ${availableColor} 100%)`;
    }
  }, [availableColor, max, min, valueColor]);

  useEffect(() => {
    handleChangeSliderColor();
  }, [handleChangeSliderColor]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(Number(e.target.value) || 0);
    }
  };

  const prefixMarkup = prefix ? <StyledPrefix>{prefix}</StyledPrefix> : null;
  const suffixMarkup = suffix ? <StyledSuffix>{suffix}</StyledSuffix> : null;

  const labelledProps: LabelledProps = {
    id,
    label,
    action: labelAction,
    labelTooltip,
    helpText,
    error,
  };

  const inputProps: any = {
    disabled,
    type: "range",
    ref: sliderRef,
    id,
    name,
    min,
    max,
    step,
    value,
    role,
    error,
    onChange: handleChange,
    onInput: handleChangeSliderColor,
  };

  return (
    <Labelled {...labelledProps}>
      <StyledWrapper>
        {prefixMarkup}
        <StyledInput {...inputProps} />
        {suffixMarkup}
      </StyledWrapper>
    </Labelled>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ error?: boolean }>`
  z-index: ${(p) => p.theme.zIndex.input};
  width: 100%;
  outline: none;
  border: none;
  appearance: none;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background-color: ${(p) => p.theme.components.rangeSlider.trackColor};
  &::-webkit-slider-runnable-track {
    height: ${(p) => p.theme.spacing(1)};
    color: ${(p) => p.theme.components.rangeSlider.runnableTrackColor};
  }
  &::-webkit-slider-thumb {
    appearance: none;
    ${(p) => css`
      margin-top: calc(${p.theme.spacing(1)} / 2 - ${p.theme.spacing(3)} / 2);
    `};
    height: ${(p) => p.theme.spacing(3)};
    width: ${(p) => p.theme.spacing(3)};
    border-radius: ${(p) => p.theme.shape.borderRadius("half")};
    outline: 0px solid ${(p) => p.theme.components.rangeSlider.thumbOutlineColor};
    outline-offset: -1px;
    transition: outline-width 150ms ease-in;
  }
  ${(p) =>
    p.disabled
      ? css`
          &::-webkit-slider-thumb {
            background-color: ${p.theme.components.rangeSlider.disabledThumbColor};
            outline: none;
          }
          cursor: not-allowed;
        `
      : css`
          &::-webkit-slider-thumb {
            background-color: ${p.error
              ? p.theme.colors.interactiveCritical
              : p.theme.components.rangeSlider.thumbColor};
            &:hover {
              outline-width: calc(${p.theme.spacing(1)} + ${p.theme.spacing(0.5)});
            }
            &:active {
              outline-width: ${p.theme.spacing(2)};
            }
          }
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        `}
`;

const StyledPrefix = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  flex: 0 0 auto;
  user-select: none;
  margin-right: ${(p) => p.theme.spacing(2)};
`;

const StyledSuffix = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  flex: 0 0 auto;
  user-select: none;
  margin-left: ${(p) => p.theme.spacing(2)};
`;
