import { createContext, useContext } from "react";

export interface PopoverContextType {
  isPositioned: boolean;
}

export const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("No Popover was provided. Your component must be wrapped in a <Popover> component.");
  }
  return context;
}
