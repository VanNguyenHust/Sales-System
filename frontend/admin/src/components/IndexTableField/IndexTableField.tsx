import React, { Children, cloneElement, useCallback, useMemo } from "react";
import { IndexTable, type IndexTableHeading, type IndexTableProps } from "@/ui-components";

export type IndexTableFieldHeading = IndexTableHeading & { key: string; sort?: boolean };
export interface IndexTableFieldProps extends Omit<IndexTableProps, "headings"> {
  headings: IndexTableFieldHeading[];
  settingColumns: { [key: string]: boolean };
}

const IndexTableField: React.FC<IndexTableFieldProps> & {
  Cell: typeof IndexTable.Cell;
  Row: typeof IndexTable.Row;
} = ({ headings, settingColumns, children, ...rest }: IndexTableFieldProps) => {
  const getColumnOrder = useCallback(() => {
    const indexSorts: { index: number; isShow: boolean }[] = [];
    const newHeadings = Object.entries(settingColumns).map(([key, value]) => {
      const heading = headings.find((i) => i.key === key);
      const currentIndex = headings.findIndex((i) => i.key === key);
      indexSorts.push({ index: currentIndex, isShow: value });
      return value ? heading : null;
    });
    return { newHeadings: newHeadings.filter(Boolean), indexSorts };
  }, [headings, settingColumns]);

  const { newHeadings, indexSorts } = getColumnOrder();

  const updatedChildren = useMemo(() => {
    return Children.toArray(children)
      .map((child: React.ReactNode) => {
        return React.isValidElement(child) && React.Fragment === child.type ? child.props.children : child;
      })
      .flat()
      .map((row) => {
        if (!isIndexTableRow(row)) {
          return row;
        }
        const cell = Children.toArray(row.props.children).filter(isIndexTableCell);
        const cellSorted = indexSorts.filter((item) => item.isShow).map((item) => cell[item.index]);
        return cloneElement(row, { ...row.props, children: cellSorted });
      });
  }, [children, indexSorts]);

  return (
    <IndexTable
      headings={newHeadings as any}
      {...rest}
      sortable={rest?.sortable ?? newHeadings.map((item) => item?.sort ?? false)}
    >
      {updatedChildren}
    </IndexTable>
  );
};

IndexTableField.Cell = IndexTable.Cell;
IndexTableField.Row = IndexTable.Row;

export default IndexTableField;

const isIndexTableRow = (child: React.ReactNode): child is React.ReactElement => {
  return React.isValidElement(child) && child.type === IndexTableField.Row;
};
const isIndexTableCell = (child: React.ReactNode): child is React.ReactElement => {
  return React.isValidElement(child) && child.type === IndexTableField.Cell;
};
