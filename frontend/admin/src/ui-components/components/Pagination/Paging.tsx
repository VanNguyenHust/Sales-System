import React, { Children } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronLeftIcon, ArrowChevronRightIcon } from "@/ui-icons";

import { focusRing, unstyledButton } from "../../utils/styles";
import { Icon } from "../Icon";

import { usePaging } from "./usePaging";

export interface PagingProps {
  /**Số lượng trang*/
  numberOfPages?: number;
  /**Trang hiện tại*/
  currentPage?: number;
  /**Callback khi trang được click*/
  onNavigate?: (page: number) => void;
}

export const Paging = ({ currentPage = 1, numberOfPages = 1, onNavigate = noop }: PagingProps) => {
  const { items, hasPrevious, hasNext } = usePaging(numberOfPages, currentPage);
  return (
    <StyledPaging>
      <StyledButton disabled={!hasPrevious} onClick={() => hasPrevious && onNavigate(currentPage - 1)}>
        <Icon color="base" source={ArrowChevronLeftIcon} />
      </StyledButton>
      {Children.toArray(
        items.map(({ active, page, blank }) =>
          blank ? (
            <StyledElipsis>...</StyledElipsis>
          ) : (
            <StyledButton active={active} onClick={() => !active && onNavigate(page)}>
              {page}
            </StyledButton>
          )
        )
      )}
      <StyledButton disabled={!hasNext} onClick={() => hasNext && onNavigate(currentPage + 1)}>
        <Icon color="base" source={ArrowChevronRightIcon} />
      </StyledButton>
    </StyledPaging>
  );
};

const StyledButton = styled.button<{
  active?: boolean;
}>`
  ${unstyledButton}
  min-width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  line-height: ${(p) => p.theme.spacing(5)};
  ${(p) => p.theme.breakpoints.up("md")} {
    min-width: ${(p) => p.theme.spacing(6)};
    height: ${(p) => p.theme.spacing(6)};
    line-height: ${(p) => p.theme.spacing(6)};
  }
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing(0, 1)};
  cursor: pointer;
  background-color: transparent;
  border: 0;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSize200};
  border-radius: ${(p) => p.theme.shape.borderRadius("full")};
  margin: ${(p) => p.theme.spacing(0, 1)};
  transition: ${(p) => p.theme.motion.duration200};
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHovered};
  }
  &:active {
    background: ${(p) => p.theme.colors.surfacePressed};
  }
  &:disabled,
  &[disabled] {
    cursor: default;
    pointer-events: none;
    background: none;
    svg {
      color: ${(p) => p.theme.colors.iconSubdued};
      fill: ${(p) => p.theme.colors.iconSubdued};
    }
  }
  ${(p) =>
    p.active &&
    css`
      background-color: ${p.theme.colors.actionPrimary};
      color: ${p.theme.colors.textOnPrimary};
      &:hover {
        background: ${p.theme.colors.actionPrimaryHovered};
      }
      &:active {
        background: ${p.theme.colors.actionPrimaryPressed};
      }
    `}
  ${(p) => focusRing(p.theme)};
  &:focus-visible {
    ${(p) => focusRing(p.theme, { style: "focused" })}
  }
`;

const StyledElipsis = styled.span`
  padding: ${(p) => p.theme.spacing(0, 1)};
  margin: ${(p) => p.theme.spacing(0, 1)};
  min-width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  line-height: ${(p) => p.theme.spacing(5)};
  ${(p) => p.theme.breakpoints.up("md")} {
    min-width: ${(p) => p.theme.spacing(6)};
    height: ${(p) => p.theme.spacing(6)};
    line-height: ${(p) => p.theme.spacing(6)};
  }
`;

const StyledPaging = styled.div`
  height: ${(p) => p.theme.spacing(5)};
  display: flex;
  align-items: center;
  ${StyledButton} {
    &:first-of-type,
    &:last-child {
      padding: 0;
      & > * {
        width: ${(p) => p.theme.spacing(5)};
        height: ${(p) => p.theme.spacing(5)};
        ${(p) => p.theme.breakpoints.up("md")} {
          width: ${(p) => p.theme.spacing(6)};
          height: ${(p) => p.theme.spacing(6)};
        }
      }
    }
  }
`;

const noop = () => {};
