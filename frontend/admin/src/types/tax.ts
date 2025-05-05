export type TaxSetting = {
  id?: number;
  status?: "active" | "inactive";
  tax_included?: boolean;
  tax_shipping?: boolean;
};

// remove after migrate to TaxSetting
export type TaxSettingRespone = {
  id: number;
  storeId: number;
  status: string;
  tax_included: boolean;
  tax_shipping: boolean;
};

export type TaxCountryResponse = {
  country_tax: TaxCountry;
  tax_override_zones: TaxOverride[];
};

export type TaxCountry = {
  id?: number;
  country_name?: string;
  country_code?: "VN";
  tax_rate?: number;
  tax_name?: "VAT";
};

export type OverrideZoneReponse = {
  id?: number;
  override_zone_id?: number;
  zone_id?: number;
  tax_override_id?: number;
  code?: string;
  name?: string;
  tax_rate_input?: number | null;
  tax_rate_output?: number | null;
  tax_rate_shipping?: number | null;
  zone_type?: "COUNTRY" | "PROVINCE";
  is_update?: boolean;
};

export type TaxOverride = {
  id?: number;
  id_number?: number;
  tax_country_id?: number;
  collection_id?: number;
  collection_name?: string;
  country_code?: "VN";
  shipping_override?: boolean;
  override_zones: OverrideZoneReponse[];
};

export type TaxOverrideZoneRequest = {
  id?: number;
  collection_name?: string;
  collection_id?: number | null;
  country_code: "VN";
  shipping_override: boolean;
  zone: "COUNTRY" | "PROVINCE";
  tax_rate_input?: number;
  tax_rate_output?: number;
  tax_rate_shipping?: number;
  zone_tax_id: number;
  isUpdate?: boolean;
  is_empty_override?: boolean;
};

export type TaxSettingRequest = {
  status: "active" | "inactive";
  tax_included: boolean;
  tax_shipping: boolean;
};

export type TaxCountryRequest = {
  country_code: "VN";
  tax_rate: number;
  tax_name: "VAT";
};

export type OverrideZoneUpdateRequest = {
  id?: number;
  tax_rate_input?: number | null;
  tax_rate_output?: number | null;
  tax_rate_shipping?: number | null;
};
