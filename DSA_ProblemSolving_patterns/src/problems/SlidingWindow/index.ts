/**
 * Sliding Window Pattern - Main Export File
 * 
 * This file exports all sliding window pattern implementations organized by type:
 * 1. Fixed Size Sliding Window
 * 2. Variable Size Sliding Window  
 * 3. Two Pointer Sliding Window
 */

// Fixed Size Sliding Window
export {
    maxSumSubarrayOfSizeKBruteForce,
    maxSumSubarrayOfSizeK,
    firstNegativeInWindow,
    countAnagrams,
    maxOfAllSubarrays,
    averageOfAllSubarrays,
    findAnagrams
} from './fixedSizeSlidingWindow';

// Maximum Subarray — Kadane's Algorithm (running-sum DP; O(n³)→O(n²)→O(n))
export {
    maxSubarrayBruteForceCubic,
    maxSubarrayBruteForceQuadratic,
    kadaneMaxSubarray,
    kadaneMaxSubarrayWithIndices
} from './kadaneMaxSubarray';

// Variable Size Sliding Window
export {
    lengthOfLongestSubstring,
    longestSubstringWithKDistinct,
    longestSubstringWithTwoDistinct,
    minWindow,
    longestSubarrayWithSumLessThanK,
    longestSubarrayWithSumK,
    totalFruit,
    characterReplacement,
    numSubarrayProductLessThanK,
    maxScore
} from './variableSizeSlidingWindow';

// NOTE: the former `twoPointerSlidingWindow.ts` was entirely miscategorized
// (all Two Pointers, no actual windowing) and has been MIGRATED into
// `2Pointers/`:
//   maxArea            → 2Pointers/ContainerWithMostWater.ts
//   trap               → 2Pointers/trappingRainWater.ts
//   threeSum           → 2Pointers/3Sum.ts
//   threeSumClosest    → 2Pointers/3Sum.ts
//   fourSum            → 2Pointers/3Sum.ts
//   removeDuplicates   → 2Pointers/removeDuplicatesFromSortedArray.ts
//   removeElement      → 2Pointers/removeElement.ts
//   sortColors         → 2Pointers/sortColors.ts
//   isPalindrome       → 2Pointers/palindrome.ts (isValidPalindromeAlphanumeric)
//   moveZeroes         → 2Pointers/moveZeros.ts
//   twoSum (sorted)    → 2Pointers/sumZero.ts (twoSumSorted)
//   sortedSquares      → 2Pointers/sortedSquares.ts

/**
 * Sliding Window Pattern Guide
 * 
 * 1. FIXED SIZE SLIDING WINDOW:
 *    - Window size remains constant
 *    - Slide window by one position at a time
 *    - Examples: Max sum subarray, First negative in window
 *    - Time: O(n), Space: O(1) or O(k)
 * 
 * 2. VARIABLE SIZE SLIDING WINDOW:
 *    - Window size can grow or shrink based on conditions
 *    - Use two pointers (left and right)
 *    - Examples: Longest substring, Minimum window
 *    - Time: O(n), Space: O(1) or O(k)
 * 
 * 3. TWO POINTER SLIDING WINDOW:
 *    - Use two pointers moving in different directions
 *    - Often used for sorted arrays or palindromes
 *    - Examples: Container with most water, 3Sum
 *    - Time: O(n) or O(n²), Space: O(1)
 * 
 * COMMON PATTERNS:
 * - Expand window: Move right pointer
 * - Contract window: Move left pointer
 * - Check condition: Validate window state
 * - Update result: Track optimal solution
 * 
 * WHEN TO USE:
 * - Array/string problems with contiguous elements
 * - Problems asking for subarray/substring
 * - Optimization problems (min/max length, sum, etc.)
 * - Problems with sliding window constraints
 */
