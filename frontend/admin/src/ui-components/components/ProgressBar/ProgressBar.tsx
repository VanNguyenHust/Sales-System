import React, { CSSProperties, useRef } from "react";
import { Transition, type TransitionStatus } from "react-transition-group";
import styled from "@emotion/styled";

import { useTheme } from "../../themes/ThemeContext";
import { visuallyHidden } from "../../utils/styles";

export interface ProgressBarProps {
  /**
   * Tiến trình của task
   * @default 0
   */
  progress?: number;
  /**
   * Kích thước của progressbar
   * @default 'medium'
   */
  size?: "small" | "medium";
  /**
   * Màu sắc của progressbar
   * @default 'primary'
   */
  color?: "primary" | "success" | "critical";
  /**
   * Có hiệu ứng animation hay không
   * @default true
   */
  animated?: boolean;
}

const PROGRESS_MAX = 100;

/**
 * Thường được dùng để mô tả tiến trình chạy.
 */
export function ProgressBar({
  animated = true,
  progress: progressProp = 0,
  size = "medium",
  color = "primary",
}: ProgressBarProps) {
  const progress = Math.max(0, Math.min(progressProp, PROGRESS_MAX));
  const indicatorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const progressBarDuration = animated ? theme.motion.duration300 : theme.motion.duration0;

  const transitionStyles: { [key in TransitionStatus]: CSSProperties } = {
    entering: { transform: `scaleX(0)` },
    entered: { transform: `scaleX(${progress}%)` },
    exiting: { transform: `scaleX(${progress}%)` },
    exited: { transform: `scaleX(0)` },
    unmounted: {},
  };

  return (
    <StyledProgressBar size={size}>
      <StyledProgress value={progress} max={PROGRESS_MAX} />
      <Transition appear in timeout={parseInt(progressBarDuration, 10)} nodeRef={indicatorRef}>
        {(state) => (
          <StyledIndicator ref={indicatorRef} animated={animated} $color={color} style={transitionStyles[state]}>
            <StyledLabel>{progress}%</StyledLabel>
          </StyledIndicator>
        )}
      </Transition>
    </StyledProgressBar>
  );
}

const StyledProgressBar = styled.div<{
  size: ProgressBarProps["size"];
}>`
  overflow: hidden;
  width: 100%;
  background-color: ${(p) => p.theme.colors.surfaceNeutral};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  height: ${(p) => (p.size === "small" ? p.theme.spacing(2) : p.theme.spacing(4))};
`;

const StyledProgress = styled.progress`
  ${visuallyHidden}
`;

const StyledIndicator = styled.div<{
  animated: boolean;
  $color: ProgressBarProps["color"];
}>`
  height: inherit;
  background-color: ${(p) => {
    switch (p.$color) {
      case "success":
        return p.theme.colors.borderSuccess;
      case "critical":
        return p.theme.colors.actionCritical;
      default:
        return p.theme.colors.actionPrimary;
    }
  }};
  transform-origin: 0 50%;
  transition: transform ${(p) => (p.animated ? p.theme.motion.duration300 : p.theme.motion.duration0)}
    ${(p) => p.theme.motion.transformEaseInOut};
`;

const StyledLabel = styled.span`
  ${visuallyHidden}
`;
