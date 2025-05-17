import { StoreResponse, UpdateStoreRequest, UpdateUserRequest, UserResponse } from "@/types/store";
import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["store", "user"],
  endpoints: (builder) => ({
    getStoreById: builder.query<StoreResponse, void>({
      query: () => ({
        url: "/admin/store",
        method: "GET",
      }),
      providesTags: ["store"],
      transformResponse: (response: StoreResponse) => response,
    }),
    updateStore: builder.mutation<void, UpdateStoreRequest>({
      query: (body) => ({
        url: "/admin/store",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["store"],
    }),
    getUserById: builder.query<UserResponse, void>({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
      transformResponse: (response: UserResponse) => response,
    }),
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => ({
        url: "/admin/user/current",
        method: "GET",
      }),
      providesTags: ["user"],
      transformResponse: (response: UserResponse) => response,
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (body) => ({
        url: "/admin/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetStoreByIdQuery,
  useUpdateStoreMutation,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} = storeApi;
