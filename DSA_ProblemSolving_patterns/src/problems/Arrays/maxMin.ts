/**
 * ============================================================================
 * MIN AND MAX OF AN ARRAY (warm-up + recursion practice)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Find the minimum and maximum values of an array.
 *
 *   Input:  [1, 4, 45, 6, -50, 10, 2]
 *   Output: min = -50, max = 45
 *
 * BUG FIXED DURING REWORK: the original .js crashed with a ReferenceError —
 * it declared `A1`/`A2` but read `A.length`. It had literally never run.
 * (Lesson: even a warm-up file deserves one execution before it's saved.)
 *
 * COMPLEXITY LADDER (n = arr.length):
 *   Step 1  Built-ins                    O(n)  — spread breaks on huge arrays!
 *   Step 2  One linear pass ★            O(n)  — the answer to actually give
 *   Step 3  Recursive (teaching)         O(n) time, O(n) stack
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BUILT-INS: fine until the array is huge.
 * ----------------------------------------------------------------------------
 * `Math.min(...arr)` spreads every element as a function ARGUMENT — engines
 * cap argument counts (~100k), so this throws RangeError on big inputs.
 * Know the one-liner AND its limit.
 */
export function minMaxBuiltIn(arr: number[]): { min: number; max: number } {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — ONE PASS, BOTH VALUES: the version to write.
 * ----------------------------------------------------------------------------
 * Track both running values in a single scan. Initialize from arr[0], NOT
 * from 0 (an all-negative array breaks a max initialized to 0 — the same
 * initialization trap as Kadane's).
 *
 * Time: O(n) — exactly one comparison pair per element. Space: O(1).
 */
export function minMax(arr: number[]): { min: number; max: number } {
  if (arr.length === 0) throw new Error("minMax of an empty array is undefined");

  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    else if (arr[i] > max) max = arr[i]; // else-if: a new min can't also be a new max
  }
  return { min, max };
}

/**
 * ----------------------------------------------------------------------------
 * STEP 3 — RECURSIVE VERSIONS (kept from the original file, fixed):
 * min(first n) = smaller of arr[n-1] and min(first n-1).
 * ----------------------------------------------------------------------------
 * Educational: this is the simplest possible "combine answers of a smaller
 * subproblem" recursion — the same shape trees use (see treePatterns).
 * O(n) stack depth means don't use it on big arrays for real.
 */
export function findMinRecursive(arr: number[], n: number = arr.length): number {
  if (n === 1) return arr[0];
  return Math.min(arr[n - 1], findMinRecursive(arr, n - 1));
}

export function findMaxRecursive(arr: number[], n: number = arr.length): number {
  if (n === 1) return arr[0];
  return Math.max(arr[n - 1], findMaxRecursive(arr, n - 1));
}

/**
 * INTERVIEW NOTE: the "3n/2 comparisons" refinement — process elements in
 * PAIRS (compare the pair first, then smaller vs min, larger vs max) — is a
 * classic follow-up. Mention it; few interviewers require the code.
 */
