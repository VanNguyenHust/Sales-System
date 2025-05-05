import { Blog } from "../../types";

export enum ArticleFilterField {
  title = "title",
  visibility = "visibility",
  tags = "tags",
  author = "author",
  blog_ids = "blog_ids",
  page = "page",
  limit = "limit",
  saved_search_id = "saved_search_id",
}

export interface ArticleFilterParams {
  title?: string;
  visibility?: string;
  tags?: string;
  author?: string;
  blog_ids?: string;
  save_search_id?: string;
}

export type ArticleFilterModel = {
  title?: string;
  visibility?: string;
  tags?: string[];
  author?: string;
  blogs?: Blog[];
};

export enum BlogFilterField {
  query = "query",
  page = "page",
  limit = "limit",
  saved_search_id = "saved_search_id",
}
export interface BlogFilterParams {
  query?: string;
  save_search_id?: string;
}

export type BlogFilterModel = {
  query?: string;
};

export enum CommentFilterField {
  query = "query",
  status = "status",
  page = "page",
  limit = "limit",
  saved_search_id = "saved_search_id",
}
export interface CommentFilterParams {
  query?: string;
  status?: string;
  save_search_id?: string;
}

export type CommentFilterModel = {
  query?: string;
  status?: string;
};
