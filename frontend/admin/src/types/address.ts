export interface Country {
  id: number;
  name: string;
  code: string;
}
export interface Province {
  id: number;
  name: string;
  code: string;
  country_id: number;
}

export interface District {
  id: number;
  name: string;
  code: string;
  province_id: number;
}

export interface Ward {
  id: number;
  name: string;
  code: string;
  district_code: string;
  province_id: number;
  district_id: number;
}

export interface ProvinceDistrict {
  id: string;
  province_id: number;
  province_code: string;
  province: string;
  district_id: number;
  district_code: string;
  district: string;
  label: string;
}

export interface CountryResponse {
  country: Country;
}

export interface CountriesResponse {
  countries: Country[];
}

export interface DistrictResponse {
  district: District;
}

export interface DistrictsResponse {
  districts: District[];
}

export interface ProvinceResponse {
  province: Province;
}

export interface ProvinciesResponse {
  provinces: Province[];
}

export interface WardsResponse {
  wards: Ward[];
}
