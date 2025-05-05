import type { FieldPath, FieldValues } from "react-hook-form";

import { Control, ControlProps } from "./Control";

export const TextControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  asNumber,
  render,
  ...rest
}: Omit<ControlProps<TFieldValues, TName>, "render"> & {
  asNumber?: boolean;
  render: (innerProps: { name: string; value: any; onChange(value: any): void; error?: string }) => React.ReactElement;
}) => {
  return (
    <Control
      {...rest}
      render={(field) =>
        render({
          name: field.name,
          value: asNumber ? transform(field.value) : field.value,
          error: field.error,
          onChange: (value) => field.onChange(asNumber ? transform(value) : value),
        })
      }
    />
  );
};

function transform(value: any) {
  if (value === "" || value === undefined) {
    return "";
  }
  return Number(value);
}
