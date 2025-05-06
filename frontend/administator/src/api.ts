import { createApi } from "@reduxjs/toolkit/query/react";

import { authFetchBaseQuery } from "./utils/authFetchQuery";
import {
  FilterStoresRequest,
  StoreResponse,
  StoresResponse,
} from "./types/stores";
import { StoreFeaturesResponse } from "./types/store_features";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["store", "store_feature"],
  endpoints: (builder) => ({
    getStores: builder.query<StoresResponse, FilterStoresRequest>({
      query: (params) => ({
        url: "/administrator/store",
        method: "GET",
        params,
      }),
      providesTags: ["store"],
      transformResponse: (response: StoresResponse) => ({
        stores: response.stores,
        count: response.count,
      }),
    }),
    getStoreById: builder.query<StoreResponse, { storeId: number }>({
      query: ({ storeId }) => ({
        url: `/administrator/store/${storeId}`,
        method: "GET",
      }),
      providesTags: ["store"],
    }),
    getStoreFeatures: builder.query<StoreFeaturesResponse, { storeId: number }>(
      {
        query: ({ storeId }) => ({
          url: `/administrator/store/${storeId}/features`,
          method: "GET",
        }),
        providesTags: ["store_feature"],
      }
    ),
    enableStoreFeature: builder.mutation<
      void,
      { storeId: number; featureKey: string }
    >({
      query: ({ storeId, featureKey }) => ({
        url: `/administrator/store_feature/${storeId}/enable/${featureKey}`,
        method: "PUT",
      }),
      invalidatesTags: ["store_feature"],
    }),
    disableStoreFeature: builder.mutation<
      void,
      { storeId: number; featureKey: string }
    >({
      query: ({ storeId, featureKey }) => ({
        url: `/administrator/store_feature/${storeId}/disable/${featureKey}`,
        method: "PUT",
      }),
      invalidatesTags: ["store_feature"],
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useGetStoreFeaturesQuery,
  useEnableStoreFeatureMutation,
  useDisableStoreFeatureMutation,
} = adminApi;
