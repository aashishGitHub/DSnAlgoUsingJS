/**
 * ============================================================================
 * FLATTEN A NESTED ARRAY (classic frontend-interview utility; GFE favorite)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an arbitrarily nested array, return a flat array of its values.
 *
 *   Input:  [1, [2, [3], 4, [5, 6, [7]]]]
 *   Output: [1, 2, 3, 4, 5, 6, 7]
 *
 * PATTERN:
 * - **Recursion over a recursive structure.** The array's DEPTH is unknown,
 *   so fixed nested loops can't work — the function calls itself on each
 *   nested array. (Same reasoning that makes Backtracking recursive.)
 *
 * COMPLEXITY LADDER (n = total values, d = max depth):
 *   Step 1  Recursive (reduce/concat)   Time O(n·d)* Space O(d) stack
 *   Step 2  Iterative with a stack      Time O(n)    Space O(n) — no recursion limit
 *   Step 3  Built-in `flat(Infinity)`   Time O(n)    know it, then be able to write 1 & 2
 *   (*) concat re-copies accumulated results; push-based recursion is O(n).
 * ============================================================================
 */

/** Values or arbitrarily nested arrays of values. */
export type Nested<T> = T | Nested<T>[];

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — RECURSION: the version to be able to write cold.
 * ----------------------------------------------------------------------------
 * For each item: if it's an array, flatten it and take its values; otherwise
 * keep it. Pushing into one shared result (instead of concat-ing copies)
 * keeps it O(n).
 */
export function flatten<T>(arr: Nested<T>[]): T[] {
  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // recurse into the nested part
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — ITERATIVE WITH AN EXPLICIT STACK: survives any depth.
 * ----------------------------------------------------------------------------
 * Why bother? Very deep nesting can overflow the CALL stack; an explicit
 * stack moves the recursion to the heap. Follow-up interviewers love this.
 * Note the reverse() at the end: popping from a stack reverses order.
 */
export function flattenIterative<T>(arr: Nested<T>[]): T[] {
  const result: T[] = [];
  const stack: Nested<T>[] = [...arr];

  while (stack.length > 0) {
    const item = stack.pop()!;
    if (Array.isArray(item)) {
      stack.push(...item); // unpack one level; deeper levels get unpacked later
    } else {
      result.push(item);
    }
  }
  return result.reverse();
}

/**
 * ----------------------------------------------------------------------------
 * STEP 3 — THE BUILT-IN: production code just uses this.
 * ----------------------------------------------------------------------------
 * `arr.flat(Infinity)` — mention it FIRST in an interview ("in real code I'd
 * use flat"), then implement Step 1/2 when asked to do it by hand.
 * More variants: https://www.greatfrontend.com/questions/javascript/flatten
 */
export function flattenBuiltIn<T>(arr: Nested<T>[]): T[] {
  return (arr as unknown[]).flat(Infinity) as T[];
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Ask about depth: one level (`flat()`) or arbitrary (`flat(Infinity)` /
 *    recursion)? Also: should empty slots / non-array iterables be handled?
 * 2. concat-in-a-reduce is the common O(n·d) trap — each concat copies the
 *    accumulator. Push into one result array instead.
 * 3. Depth-first order must be preserved — that's why the iterative version
 *    needs its final reverse (or unshift/index juggling).
 * 4. Related GFE utilities in this repo: `GFE-75/objectGet.ts` (recursive
 *    path access), `GFE-75/curry.ts`.
 */
