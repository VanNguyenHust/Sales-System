import {
  ProductFilterRequest,
  ProductRequest,
  ProductResponse,
  ProductsResponse,
} from "@/types/product";
import { authFetchBaseQuery } from "@/utils/authFetchQuery";
import { toQueryString } from "@/utils/url";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: authFetchBaseQuery,
  tagTypes: ["product"],
  endpoints: (builder) => ({
    createProduct: builder.mutation<ProductResponse, ProductRequest>({
      query: (product) => ({
        url: "/admin/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["product"],
      transformResponse: (response: ProductResponse) => response,
    }),
    updateProduct: builder.mutation<
      ProductResponse,
      { id: number; product: ProductRequest }
    >({
      query: ({ id, product }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: ["product"],
      transformResponse: (response: ProductResponse) => response,
    }),
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => ({
        url: `/admin/products/${id}`,
      }),
      providesTags: ["product"],
      transformResponse: (response: ProductResponse) => response,
    }),
    getProducts: builder.query<ProductsResponse, ProductFilterRequest>({
      query: (filter) => ({
        url: `/admin/products/search${toQueryString(filter)}`,
      }),
      providesTags: ["product"],
      transformResponse: (response: ProductsResponse) => response,
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} = productApi;
