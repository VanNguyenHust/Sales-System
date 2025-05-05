import React, { useContext, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Theme } from "../../themes/types";
import { ActionListItemDescriptor } from "../../types";
import { handleMouseUpByBlurring } from "../../utils/focus";
import { focusRing, noFocusRing, unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";
import { PopoverContext } from "../Popover/context";
import { Scrollable } from "../Scrollable";
import { Text } from "../Text";
import { Tooltip } from "../Tooltip";
import { UnstyledLink } from "../UnstyledLink";

export function Item({
  id,
  content,
  accessibilityLabel,
  helpText,
  icon,
  url,
  external,
  prefix,
  suffix,
  disabled,
  destructive,
  ellipsis,
  active,
  role,
  truncate,
  onAction,
}: ActionListItemDescriptor) {
  let prefixMarkup: React.ReactNode | null = null;

  if (prefix) {
    prefixMarkup = <StyledPrefix>{prefix}</StyledPrefix>;
  } else if (icon) {
    prefixMarkup = (
      <StyledPrefix>
        <Icon source={icon} />
      </StyledPrefix>
    );
  }

  let contentText: string | React.ReactNode = content || "";
  if (truncate && content) {
    contentText = <TruncateText>{content}</TruncateText>;
  } else if (ellipsis) {
    contentText = `${content}…`;
  }

  const contentMarkup = helpText ? (
    <>
      <p>{contentText}</p>
      <Text color="subdued" as="span" variant="bodyMd">
        {helpText}
      </Text>
    </>
  ) : (
    contentText
  );

  const suffixMarkup = suffix && <StyledSuffix>{suffix}</StyledSuffix>;

  const textMarkup = <StyledText>{contentMarkup}</StyledText>;

  const contentElement = (
    <StyledContent truncate={truncate}>
      {prefixMarkup}
      {textMarkup}
      {suffixMarkup}
    </StyledContent>
  );

  const scrollMarkup = active ? <Scrollable.ScrollTo /> : null;

  const control = url ? (
    <StyledItemLink
      id={id}
      url={!disabled ? url : undefined}
      external={external}
      disabled={disabled}
      $disabled={disabled}
      $active={active}
      $destructive={destructive}
      aria-label={accessibilityLabel}
      onClick={disabled ? undefined : onAction}
      role={role}
      onMouseUp={handleMouseUpByBlurring}
    >
      {contentElement}
    </StyledItemLink>
  ) : (
    <StyledItemButton
      id={id}
      type="button"
      disabled={disabled}
      $disabled={disabled}
      $active={active}
      $destructive={destructive}
      aria-label={accessibilityLabel}
      onClick={onAction}
      role={role}
      onMouseUp={handleMouseUpByBlurring}
    >
      {contentElement}
    </StyledItemButton>
  );

  return (
    <>
      {scrollMarkup}
      {control}
    </>
  );
}

const TruncateText = ({ children }: { children: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const context = useContext(PopoverContext);

  useEffect(() => {
    if (textRef.current && (context?.isPositioned === undefined || context?.isPositioned === true)) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.offsetWidth);
    }
  }, [children, context?.isPositioned]);

  const text = (
    <Text as="span" truncate>
      <StyledBox ref={textRef}>{children}</StyledBox>
    </Text>
  );

  return isOverflowing ? (
    <Tooltip preferredPosition="above" hoverDelay={1000} content={children} dismissOnMouseOut>
      <Text as="span" truncate>
        {children}
      </Text>
    </Tooltip>
  ) : (
    text
  );
};

const StyledPrefix = styled.span`
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  height: ${(p) => p.theme.spacing(5)};
  width: ${(p) => p.theme.spacing(5)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};

  margin: calc(-0.5 * ${(p) => p.theme.spacing(5)}) 0 calc(-0.5 * ${(p) => p.theme.spacing(5)}) 0;
  background-size: cover;
  background-position: center center;
`;

const itemStyle = (theme: Theme, $disabled?: boolean, $active?: boolean, $destructive?: boolean) => css`
  ${unstyledButton}
  ${focusRing(theme)}
  display: block;
  width: 100%;
  min-height: ${theme.components.form.controlHeight};
  text-align: left;
  text-decoration: none;
  padding: calc(
      (${theme.components.form.controlHeight} - ${theme.typography.fontLineHeight2} - ${theme.spacing(0.5)}) / 2
    )
    ${theme.spacing(2)};
  margin: ${theme.spacing(0.5, 0)};
  border-radius: ${theme.shape.borderRadius("base")};
  border-top: ${theme.shape.borderWidth(1)} solid transparent;
  svg {
    fill: ${theme.colors.icon};
    color: ${theme.colors.icon};
  }

  ${!$disabled
    ? css`
        cursor: pointer;
        &:hover {
          background-color: ${theme.colors.surfaceHovered};
          text-decoration: none;
          outline: ${theme.shape.borderWidth(3)} solid transparent;
        }

        &:active {
          svg {
            fill: ${theme.colors.interactive};
            color: ${theme.colors.interactive};
          }
          background-color: ${theme.colors.surfacePressed};
        }

        &:visited {
          color: inherit;
        }
      `
    : css`
        cursor: default;
        background-image: none;
        color: ${theme.colors.textDisabled};
        svg {
          fill: ${theme.colors.iconDisabled};
          color: ${theme.colors.iconDisabled};
        }
      `}

  &:focus-visible:not(:active) {
    ${noFocusRing}
    background-color: ${theme.colors.surface};
    outline: ${theme.shape.borderWidth(2)} solid ${theme.colors.borderInteractiveFocus};
  }

  ${$active &&
  css`
    &,
    &:hover,
    &:active {
      background-color: ${theme.colors.surfaceSelected};
    }
    svg {
      fill: ${theme.colors.interactive};
      color: ${theme.colors.interactive};
    }
  `}

  ${$destructive &&
  !$disabled &&
  css`
    &,
    &:hover,
    &:active {
      svg {
        fill: ${theme.colors.iconCritical};
        color: ${theme.colors.iconCritical};
      }
    }
    color: ${theme.colors.interactiveCritical};

    &:hover {
      background-color: ${theme.colors.surfaceCriticalSubduedHovered};
    }

    &:active {
      background-color: ${theme.colors.surfaceCriticalSubduedPressed};
    }
    ${$active &&
    css`
      background-color: ${theme.colors.surfaceCriticalSubduedPressed};
    `}
  `}
`;

const StyledItemButton = styled.button<{
  $disabled?: boolean;
  $active?: boolean;
  $destructive?: boolean;
}>`
  ${(p) => itemStyle(p.theme, p.$disabled, p.$active, p.$destructive)}
`;

const StyledItemLink = styled(UnstyledLink, {
  shouldForwardProp: (prop) => !["$disabled", "$active", "$destructive"].includes(prop),
})<{
  $disabled?: boolean;
  $active?: boolean;
  $destructive?: boolean;
}>`
  ${(p) => itemStyle(p.theme, p.$disabled, p.$active, p.$destructive)}
`;

const StyledSuffix = styled.span``;
const StyledText = styled.span`
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
`;

const StyledContent = styled.div<{
  truncate?: boolean;
}>`
  display: flex;
  flex-wrap: ${(p) => (p.truncate ? "nowrap" : "wrap")};
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledBox = styled.span`
  display: block;
  width: 100%;
`;
