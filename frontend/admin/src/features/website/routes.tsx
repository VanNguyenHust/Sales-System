import { lazy } from "react";

import { RouteDescriptor } from "app/types/routes";

import { userRouteAccessService } from "../auth";

import { BlogArticleNavigate } from "./pages/blog/components/BlogArticleNavigate";
import { ArticleManagerSkeleton } from "./pages/blog/components/create-or-edit/ArticleManagerSkeleton";
import { BlogManagerSkeleton } from "./pages/blog/components/create-or-edit/BlogManagerSkeleton";
import { ArticleListSkeleton } from "./pages/blog/components/list/ArticleListSkeleton";
import { BlogListSkeleton } from "./pages/blog/components/list/BlogListSkeleton";
import { CommentListSkeleton } from "./pages/blog/components/list/CommentListSkeleton";
import { MenuListSkeleton } from "./pages/menu/components/MenuListSkeleton";
import { MenuManagerSkeleton } from "./pages/menu/components/MenuManagerSkeleton";
import { PageListSkeleton } from "./pages/page/components/PageListSkeleton";
import { PageManagerSkeleton } from "./pages/page/components/PageManagerSkeleton";
import { Redirect301Navigate } from "./pages/redirect/components/Redirect301Navigate";
import { RedirectListSkeleton } from "./pages/redirect/components/RedirectListSkeleton";

/* website routes */
export const routes: RouteDescriptor[] = [
  {
    path: "articles",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/ArticleListPage")),
    fallback: <ArticleListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "articles/create",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/ArticleManagerPage")),
    fallback: <ArticleManagerSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "articles/:id",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/ArticleManagerPage")),
    fallback: <ArticleManagerSkeleton />,
    canActivate: [userRouteAccessService()],
    validateParams: { id: "id" },
  },
  {
    path: "blogs",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/BlogListPage")),
    fallback: <BlogListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "blogs/create",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/BlogManagerPage")),
    fallback: <BlogManagerSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "blogs/:id",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/BlogManagerPage")),
    fallback: <BlogManagerSkeleton />,
    canActivate: [userRouteAccessService()],
    validateParams: { id: "id" },
  },
  {
    path: "blogs/:blogId/articles/:articleId",
    authorities: ["pages"],
    component: BlogArticleNavigate,
    canActivate: [userRouteAccessService()],
    validateParams: { blogId: "id", articleId: "id" },
  },
  {
    path: "comments",
    authorities: ["pages"],
    component: lazy(() => import("./pages/blog/CommentListPage")),
    fallback: <CommentListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "pages",
    authorities: ["pages"],
    component: lazy(() => import("./pages/page/PageListPage")),
    fallback: <PageListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "pages/create",
    authorities: ["pages"],
    component: lazy(() => import("./pages/page/PageManagerPage")),
    fallback: <PageManagerSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "pages/:id",
    authorities: ["pages"],
    component: lazy(() => import("./pages/page/PageManagerPage")),
    fallback: <PageManagerSkeleton />,
    canActivate: [userRouteAccessService()],
    validateParams: { id: "id" },
  },
  {
    path: "redirects",
    authorities: ["links"],
    component: lazy(() => import("./pages/redirect/RedirectListPage")),
    fallback: <RedirectListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "settings/redirects",
    authorities: ["links"],
    component: Redirect301Navigate,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "links",
    authorities: ["links"],
    component: lazy(() => import("./pages/menu/MenuListPage")),
    fallback: <MenuListSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "links/create",
    authorities: ["links"],
    component: lazy(() => import("./pages/menu/MenuManagerPage")),
    fallback: <MenuManagerSkeleton />,
    canActivate: [userRouteAccessService()],
  },
  {
    path: "links/:id",
    authorities: ["links"],
    component: lazy(() => import("./pages/menu/MenuManagerPage")),
    fallback: <MenuManagerSkeleton />,
    canActivate: [userRouteAccessService()],
    validateParams: { id: "id" },
  },
];
