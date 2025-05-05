import React, { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { dataUITopBar, layer } from "../../utils/shared";
import { useBreakpoints } from "../../utils/useBreakpoints";
import { Backdrop } from "../Backdrop";
import { TOPBAR_SEARCH_VISIBLE_ATTRIBUTE } from "../TopBar/constant";
import { TrapFocus } from "../TrapFocus";

import { FrameContext, FrameContextType, WithinContentTopBarContext } from "./context";
import { ContextualSaveBar, ContextualSaveBarProps } from "./ContextualSaveBar";
import { Loading } from "./Loading";
import { ToastID, ToastManager, ToastPropsWithID } from "./ToastManager";
import { Logo, NavigationCollapseAction } from "./types";

const APP_FRAME_MAIN = "AppFrameMain";
const APP_FRAME_NAV = "AppFrameNav";
const APP_FRAME_TOP_BAR = "AppFrameTopBar";
const APP_FRAME_LOADING_BAR = "AppFrameLoadingBar";

export interface FrameProps {
  /** Đặt logo cho navigation */
  logo?: Logo;
  /** Nội dung trong Frame */
  children?: React.ReactNode;
  /** Giá trị offset để dịch frame theo chiều ngang, được sử dụng để tạo khoảng trống sang bên trái frame */
  offset?: string;
  /** Top bar component sẽ được hiển thị phía trên cùng của ứng dụng */
  topBar?: React.ReactNode;
  /** Navigation menu sidebar bên trái để điều hướng trang */
  navigation?: React.ReactNode;
  /** Giá trị xác định navigation có đang hiển thị trên mobile */
  showMobileNavigation?: boolean;
  /** Callback xử lý ẩn Navigation trên thiết bị di động */
  onNavigationDismiss?(): void;
  /** Action dùng để collapse Navigation */
  navigationCollapseAction?: NavigationCollapseAction;
}

/**
 * Bản thân Frame component không được hiển thị mà có vai trò cấu trúc lên ứng dụng, là nơi chứa các component khác như Navigation, TopBar, Toast, ContextualSaveBar
 */
export function Frame({
  children,
  topBar,
  navigation,
  offset = "0px",
  logo,
  showMobileNavigation,
  onNavigationDismiss,
  navigationCollapseAction: navigationCollapseActionProp,
}: FrameProps) {
  const [loadingStack, setLoadingStack] = useState<number>(0);
  const [toastMessages, setToastMessages] = useState<ToastPropsWithID[]>([]);
  const [showContextualSaveBar, setShowContextualSaveBar] = useState<boolean>(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contextualSaveBarRef = useRef<ContextualSaveBarProps | undefined>(undefined);
  const contextualSaveBarNodeRef = useRef<HTMLDivElement>(null);
  const { mdDown: isNavigationMobileMode } = useBreakpoints();

  const mobileNavHidden = isNavigationMobileMode && !showMobileNavigation;
  const mobileNavShowing = isNavigationMobileMode && showMobileNavigation;
  const navigationCollapseAction =
    !isNavigationMobileMode && navigationCollapseActionProp ? navigationCollapseActionProp : undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const startLoading = useCallback(() => {
    setLoadingStack((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingStack((prev) => Math.max(0, prev - 1));
  }, []);

  const showToast = useCallback((toast: ToastPropsWithID) => {
    setToastMessages((currentToasts) => {
      const hasToastById = currentToasts.find(({ id }) => id === toast.id);
      return hasToastById ? currentToasts : [...currentToasts, toast];
    });
  }, []);

  const hideToast = useCallback(({ id }: ToastID) => {
    setToastMessages((currentToasts) => currentToasts.filter(({ id: toastId }) => id !== toastId));
  }, []);

  const setContextualSaveBar = useCallback(
    (props: ContextualSaveBarProps) => {
      contextualSaveBarRef.current = props;
      if (showContextualSaveBar) {
        forceUpdate();
      } else {
        setShowContextualSaveBar(true);
      }
    },
    [showContextualSaveBar]
  );

  const removeContextualSaveBar = useCallback(() => {
    contextualSaveBarRef.current = undefined;
    setShowContextualSaveBar(false);
  }, []);

  const navigationMinimized = navigationCollapseAction?.collapsed;
  const hasNavigation = !!navigation;

  const context = useMemo(
    (): FrameContextType => ({
      logo,
      startLoading,
      stopLoading,
      showToast,
      hideToast,
      setContextualSaveBar,
      removeContextualSaveBar,
      navigationCollapseAction,
      onNavigationDismiss,
      navigationMinimized,
      hasNavigation,
      offset,
    }),
    [
      logo,
      startLoading,
      stopLoading,
      showToast,
      hideToast,
      setContextualSaveBar,
      removeContextualSaveBar,
      navigationCollapseAction,
      onNavigationDismiss,
      navigationMinimized,
      hasNavigation,
      offset,
    ]
  );

  const navigationMarkup = navigation ? (
    <TrapFocus trapping={mobileNavShowing}>
      <StyledNavigation key="NavContent" ref={navigationRef} id={APP_FRAME_NAV} hidden={mobileNavHidden}>
        {navigation}
      </StyledNavigation>
    </TrapFocus>
  ) : null;

  const navigationOverlayMarkup = mobileNavShowing ? <Backdrop belowNavigation onClick={onNavigationDismiss} /> : null;

  const topBarMarkup = topBar ? (
    <StyledTopBar id={APP_FRAME_TOP_BAR} {...dataUITopBar.props} {...layer.props}>
      {topBar}
    </StyledTopBar>
  ) : null;

  const contextualSaveBarMarkup = (
    <StyledFadeUp nodeRef={contextualSaveBarNodeRef} timeout={200} in={showContextualSaveBar} classNames="fade">
      <StyledContextualSaveBar ref={contextualSaveBarNodeRef}>
        {contextualSaveBarRef.current ? <ContextualSaveBar {...contextualSaveBarRef.current} /> : null}
      </StyledContextualSaveBar>
    </StyledFadeUp>
  );

  const loadingMarkup =
    loadingStack > 0 ? (
      <StyledLoadingBar id={APP_FRAME_LOADING_BAR}>
        <Loading />
      </StyledLoadingBar>
    ) : null;

  const toastManagerMarkup = <ToastManager toastMessages={toastMessages} />;

  return (
    <FrameContext.Provider value={context}>
      <CSSTransition
        nodeRef={frameRef}
        timeout={300}
        classNames="ui-frame-collapse"
        in={navigationCollapseAction?.collapsed}
      >
        <StyledFrame
          hasNav={!!navigation}
          hasNavCollapsed={navigationCollapseAction?.collapsed}
          hasTopBar={!!topBar}
          $offset={offset}
          ref={frameRef}
          {...layer.props}
        >
          {topBarMarkup}
          {navigationMarkup}
          {contextualSaveBarMarkup}
          {loadingMarkup}
          {toastManagerMarkup}
          {navigationOverlayMarkup}
          <WithinContentTopBarContext.Provider value={!!topBar}>
            <StyledMain id={APP_FRAME_MAIN}>
              <StyledContent>{children}</StyledContent>
            </StyledMain>
          </WithinContentTopBarContext.Provider>
        </StyledFrame>
      </CSSTransition>
    </FrameContext.Provider>
  );
}

const StyledTopBar = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.topBar};
  top: 0;
  left: 0;
  width: 100%;
  height: ${(p) => p.theme.components.topBar.height};
  @media print {
    display: none !important;
  }
`;

const StyledNavigation = styled.div<{
  hidden?: boolean;
}>`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.navigation};
  top: 0;
  left: 0;
  display: ${(p) => (p.hidden ? "none" : "flex")};
  flex: 0 0 auto;
  align-items: stretch;
  height: 100%;
  outline: none;

  @media print {
    display: none !important;
  }

  ${(p) => p.theme.breakpoints.up("md")} {
    display: flex;
    [${TOPBAR_SEARCH_VISIBLE_ATTRIBUTE}] & {
      z-index: 1;
    }
  }

  &:focus {
    outline: none;
  }
`;

const StyledLoadingBar = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.loadingBar};
  top: 0;
  right: 0;
  left: 0;
  @media print {
    display: none !important;
  }
`;

const StyledMain = styled.main`
  flex: 1;
  display: flex;
  align-items: stretch;
  min-width: 0;

  ${(p) => p.theme.breakpoints.up("sm")} {
    max-width: calc(100vw - var(--ui-app-provider-scrollbar-width));
  }
`;

const StyledContent = styled.div`
  position: relative;
  flex: 1 1;
  min-width: 0;
  max-width: 100%;
`;

const StyledContextualSaveBar = styled.div`
  position: fixed;
  z-index: ${(p) => p.theme.zIndex.contextualSaveBar};
  top: 0;
  left: 0;
  width: 100%;
  @media print {
    display: none !important;
  }
`;

const StyledFadeUp = styled(CSSTransition)`
  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity ${(p) => p.theme.motion.duration200} ease;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity ${(p) => p.theme.motion.duration200} ease;
  }
`;

const StyledFrame = styled.div<{
  hasNav: boolean;
  hasTopBar: boolean;
  hasNavCollapsed?: boolean;
  $offset: string;
}>`
  width: 100%;
  min-height: 100vh;
  min-height: 100svh; /* For mobile browsers, fill the screen taking into account dynamic browser chrome */
  display: flex;
  background-color: ${(p) => p.theme.colors.background};
  @media print {
    background-color: transparent;
  }

  ${(p) => p.theme.breakpoints.up("md")} {
    width: calc(100% - ${(p) => p.$offset});
    margin-left: ${(p) => p.$offset};
  }

  ${(p) =>
    p.hasTopBar &&
    css`
      ${p.theme.breakpoints.up("md")} {
        ${StyledNavigation} {
          top: 0;
          height: 100%;
        }
      }
      ${StyledMain} {
        padding-top: ${p.theme.components.topBar.height};
        @media print {
          padding-top: 0;
        }
      }
      ${StyledLoadingBar} {
        top: ${p.theme.components.topBar.height};
      }
    `}

  ${(p) => p.theme.breakpoints.up("md")} {
    ${StyledNavigation},
    ${StyledTopBar},
    ${StyledContextualSaveBar} {
      left: ${(p) => p.$offset};
    }

    ${StyledTopBar},
    ${StyledContextualSaveBar} {
      width: calc(100% - ${(p) => p.$offset});
    }
  }

  ${(p) =>
    p.hasNav &&
    css`
      ${p.theme.breakpoints.up("md")} {
        ${StyledTopBar},
        ${StyledContextualSaveBar},
        ${StyledLoadingBar} {
          left: calc(
            ${p.$offset} +
              ${p.hasNavCollapsed
                ? p.theme.components.navigation.collapsedWidth
                : p.theme.components.navigation.baseWidth}
          );
          width: calc(
            100% - ${p.$offset} -
              ${p.hasNavCollapsed
                ? p.theme.components.navigation.collapsedWidth
                : p.theme.components.navigation.baseWidth}
          );
        }
        ${StyledMain} {
          padding-left: ${p.hasNavCollapsed
            ? p.theme.components.navigation.collapsedWidth
            : p.theme.components.navigation.baseWidth};
          @media print {
            padding-left: 0;
          }
        }
        &.ui-frame-collapse-enter,
        &.ui-frame-collapse-exit {
          ${StyledMain} {
            transition: padding-left ${p.theme.motion.duration300} ${p.theme.motion.transformEaseInOut};
          }
          ${StyledTopBar},
          ${StyledContextualSaveBar},
          ${StyledLoadingBar} {
            transition: left ${p.theme.motion.duration300} ${p.theme.motion.transformEaseInOut},
              width ${p.theme.motion.duration300} ${p.theme.motion.transformEaseInOut};
          }
        }
      }
    `}
`;
