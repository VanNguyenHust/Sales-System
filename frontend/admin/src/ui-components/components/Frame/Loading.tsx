import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { useIsMounted } from "../../utils/useIsMounted";

const STUCK_THRESHOLD = 99;

export function Loading() {
  const isMounted = useIsMounted();
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (progress >= STUCK_THRESHOLD || animating) {
      return;
    }

    requestAnimationFrame(() => {
      if (!isMounted.current) return;

      const step = Math.max((STUCK_THRESHOLD - progress) / 10, 1);
      setAnimating(true);
      setProgress(progress + step);
    });
  }, [progress, animating, isMounted]);

  return (
    <StyledLoading role="progressbar">
      <StyledLevel
        onTransitionEnd={() => setAnimating(false)}
        style={{ transform: `scaleX(${Math.floor(progress) / 100})` }}
      />
    </StyledLoading>
  );
}

const StyledLoading = styled.div`
  overflow: hidden;
  height: ${(p) => p.theme.spacing(1)};
  background-color: ${(p) => p.theme.colors.surfaceSelectedHovered};
  opacity: 1;
`;

const StyledLevel = styled.div`
  width: 100%;
  height: 100%;
  transform-origin: 0;
  background-color: ${(p) => p.theme.colors.interactive};
  transition: transform ${(p) => p.theme.motion.duration500} linear;
`;
