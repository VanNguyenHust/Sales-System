import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { IconSource } from "../../types";
import { Icon } from "../Icon";
import { Text } from "../Text";

interface NonMutuallyExclusiveProps {
  /**
   * Trạng thái của badge
   * @default "default"
   * */
  status?: "success" | "warning" | "critical" | "highlight" | "plain" | "new" | "default";
  /** Trạng thái complete của badge, show nút tròn thể hiện điều đó */
  progress?: "incomplete" | "partiallyComplete" | "complete";
  /** Icon hiển thị bên trái nội dung badge */
  icon?: IconSource;
  /**
   * @default "medium"
   * Kích thước của badge
   * */
  size?: "small" | "medium";
  /** Nội dung để hiển thị bên trong badge */
  children?: string;
}

export type BadgeProps = NonMutuallyExclusiveProps &
  (
    | { progress?: NonMutuallyExclusiveProps["progress"]; icon?: undefined }
    | { icon?: IconSource; progress?: undefined }
  );

/**
 * Thường được dùng để hiện thị trạng thái của đối tượng
 */
export function Badge({ status = "default", children, progress, size = "medium", icon }: BadgeProps) {
  const progressStatusMarkup =
    progress && !icon ? (
      <StyledIcon>
        <Icon source={progressIconMap[progress]} />
      </StyledIcon>
    ) : null;

  const textMarkup = children ? (
    <Text as="span" variant="bodySm" fontWeight={status === "plain" ? "medium" : undefined}>
      {children}
    </Text>
  ) : null;

  return (
    <StyledBadge status={status} $size={size}>
      {progressStatusMarkup}
      {icon && (
        <StyledIcon>
          <Icon source={icon} />
        </StyledIcon>
      )}
      {textMarkup}
    </StyledBadge>
  );
}

const progressIconMap: { [P in NonNullable<BadgeProps["progress"]>]: IconSource } = {
  complete: () => (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
    </svg>
  ),
  partiallyComplete: () => (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 10L13 10C13 8.34 11.66 7 10 7C8.34 7 7 8.34 7 10L10 10ZM6 10C6 12.21 7.79 14 10 14C12.21 14 14 12.21 14 10C14 7.79 12.21 6 10 6C7.79 6 6 7.79 6 10Z"
        fill="currentColor"
      />
    </svg>
  ),
  incomplete: () => (
    <svg viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13ZM6 10C6 12.21 7.79 14 10 14C12.21 14 14 12.21 14 10C14 7.79 12.21 6 10 6C7.79 6 6 7.79 6 10Z"
        fill="currentColor"
      />
    </svg>
  ),
};

const StyledIcon = styled.span`
  svg {
    /* Corrects conflicting alignment with ancestor elements */
    display: inline-block;
    vertical-align: top;
  }
  margin: calc(${(p) => p.theme.spacing(0.5)} * -1) 0 calc(${(p) => p.theme.spacing(0.5)}* -1)
    calc(${(p) => p.theme.spacing(2)}* -1);
`;

const StyledBadge = styled.span<{
  status: BadgeProps["status"];
  $size: BadgeProps["size"];
}>`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing(1, 4)};
  background-color: ${(p) => p.theme.colors.surfaceNeutral};
  outline: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.surfaceNeutral};
  outline-offset: -${(p) => p.theme.shape.borderWidth(1)};
  border-radius: ${(p) => p.theme.shape.borderRadius(5)};
  color: ${(p) => p.theme.colors.text};

  @media print {
    border: ${(p) => p.theme.spacing(0.25)} solid ${(p) => p.theme.colors.border};
  }
  ${(p) => {
    let bgColor = null;
    let textColor = null;
    let borderColor = null;
    switch (p.status) {
      case "success":
        bgColor = p.theme.components.badge.backgroundSuccessColor;
        textColor = p.theme.components.badge.textSuccessColor;
        borderColor = p.theme.components.badge.borderSuccessColor;
        break;
      case "warning":
        bgColor = p.theme.components.badge.backgroundWarningColor;
        textColor = p.theme.components.badge.textWarningColor;
        borderColor = p.theme.components.badge.borderWarningColor;
        break;
      case "critical":
        bgColor = p.theme.components.badge.backgroundCriticalColor;
        textColor = p.theme.components.badge.textCriticalColor;
        borderColor = p.theme.components.badge.borderCriticalColor;
        break;
      case "highlight":
        bgColor = p.theme.components.badge.backgroundHighlightColor;
        textColor = p.theme.components.badge.textHighlightColor;
        borderColor = p.theme.components.badge.borderHighlightColor;
        break;
      case "new":
        bgColor = p.theme.components.badge.backgroundNewColor;
        textColor = p.theme.components.badge.textNewColor;
        borderColor = p.theme.components.badge.borderNewColor;
        break;
      case "plain":
        break;
      default:
        bgColor = p.theme.components.badge.backgroundColor;
        textColor = p.theme.components.badge.textColor;
        borderColor = p.theme.components.badge.borderColor;
        break;
    }
    return bgColor
      ? css`
          background-color: ${bgColor};
          color: ${textColor};
          outline-color: ${borderColor};
          svg {
            fill: ${textColor};
          }
        `
      : css``;
  }}
  ${(p) =>
    p.$size === "small" &&
    css`
      padding: ${p.theme.spacing(0.5, 2)};
    `}
`;
