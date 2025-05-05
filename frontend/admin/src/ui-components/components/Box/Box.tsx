import React, { forwardRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import {
  BorderRadiusAliasOrScale,
  BorderWidthScale,
  ColorBackgroundAlias,
  ColorBorderAlias,
  ColorTextAlias,
  ShadowAliasOrScale,
  SpaceScale,
} from "../../themes/types";
import { getResponsiveStyle, ResponsiveProp, sanitizeCustomProperties } from "../../utils/css";
import { backgroundColorMap, borderColorMap, textColorMap, visuallyHidden } from "../../utils/styles";

export interface BoxProps {
  /**
   * Phần tử HTML
   * @default div
   */
  as?: "div" | "span" | "section" | "legend" | "ul" | "li";
  /** HTML id */
  id?: string;
  /** Màu nền */
  background?: ColorBackgroundAlias;
  /** Màu chữ */
  color?: ColorTextAlias;

  /** Border color */
  borderColor?: ColorBorderAlias | "transparent";
  /** Border style */
  borderStyle?: "solid" | "dashed";
  /** Border width */
  borderWidth?: BorderWidthScale;

  /** Border radius */
  borderRadius?: BorderRadiusAliasOrScale;
  /** Vertical end horizontal start border radius */
  borderEndStartRadius?: BorderRadiusAliasOrScale;
  /** Vertical end horizontal end border radius */
  borderEndEndRadius?: BorderRadiusAliasOrScale;
  /** Vertical start horizontal start border radius */
  borderStartStartRadius?: BorderRadiusAliasOrScale;
  /** Vertical start horizontal end border radius */
  borderStartEndRadius?: BorderRadiusAliasOrScale;
  /** Vertical start border width */
  borderBlockStartWidth?: BorderWidthScale;
  /** Vertical end border width */
  borderBlockEndWidth?: BorderWidthScale;
  /** Horizontal start border width */
  borderInlineStartWidth?: BorderWidthScale;
  /** Horizontal end border width */
  borderInlineEndWidth?: BorderWidthScale;

  /** Outline color */
  outlineColor?: ColorBorderAlias;
  /** Outline style */
  outlineStyle?: "solid" | "dashed";
  /** Outline width */
  outlineWidth?: BorderWidthScale;

  /** Giá trị padding theo chiều ngang */
  paddingInline?: ResponsiveProp<SpaceScale>;
  /** Giá trị padding theo chiều dọc */
  paddingBlock?: ResponsiveProp<SpaceScale>;
  /** Giá trị padding phía trên */
  paddingBlockStart?: ResponsiveProp<SpaceScale>;
  /** Giá trị padding phía dưới */
  paddingBlockEnd?: ResponsiveProp<SpaceScale>;
  /** Giá trị padding bên trái */
  paddingInlineStart?: ResponsiveProp<SpaceScale>;
  /** Giá trị padding bên phải */
  paddingInlineEnd?: ResponsiveProp<SpaceScale>;

  /** Clip horizontal content of children */
  overflowX?: "hidden" | "scroll" | "clip";
  /** Clip vertical content of children */
  overflowY?: "hidden" | "scroll" | "clip";
  opacity?: string;
  zIndex?: string;
  tabIndex?: Extract<React.AllHTMLAttributes<HTMLElement>["tabIndex"], number>;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  position?: "relative" | "absolute" | "fixed" | "sticky";
  /** Top position of box */
  insetBlockStart?: ResponsiveProp<SpaceScale>;
  /** Bottom position of box */
  insetBlockEnd?: ResponsiveProp<SpaceScale>;
  /** Left position of box */
  insetInlineStart?: ResponsiveProp<SpaceScale>;
  /** Right position of box */
  insetInlineEnd?: ResponsiveProp<SpaceScale>;

  shadow?: ShadowAliasOrScale;

  /** Ẩn nội dung khi in */
  printHidden?: boolean;
  /** Ẩn nội dung */
  visuallyHidden?: boolean;
  children?: React.ReactNode;
}

/**
 * là phần tử cơ bản nhất để sử dụng các design token
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    id,
    as = "div",
    visuallyHidden,
    printHidden,
    background,
    color,
    borderColor,
    borderStyle,
    borderWidth = "0",
    borderBlockStartWidth,
    borderBlockEndWidth,
    borderInlineStartWidth,
    borderInlineEndWidth,
    borderRadius,
    borderStartStartRadius,
    borderStartEndRadius,
    borderEndStartRadius,
    borderEndEndRadius,
    paddingInline,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInlineStart,
    paddingInlineEnd,
    outlineColor,
    outlineStyle,
    outlineWidth,
    overflowX,
    overflowY,
    tabIndex,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    opacity,
    zIndex,
    position,
    insetBlockEnd,
    insetBlockStart,
    insetInlineEnd,
    insetInlineStart,
    shadow,
    children,
  },
  ref
) {
  const style = {
    "--ui-box-width": width,
    "--ui-box-min-width": minWidth,
    "--ui-box-max-width": maxWidth,
    "--ui-box-height": height,
    "--ui-box-min-height": minHeight,
    "--ui-box-max-height": maxHeight,
    zIndex,
    opacity,
  } as React.CSSProperties;

  return (
    <StyledBox
      as={as}
      id={id}
      ref={ref as any}
      listReset={as === "ul"}
      visuallyHidden={visuallyHidden}
      printHidden={printHidden}
      $background={background}
      $color={color}
      $borderColor={borderColor}
      $borderStyle={
        borderStyle
          ? borderStyle
          : borderColor ||
            borderWidth ||
            borderBlockStartWidth ||
            borderBlockEndWidth ||
            borderInlineStartWidth ||
            borderInlineEndWidth
          ? "solid"
          : undefined
      }
      $borderBlockStartWidth={borderBlockStartWidth ?? borderWidth}
      $borderBlockEndWidth={borderBlockEndWidth ?? borderWidth}
      $borderInlineStartWidth={borderInlineStartWidth ?? borderWidth}
      $borderInlineEndWidth={borderInlineEndWidth ?? borderWidth}
      $borderStartStartRadius={borderStartStartRadius ?? borderRadius ?? "initial"}
      $borderStartEndRadius={borderStartEndRadius ?? borderRadius ?? "initial"}
      $borderEndStartRadius={borderEndStartRadius ?? borderRadius ?? "initial"}
      $borderEndEndRadius={borderEndEndRadius ?? borderRadius ?? "initial"}
      $paddingInline={paddingInline}
      $paddingBlock={paddingBlock}
      $paddingInlineStart={paddingInlineStart}
      $paddingInlineEnd={paddingInlineEnd}
      $paddingBlockStart={paddingBlockStart}
      $paddingBlockEnd={paddingBlockEnd}
      $outlineColor={outlineColor}
      $outlineStyle={outlineStyle ? outlineStyle : outlineColor || outlineWidth ? "solid" : undefined}
      $outlineWidth={outlineWidth}
      tabIndex={tabIndex}
      $overflowX={overflowX}
      $overflowY={overflowY}
      $position={position}
      $insetInlineStart={insetInlineStart}
      $insetInlineEnd={insetInlineEnd}
      $insetBlockStart={insetBlockStart}
      $insetBlockEnd={insetBlockEnd}
      $shadow={shadow}
      style={sanitizeCustomProperties(style)}
    >
      {children}
    </StyledBox>
  );
});

const StyledBox = styled.div<{
  listReset?: boolean;
  visuallyHidden?: boolean;
  printHidden?: boolean;
  $background: BoxProps["background"];
  $color: BoxProps["color"];
  $borderColor: BoxProps["borderColor"];
  $borderStyle: BoxProps["borderStyle"];
  $borderBlockStartWidth: BorderWidthScale;
  $borderBlockEndWidth: BorderWidthScale;
  $borderInlineStartWidth: BorderWidthScale;
  $borderInlineEndWidth: BorderWidthScale;
  $borderStartStartRadius: BorderRadiusAliasOrScale | "initial";
  $borderStartEndRadius: BorderRadiusAliasOrScale | "initial";
  $borderEndStartRadius: BorderRadiusAliasOrScale | "initial";
  $borderEndEndRadius: BorderRadiusAliasOrScale | "initial";
  $paddingInline: BoxProps["paddingInline"];
  $paddingBlock: BoxProps["paddingBlock"];
  $paddingInlineStart: BoxProps["paddingInlineStart"];
  $paddingInlineEnd: BoxProps["paddingInlineEnd"];
  $paddingBlockStart: BoxProps["paddingBlockStart"];
  $paddingBlockEnd: BoxProps["paddingBlockEnd"];
  $outlineColor: BoxProps["outlineColor"];
  $outlineStyle: BoxProps["outlineStyle"];
  $outlineWidth: BoxProps["outlineWidth"];
  $overflowX: BoxProps["overflowX"];
  $overflowY: BoxProps["overflowY"];
  $position: BoxProps["position"];
  $insetInlineStart: BoxProps["insetInlineStart"];
  $insetInlineEnd: BoxProps["insetInlineEnd"];
  $insetBlockStart: BoxProps["insetBlockStart"];
  $insetBlockEnd: BoxProps["insetBlockEnd"];
  $shadow: BoxProps["shadow"];
}>`
  --ui-box-width: initial;
  --ui-box-min-width: initial;
  --ui-box-max-width: initial;
  --ui-box-height: initial;
  --ui-box-min-height: initial;
  --ui-box-max-height: initial;

  background-color: ${(p) => (p.$background ? p.theme.colors[backgroundColorMap[p.$background]] : "initial")};
  color: ${(p) => (p.$color ? p.theme.colors[textColorMap[p.$color]] : "initial")};

  border-color: ${(p) =>
    p.$borderColor
      ? p.$borderColor === "transparent"
        ? p.$borderColor
        : p.theme.colors[borderColorMap[p.$borderColor]]
      : "initial"};
  border-style: ${(p) => (p.$borderStyle ? p.$borderStyle : "initial")};
  border-block-start-width: ${(p) => p.theme.spacing.borderWidthScale(p.$borderBlockStartWidth)};
  border-block-end-width: ${(p) => p.theme.spacing.borderWidthScale(p.$borderBlockEndWidth)};
  border-inline-start-width: ${(p) => p.theme.spacing.borderWidthScale(p.$borderInlineStartWidth)};
  border-inline-end-width: ${(p) => p.theme.spacing.borderWidthScale(p.$borderInlineEndWidth)};

  border-start-start-radius: ${(p) =>
    p.$borderStartStartRadius === "initial"
      ? p.$borderStartStartRadius
      : p.theme.shape.borderRadius(p.$borderStartStartRadius)};
  border-start-end-radius: ${(p) =>
    p.$borderStartEndRadius === "initial"
      ? p.$borderStartEndRadius
      : p.theme.shape.borderRadius(p.$borderStartEndRadius)};
  border-end-start-radius: ${(p) =>
    p.$borderEndStartRadius === "initial"
      ? p.$borderEndStartRadius
      : p.theme.shape.borderRadius(p.$borderEndStartRadius)};
  border-end-end-radius: ${(p) =>
    p.$borderEndEndRadius === "initial" ? p.$borderEndEndRadius : p.theme.shape.borderRadius(p.$borderEndEndRadius)};

  ${(p) => getResponsiveStyle(p.theme, "insetInlineStart", p.$insetInlineStart, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "insetInlineEnd", p.$insetInlineEnd, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "insetBlockStart", p.$insetBlockStart, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "insetBlockEnd", p.$insetBlockEnd, p.theme.spacing)}


  outline-color: ${(p) => (p.$outlineColor ? p.theme.colors[borderColorMap[p.$outlineColor]] : "initial")};
  outline-style: ${(p) => (p.$outlineStyle ? p.$outlineStyle : "initial")};
  outline-width: ${(p) =>
    p.$outlineWidth !== null && p.$outlineWidth !== undefined
      ? p.theme.spacing.borderWidthScale(p.$outlineWidth)
      : "initial"};

  overflow-x: ${(p) => (p.$overflowX ? p.$overflowX : "initial")};
  overflow-y: ${(p) => (p.$overflowY ? p.$overflowY : "initial")};
  position: ${(p) => (p.$position ? p.$position : "initial")};

  ${(p) => getResponsiveStyle(p.theme, "paddingInline", p.$paddingInline, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "paddingBlock", p.$paddingBlock, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "paddingInlineStart", p.$paddingInlineStart, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "paddingInlineEnd", p.$paddingInlineEnd, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "paddingBlockStart", p.$paddingBlockStart, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "paddingBlockEnd", p.$paddingBlockEnd, p.theme.spacing)}

  width: var(--ui-box-width);
  height: var(--ui-box-height);
  min-width: var(--ui-box-min-width);
  min-height: var(--ui-box-min-height);
  max-width: var(--ui-box-max-width);
  max-height: var(--ui-box-max-height);

  box-shadow: ${(p) => (p.$shadow ? p.theme.shadow[p.$shadow] : "initial")};

  ${(p) =>
    p.listReset &&
    css`
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      outline: none;
      padding-inline-start: 0;
    `}

  ${(p) => p.visuallyHidden && visuallyHidden}

  ${(p) =>
    p.printHidden &&
    css`
      @media print {
        display: none !important;
      }
    `}
`;
