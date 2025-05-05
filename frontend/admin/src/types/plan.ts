import { PaginationFilter } from "./common";

export enum ChargeStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  FAILURE = "failure",
  PENDING = "pending",
}

export type ChargeItemType = "theme" | "app" | "affiliate" | "store" | "info" | "automation";

export type ChargeRequest = {
  type: string;
  user_id: number;
  item_type: string;
  item_id?: number;
  item_alias: string;
  item_name: string;
  partner_id?: number;
  amount: number;
};

export type ChargeFilterRequest = PaginationFilter & {
  item_types?: ChargeItemType[];
};

export type Charge = {
  id: number;
  type: string;
  item_type: ChargeItemType;
  item_id: number;
  item_alias: string;
  item_name: string;
  partner_id: number;
  period?: number;
  amount: number;
  fee_amount: number;
  real_amount: number;
  created_on: Date;
  modified_on?: Date;
  trial_days?: number;
  trial_ends_on?: Date;
  start_date?: Date;
  end_date?: Date;
  payment_method: string;
  status: ChargeStatus;
  transaction_source: string;
  transaction_id: string;
  withdrawal_id?: number;
  extra_fee: number;
};

export type ChargesResponse = {
  charges: Charge[];
};
