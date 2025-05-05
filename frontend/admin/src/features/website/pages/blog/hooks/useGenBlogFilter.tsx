import { useSearchParams } from "react-router-dom";
import { toString } from "lodash-es";

import { BlogFilter } from "../../../types";
import { BlogFilterField, BlogFilterModel, BlogFilterParams } from "../types";

export const useGenBlogFilter = () => {
  const [queryParams] = useSearchParams();

  const fromQueryParams = () => {
    const from: BlogFilterParams = {};
    for (const key of Object.keys(BlogFilterField)) {
      if (
        ![BlogFilterField.query, BlogFilterField.saved_search_id, BlogFilterField.page, BlogFilterField.limit].includes(
          key as BlogFilterField
        )
      ) {
        const urlParam = queryParams.get(key);
        from[key as keyof BlogFilterParams] = urlParam !== null ? urlParam : undefined;
      }
    }

    const filter = fromSearchParams(from);

    const query = queryParams.get(BlogFilterField.query) || "";
    let page = 1;
    const pageQ = queryParams.get(BlogFilterField.page);
    if (pageQ !== null) {
      const parsed = parseInt(pageQ);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let limit = 20;
    const limitQ = queryParams.get(BlogFilterField.limit);
    if (limitQ !== null) {
      const parsed = parseInt(limitQ);
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }
    return { filter, query, page, limit };
  };

  const fromSearchParams = (from: BlogFilterParams) => {
    const to: BlogFilterModel = {};
    if (from.query) {
      to.query = from.query;
    }

    return to;
  };

  const toApiParams = (q?: string) => {
    const to: BlogFilter = {};
    if (q) {
      to.name = q;
    }

    return to;
  };

  const toSavedSearch = (query?: string) => {
    const filterTerms: BlogFilterParams = {};
    if (query) {
      filterTerms[BlogFilterField.query] = query;
    }
    return JSON.stringify(filterTerms);
  };

  function toSearchParams() {
    const to: BlogFilterParams = {};
    for (const key of Object.keys(BlogFilterField)) {
      if (
        ![BlogFilterField.query, BlogFilterField.saved_search_id, BlogFilterField.page, BlogFilterField.limit].includes(
          key as BlogFilterField
        )
      ) {
        to[key as keyof BlogFilterParams] = undefined;
      }
    }

    return to;
  }

  const fromSavedSearch = (q: string) => {
    try {
      const ss: BlogFilterParams = JSON.parse(q);
      const from: BlogFilterParams = {};
      for (const key of Object.keys(BlogFilterField)) {
        if (
          ![
            BlogFilterField.query,
            BlogFilterField.saved_search_id,
            BlogFilterField.page,
            BlogFilterField.limit,
          ].includes(key as BlogFilterField)
        ) {
          const urlParam = ss[key as keyof BlogFilterParams];
          from[key as keyof BlogFilterParams] = urlParam !== undefined ? toString(urlParam) : undefined;
        }
      }
      return { filter: fromSearchParams(from), query: ss.query || "" };
    } catch {
      return { filter: {}, query: "" };
    }
  };

  return { fromQueryParams, fromSearchParams, fromSavedSearch, toSavedSearch, toSearchParams, toApiParams };
};
