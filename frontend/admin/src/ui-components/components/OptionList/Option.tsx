import React, { useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Theme } from "../../themes/types";
import { unstyledButton } from "../../utils/styles";
import { Checkbox } from "../Checkbox";
import { Text } from "../Text";

interface OptionProps {
  id: string;
  label: React.ReactNode;
  value: string;
  section: number;
  index: number;
  disabled?: boolean;
  selected?: boolean;
  allowMultiple?: boolean;
  onClick(section: number, option: number): void;
}
export const Option = ({
  label,
  value,
  id,
  selected,
  allowMultiple,
  disabled,
  onClick,
  section,
  index,
}: OptionProps) => {
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    onClick(section, index);
  }, [disabled, index, onClick, section]);

  const optionMarkup = allowMultiple ? (
    <StyledCheckBox allowMultiple={allowMultiple} selected={selected} $disabled={disabled}>
      <Checkbox value={value} label={label} disabled={disabled} onChange={handleClick} checked={selected} />
    </StyledCheckBox>
  ) : (
    <StyledButton onClick={handleClick} disabled={disabled} selected={selected} allowMultiple={allowMultiple}>
      <Text as="span">{label}</Text>
    </StyledButton>
  );

  return (
    <StyledOption key={id} tabIndex={-1}>
      {optionMarkup}
    </StyledOption>
  );
};

const StyledOption = styled.li`
  &:not(:first-of-type) {
    margin-top: ${(p) => p.theme.spacing(1)};
  }
`;

const StyledButton = styled.button<{
  selected?: boolean;
  disabled?: boolean;
  allowMultiple?: boolean;
}>`
  ${unstyledButton};
  ${(p) => getStyleOption(p.theme, !!p.disabled, !!p.selected)}
  padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(2)};

  &:focus-visible:not(:active) {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledCheckBox = styled.div<{
  $disabled?: boolean;
  selected?: boolean;
  allowMultiple?: boolean;
}>`
  ${(p) => getStyleOption(p.theme, !!p.$disabled, !!p.selected)}
  & label {
    width: 100%;
    padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(2)};
  }
`;

const getStyleOption = (theme: Theme, disabled: boolean, selected: boolean) => {
  return css`
    text-align: left;
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-height: ${theme.spacing(8)};
    border-radius: ${theme.shape.borderRadius("base")};
    transition: ${theme.motion.duration50};

    ${disabled
      ? css`
          background: ${theme.colors.surfaceDisabled};
          cursor: default;
          color: ${theme.colors.textDisabled};
        `
      : css`
          ${selected &&
          css`
            background: ${theme.colors.surfaceSelected};
          `}
          cursor: pointer;
          &:hover {
            background: ${selected ? theme.colors.surfaceSelectedHovered : theme.colors.surfaceHovered};
          }
          &:active {
            background: ${selected ? theme.colors.surfaceSelectedPressed : theme.colors.surfacePressed};
          }
        `}
  `;
};
