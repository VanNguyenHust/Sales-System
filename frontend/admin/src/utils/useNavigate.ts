import { useCallback } from "react";
import { type NavigateOptions, type To, useNavigate as useNavigate1 } from "react-router-dom";

import { useMobileBridge } from "app/features/mobile-bridge";
import { dispatchRedirect } from "app/features/mobile-bridge/util/dispatchRedirect";
import { isSapoMobileBridge } from "app/utils/mobile";

/**
 * Universal useNavigate
 *
 * - in web: using react-router-dom navigate
 * - in mobible bridge: using Redirect action
 */

type UseNavigateReturn = (to: To, options?: NavigateOptions) => void;

export function useNavigate(): UseNavigateReturn {
  const app = useMobileBridge();
  const navigate1 = useNavigate1();

  const navigate: UseNavigateReturn = (to, options) => {
    if (isSapoMobileBridge) {
      if (typeof to === "string") {
        dispatchRedirect(app, to, options?.replace);
      } else {
        dispatchRedirect(app, `${to.pathname}${to.search}${to.hash}`, options?.replace);
      }
    } else {
      navigate1(to, options);
    }
  };

  return useCallback(navigate, [app, navigate1]);
}
