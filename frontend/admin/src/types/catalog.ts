import { PublicationTaskStatus } from "./app";
import { PaginationFilter } from "./common";
import { ProductFilter } from "./product";

export type CatalogFilterRequest = {
  type?: CatalogType;
  status?: CatalogStatus;
  ids?: string;
  reverse?: boolean;
  sort_key?: "id" | "title";
  query?: string;
  customer_group_ids?: string;
} & PaginationFilter;

export type CatalogType = "location" | "customer" | "app";

export type CatalogStatus = "active" | "draft";

export type Catalog = {
  id: number;
  context?: CatalogContext;
  code: string;
  title: string;
  publication: Publication | null;
  status: CatalogStatus;
  type: CatalogType;
  price_list: PriceList | null;
  created_on: string;
  modified_on: string;
};

type CatalogContext = {
  location_ids?: number[];
  customer_group_ids?: number[];
};

export type CatalogResponse = {
  catalog: Catalog;
};

export type CatalogListResponse = {
  catalogs: Catalog[];
};

export type CatalogBulkUpdateStatusRequest = {
  ids: number[];
  status: CatalogStatus;
};

export type CatalogCreateRequest = {
  title: string;
  publication_id: number;
  status: CatalogStatus;
  type: CatalogType;
  context?: CatalogContext;
};

export type CatalogUpdateRequest = {
  id: number;
  title?: string;
  publication_id?: number;
  status?: CatalogStatus;
  context?: CatalogContext;
};

export type CatalogImportRequest = {
  id?: number;
  detail_import?: boolean;
  key: string;
  receiver_email: string;
  override_exists?: boolean;
};

export type CatalogExportRequest = {
  limit?: number;
  page?: number;
  ids?: number[];
  only_fixed_price: boolean;
  export_catalogs_type: "page" | "selected";
  receiver_email: string;
  query?: string;
  status?: CatalogStatus;
  type?: CatalogType;
  sort_key?: "id" | "title";
  reverse?: boolean;
};

export type CatalogBulkDeleteRequest = {
  ids: number[];
};

export type PriceListFixedPriceBulkDeleteRequest = {
  ids: number[];
  operation: "delete_by_ids" | "delete_by_product_ids" | "delete_all" | "delete_by_product_filter";
  price_list_id: number;
  filter?: ProductFilter;
};

export type PriceList = {
  id: number;
  title: string;
  catalog_id?: number;
  adjustment_type: PriceListAdjustmentType;
  adjustment_value: number;
  compare_at_mode: PriceListCompareAtMode;
  fixed_prices_count: number;
  created_on: string;
  modified_on: string;
};

export type PriceListResponse = {
  price_list: PriceList;
};

export type PriceListAdjustmentType = "percentage_increase" | "percentage_decrease";

type PriceListCompareAtMode = "adjusted" | "nullify";

export type PriceListCreateRequest = {
  title: string;
  catalog_id: number;
  adjustment_value: number;
  adjustment_type: PriceListAdjustmentType;
  compare_at_mode?: PriceListCompareAtMode;
};

export type PriceListUpdateRequest = {
  title?: string;
  catalog_id?: number;
  adjustment_value?: number;
  adjustment_type?: PriceListAdjustmentType;
  compare_at_mode?: PriceListCompareAtMode;
};

export type PriceListFixedPriceUpsertRequest = {
  price_list_id: number;
  prices_to_add: PriceListPriceVariantRequest[];
  prices_to_delete_by_variant?: number[];
};

type PriceListPriceVariantRequest = {
  compare_at_price?: number;
  price: number;
  variant_id: number;
};

export type PriceListFixedPrice = {
  id: number;
  price_list_id: number;
  variant_id: number;
  product_id: number;
  compare_at_price: number | null;
  price: number;
};

export type PriceListFixedPriceResponse = {
  price_list_fixed_price: PriceListFixedPrice;
};

export type PriceListFixedPricesResponse = {
  price_list_fixed_prices: PriceListFixedPrice[];
};

export type PriceListFixedPriceFilter = {
  product_id?: number;
  variant_ids?: number[];
  product_ids?: number[];
} & PaginationFilter;

type Publication = {
  id: number;
  name: string;
  client_id: string;
  auto_publish_product?: boolean;
  task_status?: PublicationTaskStatus;
};
