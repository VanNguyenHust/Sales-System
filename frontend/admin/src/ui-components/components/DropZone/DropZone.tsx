import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Action } from "../../types";
import { useI18n } from "../../utils/i18n";
import { capitalize } from "../../utils/strings";
import { focusRing } from "../../utils/styles";
import { useUniqueId } from "../../utils/uniqueId";
import { useEventListener } from "../../utils/useEventListener";
import { useToggle } from "../../utils/useToggle";
import { Labelled } from "../Labelled";
import { Text } from "../Text";

import { DropZoneContext, DropZoneContextType } from "./context";
import { FileUpload } from "./FileUpload";
import { Overlay } from "./Overlay";
import { DropZoneEvent } from "./types";
import { fileAccepted, getDataTransferFiles, useDropZoneSize } from "./utils";

export interface DropZoneProps {
  /** id của input */
  id?: string;
  /** Nội dung label */
  label?: React.ReactNode;
  /** Hành động của label */
  labelAction?: Action;
  /** Custom thêm trạng thái active ngoài việc active khi kéo file vào dropzone */
  active?: boolean;
  /** Custom thêm trạng thái lỗi ngoài lỗi validate mặc định  */
  error?: boolean;
  /** Disable dropzone */
  disabled?: boolean;
  /**
   * Hiển thị đường viền
   * @default true
   */
  outline?: boolean;
  /**
   * Hiển thị overlay khi kéo file vào dropzone
   * @default true
   */
  overlay?: boolean;
  /** Custom text xuất hiện trên overlay khi kéo file vào dropzone */
  overlayText?: string;
  /** Custom text xuất hiện trên overlay trong trạng thái lỗi */
  errorOverlayText?: string;
  /** Loại file tải lên, được dùng để hiển thị text phù hợp */
  type?: "file" | "image" | "video";
  /**
   * Loại file được phép tải lên. Ví dụ:
   * - Sử dụng đuôi file: ".png"
   * - Truyền vào danh sách: ".png,.jpg"
   * - Sử dụng media type: "text/html"
   * - Sử dụng media type prefix: "image/*"
   * */
  accept?: string;
  /**
   * Cho phép tải nhiều file lên
   * @default true
   * */
  allowMultiple?: boolean;
  /**
   * Cho phép phần tử con thay đổi chiều cao
   * */
  variableHeight?: boolean;
  /**
   * Cho phép file được thả vào bất kì vị trí nào trên trang
   * */
  dropOnPage?: boolean;
  /**
   * Cấu hình trạng thái mặc định file dialog
   * */
  openFileDialog?: boolean;
  /** Phần tử con của dropzone */
  children?: React.ReactNode;
  /** Custom validate file */
  customValidator?(file: File): boolean;
  /** Callback khi click */
  onClick?(event: React.MouseEvent<HTMLElement>): void;
  /** Callback khi file bất kì được thả vào */
  onDrop?(files: File[], acceptedFiles: File[], rejectedFiles: File[]): void;
  /** Callback khi các file cho phép được thả vào */
  onDropAccepted?(acceptedFiles: File[]): void;
  /** Callback khi các file không cho phép được thả vào */
  onDropRejected?(rejectedFiles: File[]): void;
  /** Callback khi một hoặc nhiều file được kéo qua khu vực của dropzone */
  onDragOver?(): void;
  /** Callback khi một hoặc nhiều file bắt đầu tiến vào khu vực của dropzone */
  onDragEnter?(): void;
  /** Callback khi một hoặc nhiều file tiến ra khỏi khu vực của dropzone */
  onDragLeave?(): void;
  /** Callback được gọi khi file dialog bị đóng */
  onFileDialogClose?(): void;
}

/**
 * Thường được sử dụng để đăng tải file hoặc ảnh.
 */
export const DropZone: React.FC<DropZoneProps> & {
  FileUpload: typeof FileUpload;
} = ({
  id: idProp,
  accept,
  active,
  error,
  overlay = true,
  overlayText,
  errorOverlayText,
  allowMultiple = true,
  children,
  disabled,
  outline = true,
  label,
  labelAction,
  type = "file",
  variableHeight,
  dropOnPage,
  openFileDialog,
  customValidator,
  onClick,
  onDragOver,
  onDrop,
  onDropAccepted,
  onDropRejected,
  onDragEnter,
  onDragLeave,
  onFileDialogClose,
}: DropZoneProps) => {
  const i18n = useI18n();
  const id = useUniqueId("DropZone", idProp);
  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragTarget = useRef<EventTarget[]>([]);
  const { size, nodeRef: dropRef, measuring } = useDropZoneSize(variableHeight);
  const { value: focused, setTrue: handleFocus, setFalse: handleBlur } = useToggle(false);

  const context = useMemo(
    (): DropZoneContextType => ({
      disabled: !!disabled,
      size,
      type,
      allowMultiple,
    }),
    [allowMultiple, disabled, size, type]
  );

  const open = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.click();
  }, [inputRef]);

  const triggerFileDialog = useCallback(() => {
    open();
    onFileDialogClose?.();
  }, [open, onFileDialogClose]);

  const typeSuffix = capitalize(type);
  const allowMultipleKey = allowMultiple ? "multiple" : "single";
  const overlayTextWithDefault =
    overlayText === undefined
      ? i18n.translate(`UI.DropZone.${allowMultipleKey}.overlayText${typeSuffix}`)
      : overlayText;

  const errorOverlayTextWithDefault =
    errorOverlayText === undefined ? i18n.translate(`UI.DropZone.errorOverlayText${typeSuffix}`) : errorOverlayText;

  const getValidatedFiles = useCallback(
    (files: File[] | DataTransferItem[]) => {
      const acceptedFiles: File[] = [];
      const rejectedFiles: File[] = [];

      Array.from(files as File[]).forEach((file: File) => {
        const isFileAccepted = fileAccepted(file, accept);
        !isFileAccepted || (customValidator && !customValidator(file))
          ? rejectedFiles.push(file)
          : acceptedFiles.push(file);
      });

      if (!allowMultiple) {
        rejectedFiles.push(...acceptedFiles.slice(1));
        acceptedFiles.splice(1, acceptedFiles.length);
      }

      return { files, acceptedFiles, rejectedFiles };
    },
    [accept, allowMultiple, customValidator]
  );

  const handleDragEnter = useCallback(
    (e: DropZoneEvent) => {
      stopEvent(e);
      if (disabled) {
        return;
      }

      if (e.target && !dragTarget.current.includes(e.target)) {
        dragTarget.current.push(e.target);
      }

      if (dragging) {
        return;
      }

      const fileList = getDataTransferFiles(e);

      const { rejectedFiles } = getValidatedFiles(fileList);
      setDragging(true);
      setInternalError(rejectedFiles.length > 0);
      onDragEnter?.();
    },
    [disabled, dragging, getValidatedFiles, onDragEnter]
  );

  const handleDragLeave = useCallback(
    (e: DropZoneEvent) => {
      e.preventDefault();
      if (disabled) {
        return;
      }

      dragTarget.current = dragTarget.current.filter((el: any) => {
        const compareNode = dropOnPage ? document : dropRef.current;
        return el !== e.target && compareNode && compareNode.contains(el);
      });

      if (!dragTarget.current.length) {
        setDragging(false);
        setInternalError(false);
        onDragLeave?.();
      }
    },
    [disabled, dropRef, dropOnPage, onDragLeave]
  );

  const handleDragOver = useCallback(
    (e: DropZoneEvent) => {
      stopEvent(e);

      if (!disabled) {
        onDragOver?.();
      }
    },
    [disabled, onDragOver]
  );

  const handleDrop = useCallback(
    (e: DropZoneEvent) => {
      stopEvent(e);
      if (disabled) {
        return;
      }

      const fileList = getDataTransferFiles(e);

      const { files, acceptedFiles, rejectedFiles } = getValidatedFiles(fileList);
      dragTarget.current = [];

      setDragging(false);
      setInternalError(rejectedFiles.length > 0);
      onDrop?.(files as File[], acceptedFiles, rejectedFiles);
      acceptedFiles.length && onDropAccepted?.(acceptedFiles);
      rejectedFiles.length && onDropRejected?.(rejectedFiles);
      if (e.target && "value" in e.target) {
        e.target.value = "";
      }
    },
    [disabled, getValidatedFiles, onDrop, onDropAccepted, onDropRejected]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      return onClick ? onClick(e) : open();
    },
    [disabled, onClick, open]
  );

  const dropNode = dropOnPage ? document : dropRef as React.RefObject<HTMLElement>;

  useEventListener("dragenter", handleDragEnter, dropNode);
  useEventListener("dragleave", handleDragLeave, dropNode);
  useEventListener("dragover", handleDragOver, dropNode);
  useEventListener("drop", handleDrop, dropNode);

  const dragErrorOverlayMarkup =
    dragging && (internalError || error) ? <Overlay content={errorOverlayTextWithDefault} size={size} error /> : null;
  const dragOverlayMarkup =
    (active || dragging) && !internalError && !error && overlay ? (
      <Overlay content={overlayTextWithDefault} size={size} />
    ) : null;

  useEffect(() => {
    if (openFileDialog) triggerFileDialog();
  }, [openFileDialog, triggerFileDialog]);

  return (
    <DropZoneContext.Provider value={context}>
      <Labelled id={id} label={label} action={labelAction}>
        <StyledDropZone
          $disabled={!!disabled}
          $active={(!!active || dragging) && !disabled}
          ref={dropRef}
          onClick={handleClick}
          onDragStart={stopEvent}
          $size={!variableHeight ? size : undefined}
          $focused={focused}
          $measuring={measuring}
          $outline={outline}
        >
          {dragOverlayMarkup}
          {dragErrorOverlayMarkup}
          <Text variant="bodySm" as="span" visuallyHidden>
            <input
              id={id}
              accept={accept}
              disabled={disabled}
              multiple={allowMultiple}
              onChange={handleDrop}
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="file"
              ref={inputRef}
              autoComplete="off"
            />
          </Text>
          <StyledContainer>{children}</StyledContainer>
        </StyledDropZone>
      </Labelled>
    </DropZoneContext.Provider>
  );
};

DropZone.FileUpload = FileUpload;

function stopEvent(e: React.DragEvent<HTMLDivElement> | DropZoneEvent) {
  e.preventDefault();
  e.stopPropagation();
}

const StyledDropZone = styled.div<{
  $disabled: boolean;
  $active: boolean;
  $focused: boolean;
  $size?: string;
  $measuring: boolean;
  $outline: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  background-color: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  &::after {
    content: "";
    position: absolute;
    z-index: ${(p) => p.theme.zIndex.inputBackdrop};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: ${(p) => p.theme.shape.borderWidth(1)} dashed transparent;
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
    pointer-events: none;
  }

  ${(p) => {
    switch (p.$size) {
      case "small":
        return css`
          padding: 0;
          align-items: center;
          min-height: 2.5rem;
          &::before {
            content: "";
            padding-top: 100%;
          }
        `;
      case "medium":
        return css`
          min-height: 6.25rem;
          align-items: center;
        `;
      case "large":
        return css`
          min-height: 7.5rem;
        `;
    }
  }}

  ${(p) =>
    p.$disabled &&
    css`
      cursor: not-allowed;
      background-color: ${p.theme.colors.surfaceDisabled};
      color: ${p.theme.colors.textDisabled};
      &::after {
        border-color: ${p.theme.colors.borderDisabled};
      }
    `}

  ${(p) =>
    !p.$focused &&
    css`
      &::after {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 1;
        transform: scale(1);
        border: ${p.theme.shape.borderWidth(1)} dashed transparent;
      }
    `}

  ${(p) =>
    p.$active &&
    css`
      background-color: ${p.theme.colors.surfaceHovered};
    `}

  ${(p) =>
    !p.$outline &&
    css`
      background-color: transparent;
    `}

  ${(p) =>
    p.$outline &&
    css`
      padding: ${p.theme.spacing(0.25)};

      ${!p.$disabled &&
      css`
        &::after {
          border-width: ${p.theme.shape.borderWidth(1)};
          border-color: ${p.theme.colors.borderNeutralSubdued};
        }
        &:hover {
          cursor: pointer;
          &::after {
            border-color: ${p.theme.colors.interactiveHovered};
          }
        }
      `}
    `}

  ${(p) =>
    p.$focused &&
    !p.$disabled &&
    css`
      ${focusRing(p.theme, { style: "focused", size: "wide" })}
    `}

  ${(p) =>
    p.$measuring &&
    css`
      visibility: hidden;
      min-height: 0;
    `}
`;

const StyledContainer = styled.div`
  position: relative;
  flex: 1;
`;
