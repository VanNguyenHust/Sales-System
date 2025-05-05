import { memo, useEffect } from "react";

import { useSettingLayout } from "app/features/setting/components/SettingLayout/context";

export const SettingLoading = memo(function SettingLoading() {
  const { startLoading, stopLoading } = useSettingLayout();

  useEffect(() => {
    startLoading();

    return () => {
      stopLoading();
    };
  }, [startLoading, stopLoading]);

  return null;
});
