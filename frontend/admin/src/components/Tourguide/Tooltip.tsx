import React from "react";
import type { TooltipRenderProps } from "react-joyride";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, ProgressBar, Text } from "@/ui-components";
import { CloseBigIcon } from "@/ui-icons";

import { StepProps } from "./type";

export const Tooltip = (props: TooltipRenderProps) => {
  const { continuous, index, step, size, backProps, primaryProps, tooltipProps, skipProps } =
    props as TooltipRenderProps;
  return (
    <TooltipBody {...tooltipProps}>
      {!step?.floaterProps?.hideArrow && <TooltipArrow placement={step.placement} />}
      {step.title && (
        <TooltipTitle>
          <Text as="p" breakWord>
            {step.title}
          </Text>
          {!step.hideCloseButton && (
            <Button
              onClick={() => skipProps.onClick(fakeEvent as React.MouseEvent<HTMLElement, MouseEvent>)}
              icon={CloseBigIcon}
              plain
            />
          )}
        </TooltipTitle>
      )}
      <TooltipContent>
        {step.content}
        {!step.hideFooter && (
          <TooltipFooter>
            {step.showSkipButton && (
              <Button
                id="BtnTourguideSkip"
                onClick={() => skipProps.onClick(fakeEvent as React.MouseEvent<HTMLElement, MouseEvent>)}
                plain
              >
                {skipProps.title}
              </Button>
            )}
            {!step.hideBackButton && (
              <Button
                id="BtnTourguideBack"
                onClick={() => backProps.onClick(fakeEvent as React.MouseEvent<HTMLElement, MouseEvent>)}
                plain
              >
                {backProps.title}
              </Button>
            )}
            {continuous && (
              <Button
                primary
                onClick={() => primaryProps.onClick(fakeEvent as React.MouseEvent<HTMLElement, MouseEvent>)}
              >
                {primaryProps.title}
              </Button>
            )}
          </TooltipFooter>
        )}
      </TooltipContent>
      {step.showProgress && (
        <StyledProgressBar>
          <ProgressBar animated progress={(100 / size) * (index + 1)} color="primary" size="small" />
        </StyledProgressBar>
      )}
    </TooltipBody>
  );
};

const TooltipBody = styled.div`
  background: ${(p) => p.theme.components.navigation.backgroundColor};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  width: 350px;
  position: relative;
  margin: 0 auto;
`;

const TooltipTitle = styled.div`
  font-size: ${(p) => p.theme.typography.fontSize75};
  padding: ${(p) => p.theme.spacing(2, 2, 2, 4)};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.components.navigation.dividerColor};
  gap: ${(p) => p.theme.spacing(2)};
  p {
    flex: 1 1 auto;
    color: ${(p) => p.theme.colors.icon};
  }
`;

const TooltipContent = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
  color: ${(p) => p.theme.colors.surface};
`;

const TooltipFooter = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: ${(p) => p.theme.spacing(4)};
  #BtnTourguideBack,
  #BtnTourguideSkip {
    color: ${(p) => p.theme.colors.textPlaceholder};
    padding: ${(p) => p.theme.spacing(0, 4)};
    margin: 0;
  }
`;

const TooltipArrow = styled.span<{ placement: StepProps["placement"] }>`
  position: absolute;
  width: ${(p) => p.theme.spacing(2)};
  height: ${(p) => p.theme.spacing(2)};
  ${(p) => {
    switch (p.placement) {
      case "bottom":
        return css`
          top: -${p.theme.spacing(1)};
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom-start":
        return css`
          top: -${p.theme.spacing(1)};
          left: ${p.theme.spacing(4)};
        `;
      case "bottom-end":
        return css`
          top: -${p.theme.spacing(1)};
          right: ${p.theme.spacing(4)};
        `;
      case "top":
        return css`
          bottom: -${p.theme.spacing(1)};
          left: 50%;
          transform: translateX(-50%);
        `;
      case "top-start":
        return css`
          bottom: -${p.theme.spacing(1)};
          left: ${p.theme.spacing(4)};
        `;
      case "top-end":
        return css`
          bottom: -${p.theme.spacing(1)};
          right: ${p.theme.spacing(4)};
        `;
      case "left":
        return css`
          top: 50%;
          transform: translateY(-50%);
          right: -${p.theme.spacing(1)};
        `;
      case "left-start":
        return css`
          top: calc(${p.theme.spacing(3)} + ${p.theme.spacing(0.5)});
          right: -${p.theme.spacing(1)};
        `;
      case "left-end":
        return css`
          bottom: calc(${p.theme.spacing(3)} + ${p.theme.spacing(0.5)});
          right: -${p.theme.spacing(1)};
        `;
      case "right":
        return css`
          top: 50%;
          transform: translateY(-50%);
          left: -${p.theme.spacing(1)};
        `;
      case "right-start":
        return css`
          top: calc(${p.theme.spacing(3)} + ${p.theme.spacing(0.5)});
          left: -${p.theme.spacing(1)};
        `;
      case "right-end":
        return css`
          bottom: calc(${p.theme.spacing(3)} + ${p.theme.spacing(0.5)});
          left: -${p.theme.spacing(1)};
        `;
      default:
        return css``;
    }
  }}
  &::after {
    content: "";
    background-color: ${(p) => p.theme.components.navigation.backgroundColor};
    position: absolute;
    left: 0px;
    transform: rotate(45deg);
    width: ${(p) => p.theme.spacing(2)};
    height: ${(p) => p.theme.spacing(2)};
  }
`;

const StyledProgressBar = styled.div`
  position: relative;
  & > div {
    height: calc(${(p) => `${p.theme.spacing(1)} + ${p.theme.spacing(0.5)}`});
    border-radius: ${(p) => p.theme.spacing(0, 0, 2, 2)};
    background: ${(p) => p.theme.components.navigation.dividerColor};
  }
`;

const fakeEvent = {
  preventDefault() {},
};
