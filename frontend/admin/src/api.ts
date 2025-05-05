import {
  type BaseQueryFn,
  createApi,
  FetchArgs,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosRequestConfig,
} from "axios";

import {
  ChargeFilterRequest,
  CountResponse,
  CountriesResponse,
  Country,
  Currency,
  CurrencyFormatTemplate,
  CurrencyResponse,
  District,
  DistrictResponse,
  DistrictsResponse,
  Location,
  LocationFilter,
  LocationPriority,
  Province,
  ProvinceResponse,
  ProvinciesResponse,
  StoreSettingResponse,
  StoreSettings,
  Tenant,
  TenantResponse,
  TenantUpdateRequest,
  TimeZone,
  Ward,
  WardsResponse,
} from "src/types";

import { toQueryString } from "./utils/url";
import { ClientError, parseErrorBody, setDefaultHeaders } from "./client";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<string | FetchArgs, unknown, unknown> =>
  async (urlOrFetchArgs) => {
    try {
      const config: AxiosRequestConfig = {};
      if (isFetchArgs(urlOrFetchArgs)) {
        config.url = urlOrFetchArgs.url;
        config.method = urlOrFetchArgs.method;
        config.data = urlOrFetchArgs.body;
        config.params = urlOrFetchArgs.params;
        config.headers = urlOrFetchArgs.headers as AxiosHeaders;
      } else {
        config.url = baseUrl + urlOrFetchArgs;
      }
      setDefaultHeaders(config);
      const result = await axios(config);
      return { data: result.data, meta: { headers: result.headers } };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (err.response?.status === 401) {
        window.location.href = `/admin/authorization/logout?returnUrl=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`;
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

function isFetchArgs(arg: string | FetchArgs): arg is FetchArgs {
  return typeof arg === "object";
}

type AxiosResponseError = { status: number; data: any };

export function isAxiosErrorResponse(e: unknown): e is AxiosResponseError {
  return !!e && typeof e === "object" && "status" in e && "data" in e;
}

export function transformAxiosErrorResponse({
  status,
  data,
}: AxiosResponseError): ClientError {
  return parseErrorBody(status, data);
}

export function parseResponse<T>(
  result: QueryReturnValue<unknown, unknown, unknown>
): {
  error?: ClientError;
  data: T;
} {
  if (isAxiosErrorResponse(result.error)) {
    return {
      error: transformAxiosErrorResponse(result.error),
      data: null as T,
    };
  }
  return { data: result.data as T };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "customer",
    "product",
    "location",
    "user",
    "orderReturn",
    "order",
    "store-setting",
    "tenant",
    "metafield",
    "metafieldDefinition",
  ],
  endpoints: (builder) => ({
    getTenant: builder.query<Tenant, void>({
      query: () => `/admin/store.json`,
      transformResponse: (response: TenantResponse) => response.store,
      providesTags: ["tenant"],
    }),
    updateTenant: builder.mutation<Tenant, TenantUpdateRequest>({
      query: (request) => ({
        url: `/admin/store.json`,
        method: "PUT",
        body: {
          store: request,
        },
      }),
      transformResponse: (response: TenantResponse) => response.store,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (result) => (result ? ["tenant", "store-setting"] : []),
    }),
    getLocations: builder.query<Location[], LocationFilter | undefined>({
      query: (q) => `/admin/locations.json${toQueryString(q)}`,
      transformResponse: (response: { locations: Location[] }) =>
        response.locations,
      providesTags: ["location"],
    }),
    countLocations: builder.query<number, LocationFilter | undefined>({
      query: (q) => `/admin/locations/count.json${toQueryString(q)}`,
      transformResponse: (response: { count: number }) => response.count,
      providesTags: ["location"],
    }),
    createLocation: builder.mutation<Location, Partial<Location>>({
      query: (req) => {
        return {
          url: `/admin/locations.json`,
          method: "POST",
          body: {
            location: req,
          },
        };
      },
      transformResponse: (response: { location: Location }) =>
        response.location,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, _error) => (!_error ? ["location"] : []),
    }),
    updateLocation: builder.mutation<
      Location,
      { id: number; location: Partial<Location> }
    >({
      query: (req) => {
        return {
          url: `/admin/locations/${req.id}.json`,
          method: "PUT",
          body: {
            location: req.location,
          },
        };
      },
      transformResponse: (response: { location: Location }) =>
        response.location,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, _error, req) =>
        !_error ? ["location", { type: "location", id: req.id }] : [],
    }),
    deleteLocation: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `/admin/locations/${id}.json`,
          method: "DELETE",
        };
      },
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, _error, id) =>
        !_error ? [{ type: "location", id }, "location"] : [],
    }),
    getLocationPriority: builder.query<LocationPriority[], void>({
      query: () => `/admin/locations/priority.json`,
      transformResponse: (response: {
        location_priorities: LocationPriority[];
      }) => response.location_priorities,
      providesTags: ["location"],
    }),
    getCountries: builder.query<Country[], void>({
      query: () => `/admin/locations/countries.json`,
      transformResponse: (response: CountriesResponse) => response.countries,
    }),
    getProvinces: builder.query<Province[], void>({
      query: () => `/admin/locations/provinces.json`,
      transformResponse: (response: ProvinciesResponse) => response.provinces,
    }),
    getProvinceFindByCode: builder.query<Province, string>({
      query: (code) =>
        `/admin/locations/provinces/find_by_code.json?code=${code}`,
      transformResponse: (response: ProvinceResponse) => response.province,
    }),
    getDistricts: builder.query<District[], void>({
      query: () => `/admin/locations/districts.json`,
      transformResponse: (response: DistrictsResponse) => response.districts,
    }),
    getDistrictsByProvince: builder.query<District[], string>({
      query: (province) =>
        `/admin/locations/districts/find_by_province_code.json?province_code=${province}`,
      transformResponse: (response: DistrictsResponse) => response.districts,
    }),
    getDistrictFindByCode: builder.query<District, string>({
      query: (code) =>
        `/admin/locations/districts/find_by_code.json?code=${code}`,
      transformResponse: (response: DistrictResponse) => response.district,
    }),
    getWardsByDistrict: builder.query<Ward[], string>({
      query: (district) =>
        `/admin/locations/wards/find_by_district_code.json?district_code=${district}`,
      transformResponse: (response: WardsResponse) => response.wards,
    }),
    getLocation: builder.query<Location, number>({
      query: (id) => `/admin/locations/${id}.json`,
      transformResponse: (response: { location: Location }) =>
        response.location,
      providesTags: (_result, _error) =>
        _result ? [{ type: "location", id: _result.id }] : [],
    }),
    getCurrencyByCode: builder.query<CurrencyResponse, string>({
      query: (code) => `/admin/currencies/get_by_code.json?code=${code}`,
      transformResponse: (response: { Currency: CurrencyResponse }) =>
        response.Currency,
    }),
    getTenantWithCurrencyAndSetting: builder.query<
      { tenant: Tenant; timezone: TimeZone; settings: StoreSettingResponse[] },
      void
    >({
      queryFn: async (request, _queryApi, _extraOptions, fetchWithBQ) => {
        const [tenantResult, timezoneResult, settingsResult] =
          await Promise.all([
            fetchWithBQ(`/admin/store.json`),
            fetchWithBQ(`/admin/store/get_timezone.json`),
            fetchWithBQ(
              `/admin/store/store_settings/all.json?keys=ordercodeformat,cost_price,inventory_management,CompleteOnboarding,RegisterPackageTitle,migrate_status`
            ),
          ]);
        if (tenantResult.error) {
          return { error: tenantResult.error };
        }
        const tenant = (tenantResult.data as TenantResponse).store;
        const timezone = (timezoneResult.data as { timezone: TimeZone })
          .timezone;
        if (settingsResult.error) {
          return { error: settingsResult.error };
        }
        const settings = (
          settingsResult.data as { store_settings: StoreSettingResponse[] }
        ).store_settings;
        return {
          data: {
            tenant,
            timezone,
            settings,
          },
        };
      },
      providesTags: ["tenant"],
    }),
    getCurrencies: builder.query<Currency[], void>({
      query: () => `/admin/currencies.json`,
      transformResponse: (response: { currencies: Currency[] }) =>
        response.currencies,
    }),
    getCurrencyFormatTemplates: builder.query<CurrencyFormatTemplate[], void>({
      query: () => `/admin/currency_format_templates.json`,
      transformResponse: (response: {
        currency_format_templates: CurrencyFormatTemplate[];
      }) => response.currency_format_templates,
    }),
    getStoreSettings: builder.query<StoreSettingResponse[], string[]>({
      query: (keys) =>
        `/admin/store/store_settings/all.json${toQueryString({
          keys: keys.join(","),
        })}`,
      transformResponse: (response: {
        store_settings: StoreSettingResponse[];
      }) => response.store_settings,
      providesTags: ["store-setting"],
    }),
    getStoreFeature: builder.query<{ [key in string]: boolean }, void>({
      query: () => `/admin/store_features.json`,
      transformResponse: (response: {
        features: { [key in string]: boolean };
      }) => response.features,
    }),
    updateStoreSetting: builder.mutation<StoreSettingResponse, StoreSettings>({
      query: (request) => ({
        url: `/admin/store/store_settings.json`,
        method: "PUT",
        body: {
          store_setting: request,
        },
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: ["tenant", "store-setting"],
    }),
    countCharges: builder.query<number, ChargeFilterRequest>({
      query: ({ item_types }) => ({
        url: `/admin/charges/count.json`,
        params: {
          item_types: item_types?.join(","),
        },
      }),
      transformResponse: (response: CountResponse) => response.count,
    }),
    getLocationsWithInfinite: builder.query<Location[], LocationFilter>({
      query: (request) => `/admin/locations.json${toQueryString(request)}`,
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.page || arg.page === 1) {
          return newItems;
        } else {
          currentCache.push(...newItems);
          return currentCache;
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      transformResponse: (response: { locations: Location[] }) =>
        response.locations,
      providesTags: ["location"],
    }),
  }),
});

export const {
  useGetTenantQuery,
  useUpdateTenantMutation,
  useGetCountriesQuery,
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetDistrictsByProvinceQuery,
  useLazyGetDistrictsByProvinceQuery,
  useGetProvinceFindByCodeQuery,
  useGetDistrictFindByCodeQuery,
  useGetWardsByDistrictQuery,
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
  useGetLocationQuery,
  useGetCurrencyByCodeQuery,
  useGetTenantWithCurrencyAndSettingQuery,
  useGetStoreSettingsQuery,
  useGetCurrencyFormatTemplatesQuery,
  useGetCurrenciesQuery,
  useCountLocationsQuery,
  useGetStoreFeatureQuery,
  useUpdateStoreSettingMutation,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationPriorityQuery,
  useGetLocationsWithInfiniteQuery,
  useCountChargesQuery,
  useLazyGetLocationQuery,
  useLazyGetStoreSettingsQuery,
} = adminApi;
