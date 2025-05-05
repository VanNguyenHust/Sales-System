import { ComponentProps, useMemo, useState } from "react";
import { Autocomplete } from "@/ui-components";

import { useGetProvincesQuery } from "app/api";
import { SelectEmptyState } from "app/components/SelectEmptyState";
import { Province } from "app/types";
import { isSearchTextMatch } from "app/utils/text";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  value?: string;
  onChange?: (value: string, province: Province) => void;
}

type Options = {
  label: string;
  value: string;
}[];

const placeholderValue = "";

export const ProvinceSelect = ({
  placeholder = "Chọn Tỉnh thành",
  value = placeholderValue,
  onFocus,
  onChange,
  ...selectRestProps
}: Props) => {
  const { data: provinces = [], isLoading } = useGetProvincesQuery();
  const options = useMemo(
    (): Options =>
      provinces.map((province) => ({
        label: province.name,
        value: province.code,
      })),
    [provinces]
  );
  const [query, setQuery] = useState("");

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    onFocus?.();
  };

  const handleChange = (selected: string[]) => {
    if (selected.length > 0) {
      const provinceCode = selected[0];
      const province = provinces.find((p) => p.code === provinceCode)!;
      onChange?.(provinceCode, province);
    }
  };

  const selected = options.find((option) => option.value === value) || {
    label: placeholder,
    value: placeholderValue,
  };
  const textField = (
    <Autocomplete.Select
      {...selectRestProps}
      value={selected.value}
      placeholder={selected.label}
      onFocus={handleSelectFocus}
    />
  );
  const filteredOptions =
    !query && value !== placeholderValue
      ? [{ value: placeholderValue, label: placeholder }, ...options]
      : options.filter((option) => isSearchTextMatch(option.label, query, { vietnamese: true }));
  return (
    <Autocomplete
      header={<Autocomplete.HeaderSearch value={query} onChange={setQuery} />}
      options={filteredOptions}
      selected={[value]}
      onSelect={handleChange}
      textField={textField}
      loading={isLoading}
      emptyState={<SelectEmptyState />}
    />
  );
};
