import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { FilterIcon, SearchIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { useToggle } from "../../utils/useToggle";
import { Icon } from "../Icon";
import { TextField } from "../TextField";

import { AllFilters } from "./AllFilters";
import { ConnectedFilterControl } from "./ConnectedFilterControl";
import { FiltersContext, FiltersContextType } from "./context";
import { FilterButton } from "./FilterButton";
import { Item } from "./Item";
import { NoItem } from "./NoItem";
import { OptionCheckbox, OptionItem, OptionSearch } from "./OptionItem";
import { Pane } from "./Pane";
import { Tags } from "./Tags";
import { AlphaAppliedFilterInterface, AlphaFilterGroupInterface, AlphaFilterInterface } from "./types";
import { flattenFilters, hasShortcutFilter } from "./utils";

export interface AlphaFiltersProps {
  /** Vô hiệu hoá bộ lọc */
  disabled?: boolean;
  /** Ẩn tags bộ lọc */
  hideTags?: boolean;
  /** Cuộn các item sau chỉ số cho trước (1-based index) */
  tagsRollupAfter?: number;
  /** Giá trị ô tìm kiếm */
  queryValue?: string;
  /** Placeholder của ô tìm kiếm */
  queryPlaceholder?: string;
  /** Ẩn ô tìm kiếm */
  hideQueryField?: boolean;
  /** Vô hiêu hoá ô tìm kiếm */
  disableQueryField?: boolean;
  /** Nội dung hiển thị bên cạnh bộ lọc */
  children?: React.ReactNode;
  /** Text hiển thị bổ sung bên dưới bộ lọc */
  helpText?: string | React.ReactNode;
  /** Các bộ lọc */
  filters?: (AlphaFilterInterface | AlphaFilterGroupInterface)[];
  /** Các bộ lọc đang được áp dụng */
  appliedFilters?: AlphaAppliedFilterInterface[];
  /** Hiển thị search bộ lọc trong sheet */
  showSearchFilter?: boolean;
  /** Custom logic search bộ lọc trong sheet */
  searchFilterFunc?: (label: string, query: string) => boolean;
  /** Hành động khi nội dung tìm kiếm thay đổi */
  onQueryChange?(queryValue: string): void;
  /** Hành động khi ô tìm kiếm được focus */
  onQueryFocus?(): void;
  /** Hành động khi click vào button xoá trên ô tìm kiếm */
  onQueryClear?(): void;
  /** Hành động khi ô tìm kiếm được blur */
  onQueryBlur?(): void;
  /** Hành động khi ấn button lọc trong sheet */
  onSubmit?(): void;
  /** Hành động khi ấn button xoá bộ lọc trong sheet*/
  onClearAll(): void;
  /** Callback khi mở sheet */
  onSheetOpen?(): void;
}

function noOp() {}

/**
 * Danh sách bộ lọc được tạo bởi tập hợp các component khác nhau được dùng để lọc cho danh sách hoặc bảng
 */
export const AlphaFilters: React.FC<AlphaFiltersProps> & {
  Item: typeof Item;
  NoItem: typeof NoItem;
  Pane: typeof Pane;
  OptionItem: typeof OptionItem;
  OptionSearch: typeof OptionSearch;
  OptionCheckbox: typeof OptionCheckbox;
} = ({
  filters = [],
  children,
  helpText,
  hideTags,
  queryValue = "",
  appliedFilters = [],
  hideQueryField,
  disabled,
  queryPlaceholder,
  disableQueryField,
  tagsRollupAfter,
  showSearchFilter,
  onSubmit,
  searchFilterFunc,
  onQueryChange = noOp,
  onQueryFocus,
  onQueryClear = noOp,
  onQueryBlur,
  onClearAll,
  onSheetOpen,
}) => {
  const i18n = useI18n();
  const { value: showMoreFilters, setFalse: dismissMoreFilter, toggle: toggleMoreFilters } = useToggle(false);

  const flatFilters = flattenFilters(filters);
  const appliedFiltersCount = appliedFilters.length;

  const tagsMarkup =
    appliedFiltersCount > 0 && !hideTags ? (
      <Tags items={appliedFilters} disabled={disabled} tagsRollupAfter={tagsRollupAfter} />
    ) : null;

  const clearFilter = useCallback(
    (key: string) => {
      appliedFilters.forEach((item) => {
        if (item.key === key) item.onRemove(key);
      });
    },
    [appliedFilters]
  );

  const handleMoreFilterClick = () => {
    if (!showMoreFilters) {
      onSheetOpen?.();
    }
    toggleMoreFilters();
  };

  const context = useMemo(
    (): FiltersContextType => ({
      clearFilter,
      appliedFilters,
    }),
    [appliedFilters, clearFilter]
  );

  const moreFiltersMarkup = flatFilters.length ? (
    <FilterButton onClick={handleMoreFilterClick} icon={FilterIcon} disabled={disabled} first last>
      {hasShortcutFilter(filters) ? i18n.translate("UI.Filters.moreFilters") : i18n.translate("UI.Filters.filter")}
    </FilterButton>
  ) : null;

  const transformedFilters = flatFilters.filter((filter) => filter.shortcut);

  const filterControlMarkup = (
    <ConnectedFilterControl
      shortcuts={transformedFilters}
      moreFilters={moreFiltersMarkup}
      auxiliary={children}
      disabled={disabled}
      queryFieldHidden={hideQueryField}
      forceShowMorefiltersButton={flatFilters.length > transformedFilters.length}
    >
      {!hideQueryField ? (
        <TextField
          clearButton
          value={queryValue}
          disabled={disabled || disableQueryField}
          placeholder={queryPlaceholder}
          onBlur={onQueryBlur}
          onFocus={onQueryFocus}
          onChange={onQueryChange}
          onClearButtonClick={onQueryClear}
          prefix={<Icon source={SearchIcon} color="base" />}
        />
      ) : null}
    </ConnectedFilterControl>
  );

  return (
    <FiltersContext.Provider value={context}>
      <StyledFilters role="filters" aria-expanded={showMoreFilters ? "true" : "false"}>
        {filterControlMarkup}
        {tagsMarkup}
        {helpText}
        <AllFilters
          open={showMoreFilters}
          dismissToggle={dismissMoreFilter}
          filters={filters}
          showSearchFilter={showSearchFilter}
          searchFilterFunc={searchFilterFunc}
          onSubmit={onSubmit}
          onClearAll={onClearAll}
        />
      </StyledFilters>
    </FiltersContext.Provider>
  );
};

AlphaFilters.Item = Item;
AlphaFilters.NoItem = NoItem;
AlphaFilters.Pane = Pane;
AlphaFilters.OptionItem = OptionItem;
AlphaFilters.OptionCheckbox = OptionCheckbox;
AlphaFilters.OptionSearch = OptionSearch;

const StyledFilters = styled.div``;
