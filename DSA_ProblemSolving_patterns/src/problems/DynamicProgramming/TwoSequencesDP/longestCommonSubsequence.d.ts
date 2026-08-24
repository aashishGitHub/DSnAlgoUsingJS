/**
 * Type declarations for longestCommonSubsequence.js (kept as .js for its
 * teaching-oriented inline commentary; see that file for the full writeup).
 */

/** Length of the LCS of two strings — bottom-up 2D DP. O(m·n) time/space. */
export function longestCommonSubsequenceLength(text1: string, text2: string): number;

/** Full DP table for the LCS of two strings ((m+1)×(n+1) matrix). */
export function longestCommonSubsequence(text1: string, text2: string): number[][];

/** Reconstruct one valid LCS string by tracing back through the DP table. */
export function reconstructLCS(text1: string, text2: string, dp: number[][]): string;
