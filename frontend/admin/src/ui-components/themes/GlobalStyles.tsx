import React from "react";
import { css, Global } from "@emotion/react";

import { useTheme } from "./ThemeContext";
import { Theme } from "./types";

export function GlobalStyles() {
  const theme = useTheme();
  return <Global styles={[getGlobalStyle(theme)]} />;
}

function getGlobalStyle(theme: Theme) {
  const scrollBar = theme.components.scrollBar;
  return css`
    body,
    html {
      font-size: ${theme.typography.fontSize100};
      line-height: ${theme.typography.fontLineHeight2};
      text-transform: none;
      letter-spacing: normal;
      font-weight: ${theme.typography.fontWeightRegular};
      color: ${theme.colors.text};
    }

    html {
      scrollbar-width: thin;
      scrollbar-color: ${scrollBar.scrollBarThumbHoverColor} ${scrollBar.scrollBarTrackColor};
    }

    body {
      margin: 0;
      padding: 0;
      scrollbar-color: ${scrollBar.scrollBarThumbHoverColor} ${scrollBar.scrollBarTrackColor};
    }

    html,
    body {
      height: 100%;
      min-height: 100%;
    }

    body,
    html,
    button {
      font-family: ${theme.typography.fontFamilySans};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      margin: 0;
      font-size: 1em;
      font-weight: ${theme.typography.fontWeightRegular};
    }

    *,
    :after,
    :before {
      box-sizing: border-box;
    }
    html {
      font-size: 100%;
    }
  `;
}
