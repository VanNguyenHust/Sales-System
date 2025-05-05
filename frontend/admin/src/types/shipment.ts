import { type IndexTableHeading } from "@/ui-components";

import { TextDateTransfer } from "app/components/DateTimeField";
import { DeliveryServiceProvider, Location, Product } from "app/types";

export enum DeliveryStatus {
  PENDING = "pending",
  PICKED_UP = "picked_up",
  DELIVERING = "delivering",
  RETRY_DELIVERY = "retry_delivery",
  RETURNING = "returning",
  WAIT_TO_CONFIRM = "wait_to_confirm",
  RETURNED = "returned",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum ShipmentStatus {
  DELETED = "deleted",
  CLOSED = "closed",
  OPEN = "open",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  RECEIVED = "received",
}

export interface ShipmentListState {
  shipments: Shipment[];
}

export interface ShipmentFilterModel {
  locations: Location[];
  carriers: DeliveryServiceProvider[];
  products: Product[];
}

export type Shipment = {
  id: number;
  order_id: number;
  store_id: number;
  name: string;
  order_name: string;
  fulfillment_order_id: number;
  fulfillment_id: number;
  email: string;
  number: number;
  location_id: number;
  created_on: string;
  modified_on: string | null;
  cancelled_on: string | null;
  closed_on: string | null;
  delivered_on: string | null;
  picked_up_on: string | null;
  expected_delivery_on: string | null;
  notify_customer: boolean;
  service: string | null;
  cancel_reason: string | null;
  status: string;
  payment_status: string | null;
  delivery_status: string | null;
  delivery_method: string;
  tags: string;
  note: string;
  printed: boolean;
  service_fee: number;
  cod_amount: number;
  pickHub: string;
  billing_address: ShipmentAddress | null;
  pickup_address: ShipmentPickupAddress | null;
  shipping_address: ShipmentAddress | null;
  tracking_info: ShipmentTrackingInfo | null;
  shipping_info: ShipmentShippingInfo | null;
  line_items: ShipmentLineItem[];
  source_name?: string;
  currency?: string;
};

export interface ShipmentLineItem {
  id: number;
  quantity: number;
  product_id: number;
  title: string;
  variant_id: number;
  variant_title: string;
  sku: string;
  vendor: string;
  name: string;
  gift_card: boolean;
  price: number;
  variant_inventory_management: string;
  total_discount: number;
  discount_code: string;
  grams: number;
  product_exists: boolean;
  image?: string | null;
}

export type ShipmentFilter = {
  ids?: string[];
  query?: string;
  deliveryStatuses?: string[];
  statuses?: string[];
  shippingAddresses?: string[];
  carrierCodes?: string[];
  productIds?: string[];
  products?: { id: string; label: string }[];
  createdOnMin?: string;
  createdOnMax?: string;
  deliveredOnMin?: string;
  deliveredOnMax?: string;
  cancelledOnMin?: string;
  cancelledOnMax?: string;
  locationIds?: string[];
  locations?: { id: string; label: string }[];
  tags?: string[];
  sources?: string[];
  channelDefinitionIds?: string[];
  savedSearchId?: any;
  page?: number;
  limit?: number;
  createdOnPredefined?: TextDateTransfer;
  deliveredOnPredefined?: TextDateTransfer;
  cancelledOnPredefined?: TextDateTransfer;
  fulfillmentIds?: string[];
  fulfillmentOrderIds?: string[];
  sinceId?: number;
  orderId?: number;
  provinceCodes?: string[];
  districtCodes?: string[];
  modifiedOnMin?: string;
  modifiedOnMax?: string;
  carrier?: string;
  printStatus?: string;
};

export interface ShipmentFilterTag {
  take?: number;
  query?: string;
  sort?: string;
}

export interface ShipmentAddress {
  city?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address1: string | null;
  address2?: string | null;
  ward?: string | null;
  ward_code?: string | null;
  district?: string | null;
  district_code?: string | null;
  province?: string | null;
  province_code?: string | null;
  country_name?: string | null;
  country_code?: string | null;
  zip?: string | null;
}

export interface ShipmentPickupAddress {
  location_id?: number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  ward?: string | null;
  ward_code?: string | null;
  district?: string | null;
  district_code?: string | null;
  province?: string | null;
  province_code?: string | null;
  country?: string | null;
  country_code?: string | null;
  zip_code?: string | null;
}

export interface ShipmentTrackingInfo {
  id: number | null;
  tracking_reference?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  carrier?: string | null;
  route_code?: string | null;
  carrier_provider?: string | null;
  carrier_name?: string | null;
  service?: string | null;
  service_name?: string | null;
  reference_status?: string | null;
  reference_status_explanation?: string | null;
  rejected_reason?: string | null;
}

export interface ShipmentShippingInfo {
  insurance_value?: number | null;
  freight_payer?: string | null;
  metadata?: string | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
  weight?: number | null;
  requirement?: number | null;
  note?: string | null;
  carrier_code?: string;
  carrier_name?: string;
  service_code?: string | number;
  service_name?: string;
  service_fee?: number;
  cod_amount?: number;
  currency?: string;
}

export type RefundType = "no_restock" | "return" | "none";
export interface ShipmentShippingInfoUpdateRequest {
  id?: number; // không truyền id thì lấy từ redux
  delivery_status?: string;
  tracking_number?: string;
  tracking_url?: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  service_fee?: number;
  cod_amount?: number;
  reference_status?: string;
  reference_status_explanation?: string;
  note?: string;
  printed?: boolean;
  refund_type?: RefundType;
}
export type ShipmentUpdateRequest = {
  note?: string;
  pickup_address?: {
    location_id?: number;
  };
  shipping_address?: ShipmentAddress;
  cod_amount?: number;
  service_fee?: number;
  tags?: string;
  tracking_info?: {
    tracking_number?: string;
  };
};

export interface JourneyShippingLog {
  id: number;
  store_id: number;
  fulfillment_id: number;
  tracking_number: string;
  carrier_code: string;
  delivery_status: string;
  reference_status: string;
  reference_status_explanation: string;
  note: string;
  created_on: string;
  location_currently: string | null;
}
export interface ShipmentResponse extends Shipment {}

export type IndexTableHeadingCustom = {
  id: string;
  type?: "date" | "number" | "string" | "currency";
  alignment?: "start" | "center" | "end";
  width?: number;
} & IndexTableHeading;

export type ExportShipment = {
  label: string;
  key:
    | keyof Shipment
    | `shipping_address.${keyof ShipmentAddress}`
    | `pickup_address.${keyof ShipmentPickupAddress}`
    | `tracking_info.${keyof ShipmentTrackingInfo}`
    | `shipping_info.${keyof ShipmentShippingInfo}`
    | "dimension"
    | "shipping_address.name"
    | "product.sku"
    | "product.name"
    | "product.unit_price"
    | "product.quantity"
    | "product.price"
    | "product.discount"
    | "stt";
  selected?: boolean;
  export_type?: ExportShipmentRequest["export_type"][];
  default?: boolean;
  order?: number;
};

export type GroupExportShipment = {
  label: string;
  key: string;
  children: ExportShipment[];
};

export type ExportShipmentRequest = {
  ids?: string[];
  filter?: any;
  selected_fields?: ExportShipment[];
  user_id?: number;
  receiver_email?: string;
  export_type?: "overview" | "detail" | "overview_by_product";
  options?: "all" | "only_selected" | "only_page" | "only_filter";
};

export type PrintHandoverShipmentResponse = {
  status: number;
  content?: string;
  subject: string;
  error?: string;
};

export type UpdateShipmentInfoRequest = {
  location_id?: number;
  shipping_address?: ShipmentAddress;
  tracking_number?: string;
  shipping_info?: ShipmentShippingInfo;
  tags?: string[];
  note?: string;
};
