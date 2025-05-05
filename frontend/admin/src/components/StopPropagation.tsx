import React, { ElementType, useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface Props {
  children: React.ReactNode;
  /** @default "div" */
  wrapper?: ElementType;
  fitContent?: boolean;
}

/** Helper component stop propagation event */
export const StopPropagation = ({ children, wrapper = "div", fitContent }: Props) => {
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  return (
    <StyledWrapper as={wrapper} fitContent={fitContent} onClick={stopPropagation}>
      {children}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ fitContent?: boolean; flexible?: boolean }>`
  ${({ fitContent }) =>
    fitContent &&
    css`
      width: fit-content;
      height: fit-content;
    `}
`;
