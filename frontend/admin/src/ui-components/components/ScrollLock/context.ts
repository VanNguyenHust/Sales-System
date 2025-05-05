import { createContext, useContext } from "react";

import { MissingProviderError } from "../../utils/errors";

import type { ScrollLockManager } from "./ScrollLockManager";

export const ScrollLockManagerContext = createContext<ScrollLockManager | undefined>(undefined);

export function useScrollLockManager() {
  const scrollLockManager = useContext(ScrollLockManagerContext);

  if (!scrollLockManager) {
    throw new MissingProviderError("No ScrollLockManager was provided.");
  }
  return scrollLockManager;
}
