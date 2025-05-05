import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useBlocker, useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useTheme } from "@/ui-components";

import { isLegacyPath, useLegacyPageFeatureFlag } from "app/features/admin/routes";
import { exitLegacyFullscreen, setLocationPathname } from "app/state/reducers";
import { useDispatch, useSelector } from "app/types";
import { showErrorToast, showToast } from "app/utils/toast";
import { useToggle } from "app/utils/useToggle";

import { Loading } from "../Loading";

import { useLegacyTracker } from "./useLegacyTracker";

const LEGACY_CONTENT_SELECTOR = "body > #content";
const LEGACY_FLASH_MESSAGE_SELECTOR = "#flash-message-component";
const LEGACY_ACCESS_DENIED_SELECTOR = "#content > #forward-access-denied";

/** Trigger legacy turbolink fetch page and swap node */
export function LegacyPage() {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { value: legacyUnsupported, setTrue: setLegacyUnsupported } = useToggle(false);
  const { value: isInitializing, setFalse: setInitialized } = useToggle(true);
  const locationPathname = useSelector((state) => state.ui.locationPathname);
  const { navbarCollapsed } = useSelector((state) => state.ui);
  const theme = useTheme();
  const legacySwitching = useLegacyTracker();
  const { isEnabledPath } = useLegacyPageFeatureFlag();
  const dispatch = useDispatch();

  const syncContentNodeFirstTime = () => {
    const replaceContentNode = () => {
      const contentNode = document.querySelector(LEGACY_CONTENT_SELECTOR);
      if (contentNode && ref.current) {
        ref.current.replaceChildren(contentNode);
        setInitialized();
        document.dispatchEvent(new CustomEvent("page:react-legacy-page-initialized", {}));
        return true;
      }
      return false;
    };

    if (!replaceContentNode()) {
      if (window.Turbolinks) {
        window.Turbolinks.visit(location.pathname + location.hash + location.search);
      } else {
        setLegacyUnsupported();
      }
    }
  };

  const syncTurbograftContentNode = () => {
    const replaceContentNode = () => {
      const contentNode = document.querySelector(LEGACY_CONTENT_SELECTOR);
      if (contentNode && ref.current) {
        ref.current.replaceChildren(contentNode);
      }
    };

    document.addEventListener("page:update", replaceContentNode);
    return () => {
      document.removeEventListener("page:update", replaceContentNode);
    };
  };

  const syncPageLoadState = () => {
    document.addEventListener("page:load", setInitialized);
    return () => {
      document.removeEventListener("page:load", setInitialized);
    };
  };

  const syncFlashMessage = () => {
    const handleFlashMessage = () => {
      const flashNode = document.querySelector(LEGACY_FLASH_MESSAGE_SELECTOR);
      if (flashNode) {
        const message = flashNode.getAttribute("data-message");
        const isError = flashNode.getAttribute("data-isError") === "true";
        if (message) {
          if (isError) {
            showErrorToast(message);
          } else {
            showToast(message);
          }
        }
        flashNode.setAttribute("data-message", "");
      }
    };

    document.addEventListener("page:update", handleFlashMessage);
    document.addEventListener("page:load", handleFlashMessage);
    return () => {
      document.removeEventListener("page:update", handleFlashMessage);
      document.removeEventListener("page:load", handleFlashMessage);
    };
  };

  const injectTurbolink = () => {
    if (!window.Turbolinks) {
      return;
    }
    const originVisit = window.Turbolinks.visit;
    const originPushState = window.Turbolinks.pushState;
    const originReplaceState = window.Turbolinks.replaceState;
    if (typeof originVisit === "function") {
      window.Turbolinks.visit = (url, options) => {
        const componentUrl = new ComponentUrl(url);
        if (!isLegacyPath(componentUrl.pathname)) {
          navigate(componentUrl.relative);
        } else {
          //TODO: return component unsupport package
          //TH ko gói, ko redirect sang legacy pages
          const isEnabled = isEnabledPath(componentUrl.pathname);
          if (!isEnabled) {
            navigate(componentUrl.relative);
            return;
          }
          originVisit(url, options);
        }
      };
    }
    if (typeof originPushState === "function") {
      window.Turbolinks.pushState = (state, title, url) => {
        originPushState(state, title, url);
        dispatch(setLocationPathname(new ComponentUrl(url).pathname));
      };
    }
    if (typeof originPushState === "function") {
      window.Turbolinks.replaceState = (state, title, url) => {
        originReplaceState(state, title, url);
        dispatch(setLocationPathname(new ComponentUrl(url).pathname));
      };
    }
    return () => {
      window.Turbolinks.visit = originVisit;
      window.Turbolinks.pushState = originPushState;
      window.Turbolinks.replaceState = originReplaceState;
    };
  };

  const exitLegacyFullscreenWhenLocationChange = () => {
    dispatch(exitLegacyFullscreen());
  };

  const abortTurbolinksWhenDestroy = () => {
    if (window.Turbolinks && typeof window.Turbolinks.__setAbort__ === "function") {
      window.Turbolinks.__setAbort__(false);
    }
    return () => {
      if (window.Turbolinks && typeof window.Turbolinks.__setAbort__ === "function") {
        window.Turbolinks.__setAbort__(true);
      }
    };
  };

  const redirectAccessDeniedIfNeeded = () => {
    const redirectAccessDenied = () => {
      const accessDeniedNode = document.querySelector(LEGACY_ACCESS_DENIED_SELECTOR);
      if (accessDeniedNode) {
        navigate("/admin/authorization/accessdenied");
      }
    };

    redirectAccessDenied();

    document.addEventListener("page:load", redirectAccessDenied);
    return () => {
      document.removeEventListener("page:load", redirectAccessDenied);
    };
  };

  useEffect(redirectAccessDeniedIfNeeded, [navigate]);
  useEffect(syncContentNodeFirstTime, [location, setLegacyUnsupported, setInitialized]);
  useEffect(injectTurbolink, [dispatch, navigate, isEnabledPath]);
  useEffect(exitLegacyFullscreenWhenLocationChange, [dispatch, locationPathname]);
  useEffect(abortTurbolinksWhenDestroy, []);
  useEffect(syncTurbograftContentNode, []);
  useEffect(syncPageLoadState, [setInitialized]);
  useEffect(syncFlashMessage, []);

  useEffect(() => {
    if (!legacySwitching) {
      if (typeof window.__pageReady__ === "function") {
        window.__pageReady__();
      }
    }
  }, [legacySwitching]);

  useBlocker(({ nextLocation }) => {
    // legacy page rely on this event prevent dirty form when navigation,
    // we must create event when navigation using react router dom
    const event = new MessageEvent("page:before-change", {
      bubbles: true,
      cancelable: true,
      data: nextLocation.pathname,
    });
    return !document.dispatchEvent(event);
  });

  const loadingMarkup = isInitializing || legacySwitching ? <Loading /> : null;

  if (legacyUnsupported) {
    return <p>Legacy is unsupported for this instance. Please run it in legacy frontend</p>;
  }

  const linksMarkup =
    window.__initData__ && window.__initData__.links && window.__initData__.links.length ? (
      <>
        <link rel="stylesheet" href={window.__initData__.links[0]} />
      </>
    ) : null;

  return (
    <>
      <Helmet>
        {linksMarkup}
        {/** don't why Global style emotion not recycle when page unmount, helmet just work */}
        <style>{`
          header.ui-app-frame__header {
            display: ${legacySwitching ? "none" : "block"};
            z-index: ${theme.zIndex.contextualSaveBar};
            pointer-events: none;
          }
          ${theme.breakpoints.up("md")} {
            header.ui-app-frame__header {
              margin-left: ${
                navbarCollapsed ? theme.components.navigation.collapsedWidth : theme.components.navigation.baseWidth
              }
            }
          }
        `}</style>
      </Helmet>
      {loadingMarkup}
      <StyledWrapper ref={ref} switching={legacySwitching}>
        <div id="content" />
      </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div<{
  switching: boolean;
}>`
  ${(p) =>
    p.switching &&
    css`
      position: absolute !important;
      top: 0;
      width: 1px !important;
      height: 1px !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      clip-path: inset(50%) !important;
      border: 0 !important;
      white-space: nowrap !important;
    `}
`;
