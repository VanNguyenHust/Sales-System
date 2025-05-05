import React from "react";
import styled from "@emotion/styled";

export interface SkeletonBodyTextProps {
  /**
   * Số dòng để hiển thị
   * @default 3
   */
  lines?: number;
}

/**
 * SkeletonBodyText được dùng là skeleton các nội dung đang chờ load trong và ngoài Card có thể nhiều dòng như mô tả sản phẩm hoặc 1 dòng như thông tin thời gian
 */
export function SkeletonBodyText({ lines = 3 }: SkeletonBodyTextProps) {
  const bodyTextLines = [];

  for (let i = 0; i < lines; i++) {
    bodyTextLines.push(<StyledSkeletonBodyText key={i} data-testid="skeleton-line-item" />);
  }

  return <StyledSkeletonBodyTextContainer>{bodyTextLines}</StyledSkeletonBodyTextContainer>;
}

const StyledSkeletonBodyText = styled.div`
  height: ${(p) => p.theme.spacing(2)};
  display: flex;
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};

  &:last-child:not(:first-of-type) {
    width: 80%;
  }

  & + & {
    margin-top: ${(p) => p.theme.spacing(3)};
  }
`;

const StyledSkeletonBodyTextContainer = styled.div`
  width: 100%;
`;
