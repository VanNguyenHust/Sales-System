import { FileImageRequest } from "app/components/DragDropImages";
import { DocumentType, VoucherInternalType, VoucherKind } from "app/features/cash-book/constants";

import { PaginationFilter } from "./common";

export type ReasonApplicableObject = {
  value: string;
};

export type Reason = {
  id: number;
  store_id: number;
  code: string;
  name: string;
  applicable_objects: ReasonApplicableObject[];
  type: string;
  init: boolean;
  expense_code: string;
  is_counted: boolean;
};

export interface ReasonRequest {
  id?: number;
  type?: string;
  name: string;
  expense_code?: string;
  is_counted?: boolean;
}

export interface ReasonResponse {
  reason: Reason;
}

export interface ReasonsResponse {
  reasons: Reason[];
}

export type ReasonFilterRequest = PaginationFilter & {
  type?: string;
  query?: string;
};

export interface VoucherId {
  id: number;
  store_id: number;
}

export interface ImagePhysicalInfo {
  size: number;
  width: number;
  height: number;
}

export type VoucherDocumentRoot = {
  id?: number;
  document_id?: number;
  code?: string;
  type?: DocumentType;
  amount?: number;
  success?: boolean;
  reference?: string;
  reference_id?: number;
  reference_code?: string;
};

export interface VoucherLocation {
  location_id: number;
  location_name?: string;
}

export interface VoucherObject {
  object_id: number;
  object_code?: string;
  object_name: string;
  object_type: string;
}

export interface VoucherReason {
  reason_id: number;
  reason_name: string;
}

export type Voucher = {
  id: number;
  store_id: number;
  code: string;
  object: VoucherObject;
  reason: VoucherReason;
  location: VoucherLocation;
  voucher_date: Date;
  kind: VoucherKind;
  receipt_from_journal_id: number;
  receipt_from_journal: Journal;
  receipt_from_location_id: number;
  receipt_from_location_name: string;
  memo: string;
  reference: string;
  gateway: string;
  journal_id: number;
  journal: Journal;
  origin_amount: number;
  origin_currency: string;
  expense_code: string;
  images: FileImageRequest[];
  document_root_codes: string;
  document_roots: VoucherDocumentRoot[];
  created_on: Date;
  created_by: string;
  modified_on: Date;
  modified_by: string;
  is_counted: boolean;
  source_name: string;
  is_auto: boolean;
};

export interface VoucherCreateRequest {
  journal_id?: number;
  kind?: string;
  object_type?: string;
  object_id?: number;
  object_code?: string;
  object_name?: string;
  reason_id?: number;
  reason_name?: string;
  origin_amount?: number;
  origin_currency?: string;
  memo?: string;
  is_counted?: boolean;
  location_id?: number;
  voucher_date?: Date;
  code?: string;
  reference?: string;
  gateway_id?: number;
  gateway?: string;
  expense_code?: string;
  source_name?: string;
  document_root_ids?: number[];
  order_payment_priority?: string;
}

export interface VoucherUpdateRequest {
  journal_id?: number;
  memo?: string;
  reference?: string;
  gateway_id?: number;
  gateway?: string;
  image_remove_ids?: number[];
  location_id?: number;
  voucher_date?: Date;
}

export interface VoucherResponse {
  voucher: Voucher;
}

export interface VouchersResponse {
  vouchers: Voucher[];
}

export type VoucherFilterRequest = PaginationFilter & {
  query?: string;
  sort_by?: string;
  origin_currency?: string;
};

export type VoucherBulkDeleteRequest = {
  operation: "delete";
  ids: number[];
};

export type VoucherSummaryResponse = {
  opening_balance: number;
  total_receipt: number;
  total_payment: number;
  closing_balance: number;
  total_bank_journal: number;
  total_cash_journal: number;
};

export type VoucherDetailPaginationResponse = {
  next_id?: number;
  preview_id?: number;
};

export interface JournalBank {
  bank_id: number;
  bank_code: string;
  bank_name: string;
  account_name: string;
  account_number: string;
}

export interface Journal {
  id: number;
  store_id: number;
  currency: string;
  journal_bank: JournalBank;
  opening_date: Date;
  type: string;
  created_by: string;
  created_on: Date;
  modified_by: string;
  modified_on: Date;
}

export interface JournalResponse {
  journal: Journal;
}

export interface JournalsResponse {
  journals: Journal[];
}

export interface JournalRequest {
  currency?: string;
  type?: string;
  beneficiary_account_id?: number;
}

export interface VoucherUpdateJournalRequest {
  voucher_id?: number;
  type?: string;
  journal_id?: number;
  ids?: number[];
}

export interface OptionFilterModel {
  id?: number;
  code?: string;
  name?: string;
  type?: string;
}

export type VoucherOptionParams = PaginationFilter & {
  filter_type: string;
  query?: string;
  ids?: string;
  origin_currency?: string;
};

export interface VoucherOptionResponse {
  size: number;
  page: number;
  filters: OptionFilterModel[];
}

export interface VoucherPrintResponse {
  content: string;
}

export interface VoucherInternalCreateModel {
  receipt_type_from?: VoucherInternalType;
  receipt_type_to?: VoucherInternalType;
  receipt_location_from?: number;
  receipt_journal_from?: number;
  receipt_location_to?: number;
  receipt_journal_to?: number;
  origin_currency?: string;
  origin_amount?: number;
  memo?: string;
  voucher_date?: Date;
  code?: string;
  reference?: string;
}

export interface VoucherInternalCreateRequest {
  receipt_from?: VoucherInternalObject;
  receipt_to?: VoucherInternalObject;
  origin_currency?: string;
  origin_amount?: number;
  memo?: string;
  voucher_date?: Date;
  code?: string;
  reference?: string;
}

export interface VoucherInternalObject {
  type?: VoucherInternalType;
  location_id?: number;
  journal_id?: number;
}

export type VoucherDocumentRootFilterRequest = PaginationFilter & {
  ids?: string[];
  query?: string;
  type?: DocumentType;
  location_ids?: number[];
  processed_at_min?: string;
  processed_at_max?: string;
  is_success?: boolean;
  payment_method_id?: string;
  gateway?: string;
};

export type JournalFilterRequest = PaginationFilter & {
  ids?: number[];
  currency?: string;
  type?: string;
  query?: string;
};
