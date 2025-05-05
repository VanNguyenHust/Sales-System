import { createContext } from "react";

export interface MappedActionContextType {
  role?: string;
  onAction?(): void;
  destructive?: boolean;
}

export const MappedActionContext = createContext<MappedActionContextType | undefined>(undefined);
