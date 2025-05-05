import { useCallback } from "react";
import { type NavigateOptions, type To, useNavigate as useNavigate1 } from "react-router-dom";

import { ToastOptions } from "./type";
import { createToastStateFromOptions } from "./util";

interface NavigateFunction {
  (to: To, options?: NavigateOptions & ToastOptions): void;
}

/**
 * @deprecated Using util useNavigate
 * */
export function useNavigate() {
  const navigate = useNavigate1();
  return useCallback<NavigateFunction>(
    (to, options) => {
      let state = options?.state;
      if (state === undefined && options) {
        state = createToastStateFromOptions(options);
      }
      return navigate(to, {
        ...options,
        state,
      });
    },
    [navigate]
  );
}
