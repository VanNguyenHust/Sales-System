import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  isAfter,
  isBefore,
  isValid,
  setDate as setDayOfMonth,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear,
} from "date-fns";

export function isValidDatetime(value: string) {
  return isValid(new Date(value));
}

type SetDateOptions = {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
};

export function setDatetime(value: string, options: SetDateOptions) {
  let date = new Date(value);
  if (options.year !== undefined) {
    date = setYear(date, options.year);
  }
  if (options.month !== undefined) {
    date = setMonth(date, options.month);
  }
  if (options.day !== undefined) {
    date = setDayOfMonth(date, options.day);
  }
  if (options.hour !== undefined) {
    date = setHours(date, options.hour);
  }
  if (options.minute !== undefined) {
    date = setMinutes(date, options.minute);
  }
  if (options.second !== undefined) {
    date = setSeconds(date, options.second);
  }
  return date.toISOString();
}

type AddDateOptions = {
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
};

export function addDatetime(value: string, options: AddDateOptions) {
  let date = new Date(value);
  if (options.day !== undefined) {
    date = addDays(date, options.day);
  }
  if (options.hour !== undefined) {
    date = addHours(date, options.hour);
  }
  if (options.minute !== undefined) {
    date = addMinutes(date, options.minute);
  }
  if (options.second !== undefined) {
    date = addSeconds(date, options.second);
  }
  return date.toISOString();
}

export function getDatetime(addOptions?: AddDateOptions) {
  const result = new Date().toISOString();
  if (addOptions) {
    return addDatetime(result, addOptions);
  }
  return result;
}

export function isBeforeDatetime(value: string, other: string) {
  return isBefore(new Date(value), new Date(other));
}

export function isAfterDatetime(value: string, other: string) {
  return isAfter(new Date(value), new Date(other));
}
