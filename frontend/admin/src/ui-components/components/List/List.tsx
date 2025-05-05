import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Item, StyledItem } from "./Item";

export interface ListProps {
  /** khoảng cách giữa các phần tử trong danh sách */
  spacing?: "extraTight" | "loose";
  /** Kiểu danh sách */
  type?: "bullet" | "number";
  /** Danh sách các phần tử */
  children?: React.ReactNode;
}

/**
 * Hiển thị nội dung theo dạng danh sách. Mỗi phần tử trong danh sách được đánh số theo thứ tự hoặc dấu chấm.
 */
export const List: React.FunctionComponent<ListProps> & {
  Item: typeof Item;
} = ({ children, spacing = "loose", type = "bullet" }: ListProps) => {
  return (
    <StyledList spacing={spacing} type={type} as={type === "number" ? "ol" : undefined}>
      {children}
    </StyledList>
  );
};

List.Item = Item;

const StyledList = styled.ul<{
  spacing: ListProps["spacing"];
  type: ListProps["type"];
}>`
  list-style: ${(p) => (p.type === "bullet" ? "disc" : "decimal")} outside none;
  padding-left: ${(p) => (p.type === "bullet" ? p.theme.spacing(5) : p.theme.spacing(8))};
  margin-top: 0;
  margin-bottom: 0;
  & + & {
    margin-top: ${(p) => p.theme.spacing(4)};
  }

  ${(p) =>
    p.spacing === "loose" &&
    css`
      ${StyledItem} {
        margin-bottom: ${p.theme.spacing(2)};
      }
    `}

  ${StyledItem} {
    &:first-of-type {
      margin-top: ${(p) => p.theme.spacing(2)};
    }
  }
`;
