import { LineItemViewInfo } from "app/features/order/type";

import { MailingAddress } from "./customer";
import { OrderLineItem } from "./order";

export interface FulfillmentOrders {
  combinations: LineItemViewInfo[] | undefined;
  id: number;
  store_id?: number;
  order_id?: number;
  assigned_location_id?: number;
  expected_delivery_method?: ExpectedDeliveryMethod;
  status: FulfillmentOrderStatus;
  request_status?: FulfillmentOrderRequestStatus;
  line_items?: FulfillmentOrderLineItem[];
  required_shipping?: boolean;
  destination: MailingAddress;
  total_outstanding?: number;
  name?: string;
  modified_on?: string;
  fulfill_on?: string;
  fulfillment_service_info?: FulfillmentOrderServiceInfo;
  fulfill_by?: string;
  merchant_requests?: MerchantRequest[];
  supported_actions?: SupportedAction[];
}

export type SupportedAction = {
  action: FulfillmentOrderSupportedActionType;
  external_url?: string;
  priority: SupportedActionPriority;
  title: string;
};

export enum FulfillmentOrderSupportedActionType {
  CREATE_FULFILLMENT = "create_fulfillment",
  PURCHASE_LABEL = "purchase_label",
  CONFIRM_MARKET_PLACE_ORDER = "confirm_marketplace_order",
  REQUEST_FULFILLMENT = "request_fulfillment",
  MOVE = "move",
  REQUEST_CANCELLATION = "request_cancellation",
  CANCEL_FULFILLMENT_ORDER = "cancel_fulfillment_order",
}

export enum SupportedActionPriority {
  FIRST = "first",
  SECOND = "second",
}
export type MerchantRequest = {
  id: number;
  message?: string;
  sent_at?: string;
  kind?: MerchantRequestKind;
  meta_data?: string;
};

export enum MerchantRequestKind {
  FULFILLMENT_REQUEST = "fulfillment_request",
  CANCELLATION_REQUEST = "cancellation_request",
}

export enum ExpectedDeliveryMethod {
  NONE = "none",
  RETAIL = "retail",
  PICK_UP = "pick_up",
  SHIPPING = "shipping",
  FULFILLMENT_BY_MARKETPLACE = "fulfillment_by_marketplace",
  FULFILLMENT_BY_SELLER = "fulfillment_by_seller",
}

export enum FulfillmentOrderStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  IN_COMPLETE = "incomplete",
  CANCELLED = "cancelled",
  CLOSED = "closed",
  ON_HOLD = "on_hold", // code cũ comp RefundCreatePage có status này.
}

export enum FulfillmentOrderRequestStatus {
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  UN_SUBMITTED = "unsubmitted",
  CANCELLATION_ACCEPTED = "cancellation_accepted",
  CANCELLATION_REJECTED = "cancellation_rejected",
  CANCELLATION_REQUESTED = "cancellation_requested",
  CLOSED = "closed",
}

export type FulfillmentOrderServiceInfo = {
  id?: number;
  kind: FulfillmentOrderServiceKind;
  type: FulfillmentOrderServiceType;
};

export enum FulfillmentOrderServiceKind {
  MANUAL = "manual",
  THIRD_PARTY = "third_party",
}

export enum FulfillmentOrderServiceType {
  NONE = "none",
  END_TO_END = "end_to_end",
  FULFILLMENT_ONLY = "fulfillment_only",
}
export interface LocationsForMove {
  location: LocationForMove;
  movable: boolean;
  message: string;
}

export interface LocationForMove {
  id: number;
  name: string;
}

export interface LocationsMoveRequest {
  new_location_id: number;
}

export interface LocationsMoveResponse {
  original_fulfillment_order: FulfillmentOrders;
  moved_fulfillment_order: FulfillmentOrders;
}

export interface FulfillmentOrderLineItem extends OrderLineItem {
  order_line_item_id: number;
  line_item_id: number;
  total_quantity?: number;
}

export interface TrackingInfoRequest {
  carrier?: string;
  carrier_name?: string;
  service?: string | number;
  service_name?: string;
  tracking_urls?: string[];
  tracking_numbers?: string[];
  tracking_number?: string;
  tracking_url?: string;
}

export const listMockShipping = [
  "Đối tác khác",
  "Giao Hàng Tiết Kiệm - Đẩy ngoài",
  "Giao Hàng Nhanh - Đẩy ngoài",
  "Viettel Post - Đẩy ngoài",
  "J&T Express - Đẩy ngoài",
  "VNPost - Đẩy ngoài",
  "Shopee EXpress - Đẩy ngoài",
  "Ninja Van - Đẩy ngoài",
  "Ahamove - Đẩy ngoài",
  "GrabExpress - Đẩy ngoài",
  "ZTO Express - Đẩy ngoài",
  "Nhất Tín Express - Đẩy ngoài",
  "BEST Express - Đẩy ngoài",
  "TikiNOW - Đẩy ngoài",
  "Snappy Express - Đẩy ngoài",
  "Hola Ship - Đẩy ngoài",
  "247 Express - Đẩy ngoài",
  "Super Ship - Đẩy ngoài",
  "EMS - Đẩy ngoài",
  "Giao Hàng Siêu Việt - Đẩy ngoài",
];

export type FulfillmentOrderCancellationRequest = {
  fulfillment_order: {
    message?: string;
  };
};
