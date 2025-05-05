import React, { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useIsMounted } from "../../utils/useIsMounted";
import { Image } from "../Image";

enum Status {
  Pending = "PENDING",
  Loaded = "LOADED",
  Errored = "ERRORED",
}

const STYLE_CLASSES = ["one", "two", "three", "four", "five"] as const;

export interface AvatarProps {
  /**
   * Kích thước của avatar
   * @default "medium"
   * */
  size?: "extraSmall" | "small" | "medium" | "large" | "extraLarge";
  /** Tên của customer */
  name?: string;
  /** Chữ cái để hiển thị */
  initials?: string;
  /** Sử dụng customer avatar ? */
  customer?: boolean;
  /** URL của ảnh */
  source?: string;
  /** Callback khi load bị lỗi */
  onError?(): void;
}

/**
 * Thường dùng để hiển thị ảnh đại diện của người dùng
 */
export function Avatar({ name, source, onError, initials, customer, size = "medium" }: AvatarProps) {
  const [status, setStatus] = useState<Status>(Status.Pending);
  const isMounted = useIsMounted();

  const handleError = useCallback(() => {
    setStatus(Status.Errored);
    if (onError) {
      onError();
    }
  }, [onError]);

  const handleLoad = useCallback(() => {
    setStatus(Status.Loaded);
  }, []);

  useEffect(() => {
    setStatus(Status.Pending);
  }, [source]);

  const hasImage = source && status !== Status.Errored;
  const nameString = name || initials;

  const imageMarkUp =
    source && isMounted && status !== Status.Errored ? (
      <StyledImage source={source} alt="" role="img" onLoad={handleLoad} onError={handleError} status={status} />
    ) : null;
  const verticalOffset = "0.35em";

  const avatarBody =
    customer || !initials ? (
      <path
        fill="currentColor"
        d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"
      />
    ) : (
      <StyledText initials={initials} x="50%" y="50%" fill="currentColor" textAnchor="middle" dy={verticalOffset}>
        {initials}
      </StyledText>
    );

  const svgMarkup = !hasImage ? (
    <StyledInitials>
      <StyledSvg viewBox="0 0 40 40" decorate={!!customer && !initials}>
        {avatarBody}
      </StyledSvg>
    </StyledInitials>
  ) : null;

  return (
    <StyledAvatar
      $size={size}
      hasImage={hasImage}
      status={status}
      customer={customer}
      source={source}
      nameString={nameString}
    >
      {svgMarkup}
      {imageMarkUp}
    </StyledAvatar>
  );
}

function xorHash(str: string) {
  let hash = 0;

  for (const char of str) {
    hash ^= char.charCodeAt(0);
  }

  return hash;
}

function styleClass(name?: string) {
  return name ? STYLE_CLASSES[xorHash(name) % STYLE_CLASSES.length] : STYLE_CLASSES[0];
}

const StyledAvatar = styled.span<{
  $size: AvatarProps["size"];
  hasImage?: boolean | "";
  status: Status;
  customer?: boolean;
  source?: string;
  nameString?: string;
}>`
  position: relative;
  display: block;
  overflow: hidden;
  min-width: ${(p) => p.theme.spacing(6)};
  max-width: 100%;
  background: ${(p) => p.theme.colors.surfaceNeutral};
  color: ${(p) => p.theme.colors.iconSubdued};
  user-select: none;
  border-radius: ${(p) => p.theme.shape.borderRadius("full")};
  width: ${(p) => {
    switch (p.$size) {
      case "extraSmall":
        return p.theme.spacing(6);
      case "small":
        return p.theme.spacing(8);
      case "large":
        return p.theme.spacing(12);
      case "extraLarge":
        return p.theme.spacing(16);
      default:
        return p.theme.spacing(10);
    }
  }};

  ${(p) =>
    p.hasImage &&
    css`
      &::after {
        content: "";
        display: block;
        padding-bottom: 100%;
      }
    `}

  ${(p) =>
    p.hasImage &&
    p.status === Status.Loaded &&
    css`
      background: transparent;
    `}

  ${(p) => {
    if (p.customer || p.source || !p.nameString) {
      return;
    }

    switch (styleClass(p.nameString)) {
      case "one":
        return css`
          color: ${p.theme.colors.decorativeOneText};
          background: ${p.theme.colors.decorativeOneSurface};
        `;
      case "two":
        return css`
          color: ${p.theme.colors.decorativeTwoText};
          background: ${p.theme.colors.decorativeTwoSurface};
        `;
      case "three":
        return css`
          color: ${p.theme.colors.decorativeThreeText};
          background: ${p.theme.colors.decorativeThreeSurface};
        `;
      case "four":
        return css`
          color: ${p.theme.colors.decorativeFourText};
          background: ${p.theme.colors.decorativeFourSurface};
        `;
      default:
        return css`
          color: ${p.theme.colors.decorativeFiveText};
          background: ${p.theme.colors.decorativeFiveSurface};
        `;
    }
  }}
`;

const StyledText = styled.text<{ initials?: string }>`
  font-size: ${(p) => {
    if (p.initials && p.initials.length > 2) {
      return p.theme.typography.fontSize100;
    }
    return p.theme.typography.fontSize300;
  }};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
`;

const StyledImage = styled(Image)<{ status: Status }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const StyledInitials = styled.span`
  position: relative;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledSvg = styled.svg<{
  decorate: boolean;
}>`
  width: 100%;
  height: 100%;

  ${(p) =>
    p.decorate &&
    css`
      background-color: ${p.theme.colors.decorativeSixSurface};
    `}
`;
