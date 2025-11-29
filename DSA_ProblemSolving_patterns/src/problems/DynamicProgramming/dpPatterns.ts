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
 * 13. Maximum Product Subarray (LeetCode 152)
 * Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.
 */
export function maxProduct(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    let maxSoFar = nums[0];
    let minSoFar = nums[0];
    let result = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        const temp = maxSoFar;
        maxSoFar = Math.max(nums[i], Math.max(maxSoFar * nums[i], minSoFar * nums[i]));
        minSoFar = Math.min(nums[i], Math.min(temp * nums[i], minSoFar * nums[i]));
        result = Math.max(result, maxSoFar);
    }
    
    return result;
}

/**
 * 14. Maximum Subarray (Kadane's Algorithm) (LeetCode 53)
 * Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
 */
export function maxSubArray(nums: number[]): number {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
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
