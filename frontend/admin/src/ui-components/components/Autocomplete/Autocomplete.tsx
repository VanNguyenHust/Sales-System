import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";

import { OptionDescriptor, SectionDescriptor } from "../../types";
import { isSection } from "../../utils/options";
import { Combobox } from "../Combobox";
import { TextFieldProps } from "../TextField";
import { SelectProps } from "../Combobox/Select";
import { AutoSelection, Listbox } from "../Listbox";
import { PopoverProps } from "../Popover";

import { MappedAction, MappedActionProps } from "./MappedAction";

export interface AutocompleteProps {
  /** Danh sách các option được liệt kê */
  options: SectionDescriptor[] | OptionDescriptor[];
  /** Danh sách các option đã được chọn */
  selected: string[];
  /** TextField hoặc Select được gán với danh sách option */
  textField: React.ReactElement<TextFieldProps | SelectProps>;
  /** Vị trí hiển thị mong muốn khi mở popover */
  preferredPosition?: PopoverProps["preferredPosition"];
  /** Custom header của popover */
  header?: React.ReactNode;
  /** Tiêu đề của danh sách */
  listTitle?: string;
  /** Cho phép chọn nhiều option */
  allowMultiple?: boolean;
  /** Hiển thị trạng thái đang load */
  loading?: boolean;
  /** Hiển thị khi không có option nào thỏa mãn */
  emptyState?: React.ReactNode;
  /** Xác định có nhiều kết quả sẽ được load thêm  */
  willLoadMoreResults?: boolean;
  /** Hành động được hiển thị phía trên danh sách */
  actionBefore?: MappedActionProps;
  /** Callback danh sách lựa chọn option thay đổi */
  onSelect(selected: string[]): void;
  /** Callback khi scroll tới cuối danh sách */
  onLoadMoreResults?(): void;
}

/**
 * Input field cung cấp khả năng gợi ý, tìm kiếm ngay khi chủ shop bắt đầu gõ qua đó nhanh chóng tìm và chọn từ một danh sách lớn.
 *
 * Về bản chất là kết hợp giữa Combobox và Listbox component theo một cách thuận tiện hơn
 *
 * Ngoài ra có thể dùng như Select mở rộng cho phép tìm kiếm, lazyload, ...
 */
export const Autocomplete: React.FC<AutocompleteProps> & {
  TextField: typeof Combobox.TextField;
  Select: typeof Combobox.Select;
  Header: typeof Combobox.Header;
  HeaderItem: typeof Combobox.HeaderItem;
  HeaderSearch: typeof Combobox.HeaderSearch;
  HeaderCheckbox: typeof Combobox.HeaderCheckbox;
} = ({
  options,
  selected,
  textField,
  preferredPosition,
  allowMultiple,
  loading,
  emptyState,
  actionBefore,
  listTitle,
  willLoadMoreResults,
  header,
  onSelect,
  onLoadMoreResults,
}: AutocompleteProps) => {
  const buildMappedOptionFromOption = useCallback(
    (options: OptionDescriptor[]) => {
      return options.map((option) => (
        <Listbox.Option
          key={option.value}
          selected={selected.includes(option.value)}
          disabled={option.disabled}
          value={option.value}
        >
          <Listbox.TextOption selected={selected.includes(option.value)} disabled={option.disabled} breakWord>
            {option.label}
          </Listbox.TextOption>
        </Listbox.Option>
      ));
    },
    [selected]
  );

  const optionsMarkup = useMemo(() => {
    const conditionalOptions = loading && !willLoadMoreResults ? [] : options;

    if (isSection(conditionalOptions)) {
      const noOptionsAvailable = conditionalOptions.every(({ options }) => options.length === 0);
      if (noOptionsAvailable) {
        return null;
      }
      const optionsMarkup = conditionalOptions.map(({ options, title }) => {
        if (options.length === 0) {
          return null;
        }
        const optionMarkup = buildMappedOptionFromOption(options);
        return (
          <Listbox.Section divider={false} title={<Listbox.Header>{title}</Listbox.Header>} key={title}>
            {optionMarkup}
          </Listbox.Section>
        );
      });
      return <StyledSectionWrapper>{optionsMarkup}</StyledSectionWrapper>;
    }
    const optionList = conditionalOptions.length > 0 ? buildMappedOptionFromOption(conditionalOptions) : null;

    if (listTitle) {
      return (
        <Listbox.Section divider={false} title={<Listbox.Header>{listTitle}</Listbox.Header>}>
          {optionList}
        </Listbox.Section>
      );
    }

    return optionList;
  }, [loading, willLoadMoreResults, options, buildMappedOptionFromOption, listTitle]);

  const loadingMarkup = loading ? <Listbox.Loading /> : null;

  const emptyStateMarkup = emptyState && !options.length && !loading ? <div role="status">{emptyState}</div> : null;

  const actionMarkup = actionBefore ? <MappedAction {...actionBefore} /> : null;

  const updateSelection = useCallback(
    (newSelection: string) => {
      if (actionBefore && newSelection === actionBefore.content) {
        actionBefore.onAction?.();
        return;
      }

      if (allowMultiple) {
        if (selected.includes(newSelection)) {
          onSelect(selected.filter((option) => option !== newSelection));
        } else {
          onSelect([...selected, newSelection]);
        }
      } else {
        onSelect([newSelection]);
      }
    },
    [allowMultiple, onSelect, selected, actionBefore]
  );

  const autoSelection = actionBefore ? AutoSelection.First : undefined;

  return (
    <Combobox
      activator={textField}
      preferredPosition={preferredPosition}
      header={header}
      allowMultiple={allowMultiple}
      willLoadMoreOptions={willLoadMoreResults}
      onScrolledToBottom={onLoadMoreResults}
    >
      {actionMarkup || optionsMarkup || loadingMarkup || emptyStateMarkup ? (
        <Listbox autoSelection={autoSelection} onSelect={updateSelection}>
          {actionMarkup}
          {optionsMarkup && (!loading || willLoadMoreResults) ? optionsMarkup : null}
          {loadingMarkup}
          {emptyStateMarkup}
        </Listbox>
      ) : null}
    </Combobox>
  );
};

Autocomplete.TextField = Combobox.TextField;
Autocomplete.Select = Combobox.Select;
Autocomplete.HeaderSearch = Combobox.HeaderSearch;
Autocomplete.Header = Combobox.Header;
Autocomplete.HeaderItem = Combobox.HeaderItem;
Autocomplete.HeaderCheckbox = Combobox.HeaderCheckbox;

const StyledSectionWrapper = styled.div``;
