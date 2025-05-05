import React from "react";
import styled from "@emotion/styled";

import { SpaceScale } from "../../themes/types";
import { getResponsiveStyle, ResponsiveProp } from "../../utils/css";

type ColumnsAlias = "oneThird" | "oneHalf" | "twoThirds";
type ColumnsType = number | string | ColumnsAlias[];

export interface InlineGridProps {
  /** Các phần tử con */
  children?: React.ReactNode;
  /**
   * Số cột để hiển thị. Nhận vào giá trị đơn lẻ (có thể là số hoặc css grid column string) hoặc object thể hiện các giá trị khác nhau trên các màn khác nhau.
   *
   * Ví dụ:
   * - columns={1}
   * - columns={{xs: 1, md: 4}}
   * - columns={["oneThird", "twoThirds"]}
   * - columns="1fr 200px"
   * - columns="repeat(4, 1fr)"
   */
  columns?: ResponsiveProp<ColumnsType>;
  /**
   * Khoảng cách giữa các phần tử. Nhận vào spacing token hoặc object thể hiện các giá trị khác nhau trên các màn khác nhau.
   *
   * Ví dụ:
   * - gap="1"
   * - gap={{xs: "1", md: "4"}}
   */
  gap?: ResponsiveProp<SpaceScale>;
  /**
   * Điều chỉnh cách phân bổ item theo chiều dọc. Nếu không được cấu hình, các phần tử sẽ được kéo dài theo chiều cao của phần tử cha.
   */
  alignItems?: "start" | "end" | "center";
}

/**
 * Sử dụng để đặt các phần tử theo chiều ngang thành các cột, khoảng cách giữa các cột là như nhau. Dựa trên CSS Grid
 */
export function InlineGrid({ columns, gap, alignItems, children }: InlineGridProps) {
  return (
    <StyledInlineGrid alignItems={alignItems} $gap={gap} $columns={columns}>
      {children}
    </StyledInlineGrid>
  );
}

const StyledInlineGrid = styled.div<{
  $gap: InlineGridProps["gap"];
  $columns: InlineGridProps["columns"];
  alignItems: InlineGridProps["alignItems"];
}>`
  display: grid;
  align-items: ${(p) => p.alignItems ?? "initial"};
  ${(p) => getResponsiveStyle(p.theme, "gap", p.$gap, p.theme.spacing)}
  ${(p) => getResponsiveStyle(p.theme, "gridTemplateColumns", p.$columns, getColumnValue)}
`;

function getColumnValue(columns: ColumnsType) {
  if (typeof columns === "number" || !isNaN(Number(columns))) {
    return `repeat(${Number(columns)}, minmax(0, 1fr))`;
  }

  if (typeof columns === "string") return columns;

  return columns
    .map((column) => {
      switch (column) {
        case "oneThird":
          return "minmax(0, 1fr)";
        case "oneHalf":
          return "minmax(0, 1fr)";
        case "twoThirds":
          return "minmax(0, 2fr)";
      }
    })
    .join(" ");
}
