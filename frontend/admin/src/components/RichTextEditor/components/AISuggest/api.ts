import { adminApi, transformAxiosErrorResponse } from "app/api";
import {
  AiSuggestionsContentModifyRequest,
  AiSuggestionsContentModifyResponse,
  AiSuggestionsContentRequest,
  AiSuggestionsContentResponse,
  AiSuggestionsDescriptionModifyResponse,
  AiSuggestionsDescriptionResponse,
} from "app/types";

export const aiSuggestionsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    generateAIArticleContent: builder.mutation<AiSuggestionsContentResponse, AiSuggestionsContentRequest>({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/article/content.json",
        method: "POST",
        body: {
          content_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsContentResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIArticleContentModify: builder.mutation<
      AiSuggestionsContentModifyResponse,
      AiSuggestionsContentModifyRequest
    >({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/article/content_modify.json",
        method: "POST",
        body: {
          content_modify_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsContentModifyResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIArticleShortContent: builder.mutation<AiSuggestionsContentResponse, AiSuggestionsContentRequest>({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/article/short_content.json",
        method: "POST",
        body: {
          content_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsContentResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIPageContent: builder.mutation<AiSuggestionsContentResponse, AiSuggestionsContentRequest>({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/page/content.json",
        method: "POST",
        body: {
          content_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsContentResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIPageContentModify: builder.mutation<
      AiSuggestionsContentModifyResponse,
      AiSuggestionsContentModifyRequest
    >({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/page/content_modify.json",
        method: "POST",
        body: {
          content_modify_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsContentModifyResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIProductDescription: builder.mutation<AiSuggestionsDescriptionResponse, AiSuggestionsContentRequest>({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/product/description.json",
        method: "POST",
        body: {
          description_request: {
            ...request,
            description_content: request.description,
          },
        },
      }),
      transformResponse: (response: AiSuggestionsDescriptionResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIProductDescriptionModify: builder.mutation<
      AiSuggestionsDescriptionModifyResponse,
      AiSuggestionsContentModifyRequest
    >({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/product/description_modify.json",
        method: "POST",
        body: {
          description_modify_request: request,
        },
      }),
      transformResponse: (response: AiSuggestionsDescriptionModifyResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
    generateAIProductShortDescription: builder.mutation<AiSuggestionsDescriptionResponse, AiSuggestionsContentRequest>({
      query: (request) => ({
        url: "/admin/ai_converse/sapo_ai/product/short_description.json",
        method: "POST",
        body: {
          description_request: {
            ...request,
            description_content: request.description,
            writing_type: undefined,
          },
        },
      }),
      transformResponse: (response: AiSuggestionsDescriptionResponse) => response,
      transformErrorResponse: transformAxiosErrorResponse,
    }),
  }),
});

export const {
  useGenerateAIArticleContentMutation,
  useGenerateAIArticleContentModifyMutation,
  useGenerateAIArticleShortContentMutation,
  useGenerateAIPageContentMutation,
  useGenerateAIPageContentModifyMutation,
  useGenerateAIProductDescriptionMutation,
  useGenerateAIProductDescriptionModifyMutation,
  useGenerateAIProductShortDescriptionMutation,
} = aiSuggestionsApi;
