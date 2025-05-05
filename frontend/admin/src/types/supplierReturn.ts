export const SupplierReturnStatus = {
  RETURNED: "returned",
  getName(name: string) {
    switch (name) {
      case this.RETURNED:
        return "Đã hoàn trả";
      default:
        return "";
    }
  },
};

export const SupplierReturnRefundStatus = {
  PENDING: "pending",
  REFUNDED: "refunded",
  getName(name: string) {
    switch (name) {
      case this.PENDING:
        return "Chưa nhận hoàn tiền";
      case this.REFUNDED:
        return "Đã nhận hoàn tiền";
      default:
        return "";
    }
  },
};

// region supplier return create
export interface SupplierReturnLineItemRequest {
  receive_inventory_line_item_id: number;
  return_quantity: number;
}

export interface TransactionSupplierReturnRequest {
  reference?: string;
  payment_method_id: number;
  payment_method_name: string;
  processed_on: Date;
}
export interface SupplierReturnRequest {
  id?: number;
  receive_inventory_id: number;
  code?: string;
  line_items: SupplierReturnLineItemRequest[];
  deduction_amount?: number;
  deduction_reason?: string;
  return_reason?: string;
  transactions?: TransactionSupplierReturnRequest[];
  tags?: string[];
}

export interface SupplierReturnUpdateRequest {
  return_reason?: string;
  tags?: string[];
}

export type SupplierReturn = {
  id: number;
  store_id: number;
  code: string;
  receive_inventory_id: number;
  receive_inventory_code: string;
  supplier_id: number;
  location_id: number;
  account_id: number;
  line_items: SupplierReturnLineItem[];
  status: string;
  refund_status: string;
  return_reason: string;
  tax_included: boolean;
  subtotal: number;
  total_landed_costs: number;
  deduction_amount: number;
  deduction_reason: string;
  total_tax: number;
  discrepancy_price: number;
  total_refund: number;
  transactions: SupplierReturnTransaction[];
  tags: string[];
  created_on: string;
  currency: string;
  supplier?: {
    name: string;
  };
};

export type SupplierReturnLineItem = {
  id: number;
  receive_inventory_line_item_id: number;
  product_id: number;
  variant_id: number;
  inventory_item_id: number;
  name: string;
  title: string;
  variant_title: string;
  unit: string;
  ratio: number;
  sku: string;
  barcode: string;
  original_line_item_price: number;
  returned_quantity: number;
  applied_discount: number;
  discount_allocation: number;
  line_amount: number;
  tax: number;
  price: number;
  return_price: number;
  landed_cost_allocation: number;
};

export type SupplierReturnTransaction = {
  id: number;
  account_id: number;
  reference: string;
  amount: number;
  payment_method_id: number;
  payment_method_name: string;
  status: string;
  created_on: string;
  processed_on: string;
};

export type SupplierReturnsResponse = {
  supplier_returns: SupplierReturn[];
};

export type SupplierReturnResponse = {
  supplier_return: SupplierReturn;
};
