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
