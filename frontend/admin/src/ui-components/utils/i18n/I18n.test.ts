import { describe, expect, it } from "vitest";

import { I18n } from "./I18n";

describe("I18n", () => {
  it("should return a simple string value in the translation dictionary", () => {
    const i18n = new I18n({ foo: "bar" });
    expect(i18n.translate("foo")).toBe("bar");
  });

  it("should return a nested string value in the translation dictionary", () => {
    const i18n = new I18n({ foo: { bar: { baz: "qux" } } });
    expect(i18n.translate("foo.bar.baz")).toBe("qux");
  });

  it("should return an empty string when no match is found", () => {
    const i18n = new I18n({ foo: { bar: "baz" } });
    expect(i18n.translate("foo.bar.baz")).toBe("");
  });

  it("should merge multiple dictionaries", () => {
    const translations: { [key: string]: string }[] = [
      { one: "un", two: "deux", three: "trois" },
      { one: "one", two: "two", three: "three", fallback: "fallback" },
    ];

    const i18n = new I18n(translations);
    expect(i18n.translate("one")).toBe("un");
    expect(i18n.translate("fallback")).toBe("fallback");

    // Assert the original translations array is not mutated
    expect(translations[0].two).toBe("deux");
  });

  it("should able to use replacements", () => {
    const i18n = new I18n({ key: "foo {string} {number}" });
    expect(i18n.translate("key", { string: "bar", number: 3 })).toBe("foo bar 3");
  });

  it("should throw an error for a missing replacement", () => {
    const i18n = new I18n({ key: "foo {string}" });
    expect(() => {
      i18n.translate("key", { notString: "bar" });
    }).toThrow(
      `Error in translation for key 'key'. No replacement found for key 'string'. The following replacements were passed: '{"notString":"bar"}'`
    );

    expect(() => {
      // Cast because while typescript should guard against this, people have
      // been known to misuse `any` and undefined can get passed into the
      //  replacements
      i18n.translate("key", { string: undefined as any });
    }).toThrow(
      `Error in translation for key 'key'. No replacement found for key 'string'. The following replacements were passed: '{}'`
    );
  });

  it("should throw an error if return not is string", () => {
    const i18n = new I18n({ foo: { bar: { baz: "qux" } } });
    expect(() => {
      i18n.translate("foo.bar");
    }).toThrow(`Error in translation for key 'foo.bar'. Expect translate string, got: '{"baz":"qux"}'`);
  });
});
