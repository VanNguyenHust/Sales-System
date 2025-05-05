import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { debounce } from "lodash-es";

import { scrollable } from "../../utils/shared";
import { useComponentDidMount } from "../../utils/useComponentDidMount";
import { useLazyRef } from "../../utils/useLazyRef";
import { StickyManager, StickyManagerContext } from "../StickyManager/StickyContextManager";

import { ScrollableContext } from "./context";
import { ScrollTo } from "./ScrollTo";

export interface ScrollableProps extends React.HTMLProps<HTMLDivElement> {
  /** Nội dung hiển thị */
  children?: ReactNode;
  /**
   * Cho phép cuộn theo chiều dọc
   * @default true
   * */
  vertical?: boolean;
  /**
   * Cho phép cuộn theo chiều ngang
   * @default true
   * */
  horizontal?: boolean;
  /** Thêm tabIndex vào scrollable khi children không focusable */
  focusable?: boolean;
  /**
   * Chiều rộng thanh cuộn được xác định bởi trình duyệt
   * @default "thin"
   * */
  scrollbarWidth?: "thin" | "none" | "auto";
  /** Thêm khoảng trống vào một hoặc cả hai bên để tránh dịch chuyển nội dung khi cần cuộn */
  scrollbarGutter?: "stable" | "stable both-edges";
  /** Callback khi scroll xuống cuối */
  onScrolledToBottom?(): void;
}

interface ScrollToOptions {
  behavior?: "smooth" | "auto";
}

export interface ScrollableRef {
  /** Scroll theo chiều dọc xuống vị trí */
  scrollTo: (scrollY: number, options?: ScrollToOptions) => void;
}

const LOW_RES_BUFFER = 2;

/**
 * Dùng để hiển thị các nội dung dài ví dụ như "Điều khoản dịch vụ", cho phép người dùng cuộn để xem thêm nội dung khi đọc
 */
// @ts-expect-error - expected component type combine with ForwardRefExoticComponent
export const Scrollable: ForwardRefExoticComponent<PropsWithoutRef<ScrollableProps> & RefAttributes<ScrollableRef>> & {
  ScrollTo: typeof ScrollTo;
  forNode: typeof forNode;
} = forwardRef<ScrollableRef, ScrollableProps>(
  (
    {
      children,
      vertical = true,
      horizontal = true,
      focusable,
      scrollbarWidth = "thin",
      scrollbarGutter,
      onScrolledToBottom,
      ...rest
    }: ScrollableProps,
    forwardedRef
  ) => {
    const stickyManager = useLazyRef(() => new StickyManager());
    const scrollArea = useRef<HTMLDivElement>(null);

    const defaultRef = useRef<ScrollableRef | undefined>(undefined);
    useImperativeHandle(forwardedRef || defaultRef, () => ({ scrollTo }));

    const scrollTo = useCallback((scrollY: number, options: ScrollToOptions = {}) => {
      const optionsBehavior = options.behavior || "smooth";
      scrollArea.current?.scrollTo({ top: scrollY, behavior: optionsBehavior });
    }, []);

    const handleScroll = useCallback(() => {
      const currentScrollArea = scrollArea.current;
      if (!currentScrollArea) {
        return;
      }
      requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = currentScrollArea;
        const canScroll = Boolean(scrollHeight > clientHeight);
        const isAtBottomOfScroll = Boolean(scrollTop + clientHeight >= scrollHeight - LOW_RES_BUFFER);
        if (canScroll && isAtBottomOfScroll && onScrolledToBottom) {
          onScrolledToBottom();
        }
      });
    }, [onScrolledToBottom]);

    useComponentDidMount(() => {
      handleScroll();
    });

    useEffect(() => {
      const currentScrollArea = scrollArea.current;
      if (!currentScrollArea) {
        return;
      }

      const handleResize = debounce(handleScroll, 50, { trailing: true });

      stickyManager.current?.setContainer(currentScrollArea);
      currentScrollArea.addEventListener("scroll", handleScroll);
      globalThis.addEventListener("resize", handleResize);

      return () => {
        currentScrollArea.removeEventListener("scroll", handleScroll);
        globalThis.removeEventListener("resize", handleResize);
      };
    }, [handleScroll, stickyManager]);

    return (
      <ScrollableContext.Provider value={scrollTo}>
        <StickyManagerContext.Provider value={stickyManager.current}>
          <StyledScrollable
            {...rest}
            {...scrollable.props}
            as="div"
            vertical={vertical}
            horizontal={horizontal}
            scrollbarWidth={scrollbarWidth}
            scrollbarGutter={scrollbarGutter}
            tabIndex={focusable ? 0 : undefined}
            ref={scrollArea}
          >
            {children}
          </StyledScrollable>
        </StickyManagerContext.Provider>
      </ScrollableContext.Provider>
    );
  }
);

Scrollable.displayName = "Scrollable";

const StyledScrollable = styled.div<{
  vertical?: boolean;
  horizontal?: boolean;
  scrollbarWidth: ScrollableProps["scrollbarWidth"];
  scrollbarGutter: ScrollableProps["scrollbarGutter"];
}>`
  overflow-x: ${(p) => (p.horizontal ? "auto" : "hidden")};
  overflow-y: ${(p) => (p.vertical ? "auto" : "hidden")};

  &:focus {
    outline: ${(p) => p.theme.shape.borderWidth(1)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.shape.borderWidth(1)};
  }

  ${(p) =>
    p.scrollbarWidth &&
    css`
      scrollbar-width: ${p.scrollbarWidth};
    `};

  ${(p) =>
    p.scrollbarGutter &&
    css`
      scrollbar-gutter: ${p.scrollbarGutter};
    `};

  ${(p) =>
    p.scrollbarWidth === "thin" &&
    css`
      &::-webkit-scrollbar {
        width: ${p.theme.spacing(2)};
        height: ${p.theme.spacing(2)};
      }
      &::-webkit-scrollbar-track {
        background: ${p.theme.components.scrollBar.scrollBarTrackColor};
      }
      &::-webkit-scrollbar-thumb {
        background: ${p.theme.components.scrollBar.scrollBarThumbColor};
        border-radius: ${p.theme.shape.borderRadius("base")};
        &:hover {
          background: ${p.theme.components.scrollBar.scrollBarThumbHoverColor};
        }
      }
    `}
`;

const forNode = (node: HTMLElement): HTMLElement | Document => {
  const closestElement = node.closest(scrollable.selector);
  return closestElement instanceof HTMLElement ? closestElement : document;
};

Scrollable.ScrollTo = ScrollTo;
Scrollable.forNode = forNode;
