import React, { useCallback, useEffect } from "react";

import { useUniqueId } from "../../utils/uniqueId";
import { TextField as TextFieldComponent, TextFieldProps } from "../TextField";

import { useComboboxTextField } from "./context";

export function TextField({ value, id: idProp, type = "text", onFocus, onBlur, onChange, ...rest }: TextFieldProps) {
  const textFieldId = useUniqueId("ComboboxTextField", idProp);
  const labelId = `${textFieldId}Label`;

  const { setTextFieldLabelId, onTextFieldFocus, onTextFieldChange, onTextFieldBlur } = useComboboxTextField();

  useEffect(() => {
    setTextFieldLabelId?.(labelId);
  }, [labelId, setTextFieldLabelId]);

  const handleFocus = useCallback(
    (event?: React.FocusEvent) => {
      onFocus?.(event);
      onTextFieldFocus("textfield");
    },
    [onFocus, onTextFieldFocus]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      onBlur?.(event);
      onTextFieldBlur("textfield", event);
    },
    [onBlur, onTextFieldBlur]
  );

  const handleChange = useCallback(
    (value: string, id: string) => {
      onChange?.(value, id);
      onTextFieldChange("textfield", value);
    },
    [onChange, onTextFieldChange]
  );

  return (
    <TextFieldComponent
      {...rest}
      value={value}
      id={textFieldId}
      type={type}
      role="combobox"
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  );
}
