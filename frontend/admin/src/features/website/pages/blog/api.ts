import { AxiosHeaders } from "axios";

import { adminApi, transformAxiosErrorResponse } from "app/api";
import { CountResponse, SetResponse } from "app/types";

import {
  Article,
  ArticleBulkUpdateRequest,
  ArticleFilter,
  ArticleRequest,
  Blog,
  BlogFilter,
  BlogRequest,
  CommentFilter,
  CommentResponse,
} from "../../types";

export const blogApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query<Blog, number>({
      query: (id) => `/admin/blogs/${id}.json`,
      transformResponse: (response: { blog: Blog }) => response.blog,
      providesTags: ["blog"],
    }),
    getBlogs: builder.query<Blog[], BlogFilter>({
      query: (request) => ({ url: "/admin/blogs.json", params: request }),
      transformResponse: (response: { blogs: Blog[] }) => response.blogs,
      providesTags: ["blog"],
    }),
    countBlog: builder.query<number, BlogFilter>({
      query: (request) => ({ url: "/admin/blogs/count.json", params: request }),
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["blog"],
    }),
    getBlogsWithInfinite: builder.query<Blog[], BlogFilter>({
      query: (request) => ({ url: "/admin/blogs.json", params: request }),
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
      transformResponse: (response: { blogs: Blog[] }) => response.blogs,
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation<Blog, BlogRequest>({
      query: (request) => ({
        url: `/admin/blogs.json`,
        method: "POST",
        body: { blog: request },
      }),
      transformResponse: (response: { blog: Blog }) => response.blog,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["blog"] : []),
    }),
    updateBlog: builder.mutation<Blog, { id: number } & BlogRequest>({
      query: ({ id, ...request }) => ({
        url: `/admin/blogs/${id}.json`,
        method: "PUT",
        body: { blog: request },
      }),
      transformResponse: (response: { blog: Blog }) => response.blog,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["blog"] : []),
    }),
    deleteBlog: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/blogs/${request}.json`,
        method: "DELETE",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["blog"] : []),
    }),
    bulkDeleteBlog: builder.mutation<SetResponse, number[]>({
      query: (ids) => ({
        method: "DELETE",
        url: "/admin/blogs/set.json",
        params: { ids: ids.join(",") },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["blog"] : []),
    }),
    getArticle: builder.query<Article, number>({
      query: (request) => `/admin/articles/${request}.json`,
      transformResponse: (response: { article: Article }) => response.article,
      providesTags: ["article"],
    }),
    getArticles: builder.query<Article[], ArticleFilter>({
      query: (request) => ({ url: "/admin/articles.json", params: request }),
      transformResponse: (response: { articles: Article[] }) => response.articles,
      providesTags: ["article"],
    }),
    searchArticles: builder.query<{ articles: Article[]; count: number }, ArticleFilter>({
      query: (request) => ({ url: "/admin/articles/search.json", params: request }),
      transformResponse: (response: { articles: Article[] }, meta: { headers: AxiosHeaders }) => {
        return {
          articles: response.articles,
          count: Number(meta.headers.get("x-bizweb-total-record") || 0),
        };
      },
      providesTags: ["article"],
    }),
    countArticle: builder.query<number, ArticleFilter>({
      query: (request) => ({ url: "/admin/articles/count.json", params: request }),
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["article"],
    }),
    createArticle: builder.mutation<Article, ArticleRequest>({
      query: (request) => ({
        url: `/admin/articles.json`,
        method: "POST",
        body: { article: request },
      }),
      transformResponse: (response: { article: Article }) => response.article,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["article"] : []),
    }),
    updateArticle: builder.mutation<Article, { id: number } & ArticleRequest>({
      query: ({ id, ...request }) => ({
        url: `/admin/articles/${id}.json`,
        method: "PUT",
        body: { article: request },
      }),
      transformResponse: (response: { article: Article }) => response.article,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["article"] : []),
    }),
    deleteArticle: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/articles/${request}.json`,
        method: "DELETE",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["article"] : []),
    }),
    getArticleTags: builder.query<string[], { order?: "popularity" | "alphabetically"; query?: string; take?: number }>(
      {
        query: (request) => {
          return {
            url:
              request.order && request.order === "popularity"
                ? "/admin/articles/popular_tag.json"
                : "/admin/articles/tags.json",
            params: {
              query: request.query,
              take: request.take,
            },
          };
        },
        transformResponse: (response: { tags: string[] }) => response.tags,
        providesTags: ["article"],
      }
    ),
    getArticleSuggestTags: builder.query<string[], { query?: string; take?: number }>({
      query: (request) => ({ url: "/admin/articles/suggest_tag.json", params: request }),
      transformResponse: (response: { tags: string[] }) => response.tags,
      providesTags: ["article"],
    }),
    getArticleAuthors: builder.query<string[], void>({
      query: () => "/admin/articles/authors.json",
      transformResponse: (response: { authors: string[] }) => response.authors,
      providesTags: ["article"],
    }),
    bulkUpdateArticle: builder.mutation<SetResponse, ArticleBulkUpdateRequest>({
      query: (request) => ({
        url: "/admin/articles/set.json",
        method: "PUT",
        headers: {
          "X-Bizweb-Source": "backend",
        },
        body: { set: request },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["article"] : []),
    }),
    bulkDeleteArticle: builder.mutation<SetResponse, number[]>({
      query: (ids) => ({
        url: "/admin/articles/set.json",
        method: "DELETE",
        headers: {
          "X-Bizweb-Source": "backend",
        },
        params: { ids: ids.join(",") },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["article"] : []),
    }),
    getComments: builder.query<CommentResponse[], CommentFilter>({
      query: (request) => ({ url: "/admin/comments.json", params: request }),
      transformResponse: (response: { comments: CommentResponse[] }) => response.comments,
      providesTags: ["comment", "article", "blog"],
    }),
    countComment: builder.query<number, CommentFilter>({
      query: (request) => ({ url: "/admin/comments/count.json", params: request }),
      transformResponse: (response: CountResponse) => response.count,
      providesTags: ["comment", "article", "blog"],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/comments/${request}.json`,
        method: "DELETE",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["comment", "article"] : []),
    }),
    approveComment: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/comments/${request}/approve.json`,
        method: "POST",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["comment", "article"] : []),
    }),
    markAsNotSpam: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/comments/${request}/not_spam.json`,
        method: "POST",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["comment", "article"] : []),
    }),
    markAsSpam: builder.mutation<void, number>({
      query: (request) => ({
        url: `/admin/comments/${request}/spam.json`,
        method: "POST",
      }),
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_result, error) => (!error ? ["comment", "article"] : []),
    }),
    bulkUpdateStatusComment: builder.mutation<
      SetResponse,
      { operation: "spam" | "notspam" | "approve"; ids: number[] }
    >({
      query: (request) => ({
        url: "/admin/comments/set.json",
        method: "PUT",
        headers: {
          "X-Bizweb-Source": "backend",
        },
        body: { set: request },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["comment", "article"] : []),
    }),
    bulkDeleteComment: builder.mutation<SetResponse, number[]>({
      query: (ids) => ({
        url: "/admin/comments/set.json",
        method: "DELETE",
        headers: {
          "X-Bizweb-Source": "backend",
        },
        params: { ids: ids.join(",") },
      }),
      transformResponse: (response: { result: SetResponse }) => response.result,
      transformErrorResponse: transformAxiosErrorResponse,
      invalidatesTags: (_, error) => (!error ? ["comment", "article"] : []),
    }),
  }),
});

export const {
  useGetBlogQuery,
  useGetBlogsQuery,
  useLazyGetBlogsQuery,
  useCountBlogQuery,
  useGetBlogsWithInfiniteQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useBulkDeleteBlogMutation,
  useGetArticleQuery,
  useGetArticlesQuery,
  useSearchArticlesQuery,
  useCountArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useGetArticleTagsQuery,
  useGetArticleSuggestTagsQuery,
  useGetArticleAuthorsQuery,
  useBulkUpdateArticleMutation,
  useBulkDeleteArticleMutation,
  useGetCommentsQuery,
  useCountCommentQuery,
  useDeleteCommentMutation,
  useApproveCommentMutation,
  useMarkAsNotSpamMutation,
  useMarkAsSpamMutation,
  useBulkUpdateStatusCommentMutation,
  useBulkDeleteCommentMutation,
} = blogApi;
