import React, { useCallback, useRef, useState } from "react";
import type { JSX } from "react";
import { TransitionGroup } from "react-transition-group";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { Backdrop } from "../Backdrop";
import { Portal } from "../Portals";
import { Scrollable } from "../Scrollable";
import { Spinner } from "../Spinner";
import { Stack } from "../Stack";

import { Dialog, ModalSize } from "./Dialog";
import { Footer, FooterProps } from "./Footer";
import { Header } from "./Header";
import { Section } from "./Section";
import { ModalCloseSource } from "./types";

export interface ModalProps extends FooterProps {
  /** State quản lý trạng thái đóng/mở. */
  open: boolean;
  /** url để load nội dung modal */
  src?: string;
  /** Tên của iframe trong trường hợp sử dụng url */
  iFrameName?: string;
  /** Tiêu đề trên modal */
  title?: React.ReactNode;
  /**
   * Ngăn header và footer với body bởi đường viền
   * @default true
   * */
  divider?: boolean;
  /**
   * Kích thước modal. Khi bằng `fullScreen`, modal sẽ full chiều cao trên thiết bị nhỏ
   * @default "medium"
   * */
  size?: ModalSize;
  /** Giới hạn chiều cao modal trên màn lớn với scroll */
  limitHeight?: boolean;
  /** Nội dung của body */
  children?: React.ReactNode;
  /** Phần footer bổ sung cạnh các action */
  footer?: React.ReactNode;
  /** Disable animations mở modal */
  instant?: boolean;
  /** Tự động wrap nội dung bởi Modal.Session */
  sectioned?: boolean;
  /** Thay thế nội dung modal bằng spinner */
  loading?: boolean;
  /** Modal component sẽ được render ra sau activator này - thường sẽ là button mở modal luôn */
  activator?: React.RefObject<HTMLElement> | React.ReactElement;
  /** Không sử dụng Scrollable để wrap content */
  noScroll?: boolean;
  /** Callback khi đóng modal */
  onClose(source: ModalCloseSource): void;
  /** Callback khi scroll xuống cuối */
  onScrolledToBottom?(): void;
  /** Callback khi iframe được load */
  onIFrameLoad?(evt: React.SyntheticEvent<HTMLIFrameElement>): void;
}

const IFRAME_LOADING_HEIGHT = 200;
const DEFAULT_IFRAME_CONTENT_HEIGHT = 400;

/**
 * Modal buộc người dùng thực hiện hành động trước khi tiếp tục tương tác với các thành phần khác
 */
export const Modal: React.FC<ModalProps> & {
  Section: typeof Section;
} = ({
  open,
  src,
  iFrameName,
  activator,
  instant,
  footer,
  primaryAction,
  secondaryActions,
  limitHeight,
  title,
  sectioned,
  loading,
  children,
  divider = true,
  size = "medium",
  noScroll,
  onClose,
  onScrolledToBottom,
  onIFrameLoad,
}) => {
  let dialogMarkup: JSX.Element | undefined = undefined;
  let backdropMarkup: JSX.Element | undefined = undefined;
  const activatorRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState(IFRAME_LOADING_HEIGHT);

  const handleCloseButtonClick = useCallback(() => onClose?.(ModalCloseSource.CloseButtonClick), [onClose]);
  const handleBackdropClick = useCallback(() => onClose?.(ModalCloseSource.FocusOut), [onClose]);
  const handleEscapeClick = useCallback(() => onClose?.(ModalCloseSource.EscapeKeypress), [onClose]);

  const handleIFrameLoad = useCallback(
    (evt: React.SyntheticEvent<HTMLIFrameElement>) => {
      const iframe = evt.target as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          setIframeHeight(iframe.contentWindow.document.body.scrollHeight);
        } catch (_error) {
          setIframeHeight(DEFAULT_IFRAME_CONTENT_HEIGHT);
        }
      }

      onIFrameLoad?.(evt);
    },
    [onIFrameLoad]
  );

  if (open) {
    const footerMarkup =
      footer || primaryAction || secondaryActions ? (
        <Footer divider={divider} primaryAction={primaryAction} secondaryActions={secondaryActions}>
          {footer}
        </Footer>
      ) : null;

    const content = sectioned ? wrapWithComponent(children, Section, { titleHidden: !title }) : children;

    const body = loading ? (
      <Section>
        <Stack alignment="center" distribution="center">
          <Spinner size="small" />
        </Stack>
      </Section>
    ) : (
      content
    );

    const scrollContainerMarkup = noScroll ? (
      <StyledNoScroll>{body}</StyledNoScroll>
    ) : (
      <StyledBody onScrolledToBottom={onScrolledToBottom}>{body}</StyledBody>
    );

    const bodyMarkup = src ? (
      <StyledIframe name={iFrameName} src={src} onLoad={handleIFrameLoad} style={{ height: `${iframeHeight}px` }} />
    ) : (
      scrollContainerMarkup
    );

    dialogMarkup = (
      <Dialog instant={instant} onClose={handleEscapeClick} size={size} limitHeight={limitHeight}>
        <Header divider={divider} onClose={handleCloseButtonClick}>
          {title}
        </Header>
        {bodyMarkup}
        {footerMarkup}
      </Dialog>
    );

    backdropMarkup = <Backdrop onClick={handleBackdropClick} />;
  }

  const activatorMarkup =
    activator && !isRef(activator) ? <StyledActivator ref={activatorRef}>{activator}</StyledActivator> : null;

  return (
    <>
      {activatorMarkup}
      <Portal idPrefix="modal">
        {instant ? (
          dialogMarkup
        ) : (
          <TransitionGroup appear component={null}>
            {dialogMarkup}
          </TransitionGroup>
        )}
        {backdropMarkup}
      </Portal>
    </>
  );
};

Modal.Section = Section;

function isRef(ref: React.RefObject<HTMLElement> | React.ReactElement): ref is React.RefObject<HTMLElement> {
  return Object.prototype.hasOwnProperty.call(ref, "current");
}

const StyledActivator = styled.div``;

const StyledNoScroll = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  flex-grow: 1;
  ${(p) => p.theme.breakpoints.up("md")} {
    flex-grow: unset;
  }
`;

const StyledBody = styled(Scrollable)`
  flex-grow: 1;
  ${(p) => p.theme.breakpoints.up("md")} {
    flex-grow: unset;
  }
`;

const StyledIframe = styled.iframe`
  display: block;
  width: ${(p) => p.theme.components.modal.maxWidth};
  max-width: 100vw;
  border: none;

  ${(p) => p.theme.breakpoints.up("md")} {
    max-width: ${(p) => p.theme.components.modal.maxWidth};
  }
`;
