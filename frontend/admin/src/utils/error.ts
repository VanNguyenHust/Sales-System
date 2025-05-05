import { forEach, isEmpty } from "lodash-es";

import { ClientError, isClientError } from "app/client";
import { namePermissions, Permissions } from "app/constants";

import { showErrorToast } from "./toast";

export const Error = (e: { [key: string]: string[] }) => {
  const keys = Object.keys(e);
  if (keys.length) {
    if (e[keys[0]] && e[keys[0]].length) {
      showErrorToast(`${keys[0]}: ${e[keys[0]][0]}`);
      return;
    }
  }
  showErrorToast("Có lỗi xảy ra");
};

export const handleErrorApi = (e: any, defaultMsg?: string) => {
  if (isClientError(e)) {
    const REGEX_ACCESS_DENIED_PERMISSION = /^access_denied UserId \d+ does not have permission \w+$/;
    const REGEX_ACCESS_DENIED = /^access_denied/;
    if (REGEX_ACCESS_DENIED_PERMISSION.test(e.data.message)) {
      const permission = Object.values(Permissions).find((item) => e.data.message.includes(` ${item}`));
      if (permission) {
        showErrorToast(`Bạn cần quyền ${namePermissions(permission).toLocaleLowerCase()} để thực hiện tính năng này.`);
      }
      return;
    } else if (REGEX_ACCESS_DENIED.test(e.data.message)) {
      showErrorToast("Bạn không có quyền thực hiện tính năng này");
      return;
    }
    showErrorToast(e.data.message);
  } else {
    showErrorToast(defaultMsg ?? "Có lỗi xảy ra");
  }
};

export const handleErrorApiV2 = (
  e: any,
  options?: { defaultMsg?: string; translates?: { message: string; code: number }[] }
) => {
  const { defaultMsg = "Có lỗi xảy ra", translates = [] } = options ?? {};
  if (translates.length && "status" in e) {
    for (const { message, code } of translates) {
      if (e.status === code) {
        showErrorToast(message);
        return;
      }
    }
  }
  if (isClientError(e)) {
    showErrorToast(e.data.message);
  } else {
    showErrorToast(defaultMsg);
  }
};

type TransformValue<T> = T | ((message: string) => T);
type TransformListValue<T> =
  | T
  | ((
      message: string,
      fieldInfo: {
        key: string;
        code: string;
        fieldPath: string;
      }
    ) => T);

export type TransformField<T> = [key: string | RegExp, regex: RegExp, value: TransformValue<T>];

/** @deprecated using transformClientErrors instead */
export function transformClientErrorMap<T>(e: unknown, transformList: TransformField<T>[]): T | undefined {
  if (isClientError(e) && e.data.format === "map") {
    const errors = e.data.errors;
    for (const transform of transformList) {
      const [key, regex, value] = transform;
      let matchKey: string;
      if (typeof key !== "string") {
        const theKey = Object.keys(errors).find((k) => key.test(k));
        if (theKey === undefined) {
          return undefined;
        }
        matchKey = theKey;
      } else {
        matchKey = key;
      }
      if (errors[matchKey] && errors[matchKey].length) {
        for (const message of errors[matchKey]) {
          if (regex.test(message)) {
            if (isTransformFuncValue(value)) {
              return value(message);
            }
            return value;
          }
        }
      }
    }
  }
  return undefined;
}

/** @deprecated using transformClientErrors instead */
export function transformClientErrorList<T>(e: unknown, transformList: TransformField<T>[]): T | undefined {
  if (isClientError(e) && e.data.format === "list") {
    const errors = e.data.errors;
    for (const transform of transformList) {
      const [key, regex, value] = transform;
      let matchKey: string;
      if (typeof key !== "string") {
        const theKey = Object.keys(errors).find((k) => key.test(k));
        if (theKey === undefined) {
          return undefined;
        }
        matchKey = theKey;
      } else {
        matchKey = key;
      }
      for (const error of errors) {
        if (error.fields.includes(matchKey)) {
          if (regex.test(error.message)) {
            if (isTransformFuncValue(value)) {
              return value(error.message);
            }
            return value;
          }
        }
      }
    }
  }
  return undefined;
}

type Action<T> = ((e: ClientError) => T) | ((e: ClientError) => void);

export type TransformEntry<T> =
  | {
      /**
       * Lỗi dạng map
       * @example
       * {
       *   "errors": [
       *     { "fields": ["email"], "code": "blank", "message": "is not blank" },
       *     { "fields": ["address", "phone"], "code": "taken", "message": "is taken" },
       *   ]
       * }
       * */
      type: "list";
      /**
       * Pattern để match sự kết hợp field và code. Có thể dùng string để match chính xác hoặc dùng regexp
       * Kết hợp field và code được merge vào nhau theo thứ tự phân cách bởi dấu `.`. Ví dụ `email.blank`, `address.phone.taken`
       * @example
       * "email.blank", /address.phone.+/
       */
      key: string | RegExp;
      /**
       * Giá trị trả về sau khi matching
       */
      result: TransformListValue<T>;
    }
  | {
      /**
       * Lỗi dạng map
       * @example
       * {
       *   "errors": {
       *     "email": ["invalid format"],
       *     "address.phone": ["Phone must not be empty"]
       *   }
       * }
       * */
      type: "map";
      /**
       * Pattern để match field lỗi. Có thể dùng string để match chính xác hoặc dùng regexp
       * @example
       * "email", /address.+/
       */
      key: string | RegExp;
      /**
       * Regexp để matching message
       * @example
       * /invalid format/i
       */
      message: RegExp;
      /**
       * Giá trị trả về sau khi matching
       */
      result: TransformValue<T>;
    }
  | {
      /**
       * Lỗi dạng string
       * @example
       * {
       *   "errors": "not found"
       * }
       * */
      type: "string";
      /**
       * Pattern matching status
       * @example
       * 404, /404|400/
       */
      status?: number | RegExp;
      /**
       * Pattern matching message
       * @example
       * /not found/i
       */
      message?: RegExp;
      /**
       * Giá trị trả về sau khi matching
       */
      result: TransformValue<T>;
    }
  | {
      /** fallback khi không có lỗi nào được match */
      type: "*";
      /**
       * Giá trị trả về hoặc action fallback
       */
      result: T | Action<T>;
    };

/** Helper transform lỗi từ server */
export function transformClientErrors<T>(e: unknown, transforms: TransformEntry<T>[]): T[] {
  if (!isClientError(e)) {
    throw `Invalid client error: ${e}`;
  }
  const results: T[] = [];
  if (e.data.format === "map") {
    const errors = e.data.errors;
    for (const transform of transforms) {
      if (transform.type === "map") {
        const { key: testKey, result, message: regex } = transform;
        let matchKey: string;
        if (typeof testKey !== "string") {
          const match = Object.keys(errors).find((k) => testKey.test(k));
          if (match === undefined) {
            continue;
          }
          matchKey = match;
        } else {
          matchKey = testKey;
        }
        if (errors[matchKey] && errors[matchKey].length) {
          for (const message of errors[matchKey]) {
            if (regex.test(message)) {
              results.push(handleResult(result, message));
            }
          }
        }
      }
    }
  } else if (e.data.format === "string") {
    const message = e.data.message;
    for (const transform of transforms) {
      if (transform.type === "string") {
        const { result, message: regex, status } = transform;
        let matched = true;
        if (regex) {
          matched = regex.test(message);
        }
        if (status) {
          matched = typeof status === "number" ? status === e.status : status.test(e.status.toString());
        }
        if (matched) {
          results.push(handleResult(result, message));
        }
      }
    }
  } else if (e.data.format === "list") {
    const errors = e.data.errors;
    for (const transform of transforms) {
      if (transform.type === "list") {
        const { key: matchKey, result } = transform;
        for (const error of errors) {
          const fieldPath = error.fields.join(".");
          const key = error.fields.concat(error.code).join(".");
          const matched = typeof matchKey === "string" ? matchKey === key : matchKey.test(key);
          if (matched) {
            if (isTransformFuncListValue(result)) {
              results.push(
                result(error.message, {
                  key,
                  fieldPath,
                  code: error.code,
                })
              );
            } else {
              results.push(result);
            }
          }
        }
      }
    }
  }

  // handle fallback
  let hasFallback = false;
  if (!results.length) {
    let fallbackResult: T | undefined;
    for (const transform of transforms) {
      if (transform.type === "*") {
        hasFallback = true;
        if (isActionResult(transform.result)) {
          const result = transform.result(e);
          if (result) {
            fallbackResult = result;
          }
        } else {
          fallbackResult = transform.result;
        }
      }
    }
    if (fallbackResult !== undefined) {
      results.push(fallbackResult);
    }
  }
  if (results.length || hasFallback) {
    return results;
  }
  throw `No transform match for error`;
}

function isTransformFuncValue<T>(value: any): value is (message: string) => T {
  return typeof value === "function";
}

function isTransformFuncListValue<T>(value: any): value is (
  message: string,
  fieldInfo: {
    key: string;
    code: string;
    fieldPath: string;
  }
) => T {
  return typeof value === "function";
}

function isActionResult<T>(value: any): value is Action<T> {
  return typeof value === "function";
}

function handleResult<T>(result: TransformValue<T>, errorMessage: string): T {
  if (isTransformFuncValue(result)) {
    return result(errorMessage);
  }
  return result;
}

const findMessageError = (values: any) => {
  let objectMessageError = {};
  if (!values || typeof values !== "object") {
    return "";
  }
  if ("message" in values) {
    objectMessageError = values;
  } else if (typeof values === "object" && !isEmpty(values)) {
    forEach(values, (value) => {
      if (isEmpty(objectMessageError)) {
        objectMessageError = findMessageError(value);
      } else {
        return false;
      }
    });
  }
  return objectMessageError;
};

export const showToastErrorForm = (values: any) => {
  const objectMessageError = findMessageError(values);
  if (!isEmpty(objectMessageError) && (objectMessageError as any)?.type !== "ignore") {
    showErrorToast((objectMessageError as any).message);
  }
};
