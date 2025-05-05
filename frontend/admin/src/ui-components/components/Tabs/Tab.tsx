import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { OffOutlineCloseIcon } from "@/ui-icons";

import { Theme } from "../../themes/types";
import { handleMouseUpByBlurring } from "../../utils/focus";
import { focusRing, unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";
import { UnstyledLink } from "../UnstyledLink";

export interface TabProps {
  selected?: boolean;
  children?: React.ReactNode;
  url?: string;
  onClick?(): void;
  canDelete?: boolean;
  onDelete?(): void;
}

export function Tab({ children, url, onClick, selected, canDelete, onDelete }: TabProps) {
  let tabIndex: 0 | -1;

  if (selected) {
    tabIndex = 0;
  } else {
    tabIndex = -1;
  }
  const deletedMarkup = canDelete ? (
    <StyledDelete onClick={onDelete}>
      <Icon source={OffOutlineCloseIcon} color="interactive" />
    </StyledDelete>
  ) : null;
  return (
    <StyledTab role="presentation">
      {url ? (
        <StyledLink
          selected={selected}
          url={url}
          onClick={onClick}
          role="tab"
          aria-selected={selected}
          tabIndex={tabIndex}
          onMouseUp={handleMouseUpByBlurring}
        >
          <StyledText>{children}</StyledText>
        </StyledLink>
      ) : (
        <StyledButton
          selected={selected}
          onClick={onClick}
          type="button"
          role="tab"
          aria-selected={selected}
          tabIndex={tabIndex}
          onMouseUp={handleMouseUpByBlurring}
        >
          <StyledText>{children}</StyledText>
        </StyledButton>
      )}
      {deletedMarkup}
    </StyledTab>
  );
}

const StyledDelete = styled.button`
  ${unstyledButton}
  width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  position: absolute;
  top: -${(p) => p.theme.spacing(2)};
  right: 0;
  opacity: 0;
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 1;
    visibility: visible;
  }
  span,
  svg {
    width: ${(p) => p.theme.spacing(4)};
    height: ${(p) => p.theme.spacing(4)};
  }
`;

const StyledTab = styled.li`
  display: flex;
  margin: 0;
  padding: 0;
  position: relative;
  &:hover {
    ${StyledDelete} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const StyledText = styled.span`
  position: relative;
  display: block;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  padding: ${(p) => p.theme.spacing(2, 4)};
  min-width: ${(p) => p.theme.components.form.controlHeight};
  font-size: ${(p) => p.theme.typography.fontSize100};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
`;

const itemStyle = (theme: Theme, selected?: boolean) => {
  return css`
    ${unstyledButton}

    color: ${theme.colors.textSubdued};
    position: relative;
    justify-content: center;
    width: 100%;
    min-width: 100%;
    margin-top: ${theme.spacing(0.25)};
    margin-bottom: calc(-1 * ${theme.spacing(0.25)});
    padding: ${theme.spacing(1, 1)};
    padding-bottom: calc(${theme.spacing(1)} + ${theme.spacing(0.5)});
    outline: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    &:hover {
      ${!selected &&
      css`
        text-decoration: none;
        ${StyledText} {
          color: ${theme.colors.text};
          background-color: transparent;
          &::before {
            background-color: ${theme.colors.borderSubdued};
          }
        }
      `}
    }
    &:visited {
      color: inherit;
    }
    &:active {
      background-color: transparent;
      ${StyledText} {
        &::before {
          background: ${theme.colors.borderSubdued};
        }
      }
    }
    &[data-state="open"] {
      text-decoration: none;
      ${StyledText} {
        color: ${theme.colors.text};
        svg {
          color: ${theme.colors.text};
        }
        background-color: transparent;
        &::before {
          background-color: ${theme.colors.borderSubdued};
        }
      }
    }

    ${StyledText} {
      ${focusRing(theme)}
      &::before {
        content: "";
        position: absolute;
        bottom: calc(${theme.spacing(1)} * -1.5);
        left: 0;
        right: 0;
        height: ${theme.shape.borderWidth(2)};
        border-top-left-radius: ${theme.shape.borderRadius("base")};
        border-top-right-radius: ${theme.shape.borderRadius("base")};
      }
      ${selected &&
      css`
        color: ${theme.colors.textPrimary};
        &:focus {
          outline: ${theme.spacing(0.5)} solid transparent;
        }
        &::before {
          background: ${theme.colors.actionPrimary};
        }
      `}
    }

    &:focus-visible:not(:active) {
      ${StyledText} {
        ${focusRing(theme, { style: "focused" })}
      }
    }
  `;
};

const StyledButton = styled.button<{
  selected?: TabProps["selected"];
}>`
  ${(p) => itemStyle(p.theme, p.selected)}
`;

const StyledLink = styled(UnstyledLink, {
  shouldForwardProp: (prop) => !["selected"].includes(prop),
})<{
  selected?: boolean;
}>`
  ${(p) => itemStyle(p.theme, p.selected)}
`;
