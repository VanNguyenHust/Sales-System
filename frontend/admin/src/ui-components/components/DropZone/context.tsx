import { createContext } from "react";

import { DropZoneSize } from "./types";

export interface DropZoneContextType {
  disabled: boolean;
  size: DropZoneSize;
  type: string;
  allowMultiple: boolean;
}

export const DropZoneContext = createContext<DropZoneContextType>({
  disabled: false,
  size: "large",
  type: "file",
  allowMultiple: false,
});
