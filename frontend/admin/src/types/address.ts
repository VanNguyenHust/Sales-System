export type FilterCountryRequest = {
  query?: string;
};

export type FilterProvinceRequest = {
  query?: string;
};

export type FilterDistrictRequest = {
  query?: string;
  provinceCode?: string;
};

export type FilterWardRequest = {
  query?: string;
  provinceCode?: string;
  districtCode?: string;
};

export type CountryResponse = {
  id: number;
  name: string;
  code: string;
};

export type ProvinceResponse = {
  id: number;
  name: string;
  code: string;
  country_id: number;
};

export type DistrictResponse = {
  id: number;
  name: string;
  code: string;
  province_id: number;
};

export type WardResponse = {
  id: number;
  name: string;
  code: string;
  district_id: number;
};
