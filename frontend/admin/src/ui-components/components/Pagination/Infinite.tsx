import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronLeftIcon, ArrowChevronRightIcon } from "@/ui-icons";

import { Theme } from "../../themes/types";
import { focusRing, unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";

export interface InfiniteProps {
  /**Link tới trang tiếp theo*/
  nextURL?: string;
  /**Link tới trang trước đó*/
  previousURL?: string;
  /**Có trang tiếp theo*/
  hasNext?: boolean;
  /**Có trang trước đó */
  hasPrevious?: boolean;
  /**Callback khi click next */
  onNext?: () => void;
  /**Callback khi click previous*/
  onPrevious?: () => void;
}
export const Infinite = ({ previousURL, nextURL, hasPrevious, hasNext, onNext, onPrevious }: InfiniteProps) => {
  const PreviousMarkup = previousURL ? StyledLink : StyledButton;
  const NextMarkup = nextURL ? StyledLink : StyledButton;
  return (
    <StyledInfinite>
      <PreviousMarkup {...(previousURL && { href: previousURL })} disabled={!hasPrevious} onClick={onPrevious}>
        <Icon color="base" source={ArrowChevronLeftIcon} />
      </PreviousMarkup>
      <NextMarkup {...(nextURL && { href: nextURL })} disabled={!hasNext} onClick={onNext}>
        <Icon color="base" source={ArrowChevronRightIcon} />
      </NextMarkup>
    </StyledInfinite>
  );
};

const StyledButton = styled.button`
  ${unstyledButton};
  ${(p) => stylesButton(p.theme)}
`;

const StyledLink = styled.a`
  ${unstyledButton};
  ${(p) => stylesButton(p.theme)}
`;

const stylesButton = (theme: Theme) => {
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(${theme.spacing(8)} + ${theme.spacing(1)});
    height: calc(${theme.spacing(8)} + ${theme.spacing(1)});
    border: ${theme.shape.borderBase};
    box-sizing: border-box;
    transition: ${theme.motion.duration200};
    &:hover {
      background: ${theme.colors.surfaceHovered};
    }
    &:active {
      background: ${theme.colors.surfacePressed};
    }
    &:disabled,
    &[disabled] {
      cursor: default;
      pointer-events: none;
      background: ${theme.colors.surfacePressed};
    }
    &:first-of-type {
      border-top-left-radius: ${theme.shape.borderRadius("base")};
      border-bottom-left-radius: ${theme.shape.borderRadius("base")};
    }
    &:last-child {
      border-top-right-radius: ${theme.shape.borderRadius("base")};
      border-bottom-right-radius: ${theme.shape.borderRadius("base")};
      margin-left: calc(${theme.spacing(0.25)}*-1);
    }
    ${focusRing(theme)}
    &:focus-visible {
      ${focusRing(theme, { style: "focused" })}
    }
  `;
};

const StyledInfinite = styled.div`
  display: inline-flex;
`;
