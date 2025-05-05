import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { StyledButton } from "../Button/Button";

export interface ButtonGroupProps {
  /** Khoảng cách giữa cách item */
  spacing?: "extraTight" | "tight" | "loose";
  /** Gộp các item lại với nhau */
  segmented?: boolean;
  /** Các item chiếm tối da diện tích chiều ngang */
  fullWidth?: boolean;
  /** Ngăn các item khỏi wrap */
  noWrap?: boolean;
  /** Các item trong group */
  children?: React.ReactNode;
}

/**
 * Được dùng để nhóm các phần tử lại theo chiều ngang với khoảng cách nhất định hoặc gộp chúng lại với nhau
 */
export function ButtonGroup({ children, segmented, spacing, fullWidth, noWrap }: ButtonGroupProps) {
  const itemMarkup = React.Children.map(children, (child, index) => {
    const props = { key: index };
    return wrapWithComponent(child, StyledButtonGroupItem, props);
  });

  return (
    <StyledButtonGroup segmented={segmented} spacing={spacing} fullWidth={fullWidth} noWrap={noWrap}>
      {itemMarkup}
    </StyledButtonGroup>
  );
}

const StyledButtonGroupItem = styled.div``;

const StyledButtonGroup = styled.div<Omit<ButtonGroupProps, "children">>`
  display: flex;
  flex-wrap: ${(p) => (p.noWrap ? "nowrap" : "wrap")};
  align-items: center;

  ${(p) => {
    switch (p.spacing) {
      case "extraTight":
        return css`
          margin-top: calc(${p.theme.spacing(1)} * -1);
          margin-left: calc(${p.theme.spacing(1)} * -1);
          ${StyledButtonGroupItem} {
            margin-top: ${p.theme.spacing(1)};
            margin-left: ${p.theme.spacing(1)};
          }
        `;
      case "tight":
        return css`
          margin-top: calc(${p.theme.spacing(2)} * -1);
          margin-left: calc(${p.theme.spacing(2)} * -1);
          ${StyledButtonGroupItem} {
            margin-top: ${p.theme.spacing(2)};
            margin-left: ${p.theme.spacing(2)};
          }
        `;
      case "loose":
        return css`
          margin-top: calc(${p.theme.spacing(5)} * -1);
          margin-left: calc(${p.theme.spacing(5)} * -1);
          ${StyledButtonGroupItem} {
            margin-top: ${p.theme.spacing(5)};
            margin-left: ${p.theme.spacing(5)};
          }
        `;
      default:
        return css`
          margin-top: calc(${p.theme.spacing(4)} * -1);
          margin-left: calc(${p.theme.spacing(4)} * -1);
          ${StyledButtonGroupItem} {
            margin-top: ${p.theme.spacing(4)};
            margin-left: ${p.theme.spacing(4)};
          }
        `;
    }
  }}

  ${(p) =>
    p.fullWidth &&
    css`
      ${StyledButtonGroupItem} {
        flex: 1 1 auto;
      }
      ${StyledButton} {
        display: flex;
        width: 100%;
      }
    `}

  ${(p) =>
    p.segmented &&
    css`
      flex-wrap: nowrap;
      margin-top: 0;
      margin-left: 0;
      ${StyledButton}, [data-segment-control] {
        border-radius: 0;
      }
      ${StyledButtonGroupItem} {
        margin-top: 0;
        margin-left: 0;
        &:not(:first-of-type) {
          margin-left: calc(${p.theme.spacing(0.25)}*-1);
        }
        &:first-of-type ${StyledButton}, &:first-of-type [data-segment-control] {
          border-top-left-radius: ${p.theme.shape.borderRadius("base")};
          border-bottom-left-radius: ${p.theme.shape.borderRadius("base")};
        }
        &:last-of-type ${StyledButton}, &:last-of-type [data-segment-control] {
          border-top-right-radius: ${p.theme.shape.borderRadius("base")};
          border-bottom-right-radius: ${p.theme.shape.borderRadius("base")};
        }
      }
    `}
`;
