import { ComponentProps, useMemo, useState } from "react";
import { Autocomplete } from "@/ui-components";

import { useGetDistrictsQuery, useGetWardsByDistrictQuery } from "app/api";
import { SelectEmptyState } from "app/components/SelectEmptyState";
import { Ward } from "app/types";
import { isSearchTextMatch } from "app/utils/text";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  value?: string;
  district?: string;
  onChange?: (value: string, ward?: Ward) => void;
  valueType?: "name" | "code";
}

type Options = {
  label: string;
  value: string;
}[];

const placeholderValue = "";

export const WardSelect = ({
  placeholder = "Chọn Phường xã",
  district = "",
  value = placeholderValue,
  onFocus,
  onChange,
  valueType,
  ...selectRestProps
}: Props) => {
  const { data: districts, isLoading: isLoadingDistrict } = useGetDistrictsQuery(void 0, {
    skip: valueType !== "name",
  });
  const districtCode = districts?.find((d) => d.name === district)?.code ?? "";
  const { data: wards = [], isLoading: isLoadingWard } = useGetWardsByDistrictQuery(
    valueType === "name" ? districtCode : district,
    {
      skip: !district,
    }
  );
  const isLoading = isLoadingDistrict || isLoadingWard;
  const options = useMemo(
    (): Options =>
      wards.map((ward) => ({
        label: ward.name,
        value: valueType === "name" ? ward.name : ward.code,
      })),
    [valueType, wards]
  );
  const [query, setQuery] = useState("");

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    onFocus?.();
  };

  const handleChange = (selected: string[]) => {
    selected.length > 0 &&
      onChange?.(
        selected[0],
        wards.find((item) => item[valueType ?? "code"] === selected[0])
      );
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
