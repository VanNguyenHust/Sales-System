import styled from "@emotion/styled";
import React, { useRef, useState } from "react";

interface ImageFile {
  file: File;
  url: string;
}

const ProductImageUploadCard: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ImageFile[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push({ file, url: URL.createObjectURL(file) });
      }
    });
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; // reset input
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (url: string) => {
    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  return (
    <CardContainer>
      {images.length === 0 ? (
        <UploadBox onClick={handleClickUpload}>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <TextNormal>
            Kéo thả hoặc <LinkText>thêm ảnh từ URL</LinkText>
            <br />
            <LinkText onClick={handleClickUpload}>
              Tải ảnh lên từ thiết bị
            </LinkText>
          </TextNormal>
          <TextSmall>(Dung lượng ảnh tối đa 2MB)</TextSmall>
        </UploadBox>
      ) : (
        <ImageList>
          {images.map((img, idx) => (
            <ImageItem key={img.url}>
              <ImageThumb src={img.url} alt={`Ảnh ${idx + 1}`} />
              <RemoveBtn onClick={() => handleRemove(img.url)}>×</RemoveBtn>
            </ImageItem>
          ))}
          <UploadItem onClick={handleClickUpload}>
            <PlusSignSmall>+</PlusSignSmall>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </UploadItem>
        </ImageList>
      )}
    </CardContainer>
  );
};

export default ProductImageUploadCard;

const CardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

const UploadBox = styled.div`
  border: 1.5px dashed #bfbfbf;
  border-radius: 8px;
  padding: 24px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
`;

const PlusSignLarge = styled.span`
  font-size: 32px;
  font-weight: 400;
  color: #bfbfbf;
  margin-bottom: 8px;
`;

const TextNormal = styled.div`
  color: #595959;
  font-size: 15px;
  text-align: center;
  margin-bottom: 4px;
`;

const LinkText = styled.span`
  color: #1890ff;
  cursor: pointer;
  font-weight: 500;
`;

const TextSmall = styled.div`
  color: #bfbfbf;
  font-size: 13px;
  margin-top: 2px;
`;

const ImageList = styled.div`
  display: flex;
  gap: 12px;
`;

const ImageItem = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &:hover button {
    opacity: 1;
  }
`;

const ImageThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
`;

const UploadItem = styled.div`
  width: 72px;
  height: 72px;
  border: 1.5px dashed #bfbfbf;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  font-size: 24px;
  color: #bfbfbf;
  transition: border-color 0.2s;
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const PlusSignSmall = styled.span`
  font-size: 24px;
  font-weight: 400;
`;
