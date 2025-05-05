import React, { useMemo } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowChevronLeftIcon, ArrowChevronRightIcon } from "@/ui-icons";

import { unstyledButton } from "../../utils/styles";
import { useFrame } from "../Frame/useFrame";
import { Icon } from "../Icon";
import { Scrollable } from "../Scrollable";
import { UnstyledLink } from "../UnstyledLink";

import { NavigationContext } from "./NavigationContext";
import { Section } from "./Section";

// TODO: tabindex

export interface NavigationProps {
  /** Đường dẫn hiện tại */
  location: string;
  /** Label hỗ trợ của thanh điều hướng */
  ariaLabelledBy?: string;
  /** context control của thanh điều hướng */
  contextControl?: React.ReactNode;
  /** Nội dung của thanh điều hướng */
  children?: React.ReactNode;
}

/**
 * Menu sidebar điều hướng trang
 */
export const Navigation: React.FC<NavigationProps> & {
  Section: typeof Section;
} = ({ children, location, contextControl, ariaLabelledBy }: NavigationProps) => {
  const { logo, navigationCollapseAction: collapseAction, onNavigationDismiss } = useFrame();
  const width = logo?.width || 104;
  const collapsed = collapseAction && collapseAction.collapsed;

  const logoMarkup = logo ? (
    <StyledLogoContainer>
      <StyledLink url={logo.url ?? ""} style={{ width }}>
        <StyledLogo src={logo.source || ""} alt={logo.accessibilityLabel || ""} style={{ width }} />
      </StyledLink>
    </StyledLogoContainer>
  ) : null;

  const mediaMarkup = contextControl ? <StyledContextControl>{contextControl}</StyledContextControl> : logoMarkup;

  const collapseActionMarkup = collapseAction ? (
    <StyledButtonCollapsed onClick={collapseAction.onToggle}>
      <Icon source={collapseAction.collapsed ? ArrowChevronRightIcon : ArrowChevronLeftIcon} />
    </StyledButtonCollapsed>
  ) : null;

  const context = useMemo(
    () => ({
      location,
      collapsed,
      onNavigationMobileDismiss: onNavigationDismiss,
    }),
    [location, collapsed, onNavigationDismiss]
  );

  return (
    <NavigationContext.Provider value={context}>
      <StyledNavigation aria-labelledby={ariaLabelledBy} collapsed={collapsed}>
        {mediaMarkup ? (
          <StyledContextControlWrapper collapsed={collapsed}>
            {mediaMarkup}
            {collapseActionMarkup}
          </StyledContextControlWrapper>
        ) : null}
        <StyledPrimaryNavigation horizontal={false}>{children}</StyledPrimaryNavigation>
      </StyledNavigation>
    </NavigationContext.Provider>
  );
};

Navigation.Section = Section;

const StyledNavigation = styled.nav<{ collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: width ${(p) => p.theme.motion.duration300} ${(p) => p.theme.motion.transformEaseInOut};
  width: ${(p) =>
    p.collapsed ? p.theme.components.navigation.collapsedWidth : p.theme.components.navigation.baseWidth};
  max-width: ${(p) => p.theme.components.navigation.baseWidth};
  height: 100%;
  min-height: 100%;
  background-color: ${(p) => p.theme.components.navigation.backgroundColor};
  box-shadow: inset
    ${(p) => `-${p.theme.shape.borderWidth(1)} 0px 0px 0px ${p.theme.components.navigation.dividerColor}`};
  padding-bottom: 0;
  ${(p) => p.theme.breakpoints.up("md")} {
    max-width: ${(p) => p.theme.components.navigation.baseWidth};
  }
`;

const StyledPrimaryNavigation = styled(Scrollable)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  max-width: 100%;
  &:focus {
    outline: none;
  }

  scrollbar-color: ${({
    theme: {
      components: { navigation },
    },
  }) => `${navigation.backgroundPressedColor} ${navigation.backgroundColor}`};

  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.components.navigation.backgroundColor};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(p) => p.theme.components.navigation.backgroundPressedColor};
  }
`;

const StyledContextControl = styled.div``;

const StyledButtonCollapsed = styled.button`
  ${unstyledButton}
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.surface};
  padding: ${(p) => p.theme.spacing(1)} calc(${(p) => p.theme.spacing(2)} - ${(p) => p.theme.spacing(0.5)});
  height: ${(p) => p.theme.components.navigation.mobileHeight};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};

  svg {
    color: ${(p) => p.theme.components.navigation.iconColor};
    fill: ${(p) => p.theme.components.navigation.iconColor};
  }

  &:hover,
  &:focus,
  &:active {
    svg {
      color: ${(p) => p.theme.components.navigation.iconSelectedColor};
      fill: ${(p) => p.theme.components.navigation.iconSelectedColor};
    }
  }

  &:active {
    background: ${(p) => p.theme.components.navigation.backgroundPressedColor};
  }

  &:focus,
  &:active {
    outline: none;
  }

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledLink = styled(UnstyledLink)`
  display: block;
`;

const StyledLogo = styled.img`
  display: block;
`;

const StyledLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledContextControlWrapper = styled.div<{ collapsed?: boolean }>`
  border-bottom: ${(p) => `${p.theme.shape.borderWidth(1)} solid ${p.theme.components.navigation.dividerColor}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing(0, 2)};
  width: 100%;
  overflow: hidden;
  &,
  ${StyledLogoContainer}, ${StyledContextControl} {
    min-height: ${(p) => p.theme.components.topBar.height};
  }
  ${(p) =>
    p.collapsed &&
    css`
      ${StyledContextControl},
      ${StyledLogoContainer},
      ${StyledLink} {
        overflow: hidden;
      }
    `}
`;
