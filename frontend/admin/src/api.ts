import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { CountryResponse, ProvinceResponse } from "./types/address";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["country"],
  endpoints: (builder) => ({
    getCountries: builder.query<CountryResponse[], void>({
      query: () => ({
        url: "/admin/location/countries",
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: CountryResponse[]) => response,
    }),
    getProvinces: builder.query<ProvinceResponse[], void>({
      query: () => ({
        url: `/admin/location/provinces`,
        method: "GET",
      }),
      providesTags: ["country"],
      transformResponse: (response: ProvinceResponse[]) => response,
    }),
  }),
});

export const {
    useGetCountriesQuery,
    useGetProvincesQuery,
} = adminApi;
