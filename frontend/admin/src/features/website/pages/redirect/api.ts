import { adminApi, transformAxiosErrorResponse } from "app/api";
import { CountResponse, SetResponse } from "app/types";
import { toQueryString } from "app/utils/url";

import { Redirect, RedirectFilter, RedirectImportRequest, RedirectRequest } from "../../types";

const redirectApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getRedirects: builder.query<Redirect[], RedirectFilter>({
      query: (q) => `/admin/redirects.json${toQueryString(q)}`,
      transformResponse: (response: { redirects: Redirect[] }) => response.redirects,
      providesTags: ["redirect"],
    }),
    countRedirect: builder.query<number, RedirectFilter>({
      query: (request) => `/admin/redirects/count.json${toQueryString(request)}`,
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["redirect"],
    }),
    createRedirect: builder.mutation<Redirect, RedirectRequest>({
      query: (request) => ({
        url: `/admin/redirects.json`,
        method: "POST",
        body: { redirect: request },
      }),
      transformResponse: (response: { redirect: Redirect }) => response.redirect,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["redirect"] : []),
    }),
    deleteRedirect: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/redirects/${request}.json`,
        method: "DELETE",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["redirect"] : []),
    }),
    bulkDeleteRedirect: builder.mutation<SetResponse, number[]>({
      query: (ids) => ({
        method: "DELETE",
        url: "/admin/redirects/set.json",
        params: { ids: ids.join(",") },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["redirect"] : []),
    }),
    deleteAndInsertRedirect: builder.mutation<Redirect, RedirectRequest>({
      query: (request) => ({
        url: "/admin/redirects/delete_and_insert.json",
        method: "POST",
        body: { redirect: request },
      }),
      transformResponse: (response: { redirect: Redirect }) => response.redirect,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["redirect"] : []),
    }),
    importRedirect: builder.mutation<void, RedirectImportRequest>({
      query: (request) => ({
        url: "/admin/redirects/import.json",
        method: "POST",
        body: { import: request },
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["redirect"] : []),
    }),
  }),
});

export const {
  useGetRedirectsQuery,
  useCountRedirectQuery,
  useCreateRedirectMutation,
  useDeleteRedirectMutation,
  useBulkDeleteRedirectMutation,
  useDeleteAndInsertRedirectMutation,
  useImportRedirectMutation,
} = redirectApi;
