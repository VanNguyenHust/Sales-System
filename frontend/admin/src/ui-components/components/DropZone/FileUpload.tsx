import React, { useContext } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { PlusIcon } from "@/ui-icons";

import { useI18n } from "../../utils/i18n";
import { capitalize } from "../../utils/strings";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Text } from "../Text";

import { DropZoneContext } from "./context";

export interface FileUploadProps {
  /** Tiêu đề của hành động */
  actionTitle?: string;
  /** Gợi ý của hành động */
  actionHint?: string;
}

export function FileUpload({ actionTitle, actionHint }: FileUploadProps) {
  const i18n = useI18n();
  const { disabled, size, type, allowMultiple } = useContext(DropZoneContext);

  const typeSuffix = capitalize(type);
  const allowMultipleKey = allowMultiple ? "multiple" : "single";
  actionTitle = actionTitle || i18n.translate(`UI.DropZone.${allowMultipleKey}.actionTitle${typeSuffix}`);
  const actionMarkup = (
    <StyledAction $disabled={disabled}>
      <Text as="span" variant="bodyMd" fontWeight="medium">
        {actionTitle}
      </Text>
    </StyledAction>
  );
  const actionHintMarkup = actionHint ? (
    <Text variant="bodyMd" as="span" color="subdued">
      {actionHint}
    </Text>
  ) : null;

  const viewMarkup =
    size !== "small" ? (
      <Stack alignment="center" spacing="extraTight" vertical>
        {actionMarkup}
        {actionHintMarkup}
      </Stack>
    ) : (
      <Icon source={PlusIcon} color="base" />
    );

  return <StyledFileUpload $size={size}>{viewMarkup}</StyledFileUpload>;
}

const StyledFileUpload = styled.div<{
  $size: string;
}>`
  padding: ${(p) => {
    switch (p.$size) {
      case "small":
        return p.theme.spacing(3);
      case "large":
        return p.theme.spacing(8);
      default:
        return p.theme.spacing(4);
    }
  }};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledAction = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  border: none;
  padding: ${(p) => p.theme.spacing(1, 2)};
  margin: 0;
  text-decoration: none;
  color: ${(p) => p.theme.colors.textSubdued};
  background: ${(p) => p.theme.colors.surfaceSelectedPressed};
  cursor: pointer;
  text-align: center;
  appearance: none;

  ${(p) =>
    p.$disabled &&
    css`
      cursor: not-allowed;
      box-shadow: none;
      color: ${p.theme.colors.textDisabled};
      background: ${p.theme.colors.surfaceDisabled};
    `}
`;
