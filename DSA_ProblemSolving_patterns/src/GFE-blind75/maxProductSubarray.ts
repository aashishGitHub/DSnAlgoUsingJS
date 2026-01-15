/**
 * MAXIMUM PRODUCT IN CONTIGUOUS ARRAY / MAXIMUM PRODUCT SUBARRAY
 * Pattern: Dynamic Programming with Min/Max tracking
 * LeetCode #152 - Medium
 *
 * @see Implementation: ../problems/DynamicProgramming/dpPatterns.ts (maxProduct)
 * @see Related: ../problems/SlidingWindow/kadaneMaxSubarray.js (max SUM version)
 * @link https://www.greatfrontend.com/interviews/study/blind75/questions/algo/array-maximum-product-contiguous
 *
 * ## Problem Statement
 * Given an array of integers, find the contiguous subarray with the largest product.
 *
 * ## Examples
 * [1,2,-3,5,1]     → 5   | Subarray [5,1] or just [5]
 * [9]              → 9   | Single element
 * [1,2,0,-1,8,-4]  → 32  | Subarray [-1,8,-4] = 32
 *
 * ## Complexity
 * Time: O(n) | Space: O(1)
 *
 * ============================================================================
 * WHY TRACK BOTH MIN AND MAX? - THE KEY INSIGHT
 * ============================================================================
 *
 * Unlike Kadane's (max sum), we MUST track BOTH min and max because:
 *
 * NEGATIVE × NEGATIVE = POSITIVE! 🔑
 *
 * Example: [-2, 3, -4]
 * - At -2: max=-2, min=-2
 * - At 3: max=3, min=-6  (3 is better than -2*3)
 * - At -4: max=24! min=-12  (-6 * -4 = 24, the minimum became maximum!)
 *
 * The smallest negative can become the largest positive with one more negative!
 *
 * ============================================================================
 * PATTERN RECOGNITION - "Min/Max DP with Sign Flipping"
 * ============================================================================
 *
 * Use this pattern when:
 * 1. **Multiplication involved** - signs can flip results
 * 2. **Contiguous requirement** - must be consecutive elements
 * 3. **Optimal substructure** - best ending at i depends on best ending at i-1
 *
 * MENTAL MODEL: "Carry both the hero and the villain"
 * - maxSoFar = the hero (best positive product)
 * - minSoFar = the villain (most negative product)
 * - At any moment, villain can become hero if multiplied by negative!
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * For each element nums[i], compute 3 candidates:
 * 1. nums[i] alone (start fresh)
 * 2. maxSoFar * nums[i] (extend positive streak)
 * 3. minSoFar * nums[i] (negative × negative = positive!)
 *
 * newMax = max(nums[i], maxSoFar * nums[i], minSoFar * nums[i])
 * newMin = min(nums[i], maxSoFar * nums[i], minSoFar * nums[i])
 *
 * EDGE CASES:
 * - Zero resets everything (0 × anything = 0)
 * - Single element → return that element
 * - All negatives → return least negative (or product of two negatives)
 *
 * ============================================================================
 * COMPARISON: MAX SUM vs MAX PRODUCT
 * ============================================================================
 *
 * | Aspect         | Max Sum (Kadane)     | Max Product (This)       |
 * |----------------|----------------------|--------------------------|
 * | Track          | Just max             | Both max AND min         |
 * | Why?           | Addition is linear   | Neg × Neg = Pos          |
 * | Reset when     | currentSum < 0       | Element is 0             |
 * | Formula        | max(a, a+prev)       | max(a, a*max, a*min)     |
 *
 * ============================================================================
 * REAL-WORLD APPLICATIONS
 * ============================================================================
 *
 * FINANCE:
 * - Maximum compound return over consecutive trading days
 * - Best period for multiplicative growth rates
 * - Risk analysis: worst-case compound losses
 *
 * SIGNAL PROCESSING:
 * - Maximum gain in cascaded amplifier stages
 * - Optimal filter coefficient selection
 *
 * GAMING/SCORING:
 * - Best combo multiplier sequence
 * - Maximum power-up chain effects
 *
 * DATA ANALYSIS:
 * - Finding segments with highest multiplicative effect
 * - Identifying trends in ratio-based metrics
 *
 * ============================================================================
 * RELATED PROBLEMS
 * ============================================================================
 * - LeetCode #152: Maximum Product Subarray (this problem)
 * - LeetCode #53: Maximum Subarray (Kadane's - sum version)
 * - LeetCode #918: Maximum Sum Circular Subarray
 * - LeetCode #1567: Maximum Length of Subarray With Positive Product
 * - LeetCode #628: Maximum Product of Three Numbers
 *
 * ============================================================================
 * INTERVIEW TIPS
 * ============================================================================
 * - Start by mentioning Kadane's, then explain why it doesn't directly apply
 * - Explain the "negative × negative = positive" insight immediately
 * - Handle edge case: zeros reset the product chain
 * - Mention that you need temp variable to avoid overwriting maxSoFar
 */

/**
 * Maximum Product Subarray - DP with Min/Max tracking
 *
 * @example
 * maxProduct([2,3,-2,4]) → 6    // [2,3]
 * maxProduct([-2,0,-1]) → 0     // [0] or any with 0
 * maxProduct([-2,3,-4]) → 24   // [-2,3,-4] = 24
 *
 * Time: O(n) | Space: O(1)
 */
export function maxProduct(nums: number[]): number {
  if (nums.length === 0) return 0;

  // Track both max and min ending at current position
  let maxSoFar = nums[0];
  let minSoFar = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Save maxSoFar before overwriting (we need it for minSoFar calculation)
    const temp = maxSoFar;

    // New max: either start fresh, extend max streak, or flip from min
    maxSoFar = Math.max(nums[i], Math.max(maxSoFar * nums[i], minSoFar * nums[i]));

    // New min: either start fresh, extend min streak, or flip from max
    minSoFar = Math.min(nums[i], Math.min(temp * nums[i], minSoFar * nums[i]));

    // Update global result
    result = Math.max(result, maxSoFar);
  }

  return result;
}

// Re-export from implementation file for consistency
export { maxProduct as maxProductSubarray } from "../problems/DynamicProgramming/dpPatterns";
