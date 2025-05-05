export type StoreSetting = {
  id: number;
  name: string;
  trade_name: string;
  email: string;
  customer_email: string;
  phone?: string;
  currency: string;
  timezone: string;
  money_format: string;
  money_with_currency_format: string;
  domain: string;
  alias: string;
  sapo_domain: string;
  sso: boolean;
  plan_name: string;
  created_on: string;
  address: string | null;
  country: string | null;
  country_code: string | null;
  province: string | null;
  province_code: string | null;
  district: string | null;
  district_code: string | null;
  weight_unit: string;
  cost_price: string;
  order_prefix: string;
  order_suffix: string;
  inventory_management: string;
};

export type StoreSettingResponse = {
  setting_key: string;
  setting_value: string;
};
export type OrderCode = {
  order_prefix: string;
  order_suffix: string;
};

export type StoreSettings = {
  setting_key?: string;
  setting_value?: string;
};
