import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Toast, type ToastProps } from "@/ui-components";

import { NavigateContext, NavigateContextType } from "./context";

interface Route {
  to: {
    pathname: string;
    search: string;
  };
  from: {
    pathname: string;
    search: string;
  };
  backLink?: string;
  previousSettingLink?: string;
}

const settingPath = "/admin/settings";

export function Provider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { state } = location;
  const [toast, setToast] = useState<ToastProps | undefined>(undefined);

  const [route, setRoute] = useState<Route>({
    to: { pathname: location.pathname, search: location.search },
    from: { pathname: location.pathname, search: location.search },
    backLink: undefined,
  });

  useEffect(() => {
    setRoute((prev) => {
      let backLink: string | undefined = undefined;
      let previousSettingLink = prev.previousSettingLink;
      const shouldSaveBackLink =
        prev.to.pathname !== location.pathname && location.pathname.startsWith(prev.to.pathname);
      if (shouldSaveBackLink) {
        backLink = prev.to.pathname + prev.to.search;
      } else if (prev.to.pathname === location.pathname) {
        backLink = prev.backLink;
      }

      const shouldSavePreviousSettingLink =
        prev.to.pathname !== location.pathname &&
        location.pathname.startsWith(settingPath) &&
        !prev.to.pathname.startsWith(settingPath);
      if (shouldSavePreviousSettingLink) {
        previousSettingLink = prev.to.pathname + prev.to.search;
      }

      return {
        to: { pathname: location.pathname, search: location.search },
        from: prev.to,
        backLink,
        previousSettingLink,
      };
    });
  }, [location]);

  useEffect(() => {
    const toast = extractToast(state);
    if (toast) {
      setToast(toast);
    } else {
      setToast(undefined);
    }
  }, [state]);

  const handleDimiss = useCallback(() => {
    setToast(undefined);
    // clear state without trigger rerender
    window.history.replaceState({}, document.title);
  }, []);

  const toastMarkup = toast ? <Toast {...toast} onDismiss={handleDimiss} /> : null;

  const context = useMemo(
    (): NavigateContextType => ({
      backLink: route.backLink,
      previousSettingLink: route.previousSettingLink,
    }),
    [route.backLink, route.previousSettingLink]
  );

  return (
    <NavigateContext.Provider value={context}>
      {toastMarkup}
      {children}
    </NavigateContext.Provider>
  );
}

function extractToast(state: any): ToastProps | undefined {
  if (state && typeof state === "object" && "toast" in state) {
    return state.toast;
  }
  return undefined;
}
