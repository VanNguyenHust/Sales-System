import React from "react";
import styled from "@emotion/styled";

type Props = {
  colors: string[];
  onPresetClick(value: string): void;
};

export const PresetsColor = React.memo(function PresetsColor({ colors, onPresetClick }: Props) {
  return (
    <StyledRow>
      {colors.map((c) => (
        <StyledPreset key={c} onClick={() => onPresetClick(c)} style={{ backgroundColor: c }} />
      ))}
    </StyledRow>
  );
});

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: ${(p) => p.theme.spacing(2)};
  border-top: ${(p) => p.theme.shape.borderDivider};
  grid-gap: ${(p) => p.theme.spacing(2)};
  background-color: ${(p) => p.theme.colors.surface};
`;

const StyledPreset = styled.button`
  padding: 0;
  border: ${(p) => p.theme.shape.borderBase};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.shape.borderWidth(1)};
  }

  &::after {
    content: "";
    display: block;
    width: 100%;
    padding-bottom: 100%;
  }
`;
