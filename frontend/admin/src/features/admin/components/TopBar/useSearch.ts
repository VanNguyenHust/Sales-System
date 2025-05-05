import { useCallback, useEffect, useRef, useState } from "react";

import { useLazyGetGlobalSearchQuery } from "app/api";
import { usePermission } from "app/features/auth/usePermission";
import { GlobalSearchItemResult, GlobalSearchType } from "app/types";
import { filterNonNull } from "app/utils/arrays";

import { FilterType } from "./constants";

type UseSearchReturn = {
  text: string;
  items: GlobalSearchItemResult[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  focused: boolean;
  limit: number;
  filter: FilterType;
  isSearch: boolean;
  active: boolean;
  selectedItem: GlobalSearchItemResult | "loadMore" | undefined;
  loadMore(): void;
  changeText(value: string): void;
  changeFilter(filter: FilterType): void;
  clearFilter(): void;
  reset(): void;
  activate(): void;
  deactivate(): void;
  selectNext(): void;
  selectPrevious(): void;
  selectedIndex: number;
};

export function useSearch(): UseSearchReturn {
  const limit = 10;
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoadMore, setLoadMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<GlobalSearchItemResult[]>([]);
  const { hasSomePermissions } = usePermission();

  const timeout = useRef<NodeJS.Timeout>();

  const [trigger] = useLazyGetGlobalSearchQuery();

  const fetchData = useCallback(
    async ({
      filter,
      isLoadMore,
      cursor,
      q,
    }: {
      filter: FilterType;
      q: string;
      isLoadMore?: boolean;
      cursor?: string;
    }) => {
      const allFilters = [
        hasSomePermissions(["read_products"]) ? GlobalSearchType.Product : null,
        hasSomePermissions(["read_orders", "read_assigned_orders"]) ? GlobalSearchType.Order : null,
        hasSomePermissions(["customers"]) ? GlobalSearchType.Customer : null,
      ];
      const allAvailableFilters = filterNonNull(allFilters);
      if (allAvailableFilters.length === 0) {
        return;
      }
      setLoading(true);
      const {
        result: { pagination, items },
      } = await trigger({
        filters:
          filter !== "all"
            ? [filter]
            : allAvailableFilters.length === allFilters.length
            ? undefined
            : allAvailableFilters,
        q,
        limit,
        cursor,
      }).unwrap();
      setHasMore(pagination.has_next_page);
      setCursor(pagination.end_cursor);
      setLoading(false);
      if (isLoadMore) {
        setItems((acc) => [...acc, ...items]);
      } else {
        setItems(items);
      }
    },
    [hasSomePermissions, trigger]
  );

  useEffect(() => {
    setLoadMore(false);
    if (debouncedText && active) {
      fetchData({
        filter,
        q: debouncedText,
      });
    } else {
      setItems([]);
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [filter, debouncedText, limit, fetchData, active]);

  useEffect(() => {
    if (active && !focused) {
      setFocused(true);
    }
  }, [active, focused]);

  const changeFilter: UseSearchReturn["changeFilter"] = (filter) => {
    setFilter(filter);
    setFocused(false);
    setSelectedIndex(0);
  };

  const clearFilter: UseSearchReturn["clearFilter"] = () => {
    setFilter("all");
    setFocused(false);
    setSelectedIndex(0);
  };

  const changeText: UseSearchReturn["changeText"] = (value) => {
    setSelectedIndex(0);
    setText(value);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    if (value) {
      timeout.current = setTimeout(() => {
        setDebouncedText(value);
      }, 500);
    } else {
      setDebouncedText("");
    }
  };

  const reset: UseSearchReturn["reset"] = () => {
    setText("");
    setDebouncedText("");
    setFilter("all");
    setSelectedIndex(0);
  };

  const activate: UseSearchReturn["activate"] = () => {
    setFocused(true);
    setActive(true);
    setSelectedIndex(0);
  };

  const deactivate: UseSearchReturn["deactivate"] = () => {
    setFocused(false);
    setActive(false);
    setSelectedIndex(0);
    setText("");
    setDebouncedText("");
    setFilter("all");
  };

  const selectNext: UseSearchReturn["selectNext"] = () => {
    setSelectedIndex((value) => value + 1);
  };

  const selectPrevious: UseSearchReturn["selectPrevious"] = () => {
    setSelectedIndex((value) => value - 1);
  };

  const loadMore = () => {
    setLoadMore(true);
    fetchData({
      filter,
      q: debouncedText,
      isLoadMore: true,
      cursor,
    });
  };

  let selectedItemIndex = -1;
  if (items && items.length) {
    const length = hasMore ? items.length + 1 : items.length;
    selectedItemIndex = selectedIndex >= 0 ? selectedIndex % length : length + (selectedIndex % length);
  }
  const selectedItem: UseSearchReturn["selectedItem"] =
    items && selectedItemIndex >= 0
      ? selectedItemIndex === items.length
        ? "loadMore"
        : items[selectedItemIndex]
      : undefined;

  return {
    focused,
    active,
    text,
    filter,
    isSearch: !!debouncedText,
    selectedItem,
    items,
    isLoading: isLoading && !isLoadMore,
    isLoadingMore: isLoading && isLoadMore,
    hasMore,
    limit,
    loadMore,
    changeText,
    changeFilter,
    clearFilter,
    reset,
    activate,
    deactivate,
    selectNext,
    selectPrevious,
    selectedIndex,
  };
}
