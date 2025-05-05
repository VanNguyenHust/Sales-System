import React, { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Checkbox,
  Icon,
  type OptionDescriptor,
  OptionList,
  Scrollable,
  Spinner,
  Stack,
  Text,
  TextField,
} from "@/ui-components";
import { SearchIcon } from "@/ui-icons";
import { debounce } from "lodash-es";

import { SelectEmptyState } from "../SelectEmptyState";
import { useVirtualizer, VirtualItem } from "../Virtual";

export interface QuickFilterDropdownProps {
  /** option hiển thị */
  options: OptionDescriptor[];
  /** tổng số option */
  totalItem: number;
  /** page hiện tại */
  page: number;
  /** limit option hiển thị */
  limit?: number;
  /** callback khi thay đổi option */
  onChange(selected: string[]): void;
  /** callback khi thay đổi query */
  onChangeQuery(query: string): void;
  /** callback khi scroll xuống cuối */
  onPageChange(page: number): void;
  /** option đã chọn */
  selected: string[];
  /** loading */
  isLoading: boolean;
  /** hiển thị chọn tất cả */
  withSelectAllAvailable?: boolean;
  /** sử dụng trong bộ lọc khác khi không được wrap bằng popover */
  withOutPopover?: boolean;
  /** Bỏ phần search */
  withOutSearchable?: boolean;
  /** Bỏ phần search */
  singleSelection?: boolean;
  /** prefix button ở phía truớc list option */
  prefixButton?: React.ReactNode;

  query?: string;
  disabled?: boolean;
}

const QuickFilterDropdown = ({
  options,
  onChange,
  selected,
  onPageChange,
  onChangeQuery,
  totalItem,
  limit = 10,
  isLoading,
  withSelectAllAvailable,
  withOutPopover,
  withOutSearchable,
  singleSelection,
  prefixButton,
  query,
  page: propsPage,
  disabled,
}: QuickFilterDropdownProps) => {
  const [page, setPage] = useState(propsPage);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected);
  const refRender = useRef(false);
  useEffect(() => {
    if (refRender.current) {
      return;
    }
    refRender.current = true;
    onPageChange(page);
  }, [onPageChange, page]);

  useEffect(() => {
    setPage(propsPage);
  }, [propsPage]);

  const refInputQuery = useRef<HTMLInputElement>(null);
  const onChangeSelected = useCallback(
    (selected: string[]) => {
      debounce(() => {
        refInputQuery?.current?.getElementsByTagName("input")[0].focus();
      }, 100)();
      setSelectedOptions(selected);
      onChange(selected);
    },
    [onChange]
  );
  const [_query, setQuery] = useState(query || "");

  useEffect(() => {
    setQuery(query || "");
  }, [query]);

  useEffect(() => {
    setSelectedOptions(selected);
  }, [selected]);

  const debounceChangeQuery = useRef(
    debounce((__query: string) => {
      onChangeQuery(__query);
    }, 300)
  ).current;

  useEffect(() => {
    debounceChangeQuery.cancel();
    debounceChangeQuery(_query);
  }, [_query, debounceChangeQuery]);

  // region init virtualizer
  const parentRef = useRef<any>();
  const { getVirtualItems, scrollToIndex } = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => {
      return 36;
    },
    overscan: 5,
  });
  const virtualRows: VirtualItem[] = getVirtualItems();

  const fetchNextPage = useCallback(() => {
    if (isLoading || page * limit >= totalItem) {
      return;
    }
    debounceChangeQuery.cancel();
    onPageChange(page + 1);
    setPage(page + 1);
  }, [debounceChangeQuery, isLoading, limit, onPageChange, page, totalItem, setPage]);

  const refFetchingNextPage = useRef(true);

  useEffect(() => {
    const [lastItem] = [...virtualRows].reverse();

    if (!lastItem || isLoading || options.length === 0 || refFetchingNextPage.current) {
      return;
    }

    if (lastItem.index >= options.length - 1 && page * limit < totalItem) {
      refFetchingNextPage.current = true;
      fetchNextPage();
    }
  }, [isLoading, fetchNextPage, limit, options.length, page, totalItem, virtualRows]);

  const refOptionLength = useRef(options.length);

  useEffect(() => {
    if (refOptionLength.current !== options.length) {
      if (refOptionLength.current && options.length && refOptionLength.current > options.length) {
        scrollToIndex(0);
      }
      refOptionLength.current = options.length;
      refFetchingNextPage.current = false;
    }
  }, [options.length, scrollToIndex]);

  return (
    <StyledDropDownWrap withOutPopover={withOutPopover}>
      <Stack vertical>
        {!withOutSearchable && (
          <Stack.Item fill>
            <StyledSearchWrap ref={refInputQuery}>
              <TextField
                prefix={<Icon source={SearchIcon} color="base" />}
                placeholder="Tìm kiếm"
                value={_query}
                autoFocus
                onChange={(value) => {
                  setQuery(value);
                }}
                disabled={disabled}
              />
            </StyledSearchWrap>
          </Stack.Item>
        )}

        {prefixButton}
        {withSelectAllAvailable && !singleSelection && (
          <Stack.Item fill>
            <StyledSelectionWrap style={{ paddingTop: withOutSearchable ? "24px" : "12px" }}>
              <Checkbox
                label="Chọn tất cả"
                checked={
                  options.length === 0
                    ? false
                    : selectedOptions.length === options.length
                    ? true
                    : selectedOptions.length > 0
                    ? "indeterminate"
                    : false
                }
                onChange={() => {
                  if (selectedOptions.length === options.length) {
                    onChangeSelected([]);
                  } else {
                    onChangeSelected(options.map((option) => option.value));
                  }
                }}
              />
            </StyledSelectionWrap>
          </Stack.Item>
        )}
        {!withSelectAllAvailable && withOutSearchable && <Stack.Item />}

        <Stack.Item fill>
          <StyledSelectionWrap $lastItem>
            <Scrollable
              onScrolledToBottom={() => {
                if (isLoading) {
                  return;
                }
                if (!(page * limit < totalItem)) return;
                setPage((prevState) => {
                  onPageChange(prevState + 1);
                  return prevState + 1;
                });
              }}
              style={{ maxHeight: "200px", minHeight: "100px", marginLeft: "-12px", marginRight: "-16px" }}
            >
              <OptionList
                options={options}
                onChange={onChangeSelected}
                selected={selectedOptions}
                allowMultiple={!singleSelection}
              />
              {isLoading ? (
                <Stack distribution="center">
                  <Spinner size="small" />
                </Stack>
              ) : (
                options.length === 0 && <SelectEmptyState />
              )}
            </Scrollable>
          </StyledSelectionWrap>
        </Stack.Item>
      </Stack>
    </StyledDropDownWrap>
  );
};

const StyledSelectionWrap = styled.div<{
  $lastItem?: boolean;
}>`
  ${(p) =>
    !p.$lastItem &&
    css`
      border-bottom: 1px solid #e8eaeb;
    `}

  margin-top: -16px;
  padding: 8px 16px;

  li label span:last-child > span {
    display: block;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const StyledDropDownWrap = styled.div<{
  withOutPopover?: boolean;
}>`
  min-width: 300px;
  ${(p) =>
    p.withOutPopover &&
    css`
      border: 1px solid #e8eaeb;
      /* padding-top: 16px; */
      border-radius: 8px;
      margin: 0;
    `}
`;
const StyledSearchWrap = styled.div`
  border-bottom: 1px solid #e8eaeb;
  margin-top: 0;
  div {
    border: none !important;
  }
`;

export default QuickFilterDropdown;
