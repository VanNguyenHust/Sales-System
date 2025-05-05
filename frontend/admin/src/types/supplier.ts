import { User } from "app/types/user";

export type SupplierRequest = {
  id?: number;
  code?: string;
  name?: string;
  phone?: string;
  email?: string;
  fax?: string;
  tax_number?: string;
  description?: string;
  website?: string;
  assignee_id?: number;
  tags?: string[];
  country?: string;
  province?: string;
  district?: string;
  ward?: string;
  address1?: string;
  address2?: string;
  zipCode?: string;
  default_payment_method_id?: number;
  status?: "active" | "inactive";
};

export type Supplier = {
  id: number;
  code?: string;
  name: string;
  phone?: string;
  email?: string;
  fax?: string;
  tax_number?: string;
  description?: string;
  website?: string;
  assignee_id?: number;
  tags?: string[];
  status: "active" | "deleted" | "inactive";
  country?: string;
  province?: string;
  district?: string;
  ward?: string;
  address1?: string;
  address2?: string;
  zip_code?: string;
  default_payment_method_id?: number;
  created_on: string;
  updated_on: string;
  assignee: User | undefined;
};

export type SupplierFilter = {
  query?: string;
  assignee_ids?: number[];
  tags?: string[];
  ids?: number[];
  created_on_min?: string;
  created_on_max?: string;
  default_payment_method_ids?: number[];
  statuses?: string;
  page?: number;
  limit?: number;
};

export type SupplierList = {
  suppliers: Supplier[];
};

export type SupplierResponse = {
  supplier: Supplier;
};

export interface SupplierTagFilter {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
}

export interface SupplierTagsResponse {
  tags: string[];
}

export type SupplierDetail = {
  count_receive?: number;
  sum_receive?: number;
  count_pending_receive?: number;
  sum_pending_receive?: number;
  count_return?: number;
  sum_return?: number;
  count_pending_return?: number;
  sum_pending_return?: number;
};

export type SupplierHistoryResponse = {
  object_id: number;
  type: string;
  code: string;
  created_on: string;
  total: number;
  status: string;
  transaction_status: string;
  currency: string;
  currency_decimal_digits: number;
};

export type SupplierDetailFilter = {
  supplier_id: number;
  created_on_min: string;
  created_on_max: string;
};

export type SupplierHistoryFilter = {
  supplier_id: number;
  created_on_min: string;
  created_on_max: string;
  page?: number;
  limit?: number;
};

export type SupplierHistoryList = {
  supplier_histories: SupplierHistoryResponse[];
};

export type SupplierDetailResponse = {
  supplier_detail: SupplierDetail;
};
