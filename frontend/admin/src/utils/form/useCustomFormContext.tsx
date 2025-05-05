import React from "react";
import type { FieldValues } from "react-hook-form";

import { CustomUseFormReturn } from "./types";

type CustomFormProviderProps<TFieldValues extends FieldValues = FieldValues, TContext = any> = CustomUseFormReturn<
  TFieldValues,
  TContext
> & {
  children: React.ReactNode | React.ReactNode[];
};

const HookFormContext = React.createContext<CustomUseFormReturn | null>(null);

export const useCustomFormContext = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(): CustomUseFormReturn<TFieldValues, TContext> =>
  React.useContext(HookFormContext) as CustomUseFormReturn<TFieldValues, TContext>;

export const CustomFormProvider = <TFieldValues extends FieldValues, TContext>({
  children,
  ...formProps
}: CustomFormProviderProps<TFieldValues, TContext>) => {
  return (
    <HookFormContext.Provider value={formProps as unknown as CustomUseFormReturn}>{children}</HookFormContext.Provider>
  );
};
