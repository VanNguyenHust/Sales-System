import { PaginationFilter } from "app/types";

export type ArticleFilter = PaginationFilter & {
  title?: string;
  published?: boolean;
  author?: string;
  tags?: string;
  ids?: string;
  sort?: string;
  blog_ids?: string;
};

export type Article = {
  id: number;
  title: string;
  alias: string;
  user_id: number;
  author: string;
  blog_id: number;
  meta_title: string | null;
  meta_description: string | null;
  created_on: string;
  modified_on: string | null;
  published_on: string | null;
  tags: string | null;
  content: string | null;
  summary: string | null;
  template_layout: string | null;
  image: ArticleImageResponse | null;
  alt_image: string | null;
};

export type ArticleImageResponse = {
  id: number;
  created_on: string;
  modified_on?: string;
  src: string;
  alt?: string;
  filename?: string;
  size: number;
  width?: number;
  height?: number;
};

export type ArticleBulkUpdateRequest = {
  operation: "publish" | "unpublish" | "add_tag" | "remove_tag";
  ids: number[];
  selected_all?: boolean;
  tags?: string[];
};

export type ArticleImageRequest = {
  id?: number;
  base64?: string;
  src?: string;
  file?: File;
  filename?: string;
  alt?: string;
};

export type ArticleRequest = {
  title: string;
  alias: string;
  author?: string;
  blog_id?: number;
  blog_name: string;
  meta_title?: string;
  meta_description?: string;
  published_on?: string;
  content?: string;
  summary?: string;
  tags?: string;
  template_layout?: string;
  image?: ArticleImageRequest;
  alt_image?: string;
};

export type CombineArticleRequest = {
  article: ArticleRequest;
  redirect301?: boolean;
};
