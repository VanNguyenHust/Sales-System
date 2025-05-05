import { isEmail } from "commons-validator-es";

export function lengthMoreThan(length: number) {
  return (input: { length: number }) => input.length > length;
}

export function lengthMoreThanOrEqual(length: number) {
  return (input: { length: number }) => input.length >= length;
}
export function lengthLessThan(length: number) {
  return (input: { length: number }) => input.length < length;
}

export function lengthLessThanOrEqual(length: number) {
  return (input: { length: number }) => input.length <= length;
}

export function isPositiveIntegerString(input: string) {
  return input !== "" && (input.match(/[^0-9]/g) || []).length === 0;
}

export function isPositiveNumericString(input: string) {
  return input !== "" && (input.match(/[^0-9.,]/g) || []).length === 0;
}

export function isNumericString(input: string) {
  return input !== "" && (input.match(/[^0-9.,-]/g) || []).length === 0;
}

export function isEmpty(input: any) {
  return input === null || input === undefined || input.length === 0;
}

export function isEmptyString(input: string | null | undefined) {
  return input === null || input === undefined || input.trim().length < 1;
}

export function notEmpty(input: any) {
  return not(isEmpty)(input);
}

export function notEmptyString(input: string) {
  return not(isEmptyString)(input);
}

export function notNumericString(input: string) {
  return not(isNumericString)(input);
}

export function validPhone(input: string) {
  return /^(\+?[\d]{7,15})$/.test(input);
}

export function validEmail(input: string) {
  return (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      input
    ) && input.length < 255
  );
}

export function isStartsWith(startWith: string) {
  return (input: string) => input.startsWith(startWith);
}

export function isStartsWithIgnoreCase(startWith: string) {
  return (input: string) => input.toUpperCase().startsWith(startWith.toUpperCase());
}
export function isNotStartsWith(startWith: string) {
  return not(isStartsWith(startWith));
}

export function isNotStartsWithIgnoreCase(startWith: string) {
  return not(isStartsWithIgnoreCase(startWith));
}
function not<A extends any[], R>(fn: (...xs: A) => R) {
  return (...args: A) => !fn(...args);
}

/**Check common email bằng lib của apache */
export function isCommonEmail(input: string) {
  return isEmail(input);
}
