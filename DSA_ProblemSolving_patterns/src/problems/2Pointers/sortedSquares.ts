/**
 * ============================================================================
 * SQUARES OF A SORTED ARRAY (LeetCode 977)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums` sorted in non-decreasing order (may contain
 * negatives), return an array of the squares of each number, also sorted in
 * non-decreasing order.
 *
 *   Input:  [-4,-1,0,3,10]
 *   Output: [0,1,9,16,100]
 *
 * PATTERN:
 * - **Two Pointers from both ends.** After squaring, the LARGEST values live
 *   at the extremes (a very negative left or a very positive right), not the
 *   middle. So compare the two ends, take the bigger square, and fill the
 *   result from the back. Sortedness of the input is what makes this work.
 * - (Migrated here from the mis-categorized SlidingWindow folder.)
 *
 * WHEN TO USE:
 * - "Sorted input, transform is non-monotonic (like squaring) but symmetric" →
 *   two pointers from both ends beats sort-after-transform's O(n log n).
 *
 * REAL-WORLD ANALOGY:
 * - Merging two already-sorted runs (here: the sorted-descending negatives and
 *   sorted-ascending positives) into one sorted output — a merge step.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Square then sort           Time O(n log n)  Space O(n)
 *   Approach 2  Two Pointers ★ optimal      Time O(n)        Space O(n) (output)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — SQUARE THEN SORT (the obvious baseline)
 * ----------------------------------------------------------------------------
 * Square every element, then sort. Correct and trivial, but throws away the
 * fact that the input was already sorted — that wasted information is what
 * Approach 2 exploits to hit O(n).
 *
 * @example
 * sortedSquaresBruteForce([-4,-1,0,3,10]); // [0,1,9,16,100]
 *
 * Time: O(n log n). Space: O(n).
 */
export function sortedSquaresBruteForce(nums: number[]): number[] {
  return nums.map((n) => n * n).sort((a, b) => a - b);
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — TWO POINTERS ★ OPTIMAL (fill from the back)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: the biggest square is always at one of the two ends. Walk
 * `left` and `right` inward; whichever end has the larger magnitude, square it
 * and place it at the current back slot of the result, then move that pointer.
 *
 * DRY-RUN on [-4,-1,0,3,10]:
 *   l=0(-4) r=4(10): |10|>|−4| → result[4]=100, r=3
 *   l=0(-4) r=3(3):  |−4|>|3|  → result[3]=16,  l=1
 *   l=1(-1) r=3(3):  |3|>|−1|  → result[2]=9,   r=2
 *   l=1(-1) r=2(0):  |−1|>|0|  → result[1]=1,   l=2
 *   l=2(0)  r=2(0):  place 0   → result[0]=0
 *   → [0,1,9,16,100] ✓
 *
 * @example
 * sortedSquares([-4,-1,0,3,10]); // [0,1,9,16,100]
 *
 * Time: O(n) (single pass). Space: O(n) for the output.
 */
export function sortedSquares(nums: number[]): number[] {
  const result: number[] = new Array(nums.length);
  let left = 0;
  let right = nums.length - 1;

  for (let i = nums.length - 1; i >= 0; i--) {
    if (Math.abs(nums[left]) > Math.abs(nums[right])) {
      result[i] = nums[left] * nums[left];
      left++;
    } else {
      result[i] = nums[right] * nums[right];
      right--;
    }
  }

  return result;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "sorted array + squaring (or any transform whose max is
 *    at the extremes)" → two pointers from both ends, fill result backwards.
 * 2. The key observation to state out loud: squaring makes the array
 *    "valley-shaped" (large at both ends, small in the middle), so the merge
 *    happens from the outside in.
 * 3. Pitfall: filling the result FORWARD is awkward; fill from the back where
 *    the largest values go. Watch the `left <= right` / index-i bookkeeping.
 * 4. Follow-up: "merge two sorted arrays" is the same two-pointer merge with
 *    the runs given explicitly instead of implied by the sign split.
 */
