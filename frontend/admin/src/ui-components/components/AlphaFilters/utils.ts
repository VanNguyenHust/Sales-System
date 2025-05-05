import { AlphaFilterGroupInterface, AlphaFilterInterface } from "./types";

export function flattenFilters(filters: (AlphaFilterInterface | AlphaFilterGroupInterface)[]): AlphaFilterInterface[] {
  let flatFilters: AlphaFilterInterface[] = [];

  filters.forEach((filterOrGroup) => {
    if (isGroup(filterOrGroup)) {
      flatFilters = flatFilters.concat(filterOrGroup.filters);
    } else {
      flatFilters.push(filterOrGroup);
    }
  });

  return flatFilters;
}

export function isGroup(filter: AlphaFilterInterface | AlphaFilterGroupInterface): filter is AlphaFilterGroupInterface {
  return typeof filter === "object" && "filters" in filter && filter.filters !== null;
}

export function hasShortcutFilter(filters: (AlphaFilterInterface | AlphaFilterGroupInterface)[]): boolean {
  const flatFilters = flattenFilters(filters);
  const numberShortcutFilter = flatFilters.filter((item) => item.shortcut).length;
  return numberShortcutFilter > 0;
}
