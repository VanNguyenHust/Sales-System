import { adminApi, transformAxiosErrorResponse } from "app/api";

import { Linklist, LinklistChange } from "../../types";

const linkApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getLinklist: builder.query<Linklist, number>({
      query: (id) => ({
        url: `/admin/linklists/${id}.json`,
      }),
      transformResponse: (response: { linklist: Linklist }) => response.linklist,
      providesTags: ["linklist"],
    }),
    getLinklists: builder.query<Linklist[], void>({
      query: () => "/admin/linklists.json",
      transformResponse: (response: { linklists: Linklist[] }) => response.linklists,
      providesTags: ["linklist"],
    }),
    updateLinklist: builder.mutation<Linklist, LinklistChange>({
      query: (request) => ({
        method: "POST",
        url: "/admin/linklists.json",
        body: { change: request },
      }),
      transformResponse: (response: { linklist: Linklist }) => response.linklist,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["linklist"] : []),
    }),
    deleteLinklist: builder.mutation<void, number>({
      query: (id) => ({
        method: "DELETE",
        url: `/admin/linklists/${id}.json`,
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["linklist"] : []),
    }),
    validateLinklist: builder.mutation<void, LinklistChange>({
      query: (request) => ({
        method: "POST",
        url: `/admin/linklists/validate.json`,
        body: { change: request },
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: () => [],
    }),
  }),
});

export const {
  useGetLinklistQuery,
  useGetLinklistsQuery,
  useUpdateLinklistMutation,
  useDeleteLinklistMutation,
  useValidateLinklistMutation,
} = linkApi;
