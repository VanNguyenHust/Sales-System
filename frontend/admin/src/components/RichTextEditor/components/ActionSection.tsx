import { useCallback } from "react";
import styled from "@emotion/styled";
import { Popover, PopoverCloseSource } from "@/ui-components";

import { useFullscreen } from "../context";
import { GroupAction, PopoverActionType } from "../types";

import { ActionButton } from "./ActionButton";
import { TooltipButton } from "./TooltipButton";

type Props = {
  section: GroupAction;
  popoverVisible?: PopoverActionType;
  overflow?: boolean;
  onOpenPopover(type: PopoverActionType, overflow?: boolean): void;
  onClosePopover(): void;
};

export const ActionSection = ({
  section: { key, items },
  overflow,
  popoverVisible,
  onOpenPopover,
  onClosePopover,
}: Props) => {
  const isFullscreen = useFullscreen();
  const popoverAction = useCallback(
    (key: PopoverActionType, overflow?: boolean) => () => {
      if (popoverVisible === key) {
        onClosePopover();
      } else {
        onOpenPopover(key, overflow);
      }
    },
    [popoverVisible, onOpenPopover, onClosePopover]
  );

  return (
    <StyledSection>
      {items?.map(({ label, content, onClick, pressed, disabled, icon, magic, popover }) => {
        if (!popover) {
          return (
            <TooltipButton content={label} disabled={disabled} key={label}>
              <StyledButtonContainer>
                <ActionButton onClick={onClick} pressed={pressed} magic={magic} disabled={disabled} icon={icon}>
                  {content}
                </ActionButton>
              </StyledButtonContainer>
            </TooltipButton>
          );
        }

        const { key, ...restPopoverProps } = popover;
        const activator = (
          <StyledButtonContainer>
            <TooltipButton content={label} disabled={disabled}>
              <ActionButton
                onClick={popoverAction(popover.key, overflow)}
                pressed={pressed}
                disabled={disabled}
                icon={icon}
                magic={magic}
                disclosure
              >
                {content}
              </ActionButton>
            </TooltipButton>
          </StyledButtonContainer>
        );

        return (
          <Popover
            key={key ?? label}
            activator={activator}
            onClose={(source) => {
              if (isFullscreen && source === PopoverCloseSource.ScrollOut) {
                return;
              }
              onClosePopover();
            }}
            preferredPosition="below"
            preventCloseOnChildOverlayClick
            {...restPopoverProps}
          >
            {popover.children}
          </Popover>
        );
      })}
    </StyledSection>
  );
};

const StyledSection = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  gap: ${(p) => p.theme.spacing(1)};

  &:not(:last-child):after {
    content: "";
    display: block;
    height: 1.25rem;
    margin-left: ${(p) => p.theme.spacing(1)};
    border-left: ${(p) => p.theme.shape.borderDivider};
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
  > div,
  > div > div {
    display: flex;
  }
`;

export const StyledOverflowContainer = styled.div`
  padding: calc(${(p) => p.theme.spacing(0.5)} + ${(p) => p.theme.spacing(1)}) ${(p) => p.theme.spacing(2)};

  ${StyledSection} {
    display: contents;
    > div {
      display: inline-block;
      vertical-align: middle;
      margin-top: ${(p) => p.theme.spacing(0.5)};
      margin-bottom: ${(p) => p.theme.spacing(0.5)};
    }

    > div:not(:first-child) {
      margin-left: ${(p) => p.theme.spacing(1)};
    }

    &:not(:last-child):after {
      display: inline-block;
      vertical-align: middle;
      margin-left: ${(p) => p.theme.spacing(1)};
      margin-right: ${(p) => p.theme.spacing(1)};
    }
  }
`;
