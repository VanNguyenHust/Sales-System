import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { useGetSavedSearchQuery } from "app/api";
import { SaveSearchDefaultId } from "app/features/website/utils/constants";
import { toQueryString } from "app/utils/url";

import { CommentFilterField, CommentFilterModel, CommentFilterParams } from "../types";

import { useGenCommentFilter } from "./useGenCommentFilter";

export const useCommentFilter = (isDetailPage?: boolean) => {
  const navigate = useNavigate();
  const [urlParams, setUrlParam] = useSearchParams();
  const [state, setState] = useState<{
    filter: CommentFilterModel;
    query: string;
    page: number;
    limit: number;
    activeTab?: string;
  }>({ filter: {}, page: 1, limit: 20, query: "" });
  const savedSearchIdQ = urlParams.get(CommentFilterField.saved_search_id);
  const savedSearchId = savedSearchIdQ && Number(savedSearchIdQ) ? Number(savedSearchIdQ) : undefined;

  const { data: savedSearch, isFetching: isFetchingSavedSearch } = useGetSavedSearchQuery(Number(savedSearchId), {
    skip: !savedSearchId,
    refetchOnMountOrArgChange: true,
  });

  const isFetchingDataFilter = isFetchingSavedSearch;

  const { fromQueryParams, fromSavedSearch, toSearchParams } = useGenCommentFilter();

  const { filter, query, page, limit, activeTab } = state;

  const isEmptyFilter = isEmpty(filter) && !query;

  const calculatorData = useCallback(() => {
    if (isFetchingDataFilter || isDetailPage) return;
    const savedSearchIdParam = urlParams.get(CommentFilterField.saved_search_id);
    // eslint-disable-next-line prefer-const
    let { filter, query, page, limit } = fromQueryParams();
    if (savedSearch && Number(savedSearchIdParam)) {
      const extracted = fromSavedSearch(savedSearch.query);
      filter = extracted.filter;
      query = extracted.query;
    }
    const activeTab =
      savedSearch && Number(savedSearchIdParam)
        ? `${savedSearch.id}`
        : query === "" && isEmpty(filter)
        ? SaveSearchDefaultId.ALL
        : SaveSearchDefaultId.SEARCH;

    setState({
      filter,
      query,
      page,
      limit,
      activeTab,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams, isFetchingDataFilter, savedSearch]);

  useEffect(() => {
    calculatorData();
  }, [calculatorData]);

  const applyFiltersSearchParam = (queryParams: URLSearchParams, searchParams: CommentFilterParams) => {
    for (const key in searchParams) {
      const value = searchParams[key as keyof CommentFilterParams];
      if (value !== undefined) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    }
  };

  const changePage = (page: number) => {
    urlParams.set(CommentFilterField.page, `${page}`);
    if (isDetailPage) {
      setState({ ...state, page });
    } else {
      setUrlParam(urlParams);
    }
  };

  const changeLimit = (limit: number) => {
    urlParams.set(CommentFilterField.limit, `${limit}`);
    if (isDetailPage) {
      setState((prev) => ({ ...prev, limit: 1 }));
    } else {
      setUrlParam(urlParams);
    }
  };

  const changeQuery = (q: string) => {
    if (q) {
      urlParams.set(CommentFilterField.query, q);
    } else {
      urlParams.delete(CommentFilterField.query);
    }
    urlParams.delete(CommentFilterField.page);
    if (savedSearchId && savedSearch) {
      const { filter } = fromSavedSearch(savedSearch.query);
      const searchParams = toSearchParams(filter);
      applyFiltersSearchParam(urlParams, searchParams);
      urlParams.delete(CommentFilterField.saved_search_id);
    }
    if (isDetailPage) {
      setState((prev) => ({ ...prev, query: q, page: 1 }));
    } else {
      setUrlParam(urlParams);
    }
  };

  const changeFilter = (f: CommentFilterModel) => {
    const searchParams = toSearchParams(f);
    applyFiltersSearchParam(urlParams, searchParams);
    if (query) {
      urlParams.set(CommentFilterField.query, query);
    } else {
      urlParams.delete(CommentFilterField.query);
    }
    urlParams.delete(CommentFilterField.saved_search_id);
    urlParams.delete(CommentFilterField.page);

    if (isDetailPage) {
      const { filter } = fromQueryParams(urlParams);
      setState((prev) => ({ ...prev, filter, page: 1 }));
    } else {
      setUrlParam(urlParams);
    }
  };

  const changeSavedSearch = (id: string) => {
    if (id === SaveSearchDefaultId.ALL) {
      navigate("/admin/comments");
    } else if (id !== SaveSearchDefaultId.SEARCH) {
      navigate(
        `/admin/comments${toQueryString({
          [CommentFilterField.saved_search_id]: id,
        })}`
      );
    }
  };

  return {
    filter,
    page,
    limit,
    query,
    activeTab,
    isEmptyFilter,
    changeQuery,
    changeFilter,
    changePage,
    changeLimit,
    changeSavedSearch,
  };
};
