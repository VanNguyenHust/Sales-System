import { PaginationFilter } from "./common";

export type Location = {
  id: number;
  code?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  country?: string;
  country_code?: string | null;
  province?: string;
  province_code?: string | null;
  district?: string;
  district_code?: string | null;
  ward?: string;
  ward_code?: string | null;
  address1?: string | null;
  address2?: string;
  zip?: string;
  fulfill_order: boolean;
  inventory_management?: boolean;
  deactive_inventory_at?: Date;
  default_location: boolean;
  offline_store: boolean;
  start_date?: Date | null;
  end_date?: Date | null;
  created_on?: Date;
  modified_on?: Date;
  status: LocationStatus;
};

export type LocationPriority = Location & {
  rank: number;
};

export type LocationFilter = PaginationFilter & {
  query?: string;
  ids?: string;
  inventory_management?: boolean | null;
  fulfill_order?: boolean | null;
  statuses?: LocationStatus[];
};

export type LocationStatus = "active" | "expired";
