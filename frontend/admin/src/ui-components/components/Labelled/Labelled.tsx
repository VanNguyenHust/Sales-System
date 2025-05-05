import React, { useCallback, useContext, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import type { Action, Error } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { ComboboxTextFieldContext } from "../Combobox/context";
import { HelpIndicator, HelpIndicatorProps } from "../HelpIndicator";
import { InlineError } from "../InlineError";
import { Text } from "../Text";

export interface LabelledProps {
  /** id của form input */
  id: string;
  /** Nội dung label */
  label?: React.ReactNode;
  /** Tooltip mô tả label */
  labelTooltip?: string | HelpIndicatorProps;
  /** Lỗi hiển thị bên dưới input */
  error?: Error | boolean;
  /** Hành động của label */
  action?: Action;
  /** Thông tin mô tả form input */
  helpText?: React.ReactNode;
  /** Nội dung input */
  children?: React.ReactNode;
  /** Hiển thị thông tin input là bắt buộc */
  requiredIndicator?: boolean;
}

export function Labelled({
  id,
  label,
  error,
  action,
  helpText,
  children,
  labelTooltip,
  requiredIndicator,
}: LabelledProps) {
  const labelClickRef = useRef(false);
  const context = useContext(ComboboxTextFieldContext);

  const handleSelectBlur = useCallback(
    (event: React.MouseEvent) => {
      if (context) {
        if (labelClickRef.current) {
          labelClickRef.current = false;
        } else {
          context.onTextFieldBlur("select", event);
        }
      }
    },
    [context]
  );

  const handleLabelClick = useCallback(() => {
    if (context) {
      labelClickRef.current = true;
    }
  }, [context]);

  const actionMarkup = action ? <StyledAction>{buttonFrom(action, { plain: true })}</StyledAction> : null;

  const helpTextMarkup = helpText ? (
    <StyledHelpText id={helpTextID(id)} onClick={handleSelectBlur}>
      <Text as="span" color="subdued" breakWord variant="bodyMd">
        {helpText}
      </Text>
    </StyledHelpText>
  ) : null;

  const errorMarkup = error && typeof error !== "boolean" && (
    <StyledError onClick={handleSelectBlur}>
      <InlineError message={error} fieldID={id} />
    </StyledError>
  );

  let labelMarkup: JSX.Element | undefined = undefined;
  if (label) {
    const helpMarkup = labelTooltip ? (
      typeof labelTooltip === "string" ? (
        <HelpIndicator content={labelTooltip} />
      ) : (
        <HelpIndicator {...labelTooltip} />
      )
    ) : null;
    labelMarkup = (
      <StyledLabelWraper onClick={handleSelectBlur}>
        <StyledLabel labelHidden={!children}>
          <StyledLabelInner
            id={`${id}Label`}
            htmlFor={id}
            requiredIndicator={requiredIndicator}
            onClick={handleLabelClick}
          >
            {label}
          </StyledLabelInner>
          {helpMarkup}
        </StyledLabel>
        {actionMarkup}
      </StyledLabelWraper>
    );
  }

  return (
    <StyledLabelled>
      {labelMarkup}
      {children}
      {errorMarkup}
      {helpTextMarkup}
    </StyledLabelled>
  );
}

const StyledLabelWraper = styled.div`
  word-break: break-word;
  overflow-wrap: break-word;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: ${(p) => p.theme.spacing(1)};
`;

const StyledHelpText = styled.div`
  margin-top: ${(p) => p.theme.spacing(1)};
  margin-left: ${(p) => p.theme.spacing(3)};
`;

const StyledError = styled.div`
  margin-top: ${(p) => p.theme.spacing(1)};
  margin-left: ${(p) => p.theme.spacing(3)};
`;

const StyledAction = styled.div`
  flex: 0 0 auto;
`;

const StyledLabelled = styled.div``;

const StyledLabel = styled.div<{
  labelHidden?: boolean;
}>`
  display: ${(p) => (p.labelHidden ? "none" : "flex")};
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
  & > span {
    flex-shrink: 0;
  }
`;

const StyledLabelInner = styled.label<{
  requiredIndicator?: boolean;
}>`
  display: block;
  color: ${(p) => p.theme.colors.textSlim};
  ${(p) =>
    p.requiredIndicator &&
    css`
      &:after {
        content: "*";
        color: ${p.theme.colors.textCritical};
      }
    `}
`;

export function helpTextID(id: string) {
  return `${id}HelpText`;
}
