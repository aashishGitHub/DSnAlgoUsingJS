/**
 * ============================================================================
 * SORT COLORS — DUTCH NATIONAL FLAG (LeetCode 75)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an array `nums` with n objects colored red(0), white(1), or blue(2),
 * sort them IN-PLACE so equal colors are adjacent and ordered 0 → 1 → 2.
 * You must not use a library sort; ideally do it in ONE pass with O(1) space.
 *
 *   Input:  [2,0,2,1,1,0]
 *   Output: [0,0,1,1,2,2]
 *
 * PATTERN:
 * - **Three Pointers (Dutch National Flag).** `low` marks the boundary of the
 *   0s region, `high` the boundary of the 2s region, and `mid` scans. Every
 *   element is routed to its region in a single sweep. This is the canonical
 *   "partition into 3 groups in one pass" technique.
 * - (Migrated here from the mis-categorized SlidingWindow folder — it's a
 *   pointer-partition problem, not a sliding window.)
 *
 * WHEN TO USE:
 * - "Sort/partition an array with only a SMALL FIXED number of distinct values"
 *   (3 here) in one pass, O(1) space — beats an O(n log n) comparison sort.
 *
 * REAL-WORLD ANALOGIES:
 * - Triage: sort items into low/medium/high priority buckets in one pass.
 * - Rendering: z-order objects into background/midground/foreground.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Counting sort (two passes)          Time O(n)  Space O(1)
 *   Approach 2  Dutch National Flag ★ (one pass)     Time O(n)  Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — COUNTING SORT (two passes; the intuitive baseline)
 * ----------------------------------------------------------------------------
 * Count how many 0s, 1s, 2s exist, then overwrite the array with that many of
 * each in order. Simple and O(n), but touches the array twice.
 *
 * @example
 * sortColorsCountingSort([2,0,2,1,1,0]); // [0,0,1,1,2,2]
 *
 * Time: O(n) (two passes). Space: O(1) (3 counters).
 */
export function sortColorsCountingSort(nums: number[]): void {
  const counts = [0, 0, 0];
  for (const n of nums) counts[n]++;

  let i = 0;
  for (let color = 0; color < 3; color++) {
    for (let c = 0; c < counts[color]; c++) {
      nums[i++] = color;
    }
  }
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — DUTCH NATIONAL FLAG ★ OPTIMAL (single pass)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: maintain three regions via three pointers —
 *   [0..low-1] = 0s,  [low..mid-1] = 1s,  [high+1..] = 2s,  [mid..high] = unknown.
 * Scan `mid`:
 *   - nums[mid] === 0 → swap into the 0s region (low), advance BOTH low and mid.
 *   - nums[mid] === 1 → already in place, just advance mid.
 *   - nums[mid] === 2 → swap to the 2s region (high), advance high only
 *     (do NOT advance mid — the swapped-in value is still unexamined).
 *
 * DRY-RUN on [2,0,2,1,1,0]:
 *   low=0 mid=0 high=5: nums[0]=2 → swap(0,5)→[0,0,2,1,1,2], high=4
 *   low=0 mid=0 high=4: nums[0]=0 → swap(0,0), low=1, mid=1
 *   low=1 mid=1 high=4: nums[1]=0 → swap(1,1), low=2, mid=2
 *   low=2 mid=2 high=4: nums[2]=2 → swap(2,4)→[0,0,1,1,2,2], high=3
 *   low=2 mid=2 high=3: nums[2]=1 → mid=3
 *   low=2 mid=3 high=3: nums[3]=1 → mid=4 → mid>high, stop
 *   → [0,0,1,1,2,2] ✓
 *
 * @example
 * sortColors([2,0,2,1,1,0]); // [0,0,1,1,2,2]
 *
 * Time: O(n) (single pass). Space: O(1).
 */
export function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
      // NOTE: do not advance mid — the value swapped in from `high` is unexamined.
    }
  }
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "sort/partition with only k distinct values" (k=3 here)
 *    in one pass, O(1) space → Dutch National Flag three-pointer sweep.
 * 2. The subtle rule interviewers watch for: after swapping with `high`, do
 *    NOT advance `mid` — you haven't looked at what you just pulled in from the
 *    right. Advancing mid there is the classic bug (drops a value out of order).
 * 3. Counting sort (Approach 1) is also O(n)/O(1) and easier to write — mention
 *    it, then offer the one-pass DNF as the "no second pass" improvement.
 * 4. Follow-ups: generalize to k colors (counting sort scales; DNF does not
 *    directly); "Sort Colors II"/wiggle-sort variants.
 */
