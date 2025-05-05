import React, { memo, useCallback, useMemo, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { format, isAfter, isBefore, isSameDay, isWithinInterval, parse } from "date-fns";

import { fakeI18n, getDaysInAMonth } from "./DateUtils";

interface CalendarProps {
  month: number;
  year: number;
  firstDate: Date | null | undefined;
  secondDate?: Date | null | undefined;
  onClickDay: (value: Date) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  isDateRange?: boolean;
}

const Calendar = memo(function Calendar({
  month,
  year,
  firstDate,
  secondDate,
  onClickDay,
  minDate,
  maxDate,
  isDateRange,
}: CalendarProps) {
  const daysInAMonth = useMemo(() => getDaysInAMonth(year, month), [year, month]);
  const weekdays = useMemo(() => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], []);
  const getDay = useCallback((text: string | null | undefined) => {
    if (!text) return new Date();
    return parse(text, "dd-MM-yyyy", new Date());
  }, []); //daysInAMonth

  const [dayFocus, setDayFocus] = useState<Date | null>(null);
  const today = format(new Date(), "dd-MM-yyyy");

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target: any = e.target || e.currentTarget;
      setDayFocus(getDay(target.getAttribute("data-value")));
    },
    [getDay]
  );

  const handleMouseLeave = useCallback(() => {
    setDayFocus(null);
  }, []);

  const isFocused = useCallback(
    (currentDate: Date) => {
      if (firstDate && !secondDate && dayFocus && isAfter(dayFocus, firstDate)) {
        return isAfter(currentDate, firstDate) && isBefore(currentDate, dayFocus);
      }
    },
    [dayFocus, firstDate, secondDate]
  );

  const handleClickDay = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target: any = e.target || e.currentTarget;
      onClickDay(getDay(target.getAttribute("data-value")));
    },
    [getDay, onClickDay]
  ); //daysInAMonth, onClickDay
  return (
    <Container onMouseLeave={handleMouseLeave}>
      <StyledCalendar>
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <Weekday key={`Weekday-${weekday}`}>{fakeI18n(weekday)}</Weekday>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysInAMonth.map((week) => (
            <tr key={`Week-${format(week[0], "dd/MM/yyyy")}`}>
              {week.map((day) => (
                <DayCell
                  key={`Day-${format(day, "dd/MM/yyyy")}`}
                  isFirst={!!firstDate && isSameDay(day, firstDate)}
                  isLast={(!!secondDate && isSameDay(day, secondDate)) || (!!dayFocus && isSameDay(day, dayFocus))}
                  inside={
                    !!firstDate &&
                    (!secondDate
                      ? !!dayFocus &&
                        ((isBefore(firstDate, dayFocus) &&
                          isWithinInterval(day, { start: firstDate, end: dayFocus })) ||
                          (isAfter(firstDate, dayFocus) && isWithinInterval(day, { start: dayFocus, end: firstDate })))
                      : isWithinInterval(day, { start: firstDate, end: secondDate }))
                  }
                >
                  <Day
                    disabled={!!(minDate && isBefore(day, minDate)) || !!(maxDate && isAfter(day, maxDate))}
                    active={(!!firstDate && isSameDay(day, firstDate)) || (!!secondDate && isSameDay(day, secondDate))}
                    onClick={handleClickDay}
                    secondary={day.getMonth() !== month || day.getFullYear() !== year}
                    data-value={format(day, "dd-MM-yyyy")}
                    data-type="day"
                    data-focused={isFocused(day) ? "true" : undefined}
                    data-today={format(day, "dd-MM-yyyy") === today ? "true" : undefined}
                    onMouseEnter={isDateRange ? handleMouseEnter : undefined}
                  >
                    {format(day, "dd")}
                  </Day>
                </DayCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledCalendar>
    </Container>
  );
});
export default Calendar;

const Container = styled.div`
  min-height: 262px;
  min-width: 312px;
`;
const StyledCalendar = styled.table`
  width: 100%;
  border-spacing: ${({ theme }) => `0 ${theme.spacing(2)}`};
`;
const Weekday = styled.th`
  font-size: ${(p) => p.theme.typography.fontSize200};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  text-align: center;
  height: 28px;
  padding: 0;
`;

const DayCell = styled.td<{
  inside?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>`
  position: relative;
  text-align: center;
  padding: 0;

  ${({ inside, isLast, isFirst, theme }) => css`
    ${inside &&
    css`
      background: ${theme.colors.actionSecondaryHovered};
    `}
    ${isLast &&
    inside &&
    css`
      background: linear-gradient(90deg, ${theme.colors.actionSecondaryHovered} 50%, transparent 50%);
    `}
    ${isFirst &&
    inside &&
    css`
      background: linear-gradient(90deg, transparent 50%, ${theme.colors.actionSecondaryHovered} 50%);
    `}
  `}
`;

const Day = styled.button<{
  active?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}>`
  font-size: ${(p) => p.theme.typography.fontSize100};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: transparent;
  padding: ${(p) => p.theme.spacing(0.5)} ${(p) => p.theme.spacing(1)};

  &:focus-visible {
    outline: none;
  }

  &:hover {
    color: ${(p) => p.theme.colors.surface};
    background-color: ${(p) => p.theme.colors.textPrimaryHovered};
  }

  &[data-focused="true"] {
    background: ${(p) => p.theme.colors.actionSecondaryHovered};
  }

  &[data-today="true"] {
    border: 1px solid ${(p) => p.theme.colors.borderSubdued};
  }

  ${(p) => {
    if (p.active) {
      return css`
        color: ${p.theme.colors.surface};
        background-color: ${p.theme.colors.actionPrimary};
      `;
    }
    if (p.disabled) {
      return css`
        pointer-events: none;
        color: ${p.theme.colors.textDisabled};
        background: ${p.theme.colors.surfacePressed};
      `;
    }
    return p.secondary
      ? css`
          color: ${p.theme.colors.icon};
        `
      : null;
  }}
`;
