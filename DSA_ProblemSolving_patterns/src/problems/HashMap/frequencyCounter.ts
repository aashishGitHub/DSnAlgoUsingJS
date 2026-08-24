/**
 * ============================================================================
 * FREQUENCY COUNTER PATTERNS (consolidated from legacy .js files)
 * ============================================================================
 *
 * PATTERN:
 * - **Count occurrences in a hash map, then answer questions from the counts.**
 *   The frequency-counter idea turns "compare/search across collections"
 *   problems from nested O(n²) loops into two independent O(n) passes: one to
 *   build the count map, one to interrogate it.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * - Brute force for "do these collections correspond?" is: for each element of
 *   A, scan B for its counterpart (and mark it used) → O(n²).
 * - Frequency counter: count A (O(n)), then for each element of B check/
 *   decrement the map (O(n)) → O(n) total. Trading O(n) space for the O(n²)→
 *   O(n) time win is the entire pattern.
 *
 * FILE HISTORY / BUGS FIXED DURING CONSOLIDATION (from the deleted legacy
 * files 2sum.js, anagram.js, countUnique.js, getUnique.js, maxChars.js,
 * pairsWithSumK.js, same.js):
 * - anagram.js's `validAnagram` never DECREMENTED counts, so 'ab' vs 'aa'
 *   wrongly returned true (the fix — decrementing — was literally present but
 *   commented out as "not required"). The correct increment/decrement version
 *   already lives in `hashSetPatterns.ts` as `isAnagram`; not duplicated here.
 * - maxChars.js sorted entries with `.sort(x => x.values)` — a one-argument
 *   comparator reading a non-existent property, i.e. no sorting at all.
 * - pairsWithSumK.js invoked `listAllUniquePairsOfSum_K`, a function that was
 *   never defined (ReferenceError), and seeded its result with an empty pair.
 * - getUnique.js's "optimized" version returned Object.keys STRINGS and
 *   filtered them with `x > 0` (breaks for 0 and negatives).
 * - 2sum.js's second function referenced an undefined `result` variable.
 *
 * REAL-WORLD ANALOGIES:
 * - Inventory reconciliation: do shipped items match invoiced items 1:1?
 * - Analytics: most frequent event type in a stream window.
 * - Data validation: does a transformed dataset preserve source multiplicity?
 * ============================================================================
 */

/**
 * SAME (the classic frequency-counter teaching problem):
 * do the values of `arr2` equal the SQUARES of the values of `arr1`, with the
 * same multiplicities (order-independent)?
 *
 * @example
 * same([1, 2, 3, 2, 5], [9, 1, 4, 4, 25]); // true  (1²,2²,3²,2²,5² as a multiset)
 * same([1, 2, 3], [1, 9]);                 // false (length mismatch)
 * same([1, 2, 1], [4, 4, 1]);              // false (frequencies differ)
 *
 * Time: O(n) — two counting passes + one comparison pass. Space: O(n).
 */
export function same(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const freq1 = new Map<number, number>();
  const freq2 = new Map<number, number>();

  for (const val of arr1) freq1.set(val, (freq1.get(val) || 0) + 1);
  for (const val of arr2) freq2.set(val, (freq2.get(val) || 0) + 1);

  for (const [key, count] of freq1) {
    if (freq2.get(key ** 2) !== count) {
      return false;
    }
  }
  return true;
}

/**
 * MAX CHAR: the character occurring most often in a string (case-insensitive).
 * Returns null for an empty string.
 *
 * @example
 * maxChar("Bhubaneswar"); // "b"  (appears twice: 'B' and 'b')
 * maxChar("abcc");        // "c"
 *
 * Time: O(n). Space: O(k) — k distinct characters.
 */
export function maxChar(input: string): string | null {
  if (input.length === 0) return null;

  const counts = new Map<string, number>();
  for (const ch of input.toLowerCase()) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }

  let best: string | null = null;
  let bestCount = 0;
  for (const [ch, count] of counts) {
    if (count > bestCount) {
      best = ch;
      bestCount = count;
    }
  }
  return best;
}

/**
 * PAIRS WITH TARGET SUM: every pair (a, b) from the array with a + b === k,
 * found in ONE pass with a hash set of "values seen so far".
 *
 * Contract notes (multiset semantics): each occurrence can pair with each
 * earlier occurrence — pairsWithTargetSum([3, 3, 5], 6) → [[3, 3]] because the
 * second 3 pairs with the first; a third 3 would add another pair.
 *
 * Contrast with `2Pointers/sumZero.ts`: that version needs SORTED input and
 * O(1) space; this one takes any order but spends O(n) space — the classic
 * sorted-two-pointer vs hash-map trade-off.
 *
 * @example
 * pairsWithTargetSum([1, 3, 2, 6, 5, 7], 8);
 * // [[7, 1], [5, 3], [6, 2]] — each as [current, previously-seen complement]
 *
 * Time: O(n). Space: O(n).
 */
export function pairsWithTargetSum(arr: number[], k: number): number[][] {
  const seen = new Set<number>();
  const result: number[][] = [];

  for (const value of arr) {
    if (seen.has(k - value)) {
      result.push([value, k - value]);
    }
    seen.add(value);
  }
  return result;
}

/**
 * COUNT UNIQUE VALUES IN A SORTED ARRAY — kept for the legacy dry-run notes,
 * but recognize it as the SAME algorithm as
 * `2Pointers/removeDuplicatesFromSortedArray.ts` (`removeDuplicatesInPlace`):
 * the returned `k` there IS this count. Sorted input makes uniqueness an
 * adjacent-comparison question — no hash map needed at all.
 *
 * @example
 * countUniqueValuesSorted([1, 2, 2, 5, 7, 7, 99]); // 5
 *
 * Time: O(n). Space: O(1).
 */
export function countUniqueValuesSorted(arr: number[]): number {
  if (arr.length === 0) return 0;

  let i = 0;
  for (let j = 1; j < arr.length; j++) {
    if (arr[i] !== arr[j]) {
      i++;
      arr[i] = arr[j];
    }
  }
  return i + 1;
}

/**
 * UNIQUE VALUES (unsorted input) — brute force vs Set, side by side.
 *
 * Brute force: keep an element iff its first index is the current index.
 * Why it's slow: `indexOf` rescans from the start for every element → O(n²).
 */
export function uniqueValuesBruteForce(arr: number[]): number[] {
  return arr.filter((x, i) => arr.indexOf(x) === i);
}

/**
 * Set-based optimal: a Set both dedupes and preserves first-seen insertion
 * order. (Fixes the legacy version, which returned Object.keys STRINGS and
 * then filtered them with `x > 0` — silently dropping zero and negatives.)
 *
 * @example
 * uniqueValues([1, 2, 1, 1, 2]);    // [1, 2]
 * uniqueValues([0, -3, 0, 5, -3]);  // [0, -3, 5]  (zero/negatives preserved)
 *
 * Time: O(n). Space: O(n).
 */
export function uniqueValues(arr: number[]): number[] {
  return [...new Set(arr)];
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "same entries / anagram / corresponds under a formula /
 *    most frequent" across collections → count into a map first, answer from
 *    counts second. Never nest scans when a count map will do.
 * 2. The decrement matters: for exact-multiset comparisons (anagrams, `same`),
 *    checking mere EXISTENCE is not enough — you must match counts (that's
 *    precisely the bug the legacy validAnagram had).
 * 3. Pitfalls: plain-object keys coerce to strings (use Map/Set for numeric
 *    data — the legacy getUnique/countUnique string bugs came from
 *    Object.keys); remember `same` needs the length check first.
 * 4. Related canonical problems in this folder: `isAnagram`
 *    (hashSetPatterns.ts), `topKFrequent` (topKFrequent.ts — frequency count +
 *    bucket sort), `firstUniqChar` (hashMapPatterns.ts).
 */
