import React, { memo, useEffect } from "react";

import { focusFirstFocusableNode } from "../../utils/focus";

export interface FocusProps {
  children?: React.ReactNode;
  disabled?: boolean;
  root: React.RefObject<HTMLElement> | HTMLElement | null;
}

/**
 * Tự động focus vào phần tử có thể focus đầu tiên khi mount. Nếu phần tử đó thuộc tính `autofocus` có thì sẽ không làm gì
 */
export const Focus = memo(function Focus({ children, disabled, root }: FocusProps) {
  useEffect(() => {
    if (disabled || !root) {
      return;
    }

    const node = isRef(root) ? root.current : root;

    if (!node || node.querySelector("[autofocus]")) {
      return;
    }

    focusFirstFocusableNode(node, false);
  }, [disabled, root]);

  return <>{children}</>;
});

function isRef(ref: React.RefObject<HTMLElement> | HTMLElement): ref is React.RefObject<HTMLElement> {
  return (ref as React.RefObject<HTMLElement>).current !== undefined;
}
