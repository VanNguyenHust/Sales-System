import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowCaretDownIcon } from "@/ui-icons";

import { Theme } from "../../themes/types";
import { Icon } from "../Icon";

export interface SelectFieldProps {
  id: string;
  name?: string;
  label?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  hasGroup?: boolean;
  asInput?: boolean;
  focused?: boolean;
  error?: boolean;
  requiredIndicator?: boolean;
  children?: React.ReactNode;
  onChange?(value: string): void;
  onClick?(): void;
  onBlur?(event: React.FocusEvent): void;
  onFocus?(event: React.FocusEvent): void;
  onKeyDown?(event: React.KeyboardEvent): void;
}

export function SelectField({
  id,
  name,
  value,
  disabled,
  label,
  hasGroup,
  asInput,
  children: childrenProp,
  focused,
  error,
  requiredIndicator,
  onChange,
  onClick,
  onBlur,
  onFocus,
  onKeyDown,
}: SelectFieldProps) {
  const contentMarkup = (
    <StyledContent>
      <StyledSelectedOption>{label}</StyledSelectedOption>
      <StyledIconWrapper>
        <Icon source={ArrowCaretDownIcon} color="base" />
      </StyledIconWrapper>
    </StyledContent>
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onChange?.(event.currentTarget.value);
  };

  const children = asInput ? undefined : childrenProp;

  return (
    <StyledSelectWrapper>
      <StyledSelectInput
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onChange={handleChange}
        hasGroup={hasGroup}
        as={asInput ? "input" : undefined}
        focused={focused}
        role="combobox"
        readOnly={asInput ? true : undefined}
        inputMode={asInput ? "none" : undefined}
        autoComplete={asInput ? "off" : undefined}
        autoCorrect={asInput ? "off" : undefined}
        autoCapitalize={asInput ? "none" : undefined}
        spellCheck={asInput ? false : undefined}
        aria-invalid={error ? "true" : "false"}
        aria-required={requiredIndicator ? "true" : "false"}
      >
        {children}
      </StyledSelectInput>
      <StyledBackdrop data-segment-control="true" />
      {contentMarkup}
    </StyledSelectWrapper>
  );
}

const StyledSelectWrapper = styled.div`
  position: relative;
`;

const StyledBackdrop = styled.span`
  z-index: ${(p) => p.theme.zIndex.inputBackdrop};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(p) => p.theme.colors.surface};
  border: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledSelectInput = styled.select<{
  hasGroup?: boolean;
  focused?: boolean;
  readOnly?: boolean;
}>`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.input};
  text-transform: none;
  letter-spacing: normal;
  position: absolute;
  text-rendering: auto;
  margin: 0;
  opacity: 0;
  appearance: none;
  border: none;
  width: 100%;
  height: 100%;
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  font-size: ${(p) => p.theme.typography.fontSize200};
  padding-left: ${(p) => (p.hasGroup ? "0" : p.theme.spacing(3))};
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize100};
  }

  ~ ${StyledBackdrop} {
    ${(p) => controlBackdrop(p.theme, p.focused ? "active" : "base")}
  }

  &[aria-invalid="true"] {
    ~ ${StyledBackdrop} {
      ${(p) => controlBackdrop(p.theme, "error")}
    }
  }

  &:focus-visible,
  &:focus {
    ~ ${StyledBackdrop} {
      ${(p) => controlBackdrop(p.theme, "active")}
    }
  }

  &:disabled {
    ~ ${StyledBackdrop} {
      ${(p) => controlBackdrop(p.theme, "disabled")}
    }
    cursor: not-allowed;
  }
`;

const StyledContent = styled.div`
  font-size: ${(p) => p.theme.typography.fontSize200};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  line-height: ${(p) => p.theme.typography.fontLineHeight3};
  text-transform: initial;
  letter-spacing: initial;
  border: none;
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize100};
  }
  display: flex;
  align-items: center;
  position: relative;
  z-index: ${(p) => p.theme.zIndex.inputContent};
  width: 100%;
  min-height: ${(p) => p.theme.components.form.controlHeight};
  padding: ${(p) =>
    `calc((${p.theme.components.form.controlHeight} - ${p.theme.typography.fontLineHeight3} - ${p.theme.spacing(
      0.5
    )})/2) ${p.theme.spacing(3)}`};
  padding-right: ${(p) => p.theme.spacing(2)};
`;

const StyledIconWrapper = styled.span``;

const StyledSelectedOption = styled.span`
  flex: 1 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function controlBackdrop(theme: Theme, status: "base" | "active" | "disabled" | "error") {
  switch (status) {
    case "base":
      return css`
        border: ${theme.shape.borderWidth(1)} solid ${theme.colors.border};
        background-color: ${theme.colors.surface};

        &::before {
          opacity: 0;
          transform: scale(0.25);
          transition: opacity ${theme.motion.duration100} ${theme.motion.transformEase},
            transform ${theme.motion.duration100} ${theme.motion.transformEase};
        }
      `;
    case "active":
      return css`
        border-color: ${theme.colors.interactive};

        &::before {
          opacity: 1;
          transform: scale(1);
        }

        ~ ${StyledContent} ${StyledIconWrapper} svg {
          color: ${theme.colors.actionPrimary};
          fill: ${theme.colors.actionPrimary};
          scale: 1;
          transform: scaleY(-1);
        }
      `;
    case "disabled":
      return css`
        background-color: ${theme.colors.surfaceDisabled};
        border-color: ${theme.colors.borderDisabled};

        &:hover {
          cursor: default;
        }
      `;
    case "error":
      return css`
        &,
        &:hover {
          border-color: ${theme.colors.borderCritical};
        }
      `;
    default:
      return css``;
  }
}
