import React, { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { OffCloseIcon } from "@/ui-icons";

import type { Action, Error } from "../../types";
import { unstyledButton } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { useEventListener } from "../../utils/useEventListener";
import { useToggle } from "../../utils/useToggle";
import { HelpIndicatorProps } from "../HelpIndicator";
import { Icon } from "../Icon";
import { Labelled } from "../Labelled";

import { Connected } from "./Connected";
import { Resizer } from "./Resizer";
import { SegmentNumber, SegmentNumberProps } from "./SegmentNumber";

export interface TextFieldProps {
  /** id của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Giá trị ban đầu của TextField */
  value?: string;
  /** Kiểu của TextField */
  type?:
    | "text"
    | "email"
    | "integer"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "currency"
    | "date"
    | "datetime-local"
    | "month"
    | "time"
    | "week";
  /** Nội dung label */
  label?: React.ReactNode;
  /** Hành động của label */
  labelAction?: Action;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Thông tin mô tả form input */
  helpText?: string;
  /** Thuộc tính role cho input */
  role?: string;
  /** Lỗi hiển thị bên dưới TextField */
  error?: Error | boolean;
  /** Hiển thị thông tin input là bắt buộc */
  requiredIndicator?: boolean;
  /** Phần tử hiển thị bên trái input */
  connectedLeft?: React.ReactNode;
  /** Phần tử hiển thị bên phải input */
  connectedRight?: React.ReactNode;
  /**
   * Gộp các item lại với nhau
   * @default true
   * */
  connectedSegmented?: boolean;
  /** Phần tử trước giá trị */
  prefix?: React.ReactNode;
  /** Phần tử sau giá trị */
  suffix?: React.ReactNode;
  /** Cho phép nhập nhiều dòng */
  multiline?: boolean | number;
  /** Trạng thái disabled của TextField */
  disabled?: boolean;
  /** Trạng thái chỉ đọc của TextField */
  readOnly?: boolean;
  /** Tự động focus vào input của TextField */
  autoFocus?: boolean;
  /** Placeholder trong input của TextField */
  placeholder?: string;
  /**
   * Cho phép hoàn thành tự động bởi trình duyệt của TextField
   * @default "off"
   * */
  autoComplete?: string;
  /** Giới hạn giá trị tối đa của TextField. Chỉ hỗ trợ type = number */
  max?: number | string;
  /** Giới hạn số lượng kí tự tối đa của TextField */
  maxLength?: number;
  /** Chiều cao tối đa của input. Chỉ áp dụng khi `multiline` là `true` */
  maxHeight?: number | string;
  /** Giới hạn giá trị tối thiểu của TextField. Chỉ hỗ trợ type = number, date */
  min?: number | string;
  /** Giới hạn số lượng kí tự tối thiểu của TextField */
  minLength?: number;
  /** Bước nhảy cho kiểu number */
  step?: number;
  /** Biểu thức chính quy kiểm tra giá trị TextField */
  pattern?: string;
  /** Chọn bàn phím hiển thị trên thiết bị di động */
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  /** Buộc focus vào input của TextField */
  focused?: boolean;
  /** Tự động chọn text sau khi focused vào input */
  selectTextOnFocus?: boolean;
  /** Callback nếu input focused */
  onFocus?: (event?: React.FocusEvent) => void;
  /** Callback nếu input blur */
  onBlur?(event?: React.FocusEvent): void;
  /** Callback nếu giá trị value thay đổi */
  onChange?(value: string, id: string, formattedValue?: string): void;
  /** Bật bộ đếm ký tự */
  showCharacterCount?: boolean;
  /**
   * Căn text hiển thị trong input
   * @default "left"
   * */
  align?: "left" | "center" | "right";
  /**
   * Bỏ border, thường được dùng trong ô search trong popover
   * */
  borderless?: boolean;
  /** Có nút clear */
  clearButton?: boolean;
  /** Callback khi nút clear được click */
  onClearButtonClick?(id: string): void;
}

/**
 * Dùng để tạo ra các input text, number, currency, email....
 */
export function TextField({
  id: idProp,
  name,
  value,
  type = "text",
  label,
  labelAction,
  labelTooltip,
  helpText,
  role,
  error,
  requiredIndicator,
  prefix,
  suffix,
  multiline,
  disabled,
  readOnly,
  autoFocus,
  placeholder,
  autoComplete = "off",
  max,
  maxLength,
  maxHeight,
  min,
  minLength,
  pattern,
  step,
  inputMode,
  focused,
  selectTextOnFocus,
  onFocus,
  onBlur,
  onChange,
  align = "left",
  connectedLeft,
  connectedRight,
  connectedSegmented = true,
  borderless,
  clearButton,
  onClearButtonClick,
  showCharacterCount,
}: TextFieldProps) {
  const [height, setHeight] = useState<number | null>(null);
  const [focus, setFocus] = useState(Boolean(focused));
  const [cursor, setCursor] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const prefixRef = useRef<HTMLDivElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);
  const buttonPressTimer = useRef<number | undefined>(undefined);
  const textFieldRef = multiline ? textAreaRef : inputRef;
  const segmentNumberRef = useRef<HTMLDivElement>(null);
  const {
    value: displaySegmentNumber,
    setTrue: setTrueDisplaySegmentNumber,
    setFalse: setFalseDisplaySegmentNumber,
  } = useToggle(false);
  const isNumeric = type === "integer" || type === "number";

  useEffect(() => {
    if (textFieldRef.current && typeof focused === "boolean") {
      if (focused) {
        textFieldRef.current.focus();
      } else {
        textFieldRef.current.blur();
      }
    }
  }, [focused, textFieldRef]);

  const id = useUniqueId("TextField", idProp);

  useEffect(() => {
    if (textFieldRef.current && type === "currency" && value) {
      textFieldRef.current.setSelectionRange(cursor, cursor);
    }
  }, [textFieldRef, cursor, value, type]);

  const handleClearButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    clearButton && onClearButtonClick?.(id);
    textFieldRef?.current?.focus();
  };

  const clearButtonMarkup =
    clearButton && value ? (
      <StyledClearButton onClick={handleClearButtonClick} disabled={disabled}>
        <Icon source={OffCloseIcon} color="base" />
      </StyledClearButton>
    ) : null;

  const handleFocus = (
    e: React.FocusEvent<HTMLElement> | React.MouseEvent<HTMLInputElement>
  ) => {
    if (selectTextOnFocus) {
      textFieldRef.current?.select();
    }
    setFocus(true);
    onFocus?.(e as React.FocusEvent<HTMLInputElement>);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "currency") {
      const cursorTemp = getRangeSelection(
        event.target.value,
        event.target.selectionStart ?? 0
      );
      if (cursor !== cursorTemp) {
        setCursor(cursorTemp);
      }
      onChange &&
        onChange(unformatCurrency(event.target.value), id, event.target.value);
    } else {
      onChange && onChange(event.target.value, id);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const { target } = e;

    // For TextFields used with Combobox, focus needs to be set again even
    // if the TextField is already focused to trigger the logic to open the
    // Combobox activator
    const inputRefRole = inputRef.current?.getAttribute("role");
    if (target === inputRef.current && inputRefRole === "combobox") {
      inputRef.current?.focus();
      handleFocus(e);
      return;
    }

    if (
      textFieldRef.current &&
      prefixRef.current &&
      suffixRef.current &&
      !prefixRef.current.contains(e.target as Element) &&
      !suffixRef.current.contains(e.target as Element) &&
      !focus
    ) {
      textFieldRef.current.focus();
    }
  };

  const handleSegmentNumberClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (focus) {
      return;
    }

    setFocus(true);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    const currencySpec = /[\d.,]$/;
    const numbersSpec = /[\d.,eE+-]$/;
    const integerSpec = /[\deE+-]$/;
    if (
      !(isNumeric || type === "currency") ||
      key === "Enter" ||
      (type === "number" && numbersSpec.test(key)) ||
      (type === "integer" && integerSpec.test(key)) ||
      (type === "currency" && currencySpec.test(key))
    ) {
      return;
    }
    e.preventDefault();
  };

  const handleBlur = (e: React.FocusEvent) => {
    setFocus(false);
    onBlur?.(e);
  };

  useEventListener(
    "wheel",
    handleOnWheel,
    inputRef as React.RefObject<HTMLElement>,
    { passive: true }
  );

  function handleOnWheel(event: WheelEvent) {
    if (document.activeElement === event.target && isNumeric) {
      event.stopPropagation();
    }
  }

  const inputType = type === "currency" ? "text" : isNumeric ? "number" : type;
  const normalizedValue =
    value && type === "currency" ? formatNumber(value) : value;
  const normalizedStep = step ? step : 1;
  const normalizedMax = max ? max : Infinity;
  const normalizedMin = min ? min : -Infinity;
  const style = multiline && height ? { height, maxHeight } : null;

  const argsInput: any = {
    id,
    name,
    value: normalizedValue,
    disabled,
    readOnly,
    autoFocus,
    placeholder,
    autoComplete,
    ref: multiline ? textAreaRef : inputRef,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    step,
    inputMode,
    type: inputType,
    rows: getRows(multiline),
    focused: focus,
    role,
    error,
    align,
    style,
    requiredIndicator,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyPress: handleKeyPress,
    onChange: handleChange,
  };

  const shouldMultiline = Boolean(multiline) && type === "text";
  const input = shouldMultiline ? (
    <StyledInput as="textarea" {...argsInput}>
      {value}
    </StyledInput>
  ) : (
    <StyledInput as="input" {...argsInput} />
  );

  const characterCount = normalizedValue?.length ?? 0;
  const characterCountMarkup = showCharacterCount ? (
    <StyledCharacterCounter multiline={shouldMultiline}>
      {!maxLength ? characterCount : `${characterCount}/${maxLength}`}
    </StyledCharacterCounter>
  ) : null;

  const handleNumberChange = useCallback(
    (steps: number, stepAmount = normalizedStep) => {
      if (onChange === null) {
        return;
      }
      const dpl = (num: number) => (num.toString().split(".")[1] || []).length;

      const numericValue = value ? parseFloat(value) : 0;
      if (isNaN(numericValue)) {
        return;
      }
      const decimalPlaces =
        type === "integer" ? 0 : Math.max(dpl(numericValue), dpl(stepAmount));

      const newValue = Math.min(
        Number(normalizedMax),
        Math.max(numericValue + steps * stepAmount, Number(normalizedMin))
      );
      onChange && onChange(String(newValue.toFixed(decimalPlaces)), id);
    },
    [normalizedStep, onChange, value, type, normalizedMax, normalizedMin, id]
  );

  const handleButtonRelease = useCallback(() => {
    clearTimeout(buttonPressTimer.current);
  }, []);

  const handleButtonPress: SegmentNumberProps["onMouseDown"] = useCallback(
    (onChange) => {
      const minInterval = 50;
      const decrementBy = 10;
      let interval = 200;

      const onChangeInterval = () => {
        if (interval > minInterval) interval -= decrementBy;
        onChange(0);
        buttonPressTimer.current = window.setTimeout(
          onChangeInterval,
          interval
        );
      };

      buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);

      document.addEventListener("mouseup", handleButtonRelease, {
        once: true,
      });
    },
    [handleButtonRelease]
  );

  const handleExpandingResize = useCallback((height: number) => {
    setHeight(height);
  }, []);

  const resizer = multiline ? (
    <Resizer
      contents={normalizedValue || placeholder}
      currentHeight={height}
      minimumLines={typeof multiline === "number" ? multiline : 1}
      onHeightChange={handleExpandingResize}
    />
  ) : null;

  const segmentNumberMarkup =
    isNumeric && step !== 0 && !disabled && !readOnly ? (
      <SegmentNumber
        onClick={handleSegmentNumberClick}
        onChange={handleNumberChange}
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        refSegment={segmentNumberRef}
        onBlur={handleBlur}
        isDisplay={displaySegmentNumber}
      />
    ) : null;

  const prefixMarkup = prefix ? (
    <StyledPrefix id={`${id}-Prefix`} ref={prefixRef}>
      {prefix}
    </StyledPrefix>
  ) : null;

  const suffixMarkup = suffix ? (
    <StyledSuffix
      id={`${id}-Suffix`}
      ref={suffixRef}
      hasSegmentNumber={segmentNumberMarkup !== null}
    >
      {suffix}
    </StyledSuffix>
  ) : null;

  return (
    <Labelled
      id={id}
      requiredIndicator={requiredIndicator}
      label={label}
      labelTooltip={labelTooltip}
      helpText={helpText}
      error={error}
      action={labelAction}
    >
      <Connected
        left={connectedLeft}
        right={connectedRight}
        segmented={connectedSegmented}
      >
        <StyledTextField
          onClick={handleClick}
          $disabled={disabled}
          error={!!error}
          hasSuffix={!!suffixMarkup}
          segmentedLeft={!!connectedLeft && connectedSegmented}
          segmentedRight={!!connectedRight && connectedSegmented}
          characterCountBelow={shouldMultiline && showCharacterCount}
          borderless={borderless}
          onMouseOver={setTrueDisplaySegmentNumber}
          onMouseOut={setFalseDisplaySegmentNumber}
        >
          {prefixMarkup}
          {input}
          {suffixMarkup}
          {segmentNumberMarkup}
          {clearButtonMarkup}
          {characterCountMarkup}
          <StyledBackdrop data-segment-control="true" />
          {resizer}
        </StyledTextField>
      </Connected>
    </Labelled>
  );
}

const StyledBackdrop = styled.div`
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.inputBackdrop};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  transition: border-color linear ${(p) => p.theme.motion.duration200};
`;

const StyledInput = styled.input<{
  focused: boolean;
  align: TextFieldProps["align"];
  disabled: TextFieldProps["disabled"];
  error: TextFieldProps["error"];
  type: TextFieldProps["type"];
}>`
  z-index: ${(p) => p.theme.zIndex.input};
  resize: none;
  width: 100%;
  box-shadow: none;
  outline: none;
  background: none;
  font-family: ${(p) => p.theme.typography.fontFamilySans};
  text-align: ${(p) => p.align};
  border: ${(p) => p.theme.shape.borderTransparent};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  padding: ${(p) =>
    `calc((${p.theme.components.form.controlHeight} - ${
      p.theme.typography.fontLineHeight3
    } - ${p.theme.spacing(0.5)})/2) ${p.theme.spacing(3)}`};
  &[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
  &::placeholder {
    color: ${(p) => p.theme.colors.textPlaceholder};
  }
`;

const StyledPrefix = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  flex: 0 0 auto;
  color: ${(p) => p.theme.colors.textSubdued};
  user-select: none;
  margin-left: ${(p) => p.theme.spacing(3)};
  margin-right: ${(p) => p.theme.spacing(2)};
  ~ ${StyledInput} {
    padding-left: 0;
  }
`;

const StyledSuffix = styled.div<{
  hasSegmentNumber: boolean;
}>`
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  flex: 0 0 auto;
  color: ${(p) => p.theme.colors.textSubdued};
  user-select: none;
  margin-left: ${(p) => p.theme.spacing(1)};
  margin-right: ${(p) =>
    p.hasSegmentNumber ? p.theme.spacing(1) : p.theme.spacing(3)};
`;

const StyledClearButton = styled.button`
  ${unstyledButton}
  z-index: ${(p) => p.theme.zIndex.inputContent};
  margin: ${(p) => p.theme.spacing(0, 3, 0, 1)};
  &:disabled {
    cursor: default;
  }
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid
      ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledTextField = styled.div<{
  hasSuffix?: boolean;
  segmentedLeft?: boolean;
  segmentedRight?: boolean;
  error?: boolean;
  $disabled?: boolean;
  characterCountBelow?: boolean;
  borderless?: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;
  line-height: ${(p) => p.theme.typography.fontLineHeight3};

  &,
  ${StyledInput} {
    color: ${(p) => p.theme.colors.text};
    font-size: ${(p) => p.theme.typography.fontSize200};
    font-weight: ${(p) => p.theme.typography.fontWeightRegular};
    ${(p) => p.theme.breakpoints.up("md")} {
      font-size: ${(p) => p.theme.typography.fontSize100};
    }
  }

  ${StyledInput} {
    line-height: ${(p) => p.theme.typography.fontLineHeight2};
    ${(p) =>
      p.hasSuffix &&
      css`
        padding-right: 0;
      `}
    ${(p) =>
      p.characterCountBelow &&
      css`
        margin-bottom: calc(
          ${p.theme.typography.fontLineHeight2} + ${p.theme.spacing(1)}
        );
      `}
  }

  ${StyledBackdrop} {
    background-color: ${(p) =>
      p.$disabled ? p.theme.colors.surfaceDisabled : p.theme.colors.surface};
    border: ${(p) => p.theme.shape.borderWidth(1)} solid
      ${(p) =>
        p.borderless
          ? "transparent"
          : p.error
          ? p.theme.colors.borderCritical
          : p.theme.colors.border};
    ${(p) =>
      p.segmentedLeft &&
      css`
        border-left-width: 0;
      `}

    ${(p) =>
      p.segmentedRight &&
      css`
        border-right-width: 0;
      `}
  }
  ${StyledInput}:focus ~ ${StyledBackdrop} {
    border-color: ${(p) =>
      !p.borderless && !p.error ? p.theme.colors.borderInformation : "auto"};
    border-width: ${(p) => p.theme.shape.borderWidth(1)};
  }
`;

const StyledCharacterCounter = styled.div<{ multiline?: boolean }>`
  color: ${(p) => p.theme.colors.textSubdued};
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  margin: ${(p) => p.theme.spacing(0, 3, 0, 1)};
  pointer-events: none;
  ${(p) =>
    p.multiline &&
    css`
      align-self: flex-end;
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      padding-bottom: ${p.theme.spacing(1)};
      text-align: right;
    `}
`;

function getRows(multiline?: boolean | number) {
  if (!multiline) return undefined;

  return typeof multiline === "number" ? multiline : 1;
}

function formatNumber(value: string, thousandSeparator = ",") {
  const decimalPos = value.indexOf(".");
  if (decimalPos >= 0) {
    let leftSide = value.substring(0, decimalPos);
    let rightSide = value.substring(decimalPos);
    leftSide = leftSide
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    rightSide = rightSide.replace(/\D/g, "");
    return `${leftSide}.${rightSide}`;
  } else {
    return value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
}

function unformatCurrency(value: string, thousandSeparator = ",") {
  const regex = new RegExp(`${thousandSeparator}`, "g");
  return value.replace(regex, "");
}

function getRangeSelection(
  value: string,
  selectionStart = 0,
  thousandSeparator = ","
) {
  const originalLen = value.length;
  const caretPos = selectionStart;
  const valueFinal = formatNumber(value, thousandSeparator);
  const updatedLen = valueFinal.length;
  return updatedLen - originalLen + caretPos;
}
