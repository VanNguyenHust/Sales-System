import React from "react";
import styled from "@emotion/styled";

export interface TextContainerProps {
  /** Khoảng cách theo chiều dọc */
  spacing?: "tight" | "loose";
  /** Nội dung trong container */
  children?: React.ReactNode;
}

/**
 * Được dùng để nhóm các đối tượng như đoạn văn, tiêu đề và danh sách với nhau ngăn cách bởi khoảng cách cụ thể theo chiều dọc
 */
export function TextContainer({ spacing, children }: TextContainerProps) {
  return <StyledTextContainer spacing={spacing}>{children}</StyledTextContainer>;
}

const StyledTextContainer = styled.div<TextContainerProps>`
  > *:not(style) ~ * {
    margin-top: ${(p) => {
      switch (p.spacing) {
        case "tight":
          return p.theme.spacing(2);
        case "loose":
          return p.theme.spacing(5);
        default:
          return p.theme.spacing(4);
      }
    }};
  }
`;
