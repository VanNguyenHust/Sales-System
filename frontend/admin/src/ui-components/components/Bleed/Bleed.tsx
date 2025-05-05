import React from "react";
import styled from "@emotion/styled";

import { SpaceScale } from "../../themes/types";
import { getResponsiveStyle, ResponsiveProp } from "../../utils/css";

export interface BleedProps {
  children?: React.ReactNode;
  /** Giá trị margin âm theo chiều ngang */
  marginInline?: ResponsiveProp<SpaceScale>;
  /** Giá trị margin âm theo chiều dọc */
  marginBlock?: ResponsiveProp<SpaceScale>;
  /** Giá trị margin âm phía trên */
  marginBlockStart?: ResponsiveProp<SpaceScale>;
  /** Giá trị margin âm phía dưới */
  marginBlockEnd?: ResponsiveProp<SpaceScale>;
  /** Giá trị margin âm bên trái */
  marginInlineStart?: ResponsiveProp<SpaceScale>;
  /** Giá trị margin âm bên phải */
  marginInlineEnd?: ResponsiveProp<SpaceScale>;
}

/**
 * Sử dụng margin âm để cho phép nội dung tràn ra khỏi container
 */
export function Bleed({
  children,
  marginInline,
  marginBlock,
  marginBlockStart,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
}: BleedProps) {
  return (
    <StyledBleed
      $marginInline={marginInline}
      $marginBlock={marginBlock}
      $marginInlineStart={marginInlineStart}
      $marginInlineEnd={marginInlineEnd}
      $marginBlockStart={marginBlockStart}
      $marginBlockEnd={marginBlockEnd}
    >
      {children}
    </StyledBleed>
  );
}

const StyledBleed = styled.div<{
  $marginInline: BleedProps["marginInline"];
  $marginBlock: BleedProps["marginBlock"];
  $marginInlineStart: BleedProps["marginInlineStart"];
  $marginInlineEnd: BleedProps["marginInlineEnd"];
  $marginBlockStart: BleedProps["marginBlockStart"];
  $marginBlockEnd: BleedProps["marginBlockEnd"];
}>`
  ${(p) =>
    getResponsiveStyle(p.theme, "marginInline", p.$marginInline, (margin) => `calc(-1 * ${p.theme.spacing(margin)})`)}

  ${(p) =>
    getResponsiveStyle(p.theme, "marginBlock", p.$marginBlock, (margin) => `calc(-1 * ${p.theme.spacing(margin)})`)}

  ${(p) =>
    getResponsiveStyle(
      p.theme,
      "marginInlineStart",
      p.$marginInlineStart,
      (margin) => `calc(-1 * ${p.theme.spacing(margin)})`
    )}

  ${(p) =>
    getResponsiveStyle(
      p.theme,
      "marginInlineEnd",
      p.$marginInlineEnd,
      (margin) => `calc(-1 * ${p.theme.spacing(margin)})`
    )}

  ${(p) =>
    getResponsiveStyle(
      p.theme,
      "marginBlockStart",
      p.$marginBlockStart,
      (margin) => `calc(-1 * ${p.theme.spacing(margin)})`
    )}

  ${(p) =>
    getResponsiveStyle(
      p.theme,
      "marginBlockEnd",
      p.$marginBlockEnd,
      (margin) => `calc(-1 * ${p.theme.spacing(margin)})`
    )}
`;
