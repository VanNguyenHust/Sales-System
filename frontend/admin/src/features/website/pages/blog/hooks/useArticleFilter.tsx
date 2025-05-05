import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmpty } from "lodash-es";

import { useGetSavedSearchQuery } from "app/api";
import { SaveSearchDefaultId } from "app/features/website/utils/constants";
import { toQueryString } from "app/utils/url";

import { ArticleFilterField, ArticleFilterModel, ArticleFilterParams } from "../types";

import { useGenArticleFilter } from "./useGenArticleFilter";

export const useArticleFilter = () => {
  const navigate = useNavigate();
  const [urlParams, setUrlParam] = useSearchParams();
  const [state, setState] = useState<{
    filter: ArticleFilterModel;
    query: string;
    page: number;
    limit: number;
    activeTab?: string;
  }>({ filter: {}, page: 1, limit: 20, query: "" });
  const savedSearchIdQ = urlParams.get(ArticleFilterField.saved_search_id);
  const savedSearchId = savedSearchIdQ && Number(savedSearchIdQ) ? Number(savedSearchIdQ) : undefined;

  const { data: savedSearch, isFetching: isFetchingSavedSearch } = useGetSavedSearchQuery(Number(savedSearchId), {
    skip: !savedSearchId,
    refetchOnMountOrArgChange: true,
  });

  const isFetchingDataFilter = isFetchingSavedSearch;

  const { fromQueryParams, fromSavedSearch, toSearchParams } = useGenArticleFilter();

  const { filter, query, page, limit, activeTab } = state;

  const isEmptyFilter = isEmpty(filter) && !query;

  const calculatorData = useCallback(async () => {
    if (isFetchingDataFilter) return;
    const savedSearchIdParam = urlParams.get(ArticleFilterField.saved_search_id);
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
  }, [urlParams, isFetchingDataFilter, savedSearch]);

  useEffect(() => {
    calculatorData();
  }, [calculatorData]);

  const applyFiltersSearchParam = (queryParams: URLSearchParams, searchParams: ArticleFilterParams) => {
    for (const key in searchParams) {
      const value = searchParams[key as keyof ArticleFilterParams];
      if (value !== undefined) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    }
  };

  const changePage = (page: number) => {
    urlParams.set(ArticleFilterField.page, `${page}`);
    setUrlParam(urlParams);
  };

  const changeLimit = (limit: number) => {
    urlParams.set(ArticleFilterField.limit, `${limit}`);
    setUrlParam(urlParams);
  };

  const changeQuery = async (q: string) => {
    if (q) {
      urlParams.set(ArticleFilterField.title, q);
    } else {
      urlParams.delete(ArticleFilterField.title);
    }
    urlParams.delete(ArticleFilterField.page);
    if (savedSearchId && savedSearch) {
      const { filter } = await fromSavedSearch(savedSearch.query);
      const searchParams = toSearchParams(filter);
      applyFiltersSearchParam(urlParams, searchParams);
      urlParams.delete(ArticleFilterField.saved_search_id);
    }
    setUrlParam(urlParams);
  };

  const changeFilter = (f: ArticleFilterModel) => {
    const searchParams = toSearchParams(f);
    applyFiltersSearchParam(urlParams, searchParams);
    if (query) {
      urlParams.set(ArticleFilterField.title, query);
    } else {
      urlParams.delete(ArticleFilterField.title);
    }
    urlParams.delete(ArticleFilterField.saved_search_id);
    urlParams.delete(ArticleFilterField.page);
    setUrlParam(urlParams);
  };

  const changeSavedSearch = (id: string) => {
    if (id === SaveSearchDefaultId.ALL) {
      navigate("/admin/articles");
    } else if (id !== SaveSearchDefaultId.SEARCH) {
      navigate(
        `/admin/articles${toQueryString({
          [ArticleFilterField.saved_search_id]: id,
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
