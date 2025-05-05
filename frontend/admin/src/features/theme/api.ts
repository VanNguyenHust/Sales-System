import { adminApi, transformAxiosErrorResponse } from "src/api";
import { AssetFilterRequest, AssetResponse, ThemeResponse } from "src/types";
import { toQueryString } from "src/utils/url";

const themeApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getThemes: builder.query<ThemeResponse[], undefined>({
      query: () => "/admin/themes.json",
      transformResponse: (response: { themes: ThemeResponse[] }) =>
        response.themes,
      providesTags: ["theme"],
    }),
    getAssetByThemeId: builder.query<AssetResponse[], number>({
      query: (id) => ({
        method: "GET",
        url: `/admin/themes/${id}/assets.json`,
      }),
      transformResponse: (response: { assets: AssetResponse[] }) =>
        response.assets,
      transformErrorResponse: transformAxiosErrorResponse,
      providesTags: ["theme"],
    }),
    getAssets: builder.query<
      AssetResponse[],
      AssetFilterRequest & { theme_id: number }
    >({
      query: ({ theme_id, ...request }) => ({
        method: "GET",
        url: `/admin/themes/${theme_id}/assets.json${toQueryString(request)}`,
      }),
      transformResponse: (response: { assets: AssetResponse[] }) =>
        response.assets,
      transformErrorResponse: transformAxiosErrorResponse,
      providesTags: ["theme"],
    }),
  }),
});

export const {
  useGetThemesQuery,
  useGetAssetByThemeIdQuery,
  useLazyGetAssetByThemeIdQuery,
  useGetAssetsQuery,
} = themeApi;
