import React, { useContext } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ComplexAction } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { useToggle } from "../../utils/useToggle";
import { WithinContentContext } from "../../utils/within-content";
import { ActionList } from "../ActionList";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { Popover } from "../Popover";

import { CardHeaderProps, Header } from "./Header";
import { Section } from "./Section";
import { Subsection } from "./Subsection";

export interface CardProps extends CardHeaderProps {
  /** id card */
  id?: string;
  /** Subdued card */
  subdued?: boolean;
  /** Tự động wrap nội dung trong section */
  sectioned?: boolean;
  /** Action chính ở phần footer */
  primaryFooterAction?: ComplexAction;
  /** Những action phụ ở phần footer */
  secondaryFooterActions?: ComplexAction[];
  /** Nội dung hiển thị của disclosure button khi có nhiều hơn 1 footer action*/
  secondaryFooterActionsDisclosureText?: string;
  /**
   * Căn action footer
   * @default "right"
   * */
  footerActionAlignment?: "left" | "right";
  /** Nội dung trong card */
  children?: React.ReactNode;
}

/**
 * Dùng để nhóm các concepts hoặc task tương đồng dễ đọc, scan
 */
export const Card: React.FC<CardProps> & {
  Header: typeof Header;
  Section: typeof Section;
  Subsection: typeof Subsection;
} = ({
  id,
  title,
  sectioned,
  divider,
  subdued,
  children,
  actions,
  primaryFooterAction,
  secondaryFooterActions,
  footerActionAlignment = "right",
  secondaryFooterActionsDisclosureText,
}) => {
  const withinContent = useContext(WithinContentContext);

  const {
    value: isActiveSecondaryActionsPopover,
    toggle: toggleSecondaryActionsPopover,
    setFalse: closeSecondaryActionsPopover,
  } = useToggle(false);
  const headerMarkup = title || actions ? <Header title={title} actions={actions} divider={divider} /> : null;
  const contentMarkup = sectioned ? <Section>{children}</Section> : children;

  const primaryFooterActionMarkup = primaryFooterAction ? buttonFrom(primaryFooterAction, { primary: true }) : null;
  let secondaryFooterActionMarkup = null;
  if (secondaryFooterActions && secondaryFooterActions.length) {
    if (secondaryFooterActions.length === 1) {
      secondaryFooterActionMarkup = buttonFrom(secondaryFooterActions[0]);
    } else {
      secondaryFooterActionMarkup = (
        <Popover
          preferredPosition="above"
          active={isActiveSecondaryActionsPopover}
          activator={
            <Button disclosure onClick={toggleSecondaryActionsPopover}>
              {secondaryFooterActionsDisclosureText || "Thêm"}
            </Button>
          }
          onClose={closeSecondaryActionsPopover}
        >
          <ActionList items={secondaryFooterActions} />
        </Popover>
      );
    }
  }

  const footerMarkup =
    primaryFooterActionMarkup || secondaryFooterActionMarkup ? (
      <StyledFooter alignment={footerActionAlignment}>
        {footerActionAlignment === "left" ? (
          <ButtonGroup>
            {primaryFooterActionMarkup}
            {secondaryFooterActionMarkup}
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            {secondaryFooterActionMarkup}
            {primaryFooterActionMarkup}
          </ButtonGroup>
        )}
      </StyledFooter>
    ) : null;
  return (
    <StyledCard id={id} subdued={subdued} className="ui-card" withinIndexTable={withinContent}>
      {headerMarkup}
      {contentMarkup}
      {footerMarkup}
    </StyledCard>
  );
};

Card.Header = Header;
Card.Section = Section;
Card.Subsection = Subsection;

const StyledCard = styled.div<{
  subdued: CardProps["subdued"];
  withinIndexTable: boolean;
}>`
  background-color: ${(p) => (p.subdued ? p.theme.colors.surfaceSubdued : p.theme.colors.surface)};
  ${(p) =>
    p.withinIndexTable
      ? css`
          border: ${p.theme.shape.borderDivider};
        `
      : css`
          box-shadow: ${p.theme.shadow.card};
        `}
  outline: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;

  ${(p) => p.theme.breakpoints.up("sm")} {
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }

  // ui-card class workaround for & + & issue
  & + .ui-card {
    margin-top: ${(p) => p.theme.spacing(4)};
  }
  @media print {
    box-shadow: none;
  }
`;

const StyledFooter = styled.div<{
  alignment: CardProps["footerActionAlignment"];
}>`
  display: flex;
  justify-content: ${(p) => (p.alignment === "left" ? "flex-start" : "flex-end")};
  padding: ${(p) => p.theme.spacing(0, 4, 4)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => p.theme.spacing(0, 5, 5)};
  }
`;
