import React, { memo, useContext } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { WithinOptionItemContext } from "../AlphaFilters/context";
import { Checkbox } from "../Checkbox";
import { useComboboxListboxOption } from "../Combobox/context";
import { RadioButton } from "../RadioButton";

import { ActionContext } from "./context";

export interface TextOptionProps {
  /** Nội dung của option */
  children: React.ReactNode;
  /** Option có được chọn */
  selected?: boolean;
  /** Option bị disable */
  disabled?: boolean;
  /** Xuống dòng khi tràn */
  breakWord?: boolean;
}

export const TextOption = memo(function TextOption({ children, selected, disabled, breakWord }: TextOptionProps) {
  const isAction = useContext(ActionContext);
  const withinOptionItem = useContext(WithinOptionItemContext);
  const { allowMultiple } = useComboboxListboxOption();
  return (
    <StyledTextOption
      selected={selected}
      $disabled={disabled}
      isAction={Boolean(isAction)}
      allowMultiple={allowMultiple}
      breakWord={breakWord}
    >
      <StyledContent>
        {allowMultiple && !isAction ? (
          <StyledChoice>
            <Checkbox disabled={disabled} checked={selected} label={children} />
          </StyledChoice>
        ) : withinOptionItem && !allowMultiple && !isAction ? (
          <StyledChoice>
            <RadioButton disabled={disabled} checked={selected} label={children} />
          </StyledChoice>
        ) : (
          children
        )}
      </StyledContent>
    </StyledTextOption>
  );
});

export const StyledTextOption = styled.div<{
  selected: TextOptionProps["selected"];
  allowMultiple?: boolean;
  $disabled: TextOptionProps["selected"];
  isAction: boolean;
  breakWord?: boolean;
}>`
  margin: ${(p) => p.theme.spacing(1, 1, 0)};
  flex: 1;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(2)};
  display: flex;
  position: relative;
  ${(p) =>
    p.breakWord &&
    css`
      overflow-wrap: anywhere;
      word-break: normal;
    `}
  ${(p) =>
    p.isAction &&
    css`
      padding: calc(${p.theme.spacing(1)} + ${p.theme.spacing(0.5)}) ${p.theme.spacing(2)};
    `}

  ${(p) =>
    p.allowMultiple &&
    css`
      margin: ${p.theme.spacing(1, 1, 0)};
      padding: calc(${p.theme.spacing(0.5)} / 2) ${p.theme.spacing(2)};
    `}

  ${(p) => {
    if (p.$disabled) {
      return css`
        background-color: ${p.theme.colors.surfaceDisabled};
        color: ${p.theme.colors.textDisabled};
      `;
    }
    if (p.selected) {
      return css`
        cursor: pointer;
        background-color: ${p.theme.colors.surfaceSelected};
        &:hover {
          background-color: ${p.theme.colors.surfaceSelectedHovered};
        }
        &:active {
          background-color: ${p.theme.colors.surfaceSelectedPressed};
        }
      `;
    }
    return css`
      cursor: pointer;
      &:hover {
        background-color: ${p.theme.colors.surfaceHovered};
      }
      &:focus {
        outline: none;
      }
      [data-focused] &:active,
      &:active {
        background-color: ${p.theme.colors.surfacePressed};
      }
      [data-focused] & {
        outline: none;
        background-color: ${p.theme.colors.surfaceHovered};
        transition: background-color ${p.theme.motion.duration400};
      }
    `;
  }}
`;

const StyledContent = styled.div`
  flex: 1 1 auto;
  display: flex;
`;

const StyledChoice = styled.div`
  pointer-events: none;
`;
