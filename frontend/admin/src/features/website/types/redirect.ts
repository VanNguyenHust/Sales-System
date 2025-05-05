import { PaginationFilter } from "app/types";

export type RedirectFilter = PaginationFilter & {
  query?: string;
  created_on_max?: string;
  created_on_min?: string;
};

export type Redirect = {
  id: number;
  path: string;
  target: string;
  created_on: string;
};

export type RedirectRequest = {
  path: string;
  target: string;
};

export type RedirectImportRequest = {
  file_name: string;
  file_data: any;
  size: number;
  override_if_exist: boolean;
  receiver_email?: string;
  user_id: number;
};
