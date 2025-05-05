import { createContext, useContext } from "react";

export interface NavigableOption {
  domId: string;
  value: string;
  element: HTMLElement;
  disabled: boolean;
  isAction?: boolean;
  index?: number;
}

export interface ListboxContextType {
  setLoading(loading: boolean): void;
  onOptionSelect(option: NavigableOption): void;
}

export const ListboxContext = createContext<ListboxContextType | undefined>(undefined);
export const ActionContext = createContext<boolean>(false);
export const SectionContext = createContext<string | null>(null);

export function useListbox() {
  const listbox = useContext(ListboxContext);

  if (!listbox) {
    throw new Error("No Listbox was provided. Listbox components must be wrapped in a Listbox");
  }

  return listbox;
}
