import React from "react";
import styled from "@emotion/styled";

import type { SpaceScale } from "../../themes/types";
import { getResponsiveStyle, ResponsiveProp } from "../../utils/css";

export interface InlineStackProps {
  /**
   * Có wrap các item
   * @default true
   */
  wrap?: boolean;
  /**
   * Phần tử HTML
   * @default div
   */
  as?: "div" | "span" | "li" | "ol" | "ul";

  /** Điều chỉnh cách phân bổ item theo chiều ngang */
  align?: "start" | "center" | "end" | "space-around" | "space-between" | "space-evenly";

  /** Điều chỉnh cách phân bổ item theo chiều dọc */
  blockAlign?: "start" | "center" | "end" | "baseline" | "stretch";

  /** Hướng sắp xếp các phần tử theo chiều ngang */
  direction?: ResponsiveProp<"row" | "row-reverse">;
  /**
   * Khoảng cách giữa các phần tử. Nhận vào spacing token hoặc object thể hiện các giá trị khác nhau trên các màn khác nhau.
   *
   * Ví dụ:
   * - gap="1"
   * - gap={{xs: "1", md: "4"}}
   */
  gap?: ResponsiveProp<SpaceScale>;
  /** Các phần tử con */
  children?: React.ReactNode;
}

/**
 * Sử dụng để hiển thị các phần tử theo hàng ngang. Dựa trên CSS Flexbox.
 */
export function InlineStack({
  as = "div",
  align,
  blockAlign,
  gap,
  direction = "row",
  wrap = true,
  children,
}: InlineStackProps) {
  return (
    <StyledInlineStack as={as} $align={align} $blockAlign={blockAlign} $wrap={wrap} $direction={direction} $gap={gap}>
      {children}
    </StyledInlineStack>
  );
}

const StyledInlineStack = styled.div<{
  $align: InlineStackProps["align"];
  $blockAlign: InlineStackProps["blockAlign"];
  $direction: InlineStackProps["direction"];
  $gap: InlineStackProps["gap"];
  $wrap: InlineStackProps["wrap"];
}>`
  display: flex;
  flex-wrap: ${(p) => (p.$wrap ? "wrap" : "nowrap")};
  align-items: ${(p) => p.$blockAlign};
  justify-content: ${(p) => p.$align};
  ${(p) => getResponsiveStyle(p.theme, "flexDirection", p.$direction)}
  ${(p) => getResponsiveStyle(p.theme, "gap", p.$gap, p.theme.spacing)}
`;
