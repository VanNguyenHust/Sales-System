import type {
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Validate,
} from "react-hook-form";
import { Controller } from "react-hook-form";

export type ControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Pick<ControllerProps<TFieldValues, TName>, "control" | "name" | "shouldUnregister"> & {
  render: (
    innerProps: Pick<ControllerRenderProps<TFieldValues, TName>, "name" | "onChange" | "value"> & {
      error?: string;
    }
  ) => React.ReactElement;
  validates?: Validate<FieldPathValue<TFieldValues, TName>, TFieldValues>[];
};

export const Control = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControlProps<TFieldValues, TName>
) => {
  const { validates = [] } = props;
  const validate: Validate<FieldPathValue<TFieldValues, TName>, TFieldValues> = (value, formValue) => {
    for (const validator of validates) {
      const result = validator(value, formValue);
      if (result) {
        return result;
      }
    }
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      shouldUnregister={props.shouldUnregister}
      rules={{
        validate,
      }}
      render={({ field, fieldState }) =>
        props.render({
          name: field.name,
          onChange: (value) => {
            if (fieldState.error) {
              props.control?.setError(props.name, {});
            }
            field.onChange(value);
          },
          value: field.value,
          error: fieldState.error?.message,
        })
      }
    />
  );
};
