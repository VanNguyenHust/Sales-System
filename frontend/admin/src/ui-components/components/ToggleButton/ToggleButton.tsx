import React, { useRef } from "react";
import styled from "@emotion/styled";

import type { Error } from "../../types";
import { visuallyHidden } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { Choice } from "../Checkbox/Choice";
import { HelpIndicatorProps } from "../HelpIndicator";

export interface ToggleButtonProps {
  /** Label cho toggle button */
  label?: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** ID của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Trạng thái select của toggle button */
  checked?: boolean;
  /** Disable input */
  disabled?: boolean;
  /** Giá trị của form input */
  value?: string;
  /** Thông tin mô tả form input */
  helpText?: React.ReactNode;
  /** Thông tin lỗi của form input */
  error?: Error;
  /** Callback khi toggle button được toggle */
  onChange?: (newChecked: boolean, id: string) => void;
}

/**
 * Hầu hết được sử dụng để lựa chọn 0, 1 cho một đối tượng
 */
export function ToggleButton({
  id: idProp,
  label,
  labelTooltip,
  name,
  value,
  error,
  disabled,
  checked,
  helpText,
  onChange,
}: ToggleButtonProps) {
  const inputNode = useRef<HTMLInputElement>(null);
  const id = useUniqueId("ToggleButton", idProp);
  const handleChange = ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
    !disabled && onChange && onChange(currentTarget.checked, id);
  };

  const isChecked = Boolean(checked);
  return (
    <Choice
      id={id}
      label={label}
      labelTooltip={labelTooltip}
      helpText={helpText}
      error={error}
      disabled={disabled}
      forToggleButton
    >
      <StyledToggleContainer data-choice-type="toggle-button">
        <StyledToggleInput
          id={id}
          ref={inputNode}
          name={name}
          value={value}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
        />
        <StyledToggle checked={isChecked} />
      </StyledToggleContainer>
    </Choice>
  );
}

const StyledToggleContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  position: relative;
  align-items: center;
  background-color: transparent;
  width: calc(${(p) => p.theme.spacing(8)} + ${(p) => p.theme.spacing(1)});
`;

const StyledToggleInput = styled.input`
  ${visuallyHidden}
`;

const StyledToggle = styled.span<{
  checked?: boolean;
}>`
  height: calc(${(p) => p.theme.spacing(4)} - ${(p) => p.theme.spacing(0.5)});
  width: calc(${(p) => p.theme.spacing(8)} + ${(p) => p.theme.spacing(1)});
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background-color: ${(p) => p.theme.components.toggleButton.backgroundSwitchOff};
  position: relative;

  &::before {
    position: absolute;
    left: 0;
    content: "";
    display: block;
    bottom: -3px;
    transition: ${(p) => p.theme.motion.duration400};
    border-radius: ${(p) => p.theme.shape.borderRadius("half")};
    height: ${(p) => p.theme.spacing(5)};
    width: ${(p) => p.theme.spacing(5)};
    background-color: ${(p) => p.theme.components.toggleButton.backgroundSliderRoundOff};
    box-shadow: ${(p) => p.theme.components.toggleButton.shadowSliderRound};
  }
  ${StyledToggleInput}:checked + &::before {
    background-color: ${(p) => p.theme.components.toggleButton.backgroundSliderRoundOn};
    transform: translateX(${(p) => p.theme.spacing(4)});
  }

  ${StyledToggleInput}:checked + & {
    background-color: ${(p) => p.theme.components.toggleButton.backgroundSwitchOn};
    transition: ${(p) => p.theme.motion.duration400};
  }

  ${StyledToggleInput}:disabled + & {
    background-color: ${(p) => p.theme.components.toggleButton.backgroundSwitchDisabled};
    &::before {
      background-color: ${(p) => p.theme.components.toggleButton.backgroundSliderRoundDisabled};
    }
  }

  ${StyledToggleInput}:checked:disabled + & {
    &::before {
      background-color: ${(p) => p.theme.components.toggleButton.backgroundSliderRoundCheckedDisabled};
    }
  }

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.125rem);
    right: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.125rem);
    bottom: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.125rem);
    left: calc(${(p) => p.theme.shape.borderWidth(2)}*-1 + -0.0625rem);
    display: block;
    pointer-events: none;
    border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  }

  ${StyledToggleInput}:focus-visible + & {
    &::after {
      box-shadow: 0 0 0 ${(p) => p.theme.shape.borderWidth(2)} ${(p) => p.theme.colors.borderInteractiveFocus};
      outline: ${(p) => p.theme.shape.borderWidth(2)} solid transparent;
    }
  }
`;
