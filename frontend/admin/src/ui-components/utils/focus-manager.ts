import { createContext, useContext, useEffect, useId, useMemo } from "react";

export interface FocusManagerContextType {
  trapFocusList: string[];
  add: (id: string) => void;
  remove: (id: string) => boolean;
}

export const FocusManagerContext = createContext<FocusManagerContextType | undefined>(undefined);

interface Options {
  trapping: boolean;
}

export function useFocusManager({ trapping }: Options) {
  const focusManager = useContext(FocusManagerContext);
  const id = useId();

  if (!focusManager) {
    throw new Error("No FocusManager was provided.");
  }

  const { trapFocusList, add: addFocusItem, remove: removeFocusItem } = focusManager;
  const canSafelyFocus = trapFocusList[0] === id;

  const value = useMemo(() => ({ canSafelyFocus }), [canSafelyFocus]);

  useEffect(() => {
    if (!trapping) return;
    addFocusItem(id);
    return () => {
      removeFocusItem(id);
    };
  }, [addFocusItem, id, removeFocusItem, trapping]);

  return value;
}
