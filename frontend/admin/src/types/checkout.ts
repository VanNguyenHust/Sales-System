import { type BadgeProps } from "@/ui-components";

import { TextDateTransfer } from "app/components/DateTimeField";
import { StatusOption } from "app/features/order/type";
import { Customer, MailingAddress } from "app/types/customer";
import { BaseSearchFilter } from "app/types/order";

import { SaveSearch } from "./saveSearch";

export interface Checkout {
  id: number;
  token: string;
  cart_token?: string;
  email?: string;
  gateway?: string;
  buyer_accepts_marketing?: string;
  landing_site?: string;
  note?: string;
  referring_site?: string;
  taxes_included?: boolean;
  currency?: string;
  completed_on?: string;
  closed_on?: string;
  location_id?: number;
  source_identifier?: string;
  source_url?: string;
  device_id?: string;
  customer_locale?: string;
  source?: string;
  source_name?: string;
  customer_id?: number;
  created_on?: string;
  modified_on?: string;
  key?: string;
  total_line_items_price?: number;
  total_discounts?: string;
  total_weight?: string;
  order_id?: string;
  total_tax?: string;
  sub_total_price?: string;
  total_price?: string;
  abandoned_email_state?: string;
  abandoned_email_sent_on?: string;
  abandoned_checkout_url?: string;
  status?: string;
  billing_address?: MailingAddress;
  shipping_address?: MailingAddress;
  note_attributes?: any[];
  discount_codes?: any[];
  line_items?: CheckoutLineItem[];
  shipping_lines?: any[];
  customer?: Customer;
}

export interface CheckoutLineItem {
  id?: string;
  applied_discounts?: any[];
  key?: string;
  compare_at_price?: number;
  destination_location_id?: number;
  fulfillment_service?: string;
  gift_card?: boolean;
  line_price?: number;
  origin_location_id?: number;
  price?: number;
  product_id?: number;
  quantity?: number;
  requires_shipping?: boolean;
  sku?: string;
  taxable?: boolean;
  title?: string;
  variant_id?: number;
  variant_title?: string;
  vendor?: string;
  grams?: number;
  properties: {
    name: string;
    value: string;
  }[];
}

export interface CheckoutFilter extends BaseSearchFilter {
  saved_search_id?: string;
  ids?: string | number[]; // method get thì truyền 1,2,3 được trong khi method post phải truyền [1,2,3]
  email_statuses?: string;
  recovery_status?: string;
  statuses?: string;
  created_on_min?: string;
  created_on_max?: string;
  created_option?: TextDateTransfer;
}

export interface CheckoutListState {
  isLoading: boolean;
  checkouts?: Checkout[];
  totalCount?: number;
  checkoutFilter: CheckoutFilter;
  saveSearchTabs: SaveSearch[];
  saveSearchSelectedId: number | string;
  currentCustomer?: Customer;
  contact?: CheckoutContact;
}

export interface CheckoutContact {
  from?: string;
  subject?: string;
  custom_message?: string;
  sentOn?: Date;
}

export interface CheckoutRequest {
  note?: string | null;
}

export const EnumSaveSearchCheckout = {
  ALL: "all",
  SEARCH: "search",
};

export const saveSearchCheckoutDefault: SaveSearch[] = [
  {
    id: EnumSaveSearchCheckout.ALL,
    name: "Tất cả",
    is_default: true,
  },
];

export type CheckoutStatusType = "open" | "closed";
export type AbandonedEmailStateType = "sent" | "not_sent" | "scheduled";
export type RecoveredStatusType = "recovered" | "not_recovered";

export const CheckoutStatus: {
  [key: string]: {
    label: string;
    color: BadgeProps["status"];
  };
} = {
  open: {
    label: "Mở",
    color: "warning",
  },
  closed: {
    label: "Lưu trữ",
    color: "default",
  },
};

export const CheckoutStatusDisplayInList: {
  [key: string]: {
    label: string;
    color: BadgeProps["status"];
  };
} = {
  not_completed: {
    label: "Chưa hoàn tất",
    color: "warning",
  },
  completed: {
    label: "Hoàn tất",
    color: "default",
  },
};

export type CheckoutBulkActionOperation = "archive" | "unarchive" | "delete";

export interface CheckoutSetRequest {
  ids: number[];
  operation: CheckoutBulkActionOperation;
}

export const AbandonedEmailStateStatus: {
  [key: string]: {
    label: string;
    color: BadgeProps["status"];
  };
} = {
  sent: {
    label: "Đã gửi",
    color: "default",
  },
  not_sent: {
    label: "Chưa gửi",
    color: "warning",
  },
  scheduled: {
    label: "Hẹn giờ gửi",
    color: "success",
  },
};

export const RecoveredStatus: {
  [key: string]: {
    label: string;
    color: BadgeProps["status"];
  };
} = {
  not_recovered: {
    label: "Chưa hoàn tất",
    color: "warning",
  },
  recovered: {
    label: "Hoàn tất",
    color: "success",
  },
};

export const CheckoutStatusConst = CheckoutStatus as StatusOption;
export const AbandonedEmailStatusConst = AbandonedEmailStateStatus as StatusOption;

export const RecoveryStatusConst = RecoveredStatus as StatusOption;
