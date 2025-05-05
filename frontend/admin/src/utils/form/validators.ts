import * as predicates from "./predicates";

export function lengthMoreThan(length: number, error: string) {
  return validator<any>(predicates.lengthMoreThan(length))(error);
}

export function lengthMoreThanOrEqual(length: number, error: string) {
  return validator<any>(predicates.lengthMoreThanOrEqual(length))(error);
}

export function lengthLessThan(length: number, error: string) {
  return validator<any>(predicates.lengthLessThan(length))(error);
}

export function lengthLessThanOrEqual(length: number, error: string) {
  return validator<any>(predicates.lengthLessThanOrEqual(length))(error);
}

export function notEmpty(error: string) {
  return validator(predicates.notEmpty, { skipOnEmpty: false })(error);
}

export function notEmptyString(error: string) {
  return validator(predicates.notEmptyString, { skipOnEmpty: false })(error);
}

export function positiveIntegerString(error: string) {
  return validator(predicates.isPositiveIntegerString)(error);
}

export function positiveNumericString(error: string) {
  return validator(predicates.isPositiveNumericString)(error);
}

export function numericString(error: string) {
  return validator(predicates.isNumericString)(error);
}

export function greaterThan(value: number, error: string) {
  return validator<number | undefined | null>((input) => Number(input) > value)(error);
}

export function greaterThanOrEqual(value: number, error: string) {
  return validator<number | undefined | null>((input) => Number(input) >= value)(error);
}

export function lessThan(value: number, error: string) {
  return validator<number | undefined | null>((input) => Number(input) < value)(error);
}

export function lessThanOrEqual(value: number, error: string) {
  return validator<number | undefined | null>((input) => Number(input) <= value)(error);
}

export function validPhone(error: string) {
  return validator<any>(predicates.validPhone)(error);
}

export function validEmail(error: string) {
  return validator<any>(predicates.validEmail)(error);
}
export function notStartsWithIgnoreCase(startsWith: string, error: string) {
  return validator<string>(predicates.isNotStartsWithIgnoreCase(startsWith), { skipOnEmpty: true })(error);
}

export function validCommonEmail(error: string) {
  return validator<any>(predicates.isCommonEmail)(error);
}

interface Matcher<Input> {
  (input: Input): boolean;
}

interface Options {
  skipOnEmpty?: boolean;
}

export function validator<Input = string>(matcher: Matcher<Input>, { skipOnEmpty = true }: Options = {}) {
  return (errorContent: string) => {
    return (input: Input) => {
      if (skipOnEmpty && predicates.isEmpty(input)) {
        return;
      }

      const matches = matcher(input);

      if (matches) {
        return;
      }

      return errorContent;
    };
  };
}
