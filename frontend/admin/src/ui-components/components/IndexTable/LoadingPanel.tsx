import React, { useContext, useRef } from "react";
import { Transition, type TransitionStatus } from "react-transition-group";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Spinner } from "../Spinner";
import { StickyContext } from "../StickyManager/StickyContextManager";

interface Props {
  loading?: boolean;
  large?: boolean;
}

export function LoadingPanel({ loading, large }: Props) {
  const loadingElement = useRef<HTMLDivElement>(null);
  const inSticky = useContext(StickyContext);
  return (
    <Transition in={loading} timeout={200} unmountOnExit nodeRef={loadingElement}>
      {(state) => {
        return (
          <StyledLoadingPanel ref={loadingElement} state={state} inSticky={inSticky}>
            <StyledLoadingPanelRow large={large}>
              <Spinner size="small" />
            </StyledLoadingPanelRow>
          </StyledLoadingPanel>
        );
      }}
    </Transition>
  );
}

const StyledLoadingPanel = styled.div<{
  state: TransitionStatus;
  inSticky?: boolean;
}>`
  position: absolute;
  z-index: ${(p) => (p.inSticky ? p.theme.zIndex(2) : p.theme.zIndex.indexTableLoadingPanel)};
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: ${(p) => p.theme.colors.surface};
  padding: ${(p) => p.theme.spacing(2, 4)};
  box-shadow: ${(p) => p.theme.shadow.base};
  transition: transform ${(p) => p.theme.motion.duration200} ease, opacity ${(p) => p.theme.motion.duration200} ease;
  opacity: 0;
  transform: translateY(-100%);
  ${(p) => {
    switch (p.state) {
      case "entering":
        return css`
          opacity: 1;
          transform: translateY(0);
        `;
      case "entered":
        return css`
          opacity: 1;
          transform: translateY(0);
        `;
      case "exiting":
        return css`
          opacity: 0;
          transform: translateY(-100%);
        `;
      case "exited":
        return css`
          opacity: 0;
          transform: translateY(-100%);
        `;
      default:
        return undefined;
    }
  }}
`;

const StyledLoadingPanelRow = styled.div<{
  large?: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  background: ${(p) => p.theme.components.indexTable.headerBackgroundColor};
  justify-content: center;
  padding: ${(p) => (p.large ? p.theme.spacing(3, 3, 2, 3) : p.theme.spacing(2, 2, 1, 2))};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
`;
