import React, { useContext } from "react";
import styled from "@emotion/styled";

import { useUniqueId } from "../../../utils/uniqueId";
import { Checkbox, CheckboxProps } from "../../Checkbox";
import { Listbox } from "../../Listbox";
import { OptionItemContent } from "../context";
import { Pane } from "../Pane";

export interface OptionCheckbox extends Pick<CheckboxProps, "checked" | "label" | "disabled" | "onChange"> {}

export function OptionCheckbox({ checked, onChange, ...rest }: OptionCheckbox) {
  const id = useUniqueId("OptionCheckbox");
  const limitWidth = useContext(OptionItemContent)?.limitWidth;

  const handleChange = (value: string) => {
    if (value === id) {
      onChange?.(!checked, id);
    }
  };

  return (
    <Pane fixed limitWidth={limitWidth}>
      <StyledCheckbox>
        <Listbox onSelect={handleChange}>
          <Listbox.Option value={id}>
            <Checkbox checked={checked} {...rest} />
          </Listbox.Option>
          <Listbox.Option value={`action-${id}`} />
        </Listbox>
      </StyledCheckbox>
    </Pane>
  );
}

const StyledCheckbox = styled.div`
  padding: ${(p) => p.theme.spacing(1, 3)};
  ul {
    display: flex;
    li:last-child {
      flex: 1;
    }
  }
`;
