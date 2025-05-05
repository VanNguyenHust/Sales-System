import { createApi } from "@reduxjs/toolkit/query/react";

import { authFetchBaseQuery } from "./utils/authFetchQuery";
import { EnableStoreRequest, RegisterStoreRequest } from "./types/store";
import { LoginRequest, LoginResponse } from "./types/user";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["store"],
  endpoints: (builder) => ({
    registerStore: builder.mutation<void, RegisterStoreRequest>({
      query: (body) => {
        return {
          url: "/admin/store/register",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["store"],
    }),
    enableStore: builder.mutation<void, EnableStoreRequest>({
      query: (body) => {
        return {
          url: "/admin/store/enable",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["store"],
    }),
    loginStore: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => {
        return {
          url: "/admin/user/login",
          method: "POST",
          body,
        };
      },
      transformResponse: (response: LoginResponse) => response,
    }),
  }),
});

export const {
  useRegisterStoreMutation,
  useEnableStoreMutation,
  useLoginStoreMutation,
} = adminApi;
