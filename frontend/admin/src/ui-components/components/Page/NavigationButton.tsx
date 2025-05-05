import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Theme } from "../../themes/types";
import { IconSource } from "../../types";
import { focusRing, unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";
import { UnstyledLink } from "../UnstyledLink";

export interface NavigationButtonProps {
  id?: string;
  url?: string;
  disabled?: boolean;
  icon: IconSource;
  onClick?(): void;
}

export function NavigationButton({ id, url, icon, disabled, onClick }: NavigationButtonProps) {
  const contentMarkup = <Icon source={icon} />;

  const buttonMarkup = url ? (
    <StyledNavigationLink id={id} url={!disabled ? url : undefined} data-segment-control="true" disabled={disabled}>
      {contentMarkup}
    </StyledNavigationLink>
  ) : (
    <StyledNavigationButton id={id} onClick={onClick} type="button" data-segment-control="true" disabled={disabled}>
      {contentMarkup}
    </StyledNavigationButton>
  );

  return buttonMarkup;
}

const NavigationStyle = (theme: Theme) => css`
  ${unstyledButton}
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${theme.components.form.controlHeight};
  min-width: ${theme.components.form.controlHeight};
  text-decoration: none;
  margin: 0;
  padding: ${theme.spacing(0.5)};
  border-radius: ${theme.shape.borderRadius("base")};
  border: ${theme.shape.borderWidth(1)} solid ${theme.colors.borderNeutralSubdued};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text};
  svg {
    fill: ${theme.colors.icon};
    color: ${theme.colors.icon};
  }
  &:hover {
    background-color: ${theme.colors.surfaceHovered};
    svg {
      fill: ${theme.colors.iconHovered};
      color: ${theme.colors.iconHovered};
    }
  }
  &:active {
    background-color: ${theme.colors.surfacePressed};
    svg {
      fill: ${theme.colors.iconPressed};
      color: ${theme.colors.iconPressed};
    }
  }
  &:disabled {
    cursor: initial;
    background-color: ${theme.colors.surfaceDisabled};
    color: ${theme.colors.textDisabled};
    svg {
      fill: ${theme.colors.icon};
      color: ${theme.colors.icon};
    }
  }
  ${focusRing(theme)}
  &:focus-visible {
    ${focusRing(theme, { style: "focused" })}
  }
`;

const StyledNavigationButton = styled.button<{
  href?: string;
}>`
  ${(p) => NavigationStyle(p.theme)}
`;

const StyledNavigationLink = styled(UnstyledLink)`
  ${(p) => NavigationStyle(p.theme)}
`;
