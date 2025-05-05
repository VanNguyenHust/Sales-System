import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import type { Error } from "../../types";
import { visuallyHidden } from "../../utils/styles";
import { useToggle } from "../../utils/useToggle";
import { HelpIndicator, HelpIndicatorProps } from "../HelpIndicator";
import { InlineError } from "../InlineError";
import { Text } from "../Text";

import { ChoiceHoverContext } from "./context";

export interface ChoiceProps {
  /** Id của choice */
  id: string;
  /**	Label của choice */
  label?: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Set choice disabled */
  disabled?: boolean;
  /** Hiển thị 1 message lỗi */
  error?: Error | boolean;
  /**  Nội dung hiển thị bên trong choice */
  children?: React.ReactNode;
  /** Thêm text mô tả bên dưới choice */
  helpText?: React.ReactNode;
  /** Được sử dụng cho màn có nhiều checkbox khiến cho trạng thái disable dễ chịu hơn  */
  forToggleButton?: boolean;
  /** Callback khi choice click */
  onClick?(): void;
}

export function Choice({
  id,
  label,
  labelTooltip,
  children,
  disabled,
  helpText,
  error,
  forToggleButton,
  onClick,
}: ChoiceProps) {
  const { value: hoverred, setTrue: setHoveredTrue, setFalse: setHoverredFalse } = useToggle(false);
  const hasLabel = !!label;

  const labelMarkup = (
    <StyledChoice
      htmlFor={id}
      onClick={onClick}
      $disabled={disabled}
      hasLabel={hasLabel}
      onMouseEnter={setHoveredTrue}
      onMouseLeave={setHoverredFalse}
    >
      <ChoiceHoverContext.Provider value={hoverred}>
        <StyledChoiceControl forToggleButton={forToggleButton}>{children}</StyledChoiceControl>
      </ChoiceHoverContext.Provider>
      {hasLabel ? (
        <StyledChoiceLabel>
          <span>{label}</span>
        </StyledChoiceLabel>
      ) : null}
    </StyledChoice>
  );

  const helpMarkup = labelTooltip ? (
    typeof labelTooltip === "string" ? (
      <HelpIndicator content={labelTooltip} />
    ) : (
      <HelpIndicator {...labelTooltip} />
    )
  ) : null;

  const labelWrapper = labelTooltip ? (
    <StyledLabelContainer>
      {labelMarkup}
      {helpMarkup}
    </StyledLabelContainer>
  ) : (
    labelMarkup
  );

  const helpTextMarkup = helpText ? (
    <StyledHelpText>
      <Text as="span" color="subdued">
        {helpText}
      </Text>
    </StyledHelpText>
  ) : null;

  const errorMarkup = error && typeof error !== "boolean" && (
    <StyledError>
      <InlineError message={error} fieldID={id} />
    </StyledError>
  );

  const descriptionMarkup =
    helpTextMarkup || errorMarkup ? (
      <StyledDescriptions>
        {errorMarkup}
        {helpTextMarkup}
      </StyledDescriptions>
    ) : null;

  return descriptionMarkup ? (
    <StyledChoiceContainer forToggleButton={forToggleButton}>
      {labelWrapper}
      {descriptionMarkup}
    </StyledChoiceContainer>
  ) : (
    labelWrapper
  );
}

const StyledChoiceControl = styled.span<{
  forToggleButton?: boolean;
}>`
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  margin-right: ${(p) => p.theme.spacing(2)};

  > * {
    width: 100%;
  }

  ${(p) => p.theme.breakpoints.down("md")} {
    width: calc(${(p) => p.theme.spacing(5)} + ${(p) => p.theme.spacing(0.5)});
    height: calc(${(p) => p.theme.spacing(5)} + ${(p) => p.theme.spacing(0.5)});
  }

  ${(p) =>
    p.forToggleButton &&
    css`
      width: calc(${p.theme.spacing(8)} + ${p.theme.spacing(1)});
      height: ${p.theme.spacing(5)};

      ${p.theme.breakpoints.down("md")} {
        width: calc(${p.theme.spacing(8)} + ${p.theme.spacing(1)});
        height: ${p.theme.spacing(5)};
      }
    `}
`;

const StyledChoiceLabel = styled.span`
  -webkit-tap-highlight-color: transparent;
`;

const StyledLabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledHelpText = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(1)};
`;

const StyledDescriptions = styled.div`
  padding-left: calc(${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(5)});

  ${(p) => p.theme.breakpoints.down("md")} {
    padding-left: calc(${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(5)} + ${(p) => p.theme.spacing(0.5)});
  }
`;
const StyledError = styled.div`
  font-size: ${(p) => p.theme.typography.fontSize100};
`;

const StyledChoiceContainer = styled.div<{
  forToggleButton?: boolean;
}>`
  ${(p) =>
    p.forToggleButton &&
    css`
      & > ${StyledDescriptions} {
        padding-left: calc(${p.theme.spacing(10)} + ${p.theme.spacing(1)});
      }
    `}
`;

const StyledChoice = styled.label<{
  $disabled?: boolean;
  hasLabel?: boolean;
}>`
  display: inline-flex;
  justify-content: flex-start;
  padding: ${(p) => p.theme.spacing(1, 0)};
  cursor: pointer;

  ${(p) =>
    p.$disabled &&
    css`
      cursor: default;
      > ${StyledChoiceLabel} {
        color: ${p.theme.colors.textDisabled};
      }
    `}

  ${(p) =>
    !p.hasLabel &&
    css`
      padding: 0;
      > ${StyledChoiceLabel} {
        ${visuallyHidden}
      }
      > ${StyledChoiceControl} {
        margin-top: 0;
        margin-right: 0;
      }
    `}
`;
