import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useUniqueId } from "../../utils/uniqueId";
import { Checkbox, CheckboxProps } from "../Checkbox";

export interface HeaderCheckboxProps extends Pick<CheckboxProps, "checked" | "label" | "disabled" | "onChange"> {}

export function HeaderCheckbox({ checked, onChange, ...rest }: HeaderCheckboxProps) {
  const id = useUniqueId("HeaderCheckbox");

  const handleSelectOption = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(!checked, id);
    },
    [checked, id, onChange]
  );

  // prevents lost of focus on Textfield
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <StyledCheckbox onClick={handleSelectOption} onMouseDown={handleMouseDown}>
      <Checkbox id={id} name={id} {...rest} checked={checked} />
    </StyledCheckbox>
  );
}

const StyledCheckbox = styled.span``;
