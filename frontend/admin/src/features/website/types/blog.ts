import { PaginationFilter } from "app/types";

import { SubjectLinkParentInfo } from "./linklist";

export enum Commentable {
  NO = "no",
  MODERATE = "moderate",
  YES = "yes",
}

export type BlogFilter = PaginationFilter & {
  ids?: string;
  name?: string;
  tag?: string;
};

export type Blog = {
  id: number;
  name: string;
  description?: string;
  alias: string;
  commentable?: Commentable;
  meta_title?: string;
  meta_description?: string;
  created_on: string;
  modified_on?: string;
  template_layout?: string;
};

export type BlogRequest = {
  name: string;
  description?: string;
  alias?: string;
  commentable?: Commentable;
  meta_title?: string;
  meta_description?: string;
  template_layout?: string;
};

export type CombineBlogRequest = {
  blog: BlogRequest;
  linkListIds: number[];
  linkListSubParent: SubjectLinkParentInfo[];
  linkListSubParentDefault?: SubjectLinkParentInfo[];
  redirect301?: boolean;
};
