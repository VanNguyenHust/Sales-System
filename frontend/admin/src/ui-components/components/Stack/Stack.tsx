import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";

import { Item, StyledItem } from "./Item";

export interface StackProps {
  /**
   * Có wrap các item
   * @default true
   */
  wrap?: boolean;
  /** Stack các item theo chiều dọc */
  vertical?: boolean;
  /** Điều chỉnh khoảng cách giữa các item */
  spacing?: "extraTight" | "tight" | "baseTight" | "loose" | "extraLoose" | "none";
  /** Điều chỉnh cách phân bổ item theo chiều dọc */
  alignment?: "leading" | "trailing" | "center" | "fill" | "baseline";
  /** Điều chỉnh cách phân bổ item theo chiều ngang */
  distribution?: "equalSpacing" | "leading" | "trailing" | "center" | "fill" | "fillEvenly";
  /** Các items trong stack */
  children?: React.ReactNode;
}

/**
 * Dùng wrap các item theo 1 cách flexible, có thể tùy chỉnh khoảng cách, wrapping, quan hệ giữa các items
 */
export const Stack: React.FC<StackProps> & {
  Item: typeof Item;
} = ({ children, wrap = true, vertical, distribution, alignment, spacing }) => {
  const itemMarkup = React.Children.map(children, (child) => {
    return wrapWithComponent(child, Item, {});
  });
  return (
    <StyledStack
      $wrap={wrap}
      $vertical={vertical}
      $distribution={distribution}
      $alignment={alignment}
      $spacing={spacing}
    >
      {itemMarkup}
    </StyledStack>
  );
};

Stack.Item = Item;

const StyledStack = styled.div<{
  $wrap?: boolean;
  $vertical?: boolean;
  $distribution: StackProps["distribution"];
  $alignment: StackProps["alignment"];
  $spacing: StackProps["spacing"];
}>`
  display: flex;
  flex-wrap: ${(p) => (p.$wrap ? "wrap" : "nowrap")};
  align-items: ${(p) => {
    switch (p.$alignment) {
      case "leading":
        return "flex-start";
      case "trailing":
        return "flex-end";
      case "center":
        return "center";
      case "baseline":
        return "baseline";
      default:
        return "stretch";
    }
  }};

  flex-direction: ${(p) => (p.$vertical ? "column" : "row")};

  ${(p) => {
    switch (p.$distribution) {
      case "leading":
        return css`
          justify-content: flex-start;
        `;
      case "trailing":
        return css`
          justify-content: flex-end;
        `;
      case "center":
        return css`
          justify-content: center;
        `;
      case "fill":
        return css`
          ${StyledItem} {
            flex: 1 1 auto;
          }
        `;
      case "fillEvenly":
        return css`
          ${StyledItem} {
            flex: 1 0;
          }
        `;
      case "equalSpacing":
        return css`
          justify-content: space-between;
        `;
      default:
        return css`
          justify-content: baseline;
        `;
    }
  }}

  ${(p) => {
    let stackSpacing = p.theme.spacing(4);
    switch (p.$spacing) {
      case "extraTight":
        stackSpacing = p.theme.spacing(1);
        break;
      case "tight":
        stackSpacing = p.theme.spacing(2);
        break;
      case "baseTight":
        stackSpacing = p.theme.spacing(3);
        break;
      case "loose":
        stackSpacing = p.theme.spacing(5);
        break;
      case "extraLoose":
        stackSpacing = p.theme.spacing(8);
        break;
      case "none":
        stackSpacing = p.theme.spacing(0);
        break;
    }
    return css`
      margin-top: calc(-1 * ${stackSpacing});
      margin-left: calc(-1 * ${stackSpacing});
      > ${StyledItem} {
        margin-top: ${stackSpacing};
        margin-left: ${stackSpacing};
        max-width: 100%;
      }
    `;
  }}
`;
