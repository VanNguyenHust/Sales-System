import { LayoutComponent } from "./components/LayoutComponent";
import Dashboard from "./pages/Dashboard";
import ManageListStorePage from "./pages/stores/ManageListStorePage";
import ManageStoreDetailPage from "./pages/stores/ManageStoreDetailPage";

export const routes = [
  {
    path: "/",
    element: <LayoutComponent />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "stores", element: <ManageListStorePage /> },
      { path: "stores/:storeId", element: <ManageStoreDetailPage /> },
    ],
  },
];
