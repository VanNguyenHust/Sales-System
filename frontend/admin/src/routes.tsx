import { Navigate } from "react-router-dom";

import { routes as adminRoutes } from "@/features/admin/routes";

import { OopsPage } from "./components/ErrorBoundary";
import { App } from "./App";
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { RouteDescriptor } from "./types/routes";
import ManageAuthPage from "./features/auth/ManageAuthPage";

/*App layout routes*/
export const routes: RouteDescriptor[] = [
  {
    component: App,
    errorElement: (
      <AdminLayout>
        <OopsPage />
      </AdminLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="admin" />,
      },
      {
        path: "admin/*",
        component: AdminLayout,
        children: adminRoutes,
      },
      {
        path: "*",
        element: <Navigate to="admin" />,
      },
    ],
  },
  {
    path: "/auth/*",
    component: ManageAuthPage,
  },
];
