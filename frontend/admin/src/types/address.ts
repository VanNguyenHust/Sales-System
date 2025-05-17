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
