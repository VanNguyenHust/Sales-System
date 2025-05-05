import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { useGetSavedSearchQuery } from "app/api";
import { SaveSearchDefaultId } from "app/features/website/utils/constants";
import { toQueryString } from "app/utils/url";

import { RedirectFilterField, RedirectFilterModel, RedirectFilterParams } from "../type";

import { useGenFilter } from "./useGenFilter";

export const useFilter = () => {
  const navigate = useNavigate();
  const [urlParams, setUrlParam] = useSearchParams();
  const [state, setState] = useState<{
    filter: RedirectFilterModel;
    query: string;
    page: number;
    limit: number;
    activeTab?: string;
  }>({ filter: {}, page: 1, limit: 20, query: "" });
  const savedSearchIdQ = urlParams.get(RedirectFilterField.saved_search_id);
  const savedSearchId = savedSearchIdQ && Number(savedSearchIdQ) ? Number(savedSearchIdQ) : undefined;

  const { data: savedSearch, isFetching: isFetchingSavedSearch } = useGetSavedSearchQuery(Number(savedSearchId), {
    skip: !savedSearchId,
    refetchOnMountOrArgChange: true,
  });

  const { fromQueryParams, fromSavedSearch, toSearchParams } = useGenFilter();

  const { filter, query, page, limit, activeTab } = state;

  const isEmptyFilter = isEmpty(filter) && !query;

  const calculatorData = useCallback(async () => {
    if (isFetchingSavedSearch) return;
    const savedSearchIdParam = urlParams.get(RedirectFilterField.saved_search_id);
    // eslint-disable-next-line prefer-const
    let { filter, query, page, limit } = await fromQueryParams();
    if (savedSearch && Number(savedSearchIdParam)) {
      const extracted = await fromSavedSearch(savedSearch.query);
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
  }, [urlParams, isFetchingSavedSearch, savedSearch]);

  useEffect(() => {
    calculatorData();
  }, [calculatorData]);

  const applyFiltersSearchParam = (queryParams: URLSearchParams, searchParams: RedirectFilterParams) => {
    for (const key in searchParams) {
      const value = searchParams[key as keyof RedirectFilterParams];
      if (value !== undefined) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    }
  };

  const changePage = (page: number) => {
    urlParams.set(RedirectFilterField.page, `${page}`);
    setUrlParam(urlParams);
  };

  const changeLimit = (limit: number) => {
    urlParams.set(RedirectFilterField.limit, `${limit}`);
    setUrlParam(urlParams);
  };

  const changeQuery = async (q: string) => {
    if (q) {
      urlParams.set(RedirectFilterField.query, q);
    } else {
      urlParams.delete(RedirectFilterField.query);
    }
    urlParams.delete(RedirectFilterField.page);
    if (savedSearchId && savedSearch) {
      const { filter } = await fromSavedSearch(savedSearch.query);
      const searchParams = toSearchParams(filter);
      applyFiltersSearchParam(urlParams, searchParams);
      urlParams.delete(RedirectFilterField.saved_search_id);
    }
    setUrlParam(urlParams);
  };

  const changeFilter = (f: RedirectFilterModel) => {
    const searchParams = toSearchParams(f);
    applyFiltersSearchParam(urlParams, searchParams);
    if (query) {
      urlParams.set(RedirectFilterField.query, query);
    } else {
      urlParams.delete(RedirectFilterField.query);
    }
    urlParams.delete(RedirectFilterField.saved_search_id);
    urlParams.delete(RedirectFilterField.page);
    setUrlParam(urlParams);
  };

  const clearAllFilter = (f: RedirectFilterModel) => {
    const searchParams = toSearchParams(f);
    applyFiltersSearchParam(urlParams, searchParams);
    urlParams.delete(RedirectFilterField.query);
    urlParams.delete(RedirectFilterField.saved_search_id);
    urlParams.delete(RedirectFilterField.page);
    setUrlParam(urlParams);
  };

  const changeSavedSearch = (id: string) => {
    if (id === SaveSearchDefaultId.ALL) {
      navigate("/admin/redirects");
    } else if (id !== SaveSearchDefaultId.SEARCH) {
      navigate(
        `/admin/redirects${toQueryString({
          [RedirectFilterField.saved_search_id]: id,
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
    clearAllFilter,
    changeSavedSearch,
  };
};
