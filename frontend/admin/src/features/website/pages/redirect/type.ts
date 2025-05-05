import { DateRangeValue } from "app/types";

export enum RedirectFilterField {
  query = "query",
  created_on = "created_on",
  created_on_max = "created_on_max",
  created_on_min = "created_on_min",
  page = "page",
  limit = "limit",
  saved_search_id = "saved_search_id",
}
export interface RedirectFilterParams {
  query?: string;
  created_on?: string;
  created_on_max?: string;
  created_on_min?: string;
  save_search_id?: string;
}

export type RedirectFilterModel = {
  query?: string;
  createdOn?: DateRangeValue;
};
