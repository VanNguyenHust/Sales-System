import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { css, Global } from "@emotion/react";
import { AppProvider, createTheme } from "@/ui-components";
import uiTranslations from "@/ui-components/locales/vi.json";
import { UIVizProvider } from "@sapo/ui-viz";

import { LinkComponent } from "app/components/LinkComponent";

import { useGlobalLoadRemover } from "./Legacy";

type ThemeInput = NonNullable<Parameters<typeof createTheme>[0]>;
const options: ThemeInput = {
  components: {
    layout: {
      widthPrimary: "693px",
      widthSecondary: "339px",
      widthInnerSpacingBase: "104px",
    },
    navigation: {
      baseWidth: "230px",
    },
    popover: {
      maxHeight: 400,
    },
  },
};

const defaultTheme = createTheme(options);

function fontScale(remValue: string) {
  return `calc(${remValue} * var(--ui-rem-scale))`;
}

// Legacy theme 1rem = 10px, new theme 1rem = 16px,
// so we must adaptive
const adaptiveTheme = createTheme({
  ...options,
  typography: {
    fontSize75: fontScale(defaultTheme.typography.fontSize75),
    fontSize100: fontScale(defaultTheme.typography.fontSize100),
    fontSize200: fontScale(defaultTheme.typography.fontSize200),
    fontSize300: fontScale(defaultTheme.typography.fontSize300),
    fontSize400: fontScale(defaultTheme.typography.fontSize400),
    fontSize500: fontScale(defaultTheme.typography.fontSize500),
    fontSize600: fontScale(defaultTheme.typography.fontSize600),
    fontSize700: fontScale(defaultTheme.typography.fontSize700),
    fontLineHeight1: fontScale(defaultTheme.typography.fontLineHeight1),
    fontLineHeight2: fontScale(defaultTheme.typography.fontLineHeight2),
    fontLineHeight3: fontScale(defaultTheme.typography.fontLineHeight3),
    fontLineHeight4: fontScale(defaultTheme.typography.fontLineHeight4),
    fontLineHeight5: fontScale(defaultTheme.typography.fontLineHeight5),
    fontLineHeight6: fontScale(defaultTheme.typography.fontLineHeight6),
    fontLineHeight7: fontScale(defaultTheme.typography.fontLineHeight7),
  },
});

interface Props {
  children: React.ReactNode;
}

export function AppLayout({ children }: Props) {
  useGlobalLoadRemover();
  useNavigateFocusManagement();
  return (
    <AppProvider theme={adaptiveTheme} linkComponent={LinkComponent} i18n={uiTranslations}>
      <Global
        styles={css`
          :root {
            --ui-rem-scale: 1;
            #root {
              letter-spacing: -0.2px;
              text-rendering: optimizeLegibility;
            }
          }
        `}
      />
      <UIVizProvider>{children}</UIVizProvider>
    </AppProvider>
  );
}

function useNavigateFocusManagement() {
  const { pathname } = useLocation();
  const [prevPathname, setPrevPathname] = useState<string | undefined>(undefined);
  useLayoutEffect(() => {
    if (pathname === prevPathname) {
      return;
    }
    setPrevPathname(pathname);
    const firstH1 = document.querySelector("h1");
    (firstH1 || document.body).focus();
    window.scrollTo({ top: 0 });
  }, [pathname, prevPathname]);
}
