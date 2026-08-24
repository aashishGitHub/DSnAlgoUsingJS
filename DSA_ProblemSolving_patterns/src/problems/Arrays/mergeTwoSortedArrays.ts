/**
 * ============================================================================
 * MERGE TWO SORTED ARRAYS (the merge step of Merge Sort; LeetCode 88 variant)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given two arrays sorted in ascending order, produce ONE sorted array
 * containing all elements.
 *
 *   Input:  [1,5,8], [2,4,7]
 *   Output: [1,2,4,5,7,8]
 *
 * BUG FIXED DURING REWORK: the original .js version did
 * `result.push(array1)` to append "the rest" — pushing the whole ARRAY as a
 * single nested element instead of its remaining items. It also stopped the
 * moment either array emptied, so leftovers were mangled. The step-by-step
 * versions below get the "drain the leftovers" part right.
 *
 * PATTERN:
 * - **Two pointers, one per array.** Both inputs are sorted, so the smallest
 *   unplaced element overall is always at one of the two fronts — compare the
 *   fronts, take the smaller, advance that pointer. This merge step is the
 *   heart of Merge Sort and of "merge k sorted lists".
 *
 * COMPLEXITY LADDER (m, n = lengths):
 *   Step 1  Concat + sort (ignores sortedness)  Time O((m+n)log(m+n))  Space O(m+n)
 *   Step 2  Two-pointer merge ★                  Time O(m+n)            Space O(m+n)
 *   Step 3  LC88: merge INTO nums1 from the BACK Time O(m+n)            Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: concatenate and sort.
 * ----------------------------------------------------------------------------
 * Correct in one line — and it throws away the one thing we were given for
 * free: both inputs are ALREADY sorted. Say this sentence and move on.
 *
 * Time: O((m+n) log (m+n)). Space: O(m+n).
 */
export function mergeTwoSortedArraysBruteForce(a: number[], b: number[]): number[] {
  return [...a, ...b].sort((x, y) => x - y);
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — TWO-POINTER MERGE: one pass, no sorting.
 * ----------------------------------------------------------------------------
 * Keep a finger on the front of each array. The globally-smallest unplaced
 * value must be under one of the two fingers (sorted inputs!). Take it,
 * advance that finger. When one array runs out, DRAIN the other — its
 * remaining items are already sorted and all larger.
 *
 * DRY-RUN on [1,5,8] / [2,4,7]:
 *   1<2 take 1 · 5>2 take 2 · 5>4 take 4 · 5<7 take 5 · 8>7 take 7 · drain [8]
 *   → [1,2,4,5,7,8] ✓
 *
 * Time: O(m+n). Space: O(m+n) for the result.
 */
export function mergeTwoSortedArrays(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i++]);
    } else {
      result.push(b[j++]);
    }
  }

  // Drain whichever array still has items (only one of these loops runs).
  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 3 — LEETCODE 88: merge b INTO a, in place, O(1) extra space.
 * ----------------------------------------------------------------------------
 * LC88's twist: `a` has m real values followed by n zeros of spare room.
 * Merging from the FRONT would overwrite unread values of `a` — so merge from
 * the BACK: the largest remaining value (comparing both tails) goes into the
 * last free slot. Writing into space we've already read from is always safe.
 *
 * @example
 * const a = [1, 2, 3, 0, 0, 0];
 * mergeInPlace(a, 3, [2, 5, 6], 3);   // a becomes [1,2,2,3,5,6]
 *
 * Time: O(m+n). Space: O(1).
 */
export function mergeInPlace(a: number[], m: number, b: number[], n: number): void {
  let i = m - 1; // last real value in a
  let j = n - 1; // last value in b
  let w = m + n - 1; // last write slot in a

  while (j >= 0) {
    // note: only b needs draining — leftovers of a are already in place
    if (i >= 0 && a[i] > b[j]) {
      a[w--] = a[i--];
    } else {
      a[w--] = b[j--];
    }
  }
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "two (or k) sorted inputs, one sorted output" → compare
 *    fronts with two pointers; NEVER re-sort what's already sorted.
 * 2. The classic bugs: forgetting to drain the leftover array (the original
 *    file's bug), and for LC88, merging from the front (overwrites unread
 *    values — the back-to-front insight IS the problem).
 * 3. Follow-ups: merge k sorted lists (min-heap of k fronts, O(N log k));
 *    this same merge is why sortedSquares (2Pointers) fills from the back.
 */
