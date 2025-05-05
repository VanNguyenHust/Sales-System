import {
  add,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format as formatDate,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { capitalize } from "lodash-es";

import { DateRangeValue, RelativeDateValue } from "app/types";

import { assertUnreachable } from "../assert";

import { DATE_FORMAT, relativeDateOptions } from "./constant";

export function getRelativeDateLabel(value: RelativeDateValue) {
  return relativeDateOptions.find((v) => v.value === value)!.label;
}

export function parseRelativeDate(value: string): RelativeDateValue | undefined {
  return relativeDateOptions.find((v) => v.value === value)?.value;
}

export function formatDateRange(value: DateRangeValue, format = DATE_FORMAT) {
  if (value.relative) {
    const relativeLabel = getRelativeDateLabel(value.relative);
    const { start, end } = getRelativeRange(value.relative);
    if (isSameDay(start, end)) {
      return `${relativeLabel} (${formatDate(start, format)})`;
    }
    return `${relativeLabel} (${formatDate(start, format)} - ${formatDate(end, format)})`;
  }
  const { start, end } = value;
  return capitalize(
    [start ? `từ ${formatDate(start, format)}` : undefined, end ? `đến ${formatDate(end, format)}` : undefined]
      .filter(Boolean)
      .join(" ")
  );
}

export function formatDateRangeShort(
  value: DateRangeValue,
  options?: { hideRelative?: boolean; format?: string; hideRelativeDate?: boolean }
) {
  const { format = DATE_FORMAT, hideRelative = false, hideRelativeDate = false } = options || {};

  if (value.relative) {
    const relativeLabel = getRelativeDateLabel(value.relative);

    if (hideRelativeDate) {
      return relativeLabel;
    }

    const { start, end } = getRelativeRange(value.relative);
    if (hideRelative) {
      if (isSameDay(start, end)) {
        return `${formatDate(start, format)}`;
      }
      return `${formatDate(start, format)} - ${formatDate(end, format)}`;
    } else {
      if (isSameDay(start, end)) {
        return `${relativeLabel} (${formatDate(start, format)})`;
      }
      return `${relativeLabel} (${formatDate(start, format)} - ${formatDate(end, format)})`;
    }
  }
  const { start, end } = value;
  if (start && !end) {
    return `Từ ngày ${formatDate(start, format)}`;
  }
  if (!start && end) {
    return `Trước ngày ${formatDate(end, format)}`;
  }
  return capitalize(
    [start ? formatDate(start, format) : undefined, end ? formatDate(end, format) : undefined]
      .filter(Boolean)
      .join(" - ")
  );
}

export function getRelativeRange(relative: RelativeDateValue): { start: Date; end: Date } {
  const now = new Date();
  switch (relative) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "yesterday":
      return {
        start: startOfDay(
          add(now, {
            days: -1,
          })
        ),
        end: endOfDay(
          add(now, {
            days: -1,
          })
        ),
      };
    case "day_last_7":
      return {
        start: startOfDay(
          add(now, {
            days: -6,
          })
        ),
        end: endOfDay(now),
      };
    case "day_last_30":
      return {
        start: startOfDay(
          add(now, {
            days: -29,
          })
        ),
        end: endOfDay(now),
      };
    case "this_week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "last_week":
      return {
        start: startOfWeek(
          add(now, {
            weeks: -1,
          }),
          { weekStartsOn: 1 }
        ),
        end: endOfWeek(
          add(now, {
            weeks: -1,
          }),
          { weekStartsOn: 1 }
        ),
      };
    case "this_month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "last_month":
      return {
        start: startOfMonth(
          add(now, {
            months: -1,
          })
        ),
        end: endOfMonth(
          add(now, {
            months: -1,
          })
        ),
      };
    case "this_year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };
    case "last_year":
      return {
        start: startOfYear(
          add(now, {
            years: -1,
          })
        ),
        end: endOfYear(
          add(now, {
            years: -1,
          })
        ),
      };
  }
  assertUnreachable(relative);
}
