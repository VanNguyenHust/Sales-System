import { isValid, parse } from "date-fns";

const refDate = new Date();

export { format as formatDate } from "date-fns";

export function parseDate(value: string, format: string): Date | undefined {
  const parsedDate = parse(value, format, refDate);
  if (isValid(parsedDate)) {
    return parsedDate;
  }
  return undefined;
}
