import { type OptionDescriptor } from "@/ui-components";

import { TextDateTransfer } from "app/components/DateTimeField/types";
import {
  DISCOUNT_CODE_NON_APPLICABLE_REASON_ERROR,
  OrderCancelReasonObject,
  OrderCarrierObject,
  OrderDeliveryMethodObject,
  OrderFinancialStatusObject,
  OrderFulfillmentStatusObject,
  OrderPaymentObject,
  OrderShipmentStatusObject,
  OrderStatusObject,
} from "app/features/order/utils/contants";
import {
  AhamovePeliasAddress,
  Customer,
  DiscountClass,
  DiscountValueType,
  DraftLineItemComponent,
  FulfillmentOrders,
  FulfillmentOrderSupportedActionType,
  Fulfillments,
  FulfillmentSupportedActionType,
  Image,
  Location,
  MailingAddress,
  NoteAttribute,
  RefundRequest,
  RefundRespone,
  ServiceFeeType,
  ShippingProvider,
  TaxLine,
  User,
  Variant,
  VariantUnionType,
} from "app/types";

//#region enum

export type AllocationMethod = "each" | "across";
export type TargetSelection = "all" | "entitled" | "explicit";
export type TargetType = "shipping_line" | "line_item";
export type RuleType = "automatic" | "discount_code" | "promotion" | "manual";
export type NonApplicableReasonCode = keyof typeof DISCOUNT_CODE_NON_APPLICABLE_REASON_ERROR;

export type OrderFinancialStatus = keyof typeof OrderFinancialStatusObject;
export type OrderFulfillmentStatus = keyof typeof OrderFulfillmentStatusObject;
export type OrderCancelReason = keyof typeof OrderCancelReasonObject;
export type OrderShipmentStatus = keyof typeof OrderShipmentStatusObject;
export type OrderDeliveryMethod = keyof typeof OrderDeliveryMethodObject;
export type OrderCarrier = keyof typeof OrderCarrierObject;
export type OrderStatus = keyof typeof OrderStatusObject;
export type OrderPaymentMethod = keyof typeof OrderPaymentObject;

export type FulfillmentMethodType = "external_service" | "delivered" | "delivery_later";
export type FulfilmentMethodType = "external_service" | "delivered" | "delivery_later";

export type OrderBulkActionOperation =
  | "archive"
  | "unarchive"
  | "fulfill"
  | "add_tag"
  | "remove_tag"
  | "cancel"
  | "update_assignee";
export type FilterExportOrderType = "allOrders" | "currentPage" | "selectedOrders" | "currentSearch";
export type ExportOrderType = "orderOverview" | "overviewByProduct" | "detail";

export type CombinationCalculateType = "normal" | "calculate_and_split";

export const OrderFilterNumberFields = ["page", "limit"];

//#endregion enum

export interface ChannelDefinition {
  id: number;
  handle: string;
  alias: string;
  fulfillable_quantity?: number;
  taxable?: boolean;
  discount_allocations?: DiscountApplications[];
}

export interface ChannelDefinition {
  id: number;
  name: string;
  sub_channel_name: string;
  main_name: string;
  sub_name: string;
  alias: string;
}

export interface Order {
  id: number;
  store_id?: number;
  location_id?: number;
  user_id?: number;
  user_full_name?: string;
  assignee_id?: number;
  assignee_full_name?: string;
  source_channel?: string;
  note?: string;
  currency?: string;
  created_on: string;
  modified_on?: string;
  cancelled_on?: string;
  cancel_reason?: string;
  source_url?: string;
  source_identifier?: string;
  name?: string;
  status?: OrderStatus;
  order_number?: number;
  tags?: string;
  email?: string;
  phone?: string;
  completed_on?: string;
  copy_order_id?: number;
  total_discounts?: number;
  total_shipping_price?: number;
  total_line_items_price?: number;
  line_items_subtotal_price?: number;
  total_tax?: number;
  current_total_tax: number;
  sub_total_price?: number;
  total_price: number;
  subtotal_line_items_quantity?: number;
  billing_address?: MailingAddress;
  shipping_address?: MailingAddress;
  applied_discount?: string;
  note_attributes?: { name: string; value: string }[];
  customer?: Customer;
  customer_group_id?: number;
  line_items?: OrderLineItem[];
  source_name?: OrderSourceName;
  financial_status: "pending" | "authorized" | "voided" | "paid" | "partially_paid" | "refunded" | "partially_refunded";
  fulfillment_status: "partial" | "fulfilled" | "unfulfilled" | "restocked";
  fulfillments?: Fulfillments[];
  current_discounted_total?: number;
  current_cart_discount_amount?: number;
  current_subtotal_line_items_quantity?: number;
  landing_site?: string;
  referring_site?: string;
  payment_gateway_names?: string[];
  discount_applications?: DiscountApplication[];
  shipping_lines?: ShippingLines[];
  current_total_price?: number;
  net_payment?: number;
  total_refunded?: number;
  total_outstanding?: number;
  channel_definition?: ChannelDefinition;
  shipment_status: OrderShipmentStatus;
  capturable?: boolean;
  can_mark_as_paid?: boolean;
  processed_on?: Date;
  unpaid_amount?: number;
  refundable?: boolean;
  refunds?: RefundRespone[];
  tax_lines?: OrderTaxLine[];
  current_tax_lines?: OrderTaxLine[];
  total_refunded_shipping?: number;
  total_received?: number;
  closed_on?: string;
  taxes_included?: boolean;
  can_notify_customer?: boolean;
  user?: User;
  assignee?: User;
  app?: OrderApp;
  combination_lines: CombinationLine[];
}

export enum OrderSourceName {
  SOCIAL = "social",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  SHOPEE = "shopee",
  TIKI = "tiki",
  LAZADA = "lazada",
  TIKTOK_SHOP = "tiktokshop",
  WEB = "web",
  POS = "pos",
}

export interface OrderTaxLine {
  price: number;
  rate?: number;
  title: string;
}

export interface BaseSearchFilter {
  query?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface OrderFilter extends BaseSearchFilter {
  ids?: string | number[];
  statuses?: string;
  sources?: string;
  location_ids?: string;
  customer_ids?: string;
  customer_names?: string;
  since_ids?: string;
  variant_ids?: string;
  product_names?: string;
  user_ids?: string;
  assignee_ids?: string;
  tags?: string;

  modified_on_min?: string;
  modified_on_max?: string;
  modified_option?: TextDateTransfer;
  processed_on_min?: string;
  processed_on_max?: string;
  processed_option?: TextDateTransfer;
  cancelled_on_min?: string;
  cancelled_on_max?: string;
  cancelled_option?: TextDateTransfer;

  metafields?: string;

  financial_statuses?: string;
  fulfillment_statuses?: string;
  shipment_statuses?: string;
  shipping_providers?: string;
  channel_definitions?: string;
  cancel_reasons?: string;
  delivery_methods?: string;
  payment_gateway_names?: string;
  shipping_addresses?: string;
  app_keys?: string;
  print_statuses?: string;

  customer_id?: number;
  currency?: string;
  unpaid_amount_min?: number;

  saved_search_id?: string;
}

export interface ProvinceDistrictData {
  province_id: number;
  province_code: string;
  province: string;
  district_id: number;
  district_code: string;
  district: string;
  label: string;
}

export interface CompleteDraftOrder {
  payment_gateway_id?: number; // payment method id
  payment_pending?: boolean; // payment status - Thanh toán sau = true
  payment_amount?: number; // số tiền thanh toán khi tạo đơn hàng có thể nhỏ hơn hoặc bằng giá trị của đơn hàng
  delivery_method?: "shipping" | "pickup"; // delivery method
  carrier_name?: string; // delivery partner name
  carrier?: string; // delivery partner
  inventory_behaviour?: string; // inventory_behaviour
}

export interface SaleChannel {
  id: string;
  channel_name: string;
  sub_channel_name: string;
  clientId: string;
  smallIcon: string;
  largeIcon: string;
}

export interface OrderSetRequest {
  ids: number[];
  operation: OrderBulkActionOperation;
  tags?: string[];
  reason?: OrderCancelReason;
  assignee_id?: number;
  amount?: number;
  send_notification?: boolean;
  restock?: boolean;
}

export interface CalculateDraftOrderLineItem {
  product_id?: number;
  variant_id?: number;
  variant_title?: string;
  quantity: number;
  requires_shipping?: boolean;
  sku?: string;
  title: string;
  taxable?: boolean;
  fulfillment_service?: string;
  grams?: number;
  price?: number;
  vendor?: string;
  properties?: NoteAttribute[];
  applied_discount?: AppliedDiscount;
}

export interface CalculateDraftOrderRequest {
  tax_exempt?: boolean;
  line_items: CalculateDraftOrderLineItem[];
  applied_discount?: AppliedDiscount;
  shipping_address?: MailingAddress;
  shipping_line?: ShippingLineDraftOrder;
  location_id?: number;
  custom_weight?: number;
  currency?: string;
}

export interface CalculateAppliedDiscount {
  title?: string;
  description?: string;
  value?: number;
  value_type?: "percentage" | "fixed_amount";
  amount?: number;
  custom?: boolean;
}

export interface CalculateDraftOrderResponse {
  currency?: string;
  tax_exempt?: boolean;
  total_price?: number;
  total_discounts?: number;
  total_shipping_price?: number;
  total_line_items_price?: number;
  line_items_subtotal_price?: number;
  total_tax?: number;
  applied_discount?: CalculateAppliedDiscount;
  shipping_line?: {
    title?: string;
    alias?: string;
    price?: number;
    custom?: boolean;
    code?: string;
    source?: string;
    phone?: string;
    tax_lines?: any[];
  };
  line_items?: CalculateDraftLineItem[];
  tax_lines: DraftTaxLine[];
  available_shipping_rates?: {
    alias: string;
    price: number;
    title: string;
  }[];
  subtotal_price?: number;
  discount_applications?: DiscountApplications[];
}

export type DraftTaxLine = {
  price: number;
  rate?: number;
  rate_percentage?: number;
  title: string;
};

export interface CalculateDraftLineItem {
  variant_id?: number;
  inventory_item_id?: number;
  product_id?: number;
  token?: string;
  inventory_policy?: string;
  inventory_management?: string;
  title?: string;
  variant_title?: string;
  sku?: string;
  vendor?: string;
  tax_lines?: TaxLine[];
  requires_shipping?: boolean;
  custom?: boolean;
  taxable?: boolean;
  price?: number;
  quantity: number;
  total_original: number;
  discounted_total: number;
  discounted_unit_price: number;
  allocation_ratio: number;
  discount_order?: number;
  price_excluding_discount?: number;
  applied_discount?: CalculateAppliedDiscount;
  have_inventory_level?: boolean;
  inventory_quantity?: number;
  components?: DraftLineItemComponent[];
  type: VariantUnionType;
  image?: Image;
  discount_allocations?: DiscountAllocation[];
}

export interface OrderSourceType extends OptionDescriptor {
  sourceUrl: string;
}

export interface OrderRequest {
  email?: string;
  phone?: string;
  buyer_accepts_marketing?: true;
  note?: string;
  tags?: string;
  shipping_address?: MailingAddress;
  assignee_id?: number | null;
  change_online_payment?: boolean;
  processing_method?: string;
  gateway?: string;
  note_attributes?: { name: string; value: string }[];
}

export interface DiscountApplications {
  allocation_method?: AllocationMethod;
  target_selection?: TargetSelection;
  target_type?: TargetType;
  value?: number;
  code?: string;
  title?: string;
  amount: number;
  index?: number;
  discount_class?: DiscountClass;
}

export interface ShippingLines {
  source?: string;
  price?: number;
  code?: string;
  title?: string;
  discount_allocations?: DiscountAllocation[];
}

export interface ApplyDiscountProps {
  token: string;
  type: DiscountValueType;
  value?: number;
  title: string;
  maxLinePrice: number;
  existedDiscounts: boolean;
}

export interface ShippingLineDraftOrder {
  source?: string;
  price?: number;
  title?: string;
  alias?: string;
  custom?: boolean;
  id?: string;
}

export interface OrderExportRequest extends BaseSearchFilter {
  export_fields: string[];
  searchType?: string;
  filter_type: FilterExportOrderType;
  type: ExportOrderType;
  ids?: number[];
  statuses?: string[];
  sources?: string[];
  location_ids?: number[];
  customer_ids?: number[];
  since_ids?: number[];
  variant_ids?: number[];
  user_ids?: number[];
  assignee_ids?: number[];

  tags?: string[];

  modified_on_min?: string;
  modified_on_max?: string;
  modified_option?: TextDateTransfer;
  processed_on_min?: string;
  processed_on_max?: string;
  processed_option?: TextDateTransfer;
  cancelled_on_min?: string;
  cancelled_on_max?: string;
  cancelled_option?: TextDateTransfer;

  financial_statuses?: string[];
  fulfillment_statuses?: string[];
  shipment_statuses?: string[];
  carriers?: string[];
  channel_definations?: string[];
  cancel_reasons?: string[];
  delivery_methods?: string[];
  payment_gateway_names?: string[];
  shipping_addresses?: string[];
  print_statuses?: string[];
  shipping_providers?: string[];
  channel_definitions?: string[];
  app_keys?: string[];
}

export interface OrderCancelRequest {
  reason: OrderCancelReason;
  restock?: boolean;
  amount?: number;
  send_notification: boolean;
  refund_shipping?: boolean;
  refund_request?: RefundRequest;
}

export interface OrderLineItem {
  id?: number;
  token?: string;
  variant_id?: number;
  product_id?: number;
  inventory_item_id?: number;
  title?: string;
  sku?: string;
  vendor?: string;
  price: number;
  quantity: number;
  current_quantity?: number;
  requires_shipping?: boolean;
  fulfillment_service?: null;
  effective_quantity?: number;
  grams?: number;
  name?: string;
  properties?: { name: string; value: string }[];
  custom?: boolean;
  discounted_total?: number;
  discounted_unit_price?: number;
  total_original?: number;
  total_discount?: number;
  applied_discount?: AppliedDiscount;
  image?: Image;
  variant_title?: string | null;
  remaining_quantity?: number;
  discount_allocations?: DiscountAllocation[];
  taxable?: boolean;
  order_id?: number;
  order_line_item_id?: number;
  line_item_id?: number;
  fulfillable_quantity?: number;
  product_exists?: boolean;
  refundable_quantity?: number;
  restockable?: boolean;
  combination_line_id?: number;
  components?: DraftLineItemComponent[];
  type?: VariantUnionType;
  unit?: string;
  combination_line_key?: string;
}

export type AppliedDiscount = {
  title: string;
  description?: string;
  value: number;
  value_type: DiscountValueType;
  amount: number;
  custom: boolean;
};

export type DiscountAllocation = {
  amount: number;
  discount_application_index: number;
  //các field mapping for view
  code: string;
  allocation_method?: AllocationMethod;
  target_selection?: TargetSelection;
  target_type?: TargetType;
  discount_class?: DiscountClass;
  type?: RuleType;
  //Ưu tiên dùng field này với draft
  application_type?: RuleType;
  value?: number;
  title?: string;
  summary?: string;
};

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderExportColumn {
  key: string;
  label: string;
  selected: boolean;
  index: 1 | 2 | 3;
  default?: boolean;
}

export interface OrderSource {
  id: number;
  name: string;
  alias: string;
  image_url: string;
}

export interface OrderApp {
  id: number;
  key: string;
  alias: string;
  title: string;
  private_app: boolean;
}

// để tạm
export interface OrderNotificationTemplateResponse {
  template: string;
  name: string;
  description: string;
  active: boolean;
  can_edit_active: boolean;
  same_as_default: boolean;
  category: string;
  created_on: string;
  modified_on: string;
}

export interface OrderShippingSetting {
  id: number;
  store_id: number;
  weight_type: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  requirement: number;
  created_on: string;
  modified_on: string;
}

//#region Shipment bulk create
export interface ShipmentBulkCreateState {
  isLoadingFirstData?: boolean | null;
  filter?: ShipmentBulkCreateFilter | null;
  orders?: Order[] | null;
  isOpenModal: string | null;
  isSelectedItem: {
    fulfillmentOrderId: number | null;
    customerId?: number | null;
    customerAddressId?: number | null;
    reloadCustomerAddress?: boolean | null;
  } | null;
  defaultShippingAddresses: (MailingAddress & { fulfillment_order_id: number })[] | null;
  fulfillmentOrders?: FulfillmentOrders[] | null;
  shipmentItems?: ShipmentBulkCreateItem[] | null;
  cacheShipmentItems?: ShipmentBulkCreateItem[] | null;
  failedShipmentItems?: ShipmentBulkCreateItem[] | null;
  location?: Location | null;
  metadata?:
    | {
        [key in ShippingProvider]?: {
          [key: string]: any;
        };
      }
    | null;
  services?: ServiceFeeType[] | null;
  preMetadata?:
    | {
        [key in ShippingProvider]?: {
          [key: string]: any;
        };
      }
    | null;
  countLoadingFees?: number | null;
  wasPushed?: boolean | null;
  selectedTab: number;
  onChangeInventory?: number | null;
  lastUrl?: string | null;
}

export interface ShipmentBulkCreateFilter {
  location_id: number;
  fulfillment_order_ids?: number[];
  order_ids: number[];
  shipping_provider: string;
  view_type?: "list" | "grid";
}

export type ShipmentBulkCreateItem = {
  fulfillment_order_id: number;
  order_id: number;
  fulfillment_id?: number;
  shipment_id?: number;
  order_name: string;
  customer_id: number;
  order_name_custom?: string;
  shipping_address?: MailingAddress & { id?: number };
  cod: number;
  total_outstanding: number;
  package_value: number;
  service?: ServiceFeeType;
  provider?: ShippingProvider;
  status?: "failed" | "success" | "pending" | null;
  print_status?: boolean; // trạng thái in của shipment
  error?: string[];
  weight_type?: "kg" | "g";
  weight: number;
  width: number;
  height: number;
  length: number;
  delivery_request?: string;
  note?: string;
  tracking_number?: string;
  line_items?: OrderLineItem[];
  metadata?: {
    ghtkAddressDetail?: string;
    ahamoveShippingInfo?: AhamovePeliasAddress;
  };
  total_item?: number;
  currency?: string;
};
//#endregion Shipment bulk create

export interface OrderTransaction {
  id: number;
  parent_id?: number;
  order_id?: number;
  checkout_token?: number;
  location_id?: number;
  refund_id?: number;
  payment_id?: number;
  user_id?: number;
  device_id?: number;
  amount: number;
  authorization?: number;
  gateway: string;
  kind: string;
  error_code?: null;
  status: string;
  currency: string;
  created_on: string;
  processed_at: string;
  test?: boolean;
  send_notification?: boolean;
  source_name: string;
  receipt?: string;
  payment_details?: {
    bill_number?: string;
    note?: string;
  };
  cause_type: string;
  payment_info: PaymentInfo;
}

export type OrderTransactionCreateRequest = {
  gateway?: string;
  processing_method?: string;
  authorization?: string;
  error_code?: string;
  source_name?: string;
  device_id?: string;
  parent_id?: number;
  kind: "sale" | "authorization" | "capture" | "refund" | "void";
  status?: "pending" | "success" | "failure" | "error";
  amount: number;
  currency?: string;
  payment_details?: { [key: string]: string };
  receipt?: { [key: string]: string };
  send_notification?: boolean;
  payment_info?: PaymentInfo;
  location_id?: number;
};

export const OrderPrintStatus = {
  non_print: "Chưa in",
  printed: "Đã in",
} as { [key: string]: string };

export enum MetafieldNamespace {
  MARKET_SHOPEE = "market_shopee",
  MARKET_TIKI = "market_tiki",
  MARKET_LAZADA = "market_lazada",
  MARKET_TIKTOK = "market_tiktok",
}

export type SupportActionButtonDescriptor = {
  value: FulfillmentSupportedActionType | FulfillmentOrderSupportedActionType;
  content: string;
  externalUrl?: string;
  /** Nút phụ - Hiển thị trên giao diện*/
  outline?: boolean;
};

export type SupportActionOptionDescriptor = {
  content: string;
  value: string;
  externalUrl?: string;
};

export type CombinationLine = {
  id: number;
  product_id: number;
  variant_id: number;
  variant_title?: string;
  quantity: number;
  sku?: string;
  title?: string;
  unit?: string;
  item_unit?: string;
  price: number;
  type: "combo" | "packsize";
  components: CombinationLineComponent[];
  product_exists: boolean;
};

export type CombinationLineComponent = {
  product_id: number;
  variant_id: number;
  variant_title?: string;
  title?: string;
  unit?: string;
  grams: number;
  taxable: boolean;
  sku: string;
  quantity: number;
  weight_unit?: string;
};

export type DiscountApplication = {
  index: number;
  code?: string;
  title?: string;
  description?: string;
  value: number;
  max_value: number;
  amount: number;
  type: RuleType;
  application_type: RuleType;
  value_type: DiscountValueType;
  target_type: TargetType;
  discount_class: DiscountClass;
  allocation_method: AllocationMethod;
  target_selection: TargetSelection;
  summary?: string;
};

//#region Order Edit

export type OrderEditResponse = {
  calculated_order: CalculatedOrder;
  calculated_line_items?: CalculatedLineItem[];
  staged_change?: StagedChangeResponse;
  order?: Order;
};

export type CalculatedOrder = {
  id: number;
  order_id: number;
  committed: boolean;
  customer_group_id?: number;
  subtotal_line_items_quantity: number;
  subtotal_price: number;
  cart_discount_amount: number;
  total_price: number;
  total_outstanding: number;
  tax_lines?: CalculatedTaxLine[];
  added_discount_applications?: CalculatedDiscountApplication[];
  line_items?: CalculatedLineItem[];
  fulfilled_line_items?: CalculatedLineItem[];
  added_line_items?: CalculatedLineItem[];
  unfulfilled_line_items?: CalculatedLineItem[];
  staged_changes?: any[];
  variant_ids_selected?: number[];
  line_items_edit?: CalculatedLineItem[];
  //set variant_id tạm trong action chọn nhiều sản phẩm
  bulk_action_select_variant_ids?: number[];
  variants?: VariantWithInventoryLevel[];
};

interface VariantWithInventoryLevel {
  variant: Variant;
  line_item_ids: string[];
}

interface CalculatedTaxLine {
  title?: string;
  price?: number;
  rate?: number;
  rate_percentage?: number;
}

export type CalculatedLineItem = {
  id: string;
  quantity: number;
  editable_quantity?: number;
  editable_quantity_before_changes: number;
  restockable: boolean;
  restocking?: boolean;
  original_unit_price: number;
  discounted_unit_price: number;
  editable_subtotal?: number;
  uneditable_subtotal?: number;
  tax_lines?: CalculatedTaxLine[];
  has_staged_line_item_discount?: boolean;
  calculated_discount_allocations?: CalculatedDiscountAllocation[];
  sku?: string;
  title?: string;
  variant_title?: string;
  variant_id?: number;
  custom_attributes?: LineItemPropertyResponse[];
  image?: ImageResponse;
  is_new_line_item?: boolean;
  discount_custom?: OrderEditSetLineItemDiscountRequest;
  inventory_management?: string;
};

interface CalculatedDiscountAllocation {
  allocatedAmount?: number;
  discount_application_id?: number;
  original_amount?: number;
  editable?: boolean;
}

interface LineItemPropertyResponse {
  name?: string;
  value?: string;
}

interface ImageResponse {
  id?: number;
  position?: number;
  created_on?: string;
  modified_on?: string;
  src?: string;
  alt?: string;
  filename?: string;
  size?: number;
  width?: number;
  height?: number;
}

export type CalculatedDiscountApplication = {
  id?: number;
  code?: string;
  description?: string;
  value?: number;
  max_value?: string;
  value_type?: "fixed_amount" | "percentage" | "fixed_price";
  type?: "automatic" | "discount_code" | "promotion" | "manual";
  target_type?: "line_item" | "shipping_line";
  target_selection?: "all" | "entitled" | "exlicit";
  allocation_method?: "across" | "each";
  applied_to?: "line" | "order";
};

interface StagedChangeResponse {
  type:
    | "no_op"
    | "add_variant"
    | "add_custom_item"
    | "add_shipping_line"
    | "add_item_discount"
    | "increment_item"
    | "decrement_item";
}

export type OrderEditSetQuantityRequest = {
  id?: number;
  line_item_id: string;
  quantity: number;
  restock?: boolean;
};

export type OrderEditCommitRequest = {
  id: number;
  notify_customer?: boolean;
  staff_note?: string;
};

export type OrderEditAddVariant = {
  id: number;
  allow_duplicates?: boolean;
  location_id: number;
  quantity: number;
  variant_id: number;
};

export type OrderEditSetLineItemDiscountRequest = {
  id: number;
  line_item_id: number | string;
  discount: OrderEditDiscountRequest;
};

interface OrderEditDiscountRequest {
  description?: string;
  fixed_value?: number;
  percent_value?: number;
  value_type?: "percentage" | "fixed_amount";
}

export type SelectedLineItemEdit = {
  isEditLineItemQuantity: boolean;
  isEditDiscountLineItem: boolean;
  selectedItem: CalculatedLineItem | undefined;
};

export type OrderEditAddCustomItemRequest = {
  id: number;
  price?: number;
  location_id: number;
  quantity: number;
  requires_shipping: boolean;
  taxable: boolean;
  title?: string;
};
//#endregion Order Edit

//#region create order

interface PaymentInfo {
  payment_id?: number;
  payment_method_id?: number;
  payment_bill_number?: string;
  reference?: string;
  payment_gateway?: string;
}
//#endregion create order

//#region combination
//Note: phần này thêm tương lai có thể dùng để xử lý tính trước data cho copy
export type CombinationCalculateDiscountAllocation = {
  amount: number;
  discount_application_index: number;
};
export type CombinationCalculateTaxLine = {
  rate: number;
  price: number;
  title: string;
  custom?: boolean;
};

export type CombinationCalculateLineItemRequest = {
  variant_id?: number;
  product_id?: number;
  token?: string;
  title?: string;
  variant_title?: string;
  sku?: string;
  unit?: string;
  vendor?: string;
  taxable?: boolean;
  requires_shipping?: boolean;
  grams?: number;
  quantity: number;
  price?: number;
  line_price?: number;
  variant_type: VariantUnionType;
  discount_allocations: CombinationCalculateDiscountAllocation[];
  tax_lines: CombinationCalculateTaxLine[];
  components: CombinationCalculateLineItemComponent[];
};

export type CombinationCalculateLineItemComponent = {
  variant_id: number;
  product_id: number;
  inventory_item_id?: number;
  sku?: string;
  title?: string;
  variant_title?: string;
  vendor?: string;
  unit?: string;
  inventory_management?: string;
  inventory_policy?: string;
  grams: number;
  requires_shipping: boolean;
  taxable: boolean;
  quantity: number;
  base_quantity: number;
  price: number;
  line_price: number;
  discount_allocations: CombinationCalculateDiscountAllocation;
  tax_lines: CombinationCalculateTaxLine[];
  source?: Omit<VariantUnionType, "normal">;
  can_be_odd: boolean;
};

export type CombinationCalculateRequest = {
  /**Có tính toán với thông tin mới nhất của sản phẩm không */
  update_product_info?: boolean;
  /**Có tính thuế hay không */
  calculate_tax?: boolean;
  /**Đánh dấu đơn miễn thuế */
  tax_exempt?: boolean;
  /**Giá có bao gồm thuế không */
  taxes_included?: boolean;
  /**Currency code */
  currency?: string;
  calculate_type?: CombinationCalculateType;
};
//#endregion combination
