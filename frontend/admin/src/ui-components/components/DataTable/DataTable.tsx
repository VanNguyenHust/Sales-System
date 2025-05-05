import React, { createRef, FocusEventHandler, forwardRef, useImperativeHandle, useRef } from "react";
import type { JSX } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { debounce, isEqual } from "lodash-es";

import { useI18n } from "../../utils/i18n";
import { headerCell } from "../../utils/shared";
import { AfterInitialMount } from "../IndexTable/AfterInitialMount";
import { LoadingPanel } from "../IndexTable/LoadingPanel";
import { Sticky } from "../StickyManager/Sticky";

import { Cell, CellProps } from "./Cell";
import { EventListener } from "./EventListener";
import { ColumnContentType, DataTableState, SortDirection, TableData, VerticalAlign } from "./types";
import { getPrevAndCurrentColumns, getRowClientHeights, measureColumn } from "./utils";

export interface DataTableProps {
  /**
   * Danh sách kiểu dữ liệu của cột được dùng để căn lề cho cột. Kiểu "text" được căn trái, kiểu "numeric" được căn phải
   * */
  columnContentTypes: ColumnContentType[];
  /** Danh sách heading */
  headings: React.ReactNode[];
  /**
   * Danh sách heading thứ cấp dùng để tạo heading chồng trên "headings" và merge các heading lại với nhau.
   *
   * Quy tắc merge:
   * - Sử dụng "undefined" nếu muốn giữ nguyên heading không merge
   * - Sử dụng giá trị khác "undefined", giá trị này sẽ được merge liên tiếp với các giá trị rỗng tiếp theo để tạo merge heading. Quá trình merge dừng lại khi giá trị tiếp theo là "undefined" hoặc khác rỗng
   * */
  secondaryHeadings?: React.ReactNode[];
  /** Danh sách dữ liệu biểu diễn các tổng giá trị cho cột. Sử dụng chuỗi rỗng như placeholder nếu cột không có tổng giá trị */
  totals?: TableData[];
  /** Custom cho tên heading tổng giá trị */
  totalsName?: {
    singular: React.ReactNode;
    plural: React.ReactNode;
  };
  /** Đặt row tổng giá trị bên dưới thay vì bên trên như mặc định */
  showTotalsInFooter?: boolean;
  /** Danh sách dataset */
  rows: TableData[][];
  /**
   * Truncate nội dung các ô thay vì wrap
   */
  truncate?: boolean;
  /**
   * Căn dọc cho tất cả các ô
   * @default 'top'
   */
  verticalAlign?: VerticalAlign;
  /** Nội dung của footer row, được hiển thị căn giữa */
  footerContent?: TableData;
  /**
   * Cho phép hiển thị trạng thái hover của row
   * @default true
   * */
  hoverable?: boolean;
  /** Mảng boolean định nghĩa cột nào có thể sắp xếp, cột nào không. Mặc định là false cho tất cả các cột.  */
  sortable?: boolean[];
  /**
   * Hướng sắp xếp mặc định trong bảng khi lần đầu click vào cột
   * @default 'ascending'
   * */
  defaultSortDirection?: SortDirection;
  /**
   * Chỉ số của cột khởi tạo cho sắp xếp
   * @default 0
   * */
  initialSortColumnIndex?: number;
  /** Callback khi click để sắp xếp cột. */
  onSort?(headingIndex: number, direction: SortDirection): void;
  /** Tăng độ đặc của bảng tương đương với giảm padding */
  increasedTableDensity?: boolean;
  /** Thêm sọc vằn giữa các row */
  hasZebraStripingOnData?: boolean;
  /** Cho phép sticky header  */
  stickyHeader?: boolean;
  /**
   * Đặt số lượng cột đầu muốn sticky
   * @default 0
   * */
  fixedFirstColumns?: number;
  /** Đặt min width cho cột đầu tiên */
  firstColumnMinWidth?: string;
  /** Trạng thái loading của DataTable */
  loading?: boolean;
}

type CombinedProps = DataTableProps & {
  i18n: ReturnType<typeof useI18n>;
  forwardedRef: React.MutableRefObject<DataTableRef | undefined>;
};

class DataTableInner extends React.PureComponent<CombinedProps, DataTableState> {
  state: DataTableState = {
    condensed: false,
    columnVisibilityData: [],
    isScrolledFarthestLeft: true,
    rowHovered: undefined,
  };

  private dataTable = createRef<HTMLDivElement>();
  private scrollContainer = createRef<HTMLDivElement>();
  private table = createRef<HTMLTableElement>();
  private stickyTable = createRef<HTMLTableElement>();
  private tableHeadings: HTMLTableCellElement[] = [];
  private stickyHeadings: HTMLDivElement[] = [];
  private tableHeadingWidths: number[] = [];
  private stickyHeaderActive = false;
  private scrollStopTimer: ReturnType<typeof setTimeout> | null = null;

  private handleResize = debounce(() => {
    const {
      table: { current: table },
      scrollContainer: { current: scrollContainer },
    } = this;

    let condensed = false;

    if (table && scrollContainer) {
      // safari sometimes incorrectly sets the scrollwidth too large by 1px
      condensed = table.scrollWidth > scrollContainer.clientWidth + 1;
    }

    this.setState({
      condensed,
      ...this.calculateColumnVisibilityData(condensed),
    });
  });

  componentDidMount() {
    this.props.forwardedRef.current = {
      scrollToColumn: (column) => this.scrollToColumn(column),
    };
    this.handleResize();
  }

  componentDidUpdate(prevProps: DataTableProps) {
    if (isEqual(prevProps, this.props)) {
      return;
    }
    this.handleResize();
  }

  componentWillUnmount() {
    this.handleResize.cancel();
  }

  scrollToColumn(column: number) {
    const scrollContainer = this.scrollContainer?.current;
    if (scrollContainer === null) {
      return;
    }

    const columnIndex = column < 0 ? 0 : column >= this.tableHeadings.length ? this.tableHeadings.length - 1 : column;

    const columnOffsetLeft = this.tableHeadings[columnIndex].offsetLeft;

    const fixedOffset = this.tableHeadings[this.fixedFirstColumns()]?.offsetLeft ?? 0;

    const scrollLeft = columnOffsetLeft - fixedOffset;

    scrollContainer.scrollTo({ left: scrollLeft });
  }

  render() {
    const {
      headings,
      totals,
      showTotalsInFooter,
      rows,
      footerContent,
      hasZebraStripingOnData = false,
      stickyHeader = false,
    } = this.props;
    const fixedFirstColumns = this.fixedFirstColumns();
    const { condensed } = this.state;

    const headingMarkup = this.renderHeadings();

    const zebraStripingTotals = showTotalsInFooter ? headings.length % 2 === 1 : false;

    const totalsMarkup = totals ? (
      <tr>{totals.map((total, index) => this.renderTotals({ total, index, zebraStriping: zebraStripingTotals }))}</tr>
    ) : null;

    const fixedNthColumnMarkup =
      condensed && fixedFirstColumns !== 0 ? this.renderFixedNthColumn(fixedFirstColumns) : null;

    const bodyMarkup = rows.map((row, index) =>
      this.defaultRenderRow({
        row,
        index,
        inFixedNthColumn: false,
      })
    );
    const footerMarkup = footerContent ? <StyledFooterContent>{footerContent}</StyledFooterContent> : null;

    const headerTotalsMarkup = !showTotalsInFooter ? totalsMarkup : null;
    const footerTotalsMarkup = showTotalsInFooter ? <tfoot>{totalsMarkup}</tfoot> : null;

    const loadingMarkup = this.renderLoading();

    const stickyHeaderMarkup = stickyHeader ? this.renderStickyHeader() : null;

    return (
      <StyledDataTableWrapper ref={this.dataTable} condensed={condensed} stickyHeader={stickyHeader}>
        {stickyHeaderMarkup}
        <StyledDataTable condensed={condensed} totals={!!totals} zebraStripingOnData={hasZebraStripingOnData}>
          {loadingMarkup}
          <StyledScrollContainer ref={this.scrollContainer}>
            <EventListener event="resize" handler={this.handleResize} />
            <EventListener capture passive event="scroll" handler={this.scrollListener} />
            {fixedNthColumnMarkup}
            <StyledTable ref={this.table}>
              <thead>
                {headingMarkup}
                {headerTotalsMarkup}
              </thead>
              <tbody>{bodyMarkup}</tbody>
              {footerTotalsMarkup}
            </StyledTable>
          </StyledScrollContainer>
          {footerMarkup}
        </StyledDataTable>
      </StyledDataTableWrapper>
    );
  }

  private fixedFirstColumns() {
    const { fixedFirstColumns = 0, headings } = this.props;

    if (fixedFirstColumns >= headings.length) {
      return 0;
    }

    return fixedFirstColumns;
  }

  private setCellRef = ({
    ref,
    index,
    inStickyHeader,
  }: {
    ref: HTMLTableCellElement | null;
    index: number;
    inStickyHeader: boolean;
  }) => {
    if (ref === null) {
      return;
    }

    if (inStickyHeader) {
      this.stickyHeadings[index] = ref;
    } else {
      this.tableHeadings[index] = ref;
      this.tableHeadingWidths[index] = ref.offsetWidth;
    }
  };

  private calculateColumnVisibilityData = (condensed: boolean) => {
    const fixedFirstColumns = this.fixedFirstColumns();
    const {
      table: { current: table },
      scrollContainer: { current: scrollContainer },
      dataTable: { current: dataTable },
    } = this;
    const { stickyHeader, secondaryHeadings, headings } = this.props;

    if ((stickyHeader || condensed) && table && scrollContainer && dataTable) {
      let headerCells: HTMLTableCellElement[];
      if (secondaryHeadings) {
        headerCells = [];
        const firstRowHeaderCells = table.querySelectorAll<HTMLTableCellElement>(
          `tr:nth-child(1) ${headerCell.selector}`
        );
        const secondRowHeaderCells = table.querySelectorAll<HTMLTableCellElement>(
          `tr:nth-child(2) ${headerCell.selector}`
        );
        for (let i = 0, firstIndex = 0, secondIndex = 0; i < headings.length; i++) {
          const secondaryHeading = secondaryHeadings[i];
          if (secondaryHeading === undefined) {
            headerCells.push(firstRowHeaderCells[firstIndex++]);
          } else {
            headerCells.push(secondRowHeaderCells[secondIndex++]);
            if (secondaryHeading !== "") {
              firstIndex++;
            }
          }
        }
      } else {
        headerCells = Array.from(table.querySelectorAll<HTMLTableCellElement>(headerCell.selector));
      }

      const rightMostHeader = headerCells[fixedFirstColumns - 1];
      const nthColumnWidth = fixedFirstColumns ? rightMostHeader.offsetLeft + rightMostHeader.offsetWidth : 0;

      if (headerCells.length > 0) {
        const firstVisibleColumnIndex = headerCells.length - 1;
        const tableLeftVisibleEdge = scrollContainer.scrollLeft + nthColumnWidth;

        const tableRightVisibleEdge = scrollContainer.scrollLeft + dataTable.offsetWidth;

        const tableData = {
          firstVisibleColumnIndex,
          tableLeftVisibleEdge,
          tableRightVisibleEdge,
        };

        const columnVisibilityData = [...headerCells].map(measureColumn(tableData));

        const isScrolledFarthestLeft = fixedFirstColumns
          ? tableLeftVisibleEdge === nthColumnWidth
          : tableLeftVisibleEdge === 0;

        return {
          columnVisibilityData,
          ...getPrevAndCurrentColumns(tableData, columnVisibilityData),
          isScrolledFarthestLeft,
        };
      }
    }

    return {
      columnVisibilityData: [],
      previousColumn: undefined,
      currentColumn: undefined,
    };
  };

  private stickyHeaderScrolling = () => {
    const { current: stickyTable } = this.stickyTable;
    const { current: scrollContainer } = this.scrollContainer;

    if (stickyTable === null || scrollContainer === null) {
      return;
    }

    stickyTable.scrollLeft = scrollContainer.scrollLeft;
  };

  private scrollListener = () => {
    if (this.scrollStopTimer) {
      clearTimeout(this.scrollStopTimer);
    }

    this.scrollStopTimer = setTimeout(
      () =>
        this.setState((prevState) => ({
          ...this.calculateColumnVisibilityData(prevState.condensed),
        })),
      100
    );
    this.setState({
      isScrolledFarthestLeft: this.scrollContainer.current?.scrollLeft === 0,
    });

    if (this.props.stickyHeader && this.stickyHeaderActive) {
      this.stickyHeaderScrolling();
    }
  };

  private handleHover = (row?: number) => () => {
    this.setState({ rowHovered: row });
  };

  private handleFocus: FocusEventHandler = (event) => {
    const fixedFirstColumns = this.fixedFirstColumns();
    if (this.scrollContainer.current === null || event.target === null) {
      return;
    }
    const currentCell = event.target.parentNode as HTMLTableCellElement;
    const fixedNthColumn = this.props;
    const nthColumnWidth = fixedNthColumn ? this.state.columnVisibilityData[fixedFirstColumns]?.rightEdge : 0;
    const currentColumnLeftEdge = currentCell.offsetLeft;
    const desiredScrollLeft = currentColumnLeftEdge - nthColumnWidth;

    if (this.scrollContainer.current.scrollLeft > desiredScrollLeft) {
      this.scrollContainer.current.scrollLeft = desiredScrollLeft;
    }

    // focus fixed first column if present
  };

  private renderHeadings = () => {
    const { headings, secondaryHeadings } = this.props;
    const headingLength = headings.length;
    if (secondaryHeadings) {
      const primaryRows: (JSX.Element | JSX.Element[])[] = [];
      const secondaryRows: (JSX.Element | JSX.Element[])[] = [];

      for (let index = 0; index < headingLength; index++) {
        const heading = headings[index];
        if (secondaryHeadings[index] !== undefined) {
          primaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: false,
              inStickyHeader: false,
              hasBorderRight: index !== headingLength - 1 && secondaryHeadings[index + 1] !== "",
            })
          );
        }
      }
      for (let index = 0; index < headingLength; index++) {
        const heading = headings[index];
        if (secondaryHeadings[index] === undefined) {
          secondaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: false,
              inStickyHeader: false,
              hasBorderRight: index !== headingLength - 1,
              rowSpan: 2,
            })
          );
        } else {
          const mergeHeading = secondaryHeadings[index];
          const mergeIndex = index;
          while (index < headingLength && secondaryHeadings[index + 1] === "") {
            index++;
          }
          secondaryRows.push(
            this.renderHeading({
              heading: mergeHeading,
              headingIndex: index,
              inFixedNthColumn: false,
              inStickyHeader: false,
              hasBorderRight: index !== headingLength - 1,
              colSpan: index - mergeIndex + 1,
            })
          );
        }
      }
      return (
        <>
          <tr>{secondaryRows}</tr>
          <tr>{primaryRows}</tr>
        </>
      );
    } else {
      return (
        <tr>
          {headings.map((heading, index) =>
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: false,
              inStickyHeader: false,
              hasBorderRight: index !== headingLength - 1,
            })
          )}
        </tr>
      );
    }
  };

  private renderFixedNthColumn = (fixedFirstColumns: number) => {
    const { headings, totals, showTotalsInFooter, rows, secondaryHeadings } = this.props;
    const { columnVisibilityData } = this.state;

    const zebraStripingTotals = showTotalsInFooter ? headings.length % 2 === 1 : false;

    const nthColumns = rows.map((row) => row.slice(0, fixedFirstColumns));
    const nthHeadings = headings.slice(0, fixedFirstColumns);
    const nthTotals = totals?.slice(0, fixedFirstColumns);
    const tableHeaderRows = this.table.current?.children[0].childNodes;
    const tableBodyRows = this.table.current?.children[1].childNodes;
    const headerRowHeights: number[] = getRowClientHeights(tableHeaderRows);
    const bodyRowHeights: number[] = getRowClientHeights(tableBodyRows);

    let primaryRows: (JSX.Element | JSX.Element[])[] = [];
    let secondaryRows: (JSX.Element | JSX.Element[])[] | undefined = undefined;
    if (secondaryHeadings) {
      secondaryRows = [];
      for (let index = 0; index < nthHeadings.length; index++) {
        const heading = nthHeadings[index];
        if (secondaryHeadings[index] !== undefined) {
          primaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: true,
              inStickyHeader: false,
              hasBorderRight: index !== headings.length - 1 && secondaryHeadings[index + 1] !== "",
            })
          );
        }
      }
      for (let index = 0; index < nthHeadings.length; index++) {
        const heading = nthHeadings[index];
        if (secondaryHeadings[index] === undefined) {
          secondaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: true,
              inStickyHeader: false,
              hasBorderRight: index !== headings.length - 1,
              rowSpan: primaryRows.length ? 2 : 1,
            })
          );
        } else {
          const mergeHeading = secondaryHeadings[index];
          const mergeIndex = index;
          while (index < nthHeadings.length && secondaryHeadings[index + 1] === "") {
            index++;
          }
          secondaryRows.push(
            this.renderHeading({
              heading: mergeHeading,
              headingIndex: mergeIndex,
              inFixedNthColumn: true,
              inStickyHeader: false,
              hasBorderRight: mergeIndex !== headings.length - 1,
              colSpan: index - mergeIndex + 1,
            })
          );
        }
      }
    } else {
      primaryRows = nthHeadings.map((heading, index) =>
        this.renderHeading({
          heading,
          headingIndex: index,
          inFixedNthColumn: true,
          inStickyHeader: false,
          hasBorderRight: index !== headings.length - 1,
        })
      );
    }

    return (
      <StyledFixedFirstColumnTable
        style={{
          width: `${columnVisibilityData[fixedFirstColumns - 1]?.rightEdge}px`,
        }}
      >
        <thead>
          {secondaryRows ? (
            <tr
              style={{
                height: `${primaryRows.length ? headerRowHeights[0] : headerRowHeights[0] + headerRowHeights[1]}px`,
              }}
            >
              {secondaryRows}
            </tr>
          ) : null}
          {primaryRows.length ? (
            <tr
              style={{
                height: `${secondaryRows ? headerRowHeights[1] : headerRowHeights[0]}px`,
              }}
            >
              {primaryRows}
            </tr>
          ) : null}
          {totals && !showTotalsInFooter && (
            <tr style={{ height: `${secondaryHeadings ? headerRowHeights[2] : headerRowHeights[1]}px` }}>
              {nthTotals?.map((total, index) =>
                this.renderTotals({ total, index, zebraStriping: zebraStripingTotals })
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {nthColumns.map((row, index) =>
            this.defaultRenderRow({
              row,
              index,
              inFixedNthColumn: true,
              rowHeights: bodyRowHeights,
            })
          )}
        </tbody>
        {totals && showTotalsInFooter && (
          <tfoot>
            <tr>
              {nthTotals?.map((total, index) =>
                this.renderTotals({ total, index, zebraStriping: zebraStripingTotals })
              )}
            </tr>
          </tfoot>
        )}
      </StyledFixedFirstColumnTable>
    );
  };

  private renderStickyHeader = () => {
    const { headings, secondaryHeadings } = this.props;
    const fixedFirstColumns = this.fixedFirstColumns();

    let primaryRows: (JSX.Element | JSX.Element[])[] = [];
    let secondaryRows: (JSX.Element | JSX.Element[])[] | undefined = undefined;
    const headingLength = headings.length;
    if (secondaryHeadings) {
      secondaryRows = [];
      for (let index = 0; index < headingLength; index++) {
        const heading = headings[index];
        const inFixedNthColumn = Boolean(index <= fixedFirstColumns - 1 && fixedFirstColumns);
        if (secondaryHeadings[index] !== undefined) {
          primaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn,
              inStickyHeader: true,
              hasBorderRight: index !== headingLength - 1 && secondaryHeadings[index + 1] !== "",
            })
          );
        }
      }
      for (let index = 0; index < headingLength; index++) {
        const heading = headings[index];
        if (secondaryHeadings[index] === undefined) {
          secondaryRows.push(
            this.renderHeading({
              heading,
              headingIndex: index,
              inFixedNthColumn: Boolean(index <= fixedFirstColumns - 1 && fixedFirstColumns),
              inStickyHeader: true,
              hasBorderRight: index !== headingLength - 1,
              rowSpan: 2,
            })
          );
        } else {
          const mergeHeading = secondaryHeadings[index];
          const mergeIndex = index;
          while (index < headingLength && secondaryHeadings[index + 1] === "") {
            index++;
          }
          secondaryRows.push(
            this.renderHeading({
              heading: mergeHeading,
              headingIndex: mergeIndex,
              inFixedNthColumn: Boolean(mergeIndex <= fixedFirstColumns - 1 && fixedFirstColumns),
              inStickyHeader: true,
              hasBorderRight: index !== headingLength - 1,
              colSpan: index - mergeIndex + 1,
            })
          );
        }
      }
    } else {
      primaryRows = headings.map((heading, index) =>
        this.renderHeading({
          heading,
          headingIndex: index,
          inFixedNthColumn: Boolean(index <= fixedFirstColumns - 1 && fixedFirstColumns),
          inStickyHeader: true,
          hasBorderRight: index !== headingLength - 1,
        })
      );
    }

    return (
      <AfterInitialMount>
        <StyledStickyWrapper role="presentation">
          <Sticky
            boundingElement={this.dataTable.current}
            onStickyChange={(isSticky) => {
              this.stickyHeaderActive = isSticky;
            }}
          >
            {(isSticky: boolean) => {
              return (
                <>
                  {this.renderLoading()}
                  <StyledStickyHeaderInner isSticky={isSticky}>
                    <StyledStickyTable ref={this.stickyTable}>
                      <thead>
                        {secondaryRows ? <StyledStickyRow>{secondaryRows}</StyledStickyRow> : null}
                        <StyledStickyRow>{primaryRows}</StyledStickyRow>
                      </thead>
                    </StyledStickyTable>
                  </StyledStickyHeaderInner>
                </>
              );
            }}
          </Sticky>
        </StyledStickyWrapper>
      </AfterInitialMount>
    );
  };

  private renderHeading = ({
    heading,
    headingIndex,
    inFixedNthColumn,
    inStickyHeader,
    rowSpan,
    colSpan,
    hasBorderRight,
  }: {
    heading: string | React.ReactNode;
    headingIndex: number;
    inFixedNthColumn: boolean;
    inStickyHeader: boolean;
    rowSpan?: number;
    colSpan?: number;
    hasBorderRight?: boolean;
  }) => {
    const {
      sortable,
      truncate = false,
      columnContentTypes,
      defaultSortDirection,
      initialSortColumnIndex = 0,
      verticalAlign,
      firstColumnMinWidth,
      increasedTableDensity,
      hasZebraStripingOnData,
    } = this.props;
    const fixedFirstColumns = this.fixedFirstColumns();

    const {
      sortDirection = defaultSortDirection,
      sortedColumnIndex = initialSortColumnIndex,
      isScrolledFarthestLeft,
    } = this.state;

    let sortableHeadingProps: CellProps | undefined = undefined;
    const headingCellId = `heading-cell-${headingIndex}`;
    const stickyHeaderId = `stickyheader-${headingIndex}`;
    const id = inStickyHeader ? stickyHeaderId : headingCellId;

    if (sortable) {
      const isSortable = sortable[headingIndex];
      const isSorted = isSortable && sortedColumnIndex === headingIndex;
      const direction = isSorted ? sortDirection : undefined;

      sortableHeadingProps = {
        defaultSortDirection,
        sorted: isSorted,
        sortable: isSortable,
        sortDirection: direction,
        onSort: this.defaultOnSort(headingIndex),
      };
    }

    const stickyCellWidth = inStickyHeader ? this.tableHeadingWidths[headingIndex] : undefined;

    const fixedCellVisible = !isScrolledFarthestLeft;

    const cellProps: CellProps = {
      header: true,
      stickyHeadingCell: inStickyHeader,
      content: heading,
      contentType: columnContentTypes[headingIndex],
      nthColumn: headingIndex < fixedFirstColumns,
      rowSpan,
      colSpan,
      truncate,
      hasBorderRight,
      ...sortableHeadingProps,
      verticalAlign: rowSpan ? "middle" : verticalAlign,
      mergedHeader: !!colSpan,
      handleFocus: this.handleFocus,
      stickyCellWidth,
      fixedCellVisible,
      firstColumnMinWidth,
      hasZebraStripingOnData,
      setRef: (ref) => {
        this.setCellRef({
          ref,
          index: headingIndex,
          inStickyHeader,
        });
      },
      increasedTableDensity,
    };

    if (inFixedNthColumn && inStickyHeader) {
      // TODO: old solution not work when multiline header row, workaround using position: sticky instead
      //
      // need two cells for fixed first column (actual cell and the overlapping one)
      // the sticky cell is second so that the index is associated with the sticky
      // cell and not the underlying one
      // <Cell key={id} {...cellProps} inFixedNthColumn={false} />,
      return [
        <Cell
          key={`${id}-sticky`}
          {...cellProps}
          inFixedNthColumn={Boolean(fixedFirstColumns)}
          lastFixedFirstColumn={headingIndex === fixedFirstColumns - 1}
          style={{
            left: this.state.columnVisibilityData[headingIndex]?.leftEdge,
          }}
        />,
      ];
    }

    return (
      <Cell
        key={id}
        {...cellProps}
        lastFixedFirstColumn={headingIndex === fixedFirstColumns - 1}
        inFixedNthColumn={inFixedNthColumn}
      />
    );
  };

  private renderLoading = () => {
    return <LoadingPanel loading={this.props.loading} large={!!this.props.secondaryHeadings} />;
  };

  private totalsRowHeading = () => {
    const { i18n, totals, totalsName } = this.props;

    const totalsLabel = totalsName
      ? totalsName
      : {
          singular: i18n.translate("UI.DataTable.totalRowHeading"),
          plural: i18n.translate("UI.DataTable.totalsRowHeading"),
        };

    return totals && totals.filter((total) => total !== "").length > 1 ? totalsLabel.plural : totalsLabel.singular;
  };

  private renderTotals = ({
    total,
    index,
    zebraStriping,
  }: {
    total: TableData;
    index: number;
    zebraStriping: boolean;
  }) => {
    const fixedFirstColumns = this.fixedFirstColumns();
    const id = `totals-cell-${index}`;
    const {
      truncate = false,
      verticalAlign,
      increasedTableDensity,
      columnContentTypes,
      hasZebraStripingOnData,
    } = this.props;

    let content;
    let contentType;

    const colSpan = this.getTotalColspan();
    const firstColumn = index === 0;
    if (firstColumn) {
      content = this.totalsRowHeading();
    } else if (total !== "") {
      contentType = columnContentTypes[index];
      content = total;
    } else if (colSpan && index < colSpan) {
      return null;
    }

    const totalInFooter = this.props.showTotalsInFooter;

    return (
      <Cell
        total
        totalInFooter={totalInFooter}
        nthColumn={index <= fixedFirstColumns - 1}
        colSpan={firstColumn ? colSpan : undefined}
        firstColumn={firstColumn}
        key={id}
        content={content}
        contentType={contentType}
        truncate={truncate}
        verticalAlign={verticalAlign}
        zebraStriping={zebraStriping}
        hasZebraStripingOnData={hasZebraStripingOnData}
        increasedTableDensity={increasedTableDensity}
      />
    );
  };

  private getTotalColspan = () => {
    const fixedFirstColumns = this.fixedFirstColumns();
    let colSpan: number | undefined = undefined;
    const { totals = [] } = this.props;
    const nEmptyBeforeFirstColumnData = totals.findIndex((t, index) => index !== 0 && t !== "");
    colSpan = Math.min(nEmptyBeforeFirstColumnData + 1, fixedFirstColumns);
    colSpan = colSpan !== 1 ? colSpan : undefined;
    return colSpan;
  };

  private getColSpan = (rowLength: number, headingsLength: number, contentTypesLength: number, cellIndex: number) => {
    // We decided that it shouldn't be possible to have fixed "n" columns and content that spans multiple columns
    const fixedFirstColumns = this.fixedFirstColumns();
    if (fixedFirstColumns) {
      return 1;
    }
    const rowLen = rowLength ? rowLength : 1;
    const colLen = headingsLength ? headingsLength : contentTypesLength;
    const colSpan = Math.floor(colLen / rowLen);
    const remainder = colLen % rowLen;
    return cellIndex === 0 ? colSpan + remainder : colSpan;
  };

  private defaultRenderRow = ({
    row,
    index,
    inFixedNthColumn,
    rowHeights,
  }: {
    row: TableData[];
    index: number;
    inFixedNthColumn: boolean;
    rowHeights?: number[];
  }) => {
    const {
      columnContentTypes,
      truncate = false,
      verticalAlign,
      hoverable = true,
      headings,
      hasZebraStripingOnData,
      totals,
      showTotalsInFooter,
      increasedTableDensity,
    } = this.props;
    const { condensed } = this.state;
    const fixedFirstColumns = this.fixedFirstColumns();
    const totalInHeading = Boolean(totals) && !showTotalsInFooter;
    const zebraStriping = hasZebraStripingOnData && (totalInHeading ? index % 2 === 0 : index % 2 === 1);
    return (
      <StyledRow
        key={`row-${index}`}
        onMouseEnter={this.handleHover(index)}
        onMouseLeave={this.handleHover()}
        hashasZebraStripingOnData={hasZebraStripingOnData}
      >
        {row.map((content, cellIndex) => {
          const hovered = index === this.state.rowHovered;
          const id = `cell-${cellIndex}-row-${index}`;
          const colSpan = this.getColSpan(row.length, headings.length, columnContentTypes.length, cellIndex);

          return (
            <Cell
              key={id}
              content={content}
              contentType={columnContentTypes[cellIndex]}
              nthColumn={cellIndex <= fixedFirstColumns - 1}
              firstColumn={cellIndex === 0}
              truncate={truncate}
              verticalAlign={verticalAlign}
              colSpan={colSpan}
              zebraStriping={zebraStriping}
              hasZebraStripingOnData={hasZebraStripingOnData}
              hovered={hoverable && hovered}
              style={rowHeights ? { height: `${rowHeights[index]}px` } : {}}
              inFixedNthColumn={condensed && inFixedNthColumn}
              increasedTableDensity={increasedTableDensity}
            />
          );
        })}
      </StyledRow>
    );
  };

  private defaultOnSort = (headingIndex: number) => {
    const { onSort, defaultSortDirection = "ascending", initialSortColumnIndex } = this.props;

    const { sortDirection = defaultSortDirection, sortedColumnIndex = initialSortColumnIndex } = this.state;

    let newSortDirection = defaultSortDirection;

    if (sortedColumnIndex === headingIndex) {
      newSortDirection = sortDirection === "ascending" ? "descending" : "ascending";
    }

    const handleSort = () => {
      this.setState(
        {
          sortDirection: newSortDirection,
          sortedColumnIndex: headingIndex,
        },
        () => {
          if (onSort) {
            onSort(headingIndex, newSortDirection);
          }
        }
      );
    };

    return handleSort;
  };
}

export interface DataTableRef {
  /** Scroll theo chiều ngang đến cột. Chỉ số bắt đầu bởi 0 */
  scrollToColumn: (column: number) => void;
}
/**
 * DataTable được dùng để biểu diễn thông tin từ dataset. Cho phép người dùng so sánh phân tích dữ liệu một cách thuận tiện
 */
export const DataTable = forwardRef<DataTableRef, DataTableProps>(function DataTable(props, forwardedRef) {
  const i18n = useI18n();
  const ref = useRef<DataTableRef>(undefined);
  useImperativeHandle(forwardedRef, () => ({
    scrollToColumn: ref.current?.scrollToColumn ?? (() => {}),
  }));
  return <DataTableInner {...props} i18n={i18n} forwardedRef={ref} />;
});

const StyledTable = styled.table`
  border-spacing: 0;
  width: 100%;
  height: 100%;
`;

const StyledDataTable = styled.div<{
  condensed: boolean;
  totals: boolean;
  zebraStripingOnData: boolean;
}>`
  position: relative;
  overflow: hidden;
  max-width: 100vw;
  background-color: ${(p) => p.theme.colors.surface};
  ${(p) => p.theme.breakpoints.up("sm")} {
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }
`;

const StyledScrollContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  background-color: inherit;
`;

const StyledFixedFirstColumnTable = styled.table`
  position: absolute;
  background: inherit;
  z-index: 3;
  border-spacing: 0;
  top: 0;
  left: 0;
  ${(p) => p.theme.breakpoints.down("md")} {
    z-index: 1;
  }
`;

const StyledRow = styled.tr<{
  hashasZebraStripingOnData?: boolean;
}>`
  th {
    border-bottom: ${(p) => (p.hashasZebraStripingOnData ? "none" : p.theme.shape.borderDivider)};
  }
  &:not(:last-child) {
    td {
      border-bottom: ${(p) => (p.hashasZebraStripingOnData ? "none" : p.theme.shape.borderDivider)};
    }
  }
`;

const StyledStickyWrapper = styled.div``;

const StyledStickyHeaderInner = styled.div<{ isSticky: boolean }>`
  ${(p) =>
    p.isSticky
      ? css`
          visibility: visible;
          background-color: ${p.theme.colors.surface};
          box-shadow: ${p.theme.shadow.base};
        `
      : css`
          top: -9999px;
          left: -9999px;
        `};
`;

const StyledStickyTable = styled.table`
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    appearance: none;
    height: 0;
    width: 0;
  }
`;

const StyledStickyRow = styled.tr`
  background-color: ${(p) => p.theme.components.dataTable.zebraBackgroundColor};
`;

const StyledFooterContent = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
  border-top: ${(p) => p.theme.shape.borderDivider};
  text-align: center;
`;

const StyledDataTableWrapper = styled.div<{
  condensed: boolean;
  stickyHeader: boolean;
}>`
  ${(p) =>
    p.stickyHeader &&
    css`
      ${StyledStickyWrapper} {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        visibility: hidden;
        z-index: ${p.theme.zIndex(1)};
      }

      &[data-sticky-active] {
        ${StyledStickyWrapper} {
          visibility: visible;
        }
      }
      ${StyledStickyHeaderInner} {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
        border-spacing: 0;
      }
    `}
`;
