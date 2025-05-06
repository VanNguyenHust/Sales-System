export type StoreFilterModel = {
  status?: string;
  province?: string;
};

export enum StoreFilterField {
  query = "query",
  status = "status",
  province = "province",
  page = "page",
  limit = "limit",
}
