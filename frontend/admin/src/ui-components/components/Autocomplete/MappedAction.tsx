import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ActionListItemDescriptor } from "../../types";
import { Icon } from "../Icon";
import { Listbox } from "../Listbox";
import { Text } from "../Text";

import { MappedActionContext, MappedActionContextType } from "./context";

export interface MappedActionProps extends ActionListItemDescriptor {
  /** Thể hiện action là primary */
  primary?: boolean;
  /** Ngăn action bởi đường viền */
  divider?: boolean;
}

export function MappedAction({
  active,
  content,
  disabled,
  icon,
  prefix,
  suffix,
  ellipsis,
  role,
  destructive,
  primary,
  divider,
  helpText,
  onAction,
}: MappedActionProps) {
  let prefixMarkup: React.ReactNode = null;

  if (prefix) {
    prefixMarkup = <StyledPrefix>{prefix}</StyledPrefix>;
  } else if (icon) {
    prefixMarkup = (
      <StyledPrefix>
        <Icon source={icon} />
      </StyledPrefix>
    );
  }

  const suffixMarkup = suffix ? <StyledSuffix>{suffix}</StyledSuffix> : null;

  const contentText = ellipsis && content ? `${content}…` : content;

  const contentMarkup = (
    <StyledContent>
      <StyledText>{contentText}</StyledText>
      {helpText ? (
        <Text color="subdued" as="span" variant="bodyMd">
          {helpText}
        </Text>
      ) : null}
    </StyledContent>
  );

  const context = useMemo(
    (): MappedActionContextType => ({
      role,
      onAction,
      destructive,
    }),
    [role, onAction, destructive]
  );
  return (
    <MappedActionContext.Provider value={context}>
      <Listbox.Action selected={active} disabled={disabled} value={content || ""} divider={divider}>
        <StyledMappedAction destructive={destructive} $disabled={disabled} primary={primary}>
          <StyledActionContent>
            {prefixMarkup}
            {contentMarkup}
            {suffixMarkup}
          </StyledActionContent>
        </StyledMappedAction>
      </Listbox.Action>
    </MappedActionContext.Provider>
  );
}

const StyledActionContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(1)};
`;

const StyledPrefix = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
`;

const StyledSuffix = styled.div``;

const StyledContent = styled.div`
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const StyledText = styled.div`
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
`;

const StyledMappedAction = styled.div<{
  destructive?: boolean;
  primary?: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding: ${(p) => p.theme.spacing(0.5)} 0;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};

  ${(p) => {
    if (p.$disabled) {
      return css`
        background-image: none;
        color: ${p.theme.colors.textDisabled};
        ${StyledPrefix} svg {
          color: ${p.theme.colors.iconDisabled};
          fill: ${p.theme.colors.iconDisabled};
        }
      `;
    } else if (p.primary) {
      return css`
        ${StyledText} {
          color: ${p.theme.colors.textPrimary};
        }
        ${StyledPrefix} svg {
          color: ${p.theme.colors.interactive};
          fill: ${p.theme.colors.interactive};
        }
        &:active {
          ${StyledPrefix} svg {
            color: ${p.theme.colors.interactivePressed};
            fill: ${p.theme.colors.interactivePressed};
          }
        }
      `;
    } else if (p.destructive) {
      return css`
        ${StyledText} {
          color: ${p.theme.colors.textCritical};
        }
        ${StyledPrefix} svg {
          color: ${p.theme.colors.interactiveCritical};
          fill: ${p.theme.colors.interactiveCritical};
        }
        &:active {
          ${StyledPrefix} svg {
            color: ${p.theme.colors.interactiveCriticalPressed};
            fill: ${p.theme.colors.interactiveCriticalPressed};
          }
        }
      `;
    } else {
      return css`
        ${StyledPrefix} svg {
          color: ${p.theme.colors.icon};
          fill: ${p.theme.colors.icon};
        }
        &:active {
          ${StyledPrefix} svg {
            color: ${p.theme.colors.iconPressed};
            fill: ${p.theme.colors.iconPressed};
          }
        }
      `;
    }
  }}
`;
