import React, { useLayoutEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { TextAlignJustifyIcon } from "@/ui-icons";

import { unstyledButton } from "../../utils/styles";
import { useFrame } from "../Frame/useFrame";
import { Icon } from "../Icon";

import { TOPBAR_SEARCH_VISIBLE_ATTRIBUTE } from "./constant";
import { Menu } from "./Menu";
import { Search, SearchProps } from "./Search";
import { SearchField } from "./SearchField";
import { UserMenu } from "./UserMenu";

export interface TopBarProps {
  /** Hiển thị nút bật tắt điều hướng trên di động */
  showNavigationToggle?: boolean;
  /** Thông tin người dùng */
  userMenu?: React.ReactNode;
  /** Hiển thị các menu như góp ý, thông báo */
  secondaryMenu?: React.ReactNode;
  /** Input tìm kiếm */
  searchField?: React.ReactNode;
  /** Kết quả tìm kiếm */
  searchResults?: React.ReactNode;
  /** Hiển thị kết quả tìm kiếm. */
  searchResultsVisible?: boolean;
  /** Hiển thị backdrop xóa nội dung tìm kiếm và kết quả tìm kiếm */
  searchResultsOverlayVisible?: boolean;
  /** Hàm gọi lại xử lý việc loại bỏ kết quả tìm kiếm  */
  onSearchResultsDismiss?: SearchProps["onDismiss"];
  /** Hàm gọi lại xử lý ẩn và hiển thị điều hướng trên thiết bị di động */
  onNavigationToggle?(): void;
}

/**
 * Là thành phần phía trên cùng cho phép chủ shop tìm kiếm, truy cập menu
 */
export const TopBar: React.FC<TopBarProps> & {
  Menu: typeof Menu;
  SearchField: typeof SearchField;
  UserMenu: typeof UserMenu;
} = ({
  showNavigationToggle,
  onNavigationToggle,
  searchField,
  searchResults,
  searchResultsVisible,
  onSearchResultsDismiss,
  searchResultsOverlayVisible,
  secondaryMenu,
  userMenu,
}: TopBarProps) => {
  const { offset: frameOffset, navigationMinimized, hasNavigation } = useFrame();

  useLayoutEffect(() => {
    if (searchResultsVisible) {
      document.body.setAttribute(TOPBAR_SEARCH_VISIBLE_ATTRIBUTE, "");
    } else {
      document.body.removeAttribute(TOPBAR_SEARCH_VISIBLE_ATTRIBUTE);
    }
  }, [searchResultsVisible]);

  const navigationButtonMarkup = showNavigationToggle ? (
    <StyledNavigationIcon type="button" onClick={onNavigationToggle}>
      <Icon source={TextAlignJustifyIcon} />
    </StyledNavigationIcon>
  ) : null;
  const searchMarkup = searchField ? (
    <StyledSearchField>
      {searchField}
      <Search
        visible={searchResultsVisible}
        onDismiss={onSearchResultsDismiss}
        overlayVisible={searchResultsOverlayVisible}
      >
        {searchResults}
      </Search>
    </StyledSearchField>
  ) : null;

  const secondaryMenuMarkup = secondaryMenu ? <StyledSecondaryMenu>{secondaryMenu}</StyledSecondaryMenu> : null;

  return (
    <StyledTopBar>
      <StyledContainer
        frameOffset={frameOffset}
        navigationMinimized={navigationMinimized}
        hasNavigation={hasNavigation}
      >
        {navigationButtonMarkup}
        <StyledContent>
          {searchMarkup}
          <StyledMenuWrapper>
            {secondaryMenuMarkup}
            {userMenu}
          </StyledMenuWrapper>
        </StyledContent>
      </StyledContainer>
    </StyledTopBar>
  );
};

TopBar.Menu = Menu;
TopBar.UserMenu = UserMenu;
TopBar.SearchField = SearchField;

const StyledTopBar = styled.div`
  position: relative;
  box-shadow: ${(p) => p.theme.shadow.topBar};
  background-color: ${(p) => p.theme.colors.surface};
  transition: ${(p) => p.theme.motion.duration200} background-color ${(p) => p.theme.motion.transformEaseInOut};
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-bottom: ${(p) => p.theme.shape.borderWidth(1)} solid transparent;
  }
`;

const StyledContainer = styled.div<{
  frameOffset?: string;
  hasNavigation?: boolean;
  navigationMinimized?: boolean;
}>`
  display: flex;
  padding: ${(p) => p.theme.spacing(0, 2, 0, 0)};
  height: ${(p) => p.theme.components.topBar.height};

  ${(p) => p.theme.breakpoints.up("sm")} {
    width: calc(100vw - var(--ui-app-provider-scrollbar-width));
  }
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: ${(p) => p.theme.spacing(0, 6, 0, 8)};
  }

  ${(p) =>
    p.hasNavigation &&
    css`
      ${p.theme.breakpoints.up("md")} {
        width: calc(
          100vw - ${p.frameOffset} -
            ${p.navigationMinimized
              ? p.theme.components.navigation.collapsedWidth
              : p.theme.components.navigation.baseWidth} - var(--ui-app-provider-scrollbar-width)
        );
        padding-right: calc(${p.theme.spacing(6)} - var(--ui-app-provider-scrollbar-width));
        .ui-frame-collapse-enter &,
        .ui-frame-collapse-exit & {
          transition: width ${p.theme.motion.duration300} ${p.theme.motion.transformEaseInOut};
        }
      }
    `}
`;

const StyledContent = styled.div`
  z-index: ${(p) => p.theme.zIndex(1)};
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  height: 100%;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing(2)};
  ${(p) => p.theme.breakpoints.up("md")} {
    position: relative;
  }
`;

const StyledMenuWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledNavigationIcon = styled.button`
  ${unstyledButton};
  position: relative;
  align-self: center;
  margin-left: ${(p) => p.theme.spacing(2)};
  margin-right: ${(p) => p.theme.spacing(2)};
  padding: ${(p) => p.theme.spacing(2)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  fill: ${(p) => p.theme.colors.icon};
  transition: ${(p) => p.theme.motion.duration150} fill ${(p) => p.theme.motion.transformEase}
    ${(p) => p.theme.motion.duration50};

  &:active {
    background-color: ${(p) => p.theme.colors.surfacePressed};
  }

  svg {
    color: ${(p) => p.theme.colors.icon};
    fill: ${(p) => p.theme.colors.icon};
  }

  &:hover {
    background-color: ${(p) => p.theme.colors.surfaceHovered};

    svg {
      color: ${(p) => p.theme.colors.iconHovered};
      fill: ${(p) => p.theme.colors.iconHovered};
    }
  }
  &::after {
    content: "";
    position: absolute;
    top: calc(-1 * ${(p) => p.theme.spacing(2)});
    left: calc(-1 * ${(p) => p.theme.spacing(2)});
    width: calc(100% + ${(p) => p.theme.spacing(5)});
    height: calc(100% + ${(p) => p.theme.spacing(5)});
  }
  ${(p) => p.theme.breakpoints.up("md")} {
    display: none;
  }
  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledSearchField = styled.div`
  position: relative;
  width: 100%;
  margin: 0;
  max-width: ${(p) => p.theme.components.topBar.searchMaxWidth};
`;

const StyledSecondaryMenu = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
  svg {
    color: ${(p) => p.theme.colors.icon};
    fill: ${(p) => p.theme.colors.icon};
  }
  & > button {
    margin: 0;
    &:hover {
      background: ${(p) => p.theme.colors.actionSecondaryHovered};
    }
    &[data-state="open"],
    &:active {
      background: ${(p) => p.theme.colors.actionSecondaryPressed};
    }
  }
`;
