export const PACKSIZE_LIMIT_QUANTITY = 999_999_999;

export type PacksizeItemResponse = {
  id: number;
  name: string;
  sellable: boolean;
  ratio: number;
  created_on: string;
  modified_on: string | null;
  sku: string;
  barcode: string;
  price: number;
};

export type PacksizeResponse = {
  id: number;
  packsize_product_id: number;
  packsize_variant_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  created_on: string;
  modified_on?: string;
  total_available: number;
};

export type PacksizeListResponse = {
  packsizes: PacksizeResponse[];
};

export type PacksizeRequest = {
  packsize_variant_id: number;
  variant_id: number;
  quantity: number;
  price?: number;
};

export type CombinePacksizeRequest = {
  quantity: number;
  price?: number;
  sku?: string;
  barcode?: string;
  unit: string;
};

export type PacksizeFilterRequest = {
  packsize_variant_ids?: string;
  packsize_product_ids?: string;
  variant_ids?: string;
  product_id?: number;
  variant_id?: number;
  limit?: number;
};

export type ComboFilterRequest = {
  page?: number;
  limit?: number;
  variant_ids?: string;
  combo_item_variant_ids?: string;
};
