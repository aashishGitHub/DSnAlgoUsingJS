/**
 * Delete Operation for Two Strings - LeetCode 583
 * 
 * Given two strings word1 and word2, return the minimum number of steps required 
 * to make word1 and word2 the same.
 * 
 * In one step, you can delete exactly one character in either string.
 * 
 * Example:
 *   Input: word1 = "sea", word2 = "eat"
 *   Output: 2
 *   Explanation: You need one step to make "sea" to "ea" and another step to make "eat" to "ea".
 * 
 * Pattern: Two Sequences DP (LCS variation)
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) [can optimize to O(min(m, n))]
 * 
 * KEY INSIGHT: This is LCS in disguise!
 *   - If we find LCS, we know which characters to keep
 *   - Delete all other characters: (m - LCS) + (n - LCS) = m + n - 2*LCS
 */

/**
 * Helper: Calculate LCS length (inline implementation)
 */
function longestCommonSubsequenceLength(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    const dp: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));
    
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
 * APPROACH 1: Using LCS (Recommended - More Intuitive)
 * 
 * 1. Find Longest Common Subsequence length
 * 2. Delete all characters not in LCS from both strings
 *    Total deletions = (m - LCS) + (n - LCS) = m + n - 2*LCS
 */
export function minDistanceLCS(word1: string, word2: string): number {
    const lcsLength = longestCommonSubsequenceLength(word1, word2);
    return word1.length + word2.length - 2 * lcsLength;
}

/**
 * APPROACH 2: Direct DP (Alternative)
 * 
 * State: dp[i][j] = minimum deletions to make word1[0...i-1] and word2[0...j-1] equal
 * 
 * Base Cases:
 *   - dp[0][j] = j  (delete all j characters from word2)
 *   - dp[i][0] = i  (delete all i characters from word1)
 * 
 * Recurrence:
 *   If word1[i-1] === word2[j-1]:
 *     dp[i][j] = dp[i-1][j-1]  (no deletion needed, characters match)
 *   Else:
 *     dp[i][j] = 1 + min(
 *       dp[i-1][j],  // Delete from word1
 *       dp[i][j-1]   // Delete from word2
 *     )
 */
export function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    const dp: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // Delete all characters from word1
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // Delete all characters from word2
    }
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // Characters match - no deletion needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Delete from either string
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],  // Delete from word1
                    dp[i][j - 1]   // Delete from word2
                );
            }
        }
    }
    
    return dp[m][n];
}

// Test cases (uncomment to run)
/*
console.log("Delete Operation Examples:");
console.log(`"sea" -> "eat": ${minDistance("sea", "eat")}`); // 2
console.log(`"leetcode" -> "etco": ${minDistance("leetcode", "etco")}`); // 4
console.log(`Using LCS approach: ${minDistanceLCS("sea", "eat")}`); // 2
*/

