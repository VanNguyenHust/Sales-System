import { createContext, useContext } from "react";

type TextFieldType = "textfield" | "select";

export interface ComboboxTextFieldType {
  activeOptionId?: string;
  listboxId?: string;
  textFieldFocusedIn?: boolean;
  setTextFieldLabelId?(id: string): void;
  onTextFieldClick(type: TextFieldType, keyboard?: boolean): void;
  onTextFieldFocus(type: TextFieldType): void;
  onTextFieldBlur(type: TextFieldType, event: React.FocusEvent | React.MouseEvent): void;
  onTextFieldChange(type: TextFieldType, value: string): void;
}

export interface ComboboxListboxType {
  textFieldLabelId?: string;
  textFieldFocused?: boolean;
  textFieldFocusedIn?: boolean;
  listboxId?: string;
  willLoadMoreOptions?: boolean;
  setActiveOptionId?(id: string): void;
  setListboxId?(id: string): void;
  onOptionSelected?(): void;
  onKeyToBottom?(): void;
}

export interface ComboboxListboxOptionType {
  allowMultiple?: boolean;
}

export interface ComboboxHeaderType {
  setTextFieldFocusedIn?(value: boolean): void;
}

export const ComboboxTextFieldContext = createContext<ComboboxTextFieldType | undefined>(undefined);

export const ComboboxListboxContext = createContext<ComboboxListboxType>({});

export const ComboboxListboxOptionContext = createContext<ComboboxListboxOptionType>({});

export const ComboboxHeaderContext = createContext<ComboboxHeaderType>({});

export function useComboboxTextField() {
  const context = useContext(ComboboxTextFieldContext);
  if (!context) {
    throw new Error("No Combobox was provided. Your component must be wrapped in a <Combobox> component.");
  }
  return context;
}

export function useComboboxListbox() {
  return useContext(ComboboxListboxContext);
}

export function useComboboxListboxOption() {
  return useContext(ComboboxListboxOptionContext);
}

export function useComboboxHeader() {
  return useContext(ComboboxHeaderContext);
}
