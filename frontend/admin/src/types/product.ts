import {
  CollectionResponse,
  InventoryLevelResponse,
  InventoryManagement,
  InventoryPolicy,
  InventoryQuantityRequest,
  MetafieldRequest,
  PaginationFilter,
  ProductVariantRequest,
  VariantContextualPricing,
  VariantImageExt,
  VariantResponse,
  VariantResponseExt,
  VariantResponseInQuery,
} from "app/types";

export type CreateProductState = {
  bulkEditVariantSelectedField: string[];
  variantFilter: CreateVariantFilter;
  hasChangeFields: { [key: string]: boolean };
};

export type ProductResponse = {
  id: number;
  name: string;
  alias: string;
  vendor: string | null;
  product_type: string | null;
  meta_title: string | null;
  meta_description: string | null;
  summary: string | null;
  published_on: string | null;
  template_layout: string | null;
  created_on: string | null;
  modified_on: string | null;
  content: string | null;
  tags: string | null;
  status: string;
  collections: number[] | null;
  images: ProductImageResponse[] | null;
  image: ProductImageResponse | null;
  variants: VariantResponse[];
  options: ProductOptionResponse[] | null;
  type: string | null;
};

export type ProductImageResponse = {
  id: number;
  product_id: number;
  position: number;
  variant_ids?: number[];
  created_on: string;
  modified_on?: string;
  src: string;
  alt?: string;
  filename?: string;
  size: number;
  width?: number;
  height?: number;
};

export type ProductOptionResponse = {
  id: number;
  name: string;
  position: number;
  created_on: string;
  modified_on: string | null;
  values: string[];
};

export interface ProductFilter extends PaginationFilter {
  query?: string;
  product_types?: string[];
  vendors?: string[];
  tags?: string[];
  ids?: number[];
  alias?: string;
  collection_id?: number;
  collection_ids?: number[];
  created_on_min?: string;
  created_on_max?: string;
  published?: boolean;
  sort_by?: string;
  available?: boolean;
  status?: string;
  statuses?: string[];
  publication_ids_included?: number[];
  publication_ids_excluded?: number[];
  save_search_id?: string;
  types?: string[];
  metafields?: string[];
  context_price_location_id?: number;
  context_price_customer_group_id?: number;
  context_price_client_id?: string;
}

export type ProductFilterRequest = {
  query?: string;
  product_type?: string;
  vendor?: string;
  tag_aliases?: string;
  tags?: string;
  ids?: string;
  since_id?: number;
  alias?: string;
  collection_id?: number;
  created_on_min?: string;
  created_on_max?: string;
  modified_on_min?: string;
  modified_on_max?: string;
  published_on_min?: string;
  published_on_max?: string;
  published?: string;
  sort_by?: string;
  available?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  /**
   * @deprecated
   */
  sort?: string;
};

export type ProductRequest = {
  id?: number;
  name: string;
  id_update?: number;
  alias?: string;
  vendor?: string;
  product_type?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  summary?: string;
  published_on?: string | null;
  template_layout?: string;
  content?: string;
  tags?: string;
  images?: ProductImageRequest[];
  variants?: ProductVariantRequest[];
  options?: ProductOptionRequest[];
  metafields?: MetafieldRequest[];
  status?: string;
  default_variant_unit?: string;
  type?: string;
};
export interface Variant {
  id: number;
  inventory_item_id?: number;
  barcode?: string;
  sku?: string;
  price?: number;
  compare_at_price?: number;
  option1?: string;
  option2?: string;
  option3?: string;
  taxable?: boolean;
  inventory_management?: string;
  inventory_policy?: InventoryPolicy;
  inventory_quantity?: number;
  requires_shipping?: true;
  weight?: number;
  weight_unit?: "g" | "kg";
  image_id?: number;
  position?: number;
  created_on?: Date;
  modified_on?: Date;
  title?: string;
  grams?: number;
  product_id?: number;
  product?: Product;
  inventoryLevel?: InventoryLevelResponse;
  product_name: string;
  product_image?: string;
  variant_image?: string;
  image?: Image;
  type?: VariantUnionType;
  unit?: string;
  contextual_pricing?: VariantContextualPricing;
}

export type VariantUnionType = "normal" | "combo" | "packsize";

export interface Product {
  id: number;
  name: string;
  alias: string;
  vendor?: string;
  product_type?: string;
  meta_title?: string;
  meta_description?: string;
  summary?: string;
  published_on?: string | null;
  template_layout?: string;
  content?: string;
  created_on?: Date;
  modified_on?: Date;
  tags?: string;
  status?: string;
  images?: Image[];
  image?: Image;
  type?: string;
  variants?: Variant[];
  options?: Option[];
}

export type ProductImageRequest = {
  id?: number;
  base64?: string;
  src?: string;
  file?: File;
  filename?: string;
  alt?: string;
  variant_ids?: number[];
  position?: number;
};

export type UpdateProductImageRequest = {
  alt?: string;
  position?: number;
  variant_ids?: number[];
  imageurl?: string;
  imagebase64?: string;
  send_webhooks?: boolean;
};

export type ProductOptionRequest = {
  id?: number;
  //Max=255
  name: string;
  values: string[];
};

export interface CombineProductRequest extends ProductRequest {
  sale_channels: PublishSaleChannelRequest[];
  sale_price?: number;
  compare_price?: number | null;
  cost_price?: number;
  taxable: boolean;
  collections?: CollectionResponse[];
  sku?: string;
  barcode?: string;
  inventory_policy?: InventoryPolicy;
  inventory_management?: InventoryManagement;
  requires_shipping?: boolean;
  inventory_quantities?: InventoryQuantityRequest[];
  isMultipleVariant?: boolean;
  weight?: number;
  weight_unit: string;
  isUpdate?: boolean;
  allowShowProductField?: boolean;
  //Xóa mấy line default này sẽ làm lỗi getUpdateMetafield() nhé
  default_alias?: string;
  default_meta_title?: string;
  default_meta_description?: string;
  redirectTo301?: boolean;
  currencyUnit?: string;
  isCreate?: boolean;
  defaultActiveSaleChannels?: PublishSaleChannelRequest[];
  inventoryHasChanged?: boolean;
  combo?: ComboRequest;
  isCombo?: boolean;
  dataIsReady?: boolean;
  dataMetafieldsVariantIsReady?: boolean;
  primaryVariant?: ProductVariantRequest | null;
  productRequestId?: string;

  //Chỉ hoạt động ở màn tạo
  catalog_publication_ids?: number[];
}

export type PublishSaleChannelRequest = { id: number; publishOn?: string; client_id?: string };

export type SimpleVariantOption = {
  name: string;
  sku?: string;
  opt1: string;
  opt2?: string;
  opt3?: string;
};

export type CreateVariantFilter = {
  option1?: string[];
  option2?: string[];
  option3?: string[];
  locations: string[];
};

export type ProductDetailPaginationResponse = {
  next_id?: number;
  preview_id?: number;
};

export type CombineBulkEditProductRequest = Omit<CombineProductRequest, "sale_channels" | "taxable" | "weight_unit">;

export type CombineBulkEditRequest = {
  products: CombineBulkEditProductRequest[];
  fields: string[];
  isReady?: boolean;
};

export type ResourceBulkPublicationRequest = {
  publication_ids: number[];
  resource_ids: number[];
  resource_type: "product" | "collection";
  operation?: string;
};

export type BulkActionResultResponse = {
  message: string;
};

export type ProductBulkRequest = {
  operation:
    | "add_to_catalog"
    | "remove_from_catalog"
    | "add_tag"
    | "remove_tag"
    | "add_to_collection"
    | "remove_from_collection"
    | "add_to_publication"
    | "remove_from_publication";
  target_selection: "filter" | "ids";
  ids?: number[];
  tags?: string[];
  collection_ids?: number[];
  catalog_ids?: number[];
  publication_ids?: number[];
  filter?: ProductFilter;
};

export type ProductBulkDeleteRequest = {
  target_selection: "filter" | "ids";
  ids?: number[];
  filter?: ProductFilter;
};

export type ImportProductRequest = {
  key: string;
  receiver_email?: string | null;
  user_id: number;
  override_exist_products: boolean;
  publish_on_sale_channel: boolean;
  override_existed?: boolean;
};

export type ExportProductRequest = {
  export_products_type: string;
  receiver_email?: string | null;
  user_id: number;
  selected_fields: string[];
  location_ids: number[];
  ids?: number[] | null;
  query?: string;
  product_types?: string[] | null;
  vendors?: string[] | null;
  tags?: string[] | null;
  published?: boolean | null;
  collection_ids?: number[] | null;
  page?: number;
  limit?: number;
  created_on_min?: string | null;
  created_on_max?: string | null;
  publication_id_included?: number | null;
  publication_id_excluded?: number | null;
};

export type ComboItemRequest = {
  variant_id: number;
  quantity: number;
  /**Addition field */
  id?: number;
  variant?: VariantResponseInQuery;
  image?: VariantImageExt;
  position?: number;
  product_alias?: string;
};

export type ComboRequest = {
  product_id?: number;
  variant_id: number;
  combo_items: ComboItemRequest[];
  price?: number;
};

export type ComboItemResponse = {
  id: number;
  variant_id: number;
  quantity: number;
  image?: VariantImageExt;
  product_name?: string;
  product_alias?: string;
  position: number;
} & Omit<VariantResponse, "id" | "image" | "product_name">;

export type ComboResponse = {
  variant_id: number;
  product_id: number;
  price: number;
  created_on: string;
  modified_on?: string;
  combo_items: ComboItemResponse[];
};

interface Option {
  id?: number;
  name?: string;
  position?: number;
  created_on?: Date;
  modified_on?: Date;
  values?: string[];
}

export interface Image {
  id?: number;
  product_id?: number;
  position?: number;
  variant_ids?: number[];
  created_on?: Date;
  modified_on?: Date;
  src?: string;
  alt?: string;
  filename?: string;
  size?: number;
  width?: number;
  height?: number;
}

export type ProductWithInventory = Omit<ProductResponse, "variants"> & {
  variants: (ProductResponse["variants"][number] & { cost_price?: number | null })[];
  inventory_levels: InventoryLevelResponse[];
};

export function getVariantName(variant: Variant | VariantResponseExt): string {
  return [variant.product?.name, variant.title].filter((t) => t !== "Default Title").join(" ") || "";
}

export type ExportComboPacksizeProductRequest = {
  export_type: string;
  receiver_email?: string | null;
  user_id: number;
  selected_fields: string[];
  location_ids: number[];
  ids?: number[] | null;
  query?: string;
  product_types?: string[] | null;
  vendors?: string[] | null;
  tags?: string[] | null;
  published?: boolean | null;
  collection_ids?: number[] | null;
  page?: number;
  limit?: number;
  created_on_min?: string | null;
  created_on_max?: string | null;
  publication_id_included?: number | null;
  publication_id_excluded?: number | null;
};
