import { ReactElement } from "react";

export type ShippingSetting = {
  id?: number;
  weight_type?: "product" | "custom";
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  requirement?: number;
  note?: string;
  allow_auto_receive?: boolean;
};

export type ShippingProfile = {
  id?: number;
  shipping_locations?: ShippingProfileLocation[];
  shipping_zones?: ShippingZone[];
};

export type ShippingProfileLocation = {
  id?: number;
  location_id?: number;
  location_name?: string;
  shipping_profile_id?: number;
};

export type ShippingZone = {
  id?: number;
  shipping_profile_id?: number;
  province_code?: string;
  province?: string;
  customized_shipping_rates?: CustomizedShippingRate[];
  carrier_shipping_rates?: CarrierShippingRate[];
};

export type CarrierShippingRate = {
  id?: number;
  shipping_zone_id?: number;
  carrier_code?: string;
  carrier_name?: string;
  display_estimated_delivery_on?: boolean;
  modified_value?: number;
  modified_type?: "PERCENTAGE" | "AMOUNT";
};

export type CustomizedShippingRate = {
  id?: number;
  shipping_zone_id?: number;
  name?: string;
  general_shipping_fee?: number;
  estimated_delivery_on?: string;
  min_weight?: number;
  max_weight?: number;
  min_order_value?: number;
  max_order_value?: number;
  customized_district_shipping_rates?: CustomizedDistrictShippingRate[];
};

export type CustomizedDistrictShippingRate = {
  id?: number;
  customized_shipping_rate_id?: number;
  district_code?: string;
  district_id?: string;
  district?: string;
  modified_value?: number | string;
  delivery_support?: boolean;
};

export type DeleteChoiceOption = {
  id: number | string;
  type:
    | "location"
    | "shipping_profile"
    | "shipping_zone"
    | "customized_shipping_rate"
    | "carrier_shipping_rate"
    | "customized_district_shipping_rate"
    | "location_group_zone";
  title: string;
  label: ReactElement;
  shippingAreaId?: number;
  provinceCode?: string;
};

export type SelectedFeeSetting = {
  shippingRateId?: number;
  carrierShippingRateProviderId?: number;
  type?: "customized" | "carrier";
  shippingAreaId?: number;
  provider?: string;
  providerList?: string[];
};

export type LocationGroupZone = {
  id?: number;
  name?: string;
  store_id?: number;
  pickup_areas?: PickupArea[];
  shipping_areas?: ShippingArea[];
};

export type PickupArea = {
  id?: number;
  store_id?: number;
  location_group_zone_id?: number;
  location_id?: number;
  location_name?: string;
};

export type ShippingArea = {
  id?: number;
  province_id?: string | number;
  province_code?: string;
  province_name?: string;
  group_name?: string;
  shipping_area_details?: ShippingAreaDetail[];
  location_group_zone_id?: number;
  shipping_rates?: ShippingRate[];
  carrier_shipping_rate_providers?: CarrierShippingRateProvider[];
};

export type ShippingAreaDetail = {
  id?: number;
  shipping_area_id?: number;
  province_id?: string | number;
  province_code?: string;
  province_name?: string;
};

export type ShippingRate = {
  id?: number;
  shipping_area_id?: number;
  name?: string;
  price?: number;
  up_price_range?: number | null;
  down_price_range?: number | null;
  type?: "price_and_weight_based" | "price_based" | "weight_based" | "none";
  up_weight_range?: number | null;
  down_weight_range?: number | null;
  district_rates?: DistrictRate[];
  estimated_delivery_on?: string;
};

export type CarrierShippingRateProvider = {
  id?: number;
  shipping_area_id?: number;
  carrier_id?: number;
  flat_modifier?: number;
  percent_modifier?: number;
  show_delivery_time?: boolean;
  provider_code?: string;
  modified_type?: "PERCENTAGE" | "AMOUNT";
  modified_value?: number;
  service_code?: "Standard";
  service_name?: string;
  service_filter?: {
    "*": "+";
  };
};

export type DistrictRate = {
  id?: number;
  shipping_rate_id?: number;
  adjusted_price?: number;
  district_id?: number;
  province_id?: number;
  delivery_support?: boolean;
};

export type ShippingFeeSetting = {
  id?: number;
  carrier_id?: number;
  service_name?: string;
  service_code?: string;
  active?: boolean;
  provider_code?: string;
  pick_config_type?: string;
  business_version?: string;
};
//endregion
