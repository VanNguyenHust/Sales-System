import type {
  DeepMap,
  DeepPartial,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormClearErrors,
  UseFormReturn,
} from "react-hook-form";

export interface FormError<TFieldValues extends FieldValues = FieldValues> {
  field?: FieldPath<TFieldValues> | null;
  message: string;
}

export type CustomUseFormReturn<TFieldValues extends FieldValues = FieldValues, TContext = any> = Pick<
  UseFormReturn<TFieldValues, TContext>,
  "control" | "reset" | "setValue" | "setError" | "resetField" | "clearErrors" | "getFieldState" | "trigger"
> & {
  submit: () => void;
  fieldValues: TFieldValues;
  isDirty: boolean;
  isSubmitting: boolean;
  submitErrors: FormError<TFieldValues>[];
  fieldDirties: Partial<Readonly<DeepMap<DeepPartial<TFieldValues>, boolean>>>;
  isSubmitSuccessful: boolean;
  errors: FieldErrors<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
};
