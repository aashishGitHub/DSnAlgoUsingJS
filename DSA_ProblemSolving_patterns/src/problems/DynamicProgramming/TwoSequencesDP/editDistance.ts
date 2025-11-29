/**
 * Edit Distance (Levenshtein Distance) - LeetCode 72
 * https://www.youtube.com/watch?v=MiqoA-yF-0M
 * 
 * Given two strings word1 and word2, return the minimum number of operations 
 * required to convert word1 to word2.
 * 
 * You have the following three operations permitted on a word:
 * - Insert a character
 * - Delete a character
 * - Replace a character
 * 
 * Example:
 *   Input: word1 = "horse", word2 = "ros"
 *   Output: 3
 *   Explanation: 
 *     horse -> rorse (replace 'h' with 'r')
 *     rorse -> rose (remove 'r')
 *     rose -> ros (remove 'e')
 * 
 * Pattern: Two Sequences DP
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) [can optimize to O(min(m, n))]
 */

/**
 * APPROACH: 2D Dynamic Programming
 * 
 * State: dp[i][j] = minimum operations to convert word1[0...i-1] to word2[0...j-1]
 * 
 * Base Cases:
 *   - dp[0][j] = j  (need to insert j characters)
 *   - dp[i][0] = i  (need to delete i characters)
 * 
 * Recurrence:
 *   If word1[i-1] === word2[j-1]:
 *     dp[i][j] = dp[i-1][j-1]  (no operation needed, characters match)
 *   Else:
 *     dp[i][j] = 1 + min(
 *       dp[i-1][j],      // Delete from word1
 *       dp[i][j-1],      // Insert into word1
 *       dp[i-1][j-1]     // Replace in word1
 *     )
 * 
 * Visual Example: word1 = "abc", word2 = "adc"
 * 
 *         ""  a   d   c
 *      ""  0   1   2   3
 *       a  1   0   1   2
 *       b  2   1   1   2
 *       c  3   2   2   1  ← Final answer: 1 operation (replace 'b' with 'd')
 */
export function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    // Create DP table: dp[i][j] = min operations to convert word1[0...i-1] to word2[0...j-1]
    const dp: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));
    
    // Base cases: converting empty string
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i; // Need to delete i characters from word1
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j; // Need to insert j characters into word1
    }
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                // Characters match - no operation needed
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Choose minimum of three operations:
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // Delete: remove word1[i-1]
                    dp[i][j - 1],     // Insert: add word2[j-1] to word1
                    dp[i - 1][j - 1]  // Replace: replace word1[i-1] with word2[j-1]
                );
            }
        }
    }
    
    return dp[m][n];
}

/**
 * Space-optimized version using only previous row
 * Space: O(min(m, n)) instead of O(m * n)
 */
export function minDistanceOptimized(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    
    // Use shorter string for columns to minimize space
    if (m < n) {
        return minDistanceOptimized(word2, word1);
    }
    
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);
    
    // Initialize first row (base case)
    for (let j = 0; j <= n; j++) {
        prev[j] = j;
    }
    
    for (let i = 1; i <= m; i++) {
        curr[0] = i; // Base case for first column
        
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(
                    prev[j],      // Delete
                    curr[j - 1],  // Insert
                    prev[j - 1]   // Replace
                );
            }
        }
        
        [prev, curr] = [curr, prev]; // Swap rows
    }
    
    return prev[n];
}

// Test cases (uncomment to run)
/*
console.log("Edit Distance Examples:");
console.log(`"horse" -> "ros": ${minDistance("horse", "ros")}`); // 3
console.log(`"intention" -> "execution": ${minDistance("intention", "execution")}`); // 5
console.log(`"abc" -> "adc": ${minDistance("abc", "adc")}`); // 1
console.log(`"" -> "abc": ${minDistance("", "abc")}`); // 3
console.log(`"abc" -> "": ${minDistance("abc", "")}`); // 3
*/

