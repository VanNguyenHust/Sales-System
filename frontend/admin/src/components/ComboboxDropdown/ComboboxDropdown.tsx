import { useCallback, useEffect, useState } from "react";
import { Checkbox, Combobox, Listbox, type OptionDescriptor, type SelectProps, Text } from "@/ui-components";
import { filter, toString } from "lodash-es";

import { SelectEmptyState } from "app/components/SelectEmptyState";

import { filterOptions } from "../AutocompleteCustom/AutocompleteSelect";
import { StopPropagation } from "../StopPropagation";

export type ComboboxDropdownOption = OptionDescriptor & unknown;

type Props = {
  options: ComboboxDropdownOption[];
  selected?: ComboboxDropdownOption[];
  onChange(selected: ComboboxDropdownOption[]): void;
  allowSearch?: boolean;
  selectAll?: boolean;
  objectName?: string;
  emptyState?: React.ReactNode;
  selectAllLabel?: string;
  showCountLabel?: boolean;
} & Omit<SelectProps, "onChange" | "value" | "options">;

const ComboboxDropdown = ({
  options,
  selected,
  onChange,
  allowSearch,
  selectAll,
  objectName,
  emptyState,
  selectAllLabel,
  showCountLabel = false,
  ...props
}: Props) => {
  const [query, setQuery] = useState("");

  const [renderOptions, setRenderOptions] = useState<any[]>([]);

  useEffect(() => {
    setRenderOptions(filterOptions(options, query).splice(0, selectAll ? options.length : 30));
  }, [options, query, selectAll]);

  const handleSelectAll = useCallback(() => {
    if (selected?.length === renderOptions?.filter((item) => !item.disabled).length) {
      onChange([]);
    } else {
      onChange(renderOptions.filter((item) => !item.disabled));
    }
  }, [onChange, renderOptions, selected?.length]);

  const updateSelection = useCallback(
    (value: string) => {
      if (selected?.map((item) => item.value).includes(value)) {
        onChange(filter(selected, (option) => option.value !== value && !option.disabled));
      } else {
        const _newOptions = renderOptions.filter((item) => item.value.toString() === value && !item.disabled);
        onChange([...(selected ?? []), ..._newOptions]);
      }
    },
    [onChange, renderOptions, selected]
  );

  const optionsMarkup =
    renderOptions.length > 0
      ? renderOptions.map(({ label, value, disabled }) => {
          const _selected = selected?.map((item) => item.value).includes(value);
          return (
            <Listbox.Option key={value} value={value} disabled={disabled} selected={_selected}>
              <Listbox.TextOption selected={_selected} disabled={disabled} breakWord>
                {label}
              </Listbox.TextOption>
            </Listbox.Option>
          );
        })
      : emptyState ?? <SelectEmptyState />;

  const placeholder = selected?.length
    ? showCountLabel
      ? `Đã chọn ${selected.length} ${objectName ?? ""}`
      : //Note: giữ nguyên phẩn này
      selected?.length > 1
      ? `Đã chọn ${selected.length} ${objectName ?? ""}`
      : toString(selected?.[0]?.label)
    : props?.placeholder;

  const header = (
    <Combobox.Header>
      {allowSearch && <Combobox.HeaderSearch value={query} onChange={setQuery} />}
      {selectAll && renderOptions.length > 0 && (
        <Combobox.HeaderCheckbox
          label={selectAllLabel ?? "Chọn tất cả"}
          onChange={handleSelectAll}
          checked={selected?.length === renderOptions.length ? true : selected?.length ? "indeterminate" : false}
        />
      )}
    </Combobox.Header>
  );

  return (
    <StopPropagation>
      <Combobox
        allowMultiple
        header={header}
        activator={<Combobox.Select {...props} placeholder={placeholder} />}
        onClose={() => {
          setQuery("");
        }}
        onScrolledToBottom={() => {
          if (selectAll) return;
          setRenderOptions([...renderOptions, ...filterOptions(options, query).splice(renderOptions.length, 30)]);
        }}
      >
        <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
      </Combobox>
    </StopPropagation>
  );
};
export default ComboboxDropdown;
