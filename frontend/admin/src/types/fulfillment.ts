import { LineItemViewInfo } from "app/features/order/type";
import {
  Image,
  MailingAddress,
  OrderLineItem,
  OrderShipmentStatus,
  ShipmentResponse,
  ShipmentStatus,
  ShippingInfo,
  TrackingInfoRequest,
} from "app/types";

export interface Fulfillments {
  combinations?: LineItemViewInfo[];
  id?: number;
  order_id?: number;
  store_id?: number;
  name?: string;
  order_name?: string;
  fulfillment_order_id?: number;
  location_id?: number;
  location_name?: string;
  created_on?: string;
  modified_on?: string;
  delivered_on?: string;
  cancelled_on?: string;
  estimated_delivery_on?: string;
  notify_customer?: false;
  total_quantity?: number;
  service?: string;
  cancel_reason?: string;
  status?: string;
  shipment_status?: OrderShipmentStatus;
  pickup_address?: any;
  shipping_address?: any;
  delivery_method?: string;
  tracking_info?: TrackingInfo;
  shipping_info?: ShippingInfo;
  line_items?: OrderLineItem[];
  tags?: [];
  note?: string;
  shipment?: ShipmentResponse;
  origin_address?: MailingAddress & { name: string };
}

export enum FulfillmentStatus {
  PENDING = "pending",
  OPEN = "open",
  CONFIRMED = "confirmed",
  SUCCESS = "success",
  CANCELLED = "cancelled",
  ERROR = "error",
  FAILURE = "failure",
}

export enum FShipmentStatus {
  READY_TO_PICK = "ready_to_pick",
  PICKED_UP = "picked_up",
  DELIVERING = "delivering",
  RETRY_DELIVERY = "retry_delivery",
  RETURNING = "returning",
  RETURNED = "returned",
  DELIVERED = "delivered",
}

export interface Fulfillment {
  id: number;
  order_id: number;
  store_id: number;
  name: string;
  order_name: string;
  fulfillment_order_id: number;
  location_id: number;
  location_name: string;
  created_on: string;
  modified_on: string | null;
  cancelled_on: string | null;
  delivered_on: string | null;
  estimated_delivery_on: string | null;
  notify_customer: boolean;
  total_quantity: number;
  service: string | null;
  cancel_reason: string | null;
  status: string;
  shipment_status: string | null;
  delivery_method: string;
  tags: FulfillmentTag[];
  note: string;
  printed: boolean;
  pickup_address: FulfillmentAddress | null;
  shipping_address: FulfillmentAddress | null;
  tracking_info: FulfillmentTrackingInfo | null;
  shipping_info: FulfillmentShippingInfo | null;
  fulfill_line_items: FulfillmentLineItem[];
}

export interface FulfillmentTag {
  id: number;
  tag: string;
  tag_alias: string;
}
export interface FulfillmentShippingInfo {
  carrier_code: string;
  carrier_name: string;
  service_code: string;
  service_name: string;
  service_fee: number;
  cod_amount: number;
  insurance_value: number;
  freight_payer: string;
  metadata?: any;
  width: number;
  height: number;
  length: number;
  weight: number;
  requirement: number;
  note?: string;
  meta_data?: any;
}
export interface FulfillmentLineItem {
  id: number;
  line_item_id?: number;
  quantity?: number;
  product_id?: number;
  title?: string;
  variant_id?: number;
  variant_title?: string;
  sku?: string;
  image?: Image;
  price?: number;
  discounted_unit_price?: number;
  grams?: number;
  fulfillment_order_line_item_id?: number;
  quantityModified?: number;
  token?: string;
  product_exists?: boolean;
}

export interface FulfillmentAddress {
  location_id?: number | null;
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  id?: number;
  address1: string;
  address2?: string;
  ward: string;
  ward_code: string;
  district: string;
  district_code: string;
  province: string;
  province_code: string;
  country: string;
  country_code: string;
  latitude?: string;
  longitude?: string;
  zip_code: string;
}

export interface FulfillmentTrackingInfo {
  tracking_company?: string;
  tracking_number?: string;
  tracking_url?: string;
  tracking_numbers?: string[];
  tracking_urls?: string[];
}

export interface TrackingInfo {
  reference_status?: string;
  tracking_company?: string;
  tracking_number?: string;
  tracking_url?: string;
  carrier_name?: string;
  tracking_numbers?: string[];
  tracking_urls?: string[];
  service_name?: string;
  service?: string;
}

export interface FulfillmentShippingInfo {
  carrier_code: string;
  carrier_name: string;
  service_code: string;
  service_name: string;
  service_fee: number;
  cod_amount: number;
  insurance_value: number;
  freight_payer: string;
  metadata?: any;
  width: number;
  height: number;
  length: number;
  weight: number;
  requirement: number;
}

export const FulfillmentShipmentStatus = {
  unpack: {
    value: "unpack",
    name: "Chưa đóng gói",
  },
  packed: {
    value: "packed",
    name: "Đã đóng gói",
  },
  cancelled_packed: {
    value: "cancelled_packed",
    name: "Hủy đóng gói",
  },
  pending: {
    value: "pending",
    name: "Chờ lấy hàng",
  },
  picked_up: {
    value: "picked_up",
    name: "Đã lấy hàng",
  },
  delivering: {
    value: "delivering",
    name: "Đang giao hàng",
  },
  retry_delivery: {
    value: "retry_delivery",
    name: "Chờ giao lại",
  },
  delivered: {
    value: "delivered",
    name: "Đã giao hàng",
  },
  returning: {
    value: "returning",
    name: "Đang hoàn hàng",
  },
  returned: {
    value: "returned",
    name: "Đã hoàn hàng",
  },
  cancelled: {
    value: "cancelled",
    name: "Đã hủy",
  },
};

export const FulfillmentShipmentStatusConst: { [key: string]: { name: string } } = FulfillmentShipmentStatus;

export interface FulfillmentsRequest {
  fulfillment_order_id: number;
  delivery_method?: string;
  delivery_status?: string;
  service_fee?: number;
  tracking_info?: TrackingInfoRequest;
  send_notification?: boolean;
}

export interface FulfillmentFilterType {
  query?: string;
  shipment_statuses?: ShipmentStatus[];
  statuses?: FulfillmentStatus[];
  shipping_address?: BasicAddress;
  carrier_names?: string[];
  product_ids?: number[];
  created_from?: Date;
  created_to?: Date;
  created_text_range?: string;
  delivered_from?: Date;
  delivered_to?: Date;
  delivered_text_range?: string;
  canceled_from?: Date;
  canceled_to?: Date;
  canceled_text_range?: string;
  location_ids?: number[];
  tags?: string[];
  printed?: boolean;
  saved_search_id?: number;
  page?: number;
  size?: number;
}

export interface BasicAddress {
  address1?: string;
  address2?: string;
  city?: string;
  district?: string;
  ward?: string;
  name?: string;
  phone?: string;
}

export interface TabDescriptor {
  id: string;
  content: string;
  panelID?: string;
  canDelete?: boolean;
}

export interface FulfillmentListState {
  filter: FulfillmentFilterType;
  isLoading: boolean;
  count: number;
  page: number;
  totalPage: number;
  fulfillments: Fulfillment[];
  showPaging: boolean;
}

export enum FulfillmentSupportedActionType {
  CANCEL_DELIVERY = "cancel_delivery",
  MARK_AS_DELIVERED = "mark_as_delivered",
  PRINT_MARKET_PLACE_ORDER = "print_market_place_order",
  CANCEL_DELIVERY_RECEIVED = "cancel_delivery_received",
}
