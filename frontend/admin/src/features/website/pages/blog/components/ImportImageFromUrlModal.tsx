import { useState } from "react";
import styled from "@emotion/styled";
import { Modal, TextField } from "@/ui-components";

import { checkImageSizeFromUrl } from "app/features/product/utils/product";
import { ArticleImageRequest } from "app/features/website/types";

interface Props {
  onSubmit?(image: ArticleImageRequest): void;
  onClose(): void;
}

export function ImportImageFromUrlModal({ onSubmit, onClose }: Props) {
  const [textFieldValue, setTextFieldValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleClose = () => {
    setTextFieldValue("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (textFieldValue && onSubmit) {
      const image: ArticleImageRequest = {
        src: textFieldValue,
      };
      setLoading(false);
      onSubmit(image);
      handleClose();
    }
  };
  const handleValidateBeforeSubmit = async () => {
    setLoading(true);
    const isInSize = await checkImageSizeFromUrl(textFieldValue);
    if (isInSize === "success") {
      await handleSubmit();
    } else if (isInSize === "error") {
      setError("Không thể tải ảnh từ đường dẫn");
    } else if (isInSize === "outofsize") {
      setError("Dung lượng ảnh tối đa là 2MB");
    }
    setLoading(false);
  };

  return (
    <Modal
      open
      title="Thêm ảnh từ URL"
      onClose={handleClose}
      sectioned
      secondaryActions={[{ content: "Hủy", loading: isLoading, onAction: handleClose }]}
      primaryAction={{
        content: "Xác nhận",
        loading: isLoading,
        onAction: handleValidateBeforeSubmit,
        disabled: !(textFieldValue.trim().length > 0),
      }}
    >
      <StyledContainer>
        <StyledTextFieldWrapper>
          <TextField
            autoFocus
            value={textFieldValue}
            onChange={setTextFieldValue}
            label="Đường dẫn ảnh"
            placeholder="https://"
            error={error}
          />
        </StyledTextFieldWrapper>
      </StyledContainer>
    </Modal>
  );
}

const StyledContainer = styled.div`
  display: grid;
  align-items: center;
`;

const StyledTextFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(4)};
`;
