import { CombinationLine, DiscountApplications, OrderTransactionCreateRequest, ShippingLines } from "app/types/order";
import { Image } from "app/types/product";
import { CalculateRefund, RefundRespone } from "app/types/refund";

import { PaginationFilter } from "./common";
import { Customer } from "./customer";
import { SaveSearch } from "./saveSearch";

//TODO: clean type
type DisposeType = "restocked" | "not_restocked" | "missing";

export interface OrderReturnFilterRequest extends PaginationFilter {
  query?: string;
  sort?: string;
  ids?: string;
  location_ids?: string;
  return_location_ids?: string;
  user_ids?: string;
  customer_ids?: string;
  variant_ids?: string;
  return_reasons?: string;
  statuses?: string;
  restock_statuses?: string;
  refund_statuses?: string;
  created_on_min?: string;
  created_on_max?: string;
  cancelled_on_min?: string;
  cancelled_on_max?: string;
  created_on?: string;
  cancelled_on?: string;
}

export interface OrderReturnLineItem {
  combination?: CombinationLine;
  id: number;
  fulfillment_id: number;
  fulfillment_line_item_id: number;
  line_item_id: number;
  calculate_line_item_id: number;
  quantity: number;
  price: number;
  discounted_price: number;
  discounted_subtotal?: number;
  total_cart_discount_amount?: number;
  total_tax?: number;
  subtotal?: number;
  refundable_quantity?: number;
  refunded_quantity?: number;
  restocked_quantity?: number;
  restockable_quantity?: number;
  return_reason?: string;
  return_reason_note?: string;
  refund_display_information?: any;
  image?: Image;
  product_title?: string;
  variant_title?: string;
  sku?: string;
  product_exists?: boolean;
  product_id: number | null;
  variant_id: number | null;
  restock_summary?: {
    summary_display_information?: string | null;
    restock_informations?: RestockInformation[] | null;
  };
  original_price: number;
}

export type RestockInformation = {
  quantity: number;
  location_id?: number;
  restocked: boolean;
};

export interface OrderReturn {
  id: number;
  store_id: number;
  order_id: number;
  customer_id?: number;
  user_id?: number;
  name: string;
  note?: string;
  status: string;
  refund_status: "unrefund" | "partial" | "refunded";
  restock_status: "unrestock" | "partial" | "restocked";
  total_quantity?: number;
  total_price?: number;
  total_amount?: number;
  cancelable?: boolean;
  line_items: OrderReturnLineItem[];
  refunds?: RefundRespone[];
  reverse_fulfillment_orders?: ReverseFulfillmentOrderResponse[];
  cancelled_on: string;
  created_on: string;
  suggested_refund?: CalculateRefund;
  order: {
    id: number;
    name: string;
    discount_applications?: DiscountApplications[];
    taxes_included?: boolean;
    shipping_lines?: ShippingLines[];
    total_refunded_shipping?: number;
    total_shipping_price?: number;
    currency: string;
  };
  customer?: Customer;
  return_location_id?: number;
}

export interface OrderReturnResponse {
  order_returns: OrderReturn[];
}

export type ReverseFulfillmentOrderResponse = {
  id: number;
  return_id: number;
  order_id: number;
  line_items: ReverseFulfillmentOrderLineItemResponse[];
  dispositions?: ReverseFulfillmentOrderDispositionResponse[];
};

export type ReverseFulfillmentOrderDispositionResponse = {
  id: number;
  store_id: number;
  rfo_id: number;
  rfo_line_item_id: number;
  disposition_type: DisposeType;
  location_id: number;
  quantity: number;
};

export type ReverseFulfillmentOrderLineItemResponse = {
  id: number;
  order_id: number;
  reverse_fulfillment_order_id: number;
  line_item_id: number;
  fulfillment_id: number;
  fulfillment_line_item_id: number;
  dispositions?: ReverseFulfillmentOrderDispositionResponse[];
  quantity: number;
  price?: number;
  discounted_price?: number;
  discounted_subtotal?: number;
  total_cart_discount_amount?: number;
  total_tax?: number;
  subtotal?: number;
  refundable_quantity?: number;
  refunded_quantity?: number;
  restocked_quantity?: number;
  restockable_quantity?: number;
  return_reason: string;
  return_reason_note?: string;
  refund_display_information?: string;
};

export type ReverseFulfillmentOrderDisposeRequest = {
  dispositions: DispositionInput[];
};

export type DispositionInput = {
  rfo_line_item_id: number;
  quantity: number;
  disposition_type: DisposeType;
  location_id?: number;
};

export type RefundRequest = {
  option?: RefundRequestOption;
  cancel?: RefundRequestCancel;
  shipping?: RefundRequestShipping;
  refund_line_items: RefundRequestLineItem[];
  refund_return_line_items: RefundReturnRequestLineItem[];
  refund_value?: number;
  note?: string;
  discrepancy_reason?: RefundRequestRefundReason;
  transactions?: OrderTransactionCreateRequest[];
  send_notification?: boolean;
  send_notification_email?: boolean;
  is_restock_quantity?: boolean;
};

export type RefundRequestOption = {
  create: boolean;
};

export type RefundRequestCancel = {
  refund_full_amount: boolean;
  refund_shipping: boolean;
};

export type RefundRequestShipping = {
  full_refund?: boolean;
  amount: number;
};

export type RefundRequestLineItem = {
  line_item_id: number;
  quantity: number;
  location_id?: number;
  restock_type: "no_restock" | "cancel" | "return" | "legacy_restock";
  removal?: boolean;
};

export interface RefundReturnRequestLineItem extends RefundRequestLineItem {
  return_line_item_id: number;
}

export type RefundRequestRefundReason =
  | "damage"
  | "restock"
  | "customer"
  | "Shipping refund"
  | "Refund discrepancy"
  | "Full return balancing adjustment";

export type OrderReturnListState = {
  loading?: boolean;
  settingColumns: {
    saved_search?: SaveSearch;
    setting: { [key: string]: boolean };
    loadSuccess: boolean;
  };
};
