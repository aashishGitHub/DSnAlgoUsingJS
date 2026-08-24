// Lodash-style `get(obj, "a.b.0.c")` — classic frontend-interview utility.
// (Relocated from src/problems/Graph/traversePath.js — it isn't a graph
// algorithm; it's recursive object-path traversal, so it lives with the other
// GFE-75 JS utilities like curry/debounce/throttle.)
//
// Approach: split the path on the FIRST dot only; resolve that key, then
// recurse on the rest against the resolved value. Arrays work for free since
// numeric segments ("foobar.0.key") index them like object keys.
//
// Time: O(d) for path depth d. Space: O(d) recursion.

export function get(obj: unknown, path: string, defaultValue: unknown = undefined): unknown {
  if (obj === null || obj === undefined) {
    return defaultValue;
  }

  if (path.includes(".")) {
    const [pathStart, ...rest] = path.split(".");
    const next = get(obj, pathStart, defaultValue);
    return get(next, rest.join("."), defaultValue);
  }

  if (typeof obj === "object" && path in (obj as Record<string, unknown>)) {
    return (obj as Record<string, unknown>)[path];
  }
  return defaultValue;
}

/**
 * Example:
 *   const obj = { foo: { bar: { baz: "Hello World!" } }, foobar: [{ key: "Hello World!" }] };
 *   get(obj, "foo.bar.baz");   // "Hello World!"
 *   get(obj, "foobar.0.key");  // "Hello World!"
 *   get(obj, "foo.missing");   // undefined
 */
