import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { toQueryString } from "@/utils/url";
import { createApi } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["customer"],
  endpoints: (builder) => ({}),
});

export const {} = customerApi;
