import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { visuallyHidden } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { Choice } from "../Checkbox/Choice";
import { ChoiceHoverContext } from "../Checkbox/context";
import { HelpIndicatorProps } from "../HelpIndicator";

export interface RadioButtonProps {
  /** Label cho radio button */
  label?: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** ID của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Trạng thái select của radio button */
  checked?: boolean;
  /** Disable input */
  disabled?: boolean;
  /** Giá trị của form input */
  value?: string;
  /** Thông tin mô tả form input */
  helpText?: React.ReactNode;
  /** Callback khi radio button được toggle */
  onChange?: (newChecked: boolean, id: string) => void;
}

/**
 * Sử dụng các nút radio để biểu diễn các item trong danh sách mà người dùng phải chọn một trong các item đó.
 */
export function RadioButton({
  label,
  labelTooltip,
  helpText,
  checked,
  disabled,
  onChange,
  id: idProp,
  name: nameProp,
  value,
}: RadioButtonProps) {
  const id = useUniqueId("RadioButton", idProp);
  const name = nameProp || id;

  const handleChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
    !disabled && onChange && onChange(currentTarget.checked, id);
  };

  return (
    <Choice id={id} label={label} labelTooltip={labelTooltip} helpText={helpText} disabled={disabled}>
      <StyledRadioButton>
        <ChoiceHoverContext.Consumer>
          {(hoverred) => (
            <StyledInput
              id={id}
              name={name}
              value={value}
              type="radio"
              hoverred={hoverred}
              checked={checked}
              disabled={disabled}
              onChange={handleChange}
            />
          )}
        </ChoiceHoverContext.Consumer>
        <StyledBackdrop />
      </StyledRadioButton>
    </Choice>
  );
}

const StyledRadioButton = styled.span`
  position: relative;
  margin: ${(p) => p.theme.spacing(0.25)};
`;

const StyledBackdrop = styled.span`
  position: relative;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderDarker};
  border-radius: ${(p) => p.theme.shape.borderRadius("full")};
  transition: border-color ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase};

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    transform-origin: 50% 50%;
    height: calc(${(p) => p.theme.spacing(2)});
    width: calc(${(p) => p.theme.spacing(2)});
    background-color: ${(p) => p.theme.colors.interactive};
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    transition: opacity ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase},
      transform ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase};

    ${(p) => p.theme.breakpoints.down("md")} {
      height: calc(${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(0.5)});
      width: calc(${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(0.5)});
    }
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.0625rem);
    right: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.0625rem);
    bottom: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.0625rem);
    left: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.0625rem);
    display: block;
    pointer-events: none;
    box-shadow: 0 0 0 calc(${(p) => p.theme.shape.borderWidth(1)}*-1 + -0.0625rem)
      ${(p) => p.theme.colors.borderInteractiveFocus};
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
  }
`;

const StyledInput = styled.input<{
  hoverred: boolean;
}>`
  ${visuallyHidden}
  &:checked + ${StyledBackdrop} {
    border-color: ${(p) => p.theme.colors.interactive};

    &::before {
      transition: opacity ${(p) => p.theme.motion.transformEase} ${(p) => p.theme.motion.transformEase},
        transform ${(p) => p.theme.motion.transformEase} ${(p) => p.theme.motion.transformEase};
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &:disabled + ${StyledBackdrop} {
    border-color: ${(p) => p.theme.colors.borderDisabledDarker};
    background-color: ${(p) => p.theme.colors.surfaceDisabled};
    cursor: default;

    &::before {
      background-color: ${(p) => p.theme.colors.borderDisabledDarker};
    }
  }

  ${(p) =>
    p.hoverred &&
    css`
      &:not(:checked):not(:disabled) + ${StyledBackdrop} {
        background-color: ${p.theme.colors.surfaceHovered};
      }
    `}

  &:focus-visible + ${StyledBackdrop}::after {
    box-shadow: 0 0 0 0.125rem ${(p) => p.theme.colors.borderInteractiveFocus};
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
  }
`;
