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
    confirmInvited: builder.mutation<
      string,
      { email: string; storeId: number; confirmCode: string }
    >({
      query: ({ email, storeId, confirmCode }) => ({
        url: `/admin/user/confirm_invited?email=${email}&storeId=${storeId}&confirmCode=${confirmCode}`,
        method: "PUT",
        responseHandler: "text",
      }),
      invalidatesTags: ["store"],
      transformResponse: (response: string) => response,
    }),
    resetPassword: builder.mutation<
      void,
      {
        storeId: number;
        email: string;
        tokenCode: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: ({ storeId, email, tokenCode, newPassword, confirmPassword }) => ({
        url: `/admin/user/reset_password`,
        method: "PUT",
        body: { storeId, email, tokenCode, newPassword, confirmPassword },
      }),
      invalidatesTags: ["store"],
    }),
  }),
});

export const {
  useRegisterStoreMutation,
  useEnableStoreMutation,
  useLoginStoreMutation,
  useConfirmInvitedMutation,
  useResetPasswordMutation,
} = adminApi;
