type PriceRuleSortKey = "id" | "starts_on" | "ends_on";
export type DiscountType = PromotionPriceRule["value_type"] | PriceRule["value_type"] | "free_shipping";
export type DiscountCategory = "product" | "order" | "free_shipping" | "buy_x_get_y";
export type DiscountValueType = "percentage" | "fixed_amount" | "fixed_price";
export type DiscountStatus = "active" | "expired" | "scheduled";
export type DiscountBulkAction = "delete" | "activate" | "deactivate";
export type PriceRuleSortType =
  | "created_on_desc"
  | "created_on_asc"
  | "starts_on_desc"
  | "starts_on_asc"
  | "ends_on_desc"
  | "ends_on_asc";

export type PriceRuleRequest = Without<
  PriceRule,
  "id" | "times_used" | "created_on" | "modified_on" | "entitled_country_ids" | "status"
>;
export type DiscountClass = "product" | "order" | "shipping";
export type RuleTypeDiscount = "code" | "promotion";
export type DiscountCode = {
  id: number;
  code: string;
  usage_count: number;
  created_on: string;
  modified_on: string;
  price_rule_id?: number;
};

export type DiscountCodeRequest = {
  code: string;
};

export type DiscountCodeResponse = {
  discount_code: DiscountCode;
};

export type DiscountCodesResponse = {
  discount_codes: DiscountCode[];
};

export type PriceRuleResponse = {
  price_rule: PriceRule;
};

export type PriceRulesResponse = {
  price_rules: PriceRule[];
};

export type CombinedPriceRulesResponse = {
  combined_price_rules: PriceRule[];
};

export type PriceRule = {
  id: number;
  title: string;
  rule_type: RuleTypeDiscount;
  value: string;
  starts_on: string;
  ends_on?: string;
  times_used: number;
  created_on: string;
  modified_on: string;
  status: DiscountStatus;
  value_type: "percentage" | "fixed_amount";
  customer_selection: "prerequisite" | "all";
  location_selection: "prerequisite" | "all";
  target_type: "line_item" | "shipping_line";
  target_selection: "entitled" | "all";
  allocation_method: "across" | "each";
  once_per_customer: boolean;
  usage_limit?: number | null;
  exclude_type: boolean;
  value_limit_amount?: string;
  entitled_product_ids: number[];
  entitled_variant_ids: number[];
  entitled_collection_ids: number[];
  entitled_country_ids: number[];
  entitled_province_ids: number[];
  prerequisite_sale_total_range?: PrerequisiteAmountGreaterOrEqualThan;
  prerequisite_subtotal_range?: PrerequisiteAmountGreaterOrEqualThan;
  prerequisite_quantity_range?: PrerequisiteQuantityGreaterOrEqualThan;
  prerequisite_shipping_price_range?: PrerequisiteAmountLessOrEqualThan;
  prerequisite_customer_group_ids: number[];
  prerequisite_saved_search_ids?: number[];
  prerequisite_location_ids: number[];
  channel_ids?: string[] | null;
  discount_class?: DiscountClass;
  prerequisite_product_ids: number[];
  prerequisite_variant_ids: number[];
  prerequisite_collection_ids: number[];
  prerequisite_to_entitlement_quantity_ratio?: PrerequisiteToEntitlementQuantityRatio;
  prerequisite_to_entitlement_purchase?: PrerequisiteToEntitlementPurchase;
  allocation_limit?: number | null;
  combines_with?: CombinesWith;
  summary?: string;
};

export type CombinesWith = {
  order_discount: boolean;
  product_discount: boolean;
  shipping_discount: boolean;
};

export type PriceRuleFilterRequest = {
  query?: string;
  page?: number;
  limit?: number;
  sort_key?: PriceRuleSortKey;
  created_on_min?: string;
  created_on_max?: string;
  modified_on_min?: string;
  modified_on_max?: string;
  starts_on_min?: string;
  starts_on_max?: string;
  ends_on_min?: string;
  ends_on_max?: string;
  status?: "active" | "expired" | "scheduled";
  times_used?: number;
  times_used_not?: number;
  times_used_min?: number;
  times_used_max?: number;
  ids?: number[];
  discount_type?: DiscountType;
  discount_category?: DiscountCategory;
  value_type?: DiscountValueType;
  sort_by?: PriceRuleSortType;
  reverse?: boolean;
  channel_ids_include?: string[];
  channel_ids_exclude?: string[];
  discount_class?: DiscountClass;
  combines_withs?: DiscountClass[];
  exclude_ids?: number[];
  rule_type?: RuleTypeDiscount;
};

export type DiscountExportRequest = {
  receiver_email?: string;
  export_type?: "all" | "current_page" | "current_selected" | "current_filter";
  receiver_user_id?: number;
  filter?: PriceRuleFilterRequest;
};

export type PromotionPriceRule = {
  id: number;
  title: string;
  value: string;
  rule_type: RuleTypeDiscount;
  starts_on: string;
  ends_on?: string;
  times_used: number;
  created_on: string;
  modified_on: string;
  status: DiscountStatus;
  value_type: "percentage" | "fixed_amount" | "fixed_price";
  target_type: "line_item";
  target_selection: "entitled" | "all";
  allocation_method: "across" | "each";
  entitled_product_ids: number[];
  entitled_variant_ids: number[];
  entitled_collection_ids: number[];
  prerequisite_subtotal_range?: PrerequisiteAmountGreaterOrEqualThan;
  prerequisite_quantity_range?: PrerequisiteQuantityGreaterOrEqualThan;
  channel_ids?: string[];
  discount_class?: DiscountClass;
  prerequisite_product_ids: number[];
  prerequisite_variant_ids: number[];
  prerequisite_collection_ids: number[];
  prerequisite_to_entitlement_quantity_ratio?: PrerequisiteToEntitlementQuantityRatio;
  prerequisite_to_entitlement_purchase?: PrerequisiteToEntitlementPurchase;
  allocation_limit?: number | null;
  combines_with?: CombinesWith;
  summary?: string;
  location_selection: "prerequisite" | "all";
  prerequisite_location_ids: number[];
};

export type PromotionPriceRuleRequest = Without<
  PromotionPriceRule,
  "id" | "times_used" | "created_on" | "modified_on" | "status"
>;

export type PromotionPriceRulesResponse = {
  promotion_price_rules: PromotionPriceRule[];
};

export type PromotionPriceRuleResponse = {
  promotion_price_rule: PromotionPriceRule;
};

export type CombinesWithCount = {
  order_discount_count: number;
  product_discount_count: number;
  shipping_discount_count: number;
};

export type PriceRuleCombinesWithCounts = {
  discount: CombinesWithCount;
  promotion: CombinesWithCount;
};

export type PriceRuleCombinesWithCountsResponse = {
  price_rule_combines_with_counts: PriceRuleCombinesWithCounts;
};

type PrerequisiteAmountGreaterOrEqualThan = {
  greater_than_or_equal_to: number;
};
type PrerequisiteQuantityGreaterOrEqualThan = {
  greater_than_or_equal_to: number;
};
type PrerequisiteAmountLessOrEqualThan = {
  less_than_or_equal_to: number;
};
type PrerequisiteToEntitlementQuantityRatio = {
  prerequisite_quantity?: number | null;
  entitled_quantity?: number | null;
};
type PrerequisiteToEntitlementPurchase = {
  prerequisite_amount?: number | null;
};

export type DiscountBatchRequest = {
  batch_type: "delete" | "activate" | "deactivate";
  ids: string[];
};
