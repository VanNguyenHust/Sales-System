export type Linklist = {
  id: number;
  title: string;
  alias: string;
  links: Link[];
};

export type Link = {
  id: number;
  type?: LinkType;
  title?: string;
  handle?: string;
  handle_customized?: boolean;
  subject_id?: number | null;
  subject_name?: string | null;
  subject_param?: string | null;
  subject?: string;
  links: Link[];
};

export type SubjectLink = {
  link: Link;
  parentLink: Link | null;
  linklist: Linklist;
};

export type SubjectLinkParentInfo = {
  linklistRootId: number;
  linkParentId?: number;
  title: string;
};

export type LinklistChange = {
  id?: number | null;
  title: string;
  alias?: string;
  changes: LinkChange[];
};

export type LinkChange = {
  id?: number;
  type?: LinkType;
  title?: string;
  action?: "update" | "create" | "delete";
  alias?: string;
  subject_id?: number | null;
  subject_param?: string | null;
  subject?: string;
  parent_id?: number;
  previous_sibling_id?: number;
};

export enum LinkType {
  HOME = "frontpage",
  COLLECTION = "collection",
  PRODUCT = "product",
  ALL_PRODUCT = "catalog",
  PAGE = "page",
  BLOG = "blog",
  SEARCH = "search",
  HTTP = "http",
}
