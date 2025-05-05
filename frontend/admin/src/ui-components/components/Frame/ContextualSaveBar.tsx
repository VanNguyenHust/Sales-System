import React, { useCallback } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ContextualSaveBarAction, ContextualSaveBarDiscardAction } from "../../types";
import { buttonFrom } from "../../utils/buttonFrom";
import { useI18n } from "../../utils/i18n";
import { useToggle } from "../../utils/useToggle";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";
import { Modal } from "../Modal";
import { Text } from "../Text";

import { useFrame } from "./useFrame";

export interface ContextualSaveBarProps {
  /** Tiêu đề thanh */
  message?: string;
  /** Bỏ max-width mặc định của ContextualSaveBar */
  fullWidth?: boolean;
  /** Action khi lưu */
  saveAction?: ContextualSaveBarAction;
  /** Secondary action */
  secondaryAction?: ContextualSaveBarAction;
  /** Action khi huỷ */
  discardAction?: ContextualSaveBarDiscardAction;
}

export function ContextualSaveBar({
  message,
  fullWidth,
  saveAction,
  discardAction,
  secondaryAction,
}: ContextualSaveBarProps) {
  const i18n = useI18n();
  const {
    value: activeConfirmationModal,
    setFalse: closeConfirmationModal,
    setTrue: openConfirmationModal,
  } = useToggle(false);
  const { offset: frameOffset, navigationMinimized, hasNavigation } = useFrame();

  const handleDiscardClick = useCallback(() => {
    if (discardAction?.url) {
      return;
    }
    if (discardAction?.discardConfirmationModal) {
      openConfirmationModal();
    } else {
      discardAction?.onAction?.();
    }
  }, [discardAction, openConfirmationModal]);

  const handleConfirmDiscard = () => {
    closeConfirmationModal();
    discardAction?.onAction?.();
  };

  const secondaryActionMarkup = secondaryAction ? buttonFrom(secondaryAction, { outline: true, primary: true }) : null;

  const discardConfirmModalMarkup =
    discardAction && discardAction.onAction ? (
      <Modal
        open={activeConfirmationModal}
        onClose={closeConfirmationModal}
        divider={false}
        size="small"
        title={i18n.translate("UI.ContextualSaveBar.DiscardConfirmationModal.title")}
        sectioned
        primaryAction={{
          content: i18n.translate("UI.ContextualSaveBar.DiscardConfirmationModal.primaryAction"),
          destructive: true,
          onAction: handleConfirmDiscard,
        }}
        secondaryActions={[
          {
            content: i18n.translate("UI.ContextualSaveBar.DiscardConfirmationModal.secondaryAction"),
            outline: false,
            onAction: closeConfirmationModal,
          },
        ]}
      >
        <Text as="p" fontWeight="regular">
          {i18n.translate("UI.ContextualSaveBar.DiscardConfirmationModal.message")}
        </Text>
      </Modal>
    ) : null;

  return (
    <StyledContextualSaveBar role="ContextualSaveBar">
      <StyledContainer
        frameOffset={frameOffset}
        navigationMinimized={navigationMinimized}
        hasNavigation={hasNavigation}
      >
        <StyledContent fullWidth={fullWidth}>
          {message ? (
            <Text variant="headingSm" as="h4" fontWeight="medium" color="subdued" truncate>
              {message}
            </Text>
          ) : (
            <span />
          )}
          <ButtonGroup noWrap>
            {discardAction ? (
              <Button primary outline {...discardAction} onClick={handleDiscardClick}>
                {discardAction.content || i18n.translate("UI.ContextualSaveBar.discard")}
              </Button>
            ) : null}
            {secondaryActionMarkup}
            {saveAction ? (
              <Button primary {...saveAction} onClick={saveAction.onAction}>
                {saveAction.content ? saveAction.content : i18n.translate("UI.ContextualSaveBar.save")}
              </Button>
            ) : null}
          </ButtonGroup>
        </StyledContent>
        {discardConfirmModalMarkup}
      </StyledContainer>
    </StyledContextualSaveBar>
  );
}

const StyledContextualSaveBar = styled.div`
  display: flex;
  background-color: ${(p) => p.theme.colors.surface};
`;

const StyledContainer = styled.div<{
  frameOffset?: string;
  hasNavigation?: boolean;
  navigationMinimized?: boolean;
}>`
  width: 100%;
  ${(p) => p.theme.breakpoints.up("sm")} {
    width: calc(100vw - var(--ui-app-provider-scrollbar-width));
  }

  ${(p) =>
    p.hasNavigation &&
    css`
      ${p.theme.breakpoints.up("md")} {
        width: calc(
          100vw - ${p.frameOffset} -
            ${p.navigationMinimized
              ? p.theme.components.navigation.collapsedWidth
              : p.theme.components.navigation.baseWidth} - var(--ui-app-provider-scrollbar-width)
        );
        .ui-frame-collapse-enter &,
        .ui-frame-collapse-exit & {
          transition: width ${p.theme.motion.duration300} ${p.theme.motion.transformEaseInOut};
        }
      }
    `}

  display: flex;
  height: ${(p) => p.theme.components.topBar.height};
`;

const StyledContent = styled.div<{
  fullWidth?: boolean;
}>`
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing(0, 4)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: ${(p) => p.theme.spacing(0, 8)};
  }

  max-width: calc(
    ${(p) => p.theme.components.layout.widthPrimary} + ${(p) => p.theme.components.layout.widthSecondary} +
      ${(p) => p.theme.components.layout.widthInnerSpacingBase}
  );
  margin: 0 auto;
  ${(p) =>
    p.fullWidth &&
    css`
      max-width: none;
    `}
`;
