import { TextDateTransfer } from "app/components/DateTimeField";
import { Range } from "app/features/inventory/types";
import {
  DateRangeValue,
  InventoryLevelResponse,
  MetafieldRequest,
  PaginationFilter,
  ProductOptionResponse,
} from "app/types";

export interface VariantFilterExport {
  saved_search_id?: string;
  product_id?: number | null;
  published?: boolean | null;
  tag?: string | null;
  inventory_quantity?: number | null;
  inventory_quantity_min?: number | null;
  inventory_quantity_max?: number | null;
  inventory_management?: string | null;
  ids?: string[] | null;
  since_id?: number | null;
  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  location_ids?: number | null;
  status?: string | null;
  statuses?: string;
  query?: string | null;
  created_at_min?: string;
  created_at_max?: string;
  created_option?: TextDateTransfer;
  on_hand_min?: number | null;
  on_hand_max?: number | null;
  available_min?: number | null;
  available_max?: number | null;
  incoming_min?: number | null;
  incoming_max?: number | null;
  committed_min?: number | null;
  committed_max?: number | null;
  product_type?: string | null;
  product_types?: string[] | null;
  collection_ids?: string[] | null;
  vendor?: string | null;
  vendors?: string[] | null;
  sort_by?: string | null;
  sort_direction?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const VariantFilterNumberFields = ["page", "limit"];

export type VariantResponse = {
  id: number;
  product_id: number;
  inventory_item_id: number;
  barcode: string | null;
  sku: string | null;
  price: number | null;
  compare_at_price: number | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  taxable: boolean;
  inventory_management: string | null;
  inventory_policy: string | null;
  inventory_quantity: number;
  requires_shipping: boolean;
  weight: number;
  weight_unit: string;
  image_id: number | null;
  position: number;
  created_on: string;
  modified_on: string | null;
  title: string | null;
  grams: number;
  /**Api đã ngưng support */
  product_name?: string;
  type: string | null;
  /** @required Filter fields=product */
  image?: VariantImageExt;
  /** @required Filter fields=product */
  product?: SimpleProduct;
  /** @required Filter fields=product */
  display_name?: string;
  unit?: string;
  contextual_pricing?: VariantContextualPricing;
};

export type SimpleProduct = {
  id: number;
  name: string;
  alias: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  status: "draft" | "active" | "archive";
  image?: VariantImageExt;
  options: ProductOptionResponse[];
};

export type VariantResponseExt = VariantResponse & {
  product?: VariantProductExt;
  image?: VariantImageExt;
};

export type VariantProductExt = {
  id: number;
  name: string;
  alias: string;
  vendor: string;
  product_type: string;
  tags: string;
  status: "draft" | "active" | "archive";
  image?: VariantImageExt;
  options: ProductOptionResponse[];
};

export type VariantImageExt = {
  alt: string;
  src: string;
};

export type VariantWithInventory = VariantResponseExt & {
  cost_price?: number | null;
  inventory_levels: InventoryLevelResponse[];
};

/**
 * Price min = 0, max = 100,000,000,000,000
 */
export type ProductVariantRequest = {
  id?: number;
  variant_id?: number;
  id_update?: number;
  //Max = 50
  barcode?: string;
  //Max=50
  sku?: string;
  price?: number;
  compare_at_price?: number | null;
  //Max=500
  option1?: string;
  //Max=500
  option2?: string;
  //Max=500
  option3?: string;
  taxable?: boolean;
  inventory_management?: InventoryManagement;
  inventory_policy?: InventoryPolicy;
  inventory_quantity?: number;
  old_inventory_quantity?: number;
  inventory_quantity_adjustment?: number;
  requires_shipping?: boolean;
  //Max=2,000,000,000  Min=0
  weight?: number;
  weight_unit?: VariantWeightUnit;
  metafields?: MetafieldRequest[];
  image_position?: number;
  image_id?: number;
  //Size(max=100)
  inventory_quantities?: InventoryQuantityRequest[];
  cost_price?: number;
  local_status?: "active" | "deleted" | "created";
  uuid: string;
  inventory_item_id?: number;
  type?: string;
  unit?: string;
  packsize_quantity?: number;
};

export type InventoryQuantityRequest = {
  id?: number;
  on_hand: number;
  available?: number;
  location_id: number;
  inventory_item_id?: number;
  type?: "emulator" | "normal";
};

export type VariantWeightUnit = "kg" | "lb" | "oz" | "g";
export type InventoryPolicy = "deny" | "continue";
export type InventoryManagement = "" | "bizweb";

export interface VariantFilter extends PaginationFilter {
  saved_search_id?: string;
  product_id?: number | null;
  published?: boolean | null;
  tag?: string | null;
  inventory_quantity?: number | null;
  inventory_quantity_min?: number | null;
  inventory_quantity_max?: number | null;
  inventory_management?: string | null;
  // ids?: string[] | null;
  ids?: string | null;
  since_id?: number | null;
  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  location_ids?: string | number;
  status?: string | null;
  statuses?: string;
  query?: string | null;
  created_at_min?: string;
  created_at_max?: string;
  created_option?: TextDateTransfer;
  on_hand_min?: number | null;
  on_hand_max?: number | null;
  available_min?: number | null;
  available_max?: number | null;
  incoming_min?: number | null;
  incoming_max?: number | null;
  committed_min?: number | null;
  committed_max?: number | null;
  product_type?: string | null;
  product_types?: string[] | null;
  collection_ids?: string[] | null;
  vendor?: string | null;
  vendors?: string[] | null;
  types?: ("normal" | "combo" | "packsize")[] | null;
  barcode?: string | null;
  /**
   * @deprecated use sortKey & reverse instead
   */
  sort_by?: string | null;
  /**
   * @deprecated use sortKey & reverse instead
   */
  sort_direction?: "asc" | "desc";
  fields?: "product";
  sort_key?: "id" | "relevance";
  reverse?: boolean;
  context_price_location_id?: number;
  context_price_customer_group_id?: number;
  context_price_client_id?: string;
}

export interface VariantResponseInQuery extends VariantResponse {
  cost_price?: number;
  on_hand?: number;
}

export type VariantContextualPricing = {
  price: number;
  compare_at_price: number | null;
  origin_type: "fixed" | "relative" | null;
};
