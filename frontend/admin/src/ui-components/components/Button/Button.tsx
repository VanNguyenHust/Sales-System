import React, { useCallback } from "react";
import type { JSX } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowCaretDownIcon, ArrowCaretUpIcon } from "@/ui-icons";

import { Theme } from "../../themes/types";
import { ConnectedDisclosure } from "../../types";
import { useToggle } from "../../utils/useToggle";
import { ActionList } from "../ActionList";
import { Icon, IconProps } from "../Icon";
import { Popover } from "../Popover";
import { Spinner } from "../Spinner";
import { UnstyledLink } from "../UnstyledLink";

export interface ButtonProps {
  /** Thể hiện action là hành động chính */
  primary?: boolean;
  /** Thể hiện action là hành động tiêu cực */
  destructive?: boolean;
  /** Outline button */
  outline?: boolean;
  /** Button ở dạng link */
  plain?: boolean;
  /** Button ở trạng thái disabled */
  disabled?: boolean;
  /** Button ở trạng thái pressed */
  pressed?: boolean;
  /** Button ở trạng thái loading */
  loading?: boolean;
  /** Hiển thị button với disclosure icon. Mặc định `down` khi set giá trị true. */
  disclosure?: boolean | "up" | "down";
  /** Icon để hiển thị bên trái button. */
  icon?: IconProps["source"];
  /** Nội dung bên trong button */
  children?: string | string[];
  /** button thuộc loại button form */
  submit?: boolean;
  /** id của button */
  id?: string;
  /**
   * Kích thước button
   * @default "mediumn"
   * */
  size?: "small" | "medium" | "large";
  /** Disclosure hiển thị bên trái button. Danh sách hành động được hiển thị bởi Popover. */
  connectedDisclosure?: ConnectedDisclosure;
  /** Cấu hình trường hợp `plain` and `outline` màu (text, borders, icons) giống với text hiện tại, đồng thời cũng gạch chân cho `plain` Buttons. */
  monochrome?: boolean;
  /** Cho phép button phát triển chiều dài theo container */
  fullWidth?: boolean;
  /** Url của button, sẽ render button dưới dạng link */
  url?: string;
  /** Link được mở trong tab mới */
  external?: boolean;
  /**
   * Thuộc tính download của link. Sử dụng string nếu muốn override filename.
   *
   * Lưu ý thuộc tính này chỉ work với same-origin policy, {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes Chi tiết}
   */
  download?: boolean | string;
  /** Callback khi click */
  onClick?: () => void;
}

/**
 * Button thường được dùng chủ yếu để thực hiện một hành động như "Thêm", "Xóa", ...
 * Plain button nhìn tương tự link được sử dụng cho các hành động ít quan trọng, ít phổ biến hơn chẳng hạn như card action
 * */
export function Button({
  submit,
  children,
  primary,
  destructive,
  outline,
  plain,
  disabled,
  pressed,
  loading,
  disclosure,
  icon,
  id,
  size = "medium",
  connectedDisclosure,
  monochrome,
  fullWidth,
  url,
  external,
  download,
  onClick,
}: ButtonProps) {
  const {
    value: isActiveConnectedDisclosure,
    toggle: toggleConnectedDisclosure,
    setFalse: closeConnectedDisclosure,
  } = useToggle(false);
  const isDisabled = loading || disabled;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) {
        e.stopPropagation();
        e.preventDefault();
      } else {
        onClick?.();
      }
    },
    [isDisabled, onClick]
  );
  const iconOnly = !!icon && !children;

  const contentMarkup = (
    <StyledContent large={size === "large"} plain={plain}>
      {loading && (
        <StyledSpinner plain={plain} iconOnly={iconOnly}>
          <Spinner size="small" />
        </StyledSpinner>
      )}
      {icon && (
        <StyledIcon iconOnly={iconOnly}>
          <Icon source={loading ? "placeholder" : icon} />
        </StyledIcon>
      )}
      <StyledText transparent={loading}>{children}</StyledText>
      {disclosure && (
        <StyledDisclosure>
          <Icon source={loading ? "placeholder" : disclosure === "up" ? ArrowCaretUpIcon : ArrowCaretDownIcon} />
        </StyledDisclosure>
      )}
    </StyledContent>
  );

  const commonStyleProps: BaseButtonStyleProps = {
    primary,
    destructive,
    outline,
    plain,
    $disabled: disabled,
    disabled: isDisabled,
    pressed,
    size,
    $loading: loading,
    iconOnly,
    monochrome,
    connectedDisclosure: Boolean(connectedDisclosure),
    fullWidth,
  };

  const buttonMarkup = url ? (
    <StyledButtonLink
      {...commonStyleProps}
      id={id}
      url={!isDisabled ? url : undefined}
      external={external}
      download={download}
      data-segment-control="true"
      onClick={isDisabled ? undefined : handleClick}
    >
      {contentMarkup}
    </StyledButtonLink>
  ) : (
    <StyledButton
      {...commonStyleProps}
      id={id}
      type={submit ? "submit" : "button"}
      data-segment-control="true"
      onClick={handleClick}
    >
      {contentMarkup}
    </StyledButton>
  );

  let connectedDisclosureMarkup: JSX.Element | null = null;
  if (connectedDisclosure) {
    const { disabled: disclosureDisabled, accessibilityLabel = "Lựa chọn khác" } = connectedDisclosure;
    const connectedDisclosureActivator = (
      <StyledConnectedDisclosure
        iconOnly
        primary={primary}
        outline={outline}
        destructive={destructive}
        onClick={toggleConnectedDisclosure}
        tabIndex={disclosureDisabled ? -1 : undefined}
        disabled={disclosureDisabled}
        aria-label={accessibilityLabel}
        size={size}
      >
        <Icon source={ArrowCaretDownIcon} />
      </StyledConnectedDisclosure>
    );

    connectedDisclosureMarkup = (
      <Popover
        active={isActiveConnectedDisclosure}
        onClose={closeConnectedDisclosure}
        activator={connectedDisclosureActivator}
        preferredAlignment="right"
        hideOnPrint
      >
        <ActionList items={connectedDisclosure.actions} onActionAnyItem={toggleConnectedDisclosure} />
      </Popover>
    );
  }

  return connectedDisclosureMarkup ? (
    <StyledConnectedDisclosureWrapper>
      {buttonMarkup}
      {connectedDisclosureMarkup}
    </StyledConnectedDisclosureWrapper>
  ) : (
    buttonMarkup
  );
}

interface BaseButtonStyleProps {
  primary?: boolean;
  destructive?: boolean;
  outline?: boolean;
  plain?: boolean;
  $disabled?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  size?: ButtonProps["size"];
  $loading?: boolean;
  iconOnly: boolean;
  connectedDisclosure?: boolean;
  monochrome?: boolean;
  fullWidth?: boolean;
}

const buttonStyle = (
  theme: Theme,
  {
    primary,
    destructive,
    outline,
    plain,
    $disabled,
    pressed,
    size,
    $loading,
    iconOnly,
    connectedDisclosure,
    monochrome,
    fullWidth,
  }: BaseButtonStyleProps
) => {
  const lineHeight = theme.typography.fontLineHeight2;
  let minHeight: string;
  let totalBorder: string;
  if (plain) {
    totalBorder = theme.spacing(0);
    minHeight = theme.spacing(8);
    if (size === "small") {
      minHeight = "28px";
    }
  } else {
    totalBorder = theme.spacing(0.5);
    minHeight = theme.components.form.controlHeight;
    if (size === "large") {
      minHeight = theme.spacing(12);
    } else if (size === "small") {
      minHeight = "28px";
    }
  }

  const verticalSpacing = `calc((${minHeight} - ${lineHeight} - ${totalBorder}) / 2)`;
  let hozSpacing: string;
  if (plain) {
    if (iconOnly) {
      hozSpacing = verticalSpacing;
    } else {
      hozSpacing = theme.spacing(2);
    }
  } else {
    if (iconOnly) {
      hozSpacing = verticalSpacing;
    } else {
      hozSpacing = theme.spacing(4);
      if (size === "large") {
        hozSpacing = theme.spacing(6);
      } else if (size === "small") {
        hozSpacing = theme.spacing(3);
      }
    }
  }
  const dimensionStyle = css`
    min-width: ${minHeight};
    min-height: ${minHeight};
    padding: ${verticalSpacing} ${hozSpacing};
    ${plain &&
    css`
      margin: calc(${verticalSpacing} * -1) calc(${hozSpacing} * -1);
    `}
    ${plain &&
    fullWidth &&
    css`
      margin-left: 0;
      margin-right: 0;
    `}
  `;
  const commonStyle = css`
    cursor: pointer;
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    margin: 0;
    user-select: none;
    text-decoration: none;
    text-align: center;
    border: ${plain ? "none" : theme.shape.borderBase};
    border-radius: ${theme.shape.borderRadius("base")};
    &:focus-visible {
      outline: ${theme.shape.borderWidth(2)} solid ${theme.colors.borderInteractiveFocus};
      outline-offset: ${theme.spacing(0.25)};
    }
    ${$loading &&
    css`
      pointer-events: none;
    `}
    ${connectedDisclosure &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}

    ${fullWidth &&
    css`
      display: flex;
      width: 100%;
    `}
    ${dimensionStyle}
  `;
  if ($disabled) {
    return css`
      ${commonStyle}
      cursor: not-allowed;
      color: ${theme.colors.textDisabled};
      background: ${outline ? theme.colors.surface : plain ? "transparent" : theme.colors.surfaceDisabled};
      border-color: ${outline ? theme.colors.borderDisabled : "transparent"};
      ${plain &&
      iconOnly &&
      css`
        svg {
          fill: ${destructive ? theme.colors.actionCriticalDisabled : theme.colors.iconDisabled};
          color: ${destructive ? theme.colors.actionCriticalDisabled : theme.colors.iconDisabled};
        }
      `}
    `;
  }
  if (outline) {
    let backgroundColor: string;
    let activeColor: string;
    let hoverColor: string;
    if (primary) {
      activeColor = theme.colors.actionPrimaryOutlinePressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionPrimaryOutline;
        hoverColor = theme.colors.actionPrimaryOutlineHovered;
      }
    } else if (destructive) {
      activeColor = theme.colors.actionCriticalOutlinePressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionCriticalOutline;
        hoverColor = theme.colors.actionCriticalOutlineHovered;
      }
    } else {
      activeColor = theme.colors.actionSecondaryPressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionSecondary;
        hoverColor = theme.colors.actionSecondaryHovered;
      }
    }

    let textColor: string;
    let borderColor: string;
    if (monochrome) {
      textColor = borderColor = "inherit";
    } else if (primary) {
      textColor = borderColor = theme.colors.textPrimary;
    } else if (destructive) {
      textColor = borderColor = theme.colors.textCritical;
    } else {
      textColor = theme.colors.text;
      borderColor = theme.colors.border;
    }
    return css`
      ${commonStyle}
      color: ${textColor};
      border-color: ${borderColor};
      background: ${backgroundColor};
      &:hover {
        background: ${hoverColor};
      }
      &[data-state="open"],
      &:active {
        background: ${activeColor};
      }
    `;
  } else if (plain) {
    let textColor: string;
    let activeColor: string;
    let hoverColor: string;
    let iconColor: string;
    let iconActiveColor: string;
    let iconHoverColor: string;
    if (monochrome) {
      textColor = activeColor = hoverColor = "inherit";
      iconColor = iconHoverColor = iconActiveColor = "currentColor";
    } else if (destructive) {
      activeColor = theme.colors.interactiveCriticalPressed;
      iconActiveColor = theme.colors.actionCriticalPressed;
      if (pressed) {
        textColor = hoverColor = activeColor;
        iconColor = iconHoverColor = iconActiveColor;
      } else {
        textColor = theme.colors.interactiveCritical;
        hoverColor = theme.colors.interactiveCriticalHovered;
        iconColor = theme.colors.actionCritical;
        iconHoverColor = theme.colors.actionCriticalHovered;
      }
    } else {
      activeColor = theme.colors.interactivePressed;
      iconActiveColor = theme.colors.iconPressed;
      if (pressed) {
        textColor = hoverColor = activeColor;
        iconColor = iconHoverColor = iconActiveColor;
      } else {
        textColor = theme.colors.interactive;
        hoverColor = theme.colors.interactiveHovered;
        iconColor = theme.colors.icon;
        iconHoverColor = theme.colors.iconHovered;
      }
    }

    return css`
      ${commonStyle}
      background: transparent;
      color: ${textColor};
      text-decoration: ${monochrome ? "underline" : "none"};
      &:hover,
      &:active {
        text-decoration: underline;
      }
      &:hover {
        color: ${hoverColor};
      }
      &[data-state="open"],
      &:active {
        color: ${activeColor};
      }
      &:focus-visible {
        outline-offset: calc(-1 * ${theme.spacing(1)});
        border-radius: ${theme.shape.borderRadius("large")};
        text-decoration: underline;
      }
      ${iconOnly &&
      css`
        svg {
          fill: ${iconColor};
          color: ${iconColor};
        }
        &:hover {
          svg {
            fill: ${iconHoverColor};
            color: ${iconHoverColor};
          }
        }
        &[data-state="open"],
        &:active {
          svg {
            fill: ${iconActiveColor};
            color: ${iconActiveColor};
          }
        }
        &:focus-visible {
          outline: ${theme.shape.borderWidth(2)} solid ${theme.colors.borderInteractiveFocus};
          outline-offset: ${theme.spacing(0.25)};
        }
      `}
    `;
  } else {
    let backgroundColor: string;
    let activeColor: string;
    let hoverColor: string;
    if (primary) {
      activeColor = theme.colors.actionPrimaryPressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionPrimary;
        hoverColor = theme.colors.actionPrimaryHovered;
      }
    } else if (destructive) {
      activeColor = theme.colors.actionCriticalPressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionCritical;
        hoverColor = theme.colors.actionCriticalHovered;
      }
    } else {
      activeColor = theme.colors.actionSecondaryPressed;
      if (pressed) {
        backgroundColor = hoverColor = activeColor;
      } else {
        backgroundColor = theme.colors.actionSecondary;
        hoverColor = theme.colors.actionSecondaryHovered;
      }
    }

    let iconColor: string;
    let iconActiveColor: string;
    let iconHoverColor: string;
    if (primary || destructive) {
      iconColor = iconHoverColor = iconActiveColor = "currentColor";
    } else {
      iconActiveColor = theme.colors.iconPressed;
      if (pressed) {
        iconColor = iconHoverColor = iconActiveColor;
      } else {
        iconColor = theme.colors.icon;
        iconHoverColor = theme.colors.iconHovered;
      }
    }

    return css`
      ${commonStyle}
      border: ${primary || destructive ? theme.shape.borderTransparent : theme.shape.borderBase};
      color: ${primary ? theme.colors.textOnPrimary : destructive ? theme.colors.textOnCritical : theme.colors.text};
      background: ${backgroundColor};
      svg {
        color: ${iconColor};
      }
      &:hover {
        background: ${hoverColor};
        svg {
          color: ${iconHoverColor};
        }
      }
      &[data-state="open"],
      &:active {
        background: ${activeColor};
        svg {
          color: ${iconActiveColor};
        }
      }
    `;
  }
};

export const StyledButton = styled.button<BaseButtonStyleProps>`
  ${(p) => buttonStyle(p.theme, p)}
`;

const ignoredProps: (keyof BaseButtonStyleProps)[] = [
  "primary",
  "destructive",
  "outline",
  "plain",
  "size",
  "$loading",
  "iconOnly",
  "connectedDisclosure",
  "monochrome",
  "fullWidth",
  "$disabled",
];

export const StyledButtonLink = styled(UnstyledLink, {
  shouldForwardProp: (prop) => !ignoredProps.includes(prop as keyof BaseButtonStyleProps),
})<BaseButtonStyleProps>`
  ${(p) => buttonStyle(p.theme, p)}
`;

const StyledConnectedDisclosureWrapper = styled.div`
  display: flex;
`;

const StyledConnectedDisclosure = styled.button<BaseButtonStyleProps>`
  ${(p) => buttonStyle(p.theme, p)}
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: unset;
  ${(p) =>
    (p.primary || p.destructive) &&
    css`
      margin-left: ${p.theme.spacing(0.25)};
    `}
`;

const StyledContent = styled.span<{
  large?: boolean;
  plain?: boolean;
}>`
  font-size: ${(p) => (p.large ? p.theme.typography.fontSize200 : p.theme.typography.fontSize100)};
  font-weight: ${(p) => (p.plain ? p.theme.typography.fontWeightRegular : p.theme.typography.fontWeightMedium)};
  line-height: ${(p) => (p.large ? p.theme.typography.fontLineHeight2 : p.theme.typography.fontLineHeight1)};
  text-transform: none;
  letter-spacing: normal;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${(p) => p.theme.spacing(0.25)};
  min-height: ${(p) => p.theme.spacing(0.25)};
`;

const StyledIcon = styled.span<{
  iconOnly?: boolean;
}>`
  ${(p) =>
    !p.iconOnly &&
    css`
      margin-right: ${p.theme.spacing(1)};
    `}
`;

const StyledDisclosure = styled.span`
  margin-left: ${(p) => p.theme.spacing(1)};
`;

const StyledSpinner = styled.span<{
  plain?: boolean;
  iconOnly?: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: calc(-1 * (${(p) => p.theme.spacing(5)} / 2));
  margin-left: calc(-1 * (${(p) => p.theme.spacing(5)} / 2));
  ${(p) =>
    p.plain &&
    p.iconOnly &&
    css`
      svg {
        fill: none;
      }
    `}
`;

const StyledText = styled.span<{ transparent?: boolean }>`
  ${(p) =>
    p.transparent &&
    css`
      color: transparent;
    `}
`;
