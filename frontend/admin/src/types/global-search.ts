import { Order } from "./order";
import { Product } from "./product";

export enum GlobalSearchType {
  Order = "order",
  Product = "product",
  Customer = "customer",
}

export type GlobalSearchRequest = {
  q?: string;
  limit?: number;
  cursor?: string;
  filters?: GlobalSearchType[];
};

export type GlobalSearchResponse = {
  result: {
    pagination: {
      total_count: number;
      has_next_page: boolean;
      end_cursor?: string;
    };
    items: GlobalSearchItemResult[];
  };
};

export type CustomerSearchResult = {
  type: GlobalSearchType.Customer;
  id: number;
  data: {
    id: number;
    name?: string;
    email?: string;
  };
};

export type ProductSearchResult = {
  type: GlobalSearchType.Product;
  id: number;
  data: Pick<Product, "id" | "name" | "vendor" | "image">;
};

export type OrderSearchResult = {
  type: GlobalSearchType.Order;
  id: number;
  data: Pick<Order, "id" | "name" | "created_on">;
};

export type GlobalSearchItemResult = CustomerSearchResult | ProductSearchResult | OrderSearchResult;
