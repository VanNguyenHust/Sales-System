import { MetafieldRequest } from "./metafield";

export type Customer = {
  id: number;
  state: "enabled" | "invited" | "disabled";
  email?: string;
  verified_email: boolean;
  phone?: string;
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  accepts_marketing: boolean;
  orders_count: number;
  total_spent: number;
  last_order_id?: number;
  last_order_name?: string;
  tags?: string;
  note?: string;
  created_on: string;
  modified_on: string;
  addresses: CustomerAddress[];
  default_address?: CustomerAddress;
};

export interface CreateCustomerRequest {
  code?: string;
  email?: string | null;
  phone?: string | null;
  tax_number?: string;
  group_id?: string;
  website?: string;
  assignee_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  accepts_marketing?: boolean;
  tags?: string[];
  note?: string;
  address?: MailingAddress;
}

export interface MailingAddress {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  company?: string | null;
  country?: string | null;
  country_code?: string | null;
  province?: string | null;
  province_code?: string | null;
  district?: string | null;
  district_code?: string | null;
  ward?: string | null;
  ward_code?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  zip?: string | null;
  name?: string;
  id?: number;
}

export interface CustomerAddress extends MailingAddress {
  id: number;
  default: boolean;
}

type CustomerSortKey = "relevance" | "id" | "created_on";

export interface CustomerFilterRequest {
  query?: string;
  page?: number;
  limit?: number;
  sort_key?: CustomerSortKey;
  reverse?: boolean;
  ids?: string;
  customer_group_id?: number;
}

export interface CustomerOrderFilterRequest {
  page?: number;
  limit?: number;
}

export interface CustomerTagFilterRequest {
  query?: string;
  sort?: "alphabetically" | "popularity";
  page?: number;
  limit?: number;
}

export interface CustomerBulkRequest {
  operation: "add_tag" | "delete_tag" | "delete_customer";
  ids: number[];
  tags?: string[];
}

export type CustomerExportRequest =
  | { type: "all"; download_link_pattern: string; receiver_email: string }
  | { type: "ids"; ids: number[]; download_link_pattern: string; receiver_email: string }
  | { type: "filter"; filter: CustomerExportFilterRequest; download_link_pattern: string; receiver_email: string };

export interface CustomerImportRequest {
  origin_key: string;
  receiver_email: string;
  override_exists?: boolean;
}

interface CustomerExportFilterRequest {
  query?: string;
  sort_key?: CustomerSortKey;
  reverse?: boolean;
  customer_group_id?: number;
}

export interface CustomerUpdateRequest {
  email?: string | null;
  phone?: string | null;
  first_name?: string;
  last_name?: string;
  password?: string;
  password_confirmation?: string;
  gender?: string;
  dob?: string;
  accepts_marketing?: boolean;
  tags?: string;
  note?: string;
  metafields?: MetafieldRequest[];
}

export interface CustomerCreateRequest {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  password_confirmation?: string;
  gender?: string;
  dob?: string;
  accepts_marketing?: boolean;
  tags?: string;
  note?: string;
  addresses?: CustomerAddressRequest[];
  metafields?: MetafieldRequest[];
}

export interface CustomerAddressRequest {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  province?: string;
  district?: string;
  ward?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  zip?: string;
}

export interface CustomerInviteRequest {
  from: string;
  to: string;
}

export interface CustomerSendResetPasswordRequest {
  from: string;
  to: string;
}

export interface CustomerResponse {
  customer: Customer;
}

export interface CustomersResponse {
  customers: Customer[];
}

export interface CustomerTagsResponse {
  tags: string[];
}

export interface CustomerAddressResponse {
  address: CustomerAddress;
}
