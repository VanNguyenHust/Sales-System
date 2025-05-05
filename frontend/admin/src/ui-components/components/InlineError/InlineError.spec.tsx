import React from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderApp } from "test/renderApp";

import { InlineError } from "./InlineError";

describe("InlineError", () => {
  it("should render message string", () => {
    renderApp(<InlineError message="Name is invalid" fieldID="name" />);
    expect(screen.getByText("Name is invalid")).toBeInTheDocument();
  });

  it("should render message react", () => {
    renderApp(<InlineError message={<span data-testid="error" />} fieldID="name" />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });

  it("should empty when not message empty", () => {
    const { container: emptyContainer } = renderApp(<></>);
    const { container } = renderApp(<InlineError message="" fieldID="name" />);
    expect(container.innerHTML).toEqual(emptyContainer.innerHTML);
  });

  it("should using field id", () => {
    const { container } = renderApp(<InlineError message="Name is invalid" fieldID="name" />);
    expect(container.querySelector("#nameError")).toBeInTheDocument();
  });
});
