import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ComplexAction, DisableableAction, LoadableAction } from "../../types";
import { buttonFrom, buttonsFrom } from "../../utils/buttonFrom";

export interface PageActionsProps {
  /** Hành động chính */
  primaryAction?: (DisableableAction & LoadableAction) | React.ReactNode;
  /** Các hành động phụ */
  secondaryActions?: ComplexAction[] | React.ReactNode;
  /**
   * Đường viền ngăn cách
   * @default true
   * */
  divider?: boolean;
}

/**
 * Thể hiện các hành động ở cuối trang có thể mà chủ shop có thể tiếp cận khi mà các hành động chính ở phía trên khó tiếp cận hơn
 */
export function PageActions({ primaryAction, secondaryActions, divider = true }: PageActionsProps) {
  let secondaryActionsMarkup = null;
  let primaryActionMarkup = null;

  if (isReactNode(primaryAction)) {
    primaryActionMarkup = <>{primaryAction}</>;
  } else if (primaryAction) {
    primaryActionMarkup = buttonFrom(primaryAction, { primary: true });
  }

  if (isReactNode(secondaryActions)) {
    secondaryActionsMarkup = <>{secondaryActions}</>;
  } else if (secondaryActions) {
    secondaryActionsMarkup = buttonsFrom(secondaryActions, { outline: true, primary: true });
  }

  return (
    <StyledPageActions role="pageActions" divider={divider}>
      <StyledInner>
        {secondaryActionsMarkup}
        {primaryActionMarkup}
      </StyledInner>
    </StyledPageActions>
  );
}

const StyledPageActions = styled.div<{
  divider?: boolean;
}>`
  margin: 0 auto;
  padding: ${(p) => p.theme.spacing(4, 4)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: ${(p) => p.theme.spacing(4, 0)};
  }
  ${(p) =>
    p.divider &&
    css`
      border-top: ${p.theme.shape.borderWidth(1)} solid ${p.theme.colors.borderSubdued};
    `}
  ${(p) => p.theme.breakpoints.down("sm")} {
    button {
      width: 100%;
    }
    border-top: 0;
  }
`;

const StyledInner = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${(p) => p.theme.spacing(3)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    flex-direction: row;
    justify-content: end;
    flex-wrap: wrap;
    gap: ${(p) => p.theme.spacing(4)};
  }
`;

function isReactNode(x: any): x is React.ReactNode {
  return React.isValidElement(x) && x !== undefined;
}
