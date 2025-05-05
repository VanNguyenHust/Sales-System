import { ComponentProps, useMemo, useState } from "react";
import { Autocomplete } from "@/ui-components";

import { useGetDistrictsByProvinceQuery } from "app/api";
import { SelectEmptyState } from "app/components/SelectEmptyState";
import { District } from "app/types";
import { isSearchTextMatch } from "app/utils/text";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  value?: string;
  province?: string;
  onChange?: (value: string, district: District) => void;
}

type Options = {
  label: string;
  value: string;
}[];

const placeholderValue = "";

export const DistrictSelect = ({
  placeholder = "Chọn Quận huyện",
  province = "",
  value = placeholderValue,
  onFocus,
  onChange,
  ...selectRestProps
}: Props) => {
  const { data: districts = [], isLoading } = useGetDistrictsByProvinceQuery(province, {
    skip: !province,
  });
  const options = useMemo(
    (): Options =>
      districts.map((district) => ({
        label: district.name,
        value: district.code,
      })),
    [districts]
  );
  const [query, setQuery] = useState("");

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    onFocus?.();
  };

  const handleChange = (selected: string[]) => {
    if (selected.length > 0) {
      const districtCode = selected[0];
      const district = districts.find((d) => d.code === districtCode)!;
      onChange?.(districtCode, district);
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
