/**
 * Two Sequences Dynamic Programming Problems
 * 
 * This module contains problems that involve comparing or matching two sequences
 * (strings/arrays) using 2D Dynamic Programming.
 * 
 * Common Pattern:
 *   - dp[i][j] = answer for first i elements of seq1 and first j elements of seq2
 *   - Recurrence typically involves: diagonal (match), left, top
 *   - Time: O(m × n), Space: O(m × n)
 */

// Export all problems
export { 
    longestCommonSubsequenceLength,
    longestCommonSubsequence,
    reconstructLCS
} from './longestCommonSubsequence';

export {
    minDistance as editDistance,
    minDistanceOptimized as editDistanceOptimized
} from './editDistance';

export {
    minDistance as deleteOperation,
    minDistanceLCS as deleteOperationLCS
} from './deleteOperation';

export {
    isInterleave,
    isInterleaveOptimized
} from './interleavingString';

/**
 * Problem List:
 * 
 * ✅ Implemented:
 * 1. Longest Common Subsequence (LCS) - LeetCode 1143
 * 2. Edit Distance - LeetCode 72
 * 3. Delete Operation for Two Strings - LeetCode 583
 * 4. Interleaving String - LeetCode 97
 * 
 * 📝 To Implement:
 * 5. Minimum ASCII Delete Sum - LeetCode 712
 * 6. Longest Common Substring
 * 7. Uncrossed Lines - LeetCode 1035
 * 8. Regular Expression Matching - LeetCode 10
 * 9. Wildcard Matching - LeetCode 44
 * 10. Distinct Subsequences - LeetCode 115
 */



