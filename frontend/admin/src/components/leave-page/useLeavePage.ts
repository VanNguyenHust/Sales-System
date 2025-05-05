import { useCallback, useContext, useEffect } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";

import { DISCARD_CONFIRMED } from "app/utils/navigation/state";

import { LeavePageContext } from "./context";

/**
 * Được dùng để bảo vệ dữ liêu chưa được lưu bằng cách mở Modal xác nhận trước khi rời trang
 *
 * @param shouldConfirm - Nếu true thì sẽ hiện modal xác nhận trước khi rời trang
 * @param pathnameOnly - Nếu true thì sẽ so sánh pathname hiện tại và pathname sau khi thay đổi, nếu giống nhau thì sẽ không hiện modal xác nhận
 */
export function useLeavePage(shouldConfirm: boolean, pathnameOnly?: boolean) {
  const context = useContext(LeavePageContext);
  // block when navigation
  const blocker = useBlocker(({ nextLocation, currentLocation }) => {
    if (pathnameOnly && nextLocation.pathname === currentLocation.pathname) {
      return false;
    }
    if (nextLocation.state === DISCARD_CONFIRMED) {
      return false;
    }
    return shouldConfirm;
  });

  // block when refresh
  useBeforeUnload(
    useCallback(
      (e) => {
        if (shouldConfirm) {
          // see spec: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
          e.returnValue = true;
        }
      },
      [shouldConfirm]
    )
  );

  useEffect(() => {
    context?.setBlocker?.(blocker);
    return () => {
      context?.setBlocker?.(undefined);
    };
  }, [blocker, context]);

  return null;
}
