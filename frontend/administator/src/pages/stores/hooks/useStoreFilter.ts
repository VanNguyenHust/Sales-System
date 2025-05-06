import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fromQueryParams, toQueryParams } from "../utils/store-filter";
import { StoreFilterField, StoreFilterModel } from "../type";

export function useStoreFilter() {
  const [queryParams, setQueryParams] = useSearchParams();

  const { filter, query, page, limit } = useMemo(() => {
    const { filter, query, page, limit } = fromQueryParams(queryParams);

    return {
      filter,
      query,
      page,
      limit,
    };
  }, [queryParams]);

  const changeFilter = async (filter?: StoreFilterModel) => {
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

    queryParams.delete(StoreFilterField.page);
    toQueryParams(queryParams, filter);
    setQueryParams(queryParams);
  };

  const changeQuery = (query: string) => {
    if (query) {
      queryParams.set(StoreFilterField.query, query);
    } else {
      queryParams.delete(StoreFilterField.query);
    }
    queryParams.delete(StoreFilterField.page);
    setQueryParams(queryParams);
  };

  const changePage = (page: number) => {
    if (page) {
      queryParams.set(StoreFilterField.page, page.toString());
    } else queryParams.delete(StoreFilterField.page);
    setQueryParams(queryParams);
  };

  const changeLimit = (limit: number) => {
    if (limit) {
      queryParams.set(StoreFilterField.limit, limit.toString());
      queryParams.delete(StoreFilterField.page);
    } else queryParams.delete(StoreFilterField.limit);
    setQueryParams(queryParams);
  };

  return {
    filter,
    query,
    page,
    limit,
    changeFilter,
    changeQuery,
    changePage,
    changePerPage: changeLimit,
  };
}
