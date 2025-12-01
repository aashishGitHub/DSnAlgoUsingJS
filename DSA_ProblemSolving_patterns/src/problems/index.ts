/**
 * DSA Problem Solving Patterns - Master Export
 * 
 * This file exports all pattern implementations organized by category.
 * Based on Blind 75 and essential coding interview patterns.
 */

// Two Pointers Pattern
export * from './2Pointers/3Sum';
export * from './2Pointers/ContainerWithMostWater';
export * from './2Pointers/containsDuplicate';
export * from './2Pointers/groupAnagrams';
export * from './2Pointers/isSubsequence';
export * from './2Pointers/moveZeros';
export * from './2Pointers/palindrome';
export * from './2Pointers/topKFrequent';

// Sliding Window Pattern
export * from './SlidingWindow';

// Hash Map/Set Pattern
export * from './HashMap';

// Binary Search Pattern
export * from './BinarySearch/binarySearchPatterns';

// Dynamic Programming Pattern
export * from './DynamicProgramming/dpPatterns';

// Tree Traversal Pattern
export * from './TreeTraversal/treePatterns';

// Islands/Matrix Traversal Pattern
export * from './IslandsMatrix';

// Fast & Slow Pointers Pattern
export * from './FastSlowPointers';

// Merge Intervals Pattern
export * from './MergeIntervals';

// Cyclic Sort Pattern
export * from './CyclicSort';

// Arrays Pattern
// Note: Array problems are in ./Arrays/ folder
// - flattenArray.js
// - productExceptSelf.js
// - mergeTwoSortedArrays.js
// - rotateArray.js
// - rotateArrayOptimized.js
// - maxMin.js
// - increasingSequencesOfSizeK.js
// - kthLargest.js

// Strings Pattern
// Note: String problems are in ./Strings/ folder
// - reverseString.js
// - findSubstring.js
// - longestPalindrome.js
// - binaryAdd.js

// Graph Pattern
// Note: Graph problems are in ./Graph/ folder
// - traversePath.js
// - findPath.js

/**
 * Pattern Categories Overview
 * 
 * 1. TWO POINTERS (8 problems)
 *    - 3Sum, Container With Most Water, Move Zeros, etc.
 *    - Time: O(n), Space: O(1)
 * 
 * 2. SLIDING WINDOW (30+ problems)
 *    - Fixed Size, Variable Size, Two Pointer variations
 *    - Time: O(n), Space: O(1) or O(k)
 * 
 * 3. HASH MAP/SET (25+ problems)
 *    - Hash Set patterns, Hash Map patterns, Advanced patterns
 *    - Time: O(n), Space: O(n)
 * 
 * 4. BINARY SEARCH (12 problems)
 *    - Basic search, Rotated arrays, 2D matrices
 *    - Time: O(log n), Space: O(1)
 * 
 * 5. DYNAMIC PROGRAMMING (15 problems)
 *    - 1D DP, 2D DP, Optimization problems
 *    - Time: O(n) or O(n²), Space: O(n) or O(n²)
 * 
 * 6. TREE TRAVERSAL (17 problems)
 *    - DFS, BFS, BST operations, Tree construction
 *    - Time: O(n), Space: O(h) where h is height
 * 
 * 7. ISLANDS/MATRIX TRAVERSAL (15+ problems)
 *    - Number of Islands, Flood Fill, Cycle Detection
 *    - Time: O(m*n), Space: O(m*n) for recursion or O(min(m,n)) for BFS
 * 
 * 8. FAST & SLOW POINTERS (12+ problems)
 *    - Cycle Detection, Middle Finding, Palindrome Detection
 *    - Time: O(n), Space: O(1)
 * 
 * 9. MERGE INTERVALS (15+ problems)
 *    - Interval Merging, Scheduling, Conflict Resolution
 *    - Time: O(n log n), Space: O(1) or O(n)
 * 
 * 10. CYCLIC SORT (10+ problems)
 *     - Missing Numbers, Duplicate Numbers, Array Sorting
 *     - Time: O(n), Space: O(1)
 * 
 * 11. ARRAYS (8 problems)
 *     - Array manipulation, rotation, flattening
 *     - Time: O(n) to O(n²), Space: O(1) to O(n)
 * 
 * 12. STRINGS (4 problems)
 *     - String manipulation, palindromes, substring search
 *     - Time: O(n) to O(n²), Space: O(1) to O(n)
 * 
 * 13. GRAPH (2 problems)
 *     - Path traversal, DFS/BFS applications
 *     - Time: O(V + E), Space: O(V)
 * 
 * Total: 150+ problems covering all major DSA patterns
 * Perfect for coding interview preparation!
 * 
 * Additional Patterns Available:
 * - In-Place Reversal of Linked List
 * - Two Heaps
 * - Subsets (Bit Manipulation and Backtracking)
 * - Bitwise XOR
 * - Top K Elements
 * - K-Way Merge
 * - Topological Sort
 * - 0/1 Knapsack
 * - Fibonacci Numbers
 * - Palindromic Subsequence
 */
