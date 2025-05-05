import { memo, useEffect } from "react";

import { useSettingLayout } from "app/features/setting/components/SettingLayout";
import { type ContextualSaveBarProps } from "app/features/setting/components/SettingLayout/ContextualSaveBar";

interface Props extends ContextualSaveBarProps {}

export const SettingContextualSaveBar = memo(function SettingContextualSaveBar({
  message,
  saveAction,
  discardAction,
}: Props) {
  const { setContextualSaveBar, removeContextualSaveBar } = useSettingLayout();

  useEffect(() => {
    setContextualSaveBar({
      message,
      saveAction,
      discardAction,
    });
  }, [message, saveAction, discardAction, setContextualSaveBar]);

  useEffect(() => {
    return removeContextualSaveBar;
  }, [removeContextualSaveBar]);

  return null;
});
