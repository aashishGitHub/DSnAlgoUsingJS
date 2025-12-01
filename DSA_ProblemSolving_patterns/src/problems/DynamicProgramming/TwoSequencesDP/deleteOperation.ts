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
 * VISUAL EXAMPLE: Delete Operation for "sea" and "eat"
 * 
 * Recurrence Relation:
 *   - If word1[i-1] === word2[j-1]: dp[i][j] = dp[i-1][j-1]  (no deletion, characters match)
 *   - Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])  (delete from word1 or word2)
 * 
 * Step-by-step DP table construction:
 * 
 * Initial state (base cases):
 *        ""  e   a   t
 *     ""  0   1   2   3  ← Delete all characters from word2
 *      s  1   ?   ?   ?
 *      e  2   ?   ?   ?
 *      a  3   ?   ?   ?
 *      ↑
 *   Delete all from word1
 * 
 * After processing i=1, j=1 (word1[0]='s', word2[0]='e'):
 *   No match. dp[1][1] = 1 + min(dp[0][1], dp[1][0]) = 1 + min(1, 1) = 2
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   ?   ?  ← Delete 's' or 'e', need 2 deletions
 *      e  2   ?   ?   ?
 *      a  3   ?   ?   ?
 * 
 * After processing i=1, j=2 (word1[0]='s', word2[1]='a'):
 *   No match. dp[1][2] = 1 + min(dp[0][2], dp[1][1]) = 1 + min(2, 2) = 3
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   ?  ← Need 3 deletions total
 *      e  2   ?   ?   ?
 *      a  3   ?   ?   ?
 * 
 * After processing i=1, j=3 (word1[0]='s', word2[2]='t'):
 *   No match. dp[1][3] = 1 + min(dp[0][3], dp[1][2]) = 1 + min(3, 3) = 4
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4  ← Need 4 deletions
 *      e  2   ?   ?   ?
 *      a  3   ?   ?   ?
 * 
 * After processing i=2, j=1 (word1[1]='e', word2[0]='e'):
 *   Match found! dp[2][1] = dp[1][0] = 1
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   ?   ?  ← 'e' matches 'e', no deletion needed!
 *      a  3   ?   ?   ?
 * 
 * After processing i=2, j=2 (word1[1]='e', word2[1]='a'):
 *   No match. dp[2][2] = 1 + min(dp[1][2], dp[2][1]) = 1 + min(3, 1) = 2
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   2   ?  ← Delete 'a' from word2, total 2 deletions
 *      a  3   ?   ?   ?
 * 
 * After processing i=2, j=3 (word1[1]='e', word2[2]='t'):
 *   No match. dp[2][3] = 1 + min(dp[1][3], dp[2][2]) = 1 + min(4, 2) = 3
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   2   3  ← Need 3 deletions
 *      a  3   ?   ?   ?
 * 
 * After processing i=3, j=1 (word1[2]='a', word2[0]='e'):
 *   No match. dp[3][1] = 1 + min(dp[2][1], dp[3][0]) = 1 + min(1, 3) = 2
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   2   3
 *      a  3   2   ?   ?  ← Need 2 deletions
 * 
 * After processing i=3, j=2 (word1[2]='a', word2[1]='a'):
 *   Match found! dp[3][2] = dp[2][1] = 1
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   2   3
 *      a  3   2   1   ?  ← 'a' matches 'a', no deletion needed!
 * 
 * After processing i=3, j=3 (word1[2]='a', word2[2]='t'):
 *   No match. dp[3][3] = 1 + min(dp[2][3], dp[3][2]) = 1 + min(3, 1) = 2
 *        ""  e   a   t
 *     ""  0   1   2   3
 *      s  1   2   3   4
 *      e  2   1   2   3
 *      a  3   2   1   2  ← Final answer: 2 deletions
 * 
 * Final Answer: dp[3][3] = 2
 * Explanation: 
 *   - Keep "ea" (common subsequence)
 *   - Delete 's' from "sea" → "ea"
 *   - Delete 't' from "eat" → "ea"
 *   - Total: 2 deletions
 * 
 * 
 * TRACING BACK TO FIND WHICH CHARACTERS TO DELETE:
 * Start from dp[m][n] and work backwards:
 * 
 *   1. If word1[i-1] === word2[j-1]:
 *        → Characters match, keep both
 *        → Move to dp[i-1][j-1] (diagonal)
 * 
 *   2. Else if dp[i-1][j] < dp[i][j-1]:
 *        → Delete from word1 (word1[i-1])
 *        → Move to dp[i-1][j] (top)
 * 
 *   3. Else:
 *        → Delete from word2 (word2[j-1])
 *        → Move to dp[i][j-1] (left)
 * 
 * Example trace for "sea" and "eat":
 *   Start at dp[3][3] = 2
 *   word1[2]='a' !== word2[2]='t' → dp[3][2]=1 < dp[2][3]=3 → Delete 't' from word2, move to dp[3][2]
 *   word1[2]='a' === word2[1]='a' → Keep 'a', move to dp[2][1]
 *   word1[1]='e' === word2[0]='e' → Keep 'e', move to dp[1][0]
 *   Reached base case → Deletions: 's' from word1, 't' from word2
 * 
 * 
 * COMPLEXITY:
 *   Time: O(m * n) where m = word1.length, n = word2.length
 *   Space: O(m * n) for the DP table
 *   Space Optimized: O(min(m, n)) by using only previous row
 * 
 * 
 * COMPARISON WITH LCS APPROACH:
 *   LCS("sea", "eat") = 2 (subsequence "ea")
 *   Deletions = (3 - 2) + (3 - 2) = 1 + 1 = 2 ✓
 *   Both approaches give the same answer!
 */

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

