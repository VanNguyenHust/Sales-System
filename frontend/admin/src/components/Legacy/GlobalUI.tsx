import { useEffect, useState } from "react";
import { Loading, Toast, type ToastProps } from "@/ui-components";

import { toggleLegacyFullscreen } from "app/state/reducers";
import { useDispatch } from "app/types";
import { useToggle } from "app/utils/useToggle";
/**
 * Replace legacy toast, loading system with new one
 */
export function GlobalUI() {
  const { value: loading, setFalse: stopLoading, setTrue: startLoading } = useToggle(false);
  const [toast, setToast] = useState<ToastProps | undefined>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    window.__loadingStart__ = startLoading;
    window.__loadingStop__ = stopLoading;
    window.__showToast__ = (content, options) => {
      setToast({
        content,
        success: !options?.error,
        ...options,
        onDismiss: () => setToast(undefined),
      });
    };
    window.__toggleViewport__ = () => {
      dispatch(toggleLegacyFullscreen());
    };
    return () => {
      window.__loadingStart__ = undefined;
      window.__loadingStop__ = undefined;
      window.__showToast__ = undefined;
      window.__toggleViewport__ = undefined;
    };
  }, [dispatch, startLoading, stopLoading]);

  const loadingMarkup = loading ? <Loading /> : null;

  const toastMarkup = toast ? <Toast {...toast} /> : null;

  return (
    <>
      {loadingMarkup}
      {toastMarkup}
    </>
  );
}
