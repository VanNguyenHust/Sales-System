import { describe, expect, it } from "vitest";

import { normalizePathname, safeEqual, safeStartsWith } from "./url";

describe("normalizePathname", () => {
  it("normalizePathname", () => {
    expect(normalizePathname("/product")).toBe("/product/");
    expect(normalizePathname("/product?name=foo")).toBe("/product/");
    expect(normalizePathname("/product#foo")).toBe("/product/");
  });

  it("safeEqual", () => {
    expect(safeEqual("/product?name=foo", "/product#foo")).toBeTruthy();
  });

  it("safeStartsWith", () => {
    expect(safeStartsWith("/products/1", "/products")).toBeTruthy();
    expect(safeStartsWith("/products/1", "/products/1")).toBeTruthy();
    expect(safeStartsWith("/products/1", "/products/detail")).toBeFalsy();
    expect(safeStartsWith("/products/1", "/orders")).toBeFalsy();
  });
});
