import React, { useCallback, useMemo, useState } from "react";

import { FocusManagerContext, FocusManagerContextType } from "../../utils/focus-manager";

interface Props {
  children?: React.ReactNode;
}

export function FocusManager({ children }: Props) {
  const [trapFocusList, setTrapFocusList] = useState<string[]>([]);

  const add = useCallback<FocusManagerContextType["add"]>((id) => {
    setTrapFocusList((list) => [...list, id]);
  }, []);

  const remove = useCallback<FocusManagerContextType["remove"]>((id) => {
    let removed = true;
    setTrapFocusList((list) => {
      const clone = [...list];
      const index = clone.indexOf(id);
      if (index === -1) {
        removed = false;
      } else {
        clone.splice(index, 1);
      }
      return clone;
    });
    return removed;
  }, []);

  const value = useMemo(() => ({ trapFocusList, add, remove }), [add, trapFocusList, remove]);

  return <FocusManagerContext.Provider value={value}>{children}</FocusManagerContext.Provider>;
}
