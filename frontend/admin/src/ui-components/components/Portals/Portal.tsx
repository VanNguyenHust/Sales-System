import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import { useUniqueId } from "../../utils/uniqueId";

import { usePortalsManager } from "./PortalsManagerContext";

export interface PortalProps {
  children?: React.ReactNode;
  idPrefix?: string;
  onPortalCreated?(): void;
}

export function Portal({ children, idPrefix, onPortalCreated = noop }: PortalProps) {
  const { container } = usePortalsManager();

  const uniqueId = useUniqueId("Portal");

  useEffect(() => {
    onPortalCreated();
  }, [onPortalCreated]);

  return container
    ? createPortal(<div data-portal-id={idPrefix ? `${idPrefix}-${uniqueId}` : uniqueId}>{children}</div>, container)
    : null;
}

function noop() {}
