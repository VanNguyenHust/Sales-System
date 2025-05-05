import React, { FocusEventHandler, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowCaretDownIcon, ArrowCaretUpIcon, ArrowSortIcon } from "@/ui-icons";

import { headerCell } from "../../utils/shared";
import { unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

import { ColumnContentType, SortDirection, VerticalAlign } from "./types";

export interface CellProps {
  content?: React.ReactNode;
  contentType?: ColumnContentType;
  nthColumn?: boolean;
  firstColumn?: boolean;
  truncate?: boolean;
  header?: boolean;
  total?: boolean;
  totalInFooter?: boolean;
  sorted?: boolean;
  sortable?: boolean;
  sortDirection?: SortDirection;
  defaultSortDirection?: SortDirection;
  verticalAlign?: VerticalAlign;
  onSort?(): void;
  colSpan?: number;
  rowSpan?: number;
  setRef?: (ref: HTMLTableCellElement | null) => void;
  stickyHeadingCell?: boolean;
  stickyCellWidth?: number;
  hovered?: boolean;
  handleFocus?: FocusEventHandler;
  inFixedNthColumn?: boolean;
  hasFixedNthColumn?: boolean;
  fixedCellVisible?: boolean;
  firstColumnMinWidth?: string;
  style?: React.CSSProperties;
  lastFixedFirstColumn?: boolean;
  hasBorderRight?: boolean;
  zebraStriping?: boolean;
  hasZebraStripingOnData?: boolean;
  increasedTableDensity?: boolean;
  mergedHeader?: boolean;
}

export function Cell({
  content,
  contentType,
  nthColumn,
  firstColumn,
  truncate,
  header,
  total,
  totalInFooter,
  sorted,
  sortable,
  sortDirection,
  inFixedNthColumn,
  verticalAlign = "top",
  defaultSortDirection = "ascending",
  onSort,
  colSpan,
  rowSpan,
  setRef,
  stickyHeadingCell = false,
  stickyCellWidth,
  hovered,
  fixedCellVisible = false,
  firstColumnMinWidth,
  style,
  lastFixedFirstColumn,
  hasBorderRight,
  zebraStriping,
  hasZebraStripingOnData,
  increasedTableDensity,
  mergedHeader,
}: CellProps) {
  const numeric = contentType === "numeric";

  let columnHeadingContent: React.ReactNode;
  if (sortable) {
    const direction = sorted && sortDirection ? sortDirection : defaultSortDirection;
    const iconSource = sorted ? (direction === "ascending" ? ArrowCaretUpIcon : ArrowCaretDownIcon) : ArrowSortIcon;
    const sortIconMarkup = (
      <StyledSortIcon>
        <Icon source={iconSource} />
      </StyledSortIcon>
    );

    let sortableHeadingContent: React.ReactNode;
    if (mergedHeader) {
      sortableHeadingContent = content;
    } else if (numeric) {
      sortableHeadingContent = (
        <StyledSortableHeadingButton onClick={onSort} increasedTableDensity={increasedTableDensity}>
          {sortIconMarkup}
          {content}
        </StyledSortableHeadingButton>
      );
    } else {
      sortableHeadingContent = (
        <StyledSortableHeadingButton onClick={onSort} increasedTableDensity={increasedTableDensity}>
          {content}
          {sortIconMarkup}
        </StyledSortableHeadingButton>
      );
    }

    columnHeadingContent = sortableHeadingContent;
  } else {
    columnHeadingContent = content;
  }

  const minWidthStyles =
    nthColumn && firstColumnMinWidth ? { minWidth: firstColumnMinWidth } : { minWidth: stickyCellWidth };

  const cellProps: CellStyleProps & {
    colSpan?: number;
    rowSpan?: number;
  } = {
    verticalAlign,
    separate: lastFixedFirstColumn && inFixedNthColumn && fixedCellVisible,
    fixedFirstColumn: nthColumn && inFixedNthColumn && stickyHeadingCell,
    totalInFooter,
    truncate,
    sortable,
    numeric,
    header,
    sorted,
    total,
    colSpan: colSpan && colSpan > 1 ? colSpan : undefined,
    rowSpan: rowSpan && rowSpan > 1 ? rowSpan : undefined,
    hasBorderRight,
    hovered,
    zebraStriping,
    hasZebraStripingOnData,
    increasedTableDensity,
    mergedHeader,
  };

  if (stickyHeadingCell) {
    return (
      <StyledCell
        ref={setRef}
        {...headerCell.props}
        {...cellProps}
        style={{
          ...style,
          ...minWidthStyles,
        }}
        data-index-table-sticky-heading
        as="th"
      >
        {columnHeadingContent}
      </StyledCell>
    );
  } else {
    const headingMarkup = header ? (
      <StyledCell {...headerCell.props} {...cellProps} style={{ ...minWidthStyles }} ref={setRef} scope="col" as="th">
        {columnHeadingContent}
      </StyledCell>
    ) : (
      <StyledCell {...cellProps} style={{ ...minWidthStyles }} ref={setRef} scope="row">
        {truncate ? <TruncatedText>{content}</TruncatedText> : content}
      </StyledCell>
    );

    const cellMarkup =
      header || firstColumn || nthColumn ? (
        headingMarkup
      ) : (
        <StyledCell {...cellProps}> {truncate ? <TruncatedText>{content}</TruncatedText> : content}</StyledCell>
      );
    return cellMarkup;
  }
}

const TruncatedText = ({ children }: { children: React.ReactNode }) => {
  const textRef = useRef<any | null>(null);
  const { current } = textRef;
  const text = <StyledTooltipContent ref={textRef}>{children}</StyledTooltipContent>;
  return current?.scrollWidth > current?.offsetWidth ? (
    <Tooltip content={textRef.current.innerText} hoverDelay={200}>
      {text}
    </Tooltip>
  ) : (
    text
  );
};

interface CellStyleProps {
  verticalAlign?: CellProps["verticalAlign"];
  fixedFirstColumn?: boolean;
  totalInFooter?: boolean;
  truncate?: boolean;
  sortable?: boolean;
  separate?: boolean;
  numeric?: boolean;
  mergedHeader?: boolean;
  header?: boolean;
  sorted?: boolean;
  total?: boolean;
  hasBorderRight?: boolean;
  hovered?: boolean;
  zebraStriping?: boolean;
  hasZebraStripingOnData?: boolean;
  increasedTableDensity?: boolean;
}

const StyledCell = styled.td<CellStyleProps>`
  padding: ${(p) =>
    p.sortable && !p.mergedHeader ? 0 : p.increasedTableDensity ? p.theme.spacing(2) : p.theme.spacing(3)};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;
  text-align: ${(p) => (p.mergedHeader ? "center" : p.numeric ? "right" : "left")};
  transition: background-color ${(p) => p.theme.motion.duration200} ${(p) => p.theme.motion.transformEaseInOut};
  vertical-align: ${(p) => p.verticalAlign};
  ${(p) =>
    p.truncate &&
    css`
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
      max-width: ${p.theme.components.dataTable.firstColumnMaxWidth};
    `}
  ${(p) =>
    p.header &&
    css`
      border-bottom: ${p.mergedHeader || p.hasZebraStripingOnData ? "none" : p.theme.shape.borderDivider};
      border-top: 0;
      font-weight: ${p.theme.typography.fontWeightMedium};
    `}

  ${(p) =>
    (p.zebraStriping || p.header) &&
    css`
      background-color: ${p.theme.components.dataTable.zebraBackgroundColor};
    `}

  ${(p) =>
    p.hasBorderRight &&
    css`
      border-right: ${p.theme.shape.borderDivider};
    `}
  ${(p) =>
    p.total &&
    css`
      font-weight: ${p.theme.typography.fontWeightMedium};
      border-bottom: ${p.zebraStriping || p.hasZebraStripingOnData ? "none" : p.theme.shape.borderDivider};
    `}
  ${(p) =>
    p.totalInFooter &&
    css`
      border-top: ${p.theme.shape.borderDivider};
      border-bottom: none;
      ${p.theme.breakpoints.up("sm")} {
        &:first-of-type {
          border-bottom-left-radius: ${p.theme.shape.borderRadius("base")};
        }

        &:last-child {
          border-bottom-right-radius: ${p.theme.shape.borderRadius("base")};
        }
      }
    `}
  ${(p) =>
    p.separate &&
    css`
      ::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        border-right: ${p.theme.shape.borderDivider};
      }
    `}
  ${(p) =>
    p.fixedFirstColumn &&
    css`
      position: sticky;
      background: inherit;
      border-spacing: 0;
      z-index: 3;
      left: 0;
      top: 0;
      ${p.theme.breakpoints.down("md")} {
        z-index: 1;
      }
    `}
  ${(p) =>
    p.hovered &&
    css`
      ${p.theme.breakpoints.up("md")} {
        background-color: ${p.theme.colors.surfaceHovered};
      }
    `}
`;

const StyledSortIcon = styled.span`
  opacity: 0.5;
  display: flex;
  align-self: flex-end;
`;

const StyledSortableHeadingButton = styled.button<{
  increasedTableDensity?: boolean;
}>`
  ${unstyledButton}
  position: relative;
  display: inline-flex;
  justify-content: flex-end;
  align-items: baseline;
  color: ${(p) => p.theme.colors.text};
  padding: ${(p) => p.theme.spacing(1)};
  margin: ${(p) => (p.increasedTableDensity ? p.theme.spacing(1) : p.theme.spacing(2))};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  &:hover,
  &:focus {
    ${StyledSortIcon} {
      opacity: 1;
    }
  }
  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledTooltipContent = styled.span`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
