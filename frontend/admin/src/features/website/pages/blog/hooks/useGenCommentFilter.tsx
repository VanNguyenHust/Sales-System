import { useSearchParams } from "react-router-dom";
import { toString } from "lodash-es";

import { CommentFilter, CommentStatus } from "../../../types";
import { CommentFilterField, CommentFilterModel, CommentFilterParams } from "../types";

export const useGenCommentFilter = () => {
  const [queryParams] = useSearchParams();

  const fromQueryParams = (params?: URLSearchParams) => {
    const paramsFinal = params ? params : queryParams;
    const from: CommentFilterParams = {};
    for (const key of Object.keys(CommentFilterField)) {
      if (
        ![
          CommentFilterField.query,
          CommentFilterField.saved_search_id,
          CommentFilterField.page,
          CommentFilterField.limit,
        ].includes(key as CommentFilterField)
      ) {
        const urlParam = paramsFinal.get(key);
        from[key as keyof CommentFilterParams] = urlParam !== null ? urlParam : undefined;
      }
    }

    const filter = fromSearchParams(from);

    const query = paramsFinal.get(CommentFilterField.query) || "";
    let page = 1;
    const pageQ = paramsFinal.get(CommentFilterField.page);
    if (pageQ !== null) {
      const parsed = parseInt(pageQ);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let limit = 20;
    const limitQ = paramsFinal.get(CommentFilterField.limit);
    if (limitQ !== null) {
      const parsed = parseInt(limitQ);
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }
    return { filter, query, page, limit };
  };

  const fromSearchParams = (from: CommentFilterParams) => {
    const to: CommentFilterModel = {};
    if (from.query) {
      to.query = from.query;
    }

    if (from.status) {
      to.status = from.status;
    }

    return to;
  };

  const toApiParams = (from: CommentFilterModel, q?: string) => {
    const to: CommentFilter = {};
    if (q) {
      to.body = q;
    }
    if (from.status) {
      to.status = from.status as CommentStatus;
    }

    return to;
  };

  const toSavedSearch = (from: CommentFilterModel, query?: string) => {
    const filterTerms: CommentFilterParams = {};
    if (query) {
      filterTerms[CommentFilterField.query] = query;
    }
    if (from.status) {
      filterTerms[CommentFilterField.status] = from.status;
    }
    return JSON.stringify(filterTerms);
  };

  function toSearchParams(from: CommentFilterModel) {
    const to: CommentFilterParams = {};
    for (const key of Object.keys(CommentFilterField)) {
      if (
        ![
          CommentFilterField.query,
          CommentFilterField.saved_search_id,
          CommentFilterField.page,
          CommentFilterField.limit,
        ].includes(key as CommentFilterField)
      ) {
        to[key as keyof CommentFilterParams] = undefined;
      }
    }

    if (from.status) {
      to.status = from.status;
    }

    return to;
  }

  const fromSavedSearch = (q: string) => {
    try {
      const ss: CommentFilterParams = JSON.parse(q);
      const from: CommentFilterParams = {};
      for (const key of Object.keys(CommentFilterField)) {
        if (
          ![
            CommentFilterField.query,
            CommentFilterField.saved_search_id,
            CommentFilterField.page,
            CommentFilterField.limit,
          ].includes(key as CommentFilterField)
        ) {
          const urlParam = ss[key as keyof CommentFilterParams];
          from[key as keyof CommentFilterParams] = urlParam !== undefined ? toString(urlParam) : undefined;
        }
      }
      return { filter: fromSearchParams(from), query: ss.query || "" };
    } catch {
      return { filter: {}, query: "" };
    }
  };

  return { fromQueryParams, fromSearchParams, fromSavedSearch, toSavedSearch, toSearchParams, toApiParams };
};
