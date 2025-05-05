import { FilterGroupInterface, FilterInterface } from "./types";

export function flattenFilters(filters: (FilterInterface | FilterGroupInterface)[]): FilterInterface[] {
  let flatFilters: FilterInterface[] = [];

  filters.forEach((filterOrGroup) => {
    if (isGroup(filterOrGroup)) {
      flatFilters = flatFilters.concat(filterOrGroup.filters);
    } else {
      flatFilters.push(filterOrGroup);
    }
  });

  return flatFilters;
}

export function isGroup(filter: FilterInterface | FilterGroupInterface): filter is FilterGroupInterface {
  return typeof filter === "object" && "filters" in filter && filter.filters !== null;
}

export function hasShortcutFilter(filters: (FilterInterface | FilterGroupInterface)[]): boolean {
  const flatFilters = flattenFilters(filters);
  const numberShortcutFilter = flatFilters.filter((item) => item.shortcut).length;
  return numberShortcutFilter > 0;
}
