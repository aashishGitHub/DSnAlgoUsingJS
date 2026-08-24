/**
 * ============================================================================
 * MOVE ZEROES (LeetCode 283)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums`, move all 0's to the end of it while
 * maintaining the relative order of the non-zero elements. Must be done
 * IN-PLACE without making a copy of the array.
 *
 *   Input:  nums = [0,1,0,3,12]
 *   Output: [1,3,12,0,0]
 *
 * PATTERN:
 * - **Two Pointers, partitioning in place.** One pointer scans the array;
 *   the other marks the "write position" for the next non-zero value. This
 *   exact skeleton generalizes to ANY "partition by condition" problem —
 *   see `moveZeros_solutions.ts` for a dozen variations (move negatives,
 *   evens, vowels, arbitrary predicates, ...) built on this same idea.
 *
 * WHEN TO USE:
 * - "Rearrange in place so elements matching/not-matching a condition end up
 *   grouped, preserving relative order" → write-pointer partitioning, O(n).
 *
 * REAL-WORLD ANALOGIES:
 * - UI lists: push "empty"/placeholder rows to the bottom, keep real rows in order.
 * - Task queues: move completed/cancelled items to the end without reordering
 *   the still-pending ones.
 * - Log processing: filter out noise entries in place while preserving the
 *   chronological order of the entries that matter.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Brute force (build new array)      Time O(n)  Space O(n)
 *   Approach 2  Overwrite (two passes, no swaps)    Time O(n)  Space O(1)
 *   Approach 3  Swap ★ optimal (one pass, in place)  Time O(n)  Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (build a new array, then copy back)
 * ----------------------------------------------------------------------------
 * Idea: collect non-zero values in order, count the zeros, then append that
 * many zeros — this is the most direct reading of the problem statement.
 *
 * Why it's not optimal: the problem explicitly asks for IN-PLACE, O(1) extra
 * space. Allocating a whole second array (even if you copy it back into
 * `nums` afterward) does more work and uses more memory than necessary — the
 * later approaches never need a second array at all.
 *
 * @example
 * moveZerosBruteForce([0, 1, 0, 3, 12]);
 * // [1, 3, 12, 0, 0]
 *
 * Time:  O(n)  — one pass to build the array, one copy back.
 * Space: O(n)  — the intermediate array.
 */
export function moveZerosBruteForce(nums: number[]): void {
  const nonZeros: number[] = [];
  let zeroCount = 0;

  for (const n of nums) {
    if (n !== 0) nonZeros.push(n);
    else zeroCount++;
  }
  for (let i = 0; i < zeroCount; i++) nonZeros.push(0);

  for (let i = 0; i < nums.length; i++) nums[i] = nonZeros[i];
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — OVERWRITE (two passes, in place, no swaps)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: you don't need a second array to know where non-zero
 * values go — `nums` itself has enough room. Overwrite non-zero values into
 * position as you scan, then fill whatever's left with zeros.
 *
 * @example
 * moveZerosOverwrite([0, 1, 0, 3, 12]);
 * // [1, 3, 12, 0, 0]
 *
 * Time:  O(n)  — two linear passes.
 * Space: O(1)  — no extra array.
 */
export function moveZerosOverwrite(nums: number[]): void {
  let writeIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[writeIndex++] = nums[i];
    }
  }
  while (writeIndex < nums.length) {
    nums[writeIndex++] = 0;
  }
}

// MUST NOTE
// The core concepts involve:
// In-place array manipulation
// Maintaining relative order while moving elements
// Two-pointer technique for efficient swapping
// Partitioning elements based on a condition

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — TWO POINTERS ★ OPTIMAL (single pass, swap in place)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: Approach 2 needs two passes because it doesn't know yet
 * whether it's "done" with the front of the array. Swapping instead of
 * overwriting means every write also relocates the zero that WAS there — so
 * one pass suffices, and no value is ever lost.
 *
 * VISUAL EXAMPLE: moveZeroes([0, 1, 0, 3, 12])
 *
 * Two-Pointer Technique:
 *   - firstZero: Points to the position where next non-zero should be placed
 *   - i: Current element being examined
 *
 * Step-by-step execution:
 *
 * Initial state:
 *   nums = [0, 1, 0, 3, 12]
 *   firstZero = 0, i = 0
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [0,   1,   0,   3,  12]                              │
 * │         ↑                                                   │
 * │    firstZero=0, i=0                                         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Iteration 1: i=0, nums[0]=0
 *   Condition: nums[0] != 0? NO (it's 0)
 *   Action: Skip, no swap
 *   firstZero stays 0, i becomes 1
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [0,   1,   0,   3,  12]  (unchanged)                │
 * │         ↑    ↑                                               │
 * │    firstZero=0, i=1                                         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Iteration 2: i=1, nums[1]=1
 *   Condition: nums[1] != 0? YES (it's 1, non-zero!)
 *   Action: Swap nums[0] and nums[1]
 *   Swap: [0, 1] → [1, 0]
 *   firstZero becomes 1, i becomes 2
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   0,   0,   3,  12]  (swapped!)                 │
 * │              ↑    ↑                                           │
 * │         firstZero=1, i=2                                     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Iteration 3: i=2, nums[2]=0
 *   Condition: nums[2] != 0? NO (it's 0)
 *   Action: Skip, no swap
 *   firstZero stays 1, i becomes 3
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   0,   0,   3,  12]  (unchanged)                │
 * │              ↑         ↑                                     │
 * │         firstZero=1, i=3                                     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Iteration 4: i=3, nums[3]=3
 *   Condition: nums[3] != 0? YES (it's 3, non-zero!)
 *   Action: Swap nums[1] and nums[3]
 *   Swap: [0, 3] → [3, 0]
 *   firstZero becomes 2, i becomes 4
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   3,   0,   0,  12]  (swapped!)                 │
 * │                   ↑         ↑                               │
 * │              firstZero=2, i=4                                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Iteration 5: i=4, nums[4]=12
 *   Condition: nums[4] != 0? YES (it's 12, non-zero!)
 *   Action: Swap nums[2] and nums[4]
 *   Swap: [0, 12] → [12, 0]
 *   firstZero becomes 3, i becomes 5 (loop ends)
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   3,  12,   0,   0]  (swapped!)                 │
 * │                        ↑                                     │
 * │                   firstZero=3                                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Final Result: [1, 3, 12, 0, 0] ✅
 *
 * KEY INSIGHTS:
 * 1. firstZero always points to the first zero (or position for next non-zero)
 * 2. When we find a non-zero, we swap it with the element at firstZero
 * 3. This pushes zeros to the right while maintaining order of non-zeros
 * 4. After swap, firstZero moves forward (now points to next zero or end)
 *
 * @example
 * moveZeroes([0, 1, 0, 3, 12]);
 * // [1, 3, 12, 0, 0]
 *
 * TIME COMPLEXITY: O(n) - single pass through array
 * SPACE COMPLEXITY: O(1) - only using two pointers
 */
export function moveZeroes(nums: number[]): void {
  for (let firstZero = 0, i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      [nums[firstZero], nums[i]] = [nums[i], nums[firstZero]];
      firstZero++;
    }
  }
}

/**
 * Same algorithm as `moveZeroes`, with the tracker pointer named/kept
 * separately — kept as a naming variant since "firstZero" vs "zeroTracker"
 * are both common ways this gets phrased in the wild.
 *
 * If there is no zero, it will swap with itself. If there is one zero and
 * many non-zeros, it will swap with the first zero which in turn will be
 * swapped with the next non-zero, and so on — all non-zero elements move to
 * the front and zeros to the back, similar to Lomuto partitioning in quicksort.
 */
export function moveZeroes2(nums: number[]): void {
  let zeroTracker = 0; // Pointer for the last non-zero found position
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[zeroTracker], nums[i]] = [nums[i], nums[zeroTracker]];
      zeroTracker++;
    }
  }
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "partition in place, preserve relative order of the
 *    elements that stay" → write-pointer + scan-pointer, O(n)/O(1).
 * 2. Talking point: Approach 2 (overwrite) needs two passes but zero swaps;
 *    Approach 3 (swap) needs one pass but does more writes on average. Both
 *    are O(n)/O(1) — the "optimal" label is about pass count, not a strict
 *    complexity win, and interviewers may ask you to justify the trade-off.
 * 3. Pitfalls: forgetting this must be IN-PLACE (Approach 1 technically
 *    violates the O(1)-space constraint even though it's O(n) time — good to
 *    name as the naive baseline, not submit as the final answer).
 * 4. Follow-ups: LeetCode's own follow-up asks for a version that minimizes
 *    the total number of writes (see `moveZerosMinSwaps` in
 *    `moveZeros_solutions.ts`); more generally, "move X to the end" for any
 *    predicate (not just zero) is `partitionByCondition` in that same file.
 */
