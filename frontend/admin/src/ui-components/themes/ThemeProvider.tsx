import * as React from "react";
import { ThemeProvider as EThemeProvider } from "@emotion/react";

import { createTheme } from "./createTheme";
import { GlobalStyles } from "./GlobalStyles";
import { ThemeContext } from "./ThemeContext";
import { Theme } from "./types";

interface Props {
  children: React.ReactNode;
  theme?: Theme;
}

export const ThemeProvider = ({ theme: themeInput, children }: Props) => {
  const theme = themeInput || createTheme();
  return (
    <ThemeContext.Provider value={theme}>
      <GlobalStyles />
      <EThemeProvider theme={theme}>{children}</EThemeProvider>
    </ThemeContext.Provider>
  );
};
