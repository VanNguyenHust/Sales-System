import { createContext, useContext } from "react";

import { LinkLikeComponent } from "../../types";

export const LinkContext = createContext<LinkLikeComponent | undefined>(undefined);

export function useLink() {
  return useContext(LinkContext);
}
