import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowCaretDownIcon, ArrowCaretUpIcon, ArrowSortIcon } from "@/ui-icons";
import { debounce } from "lodash-es";

import { useI18n } from "../../utils/i18n";
import { useResizeObserver } from "../../utils/resize-observer-manager";
import { useEventListener } from "../../utils/useEventListener";
import { useToggle } from "../../utils/useToggle";
import { Checkbox } from "../Checkbox";
import { EmptySearchResult } from "../EmptySearchResult";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Sticky } from "../StickyManager/Sticky";
import { Tooltip, TooltipProps } from "../Tooltip";

import { BulkActionButton } from "./BulkActions/BulkActionButton";
import { AfterInitialMount } from "./AfterInitialMount";
import { BulkActions } from "./BulkActions";
import { useIndexSelectionChange, useIndexValue } from "./context";
import { LoadingPanel } from "./LoadingPanel";
import { ScrollContainer } from "./ScrollContainer";
import {
  StyledColumnHeaderCheckboxWrapper,
  StyledCondensedList,
  StyledEmptySearchResultWrapper,
  StyledFirstStickyHeaderElement,
  StyledHeaderWrapper,
  StyledIndexTable,
  StyledScrollBar,
  StyledScrollBarContainer,
  StyledScrollBarContent,
  StyledSelectAllActionsWrapper,
  StyledSortableHeadingButton,
  StyledSortableHeadingIcon,
  StyledSortableHeadingWrapper,
  StyledStickyTable,
  StyledStickyTableColumnHeader,
  StyledStickyTableHeader,
  StyledStickyTableHeadings,
  StyledStickyTableHeadingSecond,
  StyledStickyTableHeadingSecondScrolling,
  StyledTable,
  StyledTableHeading,
  StyledTableHeadingFirst,
  StyledTableHeadingRow,
  StyledTableHeadingSecond,
  StyledTableWrapper,
  UI_INDEX_TABLE_SCROLLBAR_CONTENT_WIDTH,
} from "./styles";
import {
  IndexTableBaseProps,
  IndexTableHeading,
  IndexTableSortDirection,
  SCROLL_BAR_DEBOUNCE_PERIOD,
  SCROLL_BAR_PADDING,
  SelectionType,
  TableHeadingRect,
} from "./types";

export const IndexTableBase = ({
  headingPrefix,
  headings,
  sort,
  bulkActions = [],
  promotedBulkActions = [],
  sortable,
  sortDirection,
  defaultSortDirection = "descending",
  sortToggleLabels,
  onSort,
  sortColumnIndex,
  children,
  emptyState,
  lastColumnSticky,
  stickyHeader = true,
  selectable: selectableProp,
}: IndexTableBaseProps) => {
  const i18n = useI18n();
  const {
    loading,
    bulkSelectState,
    resourceName,
    selectMode,
    selectable = selectableProp,
    itemCount,
    selectedItemsCount,
    condensed,
    hasMoreItems,
  } = useIndexValue();
  const isEmptyState = itemCount <= 0;

  const handleSelectionChange = useIndexSelectionChange();
  const bulkActionsSelectable = hasMoreItems || Boolean(bulkActions.length > 0 || promotedBulkActions.length > 0);
  const shouldShowBulkActions = bulkActionsSelectable && !!selectedItemsCount;
  const [tableInitialized, setTableInitialized] = useState(false);
  const [stickyWrapper, setStickyWrapper] = useState<HTMLElement | null>(null);
  const tableHeadingRects = useRef<TableHeadingRect[]>([]);
  const selectedItemsCountLabel = selectedItemsCount;
  const hasHeadingPrefix = !!headingPrefix;
  const handleTogglePage = useCallback(() => {
    handleSelectionChange(SelectionType.Page, Boolean(!bulkSelectState || bulkSelectState === "indeterminate"));
  }, [bulkSelectState, handleSelectionChange]);

  const handleToggleAll = useCallback(() => {
    handleSelectionChange(SelectionType.All, selectedItemsCount !== "All");
  }, [selectedItemsCount, handleSelectionChange]);

  const tableHeaderRef = useRef<HTMLTableSectionElement>(null);
  const stickyHeaderWrapperElement = useRef<HTMLDivElement>(null);
  const stickyHeaderElement = useRef<HTMLDivElement>(null);
  const firstStickyHeaderElement = useRef<HTMLDivElement>(null);
  const stickyTableHeadings = useRef<HTMLElement[]>([]);
  const lastSortedColumnIndex = useRef<number | undefined>(sortColumnIndex);
  const scrollableContainerElement = useRef<HTMLDivElement>(null);
  const scrollingWithBar = useRef(false);
  const scrollBarElement = useRef<HTMLDivElement>(null);
  const scrollingContainer = useRef(false);
  const condensedListElement = useRef<HTMLUListElement>(null);
  const tableBodyRef = useCallback(
    (node: Element | null) => {
      if (node !== null && !tableInitialized) {
        setTableInitialized(true);
      }
    },
    [tableInitialized]
  );
  const resizeTableScrollBar = useCallback(() => {
    if (scrollBarElement.current && tableElement.current && tableInitialized) {
      scrollBarElement.current.style.setProperty(
        UI_INDEX_TABLE_SCROLLBAR_CONTENT_WIDTH,
        `${tableElement.current.offsetWidth - SCROLL_BAR_PADDING}px`
      );

      setHideScrollContainer(scrollContainerElement.current?.offsetWidth === tableElement.current?.offsetWidth);
    }
  }, [tableInitialized]);

  const loadingMarkup = <LoadingPanel loading={loading} />;
  function getHeadingKey(heading: IndexTableHeading): string {
    if ("id" in heading && heading.id) {
      return heading.id;
    }

    if (typeof heading.title === "string") {
      return heading.title;
    }

    return "";
  }
  const calculateFirstHeaderOffset = useCallback(() => {
    if (!selectable) {
      return hasHeadingPrefix
        ? tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth
        : tableHeadingRects.current[0].offsetWidth;
    }

    return condensed
      ? hasHeadingPrefix
        ? tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth
        : tableHeadingRects.current[0].offsetWidth
      : hasHeadingPrefix
      ? tableHeadingRects.current[0].offsetWidth +
        tableHeadingRects.current[1].offsetWidth +
        tableHeadingRects.current[2].offsetWidth
      : tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth;
  }, [condensed, hasHeadingPrefix, selectable]);
  const stickyColumnHeaderMinWidth =
    tableHeadingRects.current && tableHeadingRects.current.length > 0 ? calculateFirstHeaderOffset() : undefined;

  function handleSelectPage(checked: boolean) {
    handleSelectionChange(SelectionType.Page, checked);
  }
  function handleSortHeadingClick(index: number, direction: IndexTableSortDirection) {
    lastSortedColumnIndex.current = sortColumnIndex;
    onSort?.(index, direction);
  }
  function renderCheckboxContent() {
    return (
      <StyledColumnHeaderCheckboxWrapper>
        <Checkbox onChange={handleSelectPage} checked={bulkSelectState} />
      </StyledColumnHeaderCheckboxWrapper>
    );
  }

  const prefixStickyHeaderMarkup = hasHeadingPrefix ? (
    <StyledFirstStickyHeaderElement ref={firstStickyHeaderElement}>{headingPrefix}</StyledFirstStickyHeaderElement>
  ) : null;

  const checkboxStickyHeaderMarkup =
    selectable && !hasHeadingPrefix ? (
      <StyledFirstStickyHeaderElement ref={firstStickyHeaderElement}>
        {renderCheckboxContent()}
      </StyledFirstStickyHeaderElement>
    ) : null;

  const stickyColumnHeaderMarkup = (
    <StyledStickyTableColumnHeader>
      <StyledTableHeading
        key={getHeadingKey(headings[0])}
        style={{
          minWidth: stickyColumnHeaderMinWidth,
        }}
        data-index-table-sticky-heading
      >
        <Stack spacing="none" wrap={false} alignment="center">
          {prefixStickyHeaderMarkup}
          {checkboxStickyHeaderMarkup}

          {selectable && hasHeadingPrefix && (
            <StyledFirstStickyHeaderElement hasTwin>{renderCheckboxContent()}</StyledFirstStickyHeaderElement>
          )}

          {(selectable || hasHeadingPrefix) && (
            <StyledStickyTableHeadingSecondScrolling>
              {renderHeadingContent(headings[0], 0)}
            </StyledStickyTableHeadingSecondScrolling>
          )}

          {!selectable && !hasHeadingPrefix && (
            <StyledFirstStickyHeaderElement ref={firstStickyHeaderElement}>
              {renderHeadingContent(headings[0], 0)}
            </StyledFirstStickyHeaderElement>
          )}
        </Stack>
      </StyledTableHeading>
    </StyledStickyTableColumnHeader>
  );

  function renderStickyHeading(heading: IndexTableHeading, index: number) {
    let indexShift = 0;
    if (selectable) {
      indexShift += 1;
    }
    if (hasHeadingPrefix) {
      indexShift += 1;
    }
    const position = index + indexShift;
    const headingStyle =
      tableHeadingRects.current && tableHeadingRects.current.length > position
        ? { minWidth: tableHeadingRects.current[position].offsetWidth }
        : undefined;

    const headingAlignment = heading.alignment || "start";

    const headingContent = renderHeadingContent(heading, index);

    const Comp = index === 0 ? StyledStickyTableHeadingSecond : StyledTableHeading;

    return (
      <Comp
        key={getHeadingKey(heading)}
        $unselectable={index === 0 && !selectable}
        style={headingStyle}
        data-index-table-sticky-heading
        headingAlignment={headingAlignment}
      >
        {headingContent}
      </Comp>
    );
  }
  const stickyHeadingsMarkup = headings.map(renderStickyHeading);
  function renderHeadingContent(heading: IndexTableHeading, index: number) {
    let headingContent;

    const defaultTooltipProps: Partial<TooltipProps> = {
      width: heading.tooltipWidth ?? "default",
      activatorWrapper: "span",
      dismissOnMouseOut: true,
      persistOnClick: heading.tooltipPersistsOnClick,
      preferredPosition: "above",
    };

    const defaultHeaderTooltipProps = {
      ...defaultTooltipProps,
      content: heading.tooltipContent,
    };

    if (heading.hidden) {
      headingContent = <></>;
    } else {
      headingContent = heading.title;
    }

    if (sortable?.[index]) {
      const isCurrentlySorted = index === sortColumnIndex;

      const isAscending = sortDirection === "ascending";
      let newDirection: IndexTableSortDirection = defaultSortDirection;
      let SourceComponent = ArrowSortIcon;
      if (isCurrentlySorted) {
        newDirection = isAscending ? "descending" : "ascending";
        SourceComponent = sortDirection === "ascending" ? ArrowCaretUpIcon : ArrowCaretDownIcon;
      }

      const iconMarkup = (
        <StyledSortableHeadingIcon>
          <Icon source={SourceComponent} />
        </StyledSortableHeadingIcon>
      );

      const defaultSortButtonProps = {
        onClick: () => handleSortHeadingClick(index, newDirection),
        tabIndex: selectMode ? -1 : 0,
      };

      const sortMarkup = (
        <StyledSortableHeadingButton {...defaultSortButtonProps}>
          <span>{headingContent}</span>
          {iconMarkup}
        </StyledSortableHeadingButton>
      );
      headingContent = sortMarkup;

      if (sortToggleLabels && !selectMode) {
        const tooltipDirection = isCurrentlySorted ? sortDirection! : defaultSortDirection;
        const sortTooltipContent = sortToggleLabels[index]?.[tooltipDirection];
        if (sortTooltipContent) {
          if (!heading.tooltipContent) {
            // Regular header with sort icon and sort direction tooltip
            headingContent = (
              <Tooltip {...defaultTooltipProps} content={sortTooltipContent}>
                {sortMarkup}
              </Tooltip>
            );
          } else {
            // Header text and sort icon have separate tooltips
            headingContent = (
              <StyledSortableHeadingButton {...defaultSortButtonProps}>
                <Tooltip {...defaultHeaderTooltipProps}>{headingContent}</Tooltip>
                <Tooltip {...defaultTooltipProps} content={sortTooltipContent}>
                  {iconMarkup}
                </Tooltip>
              </StyledSortableHeadingButton>
            );
          }
        }
      }
    } else if (heading.tooltipContent) {
      // Non-sortable header with tooltip
      headingContent = (
        <Tooltip {...defaultHeaderTooltipProps}>
          <StyledSortableHeadingWrapper>{headingContent}</StyledSortableHeadingWrapper>
        </Tooltip>
      );
    }

    return headingContent;
  }

  useEffect(() => {
    resizeTableScrollBar();
    setStickyWrapper(condensed ? condensedListElement.current : tableElement.current);
  }, [
    resizeTableScrollBar,
    condensed,
    tableInitialized,
    // resize when headings info change like add/remove column
    // eslint-disable-next-line react-hooks/exhaustive-deps
    headings.map((heading) => ("id" in heading ? heading.id : "")).join("-"),
    isEmptyState,
  ]);

  let bulkActionLabel = "";
  if (selectedItemsCountLabel === "All") {
    bulkActionLabel = i18n.translate("UI.IndexTable.selectedAll", {
      selectedItemsCount: itemCount,
      resourceNamePlural: resourceName.plural,
    });
  } else if (selectedItemsCountLabel > 1) {
    bulkActionLabel = i18n.translate(
      hasMoreItems ? "UI.IndexTable.selectedAllPlural" : "UI.IndexTable.selectedPlural",
      {
        selectedItemsCount: selectedItemsCountLabel,
        resourceNamePlural: resourceName.plural,
      }
    );
  } else {
    bulkActionLabel = i18n.translate(
      hasMoreItems ? "UI.IndexTable.selectedAllSingular" : "UI.IndexTable.selectedSingular",
      {
        selectedItemsCount: selectedItemsCountLabel,
        resourceNameSingular: resourceName.singular,
      }
    );
  }

  const selectAllAction = hasMoreItems ? (
    <BulkActionButton
      content={
        selectedItemsCountLabel === "All"
          ? i18n.translate("UI.IndexTable.deselectAllResource")
          : i18n.translate("UI.IndexTable.selectAllResource", {
              selectedItemsCount: itemCount,
              resourceNamePlural: resourceName.plural,
            })
      }
      onAction={handleToggleAll}
    />
  ) : undefined;

  const stickyHeaderMarkup = (
    <StyledStickyTable $condensed={condensed}>
      <Sticky boundingElement={stickyWrapper}>
        {(isSticky: boolean) => {
          const selectAllActionsMarkup =
            shouldShowBulkActions && !condensed ? (
              <StyledSelectAllActionsWrapper>
                <BulkActions
                  label={bulkActionLabel}
                  prefix={headingPrefix}
                  suffix={selectAllAction}
                  selected={bulkSelectState}
                  selectMode={selectMode}
                  actions={bulkActions}
                  promotedActions={promotedBulkActions}
                  onToggleAll={handleTogglePage}
                />
                {loadingMarkup}
              </StyledSelectAllActionsWrapper>
            ) : null;

          const headerMarkup = condensed ? (
            <StyledHeaderWrapper $unselectable={!selectable || condensed}>
              {loadingMarkup}
              {sort}
            </StyledHeaderWrapper>
          ) : (
            <StyledStickyTableHeader $sticky={stickyHeader ? isSticky : false} ref={stickyHeaderWrapperElement}>
              {loadingMarkup}
              {stickyColumnHeaderMarkup}
              <StyledStickyTableHeadings ref={stickyHeaderElement}>{stickyHeadingsMarkup}</StyledStickyTableHeadings>
            </StyledStickyTableHeader>
          );

          const stickyContent = selectAllActionsMarkup ?? headerMarkup;
          return stickyContent;
        }}
      </Sticky>
    </StyledStickyTable>
  );

  const sharedMarkup = <AfterInitialMount>{stickyHeaderMarkup}</AfterInitialMount>;

  const emptyStateMarkup = emptyState ? (
    emptyState
  ) : (
    <EmptySearchResult
      title={i18n.translate("UI.IndexTable.emptySearchTitle", {
        resourceNamePlural: resourceName.plural,
      })}
      description={i18n.translate("UI.IndexTable.emptySearchDescription")}
      withIllustration
    />
  );

  const scrollContainerElement = useRef<HTMLDivElement>(null);
  const tablePosition = useRef({ top: 0, left: 0 });
  const tableHeadings = useRef<HTMLElement[]>([]);
  const tableElement = useRef<HTMLTableElement>(null);
  const { value: hasMoreLeftColumns, toggle: toggleHasMoreLeftColumns } = useToggle(false);

  const [hideScrollContainer, setHideScrollContainer] = useState<boolean>(true);
  const handleScrollContainerScroll = useCallback(
    (canScrollLeft: boolean) => {
      if (!scrollableContainerElement.current || !scrollBarElement.current) {
        return;
      }

      if (!scrollingWithBar.current) {
        scrollingContainer.current = true;
        scrollBarElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
      }
      scrollingWithBar.current = false;

      if (stickyHeaderElement.current) {
        stickyHeaderElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
      }

      if ((canScrollLeft && !hasMoreLeftColumns) || (!canScrollLeft && hasMoreLeftColumns)) {
        toggleHasMoreLeftColumns();
      }
    },
    [hasMoreLeftColumns, toggleHasMoreLeftColumns]
  );
  //TODO: calc resize for prefix heading
  const resizeTableHeadings = useMemo(
    () =>
      debounce(() => {
        if (!tableElement.current || !scrollableContainerElement.current) {
          return;
        }

        const boundingRect = scrollableContainerElement.current.getBoundingClientRect();
        tablePosition.current = {
          top: boundingRect.top,
          left: boundingRect.left,
        };

        tableHeadingRects.current = tableHeadings.current.map((heading) => ({
          offsetWidth: heading.offsetWidth || 0,
          offsetLeft: heading.offsetLeft || 0,
        }));

        if (tableHeadings.current.length === 0) {
          return;
        }

        // update left offset for first column
        if (selectable && tableHeadings.current.length > 1) {
          tableHeadings.current[1].style.left = `${tableHeadingRects.current[0].offsetWidth}px`;
        }

        // update the min width of the checkbox to be the be the un-padded width of the first heading
        if (selectable && firstStickyHeaderElement?.current) {
          const elementStyle = getComputedStyle(tableHeadings.current[0]);
          const boxWidth = tableHeadings.current[0].offsetWidth;
          firstStickyHeaderElement.current.style.minWidth = `calc(${boxWidth}px - ${elementStyle.paddingLeft} - ${elementStyle.paddingRight})`;
        }

        // update sticky header min-widths
        stickyTableHeadings.current.forEach((heading, index) => {
          let minWidth = 0;
          if (index === 0 && (!isBreakpointsXS() || !selectable)) {
            minWidth = calculateFirstHeaderOffset();
          } else {
            let position = selectable ? index : index - 1;
            position = hasHeadingPrefix ? position + 1 : position;
            if (tableHeadingRects.current.length > position) {
              minWidth = tableHeadingRects.current[position]?.offsetWidth || 0;
            }
          }

          heading.style.minWidth = `${minWidth}px`;
        });
      }),
    [calculateFirstHeaderOffset, hasHeadingPrefix, selectable]
  );

  useEffect(() => {
    tableHeadings.current = getTableHeadingsBySelector(tableElement.current, "[data-index-table-heading]");
    stickyTableHeadings.current = getTableHeadingsBySelector(
      stickyHeaderWrapperElement.current,
      "[data-index-table-sticky-heading]"
    );
    resizeTableHeadings();
  }, [headings, resizeTableHeadings, firstStickyHeaderElement, isEmptyState]);

  const handleCanFitStickyColumn = useCallback(() => {
    if (!scrollableContainerElement.current || !tableHeadings.current.length) {
      return;
    }
    const scrollableRect = scrollableContainerElement.current.getBoundingClientRect();
    const checkboxColumnWidth = selectable ? tableHeadings.current[0].getBoundingClientRect().width : 0;
    const firstStickyColumnWidth = tableHeadings.current[selectable ? 1 : 0].getBoundingClientRect().width;
    const lastColumnIsNotTheFirst = selectable ? tableHeadings.current.length > 2 : 1;
    // Don't consider the last column in the calculations if it's not sticky
    const lastStickyColumnWidth =
      lastColumnSticky && lastColumnIsNotTheFirst
        ? tableHeadings.current[tableHeadings.current.length - 1].getBoundingClientRect().width
        : 0;
    // Secure some space for the remaining columns to be visible
    const restOfContentMinWidth = 300;
    setCanFitStickyColumn(
      scrollableRect.width >
        firstStickyColumnWidth + checkboxColumnWidth + lastStickyColumnWidth + restOfContentMinWidth
    );
  }, [lastColumnSticky, selectable]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResizeTableScrollbar = useCallback(
    debounce(resizeTableScrollBar, SCROLL_BAR_DEBOUNCE_PERIOD, {
      trailing: true,
    }),
    [resizeTableScrollBar]
  );

  const handleResize = useCallback(() => {
    // hide the scrollbar when resizing
    scrollBarElement.current?.style.setProperty(UI_INDEX_TABLE_SCROLLBAR_CONTENT_WIDTH, `0px`);

    resizeTableHeadings();
    debounceResizeTableScrollbar();
    handleCanFitStickyColumn();
  }, [resizeTableHeadings, debounceResizeTableScrollbar, handleCanFitStickyColumn]);

  useEventListener("resize", handleResize);
  useResizeObserver(tableElement.current, handleResize);

  function renderHeading(heading: IndexTableHeading, index: number) {
    const isSecond = index === 0;
    const hasSortable = sortable?.some((value) => value === true);
    const headingAlignment = heading.alignment || "start";

    let stickyPositioningStyle: { left: number } | undefined = undefined;
    if (isSecond && tableHeadingRects.current && tableHeadingRects.current.length > 0) {
      stickyPositioningStyle =
        selectable !== false
          ? {
              left: hasHeadingPrefix
                ? tableHeadingRects.current[0].offsetWidth + tableHeadingRects.current[1].offsetWidth
                : tableHeadingRects.current[0].offsetWidth,
            }
          : hasHeadingPrefix
          ? {
              left: tableHeadingRects.current[0].offsetWidth,
            }
          : undefined;
    }

    const Comp = isSecond ? StyledTableHeadingSecond : StyledTableHeading;

    const headingContent = (
      <Comp
        as="th"
        $sortable={hasSortable}
        $unselectable={!selectable}
        $flush={heading.flush}
        style={stickyPositioningStyle}
        headingAlignment={headingAlignment}
        key={getHeadingKey(heading)}
        data-index-table-heading
      >
        {renderHeadingContent(heading, index)}
      </Comp>
    );

    if (index !== 0) {
      return headingContent;
    }

    const headingPrefixMarkup = hasHeadingPrefix ? (
      <StyledTableHeadingFirst as="th" key={`${heading}-${index - 1}`} data-index-table-heading>
        {headingPrefix}
      </StyledTableHeadingFirst>
    ) : null;

    if (!selectable) {
      return headingPrefixMarkup ? [headingPrefixMarkup, headingContent] : headingContent;
    }

    const checkboxContent = (
      <StyledTableHeadingFirst as="th" key={`${heading}-${index}`} data-index-table-heading>
        {renderCheckboxContent()}
      </StyledTableHeadingFirst>
    );

    return headingPrefixMarkup
      ? [headingPrefixMarkup, checkboxContent, headingContent]
      : [checkboxContent, headingContent];
  }

  const headingsMarkup = headings.map(renderHeading).reduce<JSX.Element[]>((acc, heading) => acc.concat(heading), []);
  const isSortable = sortable?.some((value) => value);
  const [canFitStickyColumn, setCanFitStickyColumn] = useState(true);

  const bodyMarkup = condensed ? (
    <>
      {sharedMarkup}
      <StyledCondensedList data-selectmode={Boolean(selectMode)} ref={condensedListElement}>
        {children}
      </StyledCondensedList>
    </>
  ) : (
    <>
      {sharedMarkup}
      <ScrollContainer scrollableContainerRef={scrollableContainerElement} onScroll={handleScrollContainerScroll}>
        <StyledTable
          ref={tableElement}
          disableTextSelection={selectMode}
          $scrolling={hasMoreLeftColumns}
          $sticky={canFitStickyColumn}
          $unselectable={!selectable}
          $sortable={isSortable}
          selectMode={selectMode && shouldShowBulkActions}
        >
          <thead ref={tableHeaderRef}>
            <StyledTableHeadingRow>{headingsMarkup}</StyledTableHeadingRow>
          </thead>
          <tbody ref={tableBodyRef}>{children}</tbody>
        </StyledTable>
      </ScrollContainer>
    </>
  );

  const handleScrollBarScroll = useCallback(() => {
    if (!scrollableContainerElement.current || !scrollBarElement.current) {
      return;
    }

    if (!scrollingContainer.current) {
      scrollingWithBar.current = true;
      scrollableContainerElement.current.scrollLeft = scrollBarElement.current.scrollLeft;
    }
    scrollingContainer.current = false;
  }, []);
  const scrollBarMarkup = !isEmptyState ? (
    <AfterInitialMount onMount={resizeTableScrollBar}>
      <StyledScrollBarContainer $condensed={condensed} $hidden={hideScrollContainer} ref={scrollContainerElement}>
        <StyledScrollBar onScroll={handleScrollBarScroll} ref={scrollBarElement}>
          {tableElement.current ? <StyledScrollBarContent /> : <div />}
        </StyledScrollBar>
      </StyledScrollBarContainer>
    </AfterInitialMount>
  ) : null;

  const tableContentMarkup = !isEmptyState ? (
    bodyMarkup
  ) : (
    <StyledEmptySearchResultWrapper>{emptyStateMarkup}</StyledEmptySearchResultWrapper>
  );
  return (
    <StyledIndexTable>
      <StyledTableWrapper>
        {!shouldShowBulkActions && !condensed && loadingMarkup}
        {tableContentMarkup}
      </StyledTableWrapper>
      {scrollBarMarkup}
    </StyledIndexTable>
  );
};

const isBreakpointsXS = () => {
  return typeof window === "undefined" ? false : window.innerWidth < 490;
};
export function getTableHeadingsBySelector(wrapperElement: HTMLElement | null, selector: string) {
  return wrapperElement ? Array.from(wrapperElement.querySelectorAll<HTMLElement>(selector)) : [];
}
