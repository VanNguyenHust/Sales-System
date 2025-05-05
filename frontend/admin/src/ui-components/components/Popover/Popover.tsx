import React, { JSX, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { PreferredAlignment, PreferredPosition } from "../../types";
import { isElementOfType, wrapWithComponent } from "../../utils/components";
import {
  findFirstFocusableNode,
  findFirstFocusableNodeIncludingDisabled,
  findFirstKeyboardFocusableNode,
  focusNextFocusableNode,
} from "../../utils/focus";
import { layer, portal } from "../../utils/shared";
import { visuallyHidden } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { getZIndexForLayerFromNode } from "../../utils/zIndex";
import { FilterPopoverLayerContext } from "../AlphaFilters/context";
import { FilterItemContext } from "../Filters/context";
import { Portal } from "../Portals";

import { PopoverContext, PopoverContextType } from "./context";
import { Pane, PaneProps } from "./Pane";
import { PaneHint } from "./PaneHint";
import { Section } from "./Section";
import { StyledArrow } from "./StyledArrow";
import { usePopoverFloating } from "./usePopoverFloating";

export type PopoverAutofocusTarget = "none" | "first-node" | "container";

export enum PopoverCloseSource {
  Click,
  EscapeKeypress,
  ScrollOut,
  FocusOut,
}

export interface PopoverProps {
  /** Hiển thị mũi tên */
  arrow?: boolean;
  /** Nội dung bên trong Popover */
  children: React.ReactNode;
  /** Popover đang được nổi lên*/
  active: boolean;
  /** Thành phần điều khiển Popover */
  activator: React.ReactElement;
  /**
   * Phần tử dùng để wrap activator
   * @default "div"
   */
  activatorWrapper?: string;
  /** Hành động khi đóng Popover */
  onClose(source: PopoverCloseSource): void;
  /**
   * Lựa chọn đối tượng để focus khi mở popover
   * @default "container"
   */
  autofocusTarget?: PopoverAutofocusTarget;
  /** Ngăn tự động focus activator hoặc phần tử kế tiếp khi đóng popover */
  preventFocusOnClose?: boolean;
  /** Ngăn đóng popover khi click vào overlay của popover con */
  preventCloseOnChildOverlayClick?: boolean;
  /**
   * Vị trí Popover
   * @default "below"
   */
  preferredPosition?: PreferredPosition;
  /**
   * Căn chỉnh vị trí theo chiều ngang Popover
   * @default "center"
   */
  preferredAlignment?: PreferredAlignment;
  /**
   * Sử dụng phần tử input của activator để tính vị trí Popover
   * @default true
   */
  preferInputActivator?: boolean;
  /** Độ rộng của Popover bằng activator */
  fullWidth?: boolean;
  /** Bỏ giới hạn độ cao của Popover */
  fullHeight?: boolean;
  /** Dùng nội dung của Popover để xác định kích thước overlay */
  fluidContent?: boolean;
  /** Cố định vị trí của Popover */
  fixed?: boolean;
  /** Cấu hình sectioned cho Pane */
  sectioned?: boolean;
  /** Ẩn overlay trong chế độ in */
  hideOnPrint?: boolean;
  /**
   * Ngăn page scroll khi scroll tới cuối Scrollable của Pane. Cấu hình cho Pane
   * @default false
   */
  captureOverscroll?: boolean;
  /** Override z-index mặc định (517) */
  zIndexOverride?: number;
}

/**
 * Popover là các lớp phủ nhỏ mở khi cần thiết. Chúng cho phép người dùng truy cập nội dung hoặc thực hiện hành động bổ sung mà không làm rối trang
 */
export const Popover: React.FC<PopoverProps> & {
  Pane: typeof Pane;
  Section: typeof Section;
} = ({
  fixed,
  arrow,
  active,
  children,
  activator,
  onClose,
  sectioned,
  activatorWrapper = "div",
  preferInputActivator = true,
  preferredAlignment = "center",
  preferredPosition = "below",
  fullWidth,
  fullHeight,
  fluidContent,
  autofocusTarget = "container",
  preventFocusOnClose,
  preventCloseOnChildOverlayClick,
  hideOnPrint,
  captureOverscroll,
  zIndexOverride,
}: PopoverProps) => {
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<TransitionStatus>(active ? TransitionStatus.Entered : TransitionStatus.Exited);
  const inLegacyFilterItem = useContext(FilterItemContext) !== undefined;
  const inAlphaFilterItem = useContext(FilterPopoverLayerContext) ?? false;
  const inFilterItem = inLegacyFilterItem || inAlphaFilterItem;
  const activatorContainerRef = useRef<HTMLElement | null>(null);
  const [activatorNode, setActivatorNode] = useState<HTMLElement>();
  const id = useUniqueId("Popover");

  const WrapperComponent: any = activatorWrapper;

  const handleClose = (source: PopoverCloseSource, backward = false) => {
    onClose(source);
    if (!activatorContainerRef.current || !activatorNode || preventFocusOnClose) {
      return;
    }
    if (source === PopoverCloseSource.FocusOut) {
      const focusableActivator =
        findFirstFocusableNodeIncludingDisabled(activatorNode) ||
        findFirstFocusableNodeIncludingDisabled(activatorContainerRef.current) ||
        activatorContainerRef.current;
      if (backward && focusableActivator) {
        focusableActivator.focus();
      } else {
        if (!focusNextFocusableNode(focusableActivator, isInPortal)) {
          focusableActivator.focus();
        }
      }
    } else if (source === PopoverCloseSource.EscapeKeypress) {
      const focusableActivator =
        findFirstFocusableNodeIncludingDisabled(activatorNode) ||
        findFirstFocusableNodeIncludingDisabled(activatorContainerRef.current) ||
        activatorContainerRef.current;

      if (focusableActivator) {
        focusableActivator.focus();
      } else {
        focusNextFocusableNode(focusableActivator, isInPortal);
      }
    }
  };

  const { refs, floatingStyles, getFloatingProps, arrowRef, contentRef, placement, middlewareData, isPositioned } =
    usePopoverFloating({
      open: active,
      onClose: (reason) => {
        if (reason === "outside-press") {
          if (status === TransitionStatus.Entered) {
            handleClose(PopoverCloseSource.Click);
          }
        } else if (reason === "escape-key") {
          handleClose(PopoverCloseSource.EscapeKeypress);
        }
      },
      preferredPosition,
      preferredAlignment,
      fullHeight,
      fullWidth,
      fluidContent,
      arrow,
      fixed,
    });

  const handleSetReference = useCallback(
    (node: HTMLElement) => {
      activatorContainerRef.current = node;
      let activatorNode = node;
      if (node && node.firstElementChild && node.firstElementChild instanceof HTMLElement) {
        activatorNode = node.firstElementChild;
      }
      if (activatorNode) {
        setActivatorNode(activatorNode);
        let refNode = activatorNode;
        if (preferInputActivator) {
          const input = activatorNode.querySelector("input");
          if (input) {
            refNode = input;
          }
        }
        refs.setReference(refNode);
      }
      if (refs.domReference.current) {
        setZIndex(getZIndexForLayerFromNode(refs.domReference.current));
      }
    },
    [preferInputActivator, refs]
  );

  useEffect(() => {
    const hide = middlewareData.hide;
    //TODO: fix floating-ui "hide" to work with testing react library, this is only workaround
    if (process.env.NODE_ENV === "test") {
      return;
    }
    if (active && hide && hide.referenceHidden) {
      hide.referenceHidden = false;
      onClose(PopoverCloseSource.ScrollOut);
    }
  }, [active, middlewareData.hide, onClose]);

  useEffect(() => {
    if (activatorContainerRef.current === undefined) {
      return;
    }

    const firstFocusable = findFirstFocusableNode(activatorContainerRef.current);
    const focusableActivator: HTMLElement & {
      disabled?: boolean;
    } = firstFocusable || activatorContainerRef.current;

    const activatorDisabled = "disabled" in focusableActivator && Boolean(focusableActivator.disabled);

    setActivatorAttributes(focusableActivator, {
      id,
      active,
      activatorDisabled,
    });
  }, [active, id]);

  useEffect(() => {
    const focusContent = () => {
      if (autofocusTarget === "none" || !contentRef.current) {
        return;
      }
      requestAnimationFrame(() => {
        if (!contentRef.current) {
          return;
        }
        const focusableChild = findFirstKeyboardFocusableNode(contentRef.current);

        if (focusableChild && autofocusTarget === "first-node") {
          focusableChild.focus();
        } else {
          contentRef.current.focus();
        }
      });
    };
    if (active) {
      focusContent();
    }
  }, [active, autofocusTarget, contentRef]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (active) {
      setStatus((status) => {
        if (status !== TransitionStatus.Entered) {
          timeout = setTimeout(() => {
            setStatus(TransitionStatus.Entered);
          }, 100);
          return TransitionStatus.Entering;
        }
        return status;
      });
    } else {
      setStatus((status) => {
        if (status !== TransitionStatus.Exited) {
          timeout = setTimeout(() => {
            setStatus(TransitionStatus.Exited);
          }, 100);
          return TransitionStatus.Exiting;
        }
        return status;
      });
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [active]);

  const layerProps = inFilterItem ? layer.props : undefined;

  const contentContext = useMemo(
    (): PopoverContextType => ({
      isPositioned,
    }),
    [isPositioned]
  );

  const renderPopoverContent = (children: React.ReactNode, props: PaneProps) => {
    const childrenArray = React.Children.toArray(children);
    if (isElementOfType(childrenArray[0], Pane) || isElementOfType(childrenArray[0], PaneHint)) {
      return childrenArray;
    }
    return wrapWithComponent(childrenArray, Pane, props);
  };

  let overlay: JSX.Element | undefined = undefined;
  if (active) {
    const arrowMarkup = arrow ? (
      <StyledArrow
        ref={arrowRef}
        style={{
          top: middlewareData.arrow?.y,
          left: middlewareData.arrow?.x,
        }}
        placement={placement}
      />
    ) : null;

    const floatingProps = getFloatingProps({
      tabIndex: autofocusTarget === "none" ? undefined : -1,
    });
    if (!preventCloseOnChildOverlayClick) {
      // override this: https://github.com/floating-ui/floating-ui/blob/master/packages/react/src/hooks/useDismiss.ts#L461
      floatingProps.onPointerDownCapture = noop;
    }
    overlay = (
      <StyledPopoverOverlay
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: zIndexOverride ?? zIndex,
        }}
        $status={status}
        {...layerProps}
        {...floatingProps}
      >
        <StyledPopover hideOnPrint={hideOnPrint}>
          <StyledFocusTracer tabIndex={0} onFocus={() => handleClose(PopoverCloseSource.FocusOut, true)} />
          <StyledPopoverContainer>
            <StyledPopoverContent id={id} ref={contentRef} tabIndex={autofocusTarget === "none" ? undefined : -1}>
              {renderPopoverContent(children, { sectioned, captureOverscroll })}
            </StyledPopoverContent>
          </StyledPopoverContainer>
          <StyledFocusTracer tabIndex={0} onFocus={() => handleClose(PopoverCloseSource.FocusOut)} />
          {arrowMarkup}
        </StyledPopover>
      </StyledPopoverOverlay>
    );
  }

  const portal = activatorNode ? <Portal idPrefix="popover">{overlay}</Portal> : null;

  return (
    <PopoverContext.Provider value={contentContext}>
      <WrapperComponent ref={handleSetReference}>
        {React.Children.only(activator)}
        {portal}
      </WrapperComponent>
    </PopoverContext.Provider>
  );
};

Popover.Pane = Pane;
Popover.Section = Section;

enum TransitionStatus {
  Entering = "entering",
  Entered = "entered",
  Exiting = "exiting",
  Exited = "exited",
}
function setActivatorAttributes(
  activator: HTMLElement,
  {
    id,
    active = false,
    activatorDisabled = false,
  }: {
    id: string;
    active: boolean;
    activatorDisabled: boolean;
  }
) {
  if (!activatorDisabled) {
    activator.tabIndex = activator.tabIndex || 0;
  }

  activator.setAttribute("aria-controls", id);
  activator.setAttribute("aria-owns", id);
  activator.setAttribute("aria-expanded", String(active));
  activator.setAttribute("data-state", active ? "open" : "closed");
}

function isInPortal(element: Element) {
  let parentElement = element.parentElement;

  while (parentElement) {
    if (parentElement.matches(portal.selector)) return false;
    parentElement = parentElement.parentElement;
  }

  return true;
}

function noop() {}

const StyledPopoverOverlay = styled.div<{
  $status: TransitionStatus;
}>`
  z-index: ${(p) => p.theme.zIndex.popover};
  opacity: ${(p) => (p.$status === TransitionStatus.Entering || p.$status === TransitionStatus.Entered ? 1 : 0)};
  transition: opacity ${(p) => p.theme.motion.duration100} ${(p) => p.theme.motion.transformEase};
`;

const StyledPopover = styled.div<{
  hideOnPrint?: boolean;
}>`
  position: relative;
  max-width: calc(100vw - ${(p) => p.theme.spacing(4)});

  ${(p) =>
    p.hideOnPrint &&
    css`
      @media print {
        display: none !important;
      }
    `}
`;

const StyledPopoverContainer = styled.div`
  position: relative;
  overflow: hidden;
  border: ${(p) => p.theme.shape.borderBase};
  box-shadow: ${(p) => p.theme.shadow.popover};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background: ${(p) => p.theme.colors.surface};

  /* Prevent Scrollable's box shadows overflowing the rounded corners of this
    * element on Safari prior to tech preview version 156.
    * See: https://bugs.webkit.org/show_bug.cgi?id=68196 */
  isolation: isolate;
`;

const StyledPopoverContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  &:focus {
    outline: none;
  }
`;

const StyledFocusTracer = styled.div`
  ${visuallyHidden}
`;
