import React from "react";

import type { Action, Error } from "../../types";
import { useUniqueId } from "../../utils/uniqueId";
import { HelpIndicatorProps } from "../HelpIndicator";
import { Labelled } from "../Labelled";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { SelectField } from "./SelectField";
import { HideableStrictOption, SelectGroup, SelectOption, StrictGroup } from "./types";
import { flattenOptions, isGroup, normalizeOption } from "./utils";

export interface SelectProps {
  /** ID của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Nội dung label */
  label?: React.ReactNode;
  /** Hành động của label */
  labelAction?: Action;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Hiển thi label bên trái giá trị trong select */
  labelInline?: boolean;
  /** Thông tin mô tả form input */
  helpText?: string;
  /** Thông tin lỗi của form input */
  error?: Error | boolean;
  /** Hiển thị thông tin input là bắt buộc */
  requiredIndicator?: boolean;
  /** Text hiển thị như một placeholder */
  placeholder?: string;
  /** Danh sách options */
  options?: (SelectOption | SelectGroup)[];
  /** Disable select */
  disabled?: boolean;
  /** Giá trị của select */
  value?: string;

  /** Callback khi thay đổi lựa chọn */
  onChange?(selected: string, id: string): void;

  /** Callback khi blur  */
  onBlur?(): void;

  /** Callback khi focus */
  onFocus?(): void;
}

const PLACEHOLDER_VALUE = "";

/**
 * Cho phép người dùng chọn một giá trị từ danh sách lựa chọn
 */
export function Select({
  id: idProp,
  name,
  label,
  labelTooltip,
  labelAction,
  labelInline,
  error,
  helpText,
  requiredIndicator,
  options: optionsProp,
  value = "",
  placeholder = PLACEHOLDER_VALUE,
  disabled,
  onChange,
  onFocus,
  onBlur,
}: SelectProps) {
  const id = useUniqueId("Select", idProp);

  const handleChange = (value: string) => {
    onChange?.(value, id);
  };

  const options = optionsProp || [];
  let normalizedOptions = options.map(normalizeOption);
  const hasGroup = options.some((option) => isGroup(option));

  if (placeholder) {
    normalizedOptions = [
      {
        label: placeholder,
        value: PLACEHOLDER_VALUE,
        hidden: true,
      },
      ...normalizedOptions,
    ];
  }

  const selectedOption = getSelectedOption(normalizedOptions, value);

  const optionsMarkup = normalizedOptions.map(renderOption);

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
      {inlineLabel} <Text as="span">{selectedOption.label}</Text>
    </Stack>
  ) : (
    selectedOption.label
  );

  return (
    <Labelled
      id={id}
      requiredIndicator={requiredIndicator}
      label={labelInline ? undefined : label}
      helpText={helpText}
      error={error}
      labelTooltip={labelTooltip}
      action={labelAction}
    >
      <SelectField
        id={id}
        name={name}
        label={selectedLabel}
        value={value}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        hasGroup={hasGroup}
        error={Boolean(error)}
        requiredIndicator={requiredIndicator}
      >
        {optionsMarkup}
      </SelectField>
    </Labelled>
  );
}

function renderOption(optionOrGroup: HideableStrictOption | StrictGroup): React.ReactNode {
  if (isGroup(optionOrGroup)) {
    const { title, options } = optionOrGroup;
    return (
      <optgroup label={title} key={title}>
        {options.map(renderSingleOption)}
      </optgroup>
    );
  }

  return renderSingleOption(optionOrGroup);
}

function renderSingleOption(option: HideableStrictOption): React.ReactNode {
  const { value, label, ...rest } = option;
  return (
    <option key={value} value={value} {...rest}>
      {label}
    </option>
  );
}

function getSelectedOption(options: (HideableStrictOption | StrictGroup)[], value: string): HideableStrictOption {
  const flatOptions = flattenOptions(options);
  let selectedOption = flatOptions.find((option) => value === option.value);

  if (selectedOption === undefined) {
    // Get the first visible option (not the hidden placeholder)
    selectedOption = flatOptions.find((option) => !option.hidden);
  }

  return selectedOption || { value: "", label: "" };
}
