import { LayoutComponent } from "./features/admin/LayoutComponent";
import ManageStoreInfo from "./features/store/ManageStoreInfo";

export const routes = [
  {
    path: "/",
    element: <LayoutComponent />,
    children: [
      {
        path: "/admin/stores",
        element: <ManageStoreInfo />,
      }
    ],
  },
];
