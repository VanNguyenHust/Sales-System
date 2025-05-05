import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderApp } from "test/renderApp";

import { ActionMenu, ActionMenuProps } from ".";

vi.mock("./ActionsMeasurer", () => ({
  ActionsMeasurer: () => {
    return <span />;
  },
}));

describe("ActionMenu", () => {
  it("should not render when there are no `actions` or `groups`", () => {
    const { container: emptyContainer } = renderApp(<></>);
    const { container } = renderApp(<ActionMenu />);
    expect(container.innerHTML).toEqual(emptyContainer.innerHTML);
  });

  describe("actions", () => {
    it("should render actions", () => {
      const actions: ActionMenuProps["actions"] = [{ content: "foo" }, { content: "bar" }];
      renderApp(<ActionMenu actions={actions} />);
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("should call callback action", async () => {
      const onAction = vi.fn();
      renderApp(<ActionMenu actions={[{ content: "foo", onAction }]} />);
      await userEvent.click(screen.getByRole("button"));
      expect(onAction).toHaveBeenCalled();
    });

    it("should render link actions", () => {
      const actions: ActionMenuProps["actions"] = [{ content: "my link", url: "http://example.com" }];
      renderApp(<ActionMenu actions={actions} />);
      expect(screen.getByRole("link", { name: "my link" })).toHaveAttribute("href", "http://example.com");
    });

    it("should not set link action href when disabled", () => {
      const actions: ActionMenuProps["actions"] = [{ content: "my link", url: "http://example.com", disabled: true }];
      renderApp(<ActionMenu actions={actions} />);
      expect(screen.getByText("my link").closest("a")).not.toHaveAttribute("href");
    });
  });

  describe("groups", () => {
    it("should render group actions", () => {
      const groups: ActionMenuProps["groups"] = [
        { title: "foo", actions: [] },
        { title: "bar", actions: [] },
      ];
      renderApp(<ActionMenu groups={groups} />);
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });
});
