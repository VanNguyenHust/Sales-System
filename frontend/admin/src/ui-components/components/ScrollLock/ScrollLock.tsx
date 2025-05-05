import React, { useEffect } from "react";
import { css, Global } from "@emotion/react";

import {
  SCROLL_LOCKING_ATTRIBUTE,
  SCROLL_LOCKING_HIDDEN_ATTRIBUTE,
  SCROLL_LOCKING_WRAPPER_ATTRIBUTE,
} from "./constant";
import { useScrollLockManager } from "./context";

/** Ẩn thanh scroll dọc của thẻ body. Thường được dùng trong component overlay như Modal, Backdrop,... */
export function ScrollLock() {
  const scrollLockManager = useScrollLockManager();

  useEffect(() => {
    scrollLockManager.registerScrollLock();

    return () => {
      scrollLockManager.unregisterScrollLock();
    };
  }, [scrollLockManager]);
  return <Global styles={scrollLockStyle} />;
}

const scrollLockStyle = css`
  [${SCROLL_LOCKING_ATTRIBUTE}] {
    overflow-y: scroll;
    margin: 0;

    &[${SCROLL_LOCKING_HIDDEN_ATTRIBUTE}] {
      overflow-y: hidden;
    }

    [${SCROLL_LOCKING_WRAPPER_ATTRIBUTE}] {
      overflow: hidden;
      height: 100%;
    }
  }
`;
