import { createContext, useContext } from "react";

export interface DateTimeSelectTextFieldContextType {
  onTextFieldClick(): void;
  value: string;
  active: boolean;
}

export const DateTimeSelectTextFieldContext = createContext<DateTimeSelectTextFieldContextType | undefined>(undefined);

export function useDateTimeSelectTextField() {
  const context = useContext(DateTimeSelectTextFieldContext);
  if (!context) {
    throw new Error("No DateTimeSelect was provided");
  }
  return context;
}
