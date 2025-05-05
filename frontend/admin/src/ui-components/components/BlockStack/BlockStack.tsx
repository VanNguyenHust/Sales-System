import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { SpaceScale } from "../../themes/types";
import { getResponsiveStyle, ResponsiveProp } from "../../utils/css";

export interface BlockStackProps {
  /**
   * Phần tử HTML
   * @default div
   */
  as?: "div" | "span" | "ul" | "ol" | "li" | "fieldset";
  /** Điều chỉnh cách phân bổ phần tử theo chiều dọc */
  align?: "start" | "center" | "end" | "space-around" | "space-between" | "space-evenly";
  /** Điều chỉnh cách phân bổ phần tử theo chiều ngang */
  inlineAlign?: "start" | "center" | "end" | "baseline" | "stretch";
  /**
   * Khoảng cách giữa các phần tử. Nhận vào spacing token hoặc object thể hiện các giá trị khác nhau trên các màn khác nhau.
   *
   * Ví dụ:
   * - gap="1"
   * - gap={{xs: "1", md: "4"}}
   */
  gap?: ResponsiveProp<SpaceScale>;
  /** HTML id */
  id?: string;
  /** Đảo ngược thứ tự các phần tử
   * @default false
   */
  reverseOrder?: boolean;
  /** Các phần tử con */
  children?: React.ReactNode;
}

/**
 * Sử dụng để hiển thị các phần tử theo hàng dọc và ngang với độ rộng full mặc định. Dựa trên CSS Flexbox.
 */
export function BlockStack({ as = "div", align, inlineAlign, gap, id, reverseOrder, children }: BlockStackProps) {
  return (
    <StyledBlockStack
      id={id}
      as={as}
      $align={align}
      $inlineAlign={inlineAlign}
      $gap={gap}
      reverseOrder={reverseOrder}
      listReset={as === "ul" || as === "ol"}
      fieldsetReset={as === "fieldset"}
    >
      {children}
    </StyledBlockStack>
  );
}

const StyledBlockStack = styled.div<{
  $align: BlockStackProps["align"];
  $inlineAlign: BlockStackProps["inlineAlign"];
  $gap: BlockStackProps["gap"];
  reverseOrder: BlockStackProps["reverseOrder"];
  listReset?: boolean;
  fieldsetReset?: boolean;
}>`
  display: flex;
  flex-direction: ${(p) => (p.reverseOrder ? "column-reverse" : "column")};
  align-items: ${(p) => (p.$inlineAlign ? p.$inlineAlign : "initial")};
  justify-content: ${(p) => (p.$align ? p.$align : "initial")};
  ${(p) => getResponsiveStyle(p.theme, "gap", p.$gap, p.theme.spacing)}

  ${(p) =>
    p.listReset &&
    css`
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 0;
    `}

  ${(p) =>
    p.fieldsetReset &&
    css`
      border: none;
      margin: 0;
      padding: 0;
    `}
`;
