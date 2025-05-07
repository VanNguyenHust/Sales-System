import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./utils/instrument";

import { isLegacyPath } from "./features/admin/routes";
import { createReactRouterRoutes } from "./features/auth/createReactRouterRoutes";
import { setLocation } from "./state/reducers";
import { configureStore } from "./store/configureStore";
import { DEV_ENABLE_MSW, DEV_ENABLE_REACT_STRICT_MODE, IS_PROD } from "./constants";
import { routes } from "./routes";

const store = configureStore();
const router = createBrowserRouter(createReactRouterRoutes(routes));

// Handle authorization token from URL
const handleAuthToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('authorize');
  if (token) {
    localStorage.setItem('admin_token', token);
    // Remove token from URL
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', newUrl);
    return true;
  }
  return false;
};

// sync react router dom routing with legacy routing system
router.subscribe((newState) => store.dispatch(setLocation(newState.location)));

//TODO: remove me after clean all first-child, see: https://github.com/emotion-js/emotion/issues/1105
const disableEmotionWarnings = () => {
  if (IS_PROD) {
    return;
  }
  // eslint-disable-next-line no-console
  const log = console.error.bind(console);
  // eslint-disable-next-line no-console
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("The pseudo class") &&
      args[0].includes("is potentially unsafe when doing server-side rendering. Try changing it to")
    ) {
      return;
    }
    log(...args);
  };
};

const handlerTurboGraftPopStatePageChange = (event: Event) => {
  if (!window.Turbolinks) {
    return;
  }
  const pageChangeEvent = event as Event & { data: string };
  const path = new ComponentUrl(pageChangeEvent.data).pathname;
  //if url is not legacy path -> react route is going to control popstate render, so we need to prevent turbograft behavior
  if (!isLegacyPath(path)) {
    event.preventDefault();
  }
};

async function init() {
  disableEmotionWarnings();
  
  // Handle authorization if token exists in URL
  const hasAuth = handleAuthToken();
  if (hasAuth) {
    // Redirect to admin dashboard after handling token
    window.location.href = '/admin';
    return;
  }

  window.addEventListener("page:before-popstate", handlerTurboGraftPopStatePageChange);

  const appWithProviders = (
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  );

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    DEV_ENABLE_REACT_STRICT_MODE ? <React.StrictMode>{appWithProviders}</React.StrictMode> : appWithProviders
  );
}

init();
