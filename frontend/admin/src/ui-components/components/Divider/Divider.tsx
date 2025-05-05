import React from "react";
import styled from "@emotion/styled";

import { BorderWidthScale, ColorBorderAlias } from "../../themes/types";
import { borderColorMap } from "../../utils/styles";

export interface DividerProps {
  /**
   * Divider border color
   * @default 'border'
   */
  borderColor?: ColorBorderAlias | "transparent";
  /**
   * Divider border width
   * @default '025'
   */
  borderWidth?: BorderWidthScale;
}

/** Được dùng để chia hoặc nhóm nội dung */
export function Divider({ borderColor = "border", borderWidth = "025" }: DividerProps) {
  return <StyledDivider borderColor={borderColor} borderWidth={borderWidth} />;
}

const StyledDivider = styled.hr<{
  borderWidth: NonNullable<DividerProps["borderWidth"]>;
  borderColor: NonNullable<DividerProps["borderColor"]>;
}>`
  border: 0;
  margin: 0;
  border-block-start: ${(p) => p.theme.spacing.borderWidthScale(p.borderWidth)} solid
    ${(p) => (p.borderColor === "transparent" ? p.borderColor : p.theme.colors[borderColorMap[p.borderColor]])};
`;
