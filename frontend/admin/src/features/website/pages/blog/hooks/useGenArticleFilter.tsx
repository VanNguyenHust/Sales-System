import { useSearchParams } from "react-router-dom";
import { toString } from "lodash-es";

import { handleErrorApi } from "app/utils/error";

import { ArticleFilter } from "../../../types";
import { useLazyGetBlogsQuery } from "../api";
import { ArticleFilterField, ArticleFilterModel, ArticleFilterParams } from "../types";

export const useGenArticleFilter = () => {
  const [queryParams] = useSearchParams();
  const [triggerBlog] = useLazyGetBlogsQuery();

  const fromQueryParams = async () => {
    const from: ArticleFilterParams = {};
    for (const key of Object.keys(ArticleFilterField)) {
      if (
        ![
          ArticleFilterField.title,
          ArticleFilterField.saved_search_id,
          ArticleFilterField.page,
          ArticleFilterField.limit,
        ].includes(key as ArticleFilterField)
      ) {
        const urlParam = queryParams.get(key);
        from[key as keyof ArticleFilterParams] = urlParam !== null ? urlParam : undefined;
      }
    }

    const filter = await fromSearchParams(from);

    const query = queryParams.get(ArticleFilterField.title) || "";
    let page = 1;
    const pageQ = queryParams.get(ArticleFilterField.page);
    if (pageQ !== null) {
      const parsed = parseInt(pageQ);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let limit = 20;
    const limitQ = queryParams.get(ArticleFilterField.limit);
    if (limitQ !== null) {
      const parsed = parseInt(limitQ);
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }
    return { filter, query, page, limit };
  };

  const fromSearchParams = async (from: ArticleFilterParams) => {
    const to: ArticleFilterModel = {};
    if (from.title) {
      to.title = from.title;
    }

    if (from.visibility) {
      to.visibility = from.visibility;
    }

    if (from.tags) {
      to.tags = from.tags.split(",");
    }

    if (from.author) {
      to.author = from.author;
    }

    if (from.blog_ids) {
      const blogs = await triggerBlog({ ids: from.blog_ids })
        .unwrap()
        .catch((e) => {
          handleErrorApi(e);
          return null;
        });

      if (blogs) {
        to.blogs = blogs;
      }
    }

    return to;
  };

  const toApiParams = (from: ArticleFilterModel, q?: string) => {
    const to: ArticleFilter = {};
    if (q) {
      to.title = q;
    }

    if (from.visibility) {
      to.published = from.visibility === "visibility" ? true : false;
    }

    if (from.tags) {
      to.tags = from.tags.join(",");
    }

    if (from.author) {
      to.author = from.author;
    }

    if (from.blogs) {
      to.blog_ids = from.blogs.map((blog) => blog.id).join(",");
    }
    return to;
  };

  const toSavedSearch = (from: ArticleFilterModel, query?: string) => {
    const filterTerms: ArticleFilterParams = {};
    if (query) {
      filterTerms[ArticleFilterField.title] = query;
    }
    if (from.visibility !== undefined) {
      filterTerms[ArticleFilterField.visibility] = from.visibility;
    }
    if (from.tags) {
      filterTerms[ArticleFilterField.tags] = from.tags.join(",");
    }
    if (from.author) {
      filterTerms[ArticleFilterField.author] = from.author;
    }
    if (from.blogs) {
      filterTerms[ArticleFilterField.blog_ids] = from.blogs.map((blog) => blog.id).join(",");
    }
    return JSON.stringify(filterTerms);
  };

  function toSearchParams(from: ArticleFilterModel) {
    const to: ArticleFilterParams = {};
    for (const key of Object.keys(ArticleFilterField)) {
      if (
        ![
          ArticleFilterField.title,
          ArticleFilterField.saved_search_id,
          ArticleFilterField.page,
          ArticleFilterField.limit,
        ].includes(key as ArticleFilterField)
      ) {
        to[key as keyof ArticleFilterParams] = undefined;
      }
    }
    if (from.visibility !== undefined) {
      to.visibility = from.visibility;
    }
    if (from.tags) {
      to.tags = from.tags.join(",");
    }
    if (from.author) {
      to.author = from.author;
    }
    if (from.blogs) {
      to.blog_ids = from.blogs.map((blog) => blog.id).join(",");
    }

    return to;
  }

  const fromSavedSearch = async (q: string) => {
    try {
      const ss: ArticleFilterParams = JSON.parse(q);
      const from: ArticleFilterParams = {};
      for (const key of Object.keys(ArticleFilterField)) {
        if (
          ![
            ArticleFilterField.title,
            ArticleFilterField.saved_search_id,
            ArticleFilterField.page,
            ArticleFilterField.limit,
          ].includes(key as ArticleFilterField)
        ) {
          const urlParam = ss[key as keyof ArticleFilterParams];
          from[key as keyof ArticleFilterParams] = urlParam !== undefined ? toString(urlParam) : undefined;
        }
      }
      return { filter: await fromSearchParams(from), query: ss.title || "" };
    } catch {
      return { filter: {}, query: "" };
    }
  };

  return { fromQueryParams, fromSearchParams, fromSavedSearch, toSavedSearch, toSearchParams, toApiParams };
};
