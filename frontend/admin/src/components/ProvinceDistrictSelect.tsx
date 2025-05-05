import { ComponentProps, useEffect, useRef, useState } from "react";
import { Autocomplete } from "@/ui-components";

import { CustomOption } from "app/components/AutocompleteCustom/AutocompleteSelect";
import { isSearchTextMatch } from "app/utils/text";

import { useProvinceDistrictOptions } from "../features/shipping/hooks/useFilterData";

import { SelectEmptyState } from "./SelectEmptyState";

type Props = {
  value?: string;
  country?: number | string;
  valueField?: string;
  onChange: (value: CustomOption) => void;
  valueType?: "name" | "id";
  onChangeError?: (error?: string) => void;
} & Omit<ComponentProps<typeof Autocomplete.Select>, "value">;

/** @deprecated Using ProvinceDistrictSelect2 instead */
export const ProvinceDistrictSelect = ({
  value = "",
  country = 0,
  valueType,
  valueField = valueType === "name" ? "label" : "value",
  onChange,
  placeholder = "Chọn khu vực",
  onChangeError,
  ...rest
}: Props) => {
  const [query, setQuery] = useState("");
  if (country === "VN") country = 201;

  const { options, isLoading, error } = useProvinceDistrictOptions(country, valueType);
  const onChangeErrorRef = useRef(onChangeError);
  useEffect(() => {
    onChangeErrorRef?.current?.(error);
  }, [error]);

  const selected = options.find((option) => option[valueField as keyof CustomOption] === value) || {
    label: placeholder,
    value: "",
  };

  const handleSelectFocus = () => {
    setQuery("");
    rest?.onFocus?.();
  };

  const textField = (
    <Autocomplete.Select {...rest} value={selected.value} placeholder={selected.label} onFocus={handleSelectFocus} />
  );

  const filteredOptions = query
    ? options.filter((option) => isSearchTextMatch(option.label, query, { vietnamese: true }))
    : options;
  const handleSelect = (selected: string[]) => {
    const option = options?.find((option) => option.value === selected[0]);
    if (option) {
      onChange(option);
    }
  };
  return (
    <Autocomplete
      header={<Autocomplete.HeaderSearch value={query} onChange={setQuery} />}
      options={filteredOptions}
      selected={[selected?.value?.toString() ?? ""]}
      onSelect={handleSelect}
      textField={textField}
      emptyState={<SelectEmptyState />}
      loading={isLoading}
    />
  );
};
