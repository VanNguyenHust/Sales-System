import React from "react";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UniqueIdProvider, useUniqueId } from "./useUniqueId";

describe("useUniqueId", () => {
  it("should get id", () => {
    const { result } = renderHook(() => useUniqueId(), { wrapper: UniqueIdProvider });
    expect(result.current).toBe("UI1");
  });

  it("should get unique id between component", () => {
    render(
      <>
        <Dummy testId="ele1" />
        <Dummy testId="ele2" />
      </>,
      {
        wrapper: UniqueIdProvider,
      }
    );
    const ele1 = screen.getByTestId("ele1");
    const ele2 = screen.getByTestId("ele2");
    expect(ele1.textContent).not.toBe(ele2.textContent);
  });

  it("should not change between rerender", () => {
    const { result, rerender } = renderHook(() => useUniqueId(), { wrapper: UniqueIdProvider });
    const firstValue = result.current;
    rerender();
    expect(result.current).toBe(firstValue);
  });

  it("should handle prefix", () => {
    const { result } = renderHook(() => useUniqueId("Foo"), { wrapper: UniqueIdProvider });
    expect(result.current).toBe("UIFoo1");
  });
});

const Dummy = ({ testId }: { testId: string }) => {
  const id = useUniqueId();
  return <span data-testid={testId}>{id}</span>;
};
