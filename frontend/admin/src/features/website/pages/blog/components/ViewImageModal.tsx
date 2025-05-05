import styled from "@emotion/styled";
import { Modal } from "@/ui-components";

import { ArticleImageRequest } from "app/features/website/types";

import { getImageSrc } from "../../../utils/other";

interface Props {
  image: ArticleImageRequest;
  onClose: () => void;
}

export function ViewImageModal({ image, onClose }: Props) {
  return (
    <Modal title="Ảnh danh mục bài viết" open onClose={onClose} sectioned>
      <Modal.Section>
        <StyledView>{image ? <StyledImage src={getImageSrc(image)} alt={image.alt} /> : ""}</StyledView>
      </Modal.Section>
    </Modal>
  );
}

const StyledView = styled.div`
  display: flex;
  height: 300px;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${(p) => p.theme.shape.borderRadius("large")};
`;
