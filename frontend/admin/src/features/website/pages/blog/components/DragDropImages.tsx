import { MouseEvent, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DropZone, Icon, Link, Text, Toast, Tooltip } from "@/ui-components";
import { AltIcon, EyeIcon, PlusIcon, TrashFullIcon } from "@/ui-icons";

import { ArticleImageRequest } from "app/features/website/types";
import { CollectionImageRequest } from "app/types";
import { getBase64 } from "app/utils/file";
import { useToggle } from "app/utils/useToggle";

import { getImageSrc } from "../../../utils/other";

import { EditImageAltModal } from "./EditImageAltModal";
import { ViewImageModal } from "./ViewImageModal";

interface DragDropImagesProps {
  isCreate?: boolean;
  image?: ArticleImageRequest;
  alt?: string;
  appendImage: (data: ArticleImageRequest) => void;
  removeFormImage: () => void;
  updateAltImage: (alt: string) => void;
  showImportUrl?: () => void;
}

export function DragDropImages({
  isCreate,
  removeFormImage: removeImage,
  image,
  alt,
  showImportUrl,
  appendImage,
  updateAltImage,
}: DragDropImagesProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { value: toastErrorSize, toggle: toggleToastErrorSize } = useToggle(false);
  const [imageView, setImageView] = useState<CollectionImageRequest>();

  const { value: isShowAltEdit, setTrue: showAltEdit, setFalse: closeAltEdit } = useToggle(false);

  const handleDrop = async (_droppedFiles: File[], acceptedFiles: File[]) => {
    setLoading(true);
    const file = acceptedFiles[0];
    if (file.size > 2000000) {
      setLoading(false);
      toggleToastErrorSize();
      return;
    }
    const base64 = await getBase64(file);
    const imgResult: ArticleImageRequest = {
      filename: file.name,
      base64,
    };

    if (isCreate) {
      appendImage(imgResult);
    }
    setLoading(false);
  };

  const handleUpdateImageAlt = (value: string) => {
    updateAltImage(value);
  };

  const handleClickImportFromUrl = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    showImportUrl?.();
  };

  const imageUpload = (
    <StyledImageUpload>
      <StyledAddImage>
        <Icon source={PlusIcon} color="base" />
        <Text as="p" variant="bodyMd">
          Kéo thả hoặc{" "}
          <Text as="span" variant="bodyMd" fontWeight="medium">
            <StyledImportFromUrlText onClick={handleClickImportFromUrl}>thêm ảnh từ URL</StyledImportFromUrlText>
          </Text>
        </Text>
      </StyledAddImage>
      <Text as="p" variant="bodyMd" fontWeight="medium">
        <Link removeUnderline>Tải ảnh từ thiết bị</Link>
      </Text>
    </StyledImageUpload>
  );

  const hasImage = image !== undefined;

  return (
    <>
      {toastErrorSize && (
        <Toast
          content="Kích thước file tối đa được upload là 2MB"
          error
          duration={3000}
          onDismiss={toggleToastErrorSize}
        />
      )}
      <StyledImageWrapper hasImage={hasImage}>
        <StyledDropZone hasImage={hasImage}>
          <DropZone accept="image/*" type="image" allowMultiple={false} onDrop={handleDrop}>
            {isLoading ? (
              <Text variant="bodyMd" as="span" color="subdued">
                uploading..
              </Text>
            ) : hasImage ? (
              <StyledViewImage>
                <Icon source={PlusIcon} color="base" />
              </StyledViewImage>
            ) : (
              imageUpload
            )}
          </DropZone>
        </StyledDropZone>
        {hasImage ? (
          <ImageItem
            image={image}
            onClickEditAlt={showAltEdit}
            onClickView={() => setImageView(image)}
            onRemove={removeImage}
          />
        ) : null}
      </StyledImageWrapper>
      {imageView ? <ViewImageModal image={imageView} onClose={() => setImageView(undefined)} /> : null}
      {isShowAltEdit && image ? (
        <EditImageAltModal alt={alt || ""} image={image} onClose={closeAltEdit} onSubmit={handleUpdateImageAlt} />
      ) : null}
    </>
  );
}

type ImageItemType = CollectionImageRequest | undefined;

const ImageItem = ({
  image,
  onClickEditAlt,
  onClickView,
  onRemove,
}: {
  image: ImageItemType;
  onClickEditAlt: () => void;
  onClickView: () => void;
  onRemove: () => void;
}) => {
  return (
    <StyledViewImage>
      <StyledImageOverLay>
        <StyledOverLayActionsWrapper>
          <div />
          <StyledIconButtonWrapper>
            <Tooltip content="Xem ảnh" hoverDelay={500}>
              <StyledIconButton type="button" onClick={onClickView}>
                <Icon source={EyeIcon} />
              </StyledIconButton>
            </Tooltip>
            <Tooltip content="Chỉnh sửa ALT của ảnh" hoverDelay={500}>
              <StyledIconButton type="button" onClick={onClickEditAlt}>
                <Icon source={AltIcon} />
              </StyledIconButton>
            </Tooltip>
            <Tooltip content="Xóa ảnh" hoverDelay={500}>
              <StyledIconButton type="button" onClick={onRemove}>
                <Icon source={TrashFullIcon} />
              </StyledIconButton>
            </Tooltip>
          </StyledIconButtonWrapper>
        </StyledOverLayActionsWrapper>
      </StyledImageOverLay>
      <StyledImage src={getImageSrc(image, "compact")} alt={image?.alt} />
    </StyledViewImage>
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
  margin-bottom: ${(p) => p.theme.spacing(3)};
`;

const StyledImageOverLay = styled.div<{ isOutOfLength?: boolean }>`
  ${(p) => css`
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
    gap: ${p.theme.spacing(0.5)};
    color: ${p.theme.colors.surface};
    transition: opacity ease-in ${p.theme.motion.duration100};
    background: ${p.theme.colors.text};
    border-radius: ${p.theme.shape.borderRadius("large")};
    ${p.isOutOfLength
      ? css`
          opacity: 0.7;
          cursor: pointer;
        `
      : css`
          &:hover {
            opacity: 0.7;
          }
        `}
  `}
`;

const StyledViewImage = styled.div<{ bordered?: boolean; isPrimary?: boolean; isDragging?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  opacity: 1;
  ${(p) => css`
    width: calc(${p.theme.spacing(24)} - ${p.theme.spacing(2)});
    height: calc(${p.theme.spacing(24)} - ${p.theme.spacing(2)});
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

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${(p) => p.theme.shape.borderRadius("large")};
`;

const StyledIconButton = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 2px;
  background: transparent;
  color: ${(p) => p.theme.colors.surface};
  span,
  svg {
    color: ${(p) => p.theme.colors.surface};
  }
  width: 20px;
  height: 20px;
  padding: 2px;
  text-align: center;
  :hover {
    background-color: ${(p) => p.theme.colors.iconHovered};
  }
  :active {
    background-color: ${(p) => p.theme.colors.iconPressed};
  }
`;
const StyledImportFromUrlText = styled.a`
  text-decoration: none;
  color: ${(p) => p.theme.colors.textPrimary};
  font-size: ${(p) => p.theme.typography.fontSize100};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  :hover {
    text-decoration: underline;
  }
`;

const StyledOverLayActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: ${(p) => p.theme.spacing(2)};
`;

const StyledIconButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(1)};
`;
