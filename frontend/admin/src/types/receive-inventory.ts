import { DateRangeValue } from "./common";
import { Location } from "./location";
import { Image } from "./product";
import { Supplier } from "./supplier";
import { User } from "./user";
import { VariantImageExt } from "./variant";

/** @deprecated  will delete*/
export interface TaxLine {
  taxTitle?: string;
  taxRate?: number;
  taxAmount?: number;
}

type LineItemRequest = {
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  variant_name?: string;
  name?: string;
  title?: string | null;
  variant_title?: string | null;
  price: number | null;
  quantity: number;
  rejected_quantity?: number;
  rejection_reason?: string | null;
  unit: string | null;
  ratio?: number;
  sku: string | null;
  barcode: string | null;
  discount_value?: number | null;
  discount_type?: string | null;
  tax_title?: string | null;
  tax_rate?: number | null;
  note?: string | null;
  id?: number;
  purchase_order_line_item_id?: number;
  packsize_variant_id?: number;
};

type LandedCostLineRequest = {
  title: string;
  amount: number;
  id?: number;
};

type TransactionRequest = {
  reference?: string;
  amount: number;
  payment_method_id: number;
  payment_method_name: string;
  processed_on: Date;
  id?: number;
};
export type ReceiveInventoryRequest = {
  id?: number;
  code?: string;
  location_id?: number;
  supplier_id?: number;
  assignee_id?: number;
  note?: string | null;
  receipt_status?: string;
  line_items?: LineItemRequest[];
  combination_line_items?: ReceiveInventoryCombinationLineItemRequest[];
  discount_value?: number | null;
  discount_type?: string | null;
  tax_included?: boolean;
  landed_cost_lines?: LandedCostLineRequest[];
  transactions?: TransactionRequest[];
  tags?: string[] | null;
  due_on?: Date | null;
  total_tax?: number;
  reference?: string | null;
  purchase_order_id?: number;
};

export type ReceiveInventoryCombinationLineItemRequest = {
  id?: number;
  variant_id?: number;
  line_items_index?: number[];
};

export type ReceiveInventoryLineItem = {
  id: number;
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  name: string | null;
  variant_title: string | null;
  quantity: number;
  rejected_quantity?: number;
  unit: string | null;
  ratio: number;
  sku: string | null;
  barcode: string | null;
  discount_value?: number;
  discount_type?: "value" | "percent";
  discount_amount?: number;
  tax_title?: string;
  tax_rate?: number;
  price: number;
  excluded_tax_price: number;
  excluded_tax_line_amount: number;
  distributed_discount_amount: number;
  excluded_tax_distributed_discount_amount: number;
  line_amount_for_tax_calculating: number;
  tax_amount: number;
  total_line_amount_after_tax: number;
  landed_cost_allocation: number;
  note: string | null;
  remaining_quantity: number;
  line_amount: number;
  title?: string;
  rejection_reason?: string;
  components?: ReceiveInventoryComponent[];
};

export type ReceiveInventoryComponent = {
  id?: number;
  image?: VariantImageExt;
  name: string | null;
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  variant_title: string | null;
  quantity: number;
  sku: string | null;
  title?: string;
  unit: string | null;
  price: number;
  discount_value?: number | null;
  discount_type?: "value" | "percent";
  tax_title?: string | null;
  tax_rate?: number | null;
};

export const ReceiveInventoryStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  CLOSED: "closed",
  getName(name: string) {
    switch (name) {
      case this.ACTIVE:
        return "Đang giao dịch";
      case this.COMPLETED:
        return "Hoàn thành";
      case this.CANCELLED:
        return "Đã hủy";
      case this.CLOSED:
        return "Kết thúc";
      default:
        return "";
    }
  },
};

export const ReceiptStatus = {
  PENDING: "pending",
  RECEIVED: "received",
  getName(name: string) {
    switch (name) {
      case this.PENDING:
        return "Chưa nhập";
      case this.RECEIVED:
        return "Đã nhập";
    }
  },
};

export const TransactionStatus = {
  PENDING: "pending",
  PARTIALLY: "partially",
  PAID: "paid",
  getName(name: string) {
    switch (name) {
      case this.PAID:
        return "Đã thanh toán";
      case this.PARTIALLY:
        return "Thanh toán một phần";
      case this.PENDING:
        return "Chưa thanh toán";
      default:
        return "";
    }
  },
};

export const RefundStatus = {
  PARTIALLY: "partially",
  TOTALLY: "totally",
  NULL: null,
  getName(name: string | null) {
    switch (name) {
      case this.PARTIALLY:
        return "Hoàn hàng một phần";
      case this.TOTALLY:
        return "Đã hoàn hàng";
      case this.NULL:
        return "Chưa hoàn hàng";
      default:
        return "";
    }
  },
};

export const ReceiveInventoryRefundStatus = {
  PENDING: "pending",
  REFUNDED: "refunded",
  getName(name: string) {
    switch (name) {
      case this.PENDING:
        return "Chưa nhận hoàn";
      case this.REFUNDED:
        return "Đã nhận hoàn";
      default:
        return "";
    }
  },
};

type ReceiveInventoryTransaction = {
  id: number;
  account_id: number;
  reference: string;
  amount: number;
  payment_method_id: number;
  payment_method_name: string;
  status: "success";
  created_on: string;
  processed_on: string;
};

interface LandedCostLine {
  id: number;
  title: string;
  amount: number;
  created_on: string;
  updated_on: string;
}

export type TaxPurchaseOrderRespone = {
  product_id: number;
  tax_rate: number;
  tax_name: string;
};

export type ExportColumGroup = {
  groupName: string;
  value: string;
  columns: ExportColumn[];
};

export type ExportColumn = {
  label: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
  requiresReadCostPricePerm?: boolean;
};
export type ReceiveInventoryExportType = "all" | "page" | "ids" | "filter";
export type ReceiveInventoryExportMode = "overview" | "detail" | "custom";
export type ReceiveInventoryExportRequest = {
  type: ReceiveInventoryExportType;
  mode: ReceiveInventoryExportMode;
  filter?: any;
  fields?: string[];
  receiver_email?: string;
  columnGroups?: ExportColumGroup[];
};

export type ReceiveInventoryImportRequest = {
  location_id: number;
  supplier_id: number;
  receiver_email?: string;
  size: number;
  file_data: any;
  file_name: string;
};

export type ReceiveInventoryFilter = {
  query?: string;
  createdOnMin?: string;
  createdOnMax?: string;
  createdOn?: DateRangeValue;

  supplierIds?: string[];
  receivedOnMin?: string;
  receivedOnMax?: string;
  receivedOn?: DateRangeValue;

  variantIds?: string[];
  tags?: string[];
  createdAccountIds?: string[];
  assigneeIds?: string[];
  receivedAccountIds?: string[];
  locationIds?: string[];
  receiptStatuses?: string[];
  statuses?: string[];
  transactionStatuses?: string[];
  returnStatuses?: string[];
  notReturnTotally?: boolean;
  page?: number;
  limit?: number;
  savedSearchId?: number;
};

export type ReceiveInventory = {
  id: number;
  code: string;
  supplier_id: number;
  location_id: number;
  created_account_id: number;
  assignee_id: number | null;
  received_account_id: number | null;
  cancelled_account_id: number | null;
  closed_account_id: number | null;
  created_on: string;
  updated_on: string | null;
  received_on: string | null;
  closed_on: string | null;
  cancelled_on: string | null;
  due_on: string | null;
  tags: string[];
  line_items: ReceiveInventoryLineItem[];
  combination_line_items?: CombinationLineItem[];
  status: "active" | "completed" | "cancelled" | "closed";
  receipt_status: "pending" | "received";
  transaction_status: "pending" | "partially" | "paid";
  transactions: ReceiveInventoryTransaction[];
  landed_cost_lines: LandedCostLine[];
  discount_value: number | null;
  discount_type: "value" | "percent" | null;
  tax_included: boolean;
  total_line_amount: number;
  total_discount_receipt: number;
  total_landed_costs: number;
  total_tax: number;
  total_price: number;
  total_line_items_price: number;
  total_discounts: number;
  subtotal_price: number;
  note: string | null;
  reference: string | null;
  return_status: "partially" | "totally" | null;
  currency: string;
  currency_decimal_digits: number;
  supplier: Supplier | null;
  purchase_order_id: number;
  purchase_order_code: string | null;
};

export type ReceiveInventoryData = ReceiveInventory & {
  location?: Location;
  created_account?: User;
  assignee?: User;
  received_account?: User;
};

export type ReceiveInventoryTransactionRequest = {
  reference?: string;
  amount: number;
  payment_method_id: number;
  payment_method_name: string;
  processed_on?: string;
  id?: number;
};

export type ReceiveInventoryResponse = {
  receive_inventory: ReceiveInventory;
};

export type ReceiveInventoriesResponse = {
  receive_inventories: ReceiveInventory[];
};

export type ReceiveInventoryTagFilterRequest = {
  limit?: number;
  page?: number;
  query?: string;
  sort?: string;
};

export type CombinationLineItem = {
  id: number;
  variant_id: number;
  product_id: number;
  image?: Image;
  title?: string;
  variant_title: string | null;
  sku: string | null;
  unit: string | null;
  barcode: string | null;
  name?: string;
  price: number;
  ratio: number;
  inventory_item_id: number;
  line_item_ids: number[];
};

export type CombinationCalculateResponse = {
  variant_id: number;
  product_id: number;
  line_item_indexes: number[];
  ratio: number;
  quantity: number;
  price: number;
  name: string;
  title: string;
  variant_title?: string;
  unit?: string;
  sku?: string;
};

export type LineItemCalculateRequest = {
  id?: number;
  inventory_item_id: number;
  product_id: number;
  variant_id: number;
  variant_title: string | null;
  title?: string;
  unit?: string;
  sku?: string;
  name: string | null;
  quantity: number;
  price: number;
  type: string;
  discount_type?: string;
  discount_value?: number;
};

export type ReceiveInventoryLineItemCalculate = ReceiveInventoryLineItem & {
  image?: VariantImageExt;
};

export type ReceiveInventoryCombinationCalculate = {
  line_items: ReceiveInventoryLineItemCalculate[];
  combination_lines: CombinationCalculateResponse[];
};
export type ReceiveInventoryCombinationCalculateResponse = {
  combination_calculate: ReceiveInventoryCombinationCalculate;
};

export type ReceiveInventoryCombinationCalculateRequest = {
  line_items: LineItemCalculateRequest[];
  currency_number_digits: number;
};
