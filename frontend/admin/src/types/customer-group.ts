import { PaginationFilter } from "./common";

export type CustomerGroup = {
  id: number;
  name: string;
  disjunctive?: boolean;
  type: CustomerGroupType;
  customers_count: number;
  catalogs_count: number;
  created_on: string;
  modified_on: string;
  rules: CustomerGroupRule[];
  note?: string;
};

export enum CustomerGroupType {
  MANUAL = "manual",
  AUTO = "auto",
}

export type CustomerGroupRule = {
  id: number;
  column: CustomerGroupConditionColumn;
  relation: CustomerGroupConditionRelation;
  condition: string;
};

export type CustomerGroupFilter = {
  name?: string;
  type?: CustomerGroupType;
  sort_key?: CustomerGroupSortKey;
  reverse?: boolean;
  ids?: string;
} & PaginationFilter;

type CustomerGroupSortKey = "id" | "created_on" | "modified_on";

export type CustomerGroupListResponse = {
  customer_groups: CustomerGroup[];
};

export type CustomerGroupResponse = {
  customer_group: CustomerGroup;
};

export type CustomerGroupRequest = {
  name?: string;
  type?: CustomerGroupType;
  disjunctive?: boolean;
  note?: string;
  rules: CustomerGroupRuleRequest[];
};

export type CustomerGroupRuleRequest = {
  customer_group_id?: number;
  id?: number;
  column: CustomerGroupConditionColumn;
  relation: CustomerGroupConditionRelation;
  condition: string;
};

export type CustomerGroupConditionColumn =
  | "total_spent"
  | "orders_count"
  | "accepts_marketing"
  | "state"
  | "tag"
  | "address"
  | "created_on";

export type CustomerGroupConditionRelation =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal"
  | "starts_with"
  | "ends_with"
  | "contains"
  | "not_contains"
  | "between";

export type CustomerGroupMember = {
  id: number;
  customer_id: number;
  customer_group_id: number;
  created_on: string;
  modified_on?: string;
};

export type CustomerGroupBulkRequest = {
  operation: "add_customer" | "delete_customer";
  ids: number[];
  customer_ids: number[];
};

export type CustomerGroupCustomerFilter = {
  query?: string;
} & PaginationFilter;

export type CustomerGroupCustomerImportRequest = {
  origin_key: string;
  receiver_email: string;
};

export type CustomerUpdateCustomersRequest = {
  customer_ids_to_add: number[];
  customer_ids_to_remove: number[];
};
