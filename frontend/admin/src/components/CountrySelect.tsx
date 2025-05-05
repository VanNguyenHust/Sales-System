import { ComponentProps, useMemo, useState } from "react";
import { Autocomplete } from "@/ui-components";

import { useGetCountriesQuery } from "app/api";
import { SelectEmptyState } from "app/components/SelectEmptyState";
import { Country } from "app/types";
import { isSearchTextMatch } from "app/utils/text";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  value?: string;
  onChange?: (value: string, country?: Country) => void;
  valueType?: "name" | "code";
}

type Options = {
  label: string;
  value: string;
}[];

const placeholderValue = "";

export const CountrySelect = ({
  placeholder = "Chọn quốc gia",
  value = placeholderValue,
  onFocus,
  onChange,
  valueType,
  ...selectRestProps
}: Props) => {
  const { data: countries = [], isLoading } = useGetCountriesQuery();
  const options = useMemo(
    (): Options =>
      countries.map((c) => ({
        label: c.name,
        value: valueType === "name" ? c.name : c.code,
      })),
    [countries, valueType]
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
        countries.find((item) => item[valueType ?? "code"] === selected[0])
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
      : options.filter((option) => isSearchTextMatch(option.label, query));
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
