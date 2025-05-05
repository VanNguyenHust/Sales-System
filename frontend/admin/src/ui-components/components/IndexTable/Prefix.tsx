import React, { useCallback, useContext, useEffect, useRef } from "react";
import { debounce } from "lodash-es";

import { StyledCellPrefix } from "./Cell";
import { OffsetContext, RowContext } from "./context";

export const Prefix = ({ children }: { children: React.ReactNode }) => {
  const { position } = useContext(RowContext);
  const { prefix, onPrefixChange } = useContext(OffsetContext);
  const prefixNode = useRef<HTMLTableCellElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    debounce(() => {
      if (position === 0 && prefixNode.current) {
        const { width } = prefixNode.current.getBoundingClientRect();
        onPrefixChange?.(`${width}px`);
      }
    }),
    [position]
  );

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    if (!prefixNode.current) return;
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <StyledCellPrefix ref={prefixNode} $offset={prefix}>
      {children}
    </StyledCellPrefix>
  );
};
