import { useSearchParams } from "react-router-dom";
import { toString } from "lodash-es";

import { PageFilter } from "app/features/website/types/page";

import { PageFilterField, PageFilterModel, PageFilterParams } from "../type";

export const useGenFilter = () => {
  const [queryParams] = useSearchParams();

  const fromQueryParams = () => {
    const from: PageFilterParams = {};
    for (const key of Object.keys(PageFilterField)) {
      if (
        ![PageFilterField.query, PageFilterField.saved_search_id, PageFilterField.page, PageFilterField.limit].includes(
          key as PageFilterField
        )
      ) {
        const urlParam = queryParams.get(key);
        from[key as keyof PageFilterParams] = urlParam !== null ? urlParam : undefined;
      }
    }

    const filter = fromSearchParams(from);

    const query = queryParams.get(PageFilterField.query) || "";
    let page = 1;
    const pageQ = queryParams.get(PageFilterField.page);
    if (pageQ !== null) {
      const parsed = parseInt(pageQ);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let limit = 20;
    const limitQ = queryParams.get(PageFilterField.limit);
    if (limitQ !== null) {
      const parsed = parseInt(limitQ);
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }
    return { filter, query, page, limit };
  };

  const fromSearchParams = (from: PageFilterParams) => {
    const to: PageFilterModel = {};
    if (from.query) {
      to.query = from.query;
    }

    if (from.published) {
      to.published = from.published;
    }

    return to;
  };

  const toApiParams = (from: PageFilterModel, q?: string) => {
    const to: PageFilter = {};
    if (q) {
      to.title = q;
    }
    if (from.published) {
      to.published = from.published === "visible" ? true : false;
    }

    return to;
  };

  const toSavedSearch = (from: PageFilterModel, query?: string) => {
    const filterTerms: PageFilterParams = {};
    if (query) {
      filterTerms[PageFilterField.query] = query;
    }
    if (from.published) {
      filterTerms[PageFilterField.published] = from.published;
    }
    return JSON.stringify(filterTerms);
  };

  function toSearchParams(from: PageFilterModel) {
    const to: PageFilterParams = {};
    for (const key of Object.keys(PageFilterField)) {
      if (
        ![PageFilterField.query, PageFilterField.saved_search_id, PageFilterField.page, PageFilterField.limit].includes(
          key as PageFilterField
        )
      ) {
        to[key as keyof PageFilterParams] = undefined;
      }
    }

    if (from.published) {
      to.published = from.published;
    }

    return to;
  }

  const fromSavedSearch = async (
    q: string
  ): Promise<{
    filter: PageFilterModel;
    query: string;
  }> => {
    try {
      const ss: PageFilterParams = JSON.parse(q);
      const from: PageFilterParams = {};
      for (const key of Object.keys(PageFilterField)) {
        if (
          ![
            PageFilterField.query,
            PageFilterField.saved_search_id,
            PageFilterField.page,
            PageFilterField.limit,
          ].includes(key as PageFilterField)
        ) {
          const urlParam = ss[key as keyof PageFilterParams];
          from[key as keyof PageFilterParams] = urlParam !== undefined ? toString(urlParam) : undefined;
        }
      }
      return { filter: fromSearchParams(from), query: ss.query || "" };
    } catch {
      return { filter: {}, query: "" };
    }
  };

  return { fromQueryParams, fromSearchParams, fromSavedSearch, toSavedSearch, toSearchParams, toApiParams };
};
