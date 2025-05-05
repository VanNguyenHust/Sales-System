import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { unstyledButton } from "../../utils/styles";

import { StyledCell, StyledCellFirst, StyledCellPrefix } from "./Cell";

export const UI_INDEX_TABLE_SCROLLBAR_CONTENT_WIDTH = "--ui-index-table-scroll-bar-content-width";

export const StyledIndexTable = styled.div`
  position: relative;
  border-radius: inherit;
  scrollbar-color: auto;
`;

export const StyledStickyTable = styled.div<{
  $condensed?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  visibility: hidden;
  z-index: ${(p) => p.theme.zIndex.indexTableLoadingPanel};
`;
export const StyledSelectAllActionsWrapper = styled.div`
  visibility: visible;
  position: relative;
  z-index: ${(p) => p.theme.zIndex.indexTableLoadingPanel};
  top: 0;
  left: 0;
  right: 0;
  padding: ${(p) => p.theme.spacing(0, 2, 0, 4)};
  background-color: ${(p) => p.theme.components.indexTable.headerBackgroundColor};
  border-top-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-top-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-bottom: ${(p) => p.theme.shape.borderDivider};
`;

export const StyledHeaderWrapper = styled.div<{
  $unselectable?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: ${(p) => (p.$unselectable ? "auto" : p.theme.spacing(12))};
  padding: ${(p) => (p.$unselectable ? "0" : `${p.theme.spacing(2)} ${p.theme.spacing(4)}`)};
  background-color: ${(p) => p.theme.colors.surfaceSubdued};
`;

export const StyledStickyTableHeader = styled.div<{
  $sticky?: boolean;
}>`
  position: absolute;
  display: flex;
  width: 100%;

  ${(p) =>
    p.$sticky
      ? css`
          visibility: visible;
          background-color: ${p.theme.colors.surface};
          box-shadow: ${p.theme.shadow.base};
        `
      : css`
          top: -1000px;
          left: -1000px;
        `}
`;
export const StyledStickyTableColumnHeader = styled.div`
  flex: 0 0 auto;
`;

export const StyledStickyTableHeadings = styled.div`
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
`;

export const StyledFirstStickyHeaderElement = styled.div<{
  hasTwin?: boolean;
}>`
  ${(p) =>
    p.hasTwin &&
    css`
      padding-left: ${p.theme.spacing(4)};
    `}
`;

export const StyledColumnHeaderCheckboxWrapper = styled.div`
  display: flex;
`;

export const StyledStickyTableHeadingSecondScrolling = styled.div`
  display: none;
  padding: ${(p) => p.theme.spacing(0, 0.25, 0, 4)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    display: block;
  }
`;

export const StyledTableHeading = styled.div<{
  headingAlignment?: "center" | "end" | "start";
  $sortable?: boolean;
  $flush?: boolean;
  $unselectable?: boolean;
}>`
  background-color: ${(p) => p.theme.components.indexTable.headerBackgroundColor};
  z-index: ${(p) => p.theme.zIndex(1)};
  padding: calc(${(p) => p.theme.spacing(3)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(4)};
  text-align: left;
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSize100};
  white-space: nowrap;
  border: 0;

  ${(p) =>
    p.$sortable &&
    css`
      background: ${p.theme.components.indexTable.headerBackgroundColor};
    `}

  ${(p) =>
    p.$flush &&
    css`
      padding: 0;
    `}

  ${(p) => {
    switch (p.headingAlignment) {
      case "end":
        return css`
          text-align: right;
        `;
      case "center":
        return css`
          text-align: center;
        `;
      default:
        return null;
    }
  }}
`;

export const StyledTableHeadingFirst = styled(StyledTableHeading)`
  position: sticky;
  left: 0;
  z-index: 1;
  padding-left: ${(p) => p.theme.spacing(4)};
  padding-right: ${(p) => p.theme.spacing(4)};
  width: ${(p) => p.theme.spacing(5)};
  & + & {
    padding-left: 0;
  }
`;

export const StyledTableHeadingSecond = styled(StyledTableHeading)`
  ${(p) =>
    !p.$unselectable &&
    css`
      padding-left: 0;
    `}
`;

export const StyledStickyTableHeadingSecond = styled(StyledTableHeading)`
  padding-left: 0;
  ${(p) => p.theme.breakpoints.up("sm")} {
    display: none;
  }
`;

export const StyledSortableHeadingIcon = styled.span`
  opacity: 0.5;
`;

export const StyledSortableHeadingButton = styled.button`
  ${unstyledButton}
  position: static;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSize100};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  line-height: ${(p) => p.theme.typography.fontLineHeight1};
  &:hover,
  &:focus {
    ${StyledSortableHeadingIcon} {
      opacity: 1;
    }
  }

  &:focus-visible {
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

export const StyledSortableHeadingWrapper = styled.span`
  cursor: pointer;
`;

export const StyledTableWrapper = styled.div`
  border-radius: inherit;
`;

export const StyledEmptySearchResultWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
`;

export const StyledScrollBar = styled.div`
  overflow-x: scroll;
  width: 100%;
  margin: 0;
  padding: 0;
  &::-webkit-scrollbar-track {
    border-radius: ${(p) => p.theme.shape.borderRadius(1)};
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    appearance: none;
    width: ${(p) => p.theme.spacing(2)};
    height: ${(p) => p.theme.spacing(2)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: ${(p) => p.theme.shape.borderRadius(1)};
    background-color: ${(p) => p.theme.components.scrollBar.scrollBarThumbColor};
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.components.scrollBar.scrollBarThumbHoverColor};
  }
`;

export const StyledScrollBarContainer = styled.div<{
  $condensed?: boolean;
  $hidden?: boolean;
}>`
  position: sticky;
  z-index: ${(p) => p.theme.zIndex.indexTableScrollBar};
  bottom: 0;
  padding: ${(p) => p.theme.spacing(0.5)};
  background-color: ${(p) => p.theme.colors.surface};
  border-bottom-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-bottom-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
  ${(p) =>
    p.$condensed &&
    css`
      visibility: hidden;
      pointer-events: none;
    `}
  ${(p) =>
    p.$hidden &&
    css`
      height: 0;
      padding: 0;
      ${StyledScrollBar} {
        height: 0;
      }
    `}
`;

export const StyledScrollBarContent = styled.div`
  height: 1px;
  width: var(${UI_INDEX_TABLE_SCROLLBAR_CONTENT_WIDTH});
`;

export const StyledCondensedList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export const StyledTableHeadingRow = styled.tr``;

export const StyledTable = styled.table<{
  disableTextSelection?: boolean;
  $sticky?: boolean;
  $scrolling?: boolean;
  $unselectable?: boolean;
  $sortable?: boolean;
  selectMode?: boolean;
}>`
  width: 100%;
  min-width: 100%;
  border-collapse: collapse;
  ${(p) =>
    p.disableTextSelection &&
    css`
      user-select: none;
    `}

  ${(p) =>
    p.$sticky &&
    css`
      ${StyledCellPrefix} + ${StyledCell},
      ${StyledCellFirst} + ${StyledCell} {
        ${p.theme.breakpoints.up("sm")} {
          position: sticky;
          z-index: ${p.theme.zIndex.indexTableStickyCell};
        }
      }

      ${StyledTableHeadingSecond} {
        ${p.theme.breakpoints.up("sm")} {
          position: sticky;
          left: 0;
          z-index: 1;
        }
      }
    `}

  ${(p) =>
    p.$unselectable &&
    css`
      ${p.$sticky &&
      css`
        ${StyledCell}:first-of-type {
          position: sticky;
          z-index: ${p.theme.zIndex.indexTableStickyCell};
          left: 0;
          background-color: ${p.theme.colors.surface};
        }
      `}
    `}

  ${(p) =>
    p.$scrolling &&
    css`
      ${StyledCellPrefix},
      ${StyledCellFirst},
      ${StyledCellFirst} + ${StyledCell},
      ${StyledCellPrefix} + ${StyledCell},
      ${StyledTableHeadingFirst},
      ${StyledTableHeadingSecond} {
        visibility: visible;
        background-color: ${p.theme.colors.surface};
      }

      ${StyledTableHeadingFirst},
      ${StyledCellPrefix},
      ${StyledCellFirst} {
        filter: drop-shadow(1px 0 0 ${p.theme.colors.divider});
      }

      ${p.$sticky &&
      css`
        ${StyledCellPrefix} + ${StyledCell},
        ${StyledCellFirst} + ${StyledCell},
        ${StyledTableHeadingSecond} {
          ${p.theme.breakpoints.up("sm")} {
            filter: drop-shadow(1px 0 0 ${p.theme.colors.divider});
          }
        }

        ${p.$unselectable &&
        css`
          ${StyledTableHeadingSecond},
          ${StyledCell}:first-of-type {
            filter: drop-shadow(1px 0 0 ${p.theme.colors.divider});
          }
        `}
      `}

      ${p.$unselectable &&
      css`
        ${StyledTableHeadingSecond},
        ${StyledCell}:first-of-type {
          visibility: visible;
        }
      `}
    `}
`;
