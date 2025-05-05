import { createContext } from "react";

import type { ContextualSaveBarProps } from "./ContextualSaveBar";
import type { ToastID, ToastPropsWithID } from "./ToastManager";
import { Logo, NavigationCollapseAction } from "./types";

export interface FrameContextType {
  logo?: Logo;
  startLoading(): void;
  stopLoading(): void;
  hideToast: (toast: ToastID) => void;
  showToast: (toast: ToastPropsWithID) => void;
  setContextualSaveBar: (props: ContextualSaveBarProps) => void;
  removeContextualSaveBar: () => void;
  navigationCollapseAction?: NavigationCollapseAction;
  onNavigationDismiss?(): void;
  offset?: string;
  hasNavigation?: boolean;
  navigationMinimized?: boolean;
}

export const FrameContext = createContext<FrameContextType | undefined>(undefined);
export const WithinContentTopBarContext = createContext<boolean>(false);
