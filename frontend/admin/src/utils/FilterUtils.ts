import { isNil } from "lodash-es";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FilterUtils {
  static buildQueryString = (obj: { [key: string]: any }): string => {
    const queryObject = Object.entries(obj).reduce(
      (a, [k, v]) => (isNil(v) || (typeof v === "string" && v.trim().length === 0) ? a : { ...a, [k]: v }),
      {}
    );
    return new URLSearchParams(queryObject).toString();
  };
}
