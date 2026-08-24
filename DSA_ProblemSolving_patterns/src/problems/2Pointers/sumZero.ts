/**
 * ============================================================================
 * PAIRS WITH SUM ZERO (a.k.a. "Pair with Target Sum", target = 0, sorted input)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an array of numbers SORTED in ascending order, return every pair of
 * values that sums to zero.
 *
 *   Input:  [-3,-2,-1,0,1,2,3,4,6]
 *   Output: [[-3,3],[-2,2],[-1,1]]
 *
 * PATTERN:
 * - **Two Pointers, converging from both ends.** Because the array is sorted,
 *   `start + end` moves monotonically: moving `start` right only increases
 *   the sum, moving `end` left only decreases it. That lets you discard one
 *   candidate per step instead of rescanning.
 *
 * WHEN TO USE:
 * - "Find pair(s) summing to a target" on a SORTED array → two pointers, O(n).
 *   (If the array is unsorted, a hash map in one pass is usually preferred
 *   instead of sorting first — see `HashMap/2sum.js`.)
 *
 * REAL-WORLD ANALOGIES:
 * - Finance: find a debit and credit that cancel out to net zero.
 * - Physics/engineering: find two offsetting measurements (e.g. forces,
 *   charges) that balance to zero.
 * - Inventory: find a return (-qty) and an order (+qty) of matching size.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Brute force (every pair)   Time O(n²)  Space O(n)
 *   Approach 2  Two Pointers ★ optimal      Time O(n)   Space O(1)*
 *   (*) excluding the O(n) output list itself.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (check every pair)
 * ----------------------------------------------------------------------------
 * Idea: two nested loops try every (i, j) pair and keep the ones that sum to
 * zero. Doesn't even require the array to be sorted.
 *
 * Why it's slow: sorted order gives us a monotonic signal (too big → shrink
 * from the right; too small → grow from the left) that lets two pointers
 * skip straight past pairs that can't possibly work — brute force re-checks
 * all of them anyway.
 *
 * CONTRACT (matters once duplicates are involved): each element can be part
 * of at most ONE output pair — once index i or j is used, it's marked and
 * skipped for the rest of the scan. Without this, [-2,-2,2] would report the
 * single `2` paired with BOTH `-2`s (two "pairs" sharing one element), which
 * doesn't match the two-pointer version's semantics below. Marking elements
 * `used` keeps both approaches directly comparable.
 *
 * @example
 * pairsWithSumZeroBruteForce([-3, -2, -1, 0, 1, 2, 3, 4, 6]);
 * // [[-3,3],[-2,2],[-1,1]]
 *
 * Time:  O(n²)  — every index pair.
 * Space: O(n)   — result list + `used` tracking.
 */
export function pairsWithSumZeroBruteForce(nums: number[]): number[][] {
  const result: number[][] = [];
  const used = new Array(nums.length).fill(false);

  for (let i = 0; i < nums.length; i++) {
    if (used[i]) continue;
    for (let j = i + 1; j < nums.length; j++) {
      if (used[j]) continue;
      if (nums[i] + nums[j] === 0) {
        result.push([nums[i], nums[j]]);
        used[i] = true;
        used[j] = true;
        break; // i is consumed — move to the next i
      }
    }
  }
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — TWO POINTERS ★ OPTIMAL (requires sorted input)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: start at both ends. If the sum is too big, the only way
 * to shrink it is to move `end` left (smaller values). If too small, the only
 * way to grow it is to move `start` right. On a match, record the pair and
 * advance BOTH pointers inward — each element can only be used once.
 *
 * COMMON MISTAKE (found while reviewing the original version of this file):
 * on a match, advance only `start` and leave `end` in place. That looks fine
 * on inputs with no duplicate values, but with duplicates it can reuse the
 * same `end` element across multiple pairs it was already consumed by. e.g.
 * on [-2,-2,-2,2,3] (three -2's, one 2), advancing only `start` after a match
 * pairs the single `2` with all three `-2`'s — reporting 3 pairs when only 1
 * is actually valid. Always advance BOTH pointers on a match.
 *
 * DRY-RUN on [-3,-2,-1,0,1,2,3,4,6]:
 *   start=0(-3),end=8(6): sum=3  >0 → end--
 *   start=0(-3),end=7(4): sum=1  >0 → end--
 *   start=0(-3),end=6(3): sum=0  ✓ push [-3,3] → start=1, end=5
 *   start=1(-2),end=5(2): sum=0  ✓ push [-2,2] → start=2, end=4
 *   start=2(-1),end=4(1): sum=0  ✓ push [-1,1] → start=3, end=3 → stop (start<end fails)
 *   → [[-3,3],[-2,2],[-1,1]]  ✓
 *
 * @example
 * pairsWithSumZero([-3, -2, -1, 0, 1, 2, 3, 4, 6]);
 * // [[-3,3],[-2,2],[-1,1]]
 *
 * Time:  O(n)  — each pointer moves at most n times total.
 * Space: O(1)  — excluding the output list.
 */
export function pairsWithSumZero(nums: number[]): number[][] {
  const result: number[][] = [];
  if (!nums || nums.length === 0) {
    return result;
  }

  let start = 0;
  let end = nums.length - 1;

  while (start < end) {
    const sum = nums[start] + nums[end];

    if (sum === 0) {
      result.push([nums[start], nums[end]]);
      start++;
      end--;
    } else if (sum < 0) {
      // Too small → the only way up is a larger left value.
      start++;
    } else {
      // Too big → the only way down is a smaller right value.
      end--;
    }
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * RELATED — TWO SUM II: INPUT ARRAY IS SORTED (LeetCode 167)
 * ----------------------------------------------------------------------------
 * The general-target sibling of `pairsWithSumZero`: given a SORTED array and a
 * target, return the 1-indexed positions of the one pair that sums to it.
 * Identical converging two-pointer logic — `sum < target` grows the left,
 * `sum > target` shrinks the right — just with an arbitrary target and a
 * guaranteed unique answer. (Migrated here from the mis-categorized
 * SlidingWindow folder; it's Two Pointers, not a window.)
 *
 * @example
 * twoSumSorted([2, 7, 11, 15], 9); // [1, 2]  (numbers[0]+numbers[1] = 2+7 = 9)
 *
 * Time: O(n). Space: O(1).
 */
export function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left + 1, right + 1]; // problem uses 1-indexed positions
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [];
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "pair sums to target" + SORTED array → two pointers,
 *    O(n), O(1) extra space. Unsorted? Prefer a hash map in one pass instead
 *    of paying O(n log n) to sort first, unless sorting is already required
 *    elsewhere (e.g. it's a helper inside 3Sum).
 * 2. Always advance BOTH pointers on a match — see "Common Mistake" above.
 *    This is the same rule `twoSumAll` uses inside 3Sum.ts.
 * 3. Pitfalls: empty/short arrays (guarded above); this version does not
 *    dedupe IDENTICAL pairs from repeated values — for LeetCode-style "unique
 *    pairs only," add the same skip-duplicates-after-a-match loop used in
 *    `twoSumAll` (3Sum.ts).
 * 4. Follow-ups: generalize the target from 0 to any `target` (trivial: swap
 *    the `=== 0` check for `=== target`); this is precisely LeetCode 167,
 *    "Two Sum II — Input Array Is Sorted."
 */
