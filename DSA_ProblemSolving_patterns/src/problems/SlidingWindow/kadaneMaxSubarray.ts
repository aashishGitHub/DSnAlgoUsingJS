/**
 * ============================================================================
 * MAXIMUM SUBARRAY — KADANE'S ALGORITHM (LeetCode 53)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums`, find the contiguous subarray (at least one
 * element) with the largest sum, and return that sum.
 *
 *   Input:  [-2,1,-3,4,-1,2,1,-5,4]
 *   Output: 6   (the subarray [4,-1,2,1])
 *
 * PATTERN:
 * - **Kadane's / running-sum DP.** At each index ask ONE question: "is it
 *   better to extend the best subarray ending at the previous index, or to
 *   start fresh at the current element?" That local choice
 *   `currentSum = max(nums[i], currentSum + nums[i])` yields the global optimum.
 * - It's the 1-D DP where you only need the previous state, so it collapses to
 *   O(1) space — closely related to the fixed/variable window sweeps in this
 *   folder (single left-to-right pass, constant work per element).
 *
 * WHEN TO USE:
 * - "Maximum/minimum sum of a CONTIGUOUS subarray" and its variants (max
 *   product subarray, best time to buy/sell stock, max circular subarray).
 *
 * REAL-WORLD ANALOGIES:
 * - Finance: most profitable contiguous run of daily gains/losses.
 * - Signal processing: highest-energy contiguous segment of a series.
 * - Ops: worst contiguous window of net error deltas (use the min variant).
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Brute force (all subarrays, resum)     Time O(n³)  Space O(1)
 *   Approach 2  Brute force (running inner sum)         Time O(n²)  Space O(1)
 *   Approach 3  Kadane ★ optimal                        Time O(n)   Space O(1)
 *   Approach 4  Kadane + subarray indices               Time O(n)   Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (every subarray, re-summed element by element)
 * ----------------------------------------------------------------------------
 * The most literal reading: try every (i, j) subarray and sum it from scratch.
 *
 * Why it's slow: the innermost loop re-adds elements that the previous j
 * iteration already summed — pure repeated work, removed in Approach 2.
 *
 * Time: O(n³). Space: O(1).
 */
export function maxSubarrayBruteForceCubic(nums: number[]): number {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      let currentSum = 0;
      for (let k = i; k <= j; k++) {
        currentSum += nums[k];
      }
      maxSum = Math.max(maxSum, currentSum);
    }
  }
  return maxSum;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — BRUTE FORCE (running inner sum: drop the third loop)
 * ----------------------------------------------------------------------------
 * Keep a running sum as `j` extends, so each subarray sum is O(1) to update.
 * Still O(n²) because we restart the running sum for every start index `i`.
 *
 * Time: O(n²). Space: O(1).
 */
export function maxSubarrayBruteForceQuadratic(nums: number[]): number {
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }
  return maxSum;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — KADANE'S ALGORITHM ★ OPTIMAL
 * ----------------------------------------------------------------------------
 * 🎯 KEY INSIGHT: at each position, ask "start fresh here, or continue my
 *    current streak?" — whichever gives the larger running sum.
 *
 * 📊 DRY-RUN on [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
 *    ┌─────┬──────────┬─────────────┬──────────┬─────────────────────────┐
 *    │ i   │ nums[i]  │ currentSum  │ maxSum   │ Decision                │
 *    ├─────┼──────────┼─────────────┼──────────┼─────────────────────────┤
 *    │ 0   │ -2       │ -2          │ -2       │ Initialize              │
 *    │ 1   │  1       │  1          │  1       │ Start fresh (1 > -2+1)  │
 *    │ 2   │ -3       │ -2          │  1       │ Continue (-2 > -3)      │
 *    │ 3   │  4       │  4          │  4       │ Start fresh (4 > -2+4)  │
 *    │ 4   │ -1       │  3          │  4       │ Continue (3 > -1)       │
 *    │ 5   │  2       │  5          │  5       │ Continue (5 > 2)        │
 *    │ 6   │  1       │  6          │  6       │ Continue (6 > 1) ✨ MAX  │
 *    │ 7   │ -5       │  1          │  6       │ Continue (1 > -5)       │
 *    │ 8   │  4       │  5          │  6       │ Continue (5 > 4)        │
 *    └─────┴──────────┴─────────────┴──────────┴─────────────────────────┘
 *    Result: max sum = 6, subarray = [4, -1, 2, 1].
 *
 * 🔑 CORE FORMULA:
 *    currentSum = max(nums[i], currentSum + nums[i])
 *    maxSum     = max(maxSum, currentSum)
 *
 * ⚠️ Initialize with nums[0], NOT 0 — otherwise an all-negative array like
 *    [-3,-1,-2] wrongly returns 0 instead of -1.
 *
 * @example
 * kadaneMaxSubarray([-2,1,-3,4,-1,2,1,-5,4]); // 6
 *
 * Time: O(n) — single pass. Space: O(1).
 */
export function kadaneMaxSubarray(nums: number[]): number {
  if (!nums || nums.length === 0) {
    return 0;
  }

  let maxSum = nums[0]; // best sum found globally
  let currentSum = nums[0]; // best sum of a subarray ending at the current index

  for (let i = 1; i < nums.length; i++) {
    // Start fresh from nums[i], or extend the current streak — whichever is larger.
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 4 — KADANE + SUBARRAY INDICES (report WHERE the max occurs)
 * ----------------------------------------------------------------------------
 * Same O(n) sweep, but track the start/end of the best subarray. `tempStart`
 * marks where the CURRENT streak began; when a new global max is found, commit
 * `tempStart`/`i` as the best `start`/`end`.
 *
 * @example
 * kadaneMaxSubarrayWithIndices([-2,1,-3,4,-1,2,1,-5,4]);
 * // { maxSum: 6, startIndex: 3, endIndex: 6, subarray: [4,-1,2,1] }
 *
 * Time: O(n). Space: O(1) (plus the returned subarray slice).
 */
export function kadaneMaxSubarrayWithIndices(nums: number[]): {
  maxSum: number;
  startIndex: number;
  endIndex: number;
  subarray: number[];
} {
  if (!nums || nums.length === 0) {
    return { maxSum: 0, startIndex: -1, endIndex: -1, subarray: [] };
  }

  let maxSum = nums[0];
  let currentSum = nums[0];
  let start = 0;
  let end = 0;
  let tempStart = 0;

  for (let i = 1; i < nums.length; i++) {
    if (currentSum < 0) {
      // Current streak is a net drag — better to start fresh here.
      currentSum = nums[i];
      tempStart = i;
    } else {
      currentSum += nums[i];
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxSum, startIndex: start, endIndex: end, subarray: nums.slice(start, end + 1) };
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "maximum/minimum sum of a CONTIGUOUS subarray" → Kadane,
 *    O(n)/O(1). If it says "subsequence" (non-contiguous), it's a different
 *    problem entirely (often a sort or a different DP).
 * 2. The one decision per element — extend vs. restart — IS the algorithm;
 *    be ready to justify why the local greedy choice is globally optimal
 *    (optimal substructure: the best subarray ending at i depends only on the
 *    best ending at i-1).
 * 3. Pitfalls: initializing with 0 breaks all-negative inputs (init with
 *    nums[0]); confusing "subarray" (contiguous) with "subsequence".
 * 4. Follow-ups this unlocks: Maximum Product Subarray (track min AND max
 *    because a negative flips them); Best Time to Buy/Sell Stock (Kadane on
 *    the diff array); Maximum Sum Circular Subarray (total − min-subarray).
 */
