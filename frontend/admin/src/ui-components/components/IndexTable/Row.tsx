import React, { memo, useCallback, useMemo, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useToggle } from "../../utils/useToggle";

import { StyledCell, StyledCellFirst, StyledCellPrefix } from "./Cell";
import { Checkbox } from "./Checkbox";
import { RowContext, RowContextType, RowHoveredContext, useIndexRow, useIndexSelectionChange } from "./context";
import { Prefix } from "./Prefix";
import { SelectionType } from "./types";

type TableRowElementType = HTMLTableRowElement & HTMLLIElement;

export interface RowProps {
  /** Nội dung của row */
  children: React.ReactNode;
  /** Định danh của row */
  id: string;
  /** Vị trí của row trong bảng */
  position: number;
  /** Row có đang được chọn */
  selected?: boolean;
  /** Row có màu subdued */
  subdued?: boolean;
  /** Vô hiệu hóa row */
  disabled?: boolean;
  /** Trạng thái của row */
  status?: "succcess" | "critical" | "selected";
  /** Phần tử đằng trước row */
  prefix?: React.ReactNode;
  /** Callback khi row được click */
  onClick?(): void;
}

export const Row = memo(function Row({
  children,
  selected,
  id,
  position,
  subdued,
  disabled,
  status,
  prefix,
  onClick,
}: RowProps) {
  const { selectable, selectMode, condensed } = useIndexRow();
  const onSelectionChange = useIndexSelectionChange();
  const { value: hovered, setTrue: setHoverIn, setFalse: setHoverOut } = useToggle(false);

  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (disabled || !selectable || ("key" in e && e.key !== " ")) {
        return;
      }
      const selectionType = e.nativeEvent.shiftKey ? SelectionType.Multi : SelectionType.Single;
      onSelectionChange(selectionType, !selected, id, position);
    },
    [disabled, id, onSelectionChange, position, selectable, selected]
  );

  const rowContext = useMemo(
    (): RowContextType => ({
      itemId: id,
      selected,
      position,
      onInteraction: handleInteraction,
      disabled,
    }),
    [id, selected, position, handleInteraction, disabled]
  );

  const primaryLinkElement = useRef<HTMLAnchorElement | null>(null);
  const isNavigating = useRef<boolean>(false);
  const tableRowRef = useRef<TableRowElementType | null>(null);

  const tableRowCallbackRef = useCallback((node: TableRowElementType) => {
    tableRowRef.current = node;

    const el = node?.querySelector("[data-primary-link]");

    if (el) {
      primaryLinkElement.current = el as HTMLAnchorElement;
    }
  }, []);

  let handleRowClick;

  if ((!disabled && selectable) || primaryLinkElement.current) {
    handleRowClick = (e: React.MouseEvent) => {
      if (!tableRowRef.current || isNavigating.current) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();

      if (onClick) {
        onClick();
        return;
      }

      if (primaryLinkElement.current && !selectMode) {
        isNavigating.current = true;
        const { ctrlKey, metaKey } = e.nativeEvent;
        if (primaryLinkElement.current instanceof HTMLAnchorElement) {
          if (ctrlKey || metaKey) {
            isNavigating.current = false;
            window.open(primaryLinkElement.current.href, "_blank");
            return;
          }
          // Don't wanna fire dispatch event because that is already handled by primary link
          if (primaryLinkElement.current.contains(e.target as any)) {
            return;
          }
        }

        primaryLinkElement.current.dispatchEvent(new MouseEvent(e.type, e.nativeEvent));
      } else {
        isNavigating.current = false;
        handleInteraction(e);
      }
    };
  }

  const prefixMarkup = prefix ? <Prefix>{prefix}</Prefix> : null;

  const checkboxMarkup = selectable ? <Checkbox prefix={!!prefixMarkup} /> : null;

  return (
    <RowContext.Provider value={rowContext}>
      <RowHoveredContext.Provider value={hovered}>
        <StyledTableRow
          key={id}
          as={condensed ? "li" : "tr"}
          onMouseEnter={setHoverIn}
          onMouseLeave={setHoverOut}
          onClick={handleRowClick}
          $subdued={subdued}
          $disabled={disabled}
          $selected={selected}
          $selectable={selectable}
          $clickable={selectable || !!primaryLinkElement.current}
          $condensed={condensed}
          $hovered={hovered}
          $status={status}
          ref={tableRowCallbackRef}
        >
          {prefixMarkup}
          {checkboxMarkup}
          {children}
        </StyledTableRow>
      </RowHoveredContext.Provider>
    </RowContext.Provider>
  );
});

const StyledTableRow = styled.tr<{
  $selectable?: boolean;
  $clickable?: boolean;
  $condensed?: boolean;
  $selected?: boolean;
  $subdued?: boolean;
  $hovered?: boolean;
  $disabled?: boolean;
  $status?: RowProps["status"];
}>`
  background-color: ${(p) => p.theme.colors.surface};
  cursor: pointer;
  border-top: ${(p) => p.theme.shape.borderDivider};

  ${(p) => {
    if (p.$selected || p.$hovered || p.$status) {
      let color: string;
      if (p.$selected || p.$hovered) {
        color = p.$selected ? p.theme.colors.surfaceSelected : p.theme.colors.surfaceHovered;
        if (p.$selected && p.$hovered) {
          color = p.theme.colors.surfaceSelectedHovered;
        }
      } else {
        switch (p.$status) {
          case "critical":
            color = p.theme.colors.surfaceCritical;
            break;
          case "selected":
            color = p.theme.colors.surfaceSelected;
            break;
          default:
            color = p.theme.colors.surfaceSuccess;
            break;
        }
      }
      return css`
        &,
        ${StyledCellPrefix},
          ${StyledCellPrefix}
          + ${StyledCell},
          ${StyledCellFirst},
          ${StyledCellFirst}
          + ${StyledCell} {
          background-color: ${color} !important;
        }
      `;
    }
    return null;
  }}

  ${(p) =>
    p.$subdued &&
    css`
      background-color: ${p.theme.colors.surfaceSubdued};
    `}

  ${(p) =>
    p.$disabled &&
    css`
      cursor: default;
      color: ${p.theme.colors.textSubdued};
    `}

  ${(p) =>
    p.$selectable &&
    p.$condensed &&
    css`
      width: calc(100% + ${p.theme.components.indexTable.translateOffset});
      transform: translateX(calc(-1 * ${p.theme.components.indexTable.translateOffset}));
      transition: transform ${p.theme.motion.transformEase} ${p.theme.motion.duration200};
      display: flex;
      border-top: ${p.theme.shape.borderDivider};
      filter: none;
      align-items: center;
    `}

  ${(p) =>
    !p.$selectable &&
    css`
      cursor: ${p.$clickable ? "pointer" : "auto"};
      ${p.$hovered &&
      css`
        ${StyledCell}:first-of-type {
          background-color: ${p.theme.colors.surfaceHovered};
        }
      `}
    `}
`;
