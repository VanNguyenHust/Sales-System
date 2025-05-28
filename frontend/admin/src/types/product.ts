import { PaginationFilter } from "./common";
import { MetafieldDefinitionType } from "./metafield";

export type ProductsResponse = {
  products: ProductResponse[];
  count: number;
};

export type ProductResponse = {
  id: number;
  storeId: number;
  name: string;
  alias: string;
  content: string;
  summary: string;
  unit: string;
  tags: string[];
  isPublished: boolean;
  publishedOn: string;
  createdOn: string;
  modifiedOn: string;
  inventories: InventoryInfoResponse[];
  images: ProductImageResponse[];
  pricingInfo: PricingInfoResponse;
};

export type InventoryInfoResponse = {
  id: number;
  storeId: number;
  productId: number;
  locationId: number;
  quantity: number;
  saleAvailable: number;
};

export type PricingInfoResponse = {
  price: number;
  compareAtPrice: number;
  costPrice: number;
};

export type ProductImageResponse = {
  id: number;
  productId: number;
  src: string;
  fileName: string;
  alt: string;
};

export interface ProductFilterRequest extends PaginationFilter {
  query?: string;
}

export type ProductRequest = {
  name: string;
  content: string;
  summary: string;
  unit: string;
  tags: string[];
  inventories: InventoryInfoRequest[];
  images: ProductImageRequest[];
  metafields: MetafieldRequest[];
  pricingInfo: PricingInfoRequest;
  isPublished: boolean;
  publishedOn: string;
};

export type InventoryInfoRequest = {
  storeId: number;
  productId: number;
  locationId: number;
  quantity: number;
  quantityInOrder: number;
  saleAvailable: number;
};

export type PricingInfoRequest = {
  price: number;
  compareAtPrice: number;
  costPrice: number;
};

export type MetafieldRequest = {
  id: number;
  key: string;
  namespace: string;
  value: string;
  valueType: MetafieldDefinitionType;
};

export type ProductImageRequest = {
  id: number;
  src: string;
  fileName: string;
  alt: string;
};
