import { TextDateTransfer } from "app/components/DateTimeField";
import { Location, PaginationFilter, VariantFilterExport, VariantImageExt } from "app/types";

export type InventoryImportRequest = {
  key?: string;
  receiver_email?: string;
  user_id?: number;
  file_name: string;
  base64?: string;
  size: number;
  file_data: any;
};

export type InventoryImportResult = {
  success: number;
  errors: number;
  skip: number;
  messageErrors: ErrorImport[];
};

export type ErrorImport = {
  row?: number;
  message?: string;
};

export type InventoryExportRequest = {
  type: string;
  filter: VariantFilterExport;
  fields?: string[];
  receiver_email: string;
  user_id: number;
  title?: string;
};

export type ColumnExport = {
  name: string;
  label: string;
  selected?: boolean;
  colIndex: 1 | 2 | 3;
  default?: boolean;
};

export interface InventoryAdjustmentFilter {
  location_ids?: string;
  document_types?: string;
  issued_at_min?: string;
  issued_at_max?: string;
  issued_option?: TextDateTransfer;
  page?: number;
  limit?: number;
}
export type InventoryAdjustmentResponse = {
  id: number;
  store_id: number;
  location_id: number;
  inventory_item_id: number;
  changes: InventoryAdjustmentChangeResponse[];
  reference_document_type: string | null;
  reference_document_name: string | null;
  reference_document_url: string;
  reference_document_id: number | null;
  reference_document_line_id: number | null;
  created_at: string;
  issued_at: string | null;
  actor_id: number | null;
  actor_name: string | null;
  cost_type: string | null;
};

export type InventoryAdjustmentChangeResponse = {
  delta_value: number;
  value_after_change: number | null;
  change_type: string;
  reason: string;
};

export type InventoryResponse = {
  image?: VariantImageExt | null;
  name?: string | null;
  title: string | null;
  sku: string | null;
  barcode: string | null;
  price: number | null;
  on_hand: number | null;
  available: number | null;
  committed: number | null;
  incoming: number | null;
  cost_price: number | null;
  variant_id: number;
  product_id: number | null;
  location_id: number | null;
  inventory_item_id: number | null;
};

export interface InventoryResponseWithProductType extends InventoryResponse {
  isProductDefault?: boolean;
  unit?: string | null;
}
export interface TransactionByInventoryIndexFilter {
  inventory_item_id?: number;
  location_id?: number;
  inventory_field?: "committed" | "incoming";
  page?: number;
  limit?: number;
}

export type TransactionByInventoryIndexResponse = {
  quantity: number;
  reference_document_id: number;
  reference_document_name: string;
  reference_document_url: string;
};
export type InventoryLevelsDeleteRequest = {
  inventory_item_id: number;
  location_ids: number[];
};

export type InventoryLevelUpdateRequest = {
  location_id: number;
  inventory_item_id: number;
  on_hand: number;
  available?: number;
  reason: string;
};

export type InventoryLevelBulkSetRequest = {
  inventory_level_bulk_items: Omit<InventoryLevelUpdateRequest, "reason">[];
  reason: string;
};

export type InventoryLevelMultiConnectRequest = {
  location_ids: number[];
  inventory_item_id: number;
};

export type InventoryItemResponse = {
  id: number;
  store_id: number;
  location_id: number;
  product_id: number;
  variant_id: number;
  sku: string | null;
  barcode: string | null;
  available: number;
  tracked: boolean;
  committed: number;
  incoming: number;
  cost_price: number | null;
  created_at: string;
  updated_at: string | null;
};
export type InventoryLevelResponse = {
  id: number;
  store_id: number;
  location_id: number;
  product_id: number;
  inventory_item_id: number;
  variant_id: number;
  available: number;
  on_hand: number;
  committed: number;
  incoming: number;
  created_at: string;
  updated_at: string | null;
};

export type InventoryItemFilter = {
  product_ids?: number[];
  ids?: number[];
  variant_ids?: string;
} & PaginationFilter;
