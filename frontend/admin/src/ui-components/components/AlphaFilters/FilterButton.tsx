import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button, ButtonProps } from "../Button";

interface Props extends ButtonProps {
  first?: boolean;
  last?: boolean;
}

export const FilterButton = ({ last, first, ...rest }: Props) => {
  return (
    <StyledButton first={first} last={last}>
      <Button {...rest} />
    </StyledButton>
  );
};

const StyledButton = styled.span<{
  first?: boolean;
  last?: boolean;
}>`
  display: flex;
  button {
    white-space: nowrap;
    span {
      font-weight: ${(p) => p.theme.typography.fontWeightRegular};
    }
    ${(p) => {
      if (!p.first && !p.last) {
        return css`
          border-radius: 0;
        `;
      }
      if (p.first && p.last) {
        return css``;
      }
      if (p.first) {
        return css`
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        `;
      }
      if (p.last) {
        return css`
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        `;
      }
    }}
    ${(p) =>
      !p.first &&
      css`
        margin-left: calc(${p.theme.spacing(0.25)}*-1);
      `}
  }

  button:disabled,
  button:disabled:hover {
    border-color: ${(p) => p.theme.colors.border};
    svg {
      color: ${(p) => p.theme.colors.icon};
    }
  }
`;
