import React, { useCallback, useRef } from "react";
import styled from "@emotion/styled";

export interface SearchProps {
  /** Hiển thị kết quả tìm kiếm */
  visible?: boolean;
  /** Dữ liệu hiển thị trong search */
  children?: React.ReactNode;
  /** Hiển thị overlay */
  overlayVisible?: boolean;
  /** Hàm gọi lại xử lý khi dismiss search */
  onDismiss?(): void;
}

export function Search({ visible, children, onDismiss, overlayVisible = false }: SearchProps) {
  const refOverlay = useRef<HTMLDivElement>(null);
  const handleDismiss = useCallback(
    ({ target }: React.MouseEvent<HTMLDivElement>) => {
      if (target === refOverlay.current && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const overlayMarkup = visible ? (
    <StyledOverlay onClick={handleDismiss} ref={refOverlay} visible={overlayVisible} />
  ) : null;

  return children ? (
    <>
      {overlayMarkup}
      <StyledSearch visible={Boolean(visible)}>{children}</StyledSearch>
    </>
  ) : null;
}

const StyledOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${(p) => p.theme.zIndex(1)};
  height: 100%;
`;

const StyledSearch = styled.div<{ visible: boolean }>`
  position: fixed;
  visibility: ${(p) => (p.visible ? "initial" : "hidden")};
  z-index: ${(p) => p.theme.zIndex(2)};
  pointer-events: ${(p) => (p.visible ? "all" : "none")};
  top: ${(p) => p.theme.components.topBar.height};
  left: 0;
  right: 0;
  box-shadow: ${(p) => p.theme.shadow.topBarSearchPopover};
  border: ${(p) => p.theme.shape.borderBase};
  overflow: hidden;
  background: ${(p) => p.theme.colors.surface};
  ${(p) => p.theme.breakpoints.up("sm")} {
    position: absolute;
    top: 100%;
    max-width: ${(p) => p.theme.components.topBar.searchMaxWidth};
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  }
  ${(p) => p.theme.breakpoints.up("md")} {
    margin-top: ${(p) => p.theme.spacing(1)};
  }
`;
