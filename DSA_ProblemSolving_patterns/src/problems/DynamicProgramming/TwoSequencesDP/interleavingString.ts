/**
 * Interleaving String - LeetCode 97
 * 
 * Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.
 * 
 * An interleaving of two strings s and t is a configuration where s and t are divided into 
 * n and m non-empty substrings respectively, such that:
 *   - s = s1 + s2 + ... + sn
 *   - t = t1 + t2 + ... + tm
 *   - |n - m| <= 1
 *   - The interleaving is s1 + t1 + s2 + t2 + ... or t1 + s1 + t2 + s2 + ...
 * 
 * Example:
 *   Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
 *   Output: true
 *   Explanation: One possible interleaving: "aa" + "dbb" + "bc" + "c" + "a" + "bc"
 * 
 * Pattern: Two Sequences DP
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) [can optimize to O(min(m, n))]
 */

/**
 * APPROACH: 2D Dynamic Programming
 * 
 * State: dp[i][j] = can s3[0...i+j-1] be formed by interleaving s1[0...i-1] and s2[0...j-1]?
 * 
 * Base Cases:
 *   - dp[0][0] = true  (empty strings can form empty string)
 *   - dp[i][0] = s1[0...i-1] === s3[0...i-1]  (only using s1)
 *   - dp[0][j] = s2[0...j-1] === s3[0...j-1]  (only using s2)
 * 
 * Recurrence:
 *   dp[i][j] = (
 *     (dp[i-1][j] && s1[i-1] === s3[i+j-1]) ||  // Take from s1
 *     (dp[i][j-1] && s2[j-1] === s3[i+j-1])     // Take from s2
 *   )
 * 
 * Visual Example: s1 = "a", s2 = "b", s3 = "ab"
 * 
 *         ""  b
 *      ""  T   T
 *       a  T   T  ← dp[1][1] = true (can form "ab")
 */
export function isInterleave(s1: string, s2: string, s3: string): boolean {
    const m = s1.length;
    const n = s2.length;
    
    // Early exit: lengths must match
    if (m + n !== s3.length) {
        return false;
    }
    
    // dp[i][j] = can s3[0...i+j-1] be formed by interleaving s1[0...i-1] and s2[0...j-1]?
    const dp: boolean[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(false));
    
    // Base case: empty strings
    dp[0][0] = true;
    
    // Base case: only using s1
    for (let i = 1; i <= m; i++) {
        dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
    }
    
    // Base case: only using s2
    for (let j = 1; j <= n; j++) {
        dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
    }
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const k = i + j - 1; // Current position in s3
            
            dp[i][j] = (
                (dp[i - 1][j] && s1[i - 1] === s3[k]) ||  // Take character from s1
                (dp[i][j - 1] && s2[j - 1] === s3[k])      // Take character from s2
            );
        }
    }
    
    return dp[m][n];
}

/**
 * Space-optimized version using only previous row
 */
export function isInterleaveOptimized(s1: string, s2: string, s3: string): boolean {
    const m = s1.length;
    const n = s2.length;
    
    if (m + n !== s3.length) {
        return false;
    }
    
    // Use shorter string for columns
    if (m > n) {
        return isInterleaveOptimized(s2, s1, s3);
    }
    
    let prev = Array(n + 1).fill(false);
    prev[0] = true;
    
    // Initialize first row
    for (let j = 1; j <= n; j++) {
        prev[j] = prev[j - 1] && s2[j - 1] === s3[j - 1];
    }
    
    for (let i = 1; i <= m; i++) {
        const curr = Array(n + 1).fill(false);
        curr[0] = prev[0] && s1[i - 1] === s3[i - 1];
        
        for (let j = 1; j <= n; j++) {
            const k = i + j - 1;
            curr[j] = (
                (prev[j] && s1[i - 1] === s3[k]) ||
                (curr[j - 1] && s2[j - 1] === s3[k])
            );
        }
        
        prev = curr;
    }
    
    return prev[n];
}

// Test cases (uncomment to run)
/*
console.log("Interleaving String Examples:");
console.log(`"aabcc" + "dbbca" = "aadbbcbcac": ${isInterleave("aabcc", "dbbca", "aadbbcbcac")}`); // true
console.log(`"aabcc" + "dbbca" = "aadbbbaccc": ${isInterleave("aabcc", "dbbca", "aadbbbaccc")}`); // false
console.log(`"" + "b" = "b": ${isInterleave("", "b", "b")}`); // true
*/

