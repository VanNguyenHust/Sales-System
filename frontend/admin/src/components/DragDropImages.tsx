import { useId, useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Banner, DropZone, Icon, Labelled, Link, Loading, Modal, Spinner, Text } from "@/ui-components";
import { PlusIcon, ShowIcon, TrashFullIcon } from "@/ui-icons";
import type { Identifier, XYCoord } from "dnd-core";
import { uniqueId } from "lodash-es";

import imagePdf from "app/assets/icon/file/pdf.svg";
import imageRar from "app/assets/icon/file/rar.svg";
import { getBase64 } from "app/utils/file";
import { dndManager } from "app/utils/reactdnd";
import { showErrorToast } from "app/utils/toast";
import { getMediaResizedImage } from "app/utils/url";

const UPLOAD_IMAGE_SIZE_LIMIT = 2000000;

const CDNImageSizeCompact = "thumb/compact";

const ImageAcceptType = "image";
export interface FileImageRequest {
  id?: string;
  base64?: string;
  src?: string;
  file?: File;
  fileName?: string;
  alt?: string;
  position?: number;
  fileType?: string;
  extension?: string;
}

type ImageItemType = FileImageRequest | undefined;

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const getImageSrc = (image?: FileImageRequest, size?: string) => {
  if (!image) return "";
  if (image?.extension !== undefined && ["application/x-zip-compressed", ""].includes(image?.extension)) {
    return imageRar;
  } else if ("application/pdf" === image?.extension) {
    return imagePdf;
  } else {
    if (image.src) {
      if (size && image.id) {
        return getMediaResizedImage(image.src, "compact");
      } else return image.src;
    } else if (image.base64) {
      return `data:${image.file?.type || ""};base64,${image.base64}`;
    }
  }
  return "";
};

const DragDropImageItem = ({
  image,
  readOnly,
  onClickView,
  onRemove,
}: {
  image: ImageItemType;
  readOnly?: boolean;
  onClickView: () => void;
  onRemove: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ImageAcceptType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = 0;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right;
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      item.index = hoverIndex;
    },
  });

  return (
    <StyledViewImage
      borderDashed={
        image?.extension !== undefined &&
        ["application/x-zip-compressed", "", "application/pdf"].includes(image?.extension)
      }
      ref={ref}
      isPrimary
      data-handler-id={handlerId}
    >
      <StyledImageOverLay>
        <StyledIconButton type="button" onClick={onClickView}>
          <Icon source={ShowIcon} />
        </StyledIconButton>
        {!readOnly && (
          <StyledIconButton type="button" onClick={onRemove}>
            <Icon source={TrashFullIcon} />
          </StyledIconButton>
        )}
      </StyledImageOverLay>
      <StyledImage src={getImageSrc(image, CDNImageSizeCompact)} extension={image?.extension} alt={image?.alt} />
    </StyledViewImage>
  );
};

interface DragDropImagesProps {
  label?: string;
  labelTooltip?: string;
  requiredIndicator?: boolean;
  subContent?: string;
  images: FileImageRequest[];
  accept: string;
  type: "file" | "image" | "video";
  errorOverlayText?: string;
  limitQuantity?: number;
  limitSize?: number;
  showBannerError?: boolean;
  formatQuantityError?: string;
  formatTypeError?: string;
  kind?: string;
  disabled?: boolean;
  onAppendImage: (data: FileImageRequest[]) => void;
  onAppendFile?: (data: File[]) => void;
  onRemoveImage: (index: number, type?: string) => void;
}

export const DragDropImages = ({
  label,
  labelTooltip,
  requiredIndicator,
  subContent,
  images,
  accept,
  type,
  errorOverlayText,
  limitQuantity,
  limitSize = UPLOAD_IMAGE_SIZE_LIMIT,
  showBannerError = true,
  formatQuantityError,
  formatTypeError,
  kind,
  disabled,
  onAppendImage,
  onAppendFile,
  onRemoveImage,
}: DragDropImagesProps) => {
  const imageId = useId();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openImageView, setOpenImageView] = useState<FileImageRequest | null>(null);
  const [textTypeError, setTextTypeError] = useState<string>("");
  const [textSizeError, setTextSizeError] = useState<string>("");

  const handleDrop = async (files: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
    const imageNumber = files.length + images.length;
    if (limitQuantity && imageNumber > limitQuantity) {
      showErrorToast(
        formatQuantityError && formatQuantityError.includes("{max_quantity}")
          ? formatQuantityError.replace("{max_quantity}", limitQuantity.toString())
          : `Đính kèm tối đa ${limitQuantity} file`
      );
      return;
    }
    setLoading(true);
    const newImages: FileImageRequest[] = [];
    const newFiles: File[] = [];
    if (acceptedFiles.length) {
      let nameFiles = "";
      for (const [i, file] of acceptedFiles.entries()) {
        if (file.size > limitSize) {
          if (i === acceptedFiles.length - 1) nameFiles += `${file.name} `;
          else nameFiles += `${file.name}, `;
          continue;
        }
        const base64 = await getBase64(file);
        const imgResult: FileImageRequest = {
          id: uniqueId("image_"),
          fileName: file.name,
          base64,
          extension: file.type,
          fileType: kind,
        };
        newImages.push(imgResult);
        newFiles.push(file);
      }
      if (nameFiles !== "") {
        setTextSizeError(
          `Ảnh ${nameFiles} vượt quá dung lượng ${limitSize !== UPLOAD_IMAGE_SIZE_LIMIT ? `${limitSize}B` : "2MB"}`
        );
      } else {
        setTextSizeError("");
      }
      onAppendImage(newImages);
      if (onAppendFile) onAppendFile(newFiles);
    }
    if (rejectedFiles.length) {
      let nameFiles = "";
      rejectedFiles.forEach((file, i) => {
        if (i === rejectedFiles.length - 1) nameFiles += `${file.name} `;
        else nameFiles += `${file.name}, `;
      });
      setTextTypeError(
        formatTypeError && formatTypeError.includes("{files}")
          ? formatTypeError.replace("{files}", nameFiles)
          : `File ${nameFiles} không đúng định dạng`
      );
    } else {
      setTextTypeError("");
    }
    setLoading(false);
  };

  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    if (image) {
      onRemoveImage(index);
    }
  };

  const hasImage = images !== undefined && images.length > 0;

  const imageUpload = (
    <StyledImageUpload>
      <StyledAddImage>
        <Text as="p" variant="bodyMd" color="subdued">
          Kéo thả hoặc{" "}
          <Text as="span" variant="bodyMd" fontWeight="bold">
            {disabled ? "tải ảnh từ thiết bị" : <Link removeUnderline>tải ảnh từ thiết bị</Link>}
          </Text>
        </Text>
      </StyledAddImage>
      <StyledAddImage>
        <Text as="p" variant="bodyMd" color="subdued">
          {subContent}
        </Text>
      </StyledAddImage>
    </StyledImageUpload>
  );

  return (
    <Labelled requiredIndicator={requiredIndicator} label={label} labelTooltip={labelTooltip} id={imageId}>
      {showBannerError && (textTypeError !== "" || textSizeError !== "") && (
        <StyledBannerError>
          <Banner
            status="critical"
            outline
            onDismiss={() => {
              setTextTypeError("");
              setTextSizeError("");
            }}
          >
            <Text as="p" fontWeight="medium">
              {textSizeError}
            </Text>
            <Text as="p" fontWeight="medium">
              {textTypeError}
            </Text>
          </Banner>
        </StyledBannerError>
      )}
      <StyledImageWrapper hasImage={hasImage}>
        {!hasImage || !disabled ? (
          <StyledDropZone hasImage={hasImage}>
            <DropZone
              id={imageId}
              accept={accept}
              type={type}
              allowMultiple
              onDrop={handleDrop}
              disabled={disabled}
              errorOverlayText={hasImage ? "Ảnh không đúng định dạng" : errorOverlayText}
            >
              {hasImage ? (
                <StyledViewImage borderDashed>
                  {isLoading ? (
                    <>
                      <Spinner size="small" />
                      <Loading />
                    </>
                  ) : (
                    <Icon source={PlusIcon} color="base" />
                  )}
                </StyledViewImage>
              ) : isLoading ? (
                <Loading />
              ) : (
                imageUpload
              )}
            </DropZone>
          </StyledDropZone>
        ) : null}
        <DndProvider manager={dndManager}>
          {hasImage
            ? images.map((image, index) => (
                <DragDropImageItem
                  key={image.id}
                  image={image}
                  readOnly={disabled}
                  onClickView={() => setOpenImageView(image)}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))
            : null}
        </DndProvider>
      </StyledImageWrapper>
      <Modal title="Phóng to ảnh" open={!!openImageView} onClose={() => setOpenImageView(null)} sectioned>
        <StyledView>
          {openImageView ? <StyledImageViewModle src={getImageSrc(openImageView)} alt={openImageView?.alt} /> : ""}
        </StyledView>
      </Modal>
    </Labelled>
  );
};

const StyledImageWrapper = styled.div<{ hasImage?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(3)};
`;

const StyledDropZone = styled.div<{ hasImage?: boolean }>`
  flex: auto;
  ${(p) =>
    p.hasImage
      ? css`
          max-width: calc(${p.theme.spacing(24)} - ${p.theme.spacing(2)});
          max-height: calc(${p.theme.spacing(24)} - ${p.theme.spacing(2)});
        `
      : css``}
`;

const StyledImageUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(p) => p.theme.spacing(5, 0)};
`;

const StyledAddImage = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
  margin: ${(p) => p.theme.spacing(1, 0)};
`;

const StyledImageOverLay = styled.div<{ isOutOfLength?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing(0.5)};
  color: ${(p) => p.theme.colors.surface};
  transition: opacity ease-in ${(p) => p.theme.motion.duration100};
  background: ${(p) => p.theme.colors.text};
  ${(p) =>
    p.isOutOfLength
      ? css`
          opacity: 0.7;
          cursor: pointer;
        `
      : css`
          &:hover {
            opacity: 0.7;
          }
        `}
`;

const StyledViewImage = styled.div<{ borderDashed?: boolean; isPrimary?: boolean; isDragging?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  opacity: 1;
  width: calc(${(p) => p.theme.spacing(24)} - ${(p) => p.theme.spacing(2)});
  height: calc(${(p) => p.theme.spacing(24)} - ${(p) => p.theme.spacing(2)});
  ${(p) =>
    !p.borderDashed &&
    css`
      border: ${p.theme.shape.borderBase};
    `}
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  ${(p) =>
    p.isPrimary &&
    css`
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 24px;
        opacity: 0.7;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${p.theme.colors.surface};
        transition: bottom ease-in ${p.theme.motion.duration100};
        background: ${p.theme.colors.text};
        border-radius: 0 0 ${p.theme.shape.borderRadius("base")} ${p.theme.shape.borderRadius("base")};
      }
      &:hover {
        &::after {
          bottom: -24px;
          background: transparent;
        }
      }
    `}
  ${(p) => {
    if (p.isDragging) {
      return css`
        opacity: 0.2;
        ${StyledImageOverLay} {
          display: none;
        }
      `;
    }
  }}
`;

const StyledImage = styled.img<{ extension?: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledIconButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background: transparent;
  color: ${(p) => p.theme.colors.surface};
  :hover {
    background-color: ${(p) => p.theme.colors.iconHovered};
  }
  :active {
    background-color: ${(p) => p.theme.colors.iconPressed};
  }
`;

const StyledView = styled.div`
  display: flex;
  height: 300px;
  align-items: center;
  justify-content: center;
`;

const StyledImageViewModle = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledBannerError = styled.div`
  padding-bottom: ${(p) => p.theme.spacing(2)};
`;
