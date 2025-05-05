import React, { Fragment, StrictMode, useEffect, useMemo } from "react";

import { createTheme } from "../../themes/createTheme";
import { ThemeProvider } from "../../themes/ThemeProvider";
import { I18n, I18nContext } from "../../utils/i18n";
import { ResizeObserverManager, ResizeObserverManagerContext } from "../../utils/resize-observer-manager";
import { UniqueIdProvider } from "../../utils/uniqueId";
import { FocusManager } from "../FocusManager";
import { FrameContext, FrameContextType } from "../Frame/context";
import { PortalsManager } from "../Portals/PortalsManager";
import { ScrollLockManagerContext } from "../ScrollLock/context";
import { ScrollLockManager } from "../ScrollLock/ScrollLockManager";
import { StickyManager, StickyManagerContext } from "../StickyManager/StickyContextManager";

export interface UITestProviderProps {
  i18n?: ConstructorParameters<typeof I18n>[0];
  children: React.ReactNode;
  /** custom frame context */
  frame?: Partial<FrameContextType>;
  /** strict mode */
  strict?: boolean;
}

/** Chứa các provider mặc định được sử dụng để test component */
export function UITestProvider({ i18n, children, frame, strict }: UITestProviderProps) {
  const stickyManager = useMemo(() => new StickyManager(), []);
  const resizeObserverManager = useMemo(() => new ResizeObserverManager(), []);
  const theme = useMemo(() => createTheme(), []);
  const intl = useMemo(() => new I18n(i18n || {}), [i18n]);
  const scrollLockManager = useMemo(() => new ScrollLockManager(), []);
  const mergedFrame = createFrameContext(frame);
  const Wrapper = strict ? StrictMode : Fragment;

  useEffect(() => {
    if (document !== null) {
      stickyManager.setContainer(document);
    }
  }, [stickyManager]);

  return (
    <Wrapper>
      <I18nContext.Provider value={intl}>
        <ScrollLockManagerContext.Provider value={scrollLockManager}>
          <StickyManagerContext.Provider value={stickyManager}>
            <ResizeObserverManagerContext.Provider value={resizeObserverManager}>
              <UniqueIdProvider>
                <PortalsManager>
                  <FocusManager>
                    <ThemeProvider theme={theme}>
                      <FrameContext.Provider value={mergedFrame}>{children}</FrameContext.Provider>
                    </ThemeProvider>
                  </FocusManager>
                </PortalsManager>
              </UniqueIdProvider>
            </ResizeObserverManagerContext.Provider>
          </StickyManagerContext.Provider>
        </ScrollLockManagerContext.Provider>
      </I18nContext.Provider>
    </Wrapper>
  );
}

function noop() {}

function createFrameContext({
  logo = undefined,
  showToast = noop,
  hideToast = noop,
  setContextualSaveBar = noop,
  removeContextualSaveBar = noop,
  startLoading = noop,
  stopLoading = noop,
}: Partial<FrameContextType> = {}): FrameContextType {
  return {
    logo,
    showToast,
    hideToast,
    setContextualSaveBar,
    removeContextualSaveBar,
    startLoading,
    stopLoading,
  };
}
