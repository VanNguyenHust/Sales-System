import React from "react";

import { Cell } from "./Cell";
import { IndexProvider } from "./context";
import { IndexTableBase } from "./IndexTableBase";
import { Row } from "./Row";
import { IndexTableProps } from "./types";

export const IndexTable: React.FC<IndexTableProps> & {
  Cell: typeof Cell;
  Row: typeof Row;
} = ({
  selectable = true,
  itemCount,
  selectedItemsCount = 0,
  resourceName,
  loading,
  hasMoreItems,
  condensed,
  defaultSortDirection = "descending",
  onSelectionChange,
  ...indexTableBaseProps
}) => {
  return (
    <IndexProvider
      selectable={selectable}
      itemCount={itemCount}
      selectedItemsCount={selectedItemsCount}
      resourceName={resourceName}
      loading={loading}
      hasMoreItems={hasMoreItems}
      condensed={condensed}
      onSelectionChange={onSelectionChange}
    >
      <IndexTableBase {...indexTableBaseProps} selectable={selectable} defaultSortDirection={defaultSortDirection} />
    </IndexProvider>
  );
};
IndexTable.Cell = Cell;
IndexTable.Row = Row;
