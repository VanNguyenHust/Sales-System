import React, { useEffect, useLayoutEffect, useMemo } from "react";

import { createTheme } from "../../themes/createTheme";
import { ThemeProvider } from "../../themes/ThemeProvider";
import { Theme } from "../../themes/types";
import { LinkLikeComponent } from "../../types";
import { I18n, I18nContext } from "../../utils/i18n";
import { ResizeObserverManager, ResizeObserverManagerContext } from "../../utils/resize-observer-manager";
import { UniqueIdProvider } from "../../utils/uniqueId";
import { FocusManager } from "../FocusManager";
import { PortalsManager } from "../Portals/PortalsManager";
import { ScrollLockManagerContext } from "../ScrollLock/context";
import { ScrollLockManager } from "../ScrollLock/ScrollLockManager";
import { StickyManager, StickyManagerContext } from "../StickyManager/StickyContextManager";
import { LinkContext } from "../UnstyledLink/context";

export interface AppProviderProps {
  /** Nội dung của app */
  children?: React.ReactNode;
  /** Custom theme */
  theme?: Theme;
  /** Custom link được dùng trong tất các link component */
  linkComponent?: LinkLikeComponent;
  /**
   * Bộ từ điển có thể là object hoặc mảng để ghi đè ngôn ngữ mặc định
   * Nếu danh sách mảng được truyền vào, bộ từ điển trước sẽ được ưu tiên
   * */
  i18n: ConstructorParameters<typeof I18n>[0];
}

/**
 * App provider là component bắt buộc để share các setting chung giữa các component xuyên suốt trong app của bạn
 */
export function AppProvider({ children, theme: themeProp, linkComponent, i18n }: AppProviderProps) {
  const stickyManager = useMemo(() => new StickyManager(), []);
  const resizeObserverManager = useMemo(() => new ResizeObserverManager(), []);
  const theme = useMemo(() => (themeProp ? themeProp : createTheme()), [themeProp]);
  const link = useMemo(() => linkComponent, [linkComponent]);
  const intl = useMemo(() => new I18n(i18n), [i18n]);
  const scrollLockManager = useMemo(() => new ScrollLockManager(), []);
  useEffect(() => {
    if (document !== null) {
      stickyManager.setContainer(document);
    }
  }, [stickyManager]);

  useLayoutEffect(() => {
    measureScrollbars();
  }, []);

  return (
    <I18nContext.Provider value={intl}>
      <ScrollLockManagerContext.Provider value={scrollLockManager}>
        <StickyManagerContext.Provider value={stickyManager}>
          <ResizeObserverManagerContext.Provider value={resizeObserverManager}>
            <UniqueIdProvider>
              <LinkContext.Provider value={link}>
                <PortalsManager>
                  <FocusManager>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                  </FocusManager>
                </PortalsManager>
              </LinkContext.Provider>
            </UniqueIdProvider>
          </ResizeObserverManagerContext.Provider>
        </StickyManagerContext.Provider>
      </ScrollLockManagerContext.Provider>
    </I18nContext.Provider>
  );
}

const MAX_SCROLLBAR_WIDTH = 20;
const SCROLLBAR_TEST_ELEMENT_PARENT_SIZE = 30;
const SCROLLBAR_TEST_ELEMENT_CHILD_SIZE = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE + 10;

function measureScrollbars() {
  const parentEl = document.createElement("div");
  parentEl.setAttribute(
    "style",
    `position: absolute; opacity: 0; transform: translate3d(-9999px, -9999px, 0); pointer-events: none; width:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px; height:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px;`
  );

  const child = document.createElement("div");
  child.setAttribute("style", `width:100%; height: ${SCROLLBAR_TEST_ELEMENT_CHILD_SIZE}; overflow:scroll`);
  parentEl.appendChild(child);
  document.body.appendChild(parentEl);

  const scrollbarWidth = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE - (parentEl.firstElementChild?.clientWidth ?? 0);

  const scrollbarWidthWithSafetyHatch = Math.min(scrollbarWidth, MAX_SCROLLBAR_WIDTH);

  document.documentElement.style.setProperty("--ui-app-provider-scrollbar-width", `${scrollbarWidthWithSafetyHatch}px`);

  document.body.removeChild(parentEl);
}
