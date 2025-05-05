import {
  eachDayOfInterval,
  format,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfWeek,
} from "date-fns";

import { Range } from "./types";

export const getWeeksForMonth = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(startDate);
  const endDate = new Date(year, month, daysInMonth);
  const weeks: Date[] = [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  days.forEach((it) => {
    if (!weeks.some((e) => format(e, "wo yyy", { weekStartsOn: 1 }) === format(it, "wo yyy", { weekStartsOn: 1 }))) {
      weeks.push(it);
    }
  });
  const calendar: Date[][] = [];
  weeks.forEach((m) => {
    const firstWeekDay = startOfWeek(m, { weekStartsOn: 1 });
    const lastWeekDay = new Date(firstWeekDay.getFullYear(), firstWeekDay.getMonth(), firstWeekDay.getDate() + 6);
    const weekRange = eachDayOfInterval({ start: firstWeekDay, end: lastWeekDay });
    calendar.push(weekRange);
  });
  return calendar;
};

export function getNewRange(range: Range | undefined, selected: Date): Range {
  if (!range) {
    return { start: selected, end: selected };
  }

  const { start, end } = range;

  if (end && (isAfter(start, end) || isBefore(start, end))) {
    return { start: selected, end: selected };
  }

  if (start) {
    if (isBefore(selected, start)) {
      return { start: selected, end: selected };
    }
    return { start, end: selected };
  }

  if (end) {
    if (isBefore(selected, end)) {
      return { start: selected, end };
    }
    return { start: start || end, end: selected };
  }

  return { start: selected, end: selected };
}

export function isDayBetween(day: Date, start: Date, end: Date) {
  return isBefore(start, end)
    ? isWithinInterval(day, {
        start,
        end,
      })
    : isWithinInterval(day, {
        start: end,
        end: start,
      });
}

export function getYearSelection() {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 200; i++) {
    const year = currentYear - 23 - 100 + i;
    years.push(year);
  }
  return years;
}

export const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const monthName = (month: number): string => {
  return monthNames[month];
};

export function deriveRange(selected?: Date | Range) {
  return selected instanceof Date ? { start: selected, end: selected } : selected;
}

export function dateIsSelected(day: Date | null, range: Range) {
  if (!day) {
    return false;
  }
  const { start, end } = range;

  return Boolean((start && isSameDay(start, day)) || (end && isSameDay(end, day)));
}

export function isHasMonthYear(day: Date, month: number, year: number) {
  return day.getMonth() === month && day.getFullYear() === year;
}
