import React from "react";
import styled from "@emotion/styled";

import { ComplexAction } from "../../types";
import { buttonFrom, buttonsFrom } from "../../utils/buttonFrom";
import { useBreakpoints } from "../../utils/useBreakpoints";

type ModalSecondaryAction = ComplexAction & {
  /** @default true */
  outline?: boolean;
};

export interface FooterProps {
  /** Action chính */
  primaryAction?: ComplexAction;
  /** Các actions phụ */
  secondaryActions?: ModalSecondaryAction[];
  /** Nội dung hiển thị bên trái của footer - nếu không truyền action thì sẽ là full khối footer */
  children?: React.ReactNode;
  /** Ngăn footer với body bởi đường viền */
  divider?: boolean;
}
export function Footer({ primaryAction, secondaryActions, children, divider }: FooterProps) {
  const { smUp: inline } = useBreakpoints();
  const primaryActionMarkup = primaryAction
    ? buttonsFrom(primaryAction, { primary: !primaryAction.destructive })
    : null;
  const secondaryActionMarkup = secondaryActions
    ? secondaryActions.map(({ outline = true, ...rest }, index) =>
        buttonFrom(rest, outline ? { primary: true, outline: true } : {}, index)
      )
    : null;

  if (!primaryActionMarkup && !secondaryActionMarkup) {
    return <>{children}</>;
  }
  const additionalFooterMarkup = children ? <div>{children} </div> : inline ? <div /> : null;
  return (
    <StyledModalFooter divider={divider}>
      <StyledInner>
        {additionalFooterMarkup}
        <StyledActions>
          {secondaryActionMarkup}
          {primaryActionMarkup}
        </StyledActions>
      </StyledInner>
    </StyledModalFooter>
  );
}

const StyledModalFooter = styled.div<{
  divider?: boolean;
}>`
  width: 100%;
  padding: ${(p) => p.theme.spacing(5)};
  background-color: ${(p) => p.theme.colors.surface};
  border-top: ${(p) => (p.divider ? p.theme.shape.borderDivider : "unset")};
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
`;

const StyledInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(3)};

  ${(p) => p.theme.breakpoints.up("sm")} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: ${(p) => p.theme.spacing(4)};
  }
`;

const StyledActions = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: ${(p) => p.theme.spacing(3)};

  ${(p) => p.theme.breakpoints.up("sm")} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: ${(p) => p.theme.spacing(4)};
  }
`;
