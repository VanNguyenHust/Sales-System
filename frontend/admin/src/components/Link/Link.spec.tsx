import { BrowserRouter, type Location, useLocation } from "react-router-dom";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { AppProvider, createTheme } from "@/ui-components";
import uiTranslations from "@/ui-components/locales/vi.json";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LinkComponent } from "../LinkComponent";

import { Link } from "./Link";

let location: Location;

describe("Link", () => {
  it("should able to use url as string", () => {
    renderLink(<Link url="/foo" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/foo");
  });

  it("should able to use url as object", () => {
    renderLink(<Link url={{ pathname: "/foo", search: "debug" }} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/foo?debug");
  });

  it("should change browser url when click", async () => {
    renderLink(<Link url="/foo" />);
    await userEvent.click(screen.getByRole("link"));

    expect(location.pathname).toBe("/foo");
  });

  it("should able to set 'state'", async () => {
    renderLink(<Link url="/foo" state="bar" />);
    await userEvent.click(screen.getByRole("link"));

    expect(location.state).toBe("bar");
  });

  it("should able to replace url", async () => {
    const mockedReplaceState = vi.fn();
    const previousReplaceState = history.replaceState;
    history.replaceState = mockedReplaceState;
    renderLink(<Link url="/foo" replace />);
    await userEvent.click(screen.getByRole("link"));
    expect(mockedReplaceState).toHaveBeenCalled();
    history.replaceState = previousReplaceState;
  });

  it("should render link external", () => {
    renderLink(<Link url="/foo" external />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/foo");
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("should render button when url not be passed", () => {
    renderLink(<Link />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onClick callback", async () => {
    const onClick = vi.fn();
    renderLink(<Link url="#" onClick={onClick} />);
    await userEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalled();
  });

  it("should able to set dataPrimaryLink", () => {
    renderLink(<Link url="#" dataPrimaryLink />);
    expect(screen.getByRole("link")).toHaveAttribute("data-primary-link", "true");
  });
});

const theme = createTheme();

function renderLink(ui: React.ReactNode) {
  const LocationInject = () => {
    location = useLocation();
    return null;
  };
  // using EmotionThemeProvider workaround for vitest,
  // see: https://stackoverflow.com/questions/77069324/emotion-css-props-are-not-getting-the-theme-object-when-running-tests-with-vites
  const testCase = (
    <BrowserRouter>
      <EmotionThemeProvider theme={theme}>
        <AppProvider i18n={uiTranslations} linkComponent={LinkComponent} theme={theme}>
          {ui}
          <LocationInject />
        </AppProvider>
      </EmotionThemeProvider>
    </BrowserRouter>
  );
  return render(testCase);
}
