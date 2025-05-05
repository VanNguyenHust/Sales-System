import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Checkbox, Text, Tooltip } from "@/ui-components";

import { ChannelOption } from "./types";

export const ChannelItem = ({
  option,
  checked,
  onChange,
}: {
  option: ChannelOption;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => {
  const titleMarkup = option.disabled ? (
    <Tooltip
      content={
        <Text as="span" variant="bodySm">
          Gói dịch vụ chưa hỗ trợ kênh này
        </Text>
      }
      width="wide"
    >
      <Text as="span" fontWeight="medium">
        {option.title}
      </Text>
    </Tooltip>
  ) : (
    <Text as="span" fontWeight="medium">
      {option.title}
    </Text>
  );

  return (
    <StyledChannelItem
      isChecked={checked}
      isDisabled={option.disabled}
      onClick={() => !option.disabled && onChange(!checked)}
    >
      <Checkbox checked={checked} disabled={option.disabled} />
      <StyledIcon>{option.icon}</StyledIcon>
      <StyledContent>
        {titleMarkup}
        <Text as="p" variant="bodySm">
          <StyledDescription>{option.description}</StyledDescription>
        </Text>
      </StyledContent>
    </StyledChannelItem>
  );
};

const StyledIcon = styled.div`
  margin-left: ${(p) => p.theme.spacing(3)};
  margin-right: ${(p) => p.theme.spacing(2)};
  width: ${(p) => p.theme.spacing(6)};
  height: ${(p) => p.theme.spacing(6)};
  flex-shrink: 0;
  svg,
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const StyledContent = styled.div``;

const StyledDescription = styled.span`
  color: ${(p) => p.theme.colors.iconPressed};
`;

const StyledChannelItem = styled.div<{ isChecked: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${(p) => `calc(${p.theme.spacing(2)} - ${p.theme.spacing(0.25)}) ${p.theme.spacing(4)}`};
  background: ${(p) =>
    p.isChecked
      ? p.theme.colors.surfaceSelected
      : p.isDisabled
      ? p.theme.colors.borderDisabled
      : p.theme.colors.surface};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border: ${(p) =>
    p.isChecked ? `1px solid ${p.theme.colors.borderInteractiveFocus}` : p.theme.shape.borderTransparent};
  cursor: pointer;
  ${(p) =>
    p.isDisabled &&
    css`
      cursor: not-allowed;
      background: ${p.theme.colors.borderDisabled};
      ${StyledIcon} {
        cursor: not-allowed;
        svg {
          rect {
            filter: brightness(0) saturate(100%) invert(96%) sepia(1%) saturate(6137%) hue-rotate(182deg)
              brightness(73%) contrast(80%);
          }
          path {
            fill: #fff !important;
            &[style="fill: rgb(13, 180, 115);"],
            &[style="fill: rgb(0, 124, 232);"] {
              fill: #a1a7ae !important;
            }
          }
        }
      }
      ${StyledContent} {
        cursor: not-allowed;
        color: ${p.theme.colors.textDisabled};
      }
    `}
`;
