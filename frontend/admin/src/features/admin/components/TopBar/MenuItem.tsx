import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Icon, type IconSource } from "@/ui-components";

interface Props {
  badge?: string;
  icon: IconSource;
  onClick(): void;
}

export function MenuItem({ icon, badge, onClick }: Props) {
  return (
    <StyledMenuItem type="button" onClick={onClick}>
      <Icon source={icon} />
      {badge ? (
        <StyledBadge>
          <Badge status="new" size="small">
            {badge}
          </Badge>
        </StyledBadge>
      ) : null}
    </StyledMenuItem>
  );
}

const StyledMenuItem = styled.button`
  position: relative;
  padding: calc((${(p) => p.theme.spacing(2)} + ${(p) => p.theme.spacing(0.5)}) / 2) ${(p) => p.theme.spacing(2)};
  border: none;
  background: none;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  min-width: ${(p) => p.theme.components.form.controlHeight};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  &:hover {
    background: ${(p) => p.theme.colors.actionSecondaryHovered};
    svg {
      fill: ${(p) => p.theme.colors.iconHovered};
      color: ${(p) => p.theme.colors.iconHovered};
    }
  }
  &[data-state="open"],
  &:active {
    background: ${(p) => p.theme.colors.actionSecondaryPressed};
    svg {
      fill: ${(p) => p.theme.colors.iconPressed};
      color: ${(p) => p.theme.colors.iconPressed};
    }
  }

  &:focus-visible {
    outline: ${(p) => p.theme.shape.borderWidth(2)} solid ${(p) => p.theme.colors.borderInteractiveFocus};
    outline-offset: ${(p) => p.theme.spacing(0.25)};
  }
`;

const StyledBadge = styled.span`
  position: absolute;
  bottom: calc(100% - 20px);
  left: calc(100% - 20px);
  pointer-events: none;
  & > span {
    padding: ${(p) => p.theme.spacing(0.25, 1)};
    min-width: calc(${(p) => `${p.theme.spacing(4)} + ${p.theme.spacing(0.5)}`});
    justify-content: center;
  }
`;
