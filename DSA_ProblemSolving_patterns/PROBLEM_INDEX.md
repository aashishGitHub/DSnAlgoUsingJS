# 📚 Complete Problem Index - Organized by Patterns

*Master reference for all DSA problems in this repository, organized by pattern for easy navigation*

> **Two language tracks.** This index covers the **TypeScript** implementations
> under `src/problems/`. The **Go** track lives in [`Go/`](../Go/) — 26 pattern
> packages, 267 solution functions, 337 tests, all passing — with its own single
> revision document, [`Go/GO_INTERVIEW_QA.md`](../Go/GO_INTERVIEW_QA.md).
>
> **Parity between the tracks is tracked in
> [§13 JS ↔ Go parity](#13-js--go-parity) at the bottom of this file.**

---

## 🎯 Quick Navigation by Pattern

| Pattern | Count | Location | Status |
|---------|-------|----------|--------|
| [Two Pointers](#1-two-pointers) | 12+ | `src/problems/2Pointers/` | ✅ Organized |
| [Sliding Window](#2-sliding-window) | 15+ | `src/problems/SlidingWindow/` | ✅ Organized |
| [Hash Map/Set](#3-hash-mapset) | 10+ | `src/problems/HashMap/` | ✅ Organized |
| [Dynamic Programming](#4-dynamic-programming) | 20+ | `src/problems/DynamicProgramming/` | ✅ Organized |
| [Binary Search](#5-binary-search) | 5+ | `src/problems/BinarySearch/` | ✅ Organized |
| [Tree Traversal](#6-tree-traversal) | 5+ | `src/problems/TreeTraversal/` | ✅ Organized |
| [Fast & Slow Pointers](#7-fast--slow-pointers) | 5+ | `src/problems/FastSlowPointers/` | ✅ Organized |
| [Merge Intervals](#8-merge-intervals) | 5+ | `src/problems/MergeIntervals/` | ✅ Organized |
| [Cyclic Sort](#9-cyclic-sort) | 5+ | `src/problems/CyclicSort/` | ✅ Organized |
| [Islands/Matrix](#10-islandsmatrix-traversal) | 5+ | `src/problems/IslandsMatrix/` | ✅ Organized |
| [Arrays & Strings](#11-arrays--strings) | 15+ | `src/problems/Arrays/`, `Strings/`, `easy/` | ✅ Organized |
| [Data Structures](#12-data-structures) | 20+ | `DataStructures/` | ✅ Organized |
| Backtracking | 5 | `src/problems/Backtracking/` | ✅ New (tests to follow) |
| Graph (adjacency lists) | 7 | `src/problems/Graph/graphPatterns.ts` | ✅ New (tests to follow) |

> **📖 Single-document revision:** [`PATTERNS_REVISION_GUIDE.md`](PATTERNS_REVISION_GUIDE.md)
> — every pattern with the incremental brute-force → optimized build, recognition
> table, pitfalls, and drills. Start there; drill into folders from its links.

---

## 1. Two Pointers

**When to Use**: Sorted arrays, palindromes, pair problems, optimizing from O(n²) to O(n)  
**Time Complexity**: O(n) | **Space Complexity**: O(1)

### Problems in `src/problems/2Pointers/` (all with brute-force → optimized writeups + tests):
- ✅ **3Sum family** - `3Sum.ts` - 3Sum, 3Sum Closest (LC16), 4Sum (LC18)
- ✅ **Container With Most Water** - `ContainerWithMostWater.ts` - Max area between two bars (LC11)
- ✅ **Trapping Rain Water** - `trappingRainWater.ts` - Total trapped water (LC42)
- ✅ **Move Zeros family** - `moveZeros.ts` + `moveZeros_solutions.ts` (12 partition variations) + `moveZeros_practice_problems.ts` (fill-in-the-blank practice)
- ✅ **Valid Palindrome** - `palindrome.ts` - 4 approaches + alphanumeric extension (LC125)
- ✅ **Is Subsequence** - `isSubsequence.ts` - Greedy two-pointer match (LC392)
- ✅ **Pairs With Sum Zero / Two Sum II** - `sumZero.ts` - Sorted-array pair search (LC167)
- ✅ **Remove Duplicates from Sorted Array** - `removeDuplicatesFromSortedArray.ts` (LC26)
- ✅ **Remove Element** - `removeElement.ts` (LC27)
- ✅ **Sort Colors (Dutch National Flag)** - `sortColors.ts` (LC75)
- ✅ **Squares of a Sorted Array** - `sortedSquares.ts` (LC977)
- ✅ **Best Time to Buy/Sell Stock (6 variations)** - `bestTimeToBuySell.ts` (LC121/122/123/188/309/714)

> Note: `groupAnagrams` and `topKFrequent` moved to `HashMap/` (their correct
> pattern); the old `containsDuplicate.ts` was mislabeled LC26 content and is
> now `removeDuplicatesFromSortedArray.ts`.

---

## 2. Sliding Window

**When to Use**: Contiguous subarrays/substrings, optimization problems, fixed/variable size windows  
**Time Complexity**: O(n) | **Space Complexity**: O(1) or O(k)

### Problems in `src/problems/SlidingWindow/`:
- ✅ **Fixed Size Window** - `fixedSizeSlidingWindow.ts` - Max sum of size K (brute force + optimal), first negative per window, anagram counting, window maxima (deque), averages
- ✅ **Variable Size Window** - `variableSizeSlidingWindow.ts` - Longest substring no repeats, K-distinct, min window substring, fruit baskets, char replacement, subarray product < K
- ✅ **Kadane's Maximum Subarray** - `kadaneMaxSubarray.ts` - O(n³)→O(n²)→O(n) progression + index-tracking variant (LC53)

> Note: the former `twoPointerSlidingWindow.ts` was miscategorized (no actual
> windowing) — its 12 problems migrated to `2Pointers/`; see the mapping in
> `SlidingWindow/index.ts`.

---

## 3. Hash Map/Set

**When to Use**: Frequency counting, lookups, duplicate detection, complement finding  
**Time Complexity**: O(n) | **Space Complexity**: O(n)

### Problems in `src/problems/HashMap/`:
- ✅ **Hash Set Patterns** - `hashSetPatterns.ts` - Contains duplicate, intersection, etc.
- ✅ **Hash Map Patterns** - `hashMapPatterns.ts` - Two sum, group anagrams, etc.
- ✅ **Longest Consecutive** - `longestConsecutive.ts` - Longest consecutive sequence

### Problems in Root (Need Organization):
- 🔄 **2Sum** - `2sum.js` - Find pairs that sum to target
- 🔄 **Anagram Multiple Sets** - `anagram_MULTIPLE_SET_OF_DATA.js` - Check anagrams using hash map
- 🔄 **Max Chars** - `maxChars.js` - Find character with maximum frequency
- 🔄 **List All Pairs of Sum K** - `listAllPairsOfSum_K.js` - Find all pairs summing to K
- 🔄 **Get Unique** - `getUnique.js` - Get unique elements from array
- 🔄 **Count Unique** - `countUnique.js` - Count unique values

---

## 4. Dynamic Programming

**When to Use**: Optimization, counting, decision problems with overlapping subproblems  
**Time Complexity**: O(n) to O(n²) | **Space Complexity**: O(n) to O(n²)

### Problems in `src/problems/DynamicProgramming/`:
- ✅ **DP Patterns** - `dpPatterns.ts` - Various DP patterns and templates
- ✅ **Two Sequences DP** - `TwoSequencesDP/` - LCS, Edit Distance, Interleaving String

### Problems in Root (Need Organization):
- 🔄 **Coin Change** - `coinChange.js` - Minimum coins to make amount (Unbounded DP)
- 🔄 **Longest Increasing Subsequence** - `longestIncreasingSubsequence.js` - LIS using DP
- 🔄 **Longest Common Subsequence** - `longestCommonSubsequence.js` - LCS of two sequences
- 🔄 **House Robber** - `maxSubsequenceNoAdjacent_HouseRobber.js` - Maximum sum non-adjacent (Choice DP)
- 🔄 **Max Increasing Subsequence** - `maxIncreasingSubSequence.js` - Maximum sum increasing subsequence
- 🔄 **Max Subsequence Adjacent Diff Unity** - `maxSubsequenceAdjacentDiffUnity..js` - Special LIS variant
- 🔄 **Knapsack** - `knapsack.js` - 0/1 Knapsack problem
- 🔄 **Fibonacci** - `fibonacci.js` - Fibonacci sequence (Linear DP)

---

## 5. Binary Search

**When to Use**: Sorted arrays, search space reduction, optimization  
**Time Complexity**: O(log n) | **Space Complexity**: O(1)

### Problems in `src/problems/BinarySearch/`:
- ✅ **Binary Search Patterns** - `binarySearchPatterns.ts` - Classic, rotated, answer search

### Problems in Root (Need Organization):
- 🔄 **Binary Search** - `Searching/binarySearch.js` - Classic binary search implementation

---

## 6. Tree Traversal

**When to Use**: Tree/graph problems, DFS/BFS, tree construction  
**Time Complexity**: O(n) | **Space Complexity**: O(h) where h is height

### Problems in `src/problems/TreeTraversal/`:
- ✅ **Tree Patterns** - `treePatterns.ts` - Various tree traversal patterns

### Problems in `DataStructures/Tree/`:
- ✅ **Binary Search Tree** - `binarySearchTree.js`
- ✅ **Tree Implementation** - `tree.js`, `tree1.js`
- ✅ **Level Order Traversal** - `levelOrderTraversal.js`
- ✅ **Left View of BT** - `leftViewOfBT.js`
- ✅ **Print Leaf Nodes** - `print_leafNodes_BST_leftToRight.js`

### Problems in `DataStructures/Exercise/`:
- ✅ **BST Kth Max** - `BST_kthMax.js`
- ✅ **2 BST Equal** - `2BST_Equal.js`
- ✅ **Ancestors** - `ancestors.js`
- ✅ **Reverse Inorder Kth Max** - `reverseInorderTraversal_kthMax.js`

### Problems in Root (Need Organization):
- 🔄 **Serialize/Deserialize BST** - `serializeDeserializeBST.js` - Tree serialization

---

## 7. Fast & Slow Pointers

**When to Use**: Cycle detection, finding middle, palindrome checks in linked lists  
**Time Complexity**: O(n) | **Space Complexity**: O(1)

### Problems in `src/problems/FastSlowPointers/`:
- ✅ **Fast Slow Patterns** - `fastSlowPointers.ts` - Cycle detection, middle finding

### Problems in `DataStructures/LinkedList/`:
- ✅ **Linked List** - `linkedList.js`, `linkedList1.js`
- ✅ **Rotate Linked List** - `rotateLinkedList.js`
- ✅ **Swap Alternate** - `swapAlternateLinkedList.js`

---

## 8. Merge Intervals

**When to Use**: Overlapping intervals, scheduling problems  
**Time Complexity**: O(n log n) | **Space Complexity**: O(1) or O(n)

### Problems in `src/problems/MergeIntervals/`:
- ✅ **Merge Intervals** - `mergeIntervals.ts` - Merge overlapping intervals

---

## 9. Cyclic Sort

**When to Use**: Missing numbers, duplicate numbers, array sorting in-place  
**Time Complexity**: O(n) | **Space Complexity**: O(1)

### Problems in `src/problems/CyclicSort/`:
- ✅ **Cyclic Sort** - `cyclicSort.ts` - Missing/duplicate number patterns

---

## 10. Islands/Matrix Traversal

**When to Use**: 2D matrix problems, flood fill, connected components  
**Time Complexity**: O(m*n) | **Space Complexity**: O(m*n) or O(min(m,n))

### Problems in `src/problems/IslandsMatrix/`:
- ✅ **Islands Matrix Patterns** - `islandsMatrixPatterns.ts`
  - `numIslands` / `numIslandsBFS` – Number of Islands (DFS & BFS)
  - `islandSizes` – Variant that returns the area of each island
  - `maxAreaOfIsland` – Maximum area of any island
  - `floodFill` – Classic flood fill
  - `solve` – Surrounded Regions
  - `pacificAtlantic` – Pacific Atlantic Water Flow
  - `minTimeToInfectAll` (+ detailed variant) – Virus Infection Spread (Multi‑Source BFS)

### Problems in `DataStructures/2DArray/`:
- ✅ **Search in Matrix** - `searchInMatrix.js`

---

## 11. Arrays & Strings

**When to Use**: Basic array/string manipulation, utility functions  
**Time Complexity**: Varies | **Space Complexity**: Varies

### Problems in Root (Need Organization):
- 🔄 **Reverse String** - `reverseString.js` - Reverse a string
- 🔄 **Rotate Array** - `rotateAnArray.js`, `rotateArrayOptimized.js` - Rotate array by k positions
- 🔄 **Flatten Array** - `flattenArray.js` - Flatten nested array
- 🔄 **Product of Array Except Self** - `productOfArrayExceptItself.js` - Prefix/Suffix product
- 🔄 **Merge Two Sorted Arrays** - `mergeTwoSortedArray.js` - Merge sorted arrays
- 🔄 **Find Index of Substring** - `findIndexOfGivenSubstring.js` - String search
- 🔄 **Longest Palindrome** - `longestPalindrome.js` - Find longest palindrome from array of strings
- 🔄 **All Increasing Sequences of Size K** - `allIncreasingSequenceOfSize_K.js` - Generate sequences
- 🔄 **Kth Largest Element** - `src/problems/Arrays/kthLargest.js` - Find Kth largest (Heap/QuickSelect)
- 🔄 **Max Min in Array** - `max_min_inArray.js` - Find max and min
- 🔄 **Binary Add** - `binaryAdd.js` - Add binary strings
- 🔄 **Same** - `same.js` - Check if arrays are same (frequency)
- 🔄 **Super Prime** - `superPrime.js` - Prime number problems
- 🔄 **Traverse Path** - `traversePath.js` - Path traversal problems
- 🔄 **Find Path Src to Dest** - `findPathOfSrcToDestFolder.js` - Path finding

### Problems in `src/problems/easy/`:
- ✅ **Can Place Flowers** - `canPlaceFlowers.ts`
- ✅ **GCD of Strings** - `GCD_of_strings.ts`
- ✅ **Merge 2 Strings Alternatively** - `merge2StringsAlternatively.ts`
- ✅ **Remove Char at Index** - `removeCharAtGivenIndex.js`
- ✅ **Remove Stars (Stack)** - `removeStars_STACK.ts`
- ✅ **Rotate Array by N** - `rotateArrayByN.ts`
- ✅ **Valid Parenthesis (Stack)** - `validParenthesis_STACK.ts`, `validParenthesis_STACK.py`

---

## 12. Data Structures

**When to Use**: Implementing and understanding core data structures  
**Time Complexity**: Varies | **Space Complexity**: Varies

### Stack (`DataStructures/Stack/`):
- ✅ **Stack** - `stack.js` - Stack implementation

### Queue (`DataStructures/Queue/`):
- ✅ **Queue** - `queue.js` - Queue implementation
- ✅ **Queue from Stack** - `queueFromStack.js` - Queue using stacks

### Heap (`DataStructures/Heap/`):
- ✅ **Max Binary Heap** - `Max_binary_heap.js`
- ✅ **Priority Queue** - `priorityQueue.js`

> ⚠️ These live **outside `src/`**, are plain JS with no types or tests, and are
> not importable from the TS project. For the TS track use
> [`src/problems/Heap/heapPatterns.ts`](src/problems/Heap/heapPatterns.ts) —
> a typed generic `PriorityQueue<T>` with `MinHeap`/`MaxHeap`, plus `MedianFinder`
> (LC295), `KthLargest` (LC703), `kClosest` (LC973), `lastStoneWeight` (LC1046).

### Hash Table (`DataStructures/HashTable/`):
- ✅ **Hash Table Set and Get** - `hash_table_set_and_get.js`

### Trie (`DataStructures/Trie/`):
- ✅ **Trie** - `index.js` - Trie implementation

> ⚠️ Same caveat as Heap above: outside `src/`, untyped, untested, not importable
> from the TS project. The TS track's trie is
> [`src/problems/Trie/triePatterns.ts`](src/problems/Trie/triePatterns.ts) —
> `Trie` (LC208), `WordDictionary` (LC211) and `findWords` (LC212).

### Arrays (`DataStructures/Arrays/`):
- ✅ **Array** - `array.js` - Array utilities

### Puzzles (`DataStructures/puzzles/`):
- ✅ **Find Min Days to Ship** - `findTheMinDaysToShip.js`

### Problems in Root (Need Organization):
- 🔄 **LRU Cache** - `DataStructures/LRUCache/lruCache.js`, `DataStructures/LRUCache/lruFunction.js` - LRU cache implementation (HashMap + Doubly Linked List)

---

## 🔍 Search by Problem Name

| Problem Name | Pattern | File Location | Difficulty |
|-------------|---------|---------------|------------|
| 2Sum | Hash Map / Two Pointers | `2sum.js` | Easy |
| 3Sum | Two Pointers | `2Pointers/3Sum.ts` | Medium |
| Anagram | Hash Map | `anagram_MULTIPLE_SET_OF_DATA.js` | Easy |
| Binary Search | Binary Search | `BinarySearch/binarySearchPatterns.ts` | Easy |
| Binary Add | String Manipulation | `binaryAdd.js` | Easy |
| Best Time to Buy/Sell | Two Pointers / DP | `2Pointers/bestTimeToBuySell.js` | Easy |
| Coin Change | Dynamic Programming | `coinChange.js` | Medium |
| Container With Most Water | Two Pointers | `2Pointers/ContainerWithMostWater.ts` | Medium |
| Contains Duplicate | Hash Set | `2Pointers/containsDuplicate.ts` | Easy |
| Cyclic Sort | Cyclic Sort | `CyclicSort/cyclicSort.ts` | Medium |
| Edit Distance | Dynamic Programming | `DynamicProgramming/TwoSequencesDP/editDistance.ts` | Hard |
| Fibonacci | Dynamic Programming | `fibonacci.js` | Easy |
| Flatten Array | Arrays | `flattenArray.js` | Medium |
| Group Anagrams | Hash Map | `2Pointers/groupAnagrams.ts` | Medium |
| House Robber | Dynamic Programming | `maxSubsequenceNoAdjacent_HouseRobber.js` | Medium |
| Interleaving String | Dynamic Programming | `DynamicProgramming/TwoSequencesDP/interleavingString.ts` | Medium |
| Is Subsequence | Two Pointers | `2Pointers/isSubsequence.ts` | Easy |
| Kth Largest Element | Heap / QuickSelect | `src/problems/Arrays/kthLargest.js` | Medium |
| Knapsack | Dynamic Programming | `knapsack.js` | Medium |
| Longest Common Subsequence | Dynamic Programming | `longestCommonSubsequence.js` | Medium |
| Longest Consecutive | Hash Map | `HashMap/longestConsecutive.ts` | Medium |
| Longest Increasing Subsequence | Dynamic Programming | `longestIncreasingSubsequence.js` | Medium |
| Longest Palindrome | String Manipulation | `longestPalindrome.js` | Medium |
| Longest Substring No Repeats | Sliding Window | `maxSubSequence_noDuplicates_SlidingWindow.js` | Medium |
| LRU Cache | Data Structure | `DataStructures/LRUCache/lruCache.js` | Medium |
| Max Chars | Hash Map | `maxChars.js` | Easy |
| Max Subarray Sum (Kadane's) | Dynamic Programming / Sliding Window | `maxSubArraySum_KadenceAlgo.js` | Easy |
| Merge Intervals | Merge Intervals | `MergeIntervals/mergeIntervals.ts` | Medium |
| Merge Two Sorted Arrays | Two Pointers | `mergeTwoSortedArray.js` | Easy |
| Move Zeros | Two Pointers | `2Pointers/moveZeros.ts` | Easy |
| Product of Array Except Self | Arrays | `productOfArrayExceptItself.js` | Medium |
| Reverse String | String Manipulation | `reverseString.js` | Easy |
| Rotate Array | Arrays | `rotateAnArray.js` | Medium |
| Serialize/Deserialize BST | Tree | `serializeDeserializeBST.js` | Hard |
| Trapping Rain Water | Two Pointers | `trappingRainWater.js` | Hard |
| Valid Palindrome | Two Pointers | `2Pointers/palindrome.js` | Easy |
| Number of Islands | Islands / DFS-BFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`numIslands`, `numIslandsBFS`) | Medium |
| Island Sizes | Islands / DFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`islandSizes`) | Medium |
| Max Area of Island | Islands / DFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`maxAreaOfIsland`) | Medium |
| Flood Fill | Islands / DFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`floodFill`) | Medium |
| Surrounded Regions | Islands / DFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`solve`) | Medium |
| Pacific Atlantic Water Flow | Islands / DFS-BFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`pacificAtlantic`) | Medium |
| Virus Infection Spread | Islands / Multi-Source BFS | `IslandsMatrix/islandsMatrixPatterns.ts` (`minTimeToInfectAll`) | Medium |

---

## 📊 Pattern Statistics (verified 2026-07-07)

The reorganization is **COMPLETE** — no loose problem files remain at the
`src/problems/` root, and every colliding/miscategorized file has been
rehomed. Current state, verified by the test suite and `tsc --noEmit`:

| Pattern | Files | Tests | Notes |
|---------|-------|-------|-------|
| Two Pointers | 12 problem files (+practice companion) | ✅ | Full brute-force→optimized writeups |
| Sliding Window | 3 collection files | ✅ | twoPointerSlidingWindow migrated out |
| Hash Map/Set | 7 files (patterns + flagship problems) | ✅ | Legacy .js consolidated into frequencyCounter.ts |
| Dynamic Programming | dpPatterns + TwoSequencesDP + legacy .js studies | ✅ | LCS exports + typings fixed |
| Binary Search | 1 collection file (12+ functions) | ✅ | searchMatrix wrong-test fixed |
| Tree Traversal | treePatterns + legacy .js | ✅ | |
| Fast & Slow Pointers | 1 collection file | ✅ | circularArrayLoop bug fixed (LC457) |
| Merge Intervals | 1 collection file | ✅ | 2 wrong tests fixed |
| Cyclic Sort | 1 collection file | ✅ | 1 wrong test fixed |
| Islands/Matrix | 1 collection file (+virus demo) | ✅ | |
| Backtracking | 1 collection file (5 problems) | smoke ✅ | NEW — subsets/permute/combos template + dials |
| Graph (adjacency list) | 1 collection file | smoke ✅ | NEW — BFS/DFS, Kahn's topo sort, components |
| Union-Find (DSU) | 1 collection file | smoke ✅ | NEW — naive→compression→rank, components, cycle |
| Arrays | 6 TS files + kthLargest reference | smoke ✅ | Reworked to brute→optimized ladders; 3 rotate files consolidated |
| Strings | 5 TS files | smoke ✅ | LC5 added; broken pairs/off-by-one fixed |
| easy/ warm-ups | GCD, canPlaceFlowers, validParens, etc. | smoke ✅ | GCD general case + flowers boundary fixed |
| Data Structures | `DataStructures/` (repo root) | n/a | Max_binary_heap is the gold-standard reference; see its README |

**Whole-repo health: 607 vitest tests passing, 0 failures; `tsc --noEmit` clean;
69 additional smoke assertions green over the Arrays/Strings/easy/Misc/UnionFind
files (adversarially verified by a 17-agent review pass).**

---

## 🔗 Related Documentation

- [DSA Essential Patterns Guide](./DSA_Essential_Patterns_Guide.md) - Detailed pattern explanations
- [DP Patterns Cheat Sheet](./DP_Patterns_Cheat_Sheet.md) - DP pattern reference
- [Blind 75 Complete](./BLIND_75_COMPLETE.md) - Blind 75 problem tracking
- [DSA Practice Roadmap](./DSA_Practice_Roadmap.md) - Learning roadmap

---

*Last Updated: 2026-07-07*
*Total Problems: 130+ — reorganization COMPLETE (0 files awaiting organization)*
*Repo health: 600+ tests green, `tsc --noEmit` clean*

---

## 13. JS ↔ Go parity — ✅ complete

Both trees implement **the same problem set**, verified function by function.

**The division of labour** (so neither side duplicates the other's job):

- **JS carries the teaching**: the five recipe questions, visualisations, the
  brute-force → memoise → tabulate → roll ladder, real-world framings.
- **Go carries only what Go does differently**, marked `GO NOTE` — `math.MaxInt`
  as a sentinel you must not add to, `byte` vs `rune`, 2D slices needing an
  explicit allocation loop, the `append` aliasing bug, integer division
  truncating silently, `big.Int` mutating its receiver, `&^` for bit-clear,
  `strings.Fields` vs `Split`, comparable struct map keys, randomised map order.

Read the JS doc block for a problem first, then that problem's Go note.

### Status by pattern

| JS folder | Go package | Parity |
|---|---|---|
| `DynamicProgramming/` | `dp` | ✅ |
| `TreeTraversal/` | `trees` | ✅ |
| `2Pointers/` | `twopointers` | ✅ |
| `SlidingWindow/` | `slidingwindow` | ✅ |
| `HashMap/` | `hashmap` (+ `design`) | ✅ |
| `BinarySearch/` | `binarysearch` | ✅ |
| `Stack/` | `stack` | ✅ |
| `LinkedList/` | `linkedlist` | ✅ |
| `FastSlowPointers/` | `fastslowpointers` **(new)** | ✅ |
| `MergeIntervals/` | `intervals` | ✅ |
| `CyclicSort/` | `cyclicsort` | ✅ |
| `Heap/` | `heaptopk` | ✅ |
| `TreeTraversal/`, `Trie/` | `trie` | ✅ |
| `Graph/` | `graphs`, `toposort`, `unionfind`, `shortestpath` | ✅ |
| `IslandsMatrix/` | `islandsmatrix` **(new)** | ✅ |
| `UnionFind/` | `unionfind` | ✅ |
| `Backtracking/` | `backtracking` | ✅ |
| `BitManipulation/` | `mathbits` | ✅ |
| `Arrays/` | `arrays` **(new)** | ✅ |
| `Strings/`, `easy/` | `strs` **(new)** | ✅ |
| `Misc/` | `mathbits` | ✅ |
| `Greedy/` **(new)** | `greedy` | ✅ |
| `PrefixSum/` **(new)** | `prefixsum` | ✅ |
| `ShortestPath/` **(new)** | `shortestpath` | ✅ |

Five folders/packages were created to close the shape mismatch: Go gained
`fastslowpointers`, `islandsmatrix`, `arrays` and `strs`; JS gained `Greedy/`,
`PrefixSum/` and `ShortestPath/`.

### ⚠️ Two things to know before "fixing" an apparent gap

1. **The same problem has two names in places** — `Serialize`/`Deserialize` is
   JS's `Codec`, `MaxSlidingWindow` is `maxOfAllSubarrays`, `OrangesRotting` is
   `minTimeToInfectAll`, and about a dozen more. The full mapping table is in
   [`Go/README.md`](../Go/README.md). A raw name diff flags all of them as
   missing; they are not.

2. **A few problems sit in different pattern folders on each side** — `isHappy`
   is under JS `HashMap/` but Go `mathbits`; `partitionLabels` is under JS
   `MergeIntervals/` but Go `greedy`; the stock family is spread across JS
   `2Pointers/` and `DynamicProgramming/`. These are cross-referenced in the doc
   comments rather than duplicated, because a problem filed under two patterns
   is a feature — it is how you notice that one technique solves both.

**How to re-verify parity** rather than trusting this table: compare at
FUNCTION level, and remember that a JS index built only from `export function`
misses names exported via `export { ... }` blocks. That hole is what made
`longestConsecutive` look absent when the folder already shipped four
approaches to it.
