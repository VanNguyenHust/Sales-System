import React, { useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { MinusMinorIcon, TickSmallMinorIcon } from "@/ui-icons";

import type { Theme } from "../../themes/types";
import type { Error } from "../../types";
import { useUniqueId } from "../../utils/uniqueId";
import { HelpIndicatorProps } from "../HelpIndicator";
import { Icon } from "../Icon";

import { Choice } from "./Choice";
import { ChoiceHoverContext } from "./context";

export interface CheckboxProps {
  /** Label cho checkbox */
  label?: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** ID của form input */
  id?: string;
  /** Tên của form input */
  name?: string;
  /** Trạng thái select của checkbox */
  checked?: boolean | "indeterminate";
  /** Disable input */
  disabled?: boolean;
  /** Giá trị của form input */
  value?: string;
  /** Thông tin mô tả form input */
  helpText?: React.ReactNode;
  /** Thông tin lỗi của form input */
  error?: Error;
  /** Callback khi checkbox được toggle */
  onChange?: (newChecked: boolean, id: string) => void;
}

/**
 * Hầu hết được sử dụng để chủ shop có thể lựa chọn 0, 1 hoặc nhiều đối tượng.
 */
export function Checkbox({
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
}: CheckboxProps) {
  const inputNode = useRef<HTMLInputElement>(null);
  const id = useUniqueId("Checkbox", idProp);

  const handleOnClick = () => {
    if (!onChange || inputNode.current === null || disabled) {
      return;
    }

    onChange(inputNode.current.checked, id);
    inputNode.current.focus();
  };

  const isIndeterminate = checked === "indeterminate";
  const isChecked = !isIndeterminate && Boolean(checked);

  const iconSource = isIndeterminate ? MinusMinorIcon : TickSmallMinorIcon;

  return (
    <Choice id={id} label={label} labelTooltip={labelTooltip} helpText={helpText} error={error} disabled={disabled}>
      <StyledCheckbox>
        <ChoiceHoverContext.Consumer>
          {(hoverred) => (
            <StyledInput
              id={id}
              ref={inputNode}
              name={name}
              value={value}
              type="checkbox"
              checked={isChecked}
              disabled={disabled}
              hoverred={hoverred}
              data-indeterminate={isIndeterminate}
              onClick={handleOnClick}
              onChange={noop}
            />
          )}
        </ChoiceHoverContext.Consumer>
        <StyledBackdrop onClick={stopPropagation} onKeyUp={stopPropagation} />
        <StyledIcon $disabled={disabled}>
          <Icon source={iconSource} />
        </StyledIcon>
      </StyledCheckbox>
    </Choice>
  );
}

function noop() {}

function stopPropagation(event: React.MouseEvent | React.KeyboardEvent | React.FormEvent) {
  event.stopPropagation();
}

const StyledCheckbox = styled.span`
  position: relative;
  margin: ${(p) => p.theme.spacing(0.25)};
`;

const StyledIcon = styled.span<{ $disabled?: boolean }>`
  svg {
    color: ${(p) => p.theme.colors.interactive};
    fill: ${(p) => p.theme.colors.interactive};
    scale: 1.3;

    ${(p) => p.theme.breakpoints.down("md")} {
      scale: 1.5;
    }
  }

  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  pointer-events: none;

  transform: translate3d(-50%, -50%, 0) scale(0.25);
  opacity: 0;
  transition: opacity ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase},
    transform ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase};

  ${(p) =>
    p.$disabled &&
    css`
      svg {
        fill: ${p.theme.colors.borderDisabledDarker};
        color: ${p.theme.colors.borderDisabledDarker};
      }
    `}
`;

const StyledBackdrop = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;

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
    border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  }
`;

const StyledInput = styled.input<{
  hoverred: boolean;
}>`
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.input};
  width: 100%;
  height: 100%;
  opacity: 0;
  margin: 0;
  + ${StyledBackdrop} {
    ${(p) => controlBackdrop(p.theme, "base", p.hoverred)}
  }

  &:checked,
  &[data-indeterminate="true"] {
    + ${StyledBackdrop} {
      ${(p) => controlBackdrop(p.theme, "active", p.hoverred)}
    }

    ~ ${StyledIcon} {
      transition: opacity ${(p) => p.theme.motion.duration150} ${(p) => p.theme.motion.transformEase},
        transform ${(p) => p.theme.motion.duration150} ${(p) => p.theme.motion.transformEase};
      transform: translate3d(-50%, -50%, 0) scale(1);
      opacity: 1;
    }
  }

  &:disabled {
    + ${StyledBackdrop} {
      ${(p) => controlBackdrop(p.theme, "disabled", p.hoverred)}
    }
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &:focus-visible + ${StyledBackdrop}::after {
    box-shadow: 0 0 0 0.125rem ${(p) => p.theme.colors.borderInteractiveFocus};
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
  }
`;

function controlBackdrop(
  theme: Theme,
  status: "base" | "active" | "disabled" | "disabled2" | "error",
  hoverred: boolean
) {
  switch (status) {
    case "base":
      return css`
        position: relative;
        border: ${theme.shape.borderWidth(2)} solid ${theme.colors.borderDarker};
        background-color: ${theme.colors.surface};
        border-radius: ${theme.shape.borderRadius(1)};

        &::before {
          content: "";
          position: absolute;
          top: calc(-1 * ${theme.shape.borderWidth(2)});
          right: calc(-1 * ${theme.shape.borderWidth(2)});
          bottom: calc(-1 * ${theme.shape.borderWidth(2)});
          left: calc(-1 * ${theme.shape.borderWidth(2)});
          border-radius: ${theme.shape.borderRadius(1)};
          opacity: 0;
          transform: scale(0.25);
          transition: opacity ${theme.motion.duration100} ${theme.motion.transformEase},
            transform ${theme.motion.duration100} ${theme.motion.transformEase};
        }

        ${hoverred &&
        css`
          cursor: pointer;
          background-color: ${theme.colors.surfaceHovered};
        `}
      `;
    case "active":
      return css`
        border-color: ${theme.colors.interactive};

        &::before {
          opacity: 1;
          transform: scale(1);
        }
      `;
    case "disabled":
      return css`
        border-color: ${theme.colors.borderDisabledDarker};
        background-color: ${theme.colors.surfaceDisabled};

        &:hover {
          cursor: default;
        }
      `;
    case "error":
      return css`
        border-color: ${theme.colors.borderCritical};
        background-color: ${theme.colors.surfaceCritical};

        &:hover {
          border-color: ${theme.colors.borderCritical};
        }

        &::before {
          background-color: ${theme.colors.borderCritical};
        }
      `;
    default:
      return css``;
  }
}
