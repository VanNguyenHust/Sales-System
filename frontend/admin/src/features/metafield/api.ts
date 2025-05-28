import { CountResponse } from "@/types/common";
import {
  MetafieldDefinitionAppliedFilter,
  MetafieldDefinitionAppliedResponse,
  MetafieldDefinitionCountResponse,
  MetafieldDefinitionFilterRequest,
  MetafieldDefinitionRequest,
  MetafieldDefinitionResponse,
} from "@/types/metafield";
import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { toQueryString } from "@/utils/url";
import { createApi } from "@reduxjs/toolkit/query/react";

export const metafieldApi = createApi({
  reducerPath: "metafieldApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["definition", "metafield"],
  endpoints: (builder) => ({
    getMetafieldDefinitions: builder.query<
      MetafieldDefinitionResponse[],
      MetafieldDefinitionFilterRequest
    >({
      query: (request) => ({
        url: `/admin/metafield_definitions.json`,
        params: request,
      }),
      transformResponse: (response: MetafieldDefinitionResponse[]) => response,
      providesTags: ["definition"],
    }),
    countMetafieldDefinition: builder.query<
      number,
      MetafieldDefinitionFilterRequest
    >({
      query: (request) =>
        `/admin/metafield_definitions/count.json${toQueryString(request)}`,
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["definition"],
    }),
    definitionCountByResource: builder.query<
      MetafieldDefinitionCountResponse[],
      void
    >({
      query: () => ({
        url: `/admin/metafield_definitions/count_by_resource`,
        method: "GET",
      }),
      providesTags: ["definition"],
      transformResponse: (response: MetafieldDefinitionCountResponse[]) =>
        response,
    }),
    getMetafieldDefinition: builder.query<MetafieldDefinitionResponse, number>({
      query: (id) => `/admin/metafield_definitions/${id}.json`,
      transformResponse: (response: MetafieldDefinitionResponse) => response,
      providesTags: ["definition"],
    }),
    createMetafieldDefinition: builder.mutation<
      MetafieldDefinitionResponse,
      MetafieldDefinitionRequest
    >({
      query: (request) => ({
        url: `/admin/metafield_definitions.json`,
        method: "POST",
        body: request,
      }),
      transformResponse: (response: MetafieldDefinitionResponse) => response,
      invalidatesTags: (_result, error) => (!error ? ["definition"] : []),
    }),
    updateMetafieldDefinition: builder.mutation<
      MetafieldDefinitionResponse,
      | MetafieldDefinitionRequest
      | Pick<
          MetafieldDefinitionRequest,
          "key" | "namespace" | "ownerResource" | "pin"
        >
    >({
      query: (request) => ({
        url: `/admin/metafield_definitions.json`,
        method: "PUT",
        body: request,
      }),
      transformResponse: (response: MetafieldDefinitionResponse) => response,
      invalidatesTags: (_result, error) => (!error ? ["definition"] : []),
    }),
    getMetafieldDefinitionsApplied: builder.query<
      MetafieldDefinitionAppliedResponse[],
      MetafieldDefinitionAppliedFilter
    >({
      query: (request) => ({
        url: `/admin/metafield_definitions/applied_for_upsert.json`,
        params: request,
      }),
      transformResponse: (response: MetafieldDefinitionAppliedResponse[]) =>
        response,
      providesTags: ["metafield"],
    }),
  }),
});

export const {
  useGetMetafieldDefinitionsQuery,
  useCountMetafieldDefinitionQuery,
  useDefinitionCountByResourceQuery,
  useGetMetafieldDefinitionQuery,
  useCreateMetafieldDefinitionMutation,
  useUpdateMetafieldDefinitionMutation,
  useGetMetafieldDefinitionsAppliedQuery,
} = metafieldApi;
