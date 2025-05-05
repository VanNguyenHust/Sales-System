import React from "react";
import styled from "@emotion/styled";
import { EclipseIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { Text } from "../Text";

export interface SpinnerProps {
  /**
   * Kích thước spinner
   * @default "large"
   * */
  size?: "small" | "large";
  /** label accessibility */
  accessibilityLabel?: string;
}

export function Spinner({ size = "large", accessibilityLabel }: SpinnerProps) {
  const i18n = useI18n();
  const label = accessibilityLabel || i18n.translate("UI.Spinner.loadingAccessibilityLabel");
  return (
    <StyledSpinner size={size}>
      <EclipseIcon />
      <span role="status">
        <Text as="span" visuallyHidden>
          {label}
        </Text>
      </span>
    </StyledSpinner>
  );
}

const StyledSpinner = styled.span<{ size?: SpinnerProps["size"] }>`
  svg {
    animation: ${(p) => p.theme.motion.keyframeSpin} ${(p) => p.theme.motion.duration500} linear infinite;
    width: ${(p) => (p.size === "small" ? p.theme.spacing(5) : p.theme.spacing(10))};
    height: ${(p) => (p.size === "small" ? p.theme.spacing(5) : p.theme.spacing(10))};
  }
`;
