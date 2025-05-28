import {
  CreateLocationRequest,
  FilterLocationRequest,
  LocationResponse,
  LocationsResponse,
  StoreResponse,
  UpdateStoreRequest,
  UpdateUserRequest,
  UserResponse,
  UsersResponse,
} from "@/types/store";
import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { toQueryString } from "@/utils/url";
import { createApi } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["store", "user", "location"],
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
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: "/admin/user",
        method: "GET",
      }),
      providesTags: ["user"],
      transformResponse: (response: UsersResponse) => response,
    }),
    getUserById: builder.query<UserResponse, { userId: number }>({
      query: ({ userId }) => ({
        url: `/admin/user/${userId}`,
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
    createUserAccount: builder.mutation<void, UpdateUserRequest>({
      query: (body) => ({
        url: "/admin/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (body) => ({
        url: "/admin/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    adminUpdateUser: builder.mutation<
      void,
      { userId: number; body: UpdateUserRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/admin/user/${userId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    enableUser: builder.mutation<void, { userIds: number[] }>({
      query: (params) => ({
        url: `/admin/user/enable${toQueryString(params)}`,
        method: "PUT",
      }),
      invalidatesTags: ["user"],
    }),
    disableUser: builder.mutation<void, { userIds: number[] }>({
      query: (params) => ({
        url: `/admin/user/disable${toQueryString(params)}`,
        method: "PUT",
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation<void, { userIds: number[] }>({
      query: (params) => ({
        url: `/admin/user/delete${toQueryString(params)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getLocations: builder.query<LocationsResponse, FilterLocationRequest>({
      query: (params) => ({
        url: `/admin/location?${toQueryString(params)}`,
        method: "GET",
      }),
      providesTags: ["location"],
      transformResponse: (response: LocationsResponse) => response,
    }),
    getLocationById: builder.query<LocationResponse, { locationId: number }>({
      query: ({ locationId }) => ({
        url: `/admin/location/${locationId}`,
        method: "GET",
      }),
      providesTags: ["location"],
      transformResponse: (response: LocationResponse) => response,
    }),
    createLocation: builder.mutation<LocationResponse, CreateLocationRequest>({
      query: (body) => ({
        url: "/admin/location",
        method: "POST",
        body,
      }),
      invalidatesTags: ["location"],
    }),
  }),
});

export const {
  useGetStoreByIdQuery,
  useUpdateStoreMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetCurrentUserQuery,
  useCreateUserAccountMutation,
  useUpdateUserMutation,
  useAdminUpdateUserMutation,
  useEnableUserMutation,
  useDisableUserMutation,
  useDeleteUserMutation,
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
} = storeApi;
