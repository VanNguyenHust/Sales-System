import React, { useContext } from "react";

import { createTheme } from "./createTheme";
import { Theme } from "./types";

export const ThemeContext = React.createContext(createTheme());

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
