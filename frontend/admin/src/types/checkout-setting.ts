export type CheckoutSettingResponse = {
  checkout_setting: CheckoutSetting;
};

export type CheckoutSetting = {
  id: number;
  customer_account: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  ward: string;
  country: string;
  zip: string;
  same_billing_and_shipping_address: boolean;
  using_checkout_multi_step: boolean;
  recaptcha_enabled: boolean;
  order_closing: string;
  checkout_configuration_content: string;
  refund_policy: string;
  privacy_policy: string;
  terms_of_service: string;
  created_on: string;
  modified_on?: string | null;
  checkout_footer: string;
  template_layout?: string | null;
  abandoned_checkout_email_time_delay?: number | null;
};
