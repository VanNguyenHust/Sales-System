import React, { ReactNode, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Icon, Popover, Scrollable, Spinner, Stack, TextField } from "@/ui-components";
import { SearchIcon } from "@/ui-icons";

import { useToggle } from "app/utils/useToggle";

import { EmptySearchResult } from "../EmptySearchResult";

interface SearchSelectProps<T> {
  /**
   * @default true
   */
  options: T[];
  query: string;
  label?: string;
  inputId?: string;
  loading?: boolean;
  disabled?: boolean;
  emptyState?: ReactNode;
  quickSelectTitle?: string;
  searchPlaceholder?: string;
  onLoadMore?: () => void;
  onQuickSelect?: () => void;
  onSelect?: (value: T) => void;
  onQueryChange: (query: string) => void;
  onQueryClear?: () => void;
  disableOptionCondition?: (option: T) => boolean;
  renderOption: (option: T, disabled: boolean) => React.ReactNode;
}

function SearchSelect2<T>({
  query,
  label,
  options,
  loading,
  inputId,
  disabled,
  emptyState,
  quickSelectTitle,
  searchPlaceholder = "Tìm kiếm",
  onSelect,
  onLoadMore,
  renderOption,
  onQuickSelect,
  onQueryChange,
  onQueryClear,
  disableOptionCondition,
}: SearchSelectProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { value: isActive, toggle: togglePopover, setFalse: closePopover, setTrue: showPopover } = useToggle(false);

  const handleSelect = (value: T) => {
    onSelect?.(value);
    closePopover();
  };

  const handleClickQuickSelect = () => {
    onQuickSelect?.();
    closePopover();
  };

  const handleClose = () => {
    closePopover();
  };

  const emptyStateMarkup = emptyState ? emptyState : <EmptySearchResult />;

  return (
    <StyledRoot ref={rootRef}>
      <Popover
        active={isActive}
        onClose={handleClose}
        preferInputActivator={false}
        fullWidth
        autofocusTarget="none"
        activator={
          <StyledActivatorContainer hasQuickSelect={!!onQuickSelect}>
            <TextField
              clearButton
              id={inputId}
              label={label}
              value={query}
              disabled={disabled}
              onChange={onQueryChange}
              onFocus={showPopover}
              onClearButtonClick={onQueryClear}
              prefix={<Icon source={SearchIcon} color="base" />}
              placeholder={searchPlaceholder}
            />
            {onQuickSelect && (
              <Button disabled={disabled} onClick={handleClickQuickSelect}>
                {quickSelectTitle ? quickSelectTitle : "Chọn nhiều"}
              </Button>
            )}
          </StyledActivatorContainer>
        }
      >
        <Popover.Pane onScrolledToBottom={onLoadMore}>
          {!options.length && !loading ? (
            emptyStateMarkup
          ) : (
            <StyledResultBody>
              {React.Children.toArray(
                options.map((item) => {
                  const isDisabled = disableOptionCondition?.(item) || false;
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
          ) : null}
        </Popover.Pane>
      </Popover>
    </StyledRoot>
  );
}
const StyledRoot = styled.div``;
const StyledResultBody = styled.div``;
const StyledActivatorContainer = styled.div<{ hasQuickSelect?: boolean }>`
  width: 100%;
  display: grid;
  ${(p) =>
    p.hasQuickSelect &&
    css`
      gap: ${p.theme.spacing(4)};
      grid-template-columns: auto max-content;
    `}
`;

const StyledLoading = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
`;
export default SearchSelect2;
