import { describe, expect, it } from "vitest";

import { capitalize } from "./strings";

describe("capitalize", () => {
  it("should capitalize string", () => {
    expect(capitalize("")).toEqual("");
    expect(capitalize("foo")).toEqual("Foo");
    expect(capitalize("Foo")).toEqual("Foo");
  });
});
