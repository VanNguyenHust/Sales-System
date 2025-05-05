import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

enum SimpleFiltersQuery {
  query = "query",
  limit = "limit",
  page = "page",
}

export function useSimpleFiltersQuery() {
  const [queryParams, setQueryParams] = useSearchParams();

  const { query, page, limit } = useMemo(() => {
    // eslint-disable-next-line prefer-const
    let { query, page, limit } = fromQueryParams(queryParams);

    return { query, page, limit };
  }, [queryParams]);

  const changeQuery = (query: string) => {
    if (query) {
      queryParams.set(SimpleFiltersQuery.query, query);
    } else {
      queryParams.delete(SimpleFiltersQuery.query);
    }
    queryParams.delete(SimpleFiltersQuery.page);
    setQueryParams(queryParams);
  };

  const changePage = (page: number) => {
    queryParams.set(SimpleFiltersQuery.page, page.toString());
    setQueryParams(queryParams);
  };

  const changePerPage = (perPage: number) => {
    queryParams.set(SimpleFiltersQuery.limit, perPage.toString());
    setQueryParams(queryParams);
  };

  return {
    query,
    page,
    limit,
    changeQuery,
    changePage,
    changePerPage,
  };
}

function fromQueryParams(qs: URLSearchParams): {
  query: string;
  page: number;
  limit: number;
} {
  const query = qs.get(SimpleFiltersQuery.query) || "";

  let page = 1;
  const pageQ = qs.get(SimpleFiltersQuery.page);
  if (pageQ !== null) {
    const parsed = parseInt(pageQ);
    if (!isNaN(parsed) && parsed > 0) {
      page = parsed;
    }
  }

  let limit = 10;
  const limitQ = qs.get(SimpleFiltersQuery.limit);
  if (limitQ !== null) {
    const parsed = parseInt(limitQ);
    if (!isNaN(parsed) && parsed > 0) {
      limit = parsed;
    }
  }
  return { query, page, limit };
}
