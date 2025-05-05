import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { autoPlacement, autoUpdate, useFloating, useHover, useInteractions } from "@floating-ui/react";
import { MoreHorizontalIcon } from "@/ui-icons";

import { Theme } from "../../themes/types";
import { unstyledButton } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { useBreakpoints } from "../../utils/useBreakpoints";
import { Badge } from "../Badge";
import { Icon, IconProps } from "../Icon";
import { Tooltip, TooltipProps } from "../Tooltip";
import { UnstyledLink } from "../UnstyledLink";

import { safeEqual, safeStartsWith } from "./utils/url";
import { NavigationContext } from "./NavigationContext";
import { Secondary } from "./Secondary";

interface ItemURLDetails {
  /** Url của item được dùng để xác định việc item match với location hiện tại */
  url?: string;
  /** item có mặc đinh match với location hiện tại */
  matches?: boolean;
  /** Sử dụng exact match khi matching item */
  exactMatch?: boolean;
  /** Danh sách các path sẽ được include khi matching item */
  matchPaths?: string[];
  /** Danh sách các path sẽ được exclude khi matching item */
  excludePaths?: string[];
  /** Đánh dấu external link, mở new tab */
  external?: boolean;
}

interface SecondaryAction {
  /** Icon của hành động */
  icon: IconProps["source"];
  /** label hỗ trợ của hành động */
  accessibilityLabel?: string;
  /** tooltip của hành động */
  tooltip?: TooltipProps;
  /** external url của hành động */
  url?: string;
  /** Callback khi hành động click */
  onClick?(): void;
}

interface SubNavigationItem extends ItemURLDetails {
  /** Tên item */
  label: string;
  /** Item có bị disable */
  disabled?: boolean;
  /** Callback khi item được click */
  onClick?(): void;
}

export interface ItemProps extends ItemURLDetails {
  /** Tên item */
  label: string;
  /** Item có được chọn mặc định */
  selected?: boolean;
  /** Item có bị disable */
  disabled?: boolean;
  /** Cho phép truncate tên item */
  truncateText?: boolean;
  /** Icon của item */
  icon?: IconProps["source"];
  /** Badge của item */
  badge?: React.ReactNode;
  /** Danh sách các hành động bên phải của item */
  secondaryActions?: SecondaryAction[];
  /** Danh sách item con */
  subNavigationItems?: SubNavigationItem[];
  /** label hỗ trợ của item */
  accessibilityLabel?: string;
  /** Callback khi item được click */
  onClick?(): void;
}

interface OwnProps {
  secondary?: boolean;
  expanded?: boolean;
  onToggleExpand?(): void;
}

type ItemCombinedProps = ItemProps & OwnProps;

enum MatchState {
  MatchForced,
  MatchUrl,
  MatchPaths,
  Excluded,
  NoMatch,
}

const TOOLTIP_HOVER_DELAY = 1000;

export function Item({
  label,
  icon,
  badge,
  selected: selectedOverride,
  secondary,
  expanded,
  subNavigationItems = [],
  secondaryActions = [],
  truncateText,
  disabled,
  url,
  external,
  matches,
  matchPaths,
  excludePaths,
  exactMatch,
  accessibilityLabel,
  onClick,
  onToggleExpand,
}: ItemCombinedProps) {
  const { mdDown: isNavigationCollapsed } = useBreakpoints();
  const secondaryNavigationId = useUniqueId("SecondaryNavigation");
  const { location, collapsed: navigationCollapsed, onNavigationMobileDismiss } = useContext(NavigationContext);
  const navTextRef = useRef<HTMLSpanElement>(null);
  const collapsed = navigationCollapsed && !secondary;

  const [isHoverred, setHoverred] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isHoverred,
    onOpenChange: setHoverred,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement({
        allowedPlacements: ["right-start"],
      }),
    ],
  });

  const hover = useHover(context, {
    enabled: collapsed,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  useLayoutEffect(() => {
    const navTextNode = navTextRef.current;
    if (truncateText && navTextNode) {
      setIsTruncated(navTextNode.scrollHeight > navTextNode.clientHeight);
    }
  }, [truncateText]);

  const iconMarkup = icon ? (
    <StyledItemIcon>
      <Icon source={icon} />
    </StyledItemIcon>
  ) : null;

  const badgeMarkup =
    typeof badge === "string" ? (
      <Badge size="small" status="plain">
        {badge}
      </Badge>
    ) : badge ? (
      badge
    ) : null;

  const wrappedBadgeMarkup = badgeMarkup ? <StyledItemBadge>{badgeMarkup}</StyledItemBadge> : null;

  const secondaryActionMarkup = secondaryActions.length ? (
    <StyledSecondaryActions>
      {secondaryActions.map((action, index) => (
        <ItemSecondaryAction key={action.accessibilityLabel || index} disabled={disabled} {...action} />
      ))}
    </StyledSecondaryActions>
  ) : null;

  const itemContentMarkup = (
    <>
      {iconMarkup}
      <StyledItemText truncated={truncateText} ref={navTextRef}>
        {label}
      </StyledItemText>
      {secondaryActionMarkup ? null : wrappedBadgeMarkup}
    </>
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const { currentTarget } = event;

    if (currentTarget.getAttribute("href") === location) {
      event.preventDefault();
    }

    if (subNavigationItems.length > 0 && isNavigationCollapsed) {
      event.preventDefault();
      onToggleExpand?.();
    } else if (onNavigationMobileDismiss) {
      onNavigationMobileDismiss();
      if (onClick && onClick !== onNavigationMobileDismiss) {
        onClick();
      }
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  const outerContentMarkup = secondaryActionMarkup ? <>{wrappedBadgeMarkup}</> : null;

  const matchState = matchStateForItem({ url, matches, exactMatch, matchPaths, excludePaths }, location);

  const matchingSubNavigationItems = subNavigationItems.filter((item) => {
    const subMatchState = matchStateForItem(item, location);
    return (
      subMatchState === MatchState.MatchForced ||
      subMatchState === MatchState.MatchUrl ||
      subMatchState === MatchState.MatchPaths
    );
  });

  const childIsActive = matchingSubNavigationItems.length > 0;

  const selected =
    selectedOverride === undefined
      ? matchState === MatchState.MatchForced ||
        matchState === MatchState.MatchUrl ||
        matchState === MatchState.MatchPaths
      : selectedOverride;

  const showExpanded = selected || !!expanded || childIsActive || Boolean(collapsed);

  const canBeActive = subNavigationItems.length === 0 || !childIsActive;

  const linkMarkup = (
    <StyledItem
      url={!disabled ? url : undefined}
      external={external}
      selected={(selected && canBeActive) || childIsActive}
      disabled={disabled}
      onClick={handleClick}
      secondary={secondary}
      aria-selected={selected || childIsActive}
      aria-label={accessibilityLabel || label}
      aria-disabled={disabled}
      aria-expanded={expanded}
    >
      {itemContentMarkup}
    </StyledItem>
  );

  const itemLinkMarkup = isTruncated ? (
    <Tooltip hoverDelay={TOOLTIP_HOVER_DELAY} content={label} preferredPosition="above">
      {linkMarkup}
    </Tooltip>
  ) : (
    linkMarkup
  );

  const secondaryNavigationMarkup = subNavigationItems.length
    ? subNavigationItems.map((item) => {
        const { label, disabled: subItemDisabled, ...rest } = item;
        const isDisabled = subItemDisabled || disabled;
        return <Item key={label} {...rest} label={label} secondary disabled={isDisabled} truncateText={truncateText} />;
      })
    : null;

  return (
    <StyledListItem
      ref={refs.setReference}
      selected={(selected && canBeActive) || childIsActive}
      {...getReferenceProps()}
    >
      <StyledItemWrapper collapsed={collapsed}>
        <StyledItemInnerWrapper
          hasActions={secondaryActionMarkup !== null}
          disabled={disabled}
          hoverWhenCollapsed={collapsed && isHoverred && !((selected && canBeActive) || childIsActive)}
        >
          {itemLinkMarkup}
          {secondaryActionMarkup}
          {outerContentMarkup}
        </StyledItemInnerWrapper>
      </StyledItemWrapper>
      {collapsed && (
        <StyledCollapsedWrapper
          active={isHoverred}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <StyledItemWrapper>
            <StyledItemInnerWrapper hasActions={secondaryActionMarkup !== null} disabled={disabled}>
              {itemLinkMarkup}
              {secondaryActionMarkup}
              {outerContentMarkup}
            </StyledItemInnerWrapper>
          </StyledItemWrapper>
          {subNavigationItems.length > 0 && (
            <StyledSecondaryNavigation>
              <Secondary expanded id={secondaryNavigationId}>
                {secondaryNavigationMarkup}
              </Secondary>
            </StyledSecondaryNavigation>
          )}
        </StyledCollapsedWrapper>
      )}
      {subNavigationItems.length > 0 && (
        <StyledSecondaryNavigation>
          <Secondary expanded={!collapsed && showExpanded} id={secondaryNavigationId}>
            {secondaryNavigationMarkup}
          </Secondary>
        </StyledSecondaryNavigation>
      )}
    </StyledListItem>
  );
}

interface ToggleRollupItemProps {
  accessibilityLabel?: string;
  onClick?(): void;
}

export const ToggleRollupItem = ({ onClick, accessibilityLabel }: ToggleRollupItemProps) => (
  <StyledListItem key="List Item" as="div">
    <StyledItemWrapper>
      <StyledItemInnerWrapper>
        <StyledRollupToggle onClick={onClick} aria-label={accessibilityLabel}>
          <StyledItemIcon>
            <Icon source={MoreHorizontalIcon} />
          </StyledItemIcon>
        </StyledRollupToggle>
      </StyledItemInnerWrapper>
    </StyledItemWrapper>
  </StyledListItem>
);

interface ItemSecondaryActionProps extends SecondaryAction {
  disabled?: boolean;
}

export function ItemSecondaryAction({
  url,
  icon,
  accessibilityLabel,
  tooltip,
  onClick,
  disabled,
}: ItemSecondaryActionProps) {
  const markup = url ? (
    <StyledItemSecondaryActionLink
      external
      url={url}
      aria-disabled={disabled}
      aria-label={accessibilityLabel}
      onClick={onClick}
    >
      <Icon source={icon} />
    </StyledItemSecondaryActionLink>
  ) : (
    <StyledItemSecondaryActionButton onClick={onClick} disabled={disabled} aria-label={accessibilityLabel}>
      <Icon source={icon} />
    </StyledItemSecondaryActionButton>
  );

  return tooltip ? <Tooltip {...tooltip}> {markup} </Tooltip> : markup;
}

function matchStateForItem({ url, matches, exactMatch, matchPaths, excludePaths }: ItemURLDetails, location: string) {
  if (!url) {
    return MatchState.NoMatch;
  }

  if (matches) {
    return MatchState.MatchForced;
  }

  if (matches === false || (excludePaths && excludePaths.some((path) => safeStartsWith(location, path)))) {
    return MatchState.Excluded;
  }

  if (matchPaths && matchPaths.some((path) => safeStartsWith(location, path))) {
    return MatchState.MatchPaths;
  }

  const matchesUrl = exactMatch ? safeEqual(location, url) : safeStartsWith(location, url);
  return matchesUrl ? MatchState.MatchUrl : MatchState.NoMatch;
}

const StyledItemText = styled.span<{
  truncated?: boolean;
}>`
  flex: 1 1 auto;
  font-size: ${(p) => p.theme.typography.fontSize100};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  line-height: ${(p) => p.theme.spacing(5)};
  margin-left: ${(p) => p.theme.spacing(1)};
  ${(p) =>
    p.truncated &&
    css`
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
    `}
`;

const StyledItemIcon = styled.div`
  color: ${(p) => p.theme.components.navigation.iconColor};
  flex-shrink: 0;
  align-self: flex-start;
  width: ${(p) => p.theme.spacing(5)};
  height: ${(p) => p.theme.spacing(5)};
  margin-right: ${(p) => p.theme.spacing(2)};
  & > span {
    width: 100%;
    height: 100%;
  }
`;

const StyledItemBadge = styled.div`
  display: flex;
  height: auto;
  align-items: center;
  margin-left: ${(p) => p.theme.spacing(1)};
`;

const StyledItemWrapper = styled.div<{
  collapsed?: boolean;
}>`
  padding: ${(p) => p.theme.spacing(0, 3)};
  width: ${(p) => p.theme.components.navigation.baseWidth};
  flex-shrink: 0;
  ${(p) =>
    p.collapsed &&
    css`
      padding: ${p.theme.spacing(0, 2, 0, 2)};
      width: ${p.theme.components.navigation.collapsedWidth};

      ${StyledItemText}, ${StyledSecondaryActions}, ${StyledItemBadge} {
        display: none;
      }
    `}
`;

//TODO: handle link, button separate
const StyledItem = styled(UnstyledLink, {
  shouldForwardProp: (prop) => !["selected", "secondary", "disabled"].includes(prop),
})<{
  selected?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}>`
  ${unstyledButton}
  font-size: ${(p) => p.theme.typography.fontSize200};
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  line-height: ${(p) => p.theme.spacing(8)};
  font-family: ${(p) => p.theme.typography.fontFamilySans};
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  max-width: 100%;
  padding: ${(p) =>
    `calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}) calc(${p.theme.spacing(1)} + ${p.theme.spacing(
      0.5
    )}) calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}) ${p.theme.spacing(2)}`};
  margin: 0;
  color: ${(p) => p.theme.components.navigation.textColor};
  text-decoration: none;
  text-align: left;
  min-height: ${(p) => p.theme.spacing(8)};

  &:active,
  &:active:hover {
    background-color: ${(p) => p.theme.components.navigation.backgroundPressedColor};
  }

  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize200};
    font-weight: ${(p) => p.theme.typography.fontWeightRegular};
    line-height: ${(p) => p.theme.typography.fontLineHeight5};
    padding-left: calc(${(p) => `${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}`});
  }

  position: relative;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};

  &:is(:hover, :focus-visible, :focus) {
    color: ${(p) => p.theme.components.navigation.textColor};
    text-decoration: none;
    background: ${(p) => p.theme.components.navigation.backgroundHoveredColor};
    ${StyledItemIcon} {
      color: ${(p) => p.theme.components.navigation.iconSelectedColor};
    }
  }
  ${(p) =>
    p.selected &&
    !p.secondary &&
    css`
      &,
      &:active,
      &:active:hover,
      &:is(:hover, :focus-visible) {
        background: ${p.theme.components.navigation.backgroundSelectedColor};
        ${StyledItemIcon} {
          color: ${p.theme.components.navigation.iconSelectedColor};
        }
      }
    `}
  ${(p) =>
    p.selected &&
    p.secondary &&
    css`
      &,
      &:is(:hover, :focus-visible, :focus) {
        color: ${p.theme.components.navigation.textSecondarySelectedColor};
      }
    `}
    ${(p) =>
    p.disabled &&
    css`
      &,
      &:active,
      &:active:hover,
      &:is(:hover, :focus-visible) {
        background: transparent;
      }
      color: ${p.theme.components.navigation.textDisabledColor};
      ${StyledItemIcon} {
        color: ${p.theme.components.navigation.textDisabledColor};
      }
    `}

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledItemInnerWrapper = styled.div<{
  hasActions?: boolean;
  disabled?: boolean;
  hoverWhenCollapsed?: boolean;
}>`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  ${(p) =>
    p.hasActions &&
    css`
      ${StyledItemBadge} {
        margin-right: ${p.theme.spacing(1)};
        margin-left: 0;
      }
    `}
  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
    `}
  ${(p) =>
    !p.disabled &&
    p.hoverWhenCollapsed &&
    css`
      ${StyledItem} {
        color: ${p.theme.components.navigation.textColor};
        background: ${p.theme.components.navigation.backgroundHoveredColor};
        ${StyledItemIcon} {
          color: ${p.theme.components.navigation.iconSelectedColor};
        }
      }
    `}
`;

const StyledSecondaryNavigation = styled.div`
  flex-basis: 100%;
  margin-left: 0;
  overflow-x: visible;
  ${StyledItemWrapper} {
    padding: ${(p) => p.theme.spacing(1, 3, 0)};
  }
  ${StyledItem} {
    font-size: ${(p) => p.theme.typography.fontSize100};
    font-weight: ${(p) => p.theme.typography.fontWeightRegular};
    line-height: ${(p) => p.theme.spacing(8)};
    padding-left: calc(${(p) => `${p.theme.spacing(8)} + ${p.theme.spacing(0.5)}`});
  }

  ${StyledItemText} {
    line-height: ${(p) => p.theme.spacing(5)};
  }
`;

const StyledSecondaryActions = styled.span`
  display: flex;
  height: ${(p) => p.theme.components.navigation.mobileHeight};

  ${(p) => p.theme.breakpoints.up("md")} {
    height: ${(p) => p.theme.components.navigation.desktopHeight};
  }
`;

const itemSecondaryActionStyle = (theme: Theme) => css`
  ${unstyledButton}
  display: flex;
  align-items: center;
  padding: calc((${theme.components.navigation.desktopHeight} - ${theme.spacing(5)}) / 2)
    calc((${theme.components.navigation.desktopHeight} - ${theme.spacing(5)}) / 2);
  border-radius: ${theme.shape.borderRadius("base")};

  svg {
    color: ${theme.components.navigation.iconColor};
    fill: ${theme.components.navigation.iconColor};
  }

  &:hover,
  &:focus,
  &:active {
    svg {
      color: ${theme.components.navigation.iconSelectedColor};
      fill: ${theme.components.navigation.iconSelectedColor};
    }
  }

  &:active {
    background: ${theme.components.navigation.backgroundPressedColor};
  }

  &:focus,
  &:active {
    outline: none;
  }

  &:focus-visible {
    outline: ${theme.shape.borderWidth(2)} solid ${theme.colors.borderInteractiveFocus};
    outline-offset: calc(-1 * ${theme.spacing(0.5)});
  }
`;

const StyledItemSecondaryActionButton = styled.button`
  ${(p) => itemSecondaryActionStyle(p.theme)}
`;

const StyledItemSecondaryActionLink = styled(UnstyledLink)`
  ${(p) => itemSecondaryActionStyle(p.theme)}
`;

const StyledCollapsedWrapper = styled.div<{
  active: boolean;
}>`
  display: ${(p) => (p.active ? "block" : "none")};
  background-color: ${(p) => p.theme.components.navigation.backgroundColor};
  border-radius: 0px calc(${(p) => `${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}`})
    calc(${(p) => `${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}`}) 0px;
  overflow: hidden;
  width: calc(
    ${(p) => p.theme.components.navigation.mobileWidth} - ${(p) => p.theme.components.navigation.collapsedWidth}
  );
  min-width: calc(
    ${(p) => p.theme.components.navigation.baseWidth} - ${(p) => p.theme.components.navigation.collapsedWidth}
  );
  max-width: ${(p) => p.theme.components.navigation.maxWidth};
  ${(p) => p.theme.breakpoints.up("md")} {
    max-width: ${(p) => p.theme.components.navigation.baseWidth};
  }
  > ${StyledItemWrapper} {
    padding: 0;
    ${StyledItem} {
      pointer-events: none;
    }
  }
  ${StyledItemIcon} {
    display: none;
  }
  ${StyledItem} {
    padding: ${(p) =>
      `calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}) ${p.theme.spacing(2)} calc(${p.theme.spacing(
        2
      )} - ${p.theme.spacing(0.5)}) ${p.theme.spacing(3)}`};
    border-radius: 0;
  }
  ${StyledSecondaryNavigation} {
    padding-bottom: 0;
    padding-top: ${(p) => p.theme.spacing(1)};
    ${StyledItemWrapper} {
      padding: ${(p) =>
        `${p.theme.spacing(1)} calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}) ${p.theme.spacing(0)}`};
    }
    ${StyledItem} {
      padding: ${(p) => `calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.5)})`};
      border-radius: calc(${(p) => `${p.theme.spacing(2)} - ${p.theme.spacing(0.5)}`});
    }
  }
`;

const StyledListItem = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  ${(p) => p.theme.breakpoints.up("lg")} {
    &:hover {
      ${(p) =>
        !p.selected &&
        css`
          ${StyledCollapsedWrapper} {
            > ${StyledItemWrapper} {
              ${StyledItem} {
                background: ${p.theme.components.navigation.backgroundHoveredColor};
                ${StyledItemIcon} {
                  color: ${p.theme.components.navigation.iconSelectedColor};
                }
              }
            }
          }
        `}
    }
  }
`;

const StyledRollupToggle = styled(StyledItem)`
  ${StyledItemIcon} {
    margin-right: ${(p) => p.theme.spacing(1)};
  }
`;
