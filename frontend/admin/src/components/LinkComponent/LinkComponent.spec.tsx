import { BrowserRouter } from "react-router-dom";
import { AppProvider, Link } from "@/ui-components";
import uiTranslations from "@/ui-components/locales/vi.json";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LinkComponent } from "./LinkComponent";

describe("LinkComponent", () => {
  it("should forward className", () => {
    renderLink(<LinkComponent url="#" className="foo" />);
    expect(screen.getByRole("link")).toHaveAttribute("class", "foo");
  });

  describe("Compatible with UI Link", () => {
    it("should render link url", () => {
      renderLink(<Link url="/foo" />);
      expect(screen.getByRole("link")).toHaveAttribute("href", "/foo");
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
});

function renderLink(ui: React.ReactNode) {
  return render(
    <BrowserRouter>
      <AppProvider i18n={uiTranslations} linkComponent={LinkComponent}>
        {ui}
      </AppProvider>
    </BrowserRouter>
  );
}
