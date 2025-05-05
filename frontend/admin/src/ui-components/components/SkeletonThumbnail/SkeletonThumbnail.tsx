import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export interface SkeletonThumbnailProps {
  /**
   * Kích thước của thumbnail
   * @default "medium"
   */
  size?: "small" | "medium" | "large" | "extraLarge";
}

/**
 * SkeletonThumbnail được dùng là skeleton các nội dung đang chờ load cho Thumbnail
 */
export function SkeletonThumbnail({ size }: SkeletonThumbnailProps) {
  return <StyledSkeletonThumbnail size={size} />;
}

const StyledSkeletonThumbnail = styled.div<{
  size: SkeletonThumbnailProps["size"];
}>`
  display: flex;
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  ${(p) => {
    let height = 60;
    let width = 60;
    switch (p.size) {
      case "small":
        height = 40;
        width = 40;
        break;
      case "large":
        height = 92;
        width = 92;
        break;
      case "extraLarge":
        height = 160;
        width = 160;
        break;
    }
    return css`
      height: ${height}px;
      width: ${width}px;
    `;
  }}
`;
