import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { useI18n } from "../../utils/i18n";
import { WithinContentContext } from "../../utils/within-content";

import { IndexProviderProps, Range, SelectionType } from "./types";

export interface OffsetContextType {
  prefix?: string;
  checkbox?: string;
  onPrefixChange?: (value: string) => void;
  onCheckboxChange?: (value: string) => void;
}
export const OffsetContext = createContext<OffsetContextType>({});

export interface RowContextType {
  itemId?: string;
  position?: number;
  selected?: boolean;
  disabled?: boolean;
  onInteraction?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
export const RowContext = createContext<RowContextType>({});

export const RowHoveredContext = createContext<boolean | undefined>(undefined);

export interface IndexContextType {
  loading?: boolean;
  bulkSelectState?: boolean | "indeterminate";
  resourceName: {
    singular: string;
    plural: string;
  };
  selectedItemsCount: number | "All";
  selectMode: boolean;
  itemCount: number;
  selectable?: boolean;
  hasMoreItems?: boolean;
  condensed?: boolean;
}
export const IndexContext = createContext<IndexContextType | undefined>(undefined);

export interface IndexRowContextType {
  selectable: boolean;
  selectMode: boolean;
  condensed?: boolean;
}
export const IndexRowContext = createContext<IndexRowContextType | undefined>(undefined);

export const IndexSelectionChangeContext = createContext<
  | ((selectionType: SelectionType, toggleType: boolean, selection?: string | Range, position?: number) => void)
  | undefined
>(undefined);

export function IndexProvider({
  children,
  resourceName: passedResourceName,
  loading,
  onSelectionChange,
  selectedItemsCount = 0,
  itemCount,
  hasMoreItems,
  condensed,
  selectable: isSelectableIndex = true,
}: IndexProviderProps) {
  const { resourceName, selectMode, bulkSelectState } = useBulkSelectionData({
    selectedItemsCount,
    itemCount,
    hasMoreItems,
    resourceName: passedResourceName,
  });
  const handleSelectionChange = useHandleBulkSelection({ onSelectionChange });
  const [offsetPrefix, setOffsetPrefix] = useState<string | undefined>(undefined);
  const [offsetCheckbox, setOffsetCheckbox] = useState<string | undefined>(undefined);

  const contextValue = useMemo(
    (): IndexContextType => ({
      itemCount,
      selectMode: selectMode && isSelectableIndex,
      selectable: isSelectableIndex,
      resourceName,
      loading,
      hasMoreItems,
      bulkSelectState,
      selectedItemsCount,
      condensed,
    }),
    [
      itemCount,
      selectMode,
      isSelectableIndex,
      resourceName,
      loading,
      hasMoreItems,
      bulkSelectState,
      selectedItemsCount,
      condensed,
    ]
  );

  const rowContextValue = useMemo(
    (): IndexRowContextType => ({
      selectable: isSelectableIndex,
      selectMode: selectMode && isSelectableIndex,
      condensed,
    }),
    [isSelectableIndex, selectMode, condensed]
  );

  const offsetContextValue = useMemo(
    (): OffsetContextType => ({
      prefix: offsetPrefix,
      checkbox: offsetCheckbox,
      onPrefixChange: setOffsetPrefix,
      onCheckboxChange: setOffsetCheckbox,
    }),
    [offsetPrefix, offsetCheckbox]
  );

  return (
    <IndexContext.Provider value={contextValue}>
      <OffsetContext.Provider value={offsetContextValue}>
        <IndexRowContext.Provider value={rowContextValue}>
          <IndexSelectionChangeContext.Provider value={handleSelectionChange}>
            <WithinContentContext.Provider value>{children}</WithinContentContext.Provider>
          </IndexSelectionChangeContext.Provider>
        </IndexRowContext.Provider>
      </OffsetContext.Provider>
    </IndexContext.Provider>
  );
}

interface BulkSelectionDataOptions {
  selectedItemsCount: number | "All";
  itemCount: number;
  hasMoreItems?: boolean;
  resourceName?: {
    singular: string;
    plural: string;
  };
}

export function useBulkSelectionData({
  selectedItemsCount,
  itemCount,
  resourceName: passedResourceName,
}: BulkSelectionDataOptions) {
  const i18n = useI18n();
  const selectable = Boolean(selectedItemsCount);
  const selectMode = selectedItemsCount === "All" || selectedItemsCount > 0;

  const defaultResourceName = {
    singular: i18n.translate("UI.IndexTable.defaultResourceNameSingular"),
    plural: i18n.translate("UI.IndexTable.defaultResourceNamePlural"),
  };

  const resourceName = passedResourceName ? passedResourceName : defaultResourceName;

  let bulkSelectState: boolean | "indeterminate" | undefined = "indeterminate";
  if (selectedItemsCount === "All") {
    bulkSelectState = true;
  } else if (!selectedItemsCount || selectedItemsCount === 0) {
    bulkSelectState = undefined;
  } else if (selectedItemsCount === itemCount) {
    bulkSelectState = true;
  }

  return {
    resourceName,
    selectMode,
    bulkSelectState,
    selectable,
  };
}

type HandleSelectionChange = IndexProviderProps["onSelectionChange"];

interface HandleBulkSelectionOptions {
  onSelectionChange: IndexProviderProps["onSelectionChange"];
}

export function useHandleBulkSelection({ onSelectionChange = () => {} }: HandleBulkSelectionOptions) {
  const lastSelected = useRef<number | null>(null);

  const handleSelectionChange: HandleSelectionChange = useCallback(
    (selectionType: SelectionType, toggleType: boolean, selection?: string | Range, sortOrder?: number) => {
      const prevSelected = lastSelected.current;
      if (SelectionType.Multi && typeof sortOrder === "number") {
        lastSelected.current = sortOrder;
      }

      if (
        selectionType === SelectionType.Single ||
        (selectionType === SelectionType.Multi && (typeof prevSelected !== "number" || typeof sortOrder !== "number"))
      ) {
        onSelectionChange(SelectionType.Single, toggleType, selection);
      } else if (selectionType === SelectionType.Multi) {
        const min = Math.min(prevSelected as number, sortOrder as number);
        const max = Math.max(prevSelected as number, sortOrder as number);
        onSelectionChange(selectionType, toggleType, [min, max]);
      } else if (selectionType === SelectionType.Page || selectionType === SelectionType.All) {
        onSelectionChange(selectionType, toggleType);
      }
    },
    [onSelectionChange]
  );

  return handleSelectionChange;
}

export function useIndexSelectionChange() {
  const onSelectionChange = useContext(IndexSelectionChangeContext);
  if (!onSelectionChange) {
    throw new Error(`Missing IndexProvider context`);
  }
  return onSelectionChange;
}

export function useIndexRow() {
  const indexRow = useContext(IndexRowContext);
  if (!indexRow) {
    throw new Error(`Missing IndexProvider context`);
  }
  return indexRow;
}

export function useIndexValue() {
  const index = useContext(IndexContext);
  if (!index) {
    throw new Error(`Missing IndexProvider context`);
  }
  return index;
}

export interface ScrollContextType {
  scrollableContainer: HTMLDivElement | null;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}
export const scrollDefaultContext: ScrollContextType = {
  scrollableContainer: null,
  canScrollLeft: false,
  canScrollRight: false,
};
export const ScrollContext = createContext<ScrollContextType>(scrollDefaultContext);
