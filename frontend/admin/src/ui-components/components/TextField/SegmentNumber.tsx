import React from "react";
import styled from "@emotion/styled";
import { ArrowCaretDownIcon, ArrowCaretUpIcon } from "@/ui-icons";

import { unstyledButton } from "../../utils/styles";

type HandleStepFn = (step: number) => void;

export interface SegmentNumberProps {
  onChange: HandleStepFn;
  onClick?(event: React.MouseEvent): void;
  onMouseDown(onChange: HandleStepFn): void;
  onMouseUp(): void;
  onBlur(event: React.FocusEvent): void;
  refSegment: any;
  isDisplay: boolean;
}

export function SegmentNumber({
  onChange,
  onClick,
  onMouseDown,
  onMouseUp,
  onBlur,
  refSegment,
  isDisplay,
}: SegmentNumberProps) {
  function handleStep(step: number) {
    return () => onChange(step);
  }

  function handleMouseDown(onChange: HandleStepFn) {
    return (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      onMouseDown(onChange);
    };
  }

  return (
    <StyledWrapper onClick={onClick} aria-hidden={!isDisplay} ref={refSegment} isDisplay={isDisplay}>
      <StyledSegment
        onClick={handleStep(1)}
        onMouseDown={handleMouseDown(handleStep(1))}
        onMouseUp={onMouseUp}
        onBlur={onBlur}
      >
        <ArrowCaretUpIcon />
      </StyledSegment>
      <StyledSegment
        onClick={handleStep(-1)}
        onMouseDown={handleMouseDown(handleStep(-1))}
        onMouseUp={onMouseUp}
        onBlur={onBlur}
      >
        <ArrowCaretDownIcon />
      </StyledSegment>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ isDisplay: boolean }>`
  z-index: ${(p) => p.theme.zIndex.inputContent};
  display: flex;
  flex-direction: column;
  padding: calc(${(p) => `${p.theme.spacing(1)} - ${p.theme.spacing(0.25)}`});
  gap: ${(p) => p.theme.spacing(0.25)};
  visibility: ${(p) => (p.isDisplay ? "visible" : "hidden")};
`;

const StyledSegment = styled.button`
  ${unstyledButton}
  background: ${(p) => p.theme.colors.surfacePressed};
  border-radius: ${(p) => p.theme.spacing(0.5)};
  height: calc(${(p) => `${p.theme.spacing(3)} + ${p.theme.spacing(0.5)}`});
  width: ${(p) => p.theme.spacing(5)};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: calc(${(p) => `${p.theme.spacing(3)} + ${p.theme.spacing(0.5)}`});
  }
  &:active,
  &:active:focus {
    background: ${(p) => p.theme.colors.divider};
  }
`;
