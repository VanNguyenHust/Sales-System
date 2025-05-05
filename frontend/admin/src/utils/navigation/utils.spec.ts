import { describe, expect, test } from "vitest";

import { resolveTo } from "./utils";

describe("resolveTo", () => {
  test("should resolve resource", () => {
    expect(resolveTo({ name: "customers" })).toBe("/admin/customers");
    expect(resolveTo({ name: "customers", resource: { id: 1000 } })).toBe("/admin/customers/1000");
    expect(resolveTo({ name: "customers", resource: { create: true } })).toBe("/admin/customers/create");
  });
});
