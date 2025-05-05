import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Modal, Text, TextField } from "@/ui-components";

import { ArticleImageRequest } from "app/features/website/types";

import { getImageSrc } from "../../../utils/other";

interface EditImageAltProps {
  image: ArticleImageRequest;
  alt: string;
  onSubmit?(value: string): void;
  onClose(): void;
}

export const EditImageAltModal = ({ image, alt, onSubmit, onClose }: EditImageAltProps) => {
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  useEffect(() => {
    if (image && alt) setTextFieldValue(alt || "");
  }, [alt, image]);

  const handleClose = () => {
    setTextFieldValue("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.(textFieldValue);
    handleClose();
  };

  return (
    <Modal
      open
      title="Sửa ALT của ảnh"
      onClose={handleClose}
      sectioned
      secondaryActions={[{ content: "Hủy", onAction: handleClose }]}
      primaryAction={{ content: "Xác nhận", onAction: handleSubmit, disabled: textFieldValue === (alt || "") }}
    >
      <StyledContainer>
        <StyledTextFieldWrapper>
          <Text as="p">Bổ sung thẻ ALT để tối ưu SEO và giúp ảnh dễ hiểu với khách hàng.</Text>
          <TextField
            value={textFieldValue}
            onChange={setTextFieldValue}
            label="ALT của ảnh"
            placeholder="Nhập ALT của ảnh"
          />
        </StyledTextFieldWrapper>
        {image ? <StyledImage src={getImageSrc(image)} alt={alt} /> : null}
      </StyledContainer>
    </Modal>
  );
};

const StyledContainer = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 90px;
  gap: ${(p) => p.theme.spacing(4)};
`;

const StyledTextFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(4)};
`;

const StyledImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: ${(p) => p.theme.shape.borderRadius("large")};
`;
