export interface SavedSearch {
  id: number;
  name: string;
  type: string;
  query: string;
  created_on: string;
  modified_on: string;
}

export interface SavedSearchFilterRequest {
  type: SavedSearchType;
}

export interface SavedSearchResponse {
  saved_search: SavedSearch;
}

export interface SavedSearchsResponse {
  saved_searchs: SavedSearch[];
}

export interface SavedSearchRequest {
  name: string;
  type: SavedSearchType;
  query: string;
}

export type SavedSearchType =
  | "customers"
  | "promotion_price_rules"
  | "vouchers"
  | "order_returns"
  | "files"
  | "promotion_price_rules"
  | "vouchers"
  | "suppliers"
  | "orders_v3"
  | "setting_column_orders"
  | "draft_orders_v3"
  | "shipments"
  | "shipments_setting_column"
  | "shipments_export"
  | "products"
  | "supplier_returns"
  | "price_rules"
  | "stock_transfers"
  | "collections"
  | "inventory"
  | "inventory_setting_column"
  | "setting_column_receive_inventories"
  | "receive_inventories"
  | "purchase_orders"
  | "purchase_orders_setting_column"
  | "catalogs"
  | "customer_groups"
  | "blogs"
  | "articles"
  | "comments"
  | "pages"
  | "redirects"
  | "report_dashboard";
