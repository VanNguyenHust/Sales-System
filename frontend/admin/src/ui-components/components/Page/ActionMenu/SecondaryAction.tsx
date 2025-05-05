import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button, ButtonProps } from "../../Button";

interface SecondaryActionProps extends ButtonProps {
  pressed?: boolean;
}

export function SecondaryAction({ children, destructive, pressed, ...rest }: SecondaryActionProps) {
  return (
    <StyledSecondaryAction destructive={destructive} $disabled={rest.disabled} pressed={pressed}>
      <Button {...rest}>{children}</Button>
    </StyledSecondaryAction>
  );
}

const StyledSecondaryAction = styled.div<{
  destructive?: boolean;
  $disabled?: boolean;
  pressed?: boolean;
}>`
  a,
  button {
    background: transparent !important;
    box-shadow: none !important;
    border-radius: ${(p) => p.theme.shape.borderRadius("base")} !important;
    padding-left: ${(p) => p.theme.spacing(3)};
    padding-right: ${(p) => p.theme.spacing(3)};
    color: ${(p) => (p.destructive ? p.theme.colors.interactiveCritical : p.theme.colors.text)};

    svg,
    img {
      color: ${(p) => (p.destructive ? p.theme.colors.iconCritical : p.theme.colors.icon)};
    }

    ${(p) =>
      p.pressed
        ? css`
            background: ${p.theme.colors.surfacePressed} !important;
            color: ${p.theme.colors.text};
          `
        : !p.$disabled
        ? css`
            &:hover {
              background: ${p.destructive
                ? p.theme.colors.surfaceCriticalSubduedHovered
                : p.theme.colors.backgroundHoverred} !important;
              svg,
              img {
                color: ${p.destructive ? p.theme.colors.iconCritical : p.theme.colors.iconHovered};
              }
            }

            &:active {
              background: ${p.destructive
                ? p.theme.colors.surfaceCriticalSubduedPressed
                : p.theme.colors.backgroundPressed} !important;
              svg,
              img {
                color: ${p.destructive ? p.theme.colors.iconCritical : p.theme.colors.iconPressed};
              }
            }
          `
        : css`
            background: ${p.theme.colors.surfaceDisabled} !important;
            color: ${p.theme.colors.textDisabled};
          `}

    ${(p) => p.theme.breakpoints.up("md")} {
      border: none !important;
    }
  }
`;
