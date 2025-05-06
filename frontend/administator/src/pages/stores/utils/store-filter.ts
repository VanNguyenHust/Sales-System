import { StoreFilterField, StoreFilterModel } from "../type";

export function fromQueryParams(queryParams: URLSearchParams) {
  const query = queryParams.get(StoreFilterField.query) || "";
  const province = queryParams.get(StoreFilterField.province) || "";
  const status = queryParams.get(StoreFilterField.status) || "";

  let page = 1;
  const pageQ = queryParams.get(StoreFilterField.page);
  if (pageQ) {
    page = parseInt(pageQ);
  }

  let limit = 20;
  const limitQ = queryParams.get(StoreFilterField.limit);
  if (limitQ) {
    limit = parseInt(limitQ);
  }

  return {
    query,
    filter: {
      ...{ status: status, province: province },
    },
    page,
    limit,
  };
}

export function toQueryParams(
  queryParams: URLSearchParams,
  filter?: StoreFilterModel
) {
  if (filter?.status !== undefined) {
    queryParams.set(StoreFilterField.status, filter.status);
  } else {
    queryParams.delete(StoreFilterField.status);
  }
  if (filter?.province) {
    queryParams.set(StoreFilterField.province, filter.province);
  } else {
    queryParams.delete(StoreFilterField.province);
  }
  return queryParams;
}
