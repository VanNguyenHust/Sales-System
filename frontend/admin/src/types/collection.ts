import { Linklist } from "app/features/website/types";

import { PublicationResponse } from "./app";
import { PaginationFilter } from "./common";
import { MediaFileResponse } from "./file";
import { MetafieldRequest } from "./metafield";
import { ProductResponse } from "./product";
import { SaveSearch } from "./saveSearch";
import { ThemeResponse } from "./themes";

export type CollectionResponse = {
  id: number;
  name: string;
  alias: string | null;
  description: string | null;
  published_on: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_on: string;
  modified_on: string | null;
  template_layout: string | null;
  sort_order: string | null;
  image: MediaFileResponse;
  rules: CollectionRuleResponse[] | null;
  products_count: number;
  type: "custom" | "smart";
  disjunctive: boolean | null;
};

export type CollectionRuleResponse = {
  id: number;
  collection_id: number;
  column: string | null;
  relation: string | null;
  condition: string | null;
};

export interface CollectionFilterRequest extends PaginationFilter {
  ids?: string;
  name?: string;
  alias?: string;
  product_id?: number;
  collection_type?: string;
  save_search_id?: number;
  publication_included?: number;
  publication_excluded?: number;
}

export type CollectionMappingRequest = {
  id?: number;
  product_id: number;
  collection_id: number;
  featured?: boolean;
};

export type BulkInsertCollectRequest = {
  product_id: number;
  collection_ids: number[];
};

export type ProductCollectionMapping = {
  id: number;
  store_id: number;
  product_id: number;
  collection_id: number;
  position: number;
  featured: boolean;
  created_on: string;
  modified_on?: string;
};

export type CollectionMappingResponse = {
  id: number;
  store_id: number;
  product_id: number;
  collection_id: number;
  position: number;
  featured: boolean;
};

export type CollectionListState = {
  isLoading: boolean;
  total: number;
  showPaging: boolean;
  totalPages: number;
  collections: CollectionResponse[];
  saveSearchs: SaveSearch[];
  saveSearchSelectedId: string | number;
  filters: CollectionFilterRequest;
  publications: PublicationResponse[];
};

export type CollectionCreateState = {
  publications: PublicationResponse[];
  isLoading: boolean;
  themes: ThemeResponse[];
  productsResult: {
    products: ProductResponse[];
    loading: boolean;
    total: number;
    loadingAppendProduct: boolean;
  };
  linkList: Linklist[];
  searchProducts: SearchProductByCollectionState;
  collection?: CollectionResponse;
};

export interface SearchProductByCollectionState {
  products: ProductResponse[];
  total: number;
  limit: number;
  page: number;
  isLoading: boolean;
}

export type CollectionFilterQuery = {
  name?: string;
  query?: string;
  collection_type?: string;
};

export type CollectionRequest = {
  id_update?: number;
  name: string;
  alias?: string;
  description?: string;
  published_on?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  template_layout?: string;
  sort_order?:
    | "alpha-asc"
    | "alpha-desc"
    | "price-desc"
    | "price-asc"
    | "created-desc"
    | "created-asc"
    | "manual"
    | null;
  disjunctive?: boolean;
  type?: string;
  image?: CollectionImageRequest | null;
  rules: CollectionRuleRequest[];
  metafields: MetafieldRequest[];
};

export type CollectionImageRequest = {
  id?: number;
  base64?: string;
  src?: string;
  file?: File;
  filename?: string;
  alt?: string;
  variant_ids?: number[];
  position?: number;
};

export type CollectionRuleRequest = {
  collection_id?: number;
  column: "title" | "type" | "vendor" | "variant_price" | "tag";
  relation: "equals" | "greater_than" | "less_than" | "starts_with" | "ends_with" | "contains";
  condition: string;
};

export type CollectionSetRequest = {
  ids: number[];
  operation: "publish" | "unpublish";
  selected_all?: boolean;
};
