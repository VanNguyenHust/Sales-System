import { createContext, useContext } from "react";

import { AppliedFilterInterface } from "./types";

export interface FiltersContextType {
  appliedFilters: AppliedFilterInterface[];
  clearFilter(key: string): void;
}

export interface FilterItemContentType {
  inGroup?: boolean;
  inShortcut?: boolean;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FilterItemContext = createContext<FilterItemContentType | undefined>(undefined);

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("No Filters context was provided. Your component must be wrapped in a <Filters > component");
  }
  return context;
}

export function useFilterItem() {
  const context = useContext(FilterItemContext);
  if (!context) {
    throw new Error(
      "No FilterItem context was provided. Your component must be wrapped in a <Filters.Item > component"
    );
  }
  return context;
}
