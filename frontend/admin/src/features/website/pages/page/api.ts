import { adminApi, transformAxiosErrorResponse } from "app/api";
import { CountResponse, SetResponse } from "app/types";
import { toQueryString } from "app/utils/url";

import { Page, PageFilter, PageRequest } from "../../types/page";

export const pageApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getPage: builder.query<Page, number>({
      query: (id) => `/admin/pages/${id}.json`,
      transformResponse: (response: { page: Page }) => response.page,
      providesTags: ["page"],
    }),
    getPages: builder.query<Page[], PageFilter>({
      query: (q) => `/admin/pages.json${toQueryString(q)}`,
      transformResponse: (response: { pages: Page[] }) => response.pages,
      providesTags: ["page"],
    }),
    getPagesWithInfinite: builder.query<Page[], PageFilter>({
      query: (request) => `/admin/pages.json${toQueryString(request)}`,
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
      transformResponse: (response: { pages: Page[] }) => response.pages,
      providesTags: ["page"],
    }),
    countPage: builder.query<number, PageFilter>({
      query: (request) => `/admin/pages/count.json${toQueryString(request)}`,
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["page"],
    }),
    createPage: builder.mutation<Page, PageRequest>({
      query: (request) => ({
        url: `/admin/pages.json`,
        method: "POST",
        body: { page: request },
      }),
      transformResponse: (response: { page: Page }) => response.page,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["page"] : []),
    }),
    updatePage: builder.mutation<Page, { id: number } & PageRequest>({
      query: ({ id, ...request }) => ({
        url: `/admin/pages/${id}.json`,
        method: "PUT",
        body: { page: request },
      }),
      transformResponse: (response: { page: Page }) => response.page,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["page"] : []),
    }),
    deletePage: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/pages/${request}.json`,
        method: "DELETE",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["page"] : []),
    }),
    bulkDeletePage: builder.mutation<SetResponse, number[]>({
      query: (ids) => ({
        method: "DELETE",
        url: "/admin/pages/set.json",
        params: { ids: ids.join(",") },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["page"] : []),
    }),
    bulkUpdateStatusPage: builder.mutation<SetResponse, { operation: "publish" | "unpublish"; ids: number[] }>({
      query: (request) => ({
        method: "PUT",
        url: "/admin/pages/set.json",
        body: { set: { operation: request.operation, ids: request.ids } },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["page"] : []),
    }),
  }),
});

export const {
  useGetPageQuery,
  useGetPagesQuery,
  useGetPagesWithInfiniteQuery,
  useCountPageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useBulkDeletePageMutation,
  useBulkUpdateStatusPageMutation,
} = pageApi;
