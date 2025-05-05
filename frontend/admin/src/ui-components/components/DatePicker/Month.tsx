import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { isAfter, isBefore, isSameDay } from "date-fns";

import { useI18n } from "../../utils/i18n";
import { Select2 } from "../Select2";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { Day } from "./Day";
import { Range } from "./types";
import {
  dateIsSelected,
  dayNames,
  getNewRange,
  getWeeksForMonth,
  getYearSelection,
  isDayBetween,
  monthName,
  monthNames,
} from "./utils";

export interface MonthProps {
  month: number;
  year: number;
  selected?: Range;
  hoverDay?: Date;
  focusedDay?: Date;
  disableDatesBefore?: Date;
  disableDatesAfter?: Date;
  allowRange?: boolean;
  monthYearSelection?: boolean;
  onChange?(date: Range): void;
  onMonthChange?(month: number, year: number): void;
  onChangeHoverDay?(day: Date | undefined): void;
  onFocus?(day: Date): void;
}

export function Month({
  month,
  year,
  selected,
  focusedDay,
  monthYearSelection,
  disableDatesBefore,
  disableDatesAfter,
  allowRange,
  hoverDay,
  onMonthChange = noop,
  onChange = noop,
  onChangeHoverDay = noop,
  onFocus = noop,
}: MonthProps) {
  const i18n = useI18n();
  const hoverable = allowRange && (!selected || isSameDay(selected.start, selected.end));

  const weeks = useMemo(() => getWeeksForMonth(year, month), [year, month]);

  const handleMouseLeave = useCallback(() => {
    onChangeHoverDay?.(undefined);
  }, [onChangeHoverDay]);

  const handleHover = useCallback(
    (day: Date) => {
      if (hoverable) {
        onChangeHoverDay?.(day);
      }
    },
    [hoverable, onChangeHoverDay]
  );

  const handleClick = useCallback(
    (day: Date) => {
      const newRange = allowRange
        ? getNewRange(selected, day)
        : {
            start: day,
            end: day,
          };
      onChange?.(newRange);
      onChangeHoverDay?.(undefined);
    },
    [allowRange, onChange, onChangeHoverDay, selected]
  );

  function renderWeek(day: Date, dayIndex: number) {
    const lastDay = hoverDay ? hoverDay : selected?.end;
    const isFirst = !!selected && isSameDay(day, selected.start);
    const isLast = lastDay ? isSameDay(day, lastDay) : false;
    const inHoveringRange = selected && allowRange && hoverDay ? isDayBetween(day, selected.start, hoverDay) : false;
    const inHoveringRight = selected && allowRange && hoverDay ? isBefore(selected.start, hoverDay) : false;
    const inRange = selected ? isDayBetween(day, selected.start, selected.end) : false;
    const rangeIsDifference = selected ? !isSameDay(selected.start, selected.end) : false;
    const isDisabled =
      (!!disableDatesBefore && isBefore(day, disableDatesBefore)) ||
      (!!disableDatesAfter && isAfter(day, disableDatesAfter));
    return (
      <Day
        key={dayIndex}
        day={day}
        disabled={isDisabled}
        focused={focusedDay && isSameDay(day, focusedDay)}
        isFirst={isFirst}
        isLast={isLast}
        inRange={inRange}
        selectedMonth={month}
        selectedYear={year}
        selected={!!selected && dateIsSelected(day, selected)}
        rangeIsDifference={rangeIsDifference}
        inHoveringRange={inHoveringRange}
        isHoveringRight={inHoveringRight}
        onClick={handleClick}
        onHover={handleHover}
        onFocus={onFocus}
      />
    );
  }

  // eslint-disable-next-line react/no-array-index-key
  const weeksMarkup = weeks.map((week, index) => <tr key={index}>{week.map(renderWeek)}</tr>);

  const weekdaysMarkup = dayNames.map((dayName) => (
    <StyledWeekday key={dayName}>{i18n.translate(`UI.DatePicker.days.${dayName}`)}</StyledWeekday>
  ));

  const headerMarkup = monthYearSelection ? (
    <Stack spacing="baseTight" alignment="center">
      <StyledMonthSelect>
        <Select2
          value={`${month}`}
          options={monthNames.map((_, m) => ({
            label: i18n.translate(`UI.DatePicker.months.${monthName(m)}`),
            value: `${m}`,
          }))}
          onChange={(m) => onMonthChange?.(parseInt(m), year)}
        />
      </StyledMonthSelect>
      <Select2
        value={`${year}`}
        options={getYearSelection().map((y) => ({
          label: `${y}`,
          value: `${y}`,
        }))}
        onChange={(y) => onMonthChange?.(month, parseInt(y))}
      />
    </Stack>
  ) : (
    <Text as="h6" variant="bodyXs" fontWeight="medium">
      {i18n.translate(`UI.DatePicker.months.${monthName(month)}`)}&nbsp;{year}
    </Text>
  );

  return (
    <StyledContainer>
      <StyledHeader>{headerMarkup}</StyledHeader>
      <StyledMonth onMouseLeave={handleMouseLeave}>
        <thead>
          <tr>{weekdaysMarkup}</tr>
        </thead>
        <tbody>{weeksMarkup}</tbody>
      </StyledMonth>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  min-width: ${(p) => p.theme.components.datePicker.minWidth};
  margin-top: ${(p) => p.theme.spacing(4)};
  margin-left: ${(p) => p.theme.spacing(4)};
  flex: 1 1 ${(p) => p.theme.components.datePicker.minWidth};
  max-width: calc(100% - ${(p) => p.theme.spacing(4)});
`;

const StyledMonth = styled.table`
  width: 100%;
  border-spacing: ${(p) => p.theme.spacing(0, 2)};
`;

const StyledMonthSelect = styled.div`
  min-width: 6rem;
`;

const StyledHeader = styled.div`
  margin-top: ${(p) => p.theme.spacing(0.5)};
  padding-bottom: ${(p) => p.theme.spacing(1)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWeekday = styled.th`
  font-size: ${(p) => p.theme.typography.fontSize200};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  text-align: center;
  height: ${(p) => p.theme.components.datePicker.cellSize};
  padding: 0;
`;

function noop() {}
