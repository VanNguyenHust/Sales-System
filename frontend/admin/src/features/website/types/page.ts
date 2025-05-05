import { PaginationFilter } from "app/types";

import { SubjectLinkParentInfo } from "./linklist";

export type Page = {
  id: number;
  title: string;
  content?: string;
  description?: string;
  alias: string;
  meta_title?: string;
  meta_description?: string;
  created_on: string;
  modified_on?: string;
  created_by?: number;
  modified_by?: number;
  template_layout?: string;
  published_on?: string;
  author?: string;
};

export type PageFilter = PaginationFilter & {
  ids?: string;
  title?: string;
  published?: boolean;
};

export type PageRequest = {
  title: string;
  content?: string;
  alias: string;
  published_on?: string;
  meta_title?: string;
  meta_description?: string;
  template_layout?: string;
};

export type CombinePageRequest = {
  page: PageRequest;
  linkListIds: number[];
  linkListSubParent: SubjectLinkParentInfo[];
  linkListSubParentDefault?: SubjectLinkParentInfo[];
  redirect301?: boolean;
};
