import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "test/renderApp";

import { List } from "./List";

describe("List", () => {
  it("should render items", () => {
    renderApp(
      <List>
        <List.Item>First Item</List.Item>
        <List.Item>Second Item</List.Item>
        <List.Item>Third Item</List.Item>
      </List>
    );
    expect(screen.queryAllByRole("listitem")).toHaveLength(3);
  });
});
