import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { type Placement } from "@floating-ui/react";

export const StyledArrow = styled.div<{
  placement?: Placement;
  tooltip?: boolean;
}>`
  position: absolute;

  ${(p) => {
    const borderColor = p.tooltip ? p.theme.components.tooltip.borderColor : p.theme.colors.borderSubdued;
    const bgColor = p.tooltip ? p.theme.components.tooltip.backgroundColor : p.theme.colors.surface;
    const size = "5px";
    const negativeSize = `calc(-1 * ${size})`;
    const borderWidth = p.theme.shape.borderWidth(1);
    const largeSize = `calc(${size} + ${borderWidth})`;
    const negativeLargeSize = `calc(-1 * (${size} + ${borderWidth}))`;
    switch (p.placement) {
      case "bottom":
      case "bottom-start":
      case "bottom-end":
        return css`
          top: ${negativeSize};
          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: ${negativeLargeSize};
            border-style: solid;
            border-width: 0 ${largeSize} ${largeSize};
            border-color: ${borderColor} transparent;
            display: block;
            width: 0;
            z-index: 0;
          }

          &:after {
            content: "";
            position: absolute;
            top: ${borderWidth};
            left: ${negativeSize};
            border-style: solid;
            border-width: 0 ${size} ${size};
            border-color: ${bgColor} transparent;
            display: block;
            width: 0;
            z-index: 1;
          }
        `;
      case "top":
      case "top-start":
      case "top-end":
        return css`
          bottom: ${negativeSize};
          &:before {
            content: "";
            position: absolute;
            bottom: 0px;
            left: ${negativeLargeSize};
            border-style: solid;
            border-width: ${largeSize} ${largeSize} 0;
            border-color: ${borderColor} transparent;
            display: block;
            width: 0;
            z-index: 0;
          }

          &:after {
            content: "";
            position: absolute;
            bottom: ${borderWidth};
            left: ${negativeSize};
            border-style: solid;
            border-width: ${size} ${size} 0;
            border-color: ${bgColor} transparent;
            display: block;
            width: 0;
            z-index: 1;
          }
        `;
      default:
        return css``;
    }
  }}
`;
