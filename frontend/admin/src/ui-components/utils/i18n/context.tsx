import { createContext, useContext } from "react";

import type { I18n } from "./I18n";

export const I18nContext = createContext<I18n | undefined>(undefined);

export function useI18n() {
  const i18n = useContext(I18nContext);

  if (!i18n) {
    throw new Error("No i18n was provided.");
  }

  return i18n;
}
