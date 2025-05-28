import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CountryResponse,
  DistrictResponse,
  FilterCountryRequest,
  FilterDistrictRequest,
  FilterProvinceRequest,
  FilterWardRequest,
  ProvinceResponse,
  WardResponse,
} from "./types/address";
import { toQueryString } from "./utils/url";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["country"],
  endpoints: (builder) => ({
    getCountries: builder.query<CountryResponse[], FilterCountryRequest>({
      query: (params) => ({
        url: `/admin/location/countries${toQueryString(params)}`,
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: CountryResponse[]) => response,
    }),
    getProvinces: builder.query<ProvinceResponse[], FilterProvinceRequest>({
      query: (params) => ({
        url: `/admin/location/provinces${toQueryString(params)}`,
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: ProvinceResponse[]) => response,
    }),
    getDistricts: builder.query<DistrictResponse[], FilterDistrictRequest>({
      query: (params) => ({
        url: `/admin/location/districts${toQueryString(params)}`,
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: DistrictResponse[]) => response,
    }),
    getWards: builder.query<WardResponse[], FilterWardRequest>({
      query: (params) => ({
        url: `/admin/location/wards${toQueryString(params)}`,
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: WardResponse[]) => response,
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} = adminApi;
