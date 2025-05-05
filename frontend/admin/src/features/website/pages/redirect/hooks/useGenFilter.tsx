import { useSearchParams } from "react-router-dom";
import { endOfDay, isMatch, startOfDay } from "date-fns";
import { toString } from "lodash-es";

import { RedirectFilter } from "app/features/website/types";
import {
  DATE_FORMAT,
  DATE_TIME_UTC_FORMAT,
  formatDate,
  getRelativeRange,
  parseDate,
  parseRelativeDate,
  useDatetime,
} from "app/utils/datetime";

import { RedirectFilterField, RedirectFilterModel, RedirectFilterParams } from "../type";

export const useGenFilter = () => {
  const { zonedTimeToUtc } = useDatetime();
  const [queryParams] = useSearchParams();

  const fromQueryParams = () => {
    const from: RedirectFilterParams = {};
    for (const key of Object.keys(RedirectFilterField)) {
      if (
        ![
          RedirectFilterField.query,
          RedirectFilterField.saved_search_id,
          RedirectFilterField.page,
          RedirectFilterField.limit,
        ].includes(key as RedirectFilterField)
      ) {
        const urlParam = queryParams.get(key);
        from[key as keyof RedirectFilterParams] = urlParam !== null ? urlParam : undefined;
      }
    }

    const filter = fromSearchParams(from);

    const query = queryParams.get(RedirectFilterField.query) || "";
    let page = 1;
    const pageQ = queryParams.get(RedirectFilterField.page);
    if (pageQ !== null) {
      const parsed = parseInt(pageQ);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let limit = 20;
    const limitQ = queryParams.get(RedirectFilterField.limit);
    if (limitQ !== null) {
      const parsed = parseInt(limitQ);
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }
    return { filter, query, page, limit };
  };

  const fromSearchParams = (from: RedirectFilterParams) => {
    const to: RedirectFilterModel = {};
    if (from.query) {
      to.query = from.query;
    }

    if (from.created_on) {
      const parsed = parseRelativeDate(from.created_on);
      if (parsed) {
        to.createdOn = {
          relative: parsed,
        };
      }
    } else if (from.created_on_min || from.created_on_max) {
      to.createdOn = {};
      if (from.created_on_min) {
        const parsed = parseDate(from.created_on_min, DATE_FORMAT);
        if (parsed) {
          to.createdOn.start = parsed;
        }
      }
      if (from.created_on_max !== undefined) {
        const parsed = parseDate(from.created_on_max, DATE_FORMAT);
        if (parsed) {
          to.createdOn.end = parsed;
        }
      }
    }

    return to;
  };

  const toApiParams = (from: RedirectFilterModel, q?: string) => {
    const to: RedirectFilter = {};
    if (q) {
      to.query = q;
    }

    if (from.createdOn) {
      if (from.createdOn.relative) {
        const { start, end } = getRelativeRange(from.createdOn.relative);
        to.created_on_min = formatDate(zonedTimeToUtc(start), DATE_TIME_UTC_FORMAT);
        to.created_on_max = formatDate(zonedTimeToUtc(end), DATE_TIME_UTC_FORMAT);
      } else {
        if (from.createdOn.start) {
          to.created_on_min = formatDate(zonedTimeToUtc(startOfDay(from.createdOn.start)), DATE_TIME_UTC_FORMAT);
        }
        if (from.createdOn.end) {
          to.created_on_max = formatDate(zonedTimeToUtc(endOfDay(from.createdOn.end)), DATE_TIME_UTC_FORMAT);
        }
      }
    }

    return to;
  };

  const toSavedSearch = (from: RedirectFilterModel, query?: string) => {
    const filterTerms: RedirectFilterParams = {};
    if (query) {
      filterTerms[RedirectFilterField.query] = query;
    }
    if (from.createdOn) {
      if (from.createdOn.relative) {
        filterTerms[RedirectFilterField.created_on] = from.createdOn.relative;
      } else {
        if (from.createdOn.start) {
          filterTerms[RedirectFilterField.created_on_min] = formatDate(from.createdOn.start, DATE_FORMAT);
        }
        if (from.createdOn.end) {
          filterTerms[RedirectFilterField.created_on_max] = formatDate(from.createdOn.end, DATE_FORMAT);
        }
      }
    }
    return JSON.stringify(filterTerms);
  };

  function toSearchParams(from: RedirectFilterModel) {
    const to: RedirectFilterParams = {};
    for (const key of Object.keys(RedirectFilterField)) {
      if (
        ![
          RedirectFilterField.query,
          RedirectFilterField.saved_search_id,
          RedirectFilterField.page,
          RedirectFilterField.limit,
        ].includes(key as RedirectFilterField)
      ) {
        to[key as keyof RedirectFilterParams] = undefined;
      }
    }

    if (from.createdOn) {
      if (from.createdOn.relative) {
        to.created_on = from.createdOn.relative;
      } else {
        if (from.createdOn.start) {
          to.created_on_min = formatDate(from.createdOn.start, DATE_FORMAT);
        }
        if (from.createdOn.end) {
          to.created_on_max = formatDate(from.createdOn.end, DATE_FORMAT);
        }
      }
    }

    return to;
  }

  const fromSavedSearch = async (
    q: string
  ): Promise<{
    filter: RedirectFilterModel;
    query: string;
  }> => {
    try {
      const ss: RedirectFilterParams = JSON.parse(q);
      const from: RedirectFilterParams = {};
      for (const key of Object.keys(RedirectFilterField)) {
        if (
          ![
            RedirectFilterField.query,
            RedirectFilterField.saved_search_id,
            RedirectFilterField.page,
            RedirectFilterField.limit,
          ].includes(key as RedirectFilterField)
        ) {
          const urlParam = ss[key as keyof RedirectFilterParams];
          from[key as keyof RedirectFilterParams] = urlParam !== undefined ? toString(urlParam) : undefined;
        }
      }
      return { filter: fromSearchParams(from), query: ss.query || "" };
    } catch {
      return { filter: {}, query: "" };
    }
  };

  return { fromQueryParams, fromSearchParams, fromSavedSearch, toSavedSearch, toSearchParams, toApiParams };
};
