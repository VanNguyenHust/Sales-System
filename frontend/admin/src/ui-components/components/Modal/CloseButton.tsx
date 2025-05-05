import React from "react";
import styled from "@emotion/styled";
import { CloseBigIcon } from "@/ui-icons";

import { Button, ButtonProps } from "../Button";

export function CloseButton(props: ButtonProps) {
  return (
    <StyledCloseButton>
      <Button monochrome outline icon={CloseBigIcon} {...props} />
    </StyledCloseButton>
  );
}

const StyledCloseButton = styled.span`
  display: inline-block;
  color: ${(p) => p.theme.colors.icon};
  &:hover {
    color: ${(p) => p.theme.colors.iconHovered};
  }
  button {
    border: unset;
  }
`;
