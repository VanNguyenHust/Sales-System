import React, { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Icon, Popover, Scrollable, Spinner, Stack, Text, TextField } from "@/ui-components";
import { SearchIcon } from "@/ui-icons";
import { useDebounce } from "use-debounce";

import { DataSource } from "app/types";
import { useToggle } from "app/utils/useToggle";

interface SearchSelectProps<T> {
  fetchOptions: (page: number, limit: number, query?: string) => Promise<DataSource<T>>;
  onSelect?: (value: T) => void;
  limit?: number;
  renderOption: (option: T, disabled: boolean) => React.ReactNode;
  disableItemCondition?: (option: T) => boolean;
  closeOnSelect?: boolean;
  //**Hiển thị và hành động lúc ấn nút thêm nhanh */
  onQuickSelect?: () => void;
  //**Custom title cho nút thêm nhanh */
  quickSelectTitle?: string;
  inputId?: string;
}

function SearchSelect<T>({
  inputId,
  onSelect,
  fetchOptions,
  renderOption,
  limit = 10,
  onQuickSelect,
  quickSelectTitle,
  disableItemCondition,
  closeOnSelect = true,
}: SearchSelectProps<T>) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [queryHasChanged, setQueryHasChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataSource<T>>({ data: [], total: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const closePopover = () => {
    setOpenPopover(false);
  };
  const showPopover = () => {
    setOpenPopover(true);
  };

  const options = dataSource.data;
  const total = dataSource.total;
  const [debounceQuery] = useDebounce(query, 300);

  const handleFetchData = useCallback(
    async (_page: number, isQueryChange?: boolean) => {
      if (!openPopover) return;
      setLoading(true);
      fetchOptions(_page, limit, debounceQuery)
        .then((result) => {
          setDataSource((state) =>
            isQueryChange ? result : { data: [...state.data, ...result.data], total: result.total }
          );
          setTimeout(() => setLoading(false), 300);
        })
        .catch(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [limit, debounceQuery, openPopover]
  );

  useEffect(() => {
    if (!openPopover) {
      setPage(1);
      setDataSource({ data: [], total: 0 });
      setQuery("");
    } else {
      handleFetchData(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopover]);

  useEffect(() => {
    if (queryHasChanged) {
      setPage(1);
      handleFetchData(1, true);
    }
  }, [debounceQuery, handleFetchData, queryHasChanged]);

  const handleScrollToBottom = useCallback(() => {
    if (loading || page * limit >= total) {
      return;
    }
    handleFetchData(page + 1);
    setPage((state) => state + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page, limit, total]);

  const handleSelect = (value: T) => {
    onSelect?.(value);
    if (closeOnSelect) closePopover();
  };

  const handleClickQuickSelect = () => {
    onQuickSelect?.();
    closePopover();
  };

  const handleClose = () => {
    closePopover();
  };

  return (
    <StyledRoot ref={rootRef}>
      <Popover
        active={openPopover}
        onClose={handleClose}
        preferInputActivator={false}
        fullWidth
        fullHeight
        activator={
          <StyledActivatorContainer hasShowMore={!!onQuickSelect}>
            <TextField
              id={inputId}
              value={query}
              onChange={(value) => {
                setQuery(value);
                setQueryHasChanged(true);
              }}
              onFocus={() => {
                showPopover();
              }}
              prefix={<Icon source={SearchIcon} />}
              placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
            />
            {onQuickSelect && (
              <Button onClick={handleClickQuickSelect}>{quickSelectTitle ? quickSelectTitle : "Chọn nhiều"}</Button>
            )}
          </StyledActivatorContainer>
        }
      >
        <Scrollable onScrolledToBottom={handleScrollToBottom} style={{ maxHeight: "400px" }}>
          {total > 0 && (
            <StyledResultBody>
              {React.Children.toArray(
                options.map((item) => {
                  const isDisabled = disableItemCondition?.(item) || false;
                  return <div onClick={() => !isDisabled && handleSelect(item)}>{renderOption(item, isDisabled)}</div>;
                })
              )}
            </StyledResultBody>
          )}
          {loading ? (
            <StyledLoading>
              <Stack distribution="center">
                <Spinner size="small" />
              </Stack>
            </StyledLoading>
          ) : total > 0 ? null : (
            <StyledNonRecord>
              <Text variant="bodyMd" as="p">
                Không có kết quả
              </Text>
            </StyledNonRecord>
          )}
        </Scrollable>
      </Popover>
    </StyledRoot>
  );
}
const StyledRoot = styled.div``;
const StyledResultBody = styled.div``;
const StyledActivatorContainer = styled.div<{ hasShowMore?: boolean }>`
  width: 100%;
  display: grid;
  ${(p) =>
    p.hasShowMore &&
    css`
      gap: ${p.theme.spacing(4)};
      grid-template-columns: auto max-content;
    `}
`;

const StyledLoading = styled.div`
  border-bottom: 1px solid #e8eaeb;
  padding: ${(p) => p.theme.spacing(4)};
  &:hover {
    background-color: #f2f9ff;
  }
  &:active {
    background-color: #e6f4ff;
  }
`;

const StyledNonRecord = styled.div`
  padding: ${(p) => p.theme.spacing(5)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default SearchSelect;
