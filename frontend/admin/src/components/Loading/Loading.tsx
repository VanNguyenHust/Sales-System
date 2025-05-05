import { useContext } from "react";
import { Loading as UILoading } from "@/ui-components";

import { SettingLayoutContext } from "app/features/setting/components/SettingLayout/context";

import { SettingLoading } from "./SettingLoading";

/**
 * Universal Loading
 *
 * - in setting: using SettingLoading
 * - in other: using Loading ui component
 */
export function Loading() {
  const settingContext = useContext(SettingLayoutContext);

  if (settingContext) {
    return <SettingLoading />;
  }

  return <UILoading />;
}
