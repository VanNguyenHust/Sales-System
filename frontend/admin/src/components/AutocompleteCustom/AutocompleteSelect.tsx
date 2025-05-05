import { useEffect, useMemo, useState } from "react";
import { Autocomplete, type AutocompleteProps, type Error, Icon, Text } from "@/ui-components";
import { SearchIcon } from "@/ui-icons";
import { isEmpty } from "lodash-es";
import { useDebouncedCallback } from "use-debounce";

import { isSearchTextMatch } from "app/utils/text";

type Props = {
  label?: React.ReactNode;
  placeholder?: string;
  options: CustomOption[];
  selected?: CustomOption | CustomOption[] | null;
  onSelect: (selected: any) => void;
  onQueryChange?: (query: string) => void;
  error?: Error | boolean;
  searchField?: keyof CustomOption;
  searchPlaceholder?: string;
  defaultQuery?: string;
  isLoading?: boolean;
  requiredIndicator?: boolean;
  disabled?: boolean;
  actionBefore?: AutocompleteProps["actionBefore"];
  searchInput?: boolean;
  allowMultiple?: boolean;
  emptyState?: React.ReactNode;
  selectAll?: boolean;
  onFocus?: () => void;
  loadingEffect?: boolean;
  onLoadMoreResults?: (q?: string) => void;
  totalSelected?: number;
} & Omit<
  AutocompleteProps,
  "options" | "selected" | "onSelect" | "textField" | "emptyState" | "loading" | "onLoadMoreResults"
>;

export type CustomOption = {
  label: string;
  value: string;
  renderOption?: React.ReactNode;
} & unknown;

export const filterOptions = (options: any[], query: string, searchField?: keyof CustomOption) =>
  options.filter((option) => {
    let text: string | null = null;
    if (searchField && typeof option[searchField] === "string") {
      text = option[searchField] as string;
    } else if (typeof option.label === "string") {
      text = option.label;
    }
    return text !== null && isSearchTextMatch(text, query, { vietnamese: true });
  });

const AutocompleteSelect = ({
  options,
  selected,
  onSelect,
  onQueryChange,
  searchField,
  defaultQuery,
  actionBefore,
  searchInput,
  allowMultiple,
  loadingEffect,
  totalSelected,
  isLoading,
  placeholder,
  emptyState,
  ...props
}: Props) => {
  const [query, setQuery] = useState("");
  const _selected = Array.isArray(selected) ? selected : selected;

  const textField = useMemo(() => {
    const selectedOrPlaceholder = !isEmpty(_selected) ? _selected : { label: placeholder ?? "", value: "" };
    if (searchInput) {
      return (
        <Autocomplete.TextField
          onChange={setQuery}
          label={props?.label}
          value={query}
          prefix={<Icon source={SearchIcon} color="base" />}
          placeholder={placeholder}
          onFocus={props?.onFocus}
          onBlur={() => {
            setQuery("");
          }}
        />
      );
    } else {
      let value = !Array.isArray(selectedOrPlaceholder)
        ? selectedOrPlaceholder?.label
        : isEmpty(selectedOrPlaceholder?.length)
        ? placeholder ?? ""
        : `Đã chọn ${selectedOrPlaceholder?.length}`;
      if (totalSelected && Array.isArray(selectedOrPlaceholder) && totalSelected !== 0)
        value = `Đã chọn ${totalSelected}`;
      return (
        <Autocomplete.Select
          requiredIndicator={props?.requiredIndicator}
          label={props?.label}
          error={props?.error}
          value={value}
          placeholder={value}
          onFocus={() => {
            if (query === "" && defaultQuery && query !== defaultQuery.trim()) {
              setQuery(defaultQuery);
            }
            props?.onFocus?.();
          }}
          disabled={props?.disabled}
          onBlur={() => {
            setQuery("");
          }}
        />
      );
    }
  }, [_selected, placeholder, searchInput, props, query, totalSelected, defaultQuery]);

  const filteredOptions = onQueryChange
    ? options
    : query.trim() !== ""
    ? filterOptions(options, query, searchField) ?? []
    : options ?? [];

  const handleSelect = (selected: string[]) => {
    if (allowMultiple) {
      const _selected = options.filter((option) => selected.includes(option.value));
      onSelect(_selected);
    } else {
      const option = options?.find((option) => option.value === selected[0]);
      if (option) {
        onSelect(option);
      }
    }
  };

  const debouncedOnQueryChange = useDebouncedCallback((v) => onQueryChange?.(v), 500);

  useEffect(() => {
    debouncedOnQueryChange(query);
  }, [debouncedOnQueryChange, query]);
  const loadingE = loadingEffect === true ? debouncedOnQueryChange.isPending() : false;

  const loading = isLoading || loadingE;

  return (
    <Autocomplete
      {...props}
      header={
        !searchInput ? (
          <Autocomplete.Header>
            <Autocomplete.HeaderSearch value={query} onChange={setQuery} placeholder={props?.searchPlaceholder} />
            {props?.selectAll && Array.isArray(selected) && (
              <Autocomplete.HeaderCheckbox
                label="Chọn tất cả"
                checked={
                  selected?.length === 0
                    ? undefined
                    : selected?.length === filteredOptions?.length
                    ? true
                    : "indeterminate"
                }
                onChange={() => {
                  if (selected?.length === 0) {
                    onSelect(filteredOptions);
                  } else {
                    if (selected?.length === options?.length) {
                      onSelect([]);
                    }
                    if (selected?.length < options?.length) {
                      onSelect(filteredOptions);
                    }
                  }
                }}
              />
            )}
          </Autocomplete.Header>
        ) : null
      }
      options={filteredOptions.map((option) => ({
        ...option,
        label: option?.renderOption ?? option?.label ?? "",
      }))}
      selected={Array.isArray(selected) ? selected.map((item) => item.value) : [selected?.value?.toString() ?? ""]}
      onSelect={handleSelect}
      textField={textField}
      emptyState={
        emptyState ?? (
          <div style={{ height: 40, lineHeight: "40px" }}>
            <Text as="span" alignment="center">
              Không có kết quả tìm kiếm
            </Text>
          </div>
        )
      }
      loading={loading}
      willLoadMoreResults={isLoading}
      actionBefore={actionBefore}
      allowMultiple={allowMultiple}
      onLoadMoreResults={() => {
        props?.onLoadMoreResults?.(query);
      }}
    />
  );
};

export default AutocompleteSelect;
