import { ComponentProps, useCallback, useMemo, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Autocomplete } from "@/ui-components";
import { includes, toNumber, toString } from "lodash-es";

import { useGetLocationsQuery } from "app/api";
import { isSearchTextMatch } from "app/utils/text";

import { SelectEmptyState } from "./SelectEmptyState";
import { StopPropagation } from "./StopPropagation";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  values?: number[];
  allowMultiple?: boolean;
  enableSelectAll?: boolean;
  excludes?: number[];
  width?: number;
  onChange?: (values?: Options) => void;
}

type Options = {
  label: string;
  value: number;
}[];

export const LocationSelect = ({
  placeholder = "Chọn chi nhánh",
  value = "",
  values = [],
  allowMultiple,
  enableSelectAll,
  excludes = [],
  width,
  onFocus,
  onChange,
  ...selectRestProps
}: Props) => {
  const { data: locations = [], isLoading, isFetching } = useGetLocationsQuery({ page: 0, limit: 0 });
  const options = useMemo(
    (): Options =>
      locations
        .filter((item) => !includes(excludes, item.id))
        .map((item) => ({
          label: item.name || "",
          value: item.id,
        })),
    [excludes, locations]
  );
  const [query, setQuery] = useState("");

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    onFocus?.();
  };

  const handleChange = (selecteds: number[]) => {
    const selected = options.filter((option) => selecteds.includes(option.value));
    onChange?.(selected);
  };

  const selected = options.filter((option) => values.includes(option.value) || value === toString(option.value));

  const handleSelectAll = useCallback(() => {
    if (selected?.length === options?.length) {
      onChange?.([]);
    } else {
      onChange?.(options);
    }
  }, [onChange, options, selected?.length]);

  const textField = (
    <Autocomplete.Select
      {...selectRestProps}
      value={toString(selected[0]?.value)}
      placeholder={
        selected.length > 0 ? (allowMultiple ? `Đã chọn ${selected.length} chi nhánh` : selected[0].label) : placeholder
      }
      onFocus={handleSelectFocus}
    />
  );

  const filteredOptions = (query ? options.filter((option) => isSearchTextMatch(option.label, query)) : options).map(
    ({ label, value }) => ({ label, value: String(value) })
  );

  return (
    <StyledContainer width={width}>
      <StopPropagation>
        <Autocomplete
          header={
            <Autocomplete.Header>
              <Autocomplete.HeaderSearch value={query} onChange={setQuery} placeholder="Tìm chi nhánh" />
              {enableSelectAll && allowMultiple && (
                <Autocomplete.HeaderCheckbox
                  label="Chọn tất cả"
                  onChange={handleSelectAll}
                  checked={selected?.length === options.length ? true : selected?.length ? "indeterminate" : false}
                />
              )}
            </Autocomplete.Header>
          }
          options={filteredOptions}
          selected={allowMultiple ? values.map(String) : [value]}
          onSelect={(selecteds) => {
            handleChange(selecteds.map(Number));
          }}
          textField={textField}
          loading={isLoading || isFetching}
          emptyState={<SelectEmptyState />}
          allowMultiple={allowMultiple}
        />
      </StopPropagation>
    </StyledContainer>
  );
};

const StyledContainer = styled.span<{ width?: number }>`
  display: block;
  ${(p) =>
    p.width
      ? css`
          width: ${p.width}px;
        `
      : css``};
`;
