import React, { useCallback, useEffect } from "react";

import type { Action, Error } from "../../types";
import { useUniqueId } from "../../utils/uniqueId";
import { HelpIndicatorProps } from "../HelpIndicator";
import { Labelled } from "../Labelled";
import { SelectField } from "../Select/SelectField";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { useComboboxTextField } from "./context";

export interface SelectProps {
  /** id của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Giá trị */
  value?: string;
  /** Nội dung label */
  label?: React.ReactNode;
  /** Hiển thi label bên trái giá trị trong Select */
  labelInline?: boolean;
  /** Hành động của label */
  labelAction?: Action;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Thông tin mô tả form input */
  helpText?: string;
  /** Lỗi hiển thị bên dưới Select */
  error?: Error | boolean;
  /** Hiển thị thông tin input là bắt buộc */
  requiredIndicator?: boolean;
  /** Trạng thái disabled */
  disabled?: boolean;
  /** Nội dung hiển thị bên trong Select */
  placeholder?: string;
  /** Callback nếu input focused */
  onFocus?: () => void;
  /** Callback nếu input blur */
  onBlur?: () => void;
}

export function Select({
  value,
  id: idProp,
  name,
  label,
  labelInline,
  labelAction,
  labelTooltip,
  requiredIndicator,
  helpText,
  error,
  placeholder,
  disabled,
  onFocus,
  onBlur,
}: SelectProps) {
  const selectId = useUniqueId("ComboboxSelect", idProp);
  const labelId = `${selectId}Label`;

  const { setTextFieldLabelId, onTextFieldClick, onTextFieldBlur, onTextFieldFocus, textFieldFocusedIn } =
    useComboboxTextField();

  useEffect(() => {
    setTextFieldLabelId?.(labelId);
  }, [labelId, setTextFieldLabelId]);

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      onBlur?.();
      onTextFieldBlur("select", event);
    },
    [onBlur, onTextFieldBlur]
  );

  const handleFocus = useCallback(() => {
    onFocus?.();
    onTextFieldFocus("select");
  }, [onFocus, onTextFieldFocus]);

  const handleClick = useCallback(() => {
    onTextFieldClick("select");
  }, [onTextFieldClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onTextFieldClick("select", true);
      }
    },
    [onTextFieldClick]
  );

  const inlineLabel =
    typeof label === "string" ? (
      <Text as="span" color="subdued">
        {label}
      </Text>
    ) : (
      label
    );

  const selectedLabel = labelInline ? (
    <Stack spacing="extraTight">
      {inlineLabel} <Text as="span">{placeholder}</Text>
    </Stack>
  ) : (
    placeholder
  );

  return (
    <Labelled
      id={selectId}
      action={labelAction}
      label={labelInline ? undefined : label}
      labelTooltip={labelTooltip}
      helpText={helpText}
      error={error}
      requiredIndicator={requiredIndicator}
    >
      <SelectField
        name={name}
        value={value}
        id={selectId}
        label={selectedLabel}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        focused={textFieldFocusedIn}
        error={Boolean(error)}
        requiredIndicator={requiredIndicator}
        asInput
      />
    </Labelled>
  );
}
