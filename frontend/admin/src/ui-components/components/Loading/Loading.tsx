import { memo, useEffect } from "react";

import { useFrame } from "../Frame/useFrame";

/**
 * Loading component được dùng để thông báo cho chủ shop rằng có tiến trình như page load, form submit, ... đang được thực thi
 */
export const Loading = memo(function Loading() {
  const { startLoading, stopLoading } = useFrame();

  useEffect(() => {
    startLoading();

    return () => {
      stopLoading();
    };
  }, [startLoading, stopLoading]);

  return null;
});
