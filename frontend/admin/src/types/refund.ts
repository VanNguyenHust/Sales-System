import { OrderLineItem } from "./order";
import { Transactions } from "./transactions";

export interface Refund {
  id?: number;
  note?: string;
  notify?: boolean;
  refund_line_items: LineItemRefund[];
  shipping?: {
    full_refund?: boolean;
    amount?: number;
  };
  refund_value?: number;
}

export enum RestockType {
  NO_RESTOCK = "no_restock",
  CANCEL = "cancel",
  RETURN = "return",
}

export interface CalculateRefundRequest {
  order_id: number;
  refund_line_items?: LineItemRefund[];
  shipping?: {
    full_refund?: boolean;
    amount?: number;
  };
  refund_value?: number;
}

export interface LineItemRefund {
  line_item_id?: number;
  quantity: number;
  restock_type?: "no_restock" | "cancel" | "return";
  location_id?: number;
  removal?: boolean;
}

export interface CalculateRefund extends CalculateRefundRequest {
  outstanding_adjustment_amount: number;
  refund_line_items?: LineItemCalculate[];
  refund_value?: number;

  shipping?: {
    full_refund?: boolean;
    amount?: number;
    tax?: number;
    maximum_refundable?: number;
  };

  transactions?: TransactionRefund[];
}

export interface TransactionRefund {
  order_id: number;
  parent_id: number;
  kind: string;
  amount: number;
  maximum_refundable: number;
  gateway: string;
}

export interface LineItemCalculate extends LineItemRefund {
  discounted_price: number;
  discounted_total_price: number;
  maximum_refundable_quantity: number;
  original_price: number;
  price: number;
  subtotal: number;
  discounted_subtotal: number;
  total_cart_discount_amount: number;
  total_tax: number;
}

export interface RefundModal {
  id?: number;
  user_id?: number;
  order_id?: number;
  note?: string;
  order_adjustments?: any[];
  refund_line_items?: RefundLineItem[];
  restock?: string;
  total_refunded?: number;
  transactions?: Transactions[];
  processed_on?: Date;
  updated_on?: Date;
  created_on?: Date;
  unpaid_deduction?: number;
}

export interface RefundLineItem {
  id?: number;
  line_item_id?: number;
  location_id?: number;
  price?: number;
  quantity: number;
  restock_type?: "cancel" | "no_restock" | "return";
  subtotal: number;
  total_tax?: number;
  removal?: boolean;
  name?: string;
  line_item: OrderLineItem;
}

export interface RefundRespone extends RefundModal {
  id: number;
  refund_line_items: RefundLineItem[];
  order_adjustments: OrderAdjustment[];
  maximum_refundable: number;
  restockable: boolean;
}

export interface RefundCalculate {
  cancel: {
    refund_full_amount: boolean;
    refund_shipping: boolean;
  };
}

export interface OrderAdjustment {
  id: number;
  order_id: number;
  refund_id: number;
  kind: string;
  reason: string;
  amount: number;
  tax_amount: number;
}
