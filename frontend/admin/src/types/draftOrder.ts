import { type BadgeProps } from "@/ui-components";

import { TextDateTransfer } from "app/components/DateTimeField/types";
import { Customer, MailingAddress } from "app/types/customer";
import { SaveSearch } from "app/types/saveSearch";
import { User } from "app/types/user";

import { DiscountClass, DiscountValueType } from "./discount";
import { InventoryLevelResponse } from "./inventory";
import { Location } from "./location";
import {
  AppliedDiscount,
  BaseSearchFilter,
  CompleteDraftOrder,
  DiscountAllocation,
  DiscountApplication,
  DraftTaxLine,
  NonApplicableReasonCode,
  OrderLineItem,
  RuleType,
  ShippingLineDraftOrder,
} from "./order";
import { Image, VariantUnionType } from "./product";
import { InventoryPolicy } from "./variant";

export interface DraftOrder {
  id?: number;
  store_id?: number;
  tax_exempt?: boolean;
  location_id?: number;
  user_id?: number;
  assignee_id?: number;
  source_name?: string;
  note?: string;
  currency: string;
  created_on?: string;
  modified_on?: string;
  name?: string;
  status: DraftOrderStatus;
  order_id?: number;
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
  subtotal_price?: number;
  total_price: number;
  billing_address?: MailingAddress;
  shipping_address?: MailingAddress;
  /**@deprecated */
  applied_discount?: AppliedDiscount;
  /**@deprecated */
  shipping_line?: ShippingLineDraftOrder;
  note_attributes?: NoteAttribute[];
  customer?: Customer;
  line_items?: OrderLineItem[];
  tax_lines?: DraftTaxLine[];
  discount_applications?: DraftOrderDiscountApplication[];
  discount_violations?: DraftOrderDiscountApplication[];
  applied_discounts?: AppliedDiscount[];
  shipping_lines?: ShippingLineDraftOrder[];
  discount_codes?: DraftOrderDiscountCode[];
  automatic_discounts_override: boolean;
  expected_payment_method_id?: number;
  customer_group_id?: number;
}

export interface DraftOrderResponse {
  draft_order: DraftOrder;
}

export interface DraftOrderFilter extends BaseSearchFilter {
  saved_search_id?: string;
  ids?: string;
  status?: "completed" | "open";
  statuses?: string;
  assignee_ids?: string;
  location_ids?: string;
  customer_ids?: string;
  since_ids?: string;

  tags?: string;

  created_on_min?: string;
  created_on_max?: string;
  created_option?: TextDateTransfer;
  modified_on_min?: string;
  modified_on_max?: string;
  modified_option?: TextDateTransfer;
}
export interface DraftOrderExportFilter extends BaseSearchFilter {
  ids?: number[];
  statuses?: string[];
  assignee_ids?: number[];
  location_ids?: number[];
  customer_ids?: number[];
  since_ids?: number[];
  tags?: string[];
  created_on_min?: string;
  created_on_max?: string;
  modified_on_min?: string;
  modified_on_max?: string;
  export_draft_orders_type?: string;
}

export const DraftOrderFilterNumberFields = ["page", "limit"];
export interface DraftOrderFilterState {
  customers?: Customer[];
  locations?: Location[];
}
export interface DraftOrderListState {
  isLoading: boolean;
  draftOrders?: DraftOrder[];
  totalCount?: number;
  draftOrderFilter: DraftOrderFilter;
  saveSearchTabs: SaveSearch[];
  saveSearchSelectedId: number | string;
  filterState: DraftOrderFilterState;
}

export interface DraftOrderDetailState {
  isLoading: boolean;
  draftOrder?: DraftOrder;
  location?: Location;
  assignee?: User;
  customer?: Customer;
  error?: string;
}

export const EnumSaveSearchDraftOrder = {
  ALL: "all",
  OPEN: "open",
  COMPLETED: "completed",
  SEARCH: "search",
};

export const saveSearchDefault: SaveSearch[] = [
  {
    id: EnumSaveSearchDraftOrder.ALL,
    name: "Đơn hàng nháp",
    query: '{"statuses":"open"}',
    is_default: true,
  },
  {
    id: EnumSaveSearchDraftOrder.COMPLETED,
    name: "Đã hoàn thành",
    query: '{"statuses":"completed"}',
    is_default: true,
  },
];
export const DraftOrderStatusObject = {
  completed: {
    label: "Đã hoàn thành",
    color: "default",
  },
  open: {
    label: "Chưa hoàn thành",
    color: "warning",
  },
};
export type DraftOrderStatus = keyof typeof DraftOrderStatusObject;

export const DraftOrderStatusConst = DraftOrderStatusObject as {
  [key: string]: {
    label: string;
    color: BadgeProps["status"];
  };
};

export interface CreateDraftOrderLineItem {
  variant_id?: number;
  product_id?: number;
  variantTitle?: string;
  quantity: number;
  requires_shipping?: boolean;
  sku?: string;
  title?: string;
  taxable?: boolean;
  fulfillment_service?: string;
  grams?: number;
  price: number;
  vendor?: string;
  properties?: {
    name?: string;
    value?: string;
  }[];
  applied_discount: AppliedDiscount;
}
export interface CreateUpdateDraftOrderRequest {
  id?: number;
  note?: string;
  complete?: CompleteDraftOrder;
  tags?: string;
  email?: string | null;
  phone?: string | null;
  currency?: string;
  location_id?: number;
  source_name?: string;
  assignee_id?: number;
  copy_order_id?: number;
  tax_exempt?: boolean;
  billing_address?: MailingAddress | null;
  shipping_address?: MailingAddress | null;
  applied_discount?: AppliedDiscount | null;
  shipping_line?: ShippingLineDraftOrder | null;
  customer?: {
    id?: number | null;
  } | null;
  line_items?: CreateDraftOrderLineItem[];
  note_attributes: NoteAttribute[];
}

export type NoteAttribute = {
  name: string;
  value?: string;
};

export type DraftOrderAppliedDiscount = {
  title?: string;
  description?: string;
  value: number;
  value_type: DiscountValueType;
  amount: number;
  custom?: boolean;
};
export type DraftAppliedDiscountRequest = Omit<DraftOrderAppliedDiscount, "amount">;

export type DraftOrderLineItemRequest = {
  token: string;
  variant_id?: number;
  product_id?: number;
  title?: string;
  variant_title?: string;
  requires_shipping?: boolean;
  taxable?: boolean;
  sku?: string;
  vendor?: string;
  quantity: number;
  price?: number;
  gram?: number;
  fulfillment_service?: string;
  properties?: NoteAttribute[];
};
export type DraftOrderCustomerRequest = { id: number };

export type DraftOrderShippingLineRequest = {
  title?: string;
  alias?: string;
  price: number;
  source?: string;
  custom?: boolean;
  /**@deprecated bỏ field này sử dụng*/
  code?: string;
};

export type DraftOrderRequest = {
  id?: number;
  note?: string | null;
  tags?: string[];
  email?: string | null;
  phone?: string | null;
  source_name?: string;
  location_id?: number;
  assignee_id?: number | null;
  copy_order_id?: number;
  use_customer_default_address?: boolean;
  tax_exempt?: boolean;
  currency?: string;
  billing_address?: MailingAddress | null;
  shipping_address?: MailingAddress | null;
  customer?: DraftOrderCustomerRequest | null;
  customer_group_id?: number | null;
  line_items: DraftOrderLineItemRequest[];
  note_attributes?: NoteAttribute[];
  // metafields?: MetafieldRequest[];
  /**@deprecated chuyển sang sử dụng applied_discounts*/
  applied_discount?: DraftAppliedDiscountRequest;
  applied_discounts?: DraftAppliedDiscountRequest[];
  shipping_line?: DraftOrderShippingLineRequest;
  shipping_lines?: DraftOrderShippingLineRequest[];
  discount_codes?: DraftOrderDiscountCodeRequest[];
  automatic_discounts_override?: boolean;
  expected_payment_method_id?: number;
};

export type DraftOrderUpdateRequest = DraftOrderRequest & {
  id: number;
};

export type DraftOrderCompleteRequest = {
  payment_pending?: boolean;
  is_reorder?: boolean;
  payment_amount?: number;
  payment_gateway_id?: number;
  delivery_method?: "shipping" | "pickup";
  carrier_name?: string;
  carrier?: string;
  inventory_behaviour: InventoryBehaviour;
};

export type SaveAndCompleteDraftOrderRequest = DraftOrderRequest & {
  complete: DraftOrderCompleteRequest;
};

export type InventoryBehaviour =
  | "decrement_ignoring_policy"
  | "decrement_obeying_policy"
  | "decrement_obeying_policy_in_specify_location";

export type DraftOrderCalculateLineItemView = {
  inventoryLevels?: InventoryLevelResponse[];
  component?: DraftLineItemComponent[];
};

export type CalculateDraftOrder = Omit<DraftOrder, "line_items"> & {
  is_billing_address_matches_shipping_address: boolean;
  line_items: DraftOrderLineItem[];
};

export type DraftLineItemComponent = {
  variant_id: number;
  product_id: number;
  image?: Image;
  title: string;
  variant_title?: string;
  sku?: string;
  unit?: string;
  base_quantity: number;
  price: number;
  line_price: number;
  quantity: number;
  tax_lines: DraftTaxLine[];
  discount_allocations: DiscountAllocation[];
  discounted_total: number;
  inventory_item_id?: number;
  inventory_policy?: InventoryPolicy;
  inventory_management?: string;
  //Note: thêm để xử lý giao diện
  inventoryLevel?: InventoryLevelResponse;
  taxable: boolean;
  requires_shipping?: boolean;
  grams: number;
  /**Thêm để xử lý giao diện edit draft khi chưa calculate */
  isProductDeleted?: boolean;
};

export type DraftOrderLineItem = {
  token: string;
  variant_id?: number;
  product_id?: number;
  inventory_item_id?: number;
  title: string;
  variant_title?: string;
  name?: string;
  sku?: string;
  vendor?: string;
  unit?: string;
  item_unit?: string;
  type: VariantUnionType;
  price: number;
  discounted_total: number;
  discounted_unit_price: number;
  total_original: number;
  quantity: number;
  grams: number;
  custom: boolean;
  taxable: boolean;
  requires_shipping: boolean;
  fulfillment_service?: string;
  inventory_policy?: InventoryPolicy;
  inventory_management?: string;
  image?: Image;
  /**@description hạn chế sử dụng field này dùng discount_allocations */
  applied_discount?: DraftOrderAppliedDiscount;
  discount_allocations?: DiscountAllocation[];
  components?: DraftLineItemComponent[];
  properties?: NoteAttribute[];
  tax_lines?: DraftTaxLine[];
};

export type DraftOrderLineItemComponentView = DraftLineItemComponent & {
  /**@description Field dùng để hiển thị màn tạo đơn xác định inventory của sản phẩm thành phần của combo packsize tại kho đang chọn */
  inventoryLevel?: InventoryLevelResponse;
};

export interface DraftOrderLineItemView extends Omit<DraftOrderLineItem, "components"> {
  /**@description Field dùng để hiển thị màn tạo đơn xác định inventory tại kho đang chọn */
  inventoryLevel?: InventoryLevelResponse;
  components?: DraftOrderLineItemComponentView[];
}

export type DraftOrderDiscountCodeRequest = {
  code: string;
  /**Thêm để xử lý hiển thị trên giao diện */
  summary?: string;
};

export type DraftOrderDiscountApplication = DiscountApplication & {
  id?: number;
  non_applicable_reason?: string;
  non_applicable_reason_code?: NonApplicableReasonCode;
  applicable?: boolean;
};

export type DraftOrderDiscountCode = {
  code: string;
  amount: number;
  type: DiscountClass;
};
