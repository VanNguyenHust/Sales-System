import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { CircleCheckOutlineIcon, CloseBigIcon, ErrorOutlineIcon, InfoCircleOutlineIcon } from "@/ui-icons";

import { Action } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { Icon } from "../Icon";
import { Text } from "../Text";

export interface ToastProps {
  /** Nội dung bên trong toast */
  content: string;
  /**
   * Khoảng thời gian tính bằng milliseconds mà thông báo sẽ tồn tại
   * @default 5000
   */
  duration?: number;
  /** Hiển thị một toast error. */
  error?: boolean;
  /** Hiển thị một toast success. */
  success?: boolean;
  /** Thêm action vào cạnh message. */
  action?: Action;
  /** Callback khi ấn nút đóng toast */
  onDismiss(): void;
}

export const DEFAULT_TOAST_DURATION = 5000;
export const DEFAULT_TOAST_DURATION_WITH_ACTION = 10000;

export function Toast({ content, onDismiss, duration, error, success, action }: ToastProps) {
  useEffect(() => {
    let timeoutDuration: number = duration || DEFAULT_TOAST_DURATION;
    if (action && !duration) {
      timeoutDuration = DEFAULT_TOAST_DURATION_WITH_ACTION;
    } else if (action && duration && duration < DEFAULT_TOAST_DURATION_WITH_ACTION) {
      // eslint-disable-next-line no-console
      console.log("Toast with action nên có thời gian delay ít nhất 10s để cho người dùng có thể thao tác");
    }

    const timer = setTimeout(onDismiss, timeoutDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onDismiss, action]);

  const dismissMarkup = (
    <StyledDismissIcon onClick={onDismiss}>
      <Icon source={CloseBigIcon} />
    </StyledDismissIcon>
  );

  const actionMarkup = action ? (
    <StyledAction>{buttonFrom(action, { plain: true, monochrome: true, size: "small" })}</StyledAction>
  ) : null;

  const leadingIconSource = error ? ErrorOutlineIcon : success ? CircleCheckOutlineIcon : InfoCircleOutlineIcon;

  const leadingIconMarkup = (
    <StyledLeadingIcon>
      <Icon source={leadingIconSource} />
    </StyledLeadingIcon>
  );

  return (
    <StyledToast error={error} success={success}>
      <StyledLeadingContent>
        {leadingIconMarkup}
        <Text as="span" variant="bodyLg" breakWord>
          {content}
        </Text>
      </StyledLeadingContent>
      {actionMarkup}
      {dismissMarkup}
    </StyledToast>
  );
}

const StyledToast = styled.div<{
  error?: boolean;
  success?: boolean;
}>`
  display: inline-flex;
  max-width: ${(p) => p.theme.components.toast.maxWidth};
  min-width: ${(p) => p.theme.components.toast.minWidth};
  ${(p) => p.theme.breakpoints.down("sm")} {
    max-width: ${(p) => p.theme.components.toast.mobileMaxWidth};
  }
  padding: calc(${(p) => p.theme.spacing(3)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(5)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background: ${(p) =>
    p.error
      ? p.theme.components.toast.backgroundCriticalColor
      : p.success
      ? p.theme.components.toast.backgroundSuccessColor
      : p.theme.components.toast.backgroundColor};
  color: ${(p) => p.theme.components.toast.textPrimaryColor};
  margin-bottom: ${(p) => p.theme.spacing(5)};
  box-shadow: ${(p) => p.theme.shadow.popover};
  align-items: center;
`;

const StyledLeadingContent = styled.span`
  display: flex;
  text-align: justify;
  flex: 1;
`;

const StyledDismissIcon = styled.span`
  cursor: pointer;
  width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  margin-left: ${(p) => p.theme.spacing(6)};
  &:hover {
    svg {
      opacity: 0.9;
    }
  }
`;

const StyledLeadingIcon = styled.span`
  margin-right: ${(p) => p.theme.spacing(1)};
`;

const StyledAction = styled.div`
  margin-left: ${(p) => p.theme.spacing(2)};
  color: ${(p) => p.theme.colors.textOnInteractive};
`;
