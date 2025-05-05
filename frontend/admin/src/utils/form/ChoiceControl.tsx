import type { FieldPath, FieldPathValue, FieldValues } from "react-hook-form";

import { Control, ControlProps } from "./Control";

export const ChoiceControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  value,
  render,
  ...rest
}: Omit<ControlProps<TFieldValues, TName>, "render"> & {
  value?: FieldPathValue<TFieldValues, TName>;
  render: (innerProps: {
    name: string;
    checked: boolean;
    onChange(checked: boolean): void;
    error?: string;
  }) => React.ReactElement;
}) => {
  return (
    <Control
      {...rest}
      render={(field) =>
        render({
          name: field.name,
          error: field.error,
          checked: value !== undefined ? field.value === value : Boolean(field.value),
          onChange: (checked) => (value !== undefined ? field.onChange(value as any) : field.onChange(checked as any)),
        })
      }
    />
  );
};
