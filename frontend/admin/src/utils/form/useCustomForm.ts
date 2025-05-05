import { useState } from "react";
import { type FieldValues, useForm, type UseFormProps } from "react-hook-form";

import { CustomUseFormReturn, FormError } from "./types";

type SubmitResult<TFieldValues extends FieldValues = FieldValues> =
  | {
      status: "fail";
      errors: FormError<TFieldValues>[];
    }
  | {
      status: "success";
    };

export function useCustomForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  props?: Pick<UseFormProps<TFieldValues, TContext>, "defaultValues" | "mode" | "resolver" | "values"> & {
    makeCleanAfterSubmit?: boolean;
    onSubmit?: (data: TFieldValues) => Promise<SubmitResult<TFieldValues>>;
  }
): CustomUseFormReturn<TFieldValues, TContext> {
  const { mode = "onSubmit", onSubmit, makeCleanAfterSubmit, ...rest } = props ?? {};
  const [submitErrors, setSubmitErrors] = useState<FormError<TFieldValues>[]>([]);
  const {
    formState: { isDirty, isSubmitting, dirtyFields, isSubmitSuccessful, errors },
    watch,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    setValue,
    control,
    resetField,
    getFieldState,
    trigger,
  } = useForm({
    mode,
    shouldFocusError: false,
    reValidateMode: mode === "onSubmit" ? "onSubmit" : "onChange",
    ...rest,
  });

  const doSubmit = handleSubmit(async (data) => {
    if (onSubmit) {
      const result = await onSubmit(data);
      if (result.status === "fail") {
        setSubmitErrors(result.errors);
        for (const field of result.errors) {
          if (field.field) {
            setError(field.field, { type: "custom", message: field.message });
          } else {
            setError("root", { type: "custom", message: field.message });
          }
        }
      } else {
        setSubmitErrors([]);
        if (makeCleanAfterSubmit) {
          reset(data);
        }
      }
    } else {
      if (makeCleanAfterSubmit) {
        reset(data);
      }
      return submitSuccess();
    }
  });

  const fieldValues = watch();

  return {
    clearErrors,
    errors,
    control,
    setValue,
    setError,
    fieldValues,
    reset,
    submitErrors,
    isDirty,
    isSubmitting,
    submit: doSubmit,
    fieldDirties: dirtyFields,
    resetField,
    isSubmitSuccessful,
    getFieldState,
    trigger,
  };
}

export function submitSuccess<TFieldValues extends FieldValues = FieldValues>(): SubmitResult<TFieldValues> {
  return { status: "success" };
}

export function submitErrors<TFieldValues extends FieldValues = FieldValues>(
  errors: FormError<TFieldValues>[]
): SubmitResult<TFieldValues> {
  return { status: "fail", errors };
}
