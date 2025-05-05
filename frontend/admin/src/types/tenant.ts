import { Location } from "./location";
import { StoreSettingResponse } from "./storeSetting";
import { TimeZone } from "./timezone";

export interface Tenant {
  id: number;
  name: string;
  email: string;
  customer_email: string;
  phone?: string;
  country_code: string;
  country?: string;
  currency: string;
  timezone: string;
  money_format: string;
  money_with_currency_format: string;
  domain: string;
  alias: string;
  sapo_domain: string;
  sso: boolean;
  plan_name: string;
  plan_display_name: string;
  created_on: string;
  weight_unit: string;
  address: string;
  trade_name: string;
  province_code: string;
  max_volumn: number;
  used_volumn: number;
  store_owner: string;
  force_ssl: boolean;
  max_user: number | null;
  max_location: number | null;
}

export type TenantUpdateRequest =
  | {
      email: string | null;
      customer_email: string | null;
      phone_number: string | null;
      country_code: string | null;
      province_code: string | null;
      currency: string | null;
      timezone: string | null;
      money_format: string | null;
      money_with_currency_format: string | null;
      weight_unit: string | null;
      list_store_setting: { setting_key: string; setting_value: string }[];
    }
  | {
      list_store_setting: { setting_key: string; setting_value: string }[];
    };

export interface TenantState {
  tenant?: Tenant;
  initializing?: number;
  currency?: CurrencyResponse;
  timezone?: TimeZone;
  settings?: StoreSettingResponse[];
  currencies?: CurrencyResponse[];
  feature?: { [key in string]: boolean };
}

export interface TenantResponse {
  store: Tenant;
}
//TODO: de-duplicate interface
export type CurrencyResponse = {
  id: number;
  name: string;
  code: string;
  culture_code: string;
  symbol: string;
  symbol_position: boolean;
  currency_decimal_digits: number;
};
