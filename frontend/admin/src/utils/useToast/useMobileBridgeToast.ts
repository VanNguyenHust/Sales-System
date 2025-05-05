import { useCallback, useEffect, useRef } from "react";

import { Toast as ToastActions } from "../../features/mobile-bridge/actions";
import { DEFAULT_TOAST_DURATION } from "../../features/mobile-bridge/constants";
import { useMobileBridge } from "../../features/mobile-bridge/context";

interface ShowOptions extends ToastActions.Payload {
  onDismiss?: () => void;
  action?: {
    content: string;
    onAction?: () => void;
  };
}

interface UseMobileBridgeToastReturn {
  showToast(content: string, options?: Partial<Omit<ShowOptions, "message">>): void;
}

export function useMobileBridgeToast(): UseMobileBridgeToastReturn {
  const app = useMobileBridge();
  const toastList = useRef<ToastActions.Toast[]>([]);

  const showToast: UseMobileBridgeToastReturn["showToast"] = useCallback(
    (content, options) => {
      const toast = ToastActions.create(app, {
        content,
        isError: options?.isError,
        duration: options?.duration || DEFAULT_TOAST_DURATION,
        action: options?.action,
      });
      toast.dispatch(ToastActions.Action.SHOW);
      toastList.current.push(toast);
      toast.subscribe(ToastActions.Action.CLEAR, () => {
        options?.onDismiss?.();
        toastList.current.splice(toastList.current.indexOf(toast), 1);
        toast.unsubscribe();
      });
      toast.subscribe(ToastActions.Action.ACTION, () => {
        options?.action?.onAction?.();
      });
    },
    [app]
  );

  useEffect(
    () => () => {
      toastList.current.forEach((toast) => {
        toast.unsubscribe();
      });
    },
    []
  );

  return { showToast };
}
