import React from "react";
import styled from "@emotion/styled";
import { ExitIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { Icon } from "../Icon";
import { Text } from "../Text";

export interface FullscreenBarProps {
  /** Callback khi back button được click */
  onAction: () => void;
  /** Phần tử con */
  children?: React.ReactNode;
}

/**
 * Fullscreen Bar cung cấp trải nghiệm đồng nhất nút thoát cho app trong chế độ fullscreen.
 *
 * Component này thường được app đặt phía trên đầu và có thể customize bằng cách tùy chỉnh thuộc tính "children"
 */
export function FullscreenBar({ onAction, children }: FullscreenBarProps) {
  const i18n = useI18n();
  return (
    <StyledFullscreenBar>
      <StyledBackAction onClick={onAction}>
        <Icon source={ExitIcon} />
        <Text as="span">{i18n.translate("UI.FullscreenBar.exitPage")}</Text>
      </StyledBackAction>
      {children}
    </StyledFullscreenBar>
  );
}

const StyledFullscreenBar = styled.div`
  position: relative;
  display: flex;
  height: ${(p) => p.theme.components.topBar.height};
  box-shadow: ${(p) => p.theme.shadow.topBar};
  background-color: ${(p) => p.theme.colors.surface};
`;

const StyledBackAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing(1)};
  flex: 0 1 auto;
  padding-left: ${(p) => p.theme.spacing(3)};
  padding-right: ${(p) => p.theme.spacing(3)};
  border-width: 0;
  border-right: ${(p) => p.theme.shape.borderBase};
  background-color: ${(p) => p.theme.colors.surface};
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  cursor: pointer;

  & span {
    padding-right: ${(p) => p.theme.spacing(0.5)};
    color: ${(p) => p.theme.colors.text};
  }
`;
