import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { visuallyHidden } from "../../utils/styles";

export interface TextProps {
  /** Căn chỉnh vị trí của text theo chiều ngang */
  alignment?: "start" | "center" | "end" | "justify";
  /** Kiểu element */
  as: "dt" | "dd" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "legend";
  /** Xuống dòng khi tràn */
  breakWord?: boolean;
  /** Màu của text */
  color?: "success" | "critical" | "warning" | "subdued" | "slim";
  /** Điều chỉnh font weight */
  fontWeight?: "light" | "regular" | "medium" | "semibold" | "bold";
  /** HTML id */
  id?: string;
  /** Hiện dấu 3 chấm khi text bị tràn */
  truncate?: boolean;
  /** Số dòng trước khi truncate text */
  lineClamp?: number;
  /** Kiểu chữ của text */
  variant?:
    | "headingXs"
    | "headingSm"
    | "headingMd"
    | "headingLg"
    | "headingXl"
    | "heading2xl"
    | "heading3xl"
    | "heading4xl"
    | "bodyXs"
    | "bodySm"
    | "bodyMd"
    | "bodyLg";

  /** Sử dụng font kiểu số (monospace) */
  numeric?: boolean;
  /** Ẩn text */
  visuallyHidden?: boolean;
  /** Nội dung cần hiển thị */
  children: React.ReactNode;
  /** Thêm gạch ngang cho text */
  textDecorationLine?: "line-through";
}

/**
 * Sử dụng để tạo các mức phân cấp khác nhau về chữ trên trang.
 */
export function Text({
  alignment,
  as,
  breakWord: breakWordProp,
  children,
  color,
  fontWeight,
  id,
  truncate: truncateProp,
  numeric,
  visuallyHidden,
  variant,
  textDecorationLine,
  lineClamp,
}: TextProps) {
  const isLineClamp = !!lineClamp;
  const truncate = !!truncateProp || isLineClamp;
  const breakWord = breakWordProp || isLineClamp;
  return (
    <StyledText
      as={as}
      id={id}
      variant={variant}
      $color={color}
      alignment={alignment}
      truncate={truncate}
      breakWord={breakWord}
      $fontWeight={fontWeight}
      visuallyHidden={visuallyHidden}
      numeric={numeric}
      textDecorationLine={textDecorationLine}
      lineClamp={isLineClamp ? lineClamp : undefined}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled.p<{
  variant: TextProps["variant"];
  alignment: TextProps["alignment"];
  $color: TextProps["color"];
  truncate: TextProps["truncate"];
  lineClamp?: number;
  breakWord: TextProps["breakWord"];
  $fontWeight: TextProps["fontWeight"];
  numeric?: boolean;
  visuallyHidden?: boolean;
  textDecorationLine?: TextProps["textDecorationLine"];
}>`
  margin: 0;
  text-align: inherit;
  ${(p) =>
    p.truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}

  ${(p) =>
    (p.alignment || p.truncate) &&
    css`
      display: block;
    `}

  ${(p) =>
    !!p.lineClamp &&
    css`
      -webkit-line-clamp: ${p.lineClamp};
      -webkit-box-orient: vertical;
      display: -webkit-box;
      white-space: normal;
    `}

  ${(p) =>
    p.breakWord &&
    css`
      overflow-wrap: anywhere;
      word-break: normal;
    `}

  ${(p) => {
    switch (p.variant) {
      case "headingXs":
        return css`
          font-size: ${p.theme.typography.fontSize75};
          line-height: ${p.theme.typography.fontLineHeight1};
          font-weight: ${p.theme.typography.fontWeightMedium};
        `;
      case "headingSm":
        return css`
          font-size: ${p.theme.typography.fontSize100};
          line-height: ${p.theme.typography.fontLineHeight2};
          font-weight: ${p.theme.typography.fontWeightMedium};
        `;
      case "headingMd":
        return css`
          font-size: ${p.theme.typography.fontSize200};
          line-height: ${p.theme.typography.fontLineHeight2};
          font-weight: ${p.theme.typography.fontWeightMedium};
        `;
      case "headingLg":
        return css`
          font-size: ${p.theme.typography.fontSize200};
          line-height: ${p.theme.typography.fontLineHeight2};
          font-weight: ${p.theme.typography.fontWeightMedium};
          ${p.theme.breakpoints.up("md")} {
            font-size: ${p.theme.typography.fontSize300};
            line-height: ${p.theme.typography.fontLineHeight4};
          }
        `;
      case "headingXl":
        return css`
          font-size: ${p.theme.typography.fontSize300};
          line-height: ${p.theme.typography.fontLineHeight3};
          font-weight: ${p.theme.typography.fontWeightMedium};
          ${p.theme.breakpoints.up("md")} {
            font-size: ${p.theme.typography.fontSize400};
            line-height: ${p.theme.typography.fontLineHeight4};
          }
        `;
      case "heading2xl":
        return css`
          font-size: ${p.theme.typography.fontSize300};
          line-height: ${p.theme.typography.fontLineHeight3};
          font-weight: ${p.theme.typography.fontWeightMedium};
          ${p.theme.breakpoints.up("md")} {
            font-size: ${p.theme.typography.fontSize500};
            line-height: ${p.theme.typography.fontLineHeight5};
          }
        `;
      case "heading3xl":
        return css`
          font-size: ${p.theme.typography.fontSize400};
          line-height: ${p.theme.typography.fontLineHeight4};
          font-weight: ${p.theme.typography.fontWeightMedium};
          ${p.theme.breakpoints.up("md")} {
            font-size: ${p.theme.typography.fontSize600};
            line-height: ${p.theme.typography.fontLineHeight6};
          }
        `;
      case "heading4xl":
        return css`
          font-size: ${p.theme.typography.fontSize600};
          line-height: ${p.theme.typography.fontLineHeight6};
          font-weight: ${p.theme.typography.fontWeightBold};
          ${p.theme.breakpoints.up("md")} {
            font-size: ${p.theme.typography.fontSize700};
            line-height: ${p.theme.typography.fontLineHeight7};
          }
        `;
      case "bodySm":
        return css`
          font-size: ${p.theme.typography.fontSize75};
          line-height: ${p.theme.typography.fontLineHeight1};
          font-weight: ${p.theme.typography.fontWeightRegular};
        `;
      case "bodyMd":
        return css`
          font-size: ${p.theme.typography.fontSize100};
          line-height: ${p.theme.typography.fontLineHeight2};
          font-weight: ${p.theme.typography.fontWeightRegular};
        `;
      case "bodyLg":
        return css`
          font-size: ${p.theme.typography.fontSize200};
          line-height: ${p.theme.typography.fontLineHeight2};
          font-weight: ${p.theme.typography.fontWeightRegular};
        `;
      default:
        return css``;
    }
  }}

  ${(p) => {
    switch (p.$color) {
      case "success":
        return css`
          color: ${p.theme.colors.textSuccess};
        `;
      case "critical":
        return css`
          color: ${p.theme.colors.textCritical};
        `;
      case "warning":
        return css`
          color: ${p.theme.colors.textWarning};
        `;
      case "subdued":
        return css`
          color: ${p.theme.colors.textSubdued};
        `;
      case "slim":
        return css`
          color: ${p.theme.colors.textSlim};
        `;
      default:
        return css``;
    }
  }}

  ${(p) => {
    switch (p.alignment) {
      case "start":
        return css`
          text-align: start;
        `;
      case "center":
        return css`
          text-align: center;
        `;
      case "end":
        return css`
          text-align: end;
        `;
      case "justify":
        return css`
          text-align: justify;
        `;
      default:
        return css``;
    }
  }}

  ${(p) => {
    switch (p.$fontWeight) {
      case "light":
        return css`
          font-weight: ${p.theme.typography.fontWeightLight};
        `;
      case "regular":
        return css`
          font-weight: ${p.theme.typography.fontWeightRegular};
        `;
      case "medium":
        return css`
          font-weight: ${p.theme.typography.fontWeightMedium};
        `;
      case "semibold":
        return css`
          font-weight: ${p.theme.typography.fontWeightSemiBold};
        `;
      case "bold":
        return css`
          font-weight: ${p.theme.typography.fontWeightBold};
        `;
      default:
        return css``;
    }
  }}

  ${(p) => p.visuallyHidden && visuallyHidden}
  ${(p) =>
    p.numeric &&
    css`
      font-family: ${p.theme.typography.fontFamilyMono};
    `}

  ${(p) => {
    switch (p.textDecorationLine) {
      case "line-through":
        return css`
          text-decoration-line: line-through;
        `;
      default:
        return css``;
    }
  }}
`;
