import { ComponentProps, useMemo, useState } from "react";
import { Combobox, Listbox } from "@/ui-components";

import { useGetDistrictsQuery, useGetProvincesQuery } from "app/api";
import { District, Province } from "app/types";
import { isSearchTextMatch } from "app/utils/text";
import { useToggle } from "app/utils/useToggle";

import { SelectEmptyState } from "./SelectEmptyState";

export type ValueType = {
  province: string;
  district: string;
};

type ProvinceDistrict = {
  province: Province;
  district: District;
};

interface Props extends Omit<ComponentProps<typeof Combobox.Select>, "value"> {
  value?: ValueType;
  onChange?(value?: ValueType, detail?: ProvinceDistrict): void;
}

type Options = {
  label: string;
  value: string;
  detail: ProvinceDistrict;
}[];

const placeholderValue = "<>";

//TODO: perf using react-window
export const ProvinceDistrictSelect2 = ({
  value: valueProp,
  onChange,
  placeholder = "Chọn khu vực",
  onFocus,
  ...selectProps
}: Props) => {
  const { province: selectedProvince, district: selectedDistrict } = valueProp || {};
  const selectedValue = selectedProvince && selectedDistrict ? `${selectedProvince}|${selectedDistrict}` : undefined;
  const { value: lazy, setFalse: clearLazy } = useToggle(selectedValue ? false : true);
  const { data: provinces, isLoading: isLoadingProvince } = useGetProvincesQuery(undefined, {
    skip: lazy,
  });
  const { data: districts, isLoading: isLoadingDistrict } = useGetDistrictsQuery(undefined, {
    skip: lazy,
  });
  const [query, setQuery] = useState("");

  const options = useMemo(
    (): Options =>
      (provinces || []).flatMap((p) =>
        (districts || [])
          .filter((d) => d.province_id === p.id)
          .map((d) => ({
            label: `${p.name} - ${d.name}`,
            value: `${p.code}|${d.code}`,
            detail: { province: p, district: d },
          }))
      ),
    [districts, provinces]
  );

  // reset query when focus
  const handleSelectFocus = () => {
    clearLazy();
    setQuery("");
    onFocus?.();
  };

  const handleChange = (value: string) => {
    if (value === placeholderValue) {
      onChange?.(undefined);
    } else {
      const [p, d] = value.split("|", 2);
      const selected = options.find((opt) => opt.value === value);
      onChange?.(
        {
          province: p,
          district: d,
        },
        selected?.detail
      );
    }
  };

  const selectedOption = selectedValue ? options.find((opt) => opt.value === selectedValue) : undefined;

  const filteredOptions = query
    ? options.filter((option) => isSearchTextMatch(option.label, query, { vietnamese: true }))
    : options;

  const selectField = (
    <Combobox.Select {...selectProps} onFocus={handleSelectFocus} placeholder={selectedOption?.label ?? placeholder} />
  );

  const placeholderOption =
    !query && selectedValue ? (
      <Listbox.Option key={placeholderValue} value={placeholderValue}>
        <Listbox.TextOption breakWord>{placeholder}</Listbox.TextOption>
      </Listbox.Option>
    ) : null;

  const optionsMarkup = filteredOptions.map((option) => (
    <Listbox.Option key={option.value} selected={option.value === selectedValue} value={option.value}>
      {option.label}
    </Listbox.Option>
  ));

  const loadingMarkup = isLoadingProvince || isLoadingDistrict ? <Listbox.Loading /> : null;

  const emptyStateMarkup =
    !filteredOptions.length && !(isLoadingProvince || isLoadingDistrict) ? <SelectEmptyState /> : null;

  return (
    <Combobox activator={selectField} header={<Combobox.HeaderSearch onChange={setQuery} />}>
      <Listbox onSelect={handleChange}>
        {placeholderOption}
        {optionsMarkup}
        {loadingMarkup}
        {emptyStateMarkup}
      </Listbox>
    </Combobox>
  );
};
