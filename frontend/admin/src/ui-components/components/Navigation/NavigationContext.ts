import { createContext } from "react";

interface NavigationContextType {
  location: string;
  collapsed?: boolean;
  onNavigationMobileDismiss?(): void;
}

export const NavigationContext = createContext<NavigationContextType>({
  location: "",
});
