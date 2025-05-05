import React, { ReactNode, useEffect } from "react";

import { useIsMounted } from "../../utils/useIsMounted";

interface Props {
  children?: ReactNode;
  onMount?: () => void;
}

export function AfterInitialMount({ children, onMount }: Props) {
  const isMounted = useIsMounted();
  const content = isMounted ? children : null;

  useEffect(() => {
    if (isMounted && onMount) {
      onMount();
    }
  }, [isMounted, onMount]);

  return <>{content}</>;
}
