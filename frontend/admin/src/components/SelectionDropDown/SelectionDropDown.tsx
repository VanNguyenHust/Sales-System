import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Icon,
  type OptionDescriptor,
  OptionList,
  Popover,
  Spinner,
  Stack,
  Text,
  TextField,
  Tooltip,
} from "@/ui-components";
import { ArrowCaretDownIcon, ArrowCaretUpIcon, InfoCircleOutlineIcon, SearchIcon } from "@/ui-icons";
import { debounce } from "lodash-es";

import { StopPropagation } from "app/components/StopPropagation";
import { normalizeVietnamese } from "app/utils/text";
import { useToggle } from "app/utils/useToggle";

import { SelectEmptyState } from "../SelectEmptyState";
import { useVirtualizer, VirtualItem } from "../Virtual";

type Error = string | React.ReactElement | (string | React.ReactElement)[];

export const removeAscent = (str: string) => {
  if (str) {
    return normalizeVietnamese(str.toLowerCase(), { transformType: "tone_mark" });
  }
  return str;
};

export type OptionType = {
  /** giá trị String option để thực hiện searchInOption */
  labelString?: string;
} & OptionDescriptor;

export interface SelectionDropDownProps {
  /** Id của dropdown */
  id?: string;
  /** label bên trên dropdown */
  label?: string | React.ReactNode;
  /** placeholder của input search */
  placeholder?: string;
  /** placeholder */
  placeholderSelect?: string;
  /** nội dung hiển thị button dropdown */
  valueDropDown?: string | React.ReactNode;
  /** nội dung hiển thị khi không có dữ liệu */
  emptyValueLabel?: React.ReactNode;
  /** props báo đang loading dữ liệu để không gọi hàm onQueryChange */
  isLoading?: boolean;
  /** option hiển thị */
  options?: OptionType[];
  /** option được chọn mặc định */
  selected?: string | string[];
  /** page hiện tại */
  page?: number;
  /** limit option hiển thị */
  limit?: number;
  /** tổng số option */
  total?: number;
  /** callback khi thay đổi query với searchable hoặc activatorSearch và event khi scroll xuống cuối nếu truyền page, limit và total */
  onQueryChange?(
    query: Partial<{
      query: string;
      page: number;
    }>
  ): void;
  /** callback khi thay đổi option */
  onChange(selected: string | string[]): void;
  /** cho phép tìm kiếm */
  searchable?: boolean;
  /** tìm kiếm trong option */
  searchInOption?: boolean;
  /** thay thế button dropdown bằng ô search */
  activatorSearch?: boolean;
  /** query search */
  query?: string;
  /** Sử dụng virtual để render option - tạm thời chưa thể sử dụng như Infinite scroll vì đang chưa biết cách bắt event khi nào */
  virtual?: boolean;
  /** estimate chiều cao của lineItem với trường hợp custom label option render */
  estimateSize?: (index: number) => number;
  /** prefix button ở phía truớc list option */
  prefixButton?: (togglePopover: () => void, options?: OptionDescriptor[], query?: string) => React.ReactNode;
  /** width của activator */
  withActivator?: number;

  /** cho phép chọn nhiều option */
  allowMultiple?: boolean;
  /** callback khi popover đóng */
  closed?: () => void;
  /** Lỗi hiển thị bên dưới TextField */
  error?: Error | boolean;
  /** disabled button dropdown */
  disabled?: boolean;
  width?: number;
  required?: boolean;

  /** RegExp khi nhập input */
  queryRegex?: RegExp;
  shortcutKeyPress?: string;

  tooltip?: string;
  hidePrefix?: boolean;
  queryMaxLength?: number;
}

const SelectionDropDown = ({
  id,
  label,
  isLoading,
  options = [],
  page,
  valueDropDown,
  limit,
  total,
  onChange,
  searchInOption,
  onQueryChange,
  placeholder,
  prefixButton,
  searchable,
  activatorSearch,
  query,
  virtual,
  selected,
  emptyValueLabel,
  withActivator,
  allowMultiple,
  estimateSize,
  closed,
  error,
  placeholderSelect,
  disabled,
  width,
  required,
  queryRegex,
  shortcutKeyPress,
  tooltip,
  hidePrefix,
  queryMaxLength,
}: SelectionDropDownProps) => {
  const [_isLoading, setIsLoading] = useState(isLoading);
  // debounce set false isLoading
  useEffect(() => {
    if (!isLoading) {
      debounce(() => {
        setIsLoading(isLoading);
      }, 300)();
      return;
    }
    setIsLoading(isLoading);
  }, [isLoading]);
  const [internalItems, setInternalItems] = useState<OptionDescriptor[]>(options);
  useEffect(() => {
    setInternalItems(options);
  }, [options]);
  const [_querySelection, setQuerySelection] = useState(query);
  useEffect(() => {
    setQuerySelection(query);
  }, [query]);
  const {
    value: openSelection,
    setFalse: closeSelection,
    setTrue: setOpenSelection,
    toggle: toggleSelection,
  } = useToggle(false);

  const refClosed = useRef(true);
  useEffect(() => {
    if (!openSelection && !refClosed.current) {
      refClosed.current = true;
      closed?.();
      if (searchInOption) {
        setQuerySelection("");
        setInternalItems(options);
      }
    }
  }, [closed, openSelection, options, searchInOption]);
  useEffect(() => {
    if (refClosed.current && openSelection) {
      refClosed.current = false;
    }
    if (refSearch.current && openSelection) {
      refSearch.current?.querySelector("input")?.focus({ preventScroll: true });
    }
  }, [openSelection]);

  const debounceChangeQuery = useRef(
    debounce((__query: string, __options: OptionType[]) => {
      onQueryChange?.({
        query: __query,
        page: page || 1,
      });
      if (!searchInOption) return;
      if (__query !== undefined && __query !== "") {
        const queryWithoutAscent = removeAscent(__query.trim());
        setInternalItems(__options.filter((item) => removeAscent(item.labelString || "").includes(queryWithoutAscent)));
      } else {
        setInternalItems(__options);
      }
    }, 300)
  ).current;

  const [activatorWidth, setActivatorWidth] = useState(0);
  const activatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateState() {
      if (activatorRef.current) {
        const activatorWrapperWidth = activatorRef.current.offsetWidth || 0;
        setActivatorWidth(activatorWrapperWidth - 60);
      }
    }
    updateState();
    window.addEventListener("resize", updateState);
    return () => {
      window.removeEventListener("resize", updateState);
    };
  }, []);

  const refInputQuery = useRef<HTMLInputElement>(null);

  const refSearch = useRef<HTMLDivElement>(null);

  const handleKeyup = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === shortcutKeyPress) {
        refSearch.current?.querySelector("input")?.focus();
      }
    },
    [shortcutKeyPress]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeyup);
    return () => {
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  const queryMarkup = (
    <StyledButtonOption ref={refInputQuery} id={id}>
      <div ref={refSearch} style={{ width: width ? width : "100%" }}>
        <TextField
          prefix={hidePrefix ? undefined : <Icon source={SearchIcon} color="base" />}
          placeholder={placeholder}
          value={_querySelection ?? ""}
          maxLength={queryMaxLength}
          onChange={(value) => {
            value = queryRegex ? value.replace(queryRegex, "") : value;
            setQuerySelection(value);
            debounceChangeQuery.cancel();
            debounceChangeQuery(value, options);
            if (!openSelection) {
              setOpenSelection();
              onQueryChange?.({
                page: 1,
                query: _querySelection,
              });
            }
          }}
          onFocus={() => {
            if (!openSelection) {
              setOpenSelection();
              onQueryChange?.({
                page: 1,
                query: _querySelection,
              });
            }
          }}
          disabled={disabled}
        />
      </div>
    </StyledButtonOption>
  );

  const activator = activatorSearch ? (
    queryMarkup
  ) : (
    <StyledButtonOption ref={activatorRef} $maxWidth={activatorWidth} $widthActivator={withActivator} id={id}>
      <StopPropagation>
        <StyledSelectorActivator
          disabled={disabled}
          type="button"
          onClick={() => {
            if (searchInOption) {
              setQuerySelection("");
            }
            if (!openSelection) {
              onQueryChange?.({
                page: (page || 0) + 1,
                query: _querySelection,
              });
            }
            toggleSelection();
          }}
          error={!!error}
        >
          {valueDropDown || placeholderSelect ? (
            typeof valueDropDown === "string" || valueDropDown === undefined ? (
              <Text variant="bodyMd" as="span" color={valueDropDown ? undefined : "subdued"}>
                {valueDropDown ? valueDropDown : placeholderSelect}
              </Text>
            ) : (
              valueDropDown
            )
          ) : null}

          <span>
            <Icon
              source={openSelection ? ArrowCaretUpIcon : ArrowCaretDownIcon}
              color={openSelection ? "primary" : "base"}
            />
          </span>
        </StyledSelectorActivator>
      </StopPropagation>
      {error && (
        <div style={{ marginTop: 4 }}>
          <Text as="span" color="critical">
            {error}
          </Text>
        </div>
      )}
    </StyledButtonOption>
  );

  const searchableMarkup = searchable ? <StyledSearchBoxPopover>{queryMarkup}</StyledSearchBoxPopover> : null;

  // region init virtualizer
  const parentRef = useRef<any>();
  const { getVirtualItems, getTotalSize, scrollToIndex } = useVirtualizer({
    count: internalItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      return estimateSize?.(index) || 40;
    },
    overscan: 5,
  });
  const virtualRows: VirtualItem[] = getVirtualItems();
  // endregion
  const refScrollToDefaultSelected = useRef(false);

  useEffect(() => {
    if (!refScrollToDefaultSelected.current && !!selected) {
      const index = internalItems.findIndex((item) => item.value === selected);
      if (index !== -1) {
        refScrollToDefaultSelected.current = true;
        virtual && scrollToIndex(index);
        onChange(selected);
      }
    }
  }, [selected, internalItems, onChange, scrollToIndex, virtual]);
  const fetchNextPage = useCallback(() => {
    debounceChangeQuery.cancel();
    onQueryChange?.({
      page: (page || 0) + 1,
      query: _querySelection,
    });
  }, [_querySelection, debounceChangeQuery, onQueryChange, page]);

  useEffect(() => {
    const [lastItem] = [...virtualRows].reverse();

    if (!lastItem || isLoading || options.length === 0) {
      return;
    }

    if (lastItem.index >= options.length - 1 && (page || 0) * (limit || 0) < (total || 0)) {
      fetchNextPage();
    }
  }, [isLoading, fetchNextPage, limit, options.length, page, total, virtualRows]);

  const refOptionLength = useRef(options.length);
  const debounceScrollToIndex = useRef(
    debounce((index: number) => {
      options?.length && scrollToIndex(index);
    }, 300)
  ).current;
  useEffect(() => {
    if (refOptionLength.current !== options.length) {
      if (refOptionLength.current > options.length) {
        debounceScrollToIndex(0);
      }
      refOptionLength.current = options.length;
    }
  }, [debounceScrollToIndex, options.length, scrollToIndex]);

  const _onChange = useCallback(
    (selected: string | string[]) => {
      if (!allowMultiple) {
        onChange(selected[0]);
        closeSelection();
      } else {
        onChange(selected);
      }
      debounce(() => {
        refInputQuery?.current?.getElementsByTagName("input")[0].focus();
      }, 100)();
    },
    [allowMultiple, closeSelection, onChange]
  );

  const handleClick = useCallback(
    (optionIndex: number) => {
      const selectedValue = internalItems[optionIndex].value;
      const foundIndex = selected?.indexOf(selectedValue) || 0;
      if (allowMultiple) {
        const newSelection =
          foundIndex === -1
            ? [selectedValue, ...(selected || [])]
            : [...(selected?.slice(0, foundIndex) || []), ...(selected?.slice(foundIndex + 1, selected.length) || [])];
        _onChange(newSelection);
        return;
      } else {
        _onChange([selectedValue]);
      }
    },
    [internalItems, selected, allowMultiple, _onChange]
  );

  const optionsMarkup = internalItems.length ? (
    <Popover.Pane
      onScrolledToBottom={() => {
        if (isLoading || !page || !limit || !total || page * limit >= total) {
          return;
        }
        debounceChangeQuery.cancel();
        onQueryChange?.({
          page: page + 1,
          query: _querySelection,
        });
      }}
    >
      <StyledOptionListWrap $maxWidth={activatorWidth}>
        <OptionList
          options={internalItems}
          onChange={(selected) => {
            if (!allowMultiple) {
              onChange(selected[0]);
              closeSelection();
            } else {
              onChange(selected);
            }
            debounce(() => {
              refInputQuery?.current?.getElementsByTagName("input")[0].focus();
            }, 100)();
          }}
          selected={Array.isArray(selected) ? (selected as any[]) : [selected]}
          allowMultiple={allowMultiple}
        />
      </StyledOptionListWrap>
      {isLoading && (
        <Stack distribution="center">
          <Spinner size="small" />
        </Stack>
      )}
    </Popover.Pane>
  ) : (
    <Popover.Pane>
      <Stack distribution="center">
        {_isLoading ? <Spinner size="small" /> : emptyValueLabel || <SelectEmptyState />}
        {}
      </Stack>
    </Popover.Pane>
  );

  const popoverContent = (
    <Popover
      activator={activator}
      preferredAlignment="left"
      preferInputActivator={false}
      fullWidth={width ? false : true}
      active={openSelection}
      onClose={closeSelection}
      autofocusTarget="none"
    >
      {prefixButton || searchableMarkup ? (
        <Popover.Pane fixed>
          {!!prefixButton && (
            <Stack.Item fill>{prefixButton?.(toggleSelection, internalItems, _querySelection)}</Stack.Item>
          )}
          {searchableMarkup}
        </Popover.Pane>
      ) : null}
      {optionsMarkup}
    </Popover>
  );

  if (!label) {
    return popoverContent;
  }

  return (
    <StyledSelectionDropDown>
      {typeof label === "string" ? (
        <StyledLabel style={{ display: "flex", alignItems: "center" }}>
          <Text variant="bodyMd" as="h5">
            {label}
            {required && (
              <Text as="span" color="critical">
                {" "}
                *
              </Text>
            )}
          </Text>
          {tooltip ? (
            <Tooltip content={tooltip} preferredPosition="above" width="wide">
              <StyledHelpTextIcon>
                <InfoCircleOutlineIcon />
              </StyledHelpTextIcon>
            </Tooltip>
          ) : null}
        </StyledLabel>
      ) : (
        label
      )}

      {popoverContent}
    </StyledSelectionDropDown>
  );
};

const StyledSelectionDropDown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledButtonOption = styled.div<{
  $maxWidth?: number;
  $widthActivator?: number;
}>`
  width: 100%;
  button {
    min-height: 36px;
    width: ${({ $widthActivator }) => ($widthActivator ? `${$widthActivator}px` : "100%")};
    > span {
      font-weight: 400;
      line-height: 18px;
      display: block;
      max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : "100%")};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      > span {
        display: block;
        max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : "100%")};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
const StyledSearchBoxPopover = styled.div`
  div {
    border: none !important;
  }
`;

const StyledOptionListWrap = styled.div<{
  $maxWidth?: number;
}>`
  li > button > span {
    width: 100%;
  }
  li > button > p,
  li > div > label > span:last-child > span {
    display: block;
    max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth - 12}px` : "100%")};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledSelectorActivator = styled.button<{ error?: string | boolean }>`
  width: 100%;
  min-height: ${(p) => p.theme.components.form.controlHeight};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border: ${(p) => p.theme.shape.borderBase};
  cursor: pointer;
  text-align: left;
  background-color: ${(p) => (p.disabled ? p.theme.colors.surfacePressed : p.theme.colors.surface)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `calc((${theme.components.form.controlHeight} - ${theme.typography.fontLineHeight3} - ${theme.spacing(
      0.5
    )})/2) ${theme.spacing(3)}`};
  &:hover {
    background-color: ${(p) => (p.disabled ? p.theme.colors.surfacePressed : p.theme.colors.actionSecondaryHovered)};
  }
  &:focus {
    border-color: ${(p) => (p.error ? p.theme.colors.textCritical : p.theme.colors.actionPrimary)};
  }
  ${(p) =>
    p.error &&
    css`
      border-color: ${p.theme.colors.textCritical};
    `}
`;

const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledHelpTextIcon = styled.span`
  color: ${(p) => p.theme.colors.textPrimary};
  width: ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(4)};
  display: block;
`;
export default SelectionDropDown;
