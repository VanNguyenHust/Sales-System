import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Theme } from "../../themes/types";
import { UnstyledLink } from "../UnstyledLink";

export interface LinkProps {
  /** id của Link */
  id?: string;
  /** Url tới link */
  url?: string;
  /** Nội dung trong link */
  children?: React.ReactNode;
  /** Đánh dấu external link, mở new tab */
  external?: boolean;
  /**
   * Thuộc tính download của link. Sử dụng string nếu muốn override filename.
   *
   * Lưu ý thuộc tính này chỉ work với same-origin policy, {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes Chi tiết}
   */
  download?: boolean | string;
  /**
   * Bỏ underline
   * @default false
   * */
  removeUnderline?: boolean;
  /** Xác định có phải primary navigation link khi được render trong `IndexTable.Row` */
  dataPrimaryLink?: boolean;
  /** Hành động khi click */
  onClick?(): void;
}

/**
 * Đối tượng link
 */
export function Link({ id, url, removeUnderline, external, dataPrimaryLink, download, onClick, children }: LinkProps) {
  if (!url)
    return (
      <StyledButton
        removeUnderline={removeUnderline}
        type="button"
        onClick={onClick}
        id={id}
        data-primary-link={dataPrimaryLink}
      >
        {children}
      </StyledButton>
    );
  return (
    <StyledLink
      removeUnderline={removeUnderline}
      id={id}
      external={external}
      url={url}
      download={download}
      data-primary-link={dataPrimaryLink}
      onClick={onClick}
    >
      {children}
    </StyledLink>
  );
}

const linkStyle = (theme: Theme, removeUnderline?: boolean) => css`
  appearance: none;
  display: inline;
  text-align: inherit;
  padding: 0;
  background: none;
  border: 0;
  font-size: inherit;
  font-weight: inherit;
  color: ${theme.colors.interactive};
  cursor: pointer;
  text-decoration: ${removeUnderline ? "none" : "underline"};
  &:hover {
    color: ${theme.colors.interactiveHovered};
    text-decoration: ${removeUnderline ? "underline" : "none"};
  }
  &:focus:not(:active) {
    outline: ${theme.colors.focused} auto ${theme.shape.borderRadius(1)};
  }

  &:active {
    position: relative;
    color: ${theme.colors.interactivePressed};
  }
`;

const StyledLink = styled(UnstyledLink, {
  shouldForwardProp: (prop) => prop !== "removeUnderline",
})<{
  removeUnderline?: boolean;
}>`
  ${(p) => linkStyle(p.theme, p.removeUnderline)}
`;

const StyledButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "removeUnderline",
})<{
  removeUnderline?: boolean;
}>`
  ${(p) => linkStyle(p.theme, p.removeUnderline)}
`;
