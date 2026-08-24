import { describe, it, expect } from "vitest";
import { get } from "./objectGet";

describe("get (lodash-style object path access)", () => {
  const obj = {
    foo: { bar: { baz: "Hello World!" } },
    foobar: [{ key: "Hello World!" }],
    zero: 0,
  };

  it("resolves a nested dot path", () => {
    expect(get(obj, "foo.bar.baz")).toBe("Hello World!");
  });

  it("indexes into arrays with numeric segments", () => {
    expect(get(obj, "foobar.0.key")).toBe("Hello World!");
  });

  it("returns undefined (not a crash) for missing paths", () => {
    expect(get(obj, "foo.missing.deep")).toBeUndefined();
  });

  it("supports a custom default value", () => {
    expect(get(obj, "foo.missing", "fallback")).toBe("fallback");
  });

  it("returns falsy-but-present values correctly", () => {
    expect(get(obj, "zero")).toBe(0);
  });

  it("handles a single-segment path", () => {
    expect(get(obj, "foo")).toBe(obj.foo);
  });

  it("handles null/undefined objects gracefully", () => {
    expect(get(null, "a.b")).toBeUndefined();
    expect(get(undefined, "a.b", "d")).toBe("d");
  });
});
