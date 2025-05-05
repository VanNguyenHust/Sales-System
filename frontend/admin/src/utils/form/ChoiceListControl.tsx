import type { FieldPath, FieldValues } from "react-hook-form";

import { Control, ControlProps } from "./Control";

export const ChoiceListControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  render,
  ...rest
}: Omit<ControlProps<TFieldValues, TName>, "render"> & {
  render: (innerProps: {
    name: string;
    value: string;
    selected: string[];
    onChange(selected: string[]): void;
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
          value: field.value as any,
          selected: field.value !== undefined ? [field.value as any] : [],
          onChange: (selected) => field.onChange(selected[0] as any),
        })
      }
    />
  );
};
