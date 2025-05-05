import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon } from "@/ui-components";
import { CircleCheckOutlineIcon } from "@/ui-icons";

import { getMediaResizedImage } from "app/utils/url";

type Props = {
  src: string;
  selected?: boolean;
  onClick?(): void;
};

export function ImageItem({ src, selected, onClick }: Props) {
  return (
    <StyledWrapper>
      {selected && (
        <StyledActiveIcon>
          <Icon source={CircleCheckOutlineIcon} color="primary" />
        </StyledActiveIcon>
      )}
      <StyledItem isActive={selected} onClick={onClick}>
        <StyledImage src={getMediaResizedImage(src, "compact")} />
      </StyledItem>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledItem = styled.button<{ isActive?: boolean }>`
  width: 100%;
  height: 100%;
  outline: none;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: ${(p) => p.theme.shape.borderBase};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  box-sizing: border-box;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  :hover {
    border-color: ${(p) => p.theme.colors.actionPrimaryHovered};
  }
  :focus-visible {
    outline: 1px solid ${(p) => p.theme.colors.actionPrimaryHovered};
  }
  ${(p) =>
    p.isActive &&
    css`
      border-color: ${p.theme.colors.actionPrimaryHovered};
    `}
`;

const StyledImage = styled.img`
  position: absolute;
  bottom: 0;
  display: block;
  left: 0;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
  pointer-events: none;
  right: 0;
  top: 0;
  content-visibility: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledActiveIcon = styled.span`
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: -10px;
  right: -10px;
  z-index: 1;
  background-color: ${(p) => p.theme.colors.surface};
  border-radius: ${(p) => p.theme.shape.borderRadius("full")};
`;
