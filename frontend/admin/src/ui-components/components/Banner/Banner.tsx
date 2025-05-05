import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  CircleCheckOutlineIcon,
  CloseBigIcon,
  ErrorOutlineIcon,
  InfoCircleOutlineIcon,
  WarningOutlineIcon,
} from "@/ui-icons";

import type { ComplexAction } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { Button } from "../Button";
import type { IconProps } from "../Icon";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { useBannerFocus } from "./useBannerFocus";

export interface BannerProps {
  /** Tiêu đề của banner. */
  title?: string;
  /** Trạng thái banner. */
  status?: "success" | "info" | "warning" | "critical";
  /** Ẩn icon trạng thái. */
  hideIcon?: boolean;

  /** Custom icon trạng thái muốn hiển thị. */
  icon?: IconProps["source"];

  /** Nội dung banner. */
  children?: React.ReactNode;
  /** Action chính ở phần header */
  action?: ComplexAction;
  /** Ẩn nút x tắt banner. */
  hideDismiss?: boolean;
  /** Outline variant */
  outline?: boolean;
  /** Callback khi banner bị đóng. */
  onDismiss?(): void;
}

/**
 * Banner dùng để thông báo cho chủ shop theo một cách nổi bật, được đặt trên đầu page hoặc trên đầu section và dưới header
 */
export const Banner = ({
  title,
  status,
  icon,
  children,
  action,
  outline,
  hideIcon,
  hideDismiss,
  onDismiss,
}: BannerProps) => {
  const { defaultIcon, iconColor } = getBannerProps(status);

  const { wrapperRef, handleKeyUp, handleBlur, handleMouseUp, shouldShowFocus } = useBannerFocus();

  const iconSource = icon || defaultIcon;
  const actionMarkup = action ? (
    <StyledAction>{buttonFrom(action, { outline: true, primary: true })}</StyledAction>
  ) : null;
  return (
    <StyledWrapper
      status={status}
      outline={outline}
      keyFocused={shouldShowFocus}
      tabIndex={0}
      ref={wrapperRef}
      onMouseUp={handleMouseUp}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      {!outline ? <StyledTop /> : null}
      <StyledBanner>
        <Stack wrap={false} spacing="none">
          {!hideIcon ? (
            <StyledIcon>
              <Icon source={iconSource} color={iconColor} />
            </StyledIcon>
          ) : null}

          <Stack.Item fill>
            {title ? (
              <Stack vertical spacing="extraTight">
                <Text variant="headingMd" as="h3" fontWeight="medium" breakWord>
                  {title}
                </Text>
                {children}
              </Stack>
            ) : (
              children
            )}
            {actionMarkup}
          </Stack.Item>
          {!hideDismiss ? <Button plain icon={CloseBigIcon} onClick={onDismiss} /> : null}
        </Stack>
      </StyledBanner>
    </StyledWrapper>
  );
};

function getBannerProps(status: BannerProps["status"]): {
  defaultIcon: IconProps["source"];
  iconColor: IconProps["color"];
} {
  switch (status) {
    case "success":
      return {
        defaultIcon: CircleCheckOutlineIcon,
        iconColor: "success",
      };
    case "info":
      return {
        defaultIcon: InfoCircleOutlineIcon,
        iconColor: "primary",
      };
    case "warning":
      return {
        defaultIcon: WarningOutlineIcon,
        iconColor: "warning",
      };

    case "critical":
      return {
        defaultIcon: ErrorOutlineIcon,
        iconColor: "critical",
      };

    default:
      return {
        defaultIcon: CircleCheckOutlineIcon,
        iconColor: "base",
      };
  }
}

const StyledTop = styled.div`
  height: ${(p) => p.theme.shape.borderWidth(4)};
  border-top-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-top-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledBanner = styled.div``;

const StyledWrapper = styled.div<{
  status: BannerProps["status"];
  outline?: boolean;
  keyFocused?: boolean;
}>`
  ${StyledBanner} {
    border-bottom-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
    border-bottom-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
    padding: ${(p) => p.theme.spacing(2, 4)};
    display: flex;
    > * {
      flex: 1;
    }
  }

  &:focus {
    outline: none;
  }
  ${(p) =>
    p.keyFocused &&
    css`
      &,
      &:focus {
        outline: ${p.theme.shape.borderWidth(2)} solid ${p.theme.colors.borderInteractiveFocus};
      }
    `}

  ${({ theme, status, outline }) => {
    let backgroundColor = theme.colors.surfaceNeutral;
    let borderColor = theme.colors.borderSubdued;
    switch (status) {
      case "success":
        backgroundColor = theme.colors.surfaceNeutralSuccess;
        borderColor = theme.colors.borderSuccess;
        break;
      case "info":
        backgroundColor = theme.colors.surfaceNeutralInfo;
        borderColor = theme.colors.borderInformation;
        break;
      case "critical":
        backgroundColor = theme.colors.surfaceNeutralCritical;
        borderColor = theme.colors.borderCritical;
        break;
      case "warning":
        backgroundColor = theme.colors.surfaceNeutralWarning;
        borderColor = theme.colors.borderWarning;
        break;
    }
    if (outline) {
      return css`
        ${StyledBanner} {
          background-color: ${backgroundColor};
          border: ${theme.shape.borderWidth(1)} solid ${borderColor};
          border-radius: ${theme.shape.borderRadius("base")};
        }
      `;
    }
    return css`
      ${StyledBanner} {
        background-color: ${backgroundColor};
      }
      ${StyledTop} {
        background-color: ${borderColor};
      }
    `;
  }}

  @media print {
    border: ${(p) => p.theme.spacing(0.25)} solid ${(p) => p.theme.colors.border};
  }
`;

const StyledIcon = styled.div`
  margin-right: ${(p) => p.theme.spacing(2)};
`;

const StyledAction = styled.div`
  padding-top: ${(p) => p.theme.spacing(3)};
`;
