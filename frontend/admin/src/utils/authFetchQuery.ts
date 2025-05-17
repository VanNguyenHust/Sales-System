import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { camelizeKeys } from "humps";

const rawBaseQuery = fetchBaseQuery({ baseUrl: "http://localhost:8088" });

export const authFetchBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = localStorage.getItem("admin_token");

  const tokenHeader = {
    Authorization: `Bearer ${token}`,
    "X-Bizweb-Accept-Language": "vi",
  };
  let adjustedArgs: FetchArgs;
  if (typeof args === "string") {
    adjustedArgs = {
      url: args,
      headers: tokenHeader,
    };
  } else {
    adjustedArgs = args;
    adjustedArgs.headers = {
      ...args.headers,
      ...tokenHeader,
    };
  }

  const result = await rawBaseQuery(adjustedArgs, api, extraOptions);

  if (result.error?.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }

  if (
    result.data &&
    result?.meta?.response?.headers
      .get("content-type")
      ?.startsWith("application/json")
  ) {
    result.data = camelizeKeys(result?.data);
  }

  return result;
};
