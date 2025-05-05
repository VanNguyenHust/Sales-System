import React, { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ComplexAction } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { Bleed } from "../Bleed";
import { BlockStack } from "../BlockStack";
import { Box } from "../Box";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";

import { Backdrop } from "./Backdrop";

export interface EmptyStateProps {
  /** Tiêu để của nội dung */
  heading?: string;
  /**
   * Đường dẫn url tới ảnh cần hiển thị
   */
  image: string;
  /** Cấu hình image container có chiều rộng full trên màn lớn */
  imageContained?: boolean;
  /** Nội dung chính cần hiển thị */
  children?: React.ReactNode;
  /** Hành động chính */
  action?: ComplexAction;
  /** Hành động phụ */
  secondaryAction?: ComplexAction;
  /**
   * Bỏ giới hạn chiều rộng của nội dung
   * @default true
   * */
  fullWidth?: boolean;
  /**
   * Hiển thị backdrop
   * */
  backdrop?: boolean;
}

/**
 * Được dùng khi danh sách, bảng không có item nào để show
 */
export function EmptyState({
  children,
  heading,
  image,
  imageContained,
  action,
  secondaryAction,
  fullWidth = true,
  backdrop,
}: EmptyStateProps) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) setImageLoaded(true);
  }, []);

  const primaryActionMarkup = action ? buttonFrom(action, { primary: true }) : null;
  const secondaryActionMarkup = secondaryAction ? buttonFrom(secondaryAction, { outline: true, primary: true }) : null;

  const loadedImageMarkup = (
    <StyledImage
      loaded={imageLoaded}
      contained={!!imageContained}
      alt=""
      role="presentation"
      ref={imageRef}
      src={image}
      onLoad={() => setImageLoaded(true)}
    />
  );

  const imageMarkup = (
    <StyledImageContainer skeleton={!imageLoaded}>
      {loadedImageMarkup}
      <StyledImageSkeleton loaded={imageLoaded} />
    </StyledImageContainer>
  );

  const headingMarkup = heading ? (
    <Box paddingBlockEnd="1">
      <Text variant="headingLg" as="p" alignment="center">
        {heading}
      </Text>
    </Box>
  ) : null;

  const childrenMarkup = children ? (
    <Text as="span" alignment="center">
      {children}
    </Text>
  ) : null;

  const textContentMarkup =
    headingMarkup || children ? (
      <Box paddingBlockEnd="4">
        {headingMarkup}
        {childrenMarkup}
      </Box>
    ) : null;

  const actionsMarkup =
    primaryActionMarkup || secondaryActionMarkup ? (
      <InlineStack align="center" gap="4">
        {secondaryActionMarkup}
        {primaryActionMarkup}
      </InlineStack>
    ) : null;

  const detailsMarkup =
    textContentMarkup || actionsMarkup ? (
      <Box maxWidth={fullWidth ? "100%" : "400px"}>
        <BlockStack inlineAlign="center">
          {textContentMarkup}
          {actionsMarkup}
        </BlockStack>
      </Box>
    ) : null;

  const backdropMarkup = backdrop ? (
    <Bleed marginInline="5">
      <Backdrop />
    </Bleed>
  ) : null;

  return (
    <Box paddingInline={backdrop ? "5" : "0"} paddingBlockStart={!backdrop ? "5" : undefined} paddingBlockEnd="16">
      {backdropMarkup}
      <BlockStack inlineAlign="center" gap="4">
        {imageMarkup}
        {detailsMarkup}
      </BlockStack>
    </Box>
  );
}

const StyledImage = styled.img<{
  loaded: boolean;
  contained: boolean;
}>`
  opacity: ${(p) => (p.loaded ? 1 : 0)};
  transition: opacity ${(p) => p.theme.motion.duration50} ${(p) => p.theme.motion.transformEase};
  z-index: 1;
  ${(p) =>
    p.contained &&
    css`
      ${p.theme.breakpoints.up("md")} {
        position: initial;
        width: 100%;
      }
    `}
`;

const StyledImageContainer = styled.div<{
  skeleton: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(p) =>
    p.skeleton &&
    css`
      width: 180px;
      height: 180px;
    `}
`;

const StyledImageSkeleton = styled.div<{
  loaded: boolean;
}>`
  position: absolute;
  z-index: 0;
  width: 145px;
  height: 145px;
  background-color: ${(p) => p.theme.colors.surfaceSubdued};
  opacity: ${(p) => (p.loaded ? 0 : 1)};
  border-radius: ${(p) => p.theme.shape.borderRadius("full")};
  transition: opacity ${(p) => p.theme.motion.duration50} ${(p) => p.theme.motion.transformEase};
`;
