import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";
import { App } from "antd";
import "antd/dist/reset.css";

import { Provider as ReduxProvider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { storeApi } from "./features/store/api.ts";
import { adminApi } from "./api.ts";
import storeInfoReducer from "./features/auth/storeInfoReducer.ts";
import AppInitializer from "./AppInitializer.tsx";
import { metafieldApi } from "./features/metafield/api.ts";
import { customerApi } from "./features/customer/api.ts";
import { productApi } from "./features/product/api.ts";

const router = createBrowserRouter(routes);

export const store = configureStore({
  reducer: {
    [storeApi.reducerPath]: storeApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [metafieldApi.reducerPath]: metafieldApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    storeInfo: storeInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(storeApi.middleware)
      .concat(adminApi.middleware)
      .concat(metafieldApi.middleware)
      .concat(customerApi.middleware)
      .concat(productApi.middleware),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <ReduxProvider store={store}>
        <AppInitializer>
          <App>
            <RouterProvider router={router} />
          </App>
        </AppInitializer>
      </ReduxProvider>
    </React.Suspense>
  </React.StrictMode>
);
