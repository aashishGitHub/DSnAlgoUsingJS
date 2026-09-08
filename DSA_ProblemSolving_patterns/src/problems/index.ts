/**
 * DSA Problem Solving Patterns - Master Export
 * 
 * This file exports all pattern implementations organized by category.
 * Based on Blind 75 and essential coding interview patterns.
 */

// Two Pointers Pattern
export * from './2Pointers/3Sum';
export * from './2Pointers/bestTimeToBuySell';
export * from './2Pointers/ContainerWithMostWater';
export * from './2Pointers/isSubsequence';
export * from './2Pointers/moveZeros';
export * from './2Pointers/moveZeros_solutions';
export * from './2Pointers/palindrome';
export * from './2Pointers/removeDuplicatesFromSortedArray';
export * from './2Pointers/removeElement';
export * from './2Pointers/sortColors';
export * from './2Pointers/sortedSquares';
export * from './2Pointers/sumZero';
export * from './2Pointers/trappingRainWater';
// Note: moveZeros_practice_problems.ts is intentionally NOT re-exported here —
// it's a fill-in-the-blank practice companion to moveZeros_solutions.ts, not
// a set of implementations meant to be consumed elsewhere.
// Note: groupAnagrams and topKFrequent moved to HashMap/ (their correct
// pattern home) — see the HashMap Pattern export block below.
// Note: containsDuplicate.ts was renamed to removeDuplicatesFromSortedArray.ts
// — its content never actually implemented "contains duplicate" (LeetCode 217,
// already covered by HashMap/hashSetPatterns.ts); it was mislabeled content
// for LeetCode 26 all along.

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

// Backtracking Pattern (choose → explore → un-choose)
export * from './Backtracking/backtrackingPatterns';

// Graph Pattern (adjacency lists: BFS/DFS, topological sort, components)
export * from './Graph/graphPatterns';

// Union-Find / DSU Pattern (connectivity, components, undirected cycle detection)
export * from './UnionFind/unionFind';

// Trie / Prefix Tree Pattern (LC208 Trie, LC211 wildcard search, LC212 Word Search II)
export * from './Trie/triePatterns';

// Bit Manipulation Pattern (XOR cancelling, n&(n-1), n&-n)
// Note: `missingNumberXOR` / `singleNumberXOR` are named for their technique
// because `missingNumber` (CyclicSort) and `singleNumber` (HashMap) already
// own those names — three patterns, same problems, deliberately comparable.
export * from './BitManipulation/bitPatterns';

// Stack Pattern (monotonic stack, MinStack, RPN, nested decoding)
export * from './Stack/stackPatterns';

// Heap / Priority Queue Pattern (reusable PriorityQueue, two-heaps median, top-k)
export * from './Heap/heapPatterns';

// Linked List Pattern (rewiring: merge two / merge k)
// Note: exported by NAME rather than `export *` because the module re-exports
// `ListNode`, which FastSlowPointers also exports — a duplicate star-export
// would make the name ambiguous and silently drop it from this barrel.
// `ListNode` stays canonical in FastSlowPointers.
export {
    mergeTwoLists,
    mergeKLists,
    mergeKListsBruteForce,
    mergeKListsDivide,
} from './LinkedList/linkedListPatterns';

// Arrays Pattern (each file: brute-force → optimized ladder)
export * from './Arrays/productExceptSelf';
export * from './Arrays/rotateArray';
export * from './Arrays/mergeTwoSortedArrays';
export * from './Arrays/flattenArray';
export * from './Arrays/maxMin';
export * from './Arrays/increasingStreaks';
// Note: kthLargest.js is the gold-standard reference (imported directly by its
// test); arrayPatternProblems.ts is NOT re-exported wholesale here — it
// re-exports sortColors from 2Pointers, which would double-export. Its matrix
// transforms are genuinely useful and were previously unreachable from this
// barrel, so they are exported by name instead.
export { setZeroes, spiralOrder, rotateMatrix90 } from './Arrays/arrayPatternProblems';

// Strings Pattern
export * from './Strings/longestPalindromicSubstring';
export * from './Strings/longestPalindromeFromPairs';
export * from './Strings/binaryAdd';
export * from './Strings/findSubstring';
export * from './Strings/reverseString';

// Easy / warm-ups
export * from './easy/GCD_of_strings';
export * from './easy/canPlaceFlowers';
export * from './easy/removeCharAtGivenIndex';
export * from './easy/validParenthesis_STACK';
export * from './easy/merge2StringsAlternatively';

// Greedy Pattern (locally best choice, never reconsidered)
export * from './Greedy/greedyPatterns';

// Prefix Sum Pattern (precompute cumulative totals, O(1) range queries)
export * from './PrefixSum/prefixSumPatterns';

// Shortest Path Pattern (Dijkstra for non-negative weights, Bellman-Ford otherwise)
export * from './ShortestPath/shortestPathPatterns';

// Misc
export * from './Misc/superPrime';

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
 * 5. DYNAMIC PROGRAMMING (25 problems)
 *    - 1D linear, choice, knapsack (0/1 + unbounded), grid, 2-sequence string DP
 *    - Nine of them ship the full brute-force → memo → tabulate ladder
 *    - Time: O(n) or O(n²), Space: O(n) or O(n²), often rollable to O(1)
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
 * 13. TRIE / PREFIX TREE (3 problems)
 *     - Implement Trie, wildcard search, Word Search II (trie as pruning oracle)
 *     - Time: O(L) per op where L = query length, Space: O(N * L)
 *
 * 14. BIT MANIPULATION (8 problems)
 *     - XOR cancelling, n&(n-1), n&-n; JS 32-bit signed caveats
 *     - Time: O(1) to O(32), Space: O(1)
 *
 * 15. STACK / MONOTONIC STACK (8 problems)
 *     - MinStack, RPN, next-greater family, largest rectangle, nested decoding
 *     - Time: O(n) amortized, Space: O(n)
 *
 * 16. HEAP / PRIORITY QUEUE (5 problems + reusable PriorityQueue)
 *     - Top-k (size-k heap), two-heaps streaming median, k closest
 *     - Time: O(log n) per op, Space: O(n)
 *
 * 17. LINKED LIST REWIRING (2 problems, 4 implementations)
 *     - Merge two / merge k (heap and divide-and-conquer)
 *     - Time: O(n) / O(N log k), Space: O(1) / O(k)
 *
 * 18. GRAPH (14 problems)
 *     - BFS/DFS, connected components, topological sort (Kahn's + DFS colouring),
 *       clone graph, valid tree, alien dictionary, word ladder, bipartite check
 *     - Time: O(V + E), Space: O(V)
 *     - See also UnionFind/ for the DSU approach to connectivity
 * 
 * Total: 150+ problems covering all major DSA patterns
 * Perfect for coding interview preparation!
 * 
 * Now also covered (previously listed here as aspirational):
 * - Two Heaps            -> Heap/heapPatterns.ts (MedianFinder)
 * - Top K Elements       -> Heap/heapPatterns.ts, HashMap/topKFrequent.ts
 * - K-Way Merge          -> LinkedList/linkedListPatterns.ts (mergeKLists)
 * - Bitwise XOR          -> BitManipulation/bitPatterns.ts
 * - Topological Sort     -> Graph/graphPatterns.ts (Kahn's + DFS colouring)
 * - 0/1 Knapsack         -> DynamicProgramming/dpPatterns.ts (knapsack01)
 * - In-Place Reversal    -> FastSlowPointers/fastSlowPointers.ts (reverseList)
 *
 * Still NOT implemented in this TS track (genuine gaps, not a wishlist):
 * - Shortest paths on weighted graphs (Dijkstra, Bellman-Ford, MST)
 * - Interval DP (Burst Balloons) and digit DP
 * - Palindromic Subsequence (LC516); LC5 exists only as expand-around-centre
 * - Greedy as its own home (Gas Station, Hand of Straights)
 * - Prefix-sum problems LC303 / LC523 / LC724 and difference arrays
 */
