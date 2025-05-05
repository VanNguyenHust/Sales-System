import { useState } from "react";
import styled from "@emotion/styled";
import { Button, type ComplexAction, Modal, ModalCloseSource } from "@/ui-components";

interface Props {
  onDismiss(source: "close" | "dismiss"): void;
  dismissText?: string;
  confirmAction: ComplexAction;
  media?: {
    type: "image" | "video";
    src: string;
  };
  children: React.ReactNode;
}

export function NewFeatureModal({
  onDismiss,
  confirmAction,
  media,
  children,
  dismissText = "Không hiển thị lại nữa",
}: Props) {
  return (
    <Modal
      open
      onClose={(source) => (source === ModalCloseSource.CloseButtonClick ? onDismiss("close") : undefined)}
      size="small"
      limitHeight
      footer={
        <StyledActions>
          <Button onClick={() => onDismiss("dismiss")} plain>
            {dismissText}
          </Button>
          <Button
            onClick={confirmAction.onAction}
            loading={confirmAction.loading}
            disabled={confirmAction.disabled}
            url={confirmAction.url}
            primary
          >
            {confirmAction.content}
          </Button>
        </StyledActions>
      }
    >
      {media ? (
        <StyledMedia>
          {media.type === "image" ? (
            <LazyImage src={media.src} />
          ) : (
            <StyledVideo controls autoPlay muted loop>
              <source src={media.src} type="video/mp4" />
              Your browser does not support the video tag.
            </StyledVideo>
          )}
        </StyledMedia>
      ) : null}
      <StyledContent>{children}</StyledContent>
    </Modal>
  );
}

function LazyImage({ src }: { src: string }) {
  const [loading, setLoading] = useState(true);
  const imageMarkup = <StyledImage src={src} onLoad={() => setLoading(false)} />;
  if (loading) {
    return <StyledImageSkeleton>{imageMarkup}</StyledImageSkeleton>;
  }
  return imageMarkup;
}

const StyledContent = styled.div`
  padding: ${(p) => p.theme.spacing(4, 4, 2, 4)};
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const StyledImageSkeleton = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  > * {
    width: 0;
    height: 0;
    border: none;
    visibility: hidden;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  max-height: 300px;
`;

const StyledMedia = styled.div`
  &,
  & video,
  & img {
    border-top-right-radius: ${(p) => p.theme.shape.borderRadius("base")};
    border-top-left-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }
`;

const StyledActions = styled.div`
  display: flex;
  padding: ${(p) => p.theme.spacing(4)};
  gap: ${(p) => p.theme.spacing(4)};
  justify-content: flex-end;
`;
