import { TextDateTransfer } from "app/components/DateTimeField";

import { DateRangeValue } from "./common";
import { Location } from "./location";
import { ExportColumGroup } from "./receive-inventory";
import { Supplier } from "./supplier";
import { User } from "./user";

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
};

export type PurchaseOrderRequest = {
  id?: number;
  code?: string;
  location_id?: number;
  supplier_id?: number;
  assignee_account_id?: number;
  note?: string | null;
  status?: string;
  line_items?: LineItemRequest[];
  discount_value?: number | null;
  discount_type?: string | null;
  tax_included?: boolean;
  tags?: string[] | null;
  due_on?: string | null;
  reference?: string | null;
};
type PurchaseOrderLineItem = {
  id: number;
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  name: string | null;
  variant_title: string | null;
  quantity: number;
  received_quantity: number;
  rejected_quantity: number;
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
};

export const PurchaseOrderStatus = {
  DRAFT: "draft",
  PENDING: "pending",
  PARTIALLY: "partially",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  getName(name: string) {
    switch (name) {
      case this.DRAFT:
        return "Đơn nháp";
      case this.PENDING:
        return "Chờ nhập";
      case this.PARTIALLY:
        return "Nhập một phần";
      case this.COMPLETED:
        return "Nhập toàn bộ";
      case this.CANCELLED:
        return "Đã hủy";
      default:
        return "";
    }
  },
};

export type PurchaseOrderExportType = "all" | "page" | "ids" | "filter";
export type PurchaseOrderExportMode = "overview" | "detail" | "custom";
export type PurchaseOrderExportRequest = {
  type: PurchaseOrderExportType;
  mode: PurchaseOrderExportMode;
  filter?: any;
  fields?: string[];
  receiver_email?: string;
  columnGroups?: ExportColumGroup[];
};

export type PurchaseOrderImportRequest = {
  location_id: number;
  supplier_id: number;
  receiver_email?: string;
  size: number;
  file_data: any;
  file_name: string;
};

export type PurchaseOrderFilter = {
  query?: string;
  createdOnMin?: string;
  createdOnMax?: string;
  createdOnPredefined?: TextDateTransfer;
  createdOn?: DateRangeValue;

  supplierIds?: string[];
  dueOnMin?: string;
  dueOnMax?: string;
  dueOnPredefined?: TextDateTransfer;
  dueOn?: DateRangeValue;

  completedOnMin?: string;
  completedOnMax?: string;
  completedOnPredefined?: TextDateTransfer;
  completedOn?: DateRangeValue;

  cancelledOnMin?: string;
  cancelledOnMax?: string;
  cancelledOnPredefined?: TextDateTransfer;
  cancelledOn?: DateRangeValue;

  variantIds?: string[];
  tags?: string[];
  createdAccountIds?: string[];
  cancelledAccountIds?: string[];
  assigneeIds?: string[];
  locationIds?: string[];
  receiptStatuses?: string[];
  statuses?: string[];
  page?: number;
  limit?: number;
  savedSearchId?: number;
};

export type PurchaseOrder = {
  id: number;
  code: string;
  supplier_id: number;
  location_id: number;
  create_account_id: number;
  create_account_name: string;
  assignee_account_id: number | null;
  assignee_account_name: string | null;
  cancel_account_id: number | null;
  cancel_account_name: string | null;
  created_on: string;
  updated_on: string | null;
  due_on: string | null;
  tags: string[];
  line_items: PurchaseOrderLineItem[];
  status: string;
  discount_value: number | null;
  discount_type: "value" | "percent" | null;
  tax_included: boolean;
  total_quantity: number;
  total_line_amount: number;
  total_tax: number;
  total_price: number;
  total_discounts: number;
  note: string | null;
  reference: string | null;
  app_id?: number;
  currency: string;
  currency_decimal_digits: number;
  supplier: Supplier | null;
};

export type PurchaseOrderData = PurchaseOrder & {
  location?: Location;
  created_account?: User;
  assignee?: User;
};

export type PurchaseOrderTransactionRequest = {
  reference?: string;
  amount: number;
  payment_method_id: number;
  payment_method_name: string;
  processed_on?: string;
  id?: number;
};

export type PurchaseOrderResponse = {
  purchase_order: PurchaseOrder;
};

export type PurchaseOrdersResponse = {
  purchase_orders: PurchaseOrder[];
};

export type PurchaseOrderTagFilterRequest = {
  limit?: number;
  page?: number;
  query?: string;
  sort?: string;
};
