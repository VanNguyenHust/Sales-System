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

const router = createBrowserRouter(routes);

const store = configureStore({
  reducer: {
    [storeApi.reducerPath]: storeApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(storeApi.middleware)
      .concat(adminApi.middleware),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <ReduxProvider store={store}>
        <App>
          <RouterProvider router={router} />
        </App>
      </ReduxProvider>
    </React.Suspense>
  </React.StrictMode>
);
