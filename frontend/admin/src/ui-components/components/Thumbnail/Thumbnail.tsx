import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Icon } from "../Icon";
import { Image } from "../Image";

type Size = "small" | "medium" | "large" | "extraLarge";

export interface ThumbnailProps {
  /** size của Thumbnail */
  size?: Size;
  /**
   * URL ảnh thumbnail
   */
  source: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  /**
   * Mô tả ảnh thumbnail
   */
  alt: string;
  /**
   * độ trong suốt của nền
   */
  transparent?: boolean;
}

/**
 * Thường được sử dụng để hiển thị ảnh làm ảnh đại diện
 */
export function Thumbnail({ alt, source, size = "medium", transparent }: ThumbnailProps) {
  const content = typeof source === "string" ? <Image source={source} alt={alt} /> : <Icon source={source} />;
  return (
    <StyledThumbnail $size={size} transparent={transparent}>
      {content}
    </StyledThumbnail>
  );
}

const StyledThumbnail = styled.span<{
  $size: Size;
  transparent?: boolean;
}>`
  position: relative;
  display: block;
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  min-width: ${(p) => p.theme.spacing(6)};
  max-width: 100%;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.border};
  ${(p) => {
    if (p.$size === "extraLarge") {
      return css`
        width: calc(${p.theme.spacing(20)} * 2);
      `;
    } else if (p.$size === "small") {
      return css`
        width: ${p.theme.spacing(10)};
      `;
    } else if (p.$size === "large") {
      return css`
        width: calc(${p.theme.spacing(24)} - ${p.theme.spacing(1)});
      `;
    }
    return css`
      width: calc(${p.theme.spacing(16)} - ${p.theme.spacing(1)});
    `;
  }};

  ${(p) =>
    p.transparent &&
    css`
      background: transparent;
    `};

  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  & > * {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    color: ${(p) => p.theme.colors.iconSubdued};
  }
`;
