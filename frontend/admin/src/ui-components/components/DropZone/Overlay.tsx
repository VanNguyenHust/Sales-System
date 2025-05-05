import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Stack } from "../Stack";
import { Text } from "../Text";

import { DropZoneSize } from "./types";

export interface OverlayProps {
  error?: boolean;
  size?: DropZoneSize;
  content: string;
}

export function Overlay({ content, error, size }: OverlayProps) {
  return (
    <StyledOverlay $size={size} error={error}>
      <Stack spacing="extraLoose" alignment="center" vertical>
        <Text variant="bodySm" as="p" fontWeight="bold">
          {content}
        </Text>
      </Stack>
    </StyledOverlay>
  );
}

const StyledOverlay = styled.div<{
  $size?: OverlayProps["size"];
  error?: boolean;
}>`
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  z-index: ${(p) => p.theme.zIndex.inputContent};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(p) => (p.$size !== "small" ? p.theme.spacing(4) : p.theme.spacing(1))};
  border: ${(p) => `${p.theme.shape.borderWidth(1)} ${p.theme.colors.interactive}`} dashed;
  text-align: center;
  color: ${(p) => p.theme.colors.interactive};
  background-color: ${(p) => p.theme.colors.surfaceHighlight};
  pointer-events: none;
  width: 100%;

  ${(p) =>
    p.error &&
    css`
      border-color: ${p.theme.colors.borderCritical};
      color: ${p.theme.colors.textCritical};
      background-color: ${p.theme.colors.surfaceNeutralCritical};
    `}
`;
