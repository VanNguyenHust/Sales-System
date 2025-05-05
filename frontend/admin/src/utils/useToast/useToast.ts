import { useCallback } from "react";

import { isSapoMobileBridge } from "app/utils/mobile";
import { showToast as globalShowToast } from "app/utils/toast";

import { useMobileBridgeToast } from "./useMobileBridgeToast";

/**
 * Universal show toast
 *
 * - in web: using Toast ui component
 * - in mobible bridge: using Toast action
 */
export function useToast() {
  const { showToast: mobileBridgeShowToast } = useMobileBridgeToast();

  const showToast: typeof mobileBridgeShowToast = useCallback(
    (message, options) => {
      if (isSapoMobileBridge) {
        mobileBridgeShowToast(message, options);
      } else {
        globalShowToast(
          message,
          options
            ? {
                ...options,
                error: options.isError,
              }
            : undefined
        );
      }
    },
    [mobileBridgeShowToast]
  );

  const showErrorToast: typeof mobileBridgeShowToast = useCallback(
    (message, options) => {
      if (isSapoMobileBridge) {
        mobileBridgeShowToast(message, {
          ...options,
          isError: true,
        });
      } else {
        globalShowToast(
          message,
          options
            ? {
                ...options,
                error: true,
              }
            : undefined
        );
      }
    },
    [mobileBridgeShowToast]
  );

  return { showToast, showErrorToast };
}
