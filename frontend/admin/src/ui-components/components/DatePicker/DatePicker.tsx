import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { ArrowChevronBigLeftIcon, ArrowChevronBigRightIcon } from "@/ui-icons";
import { isAfter, isBefore } from "date-fns";

import { Button } from "../Button";

import { Month } from "./Month";
import { Range } from "./types";
import { deriveRange } from "./utils";

export interface DatePickerProps {
  /** Tháng để hiển thị, từ 0 tới 11. 0 là tháng 1, 1 là tháng 2 ... 11 là tháng 12. */
  month: number;
  /** Năm để hiển thị */
  year: number;
  /** Hiển thị lựa chọn tháng, năm trực tiếp. */
  monthYearSelection?: boolean;
  /** Khoảng lựa chọn có thể đổ ra nhiều tháng. */
  multiMonth?: boolean;
  /** Ngày hoặc khoảng ngày được chọn */
  selected?: Date | Range;
  /** Disable những ngày trước ngày này. */
  disableDatesBefore?: Date;
  /** Disable những ngày sau ngày này. */
  disableDatesAfter?: Date;
  /** Cho phép chọn khoảng ngày. */
  allowRange?: boolean;
  /** Callback khi tháng, năm thay đổi. */
  onMonthChange?(month: number, year: number): void;
  /** Callback khi khoảng ngày thay đổi. */
  onChange?(date: Range): void;
}

export function DatePicker({
  month,
  year,
  monthYearSelection,
  multiMonth,
  selected,
  disableDatesAfter,
  disableDatesBefore,
  allowRange,
  onMonthChange,
  onChange,
}: DatePickerProps) {
  const selectedRange = useMemo(() => deriveRange(selected), [selected]);
  const [hoverDay, setHoverDay] = useState<Date | undefined>(undefined);
  const [focusDay, setFocusDay] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setFocusDay(undefined);
  }, [selected]);

  const handleFocus = useCallback((date: Date) => {
    setFocusDay(date);
  }, []);

  const setFocusDayAndHandleMonthChange = useCallback(
    (date: Date) => {
      if (onMonthChange) {
        onMonthChange(date.getMonth(), date.getFullYear());
      }
      setHoverDay(date);
      setFocusDay(date);
    },
    [onMonthChange]
  );

  const handleDateSelection = useCallback(
    (range: Range) => {
      const { end } = range;
      setHoverDay(end);
      setFocusDay(new Date(end));
      onChange?.(range);
    },
    [onChange]
  );

  const handleMonthChange = useCallback(
    (month: number, year: number) => {
      if (!onMonthChange) {
        return;
      }
      setFocusDay(undefined);
      onMonthChange(month, year);
    },
    [onMonthChange]
  );

  const handleNextMonth = useCallback(() => {
    if (!onMonthChange) {
      return;
    }
    setFocusDay(undefined);
    if (month === 11) {
      onMonthChange(0, year + 1);
    } else {
      onMonthChange(month + 1, year);
    }
  }, [month, onMonthChange, year]);

  const handlePreviousMonth = useCallback(() => {
    if (!onMonthChange) {
      return;
    }
    setFocusDay(undefined);
    if (month === 0) {
      onMonthChange(11, year - 1);
    } else {
      onMonthChange(month - 1, year);
    }
  }, [month, onMonthChange, year]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;

      const range = deriveRange(selected);
      const focusedDay = focusDay || (range && range.start);

      if (!focusedDay) {
        return;
      }

      if (key === "ArrowUp") {
        const previousWeek = new Date(focusedDay);
        previousWeek.setDate(focusedDay.getDate() - 7);
        if (!(disableDatesBefore && isBefore(previousWeek, disableDatesBefore))) {
          setFocusDayAndHandleMonthChange(previousWeek);
        }
      }

      if (key === "ArrowDown") {
        const nextWeek = new Date(focusedDay);
        nextWeek.setDate(focusedDay.getDate() + 7);
        if (!(disableDatesAfter && isAfter(nextWeek, disableDatesAfter))) {
          setFocusDayAndHandleMonthChange(nextWeek);
        }
      }

      if (key === "ArrowRight") {
        const tomorrow = new Date(focusedDay);
        tomorrow.setDate(focusedDay.getDate() + 1);
        if (!(disableDatesAfter && isAfter(tomorrow, disableDatesAfter))) {
          setFocusDayAndHandleMonthChange(tomorrow);
        }
      }

      if (key === "ArrowLeft") {
        const yesterday = new Date(focusedDay);
        yesterday.setDate(focusedDay.getDate() - 1);
        if (!(disableDatesBefore && isBefore(yesterday, disableDatesBefore))) {
          setFocusDayAndHandleMonthChange(yesterday);
        }
      }
    },
    [disableDatesAfter, disableDatesBefore, focusDay, selected, setFocusDayAndHandleMonthChange]
  );

  const secondMonthMarkup = multiMonth ? (
    <Month
      month={month === 11 ? 0 : month}
      year={month === 11 ? year + 1 : year}
      selected={selectedRange}
      monthYearSelection={monthYearSelection}
      disableDatesAfter={disableDatesAfter}
      disableDatesBefore={disableDatesBefore}
      allowRange={allowRange}
      hoverDay={hoverDay}
      focusedDay={focusDay}
      onFocus={handleFocus}
      onChange={handleDateSelection}
      onChangeHoverDay={setHoverDay}
      onMonthChange={handleMonthChange}
    />
  ) : null;

  const headerMarkup = !monthYearSelection ? (
    <StyledHeader>
      <Button plain onClick={handlePreviousMonth} icon={ArrowChevronBigLeftIcon} />
      <Button plain onClick={handleNextMonth} icon={ArrowChevronBigRightIcon} />
    </StyledHeader>
  ) : null;

  return (
    <StyledDatePicker onKeyUp={handleKeyUp} onKeyDown={handleKeyDown}>
      {headerMarkup}
      <StyledMonthLayout>
        <Month
          month={month}
          year={year}
          selected={selectedRange}
          monthYearSelection={monthYearSelection}
          disableDatesAfter={disableDatesAfter}
          disableDatesBefore={disableDatesBefore}
          allowRange={allowRange}
          hoverDay={hoverDay}
          focusedDay={focusDay}
          onFocus={handleFocus}
          onChange={handleDateSelection}
          onChangeHoverDay={setHoverDay}
          onMonthChange={handleMonthChange}
        />
        {secondMonthMarkup}
      </StyledMonthLayout>
    </StyledDatePicker>
  );
}

function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  const { key } = event;

  if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
    event.preventDefault();
    event.stopPropagation();
  }
}

const StyledDatePicker = styled.div`
  position: relative;
`;

const StyledHeader = styled.div`
  position: absolute;
  top: ${(p) => p.theme.spacing(4)};
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: ${(p) => p.theme.spacing(4)};
  padding-right: ${(p) => p.theme.spacing(4)};
`;

const StyledMonthLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * ${(p) => p.theme.spacing(4)});
  margin-left: calc(-1 * ${(p) => p.theme.spacing(4)});
`;
