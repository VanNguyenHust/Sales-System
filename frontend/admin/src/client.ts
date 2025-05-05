import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { isEmpty } from "lodash-es";

import { getCsrf } from "./utils/csrf";
import { sleep } from "./utils/sleep";
import { ApiFieldError } from "./types";
import { CLIENT_DELAY } from "./constants";

const acceptResponseStatuses = [200, 201, 202, 404, 400, 403, 422, 500];

const axiosClient = axios.create({
  validateStatus: (status) => acceptResponseStatuses.includes(status),
  baseURL: "/",
});

interface State {
  errorList: ApiFieldError[];
  errorMap: { [key: string]: string[] };
  errorMessage: string | null;
}

export class ErrorBody {
  _state: State;

  constructor(options: Partial<State>) {
    this._state = {
      errorList: options.errorList || [],
      errorMap: options.errorMap || {},
      errorMessage: options.errorMessage ? options.errorMessage : null,
    };
  }

  getErrorList = () => this._state.errorList;
  getErrorMap = () => this._state.errorMap;
  getErrorMessage = () => this._state.errorMessage;
}

export type ClientBodyError =
  | { format: "string"; message: string }
  | { format: "map"; errors: { [key: string]: string[] }; message: string }
  | { format: "list"; errors: ApiFieldError[]; message: string };

export type ClientError = {
  status: number;
  data: ClientBodyError;
};

export function isClientError(e: any): e is ClientError {
  return typeof e === "object" && "data" in e && typeof e["data"] === "object" && "format" in e["data"];
}

export function parseErrorBody(status: number, data: any): ClientError {
  let bodyError: ClientBodyError | undefined = undefined;
  if (data) {
    if (data.error_description) {
      bodyError = {
        format: "string",
        message: `${data.error || ""} ${data.error_description}`,
      };
    } else if (data.error) {
      bodyError = {
        format: "string",
        message: data.error,
      };
    } else if (data.errors) {
      if (Array.isArray(data.errors)) {
        let message = "";
        if (data.errors.length > 0) {
          const error = data.errors[0];
          message = error.message;
          if (error.fields) {
            message = `${error.fields.join(".")}: ${error.message}`;
          }
        }
        data.errors = data.errors || [];
        bodyError = {
          format: "list",
          errors: data.errors.map((err: any) => ({
            ...err,
            fields: err.fields || [],
          })),
          message,
        };
      } else {
        const firstKey = Object.keys(data.errors)[0];
        const firstMessage = data.errors[firstKey][0];
        bodyError = {
          format: "map",
          errors: data.errors,
          message: isEmpty(firstKey) ? `${firstMessage}` : `${firstKey}: ${firstMessage}`,
        };
      }
    }
  }
  return { status, data: bodyError || { message: `${status} status response error`, format: "string" } };
}

interface Client {
  request<T = any, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<T & { errors?: ErrorBody } & { status: number; headers: { [key: string]: string } }>;
}

const client: Client = {
  request: async (config) => {
    if (CLIENT_DELAY) {
      await sleep(CLIENT_DELAY);
    }
    setDefaultHeaders(config);
    const { data, status, headers } = await axiosClient.request(config);
    const res: any = {
      status,
      headers,
    };
    let errors: ErrorBody | undefined = undefined;
    if (data && (data.error || data.errors)) {
      const { data: dataErrors } = parseErrorBody(status, data);
      if (dataErrors.format === "string") {
        errors = new ErrorBody({ errorMessage: dataErrors.message });
      } else if (dataErrors.format === "map") {
        errors = new ErrorBody({ errorMap: dataErrors.errors });
      } else {
        errors = new ErrorBody({ errorList: dataErrors.errors });
      }
      delete data["error"];
      delete data["errors"];
    }
    Object.assign(res, { errors }, data);
    return res;
  },
};

export function setup(options: (client: AxiosInstance) => void) {
  options.call(options, axiosClient);
}

export function setDefaultHeaders(config: AxiosRequestConfig) {
  const isGetMethod = !config.method || config.method.toLowerCase() === "get";
  config.headers = {
    ...config.headers,
    "X-Bizweb-Accept-Language": "vi",
  };
  if (!isGetMethod) {
    const defaultHeaders = {
      "X-Csrf-Token": getCsrf(),
    };
    config.headers = config.headers
      ? {
          ...defaultHeaders,
          ...config.headers,
        }
      : defaultHeaders;
  }
}

export default client;
