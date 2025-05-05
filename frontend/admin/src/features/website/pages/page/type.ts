export enum PageFilterField {
  query = "query",
  published = "published",
  page = "page",
  limit = "limit",
  saved_search_id = "saved_search_id",
}
export interface PageFilterParams {
  query?: string;
  published?: string;
  save_search_id?: string;
}

export type PageFilterModel = {
  query?: string;
  published?: string;
};
