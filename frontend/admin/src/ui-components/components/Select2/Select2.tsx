import React, { useCallback, useMemo } from "react";

import { useUniqueId } from "../../utils/uniqueId";
import { Autocomplete } from "../Autocomplete";
import { type SelectProps } from "../Select";
import { HideableStrictOption, SelectGroup, StrictGroup, StrictOption } from "../Select/types";
import { isGroup, normalizeOptions } from "../Select/utils";

const PLACEHOLDER_VALUE = "";

export interface Select2Props extends Omit<SelectProps, "options"> {
  /** Danh sách các option được liệt kê */
  options?: string[] | StrictOption[] | SelectGroup[];
}

/**
 * Cho phép người dùng chọn một giá trị từ danh sách lựa chọn.
 * Khác với component `Select`, component này có giao diện cố định không phụ thuộc loại thiết bị như mobile
 *
 * Nếu muốn trải nghiệm người dùng được cải thiện theo thiết bị mobile hãy sử dụng component `Select`
 */
export function Select2({
  id: idProp,
  options = [],
  placeholder,
  value = PLACEHOLDER_VALUE,
  onChange,
  ...rest
}: Select2Props) {
  const id = useUniqueId("Select2", idProp);
  const selectedValue = useMemo(() => [value], [value]);

  const handleSelect = useCallback(
    (selected: string[]) => {
      selected.length && onChange?.(selected[0], id);
    },
    [id, onChange]
  );

  const normalizedOptions = normalizeOptions(options);

  const selectedOption = getSelectedOption(normalizedOptions, value);

  // mimic default behavior of browser when empty options
  // this will keep popover open when focus and options is lazy load, be filled after that. Otherwise, body of popover not be render
  const emptyHeaderMarkup = !normalizedOptions.length ? <Autocomplete.Header> </Autocomplete.Header> : undefined;

  return (
    <Autocomplete
      options={normalizedOptions}
      onSelect={handleSelect}
      selected={selectedValue}
      header={emptyHeaderMarkup}
      textField={
        <Autocomplete.Select
          id={id}
          {...rest}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={value}
        />
      }
    />
  );
}

function getSelectedOption(options: HideableStrictOption[] | StrictGroup[], value: string): StrictOption | undefined {
  for (const option of options) {
    if (isGroup(option)) {
      for (const sectionOption of option.options) {
        if (sectionOption.value === value) {
          return sectionOption;
        }
      }
    } else if (option.value === value) {
      return option;
    }
  }
}
