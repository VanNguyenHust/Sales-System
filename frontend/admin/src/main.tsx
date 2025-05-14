import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";

import { Provider as ReduxProvider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes.tsx";
import { adminApi } from "./api.ts";

const router = createBrowserRouter(routes);

const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </React.Suspense>
  </React.StrictMode>
);
