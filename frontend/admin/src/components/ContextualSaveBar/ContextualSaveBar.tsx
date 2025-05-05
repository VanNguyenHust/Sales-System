import React, { useCallback, useContext, useEffect, useRef } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";
import { ContextualSaveBar as UIContextualSaveBar, type ContextualSaveBarProps } from "@/ui-components";

import { useMobileBridge } from "app/features/mobile-bridge";
import {
  ContextualSaveBar as MobileBridgeContextualSaveBar,
  ContextualSaveBarProps as MobileBridgeContextualSaveBarProps,
} from "app/features/mobile-bridge/components/ContextualSaveBar";
import { dispatchRedirect } from "app/features/mobile-bridge/util/dispatchRedirect";
import { SettingLayoutContext } from "app/features/setting/components/SettingLayout/context";
import { isSapoMobileBridge } from "app/utils/mobile";

import { LeavePageContext } from "../leave-page/context";

import { SettingContextualSaveBar } from "./SettingContextualSaveBar";

type Props = ContextualSaveBarProps & {
  /**
   * Ẩn/hiện ContextualSaveBar
   */
  visible?: boolean;
  /**
   * Bỏ confirm khi rời trang
   */
  leaveConfirmationDisable?: boolean;
  /**
   * Nếu true thì sẽ so sánh pathname hiện tại và pathname sau khi thay đổi, nếu giống nhau thì sẽ không hiện modal xác nhận
   * @default true
   */
  pathnameOnly?: boolean;
};

/**
 * Universal ContextualSaveBar
 *
 * - in web: using ContextualSaveBar ui-component or SettingContextualSaveBar in setting context
 * - in mobible bridge: using ContextualSaveBar action
 */
export function ContextualSaveBar({ visible, leaveConfirmationDisable, pathnameOnly = true, ...restProps }: Props) {
  const { saveAction: saveActionProp, discardAction: discardActionProp, message, fullWidth } = restProps;
  const app = useMobileBridge();
  const confirmedRef = useRef(false);
  const settingContext = useContext(SettingLayoutContext);

  useEffect(() => {
    if (!saveActionProp?.loading) {
      confirmedRef.current = false;
    }
  }, [discardActionProp, saveActionProp]);

  if (isSapoMobileBridge) {
    let saveAction: MobileBridgeContextualSaveBarProps["saveAction"] = undefined;
    if (saveActionProp) {
      const { url, onAction, ...rest } = saveActionProp;
      saveAction = {
        ...rest,
        onAction: () => {
          if (url) {
            dispatchRedirect(app, url);
          }
          onAction?.();
        },
      };
    }

    let discardAction: MobileBridgeContextualSaveBarProps["discardAction"] = undefined;
    if (discardActionProp) {
      const { url, onAction, ...rest } = discardActionProp;
      discardAction = {
        ...rest,
        onAction: () => {
          if (url) {
            dispatchRedirect(app, url);
          }
          onAction?.();
        },
      };
    }
    return (
      <MobileBridgeContextualSaveBar
        visible={visible}
        fullWidth={fullWidth}
        leaveConfirmationDisable={leaveConfirmationDisable}
        saveAction={saveAction}
        discardAction={discardAction}
        message={message}
      />
    );
  }

  if (!visible) {
    return null;
  }

  const saveAction: Props["saveAction"] = saveActionProp
    ? {
        ...saveActionProp,
        onAction:
          !saveActionProp.url && saveActionProp.onAction
            ? () => {
                confirmedRef.current = true;
                saveActionProp.onAction?.();
              }
            : saveActionProp.onAction,
      }
    : undefined;

  const discardAction: Props["discardAction"] = discardActionProp
    ? {
        ...discardActionProp,
        onAction:
          !discardActionProp.url && discardActionProp.onAction
            ? () => {
                confirmedRef.current = true;
                discardActionProp.onAction?.();
              }
            : discardActionProp.onAction,
      }
    : undefined;

  return (
    <LeavePage disabled={leaveConfirmationDisable} confirmedRef={confirmedRef} pathnameOnly={pathnameOnly}>
      {settingContext ? (
        <SettingContextualSaveBar {...restProps} saveAction={saveAction} discardAction={discardAction} />
      ) : (
        <UIContextualSaveBar {...restProps} saveAction={saveAction} discardAction={discardAction} />
      )}
    </LeavePage>
  );
}

type LeavePageProps = {
  children: React.ReactNode;
  disabled?: boolean;
  confirmedRef?: React.MutableRefObject<boolean>;
  pathnameOnly?: boolean;
};

function LeavePage({ disabled, children, confirmedRef, pathnameOnly }: LeavePageProps) {
  const context = useContext(LeavePageContext);
  // block when navigation
  const blocker = useBlocker(({ nextLocation, currentLocation }) => {
    if (pathnameOnly && nextLocation.pathname === currentLocation.pathname) {
      return false;
    }
    if (confirmedRef?.current) {
      return false;
    }
    return !disabled;
  });

  // block when refresh
  useBeforeUnload(
    useCallback(
      (e) => {
        if (!disabled) {
          // see spec: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
          e.returnValue = true;
        }
      },
      [disabled]
    )
  );

  useEffect(() => {
    context?.setBlocker?.(blocker);
    return () => {
      context?.setBlocker?.(undefined);
    };
  }, [blocker, context]);

  return children;
}
