import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export interface SkeletonDisplayTextProps {
  /**
   * Size of the text
   * @default "medium"
   */
  size?: "small" | "medium" | "large" | "extraLarge";
}

/**
 * SkeletonDisplayText được dùng là skeleton các nội dung đang chờ load trong và ngoài Card có kích thước từ trung bình tới lớn như tiêu đề Page, ...
 */
export function SkeletonDisplayText({ size = "medium" }: SkeletonDisplayTextProps) {
  return <StyledSkeletonDisplayText size={size} />;
}

const StyledSkeletonDisplayText = styled.div<{
  size: SkeletonDisplayTextProps["size"];
}>`
  max-width: 120px;

  display: flex;
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  ${(p) => {
    let height = p.theme.typography.fontLineHeight2;
    let heightLargeDevice = p.theme.typography.fontLineHeight2;
    switch (p.size) {
      case "small":
        height = p.theme.typography.fontLineHeight3;
        heightLargeDevice = p.theme.typography.fontLineHeight4;
        break;
      case "medium":
        height = p.theme.typography.fontLineHeight4;
        heightLargeDevice = p.theme.typography.fontLineHeight5;
        break;
      case "large":
        height = p.theme.typography.fontLineHeight4;
        heightLargeDevice = p.theme.typography.fontLineHeight5;
        break;
      case "extraLarge":
        height = "36px";
        heightLargeDevice = "44px";
        break;
    }
    return css`
      height: ${height};
      ${p.theme.breakpoints.up("md")} {
        height: ${heightLargeDevice};
      }
    `;
  }}
`;
