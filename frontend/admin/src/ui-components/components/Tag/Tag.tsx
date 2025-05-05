import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { CloseBigIcon } from "@/ui-icons";

import { unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";
import { UnstyledLink } from "../UnstyledLink";

interface NonMutuallyExclusiveProps {
  /** Trạng thái disable của Tag */
  disabled?: boolean;
  /** Secondary tag */
  secondary?: boolean;
  /** Large tag */
  large?: boolean;
  /** Url của tag */
  url?: string;
  /** Link được mở trong tab mới */
  external?: boolean;
  /** Callback khi xóa Tag */
  onRemove?(): void;
  /** Callback khi click Tag */
  onClick?(): void;
  /** Nội dung để hiển thị bên trong Tag */
  children?: React.ReactNode;
}

export type TagProps = NonMutuallyExclusiveProps &
  (
    | { onClick?(): void; onRemove?: undefined; url?: undefined; external?: undefined }
    | { onClick?: undefined; onRemove?(): void; url?: string; external?: boolean }
  );

/**
 * Sử dụng để tạo thẻ Tag trong các bộ lọc, sản phẩm, đơn hàng,...
 */
export function Tag({ disabled, secondary, large, url, external, onRemove, onClick, children }: TagProps) {
  const tagText = <StyledTagText large={large}>{children}</StyledTagText>;

  if (onClick) {
    return (
      <StyledTag
        onClick={onClick}
        large={large}
        hasClick
        disabled={disabled}
        secondary={secondary}
        as="button"
        type="button"
      >
        {tagText}
      </StyledTag>
    );
  }

  const removeButton = onRemove ? (
    <StyledRemoveButton onClick={onRemove} large={large} secondary={secondary} disabled={disabled} type="button">
      <Icon source={CloseBigIcon} color={secondary || disabled ? "base" : "primary"} />
    </StyledRemoveButton>
  ) : null;

  const tagContent =
    url && !disabled ? (
      <StyledLink external={external} url={url}>
        {tagText}
      </StyledLink>
    ) : (
      tagText
    );

  return (
    <StyledTag
      large={large}
      hasClick={false}
      disabled={disabled}
      secondary={secondary}
      as="span"
      linkable={!!url && !disabled}
    >
      {tagContent}
      {removeButton}
    </StyledTag>
  );
}

const StyledTag = styled.button<{
  secondary?: boolean;
  large?: boolean;
  disabled?: boolean;
  hasClick: boolean;
  linkable?: boolean;
}>`
  ${(p) => p.hasClick && unstyledButton}
  max-width: 100%;
  display: inline-flex;
  padding: ${(p) => (p.large ? p.theme.spacing(1, 3) : p.theme.spacing(0.5, 3))};
  background-color: ${(p) =>
    p.disabled
      ? p.theme.colors.surfaceDisabled
      : p.secondary
      ? p.theme.colors.surfaceNeutral
      : p.theme.colors.surfacePrimarySelected};
  border-radius: ${(p) => p.theme.shape.borderRadius(5)};
  color: ${(p) => (p.disabled ? p.theme.colors.textDisabled : p.theme.colors.text)};
  outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;

  ${(p) =>
    p.hasClick &&
    css`
      &:disabled {
        cursor: default;
      }
      &:hover:not(:disabled):not(:active),
      &:focus:not(:active),
      &:focus-visible:not(:active) {
        outline: ${p.theme.shape.borderWidth(1)} solid
          ${p.secondary ? p.theme.colors.borderSubdued : p.theme.colors.textPrimaryHovered};
      }
    `}
`;

const StyledTagText = styled.span<{ large?: boolean }>`
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  font-size: ${(p) => (p.large ? p.theme.typography.fontSize100 : p.theme.typography.fontSize75)};
  line-height: ${(p) => (p.large ? p.theme.typography.fontLineHeight2 : p.theme.typography.fontLineHeight1)};
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: middle;
  padding: ${(p) => p.theme.spacing(0.5, 0)};
  ${(p) => p.theme.breakpoints.down("sm")} {
    font-size: 13px;
    padding: ${(p) => p.theme.spacing(1, 0)};
  }
`;

const StyledRemoveButton = styled.button<{
  large?: boolean;
  secondary?: boolean;
}>`
  flex-shrink: 0;
  cursor: ${(p) => (p.disabled ? "initial" : "pointer")};
  align-self: center;
  width: ${(p) => p.theme.spacing(4)};
  height: ${(p) => p.theme.spacing(4)};
  margin-left: ${(p) => (p.large ? p.theme.spacing(3) : p.theme.spacing(2))};
  padding: ${(p) => p.theme.spacing(0.5)};
  border: none;
  background-color: transparent;
  border-radius: ${(p) => p.theme.shape.borderRadius("half")};
  &:hover:not(:disabled) {
    background-color: ${(p) =>
      p.secondary ? p.theme.colors.surfaceNeutralHovered : p.theme.colors.surfacePrimarySelectedPressed};
  }
  &:active:not(:disabled) {
    background-color: ${(p) =>
      p.secondary ? p.theme.colors.surfaceNeutralHovered : p.theme.colors.surfacePrimarySelectedPressed};
  }
  outline: ${(p) => p.theme.shape.borderWidth(2)} solid transparent;
  &:focus-visible {
    outline-color: ${(p) => p.theme.colors.borderInteractiveFocus};
  }
`;

const StyledLink = styled(UnstyledLink)`
  display: inline-grid;
  color: ${(p) => p.theme.colors.text};
  outline: none;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }

  &:focus-visible:not(:active) {
    text-decoration: underline;
  }
`;
