import React from "react";
import type { BeaconRenderProps, Placement } from "react-joyride";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const Beacon = React.forwardRef<HTMLSpanElement>((props, ref) => {
  const beaconProps = props as BeaconRenderProps;
  return (
    <StyledContainer placement={beaconProps.step.placementBeacon} ref={ref} {...props}>
      <StyledBorderFive />
      <StyledBorderFour />
      <StyledBorderThree />
      <StyledBorderTwo />
      <StyledBorderOne />
      <StyledCircleRoot />
    </StyledContainer>
  );
});

Beacon.displayName = "Beacon";

const opacity = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  100% {
    opacity: 0
  }
`;

const StyledContainer = styled.span<{ placement?: Placement }>`
  position: relative;
  width: calc(${(p) => `${p.theme.spacing(12)} + ${p.theme.spacing(2)}`});
  height: calc(${(p) => `${p.theme.spacing(12)} + ${p.theme.spacing(2)}`});
  ${(p) => {
    switch (p.placement) {
      case "left-start":
        return css`
          top: calc(-${p.theme.spacing(6)} - ${p.theme.spacing(0.5)});
          left: ${p.theme.spacing(3)};
        `;
      case "left-end":
        return css`
          bottom: calc(-${p.theme.spacing(6)} - ${p.theme.spacing(0.5)});
          left: ${p.theme.spacing(3)};
        `;
      case "right-start":
        return css`
          top: calc(-${p.theme.spacing(6)} - ${p.theme.spacing(0.5)});
          right: ${p.theme.spacing(3)};
        `;
      case "right-end":
        return css`
          bottom: calc(-${p.theme.spacing(6)} - ${p.theme.spacing(0.5)});
          right: ${p.theme.spacing(3)};
        `;
    }
  }}
`;

const StyledCircleRoot = styled.span`
  width: ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(4)};
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  &:after {
    content: "";
    background: ${(p) => p.theme.components.badge.textSuccessColor};
    opacity: 0.2;
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const StyledBorderOne = styled.span`
  position: absolute;
  margin: auto;
  width: calc(${(p) => `${p.theme.spacing(5)} + ${p.theme.spacing(0.5)}`});
  height: calc(${(p) => `${p.theme.spacing(5)} + ${p.theme.spacing(0.5)}`});
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  &:after {
    content: "";
    border: 3px solid ${(p) => p.theme.components.badge.textSuccessColor};
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    opacity: 0.5;
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const StyledBorderTwo = styled.span`
  position: absolute;
  margin: auto;
  width: calc(${(p) => `${p.theme.spacing(8)} - ${p.theme.spacing(0.5)}`});
  height: calc(${(p) => `${p.theme.spacing(8)} - ${p.theme.spacing(0.5)}`});
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  &:after {
    content: "";
    border: 4px solid ${(p) => p.theme.colors.textSuccess};
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    opacity: 0.05;
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const StyledBorderThree = styled.span`
  position: absolute;
  margin: auto;
  width: calc(${(p) => `${p.theme.spacing(10)} - ${p.theme.spacing(0.5)}`});
  height: calc(${(p) => `${p.theme.spacing(10)} - ${p.theme.spacing(0.5)}`});
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  &:after {
    content: "";
    border: 4px solid ${(p) => p.theme.colors.textSuccess};
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    opacity: 0.4;
    width: 100%;
    height: 100%;
    display: block;
  }
  opacity: 0;
  animation: ${opacity} 1.5s ease-in infinite;
`;

const StyledBorderFour = styled.span`
  position: absolute;
  margin: auto;
  width: ${(p) => p.theme.spacing(12)};
  height: ${(p) => p.theme.spacing(12)};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  &:after {
    content: "";
    border: 5px solid #6fe3b6;
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    opacity: 0.3;
    width: 100%;
    height: 100%;
    display: block;
  }
  opacity: 0;
  animation: ${opacity} 1.5s ease-in infinite;
  animation-delay: 0.3s;
`;

const StyledBorderFive = styled.span`
  position: absolute;
  margin: auto;
  width: calc(${(p) => `${p.theme.spacing(12)} + ${p.theme.spacing(2)}`});
  height: calc(${(p) => `${p.theme.spacing(12)} + ${p.theme.spacing(2)}`});
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  &:after {
    content: "";
    border: 4px solid #6fe3b6;
    border-radius: ${(p) => p.theme.shape.borderRadius("full")};
    opacity: 0.15;
    width: 100%;
    height: 100%;
    display: block;
  }
  opacity: 0;
  animation: ${opacity} 1.5s ease-in infinite;
  animation-delay: 0.6s;
`;
