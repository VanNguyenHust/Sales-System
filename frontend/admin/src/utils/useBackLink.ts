import { useContext, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

import { NavigateContext } from "app/components/Navigate/context";

export interface NavigateContextType {
  /** Link được dùng để trở lại màn danh sách từ màn chi tiết, query url trước đó của màn danh sách sẽ được khôi phục  */
  backLink?: string;
  /** Link được dùng để trở lại sau khi đóng modal setting  */
  previousSettingLink?: string;
}

type UseBackLinkOptions = {
  fromState: true;
};

export function useBackLink(options?: UseBackLinkOptions) {
  const { state: stateLocation } = useLocation();
  const context = useContext(NavigateContext);
  const backLinkFromState = useRef(stateLocation?.backLink)?.current;

  if (!context) {
    throw new Error("No NavigateContext provided");
  }
  return useMemo(() => {
    if (options?.fromState) {
      return {
        ...context,
        backLink: backLinkFromState ?? context.backLink,
      } satisfies NavigateContextType;
    }
    return context;
  }, [context, options?.fromState, backLinkFromState]);
}
