import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { useGetSavedSearchQuery } from "app/api";
import { SaveSearchDefaultId } from "app/features/website/utils/constants";
import { toQueryString } from "app/utils/url";

import { BlogFilterField, BlogFilterModel, BlogFilterParams } from "../types";

import { useGenBlogFilter } from "./useGenBlogFilter";

export const useBlogFilter = () => {
  const navigate = useNavigate();
  const [urlParams, setUrlParam] = useSearchParams();
  const [state, setState] = useState<{
    filter: BlogFilterModel;
    query: string;
    page: number;
    limit: number;
    activeTab?: string;
  }>({ filter: {}, page: 1, limit: 20, query: "" });
  const savedSearchIdQ = urlParams.get(BlogFilterField.saved_search_id);
  const savedSearchId = savedSearchIdQ && Number(savedSearchIdQ) ? Number(savedSearchIdQ) : undefined;

  const { data: savedSearch, isFetching: isFetchingSavedSearch } = useGetSavedSearchQuery(Number(savedSearchId), {
    skip: !savedSearchId,
    refetchOnMountOrArgChange: true,
  });

  const isFetchingDataFilter = isFetchingSavedSearch;

  const { fromQueryParams, fromSavedSearch, toSearchParams } = useGenBlogFilter();

  const { filter, query, page, limit, activeTab } = state;

  const isEmptyFilter = isEmpty(filter) && !query;

  const calculatorData = useCallback(() => {
    if (isFetchingDataFilter) return;
    const savedSearchIdParam = urlParams.get(BlogFilterField.saved_search_id);
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

  const applyFiltersSearchParam = (queryParams: URLSearchParams, searchParams: BlogFilterParams) => {
    for (const key in searchParams) {
      const value = searchParams[key as keyof BlogFilterParams];
      if (value !== undefined) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    }
  };

  const changePage = (page: number) => {
    urlParams.set(BlogFilterField.page, `${page}`);
    setUrlParam(urlParams);
  };

  const changeLimit = (limit: number) => {
    urlParams.set(BlogFilterField.limit, `${limit}`);
    setUrlParam(urlParams);
  };

  const changeQuery = (q: string) => {
    if (q) {
      urlParams.set(BlogFilterField.query, q);
    } else {
      urlParams.delete(BlogFilterField.query);
    }
    urlParams.delete(BlogFilterField.page);
    if (savedSearchId && savedSearch) {
      const searchParams = toSearchParams();
      applyFiltersSearchParam(urlParams, searchParams);
      urlParams.delete(BlogFilterField.saved_search_id);
    }
    setUrlParam(urlParams);
  };

  const changeFilter = () => {
    const searchParams = toSearchParams();
    applyFiltersSearchParam(urlParams, searchParams);
    if (query) {
      urlParams.set(BlogFilterField.query, query);
    } else {
      urlParams.delete(BlogFilterField.query);
    }
    urlParams.delete(BlogFilterField.saved_search_id);
    urlParams.delete(BlogFilterField.page);
    setUrlParam(urlParams);
  };

  const changeSavedSearch = (id: string) => {
    if (id === SaveSearchDefaultId.ALL) {
      navigate("/admin/blogs");
    } else if (id !== SaveSearchDefaultId.SEARCH) {
      navigate(
        `/admin/blogs${toQueryString({
          [BlogFilterField.saved_search_id]: id,
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
