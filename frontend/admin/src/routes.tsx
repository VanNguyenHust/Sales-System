import { LayoutComponent } from "./features/admin/LayoutComponent";
import AuthPage from "./features/auth/AuthPage";
import ManageCustomerListPage from "./features/customer/ManageCustomerListPage";
import ManageDefinitionPage from "./features/metafield/ManageDefinitionPage";
import ManageListDefinitionPage from "./features/metafield/ManageListDefinitionPage";
import ManageProductListPage from "./features/product/ManageProductListPage";
import ManageProductPage from "./features/product/ManageProductPage";
import CreateUserPage from "./features/store/CreateUserPage";
import ManageListLocationPage from "./features/store/ManageListLocationPage";
import ManageListUserPage from "./features/store/ManageListUserPage";
import ManageStoreInfo from "./features/store/ManageStoreInfo";

export const routes = [
  {
    path: "/",
    element: <LayoutComponent />,
    children: [
      {
        path: "/admin/authorize",
        element: <AuthPage />,
      },
      {
        path: "/admin/stores",
        element: <ManageStoreInfo />,
      },
      {
        path: "/admin/users",
        element: <ManageListUserPage />,
      },
      {
        path: "/admin/users/create",
        element: <CreateUserPage />,
      },
      {
        path: "/admin/users/:userId",
        element: <CreateUserPage />,
      },
      {
        path: "/admin/locations",
        element: <ManageListLocationPage />,
      },
      {
        path: "/admin/metafields",
        element: <ManageListDefinitionPage />,
      },
      {
        path: "/admin/metafields/:ownerResource/create",
        element: <ManageDefinitionPage />,
      },
      {
        path: "/admin/metafields/:ownerResource/:id",
        element: <ManageDefinitionPage />,
      },
      {
        path: "/admin/customers",
        element: <ManageCustomerListPage />,
      },
      {
        path: "/admin/products",
        element: <ManageProductListPage />,
      },
      {
        path: "/admin/products/:productId",
        element: <ManageProductPage />,
      },
      {
        path: "/admin/products/create",
        element: <ManageProductPage />,
      },
    ],
  },
];
