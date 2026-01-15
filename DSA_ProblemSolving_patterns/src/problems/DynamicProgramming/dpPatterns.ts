/**
 * Dynamic Programming Pattern Problems
 * 
 * Pattern: Solve complex problems by breaking them down into simpler subproblems
 * Time Complexity: Usually O(n) or O(n²)
 * Space Complexity: O(n) or O(n²)
 */

/**
 * 1. Climbing Stairs (LeetCode 70)
 * You are climbing a staircase. It takes n steps to reach the top.
 * Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
 */
export function climbStairs(n: number): number {
    if (n <= 2) return n;
    
    let prev2 = 1; // ways to reach step 1
    let prev1 = 2; // ways to reach step 2
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * 2. House Robber (LeetCode 198)
 * You are a professional robber planning to rob houses along a street.
 * Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected.
 * Return the maximum amount of money you can rob tonight without alerting the police.
 */
export function rob(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * 3. House Robber II (LeetCode 213)
 * You are a professional robber planning to rob houses along a street.
 * All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one.
 */
export function rob2(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);
    
    // Rob houses 0 to n-2 (excluding last house)
    const robFirst = robHelper(nums, 0, nums.length - 2);
    
    // Rob houses 1 to n-1 (excluding first house)
    const robLast = robHelper(nums, 1, nums.length - 1);
    
    return Math.max(robFirst, robLast);
}

function robHelper(nums: number[], start: number, end: number): number {
    let prev2 = 0;
    let prev1 = 0;
    
    for (let i = start; i <= end; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * 4. Longest Increasing Subsequence (LeetCode 300)
 * Given an integer array nums, return the length of the longest strictly increasing subsequence.
 */
export function lengthOfLIS(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    const dp = new Array(nums.length).fill(1);
    let maxLength = 1;
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}

/**
 * 5. Longest Common Subsequence (LeetCode 1143)
 * Given two strings text1 and text2, return the length of their longest common subsequence.
 */
export function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

/**
 * 6. Word Break (LeetCode 139)
 * Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
 */
export function wordBreak(s: string, wordDict: string[]): boolean {
    const wordSet = new Set(wordDict);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length];
}

/**
 * 7. Coin Change (LeetCode 322)
 * You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.
 * Return the fewest number of coins that you need to make up that amount.
 */
export function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * 8. Unique Paths (LeetCode 62)
 * There is a robot on an m x n grid. The robot is initially located at the top-left corner.
 * The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time.
 * Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.
 */
export function uniquePaths(m: number, n: number): number {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}

/**
 * 9. Unique Paths II (LeetCode 63)
 * A robot is located at the top-left corner of a m x n grid.
 * The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid.
 * Now consider if some obstacles are added to the grids. How many unique paths would there be?
 */
export function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) {
        return 0;
    }
    
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    dp[0][0] = 1;
    
    // Initialize first row
    for (let j = 1; j < n; j++) {
        dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];
    }
    
    // Initialize first column
    for (let i = 1; i < m; i++) {
        dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];
    }
    
    // Fill the rest
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 1) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
    }
    
    return dp[m - 1][n - 1];
}

/**
 * 10. Jump Game (LeetCode 55)
 * You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.
 * Return true if you can reach the last index, or false otherwise.
 */
export function canJump(nums: number[]): boolean {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            return false;
        }
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    
    return true;
}

/**
 * 11. Jump Game II (LeetCode 45)
 * Given an array of non-negative integers nums, you are initially positioned at the first index of the array.
 * Each element in the array represents your maximum jump length at that position.
 * Your goal is to reach the last index in the minimum number of jumps.
 */
export function jump(nums: number[]): number {
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    
    return jumps;
}

/**
 * 12. Decode Ways (LeetCode 91)
 * A message containing letters from A-Z can be encoded into numbers using the following mapping:
 * 'A' -> "1", 'B' -> "2", ..., 'Z' -> "26"
 * Given a string s containing only digits, return the number of ways to decode it.
 */
export function numDecodings(s: string): number {
    if (s.length === 0 || s[0] === '0') return 0;
    
    const dp = new Array(s.length + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;
    
    for (let i = 2; i <= s.length; i++) {
        const oneDigit = parseInt(s[i - 1]);
        const twoDigit = parseInt(s.substring(i - 2, i));
        
        if (oneDigit >= 1) {
            dp[i] += dp[i - 1];
        }
        
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    
    return dp[s.length];
}

/**
 * ============================================================================
 * 13. Maximum Product Subarray (LeetCode 152)
 * ============================================================================
 *
 * Given an integer array nums, find a contiguous non-empty subarray within
 * the array that has the largest product, and return the product.
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * Example: nums = [2, 3, -2, 4]
 *
 * ┌─────┬────────┬──────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                 │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 0   │   2    │  Initialize: maxSoFar=2, minSoFar=2, result=2                │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 1   │   3    │  temp = 2 (save old max)                                     │
 * │     │        │  Candidates for max: 3, 2×3=6, 2×3=6 → max = 6               │
 * │     │        │  Candidates for min: 3, 2×3=6, 2×3=6 → min = 3               │
 * │     │        │  maxSoFar=6, minSoFar=3, result=6 ✨                          │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 2   │  -2    │  temp = 6 (save old max)                                     │
 * │     │        │  Candidates for max: -2, 6×(-2)=-12, 3×(-2)=-6 → max = -2    │
 * │     │        │  Candidates for min: -2, 6×(-2)=-12, 3×(-2)=-6 → min = -12   │
 * │     │        │  maxSoFar=-2, minSoFar=-12, result=6 (unchanged)             │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 3   │   4    │  temp = -2 (save old max)                                    │
 * │     │        │  Candidates for max: 4, (-2)×4=-8, (-12)×4=-48 → max = 4     │
 * │     │        │  Candidates for min: 4, (-2)×4=-8, (-12)×4=-48 → min = -48   │
 * │     │        │  maxSoFar=4, minSoFar=-48, result=6 (unchanged)              │
 * └─────┴────────┴──────────────────────────────────────────────────────────────┘
 *
 * Final Answer: 6 (subarray [2, 3])
 *
 * ============================================================================
 * Example with Sign Flip: nums = [-2, 3, -4]
 * ============================================================================
 *
 * ┌─────┬────────┬──────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                 │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 0   │  -2    │  Initialize: maxSoFar=-2, minSoFar=-2, result=-2             │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 1   │   3    │  temp = -2                                                   │
 * │     │        │  Candidates for max: 3, (-2)×3=-6, (-2)×3=-6 → max = 3       │
 * │     │        │  Candidates for min: 3, (-2)×3=-6, (-2)×3=-6 → min = -6      │
 * │     │        │  maxSoFar=3, minSoFar=-6, result=3                           │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 2   │  -4    │  temp = 3                                                    │
 * │     │        │  Candidates for max: -4, 3×(-4)=-12, (-6)×(-4)=24 → max = 24 │
 * │     │        │  Candidates for min: -4, 3×(-4)=-12, (-6)×(-4)=24 → min = -12│
 * │     │        │  maxSoFar=24, minSoFar=-12, result=24 ✨ SIGN FLIP!          │
 * └─────┴────────┴──────────────────────────────────────────────────────────────┘
 *
 * 🔑 KEY INSIGHT: minSoFar (-6) × nums[i] (-4) = 24 became the new max!
 *    The "villain" (most negative) became the "hero" (most positive)!
 *
 * ============================================================================
 * WHY USE temp? - CRITICAL UNDERSTANDING
 * ============================================================================
 *
 * Problem: We need OLD maxSoFar to calculate minSoFar, but we update maxSoFar first!
 *
 * WITHOUT temp (WRONG):
 *   maxSoFar = Math.max(...);  // maxSoFar is now UPDATED
 *   minSoFar = Math.min(..., maxSoFar * nums[i], ...);  // Uses NEW maxSoFar! ❌
 *
 * WITH temp (CORRECT):
 *   temp = maxSoFar;           // Save OLD value
 *   maxSoFar = Math.max(...);  // Update maxSoFar
 *   minSoFar = Math.min(..., temp * nums[i], ...);  // Uses OLD maxSoFar ✓
 *
 * Example: nums = [2, -1], at i=1:
 *   - maxSoFar=2, minSoFar=2, nums[1]=-1
 *   - We need: minSoFar = min(-1, 2×(-1), 2×(-1)) = -2
 *   - But if we update maxSoFar first to -1, we'd wrongly calculate:
 *     minSoFar = min(-1, (-1)×(-1)=1, 2×(-1)) = -2 (happens to be same here)
 *   - In other cases this causes incorrect results!
 *
 * ============================================================================
 * EDGE CASES
 * ============================================================================
 *
 * 1. EMPTY ARRAY: []
 *    → Return 0 (or throw error depending on requirements)
 *
 * 2. SINGLE ELEMENT: [5] or [-3]
 *    → Return that element (it's the only subarray)
 *
 * 3. ALL POSITIVE: [1, 2, 3, 4]
 *    → Product of entire array = 24
 *    → maxSoFar keeps growing, minSoFar equals maxSoFar
 *
 * 4. ALL NEGATIVE: [-1, -2, -3, -4]
 *    → Either single element (-1) or product of even count
 *    → [-1,-2] = 2, [-1,-2,-3,-4] = 24, but [-1,-2,-3] = -6
 *    → Answer depends on count; here it's 24
 *
 * 5. CONTAINS ZERO: [2, 3, 0, 4, 5]
 *    → Zero RESETS the product chain!
 *    → Subarrays: [2,3]=6 or [4,5]=20 → answer = 20
 *    → Zero acts as a "wall" separating subarrays
 *
 * 6. ZERO AT ENDS: [0, 2, 3] or [2, 3, 0]
 *    → Zero doesn't contribute, answer is 6
 *
 * 7. LARGE NEGATIVES: [-2, -3, 7]
 *    → [-2,-3] = 6, [7] = 7, [-2,-3,7] = 42 → answer = 42
 *
 * 8. ALTERNATING SIGNS: [2, -5, 3, -2]
 *    → Need to track min to catch sign flips
 *    → [2,-5,3,-2] = 60 → answer = 60
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 4 variables (maxSoFar, minSoFar, result, temp)
 */
export function maxProduct(nums: number[]): number {
  // Edge case: empty array
  if (nums.length === 0) return 0;

  // Initialize with first element
  // Both max and min start the same (single element subarray)
  let maxSoFar = nums[0]; // Maximum product ending at current position
  let minSoFar = nums[0]; // Minimum product ending at current position
  let result = nums[0]; // Global maximum we've found

  for (let i = 1; i < nums.length; i++) {
    // 🔑 CRITICAL: Save maxSoFar BEFORE updating!
    // We need the OLD maxSoFar value to calculate minSoFar correctly
    const temp = maxSoFar;

    // For maxSoFar, consider 3 candidates:
    // 1. nums[i] alone (start fresh)
    // 2. maxSoFar * nums[i] (extend positive streak)
    // 3. minSoFar * nums[i] (negative × negative = positive!)
    maxSoFar = Math.max(
      nums[i],
      Math.max(maxSoFar * nums[i], minSoFar * nums[i])
    );

    // For minSoFar, consider 3 candidates:
    // 1. nums[i] alone (start fresh)
    // 2. temp * nums[i] (old max × current, use temp not maxSoFar!)
    // 3. minSoFar * nums[i] (extend negative streak)
    minSoFar = Math.min(nums[i], Math.min(temp * nums[i], minSoFar * nums[i]));

    // Update global maximum
    result = Math.max(result, maxSoFar);
  }

  return result;
}

/**
 * ============================================================================
 * 14. Maximum Subarray - Kadane's Algorithm (LeetCode 53)
 * ============================================================================
 *
 * Given an integer array nums, find the contiguous subarray (containing at
 * least one number) which has the largest SUM and return its sum.
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * Example: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *
 * ┌─────┬────────┬─────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 0   │  -2    │  Initialize: maxEndingHere=-2, maxSoFar=-2                  │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 1   │   1    │  max(1, -2+1=-1) = 1 → START FRESH!                         │
 * │     │        │  maxEndingHere=1, maxSoFar=1 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 2   │  -3    │  max(-3, 1+(-3)=-2) = -2 → CONTINUE (carry the sum)         │
 * │     │        │  maxEndingHere=-2, maxSoFar=1                               │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 3   │   4    │  max(4, -2+4=2) = 4 → START FRESH!                          │
 * │     │        │  maxEndingHere=4, maxSoFar=4 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 4   │  -1    │  max(-1, 4+(-1)=3) = 3 → CONTINUE                           │
 * │     │        │  maxEndingHere=3, maxSoFar=4                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 5   │   2    │  max(2, 3+2=5) = 5 → CONTINUE                               │
 * │     │        │  maxEndingHere=5, maxSoFar=5 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 6   │   1    │  max(1, 5+1=6) = 6 → CONTINUE                               │
 * │     │        │  maxEndingHere=6, maxSoFar=6 ✨ FINAL ANSWER!               │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 7   │  -5    │  max(-5, 6+(-5)=1) = 1 → CONTINUE                           │
 * │     │        │  maxEndingHere=1, maxSoFar=6                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 8   │   4    │  max(4, 1+4=5) = 5 → CONTINUE                               │
 * │     │        │  maxEndingHere=5, maxSoFar=6                                │
 * └─────┴────────┴─────────────────────────────────────────────────────────────┘
 *
 * Answer: 6 (subarray [4, -1, 2, 1])
 *
 * Visual of the winning subarray:
 *   [-2,  1, -3,  4, -1,  2,  1, -5,  4]
 *                 └──────────────┘
 *                  4 + -1 + 2 + 1 = 6
 *
 * ============================================================================
 * 🔥 CONTRAST: MAX SUM vs MAX PRODUCT
 * ============================================================================
 *
 * ┌─────────────────┬─────────────────────────┬─────────────────────────────┐
 * │ Aspect          │ MAX SUM (Kadane)        │ MAX PRODUCT                 │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Operation       │ Addition (+)            │ Multiplication (×)          │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Track           │ Only maxEndingHere      │ BOTH max AND min            │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Why?            │ Negatives always hurt   │ Neg × Neg = Pos! 🔑         │
 * │                 │ the sum                 │ Min can become max          │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Variables       │ 2 (maxEndingHere,       │ 4 (maxSoFar, minSoFar,      │
 * │                 │    maxSoFar)            │    result, temp)            │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Need temp?      │ NO ✓                    │ YES - to save old max       │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Reset when      │ currentSum becomes      │ Element is 0 (0 × x = 0)    │
 * │                 │ worse than starting     │                             │
 * │                 │ fresh                   │                             │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Formula         │ max(a, prev + a)        │ max(a, max×a, min×a)        │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Zero handling   │ Zero is just 0, can     │ Zero KILLS the chain!       │
 * │                 │ continue or restart     │ Must restart after 0        │
 * └─────────────────┴─────────────────────────┴─────────────────────────────┘
 *
 * ============================================================================
 * WHY KADANE ONLY NEEDS maxEndingHere (not min)
 * ============================================================================
 *
 * In ADDITION: negative numbers ALWAYS hurt the sum.
 *   - Adding a negative makes sum smaller
 *   - There's no way a negative "flips" to help later
 *   - So we only care about the maximum sum ending here
 *
 * In MULTIPLICATION: negative numbers can HELP!
 *   - Neg × Neg = Pos (two wrongs make a right!)
 *   - A very negative min can become very positive max
 *   - So we MUST track both min and max
 *
 * EXAMPLE showing the difference:
 *
 *   Array: [-2, -3]
 *
 *   MAX SUM:     -2 + (-3) = -5  → Best is just -2 (single element)
 *   MAX PRODUCT: -2 × (-3) = 6   → Product of both is positive! ✨
 *
 * ============================================================================
 * MENTAL MODEL: "Should I continue or start fresh?"
 * ============================================================================
 *
 * At each element, ask: "Is my running sum helping or hurting?"
 *
 *   - If currentSum > 0: It's helping! Keep it and add current element.
 *   - If currentSum ≤ 0: It's hurting! Drop it and start fresh.
 *
 * This is equivalent to: max(nums[i], currentSum + nums[i])
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 2 variables
 */
export function maxSubArray(nums: number[]): number {
  // Global maximum - best sum we've ever seen
  let maxSoFar = nums[0];

  // Local maximum - best sum ending at current position
  // This is our "running sum" that we either continue or reset
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // THE KEY DECISION:
    // Option 1: Start fresh with nums[i] (drop previous sum)
    // Option 2: Extend previous sum with nums[i]
    // We pick whichever is larger
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);

    // Update global maximum if we found a better subarray
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

/**
 * 15. Edit Distance (LeetCode 72)
 * Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.
 * You have the following three operations permitted on a word:
 * - Insert a character
 * - Delete a character
 * - Replace a character
 */
export function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Initialize base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // delete
                    dp[i][j - 1],     // insert
                    dp[i - 1][j - 1]  // replace
                );
            }
        }
    }
    
    return dp[m][n];
}
