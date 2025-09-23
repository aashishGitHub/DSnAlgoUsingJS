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
    maxSumSubarrayOfSizeK,
    firstNegativeInWindow,
    countAnagrams,
    maxOfAllSubarrays,
    averageOfAllSubarrays,
    findAnagrams
} from './fixedSizeSlidingWindow';

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

// Two Pointer Sliding Window
export {
    maxArea,
    trap,
    threeSum,
    threeSumClosest,
    fourSum,
    removeDuplicates,
    removeElement,
    moveZeroes,
    sortColors,
    isPalindrome,
    twoSum,
    sortedSquares
} from './twoPointerSlidingWindow';

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
