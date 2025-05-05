import React, { JSX } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronLeftIcon, ArrowChevronRightIcon } from "@/ui-icons";

import { MenuActionDescriptor, MenuGroupDescriptor } from "../../types";
import { isInterface } from "../../utils/components";
import { useBreakpoints } from "../../utils/useBreakpoints";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { Stack } from "../Stack";

import { ActionMenu } from "./ActionMenu";
import { Breadcrumbs, BreadcrumbsProps } from "./Breadcrumbs";
import { NavigationButton } from "./NavigationButton";
import { Title, TitleProps } from "./Title";
import { PaginationProps, PrimaryAction } from "./types";

export interface HeaderProps extends TitleProps {
  /** Link hoặc hành động khi click back */
  backAction?: BreadcrumbsProps["backAction"];
  /** Action chính mức page */
  primaryAction?: PrimaryAction | React.ReactNode;
  /** Danh sách các secondary action mức page */
  secondaryActions?: MenuActionDescriptor[] | React.ReactNode;
  /** Danh sách các nhóm secondary action mức page */
  actionGroups?: MenuGroupDescriptor[];
  /** Phân trang ở mức page */
  pagination?: PaginationProps;
  /** Nội dung bổ sung cho header */
  additionalMetadata?: React.ReactNode;
  /** Callback khi các sectiondary action được rollup thành action group */
  onActionRollup?(hasRolledUp: boolean): void;
}

export function Header({
  title,
  subtitle,
  titleMetadata,
  backAction,
  pagination,
  primaryAction,
  secondaryActions,
  actionGroups,
  additionalMetadata,
}: HeaderProps) {
  const { mdDown: isNavigationCollapsed } = useBreakpoints();
  const breadcrumbMarkup = backAction ? (
    <StyledBreadcrumbsWrapper>
      <Breadcrumbs backAction={backAction} />
    </StyledBreadcrumbsWrapper>
  ) : null;

  const pageTitleMarkup = (
    <StyledTitleWrapper>
      <Title title={title} subtitle={subtitle} titleMetadata={titleMetadata} />
    </StyledTitleWrapper>
  );

  let actionMenuMarkup: JSX.Element | null = null;
  if (!secondaryActions) {
    actionMenuMarkup = <ActionMenu groups={actionGroups} rollup={isNavigationCollapsed} />;
  } else if (!isInterface(secondaryActions)) {
    actionMenuMarkup = <>{secondaryActions}</>;
  } else {
    actionMenuMarkup = <ActionMenu actions={secondaryActions} groups={actionGroups} rollup={isNavigationCollapsed} />;
  }

  const primaryActionMarkup = primaryAction ? (
    <StyledPrimaryActionWrapper>
      {isInterface(primaryAction) ? (
        <Button {...primaryAction} onClick={primaryAction.onAction} primary>
          {primaryAction.content}
        </Button>
      ) : (
        primaryAction
      )}
    </StyledPrimaryActionWrapper>
  ) : null;

  const paginationMarkup = pagination ? (
    <StyledPaginationWrapper>
      <ButtonGroup segmented>
        <NavigationButton
          icon={ArrowChevronLeftIcon}
          disabled={!pagination.hasPrevious}
          onClick={pagination.onPrevious}
        />
        <NavigationButton icon={ArrowChevronRightIcon} disabled={!pagination.hasNext} onClick={pagination.onNext} />
      </ButtonGroup>
    </StyledPaginationWrapper>
  ) : null;

  const { slot1, slot2, slot3, slot4 } = determineLayout({
    actionMenuMarkup,
    breadcrumbMarkup,
    isNavigationCollapsed,
    pageTitleMarkup,
    paginationMarkup,
    primaryActionMarkup,
    title,
  });

  const hasBreadcrumbs = breadcrumbMarkup !== null;

  return (
    <StyledHeaderWrapper>
      <StyledHeader
        longTitle={!!title && title.length > LONG_TITLE}
        mediumTitle={(!!title && title.length < LONG_TITLE) || (!title && !!titleMetadata)}
        hasBreadcrumbs={hasBreadcrumbs}
      >
        <StyledHeaderRow>
          {slot1}
          {slot2}
          {slot3 || slot4 ? (
            <StyledRightAlign>
              {slot3 && slot4 ? (
                <StyledHeaderActions>
                  {slot3}
                  {slot4}
                </StyledHeaderActions>
              ) : (
                <>
                  {slot3}
                  {slot4}
                </>
              )}
            </StyledRightAlign>
          ) : null}
        </StyledHeaderRow>
        {additionalMetadata ? (
          <StyledHeaderRow>
            <Stack alignment="center">
              <StyledAdditionalMetadata hasBreadcrumbs={hasBreadcrumbs}>{additionalMetadata}</StyledAdditionalMetadata>
            </Stack>
          </StyledHeaderRow>
        ) : null}
      </StyledHeader>
    </StyledHeaderWrapper>
  );
}

type MaybeJSX = JSX.Element | null;
const SHORT_TITLE = 20;
const REALLY_SHORT_TITLE = 8;
const LONG_TITLE = 34;

function determineLayout({
  actionMenuMarkup,
  breadcrumbMarkup,
  isNavigationCollapsed,
  pageTitleMarkup,
  paginationMarkup,
  primaryActionMarkup,
  title,
}: {
  actionMenuMarkup: MaybeJSX;
  breadcrumbMarkup: MaybeJSX;
  isNavigationCollapsed: boolean;
  pageTitleMarkup: JSX.Element;
  paginationMarkup: MaybeJSX;
  primaryActionMarkup: MaybeJSX;
  title?: string;
}) {
  //    Header Layout
  // |----------------------------------------------------|
  // | slot1 | slot2 |                    | slot3 | slot4 |
  // |----------------------------------------------------|
  //
  const layouts = {
    mobileCompact: {
      slots: {
        slot1: null,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
      },
      condition: isNavigationCollapsed && breadcrumbMarkup === null && !!title && title.length <= REALLY_SHORT_TITLE,
    },
    mobileDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
      },
      condition: isNavigationCollapsed,
    },
    desktopCompact: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: null,
        slot4: primaryActionMarkup,
      },
      condition:
        !isNavigationCollapsed &&
        paginationMarkup === null &&
        actionMenuMarkup === null &&
        !!title &&
        title.length <= SHORT_TITLE,
    },
    desktopDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: (
          <>
            {actionMenuMarkup}
            {primaryActionMarkup}
          </>
        ),
        slot4: paginationMarkup,
      },
      condition: !isNavigationCollapsed,
    },
  };

  const layout = Object.values(layouts).find((layout) => layout.condition) || layouts.desktopDefault;

  return layout.slots;
}

const StyledHeaderWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(4)};
  ${(p) => p.theme.breakpoints.up("sm")} {
    padding: ${(p) => p.theme.spacing(4, 0)};
  }
`;

const StyledHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: ${(p) => p.theme.spacing(8)};
`;

const StyledBreadcrumbsWrapper = styled.div`
  padding-right: ${(p) => p.theme.spacing(4)};
  grid-area: breadcrumbs;
  @media print {
    display: none;
  }
`;

const StyledTitleWrapper = styled.div`
  grid-area: title;
  align-self: center;
  padding: calc((${(p) => p.theme.components.form.controlHeight} - ${(p) => p.theme.typography.fontLineHeight3}) / 2)
    ${(p) => p.theme.spacing(0.5)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: calc((${(p) => p.theme.components.form.controlHeight} - ${(p) => p.theme.typography.fontLineHeight4}) / 2)
      ${(p) => p.theme.spacing(0.5)};
  }
`;

const StyledAdditionalMetadata = styled.div<{
  hasBreadcrumbs: boolean;
}>`
  ${(p) => p.theme.breakpoints.up("md")} {
    margin-left: ${(p) =>
      p.hasBreadcrumbs ? `calc(${p.theme.spacing(4)} + ${p.theme.components.form.controlHeight})` : 0};
  }
`;

const StyledRightAlign = styled.div`
  grid-area: actions;
  display: flex;
  align-content: flex-end;
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  justify-content: flex-end;
  margin-left: ${(p) => p.theme.spacing(4)};
  white-space: nowrap;
`;

const StyledHeaderActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledPaginationWrapper = styled.div`
  margin-left: ${(p) => p.theme.spacing(1)};
  line-height: 1;
  svg,
  img {
    color: ${(p) => p.theme.colors.icon};
  }
  @media print {
    display: none;
  }
`;

const StyledPrimaryActionWrapper = styled.div`
  margin-left: ${(p) => p.theme.spacing(1)};
  ${(p) => p.theme.breakpoints.up("md")} {
    margin-left: ${(p) => p.theme.spacing(4)};
  }
  @media print {
    display: none;
  }
`;

const StyledHeader = styled.div<{
  longTitle?: boolean;
  mediumTitle?: boolean;
  hasBreadcrumbs?: boolean;
}>`
  ${(p) =>
    p.longTitle &&
    css`
      ${p.theme.breakpoints.down("lg")} {
        ${StyledHeaderRow} {
          display: grid;
          gap: ${p.theme.spacing(2, 4)};
          grid-template-columns: auto 1fr;
          grid-template-areas: "breadcrumbs actions" "title title";

          + ${StyledHeaderRow} {
            gap: 0;
          }
        }
      }
    `}
  ${(p) =>
    p.mediumTitle &&
    (p.hasBreadcrumbs
      ? css`
          ${p.theme.breakpoints.down("md")} {
            ${StyledHeaderRow} {
              display: grid;
              gap: ${p.theme.spacing(2, 4)};
              grid-template-columns: auto 1fr;
              grid-template-areas: "breadcrumbs actions" "title title";

              + ${StyledHeaderRow} {
                gap: 0;
              }
            }
          }
        `
      : css`
          ${StyledHeaderRow} {
            flex-wrap: wrap-reverse;
            ${p.theme.breakpoints.up("md")} {
              flex-wrap: nowrap;
            }
          }
        `)}
`;
