import { createContext, useContext } from "react";

export type PortalsContainerElement = HTMLDivElement | null;

export interface PortalsManager {
  container: PortalsContainerElement;
}

export const PortalsManagerContext = createContext<PortalsManager | undefined>(undefined);

export function usePortalsManager() {
  const portalsManager = useContext(PortalsManagerContext);

  if (!portalsManager) {
    throw new Error("No portals manager was provided");
  }

  return portalsManager;
}
