import React from "react";
import styled from "@emotion/styled";

import { ScrollLock } from "../ScrollLock";

export interface BackdropProps {
  /** Backdrop nằm dưới navigation */
  belowNavigation?: boolean;
  /** Transparent background */
  transparent?: boolean;
  /** Callback khi click vào backdrop */
  onClick?(): void;
}

export function Backdrop({ belowNavigation, transparent, onClick }: BackdropProps) {
  return (
    <>
      <ScrollLock />
      <StyledBackdrop
        onClick={onClick}
        $transparent={transparent}
        belowNavigation={belowNavigation}
        data-testid="backdrop"
      />
    </>
  );
}

const StyledBackdrop = styled.div<{
  $transparent?: boolean;
  belowNavigation?: boolean;
}>`
  position: fixed;
  z-index: ${(p) => (p.belowNavigation ? p.theme.zIndex.navigation - 1 : p.theme.zIndex.modalBackdrop)};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  background-color: ${(p) => (p.$transparent ? "transparent" : p.theme.colors.backdrop)};
  animation: ${(p) => p.theme.motion.keyframeFadeIn} ${(p) => p.theme.motion.duration200} 1 forwards;
  opacity: 0;
  will-change: opacity;
`;
