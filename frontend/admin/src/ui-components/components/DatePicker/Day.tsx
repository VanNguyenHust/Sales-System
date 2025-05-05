import React, { memo, useCallback, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { format, isSameDay } from "date-fns";

import { useI18n } from "../../utils/i18n";
import { unstyledButton } from "../../utils/styles";

import { isHasMonthYear, monthName } from "./utils";

export interface DayProps {
  day: Date;
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
  focused?: boolean;
  selected?: boolean;
  selectedMonth: number;
  selectedYear: number;
  inRange: boolean;
  rangeIsDifference: boolean;
  inHoveringRange: boolean;
  isHoveringRight: boolean;
  onClick(day: Date): void;
  onHover(day: Date): void;
  onFocus?(day: Date): void;
}

export const Day = memo(function Day({
  day,
  isFirst,
  isLast,
  inRange,
  focused,
  selected,
  selectedMonth,
  selectedYear,
  rangeIsDifference,
  inHoveringRange,
  isHoveringRight,
  disabled,
  onClick,
  onHover,
  onFocus,
}: DayProps) {
  const i18n = useI18n();
  const today = new Date();
  const isToday = isSameDay(day, today);
  const isSelected = inRange || inHoveringRange || isFirst || isLast;
  const isOutOfMonth = !isHasMonthYear(day, selectedMonth, selectedYear);
  const ariaLabel = [
    `${isSelected ? `selected ` : ""}`,
    `${isToday ? `${i18n.translate("UI.DatePicker.today")} ` : ""}`,
    `${i18n.translate(`UI.DatePicker.months.${monthName(day.getMonth())}`)} `,
    `${day.getDate()} `,
    `${day.getFullYear()}`,
  ].join("");
  const dayRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => onClick(day), [day, onClick]);
  const handleHover = useCallback(() => onHover(day), [day, onHover]);

  useEffect(() => {
    if (focused && dayRef.current) {
      dayRef.current.focus();
    }
  }, [focused]);

  const tabIndex =
    focused ||
    selected ||
    (isToday && isHasMonthYear(today, selectedMonth, selectedYear)) ||
    (day.getDate() === 1 && !disabled && !isOutOfMonth)
      ? 0
      : -1;

  return (
    <StyledCell
      isFirst={isFirst}
      isLast={isLast}
      inRange={inRange}
      rangeIsDifference={rangeIsDifference}
      inHoveringRange={inHoveringRange}
      isHoveringRight={isHoveringRight}
      isOutOfMonth={isOutOfMonth}
      $disabled={disabled}
      today={isToday}
    >
      <StyledDay
        disabled={disabled}
        onClick={handleClick}
        onMouseOver={handleHover}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        type="button"
        ref={dayRef}
        onFocus={() => onFocus?.(day)}
      >
        {format(day, "d")}
      </StyledDay>
    </StyledCell>
  );
});

const StyledDay = styled.button`
  ${unstyledButton}
  font-size: ${(p) => p.theme.typography.fontSize100};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  width: ${(p) => p.theme.components.datePicker.cellSize};
  height: ${(p) => p.theme.components.datePicker.cellSize};
  border-radius: 50%;
  padding: ${(p) => p.theme.spacing(0.5, 1)};

  &:hover {
    color: ${(p) => p.theme.colors.surface};
    background-color: ${(p) => p.theme.colors.textPrimaryHovered};
  }

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledCell = styled.td<{
  inRange: boolean;
  rangeIsDifference: boolean;
  inHoveringRange: boolean;
  isHoveringRight: boolean;
  isFirst: boolean;
  isLast: boolean;
  isOutOfMonth: boolean;
  today: boolean;
  $disabled: boolean;
}>`
  position: relative;
  text-align: center;
  padding: 0;

  ${(p) => {
    if ((p.isFirst || p.isLast) && !p.rangeIsDifference && !p.inHoveringRange) {
      return null;
    }
    const bg = css`
      background: ${p.theme.colors.actionSecondaryHovered};
    `;
    const bgLeft = css`
      background: linear-gradient(90deg, ${p.theme.colors.actionSecondaryHovered} 50%, transparent 50%);
    `;
    const bgRight = css`
      background: linear-gradient(90deg, transparent 50%, ${p.theme.colors.actionSecondaryHovered} 50%);
    `;
    if (p.isFirst) {
      if (!p.inHoveringRange) {
        return bgRight;
      }
      return p.isHoveringRight ? bgRight : bgLeft;
    }
    if (p.isLast) {
      if (!p.inHoveringRange) {
        return bgLeft;
      }
      return p.isHoveringRight ? bgLeft : bgRight;
    }
    if (p.inHoveringRange || p.inRange) {
      return bg;
    }
    return null;
  }}

  ${StyledDay} {
    ${(p) => {
      if (p.isLast || p.isFirst) {
        return css`
          color: ${p.theme.colors.surface};
          background-color: ${p.theme.colors.actionPrimary};
        `;
      }
      if (p.inHoveringRange) {
        return css`
          background: ${p.theme.colors.actionSecondaryHovered};
        `;
      }
      if (p.$disabled) {
        return css`
          pointer-events: none;
          color: ${p.theme.colors.textDisabled};
          background: ${p.theme.colors.surfacePressed};
        `;
      }
      if (p.today) {
        return css`
          border: ${p.theme.shape.borderWidth(1)} solid ${p.theme.colors.borderSubdued};
        `;
      }
      return p.isOutOfMonth
        ? css`
            color: ${p.theme.colors.icon};
          `
        : null;
    }}
  }
`;
