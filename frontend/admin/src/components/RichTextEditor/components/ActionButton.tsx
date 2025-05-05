import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon, type IconSource } from "@/ui-components";
import { ArrowChevronDownIcon } from "@/ui-icons";

type Props = {
  icon?: IconSource;
  /** For AI */
  magic?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  pressed?: boolean;
  disclosure?: boolean;
  onClick?(): void;
};

export const ActionButton = ({ icon, magic: magicProp, disclosure, children, disabled, pressed, onClick }: Props) => {
  const magic = magicProp && !disabled;
  const iconMarkup = icon ? <Icon source={icon} color={magic ? "primary" : undefined} /> : null;
  const disclosureIconMarkup = disclosure ? (
    <StyledDisclosure>
      <Icon source={ArrowChevronDownIcon} />
    </StyledDisclosure>
  ) : null;
  return (
    <StyledButton icon={!!icon} disabled={disabled} pressed={pressed} onClick={onClick} magic={magic}>
      {children}
      {iconMarkup}
      {disclosureIconMarkup}
    </StyledButton>
  );
};

const StyledDisclosure = styled.div`
  margin-left: calc(${(p) => p.theme.spacing(1)} * -1);
`;

const StyledButton = styled.button<{
  pressed?: boolean;
  icon?: boolean;
  magic?: boolean;
}>`
  background: transparent;
  border: none;
  margin: 0;
  padding: ${(p) => p.theme.spacing(1)};
  padding-left: ${(p) => p.theme.spacing(2)};
  min-width: 6.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  font-size: ${(p) => p.theme.typography.fontSize100};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  line-height: ${(p) => p.theme.typography.fontLineHeight1};
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize75};
  }
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  outline: none;

  ${StyledDisclosure} {
    color: ${(p) => p.theme.colors.icon};
  }

  ${(p) => {
    if (p.disabled) {
      return css`
        color: ${p.theme.colors.iconDisabled};
        cursor: default;
        pointer-events: none;
        ${StyledDisclosure} {
          color: ${p.theme.colors.iconDisabled};
        }
      `;
    }
    if (p.pressed) {
      return css`
        &,
        &:hover {
          ${!p.magic &&
          css`
            color: ${p.theme.colors.textSlim};
            svg {
              color: ${p.theme.colors.textSlim};
            }
          `}
          background-color: ${p.theme.colors.surfaceNeutralHovered};
        }
      `;
    }
    return css`
      ${!p.magic &&
      css`
        color: ${p.theme.colors.textSlim};
        svg {
          color: ${p.theme.colors.textSlim};
        }
      `}
      &:hover {
        background-color: ${p.theme.colors.surfacePressed};
      }
      &:active {
        background-color: ${p.theme.colors.surfaceNeutralHovered};
      }
    `;
  }}

  ${(p) =>
    p.icon &&
    css`
      padding: ${p.theme.spacing(1)};
      min-width: 0;
    `}

  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    display: block;
    pointer-events: none;
    box-shadow: 0 0 0 -1px ${(p) => p.theme.colors.borderInteractiveFocus};
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }

  &:focus-visible:not(:active):after {
    box-shadow: 0 0 0 0.125rem ${(p) => p.theme.colors.borderInteractiveFocus};
    outline: 1px solid transparent;
  }
`;
