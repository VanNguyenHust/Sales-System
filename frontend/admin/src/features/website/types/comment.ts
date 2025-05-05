import { PaginationFilter } from "app/types";

export enum CommentStatus {
  UNAPPROVED = "unapproved",
  SPAM = "spam",
  PUBLISHED = "published",
}

export type CommentFilter = PaginationFilter & {
  article_id?: number;
  blog_id?: number;
  status?: CommentStatus;
  body?: string;
};

export type CommentResponse = {
  id: number;
  article_id: number;
  blog_id: number;
  author?: string;
  email?: string;
  body?: string;
  created_on: string;
  modified_on?: string;
  status: CommentStatus;
};
