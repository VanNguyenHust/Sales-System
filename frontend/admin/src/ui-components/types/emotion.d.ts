import "@emotion/react";

import { Theme as SapoTheme } from "../themes/types";

declare module "@emotion/react" {
  export interface Theme extends SapoTheme {}
}
