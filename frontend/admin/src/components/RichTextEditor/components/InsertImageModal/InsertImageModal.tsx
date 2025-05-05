import { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  type ComplexAction,
  EmptyState,
  Modal,
  Pagination,
  Select2,
  Spinner,
  Tabs,
  Text,
  TextField,
} from "@/ui-components";

import EmptyLoupeIcon from "app/assets/icon/empty-loupe.svg";
import { isClientError } from "app/client";
import { useCountProductImageQuery, useGetProductImagesQuery } from "app/features/product/api";
import { useCountFilesQuery, useCreateFileMutation, useGetFilesQuery } from "app/features/setting/pages/file/api";
import { validImageFileExtensions } from "app/features/setting/pages/file/constants";
import { FileRequest } from "app/types";
import { filterNonNull } from "app/utils/arrays";
import { getFileExtenion } from "app/utils/file";
import { showErrorToast, showToast } from "app/utils/toast";
import { toBase64 } from "app/utils/toBase64";
import { getMediaResizedImage, ResizedImageType } from "app/utils/url";

import { imageOptions } from "../../types";

import { ImageItem } from "./ImageItem";

type SelectedItem = {
  id: number;
  src: string;
};

type InsertItem = {
  src: string;
};

type InsertItems = {
  images: InsertItem[];
};

type Props = {
  onClose(): void;
  onInsertImage(request: InsertItems): void;
};

const Tab = {
  FromProduct: 0,
  FromFile: 1,
  FromUrl: 2,
} as const;

export const InsertImageModal = ({ onClose, onInsertImage }: Props) => {
  const [src, setSrc] = useState("");
  const [size, setSize] = useState("");
  const limit = 15;
  const [page, setPage] = useState<number>(1);
  const [tab, setTab] = useState<number>(Tab.FromProduct);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const uploadFileRef = useRef<HTMLInputElement>(null);

  const itemSelectedIds = selectedItems.map((item) => item.id);

  const handleChangeTab = (tab: number) => {
    setTab(tab);
    setSize("");
    setPage(1);
    setSelectedItems([]);
  };

  const handleSelectOrRemoveItem = (item: SelectedItem) => {
    setSelectedItems((state) => {
      if (state.some((stateItem) => stateItem.id === item.id)) {
        return state.filter((stateItem) => stateItem.id !== item.id);
      }
      return [...state, item];
    });
  };

  const { data: files, isFetching: isFetchingFiles } = useGetFilesQuery(
    { image: true, limit, page },
    {
      skip: tab !== Tab.FromFile,
    }
  );

  const { data: fileCount, isLoading: isLoadingCountFile } = useCountFilesQuery(
    { image: true },
    {
      skip: tab !== Tab.FromFile,
    }
  );

  const [createFile, { isLoading: isCreatingFile }] = useCreateFileMutation();

  const { data: productImages, isFetching: isFetchingProductImages } = useGetProductImagesQuery(
    { limit, page },
    {
      skip: tab !== Tab.FromProduct,
    }
  );

  const { data: productImageCount, isLoading: isLoadingProductImageCount } = useCountProductImageQuery(undefined, {
    skip: tab !== Tab.FromProduct,
  });

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || !files.length) {
        return;
      }
      const fileRequest: FileRequest[] = [];
      for (const file of files) {
        //TODO: sync validate with api
        const ext = getFileExtenion(file.name).toLocaleLowerCase();
        const isImageFile = validImageFileExtensions.includes(ext);
        if (!isImageFile) {
          showErrorToast("File upload không đúng định dạng");
          return;
        }
        const maxImageSize = 1048576;
        if (file.size > maxImageSize) {
          showErrorToast("Kích thước file ảnh tối đa được upload là 1MB");
          return;
        }
        const base64 = await toBase64(file);
        fileRequest.push({
          base64,
          size: file.size,
          filename: file.name,
        });
      }

      if (fileRequest.length > 0) {
        await createFile({
          images: fileRequest,
        }).unwrap();
        showToast("Tải ảnh lên thành công");
      }
    } catch (error) {
      if (isClientError(error)) {
        showErrorToast(error.data.message);
      } else {
        throw error;
      }
    }
  };

  let contentMarkup: JSX.Element | undefined = undefined;
  let paginationMarkup: JSX.Element | undefined = undefined;
  if (tab === Tab.FromFile || tab === Tab.FromProduct) {
    const isLoading =
      (tab === Tab.FromFile && (isLoadingCountFile || isFetchingFiles)) ||
      (tab === Tab.FromProduct && (isLoadingProductImageCount || isFetchingProductImages));

    const isEmptyState =
      (tab === Tab.FromFile && fileCount === 0) || (tab === Tab.FromProduct && productImageCount === 0);

    if (isLoading) {
      contentMarkup = (
        <StyledImageGrid>
          {new Array(limit).fill(0).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledImageSkeleton key={index} />
          ))}
        </StyledImageGrid>
      );
    } else if (isEmptyState) {
      contentMarkup = (
        <EmptyState image={EmptyLoupeIcon}>
          <Text as="p" color="subdued">
            Cửa hàng của bạn chưa tải lên ảnh nào
          </Text>
        </EmptyState>
      );
    } else if (tab === Tab.FromFile) {
      contentMarkup = (
        <StyledImageGrid>
          {isCreatingFile && (
            <StyledImageSkeleton>
              <Spinner size="small" />
            </StyledImageSkeleton>
          )}
          {(files ?? []).map((file) => (
            <ImageItem
              key={file.id}
              src={file.src!}
              selected={itemSelectedIds.includes(file.id)}
              onClick={() => handleSelectOrRemoveItem(file)}
            />
          ))}
        </StyledImageGrid>
      );
    } else if (tab === Tab.FromProduct) {
      contentMarkup = (
        <StyledImageGrid>
          {(productImages ?? []).map((image) => (
            <ImageItem
              key={image.id}
              src={image.src!}
              selected={itemSelectedIds.includes(image.id)}
              onClick={() => handleSelectOrRemoveItem(image)}
            />
          ))}
        </StyledImageGrid>
      );
    }

    if ((tab === Tab.FromFile && !isLoadingCountFile) || (tab === Tab.FromProduct && !isLoadingProductImageCount)) {
      const itemCount = tab === Tab.FromFile ? fileCount : productImageCount;
      if (itemCount) {
        paginationMarkup = (
          <Pagination
            infinite
            currentPage={page}
            hasNext={itemCount > limit * page}
            hasPrevious={page !== 1}
            onNext={() => setPage(page + 1)}
            onPrevious={() => setPage(page - 1)}
          />
        );
      }
    }
  } else {
    contentMarkup = <TextField label="Đường dẫn ảnh" placeholder="https://" value={src} onChange={setSrc} />;
  }

  const handleSubmit = () => {
    if (tab === Tab.FromUrl) {
      onInsertImage({ images: [{ src }] });
    } else {
      onInsertImage({
        images: selectedItems.map((item) => ({
          src: size !== "" ? getMediaResizedImage(item.src, size as ResizedImageType) : item.src,
        })),
      });
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Chèn ảnh"
      instant
      primaryAction={{
        content: "Chèn ảnh",
        disabled: !selectedItems.length && !src,
        onAction: handleSubmit,
      }}
      secondaryActions={filterNonNull<ComplexAction>([
        {
          content: "Hủy",
          onAction: onClose,
        },
        tab === Tab.FromFile
          ? {
              content: "Tải ảnh lên",
              loading: isCreatingFile,
              onAction: () => uploadFileRef.current?.click(),
            }
          : null,
      ])}
      footer={paginationMarkup}
    >
      <Tabs
        tabs={[
          {
            id: "product",
            content: "Ảnh sản phẩm",
          },
          {
            id: "uploaded",
            content: "Ảnh đã tải lên",
          },
          {
            id: "url",
            content: "URL",
          },
        ]}
        selected={tab}
        onSelect={handleChangeTab}
      />
      <Modal.Section>
        {contentMarkup}
        {tab === Tab.FromFile && (
          <input
            ref={uploadFileRef}
            type="file"
            hidden
            multiple
            accept={validImageFileExtensions.join(", ")}
            onChange={handleUploadFile}
          />
        )}
      </Modal.Section>
      {selectedItems.length ? (
        <Modal.Section subdued>
          <Select2 value={size} onChange={setSize} label="Kích thước" options={imageOptions} />
        </Modal.Section>
      ) : null}
    </Modal>
  );
};

const StyledImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(${(p) => p.theme.components.modal.maxWidth} / 5 - 2 * ${(p) => p.theme.spacing(4)}), 1fr)
  );
  grid-gap: ${(p) => p.theme.spacing(4)};
  position: relative;
`;

const StyledImageSkeleton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  aspect-ratio: 1/1;
`;
