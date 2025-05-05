import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon, TextField, type TextFieldProps } from "@/ui-components";
import { CalendarIcon } from "@/ui-icons";

import { isValidDatetime, useDatetime } from "app/utils/datetime";

import { useDateTimeSelectTextField } from "./context";

export type DateFieldProps = Without<TextFieldProps, "suffix" | "value" | "onChange" | "readOnly"> & {
  format?: string;
};

export function DateField({ format, disabled, ...textFieldProps }: DateFieldProps) {
  const { onTextFieldClick, value, active } = useDateTimeSelectTextField();
  const { formatDate } = useDatetime();
  return (
    <StyledField onClick={disabled ? undefined : onTextFieldClick} $active={active} disabled={disabled}>
      <TextField
        {...textFieldProps}
        value={isValidDatetime(value) ? formatDate(value, format) : value}
        readOnly
        disabled={disabled}
        suffix={<Icon source={CalendarIcon} color={active ? "interactive" : "base"} />}
      />
    </StyledField>
  );
}

const StyledField = styled.span<{
  $active: boolean;
  disabled?: boolean;
}>`
  ${(p) =>
    !p.disabled &&
    css`
      input {
        cursor: pointer;
      }
    `}
  ${(p) =>
    p.$active &&
    css`
      [data-segment-control] {
        border-color: ${p.theme.colors.interactive};
      }
    `}
`;
