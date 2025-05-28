import { store } from "./main";

export type StoreInfoState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ApiFieldError {
  code: string;
  message: string;
  fields: string[];
}

export type ClientBodyError = {
  errors: ApiFieldError[];
  message?: string;
};

export type ClientError = {
  status: number;
  data: ClientBodyError;
};

export function isClientError(e: any): e is ClientError {
  if (typeof e !== "object" || e === null) return false;
  if (!("data" in e) || typeof e.data !== "object" || e.data === null)
    return false;

  const data = e.data;

  return (
    Array.isArray(data.errors) &&
    data.errors.every(
      (err: unknown): err is ApiFieldError =>
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string" &&
        "fields" in err &&
        Array.isArray(err.fields)
    )
  );
}
