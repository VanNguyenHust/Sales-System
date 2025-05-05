import { useState } from "react";
import { Button, Modal, Select2, TextField } from "@/ui-components";

import { getMediaResizedImage, getMediaSizeFromSrc, isSapoCdnUrl, ResizedImageType } from "app/utils/url";

import { imageOptions } from "../types";

type ImageItem = {
  alt?: string;
  src: string;
};

type Props = {
  selectedAlt: string;
  selectedSrc: string;
  onClose(): void;
  onUpdateImage(image: ImageItem): void;
  onDeleteImage(): void;
};

export const EditImageModal = ({ onClose, selectedAlt, selectedSrc, onUpdateImage, onDeleteImage }: Props) => {
  const selectedSize = getMediaSizeFromSrc(selectedSrc);

  const [alt, setAlt] = useState(selectedAlt);
  const [size, setSize] = useState<string>(selectedSize.size);
  const [src, setSrc] = useState(selectedSize.originSrc);

  const isSapoCdn = isSapoCdnUrl(selectedSrc);

  const handleSubmit = () => {
    onUpdateImage({
      alt,
      src: isSapoCdn && size.length ? getMediaResizedImage(src, size as ResizedImageType) : src,
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Sửa ảnh"
      instant
      primaryAction={{
        content: "Sửa ảnh",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: onClose,
        },
      ]}
      footer={
        <Button onClick={onDeleteImage} destructive>
          Xóa ảnh
        </Button>
      }
    >
      {!isSapoCdn && (
        <Modal.Section subdued>
          <TextField label="Đường dẫn ảnh" placeholder="https://" value={src} onChange={setSrc} />
        </Modal.Section>
      )}
      <Modal.Section subdued>
        <TextField
          value={alt}
          onChange={setAlt}
          label="ALT của ảnh"
          placeholder="Nhập ALT của ảnh"
          helpText="Bổ sung thẻ ALT để tối ưu SEO và giúp ảnh dễ hiểu với khách hàng."
        />
      </Modal.Section>
      {isSapoCdn && (
        <Modal.Section subdued>
          <Select2 value={size} onChange={setSize} label="Kích thước" options={imageOptions} />
        </Modal.Section>
      )}
    </Modal>
  );
};
