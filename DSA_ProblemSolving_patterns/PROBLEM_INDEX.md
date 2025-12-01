# 📚 Complete Problem Index - Organized by Patterns

*Master reference for all DSA problems in this repository, organized by pattern for easy navigation*

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
| [Arrays & Strings](#11-arrays--strings) | 15+ | `src/problems/` (root) | 🔄 Needs Organization |
| [Data Structures](#12-data-structures) | 20+ | `DataStructures/` | ✅ Organized |

---

## 1. Two Pointers

**When to Use**: Sorted arrays, palindromes, pair problems, optimizing from O(n²) to O(n)  
**Time Complexity**: O(n) | **Space Complexity**: O(1)

### Problems in `src/problems/2Pointers/`:
- ✅ **3Sum** - `3Sum.ts` - Find all unique triplets that sum to zero
- ✅ **Container With Most Water** - `ContainerWithMostWater.ts` - Maximum water container area
- ✅ **Move Zeros** - `moveZeros.ts` - Move all zeros to end maintaining order
- ✅ **Valid Palindrome** - `palindrome.js` - Check if string is palindrome
- ✅ **Is Subsequence** - `isSubsequence.ts` - Check if one string is subsequence of another
- ✅ **Contains Duplicate** - `containsDuplicate.ts` - Check for duplicates
- ✅ **Group Anagrams** - `groupAnagrams.ts` - Group strings that are anagrams
- ✅ **Top K Frequent** - `topKFrequent.ts` - Find top K frequent elements
- ✅ **Best Time to Buy/Sell Stock** - `bestTimeToBuySell.js` - Maximum profit from stock trading

### Problems in Root (Need Organization):
- 🔄 **2Sum** - `2sum.js` - Find pairs that sum to target (HashMap pattern, but can use Two Pointers if sorted)
- 🔄 **Trapping Rain Water** - `trappingRainWater.js` - Calculate trapped rainwater (Two Pointers)
- 🔄 **Sum Zero Multi Pointer** - `sumZero_MULTI_POINTER.js` - Find triplets with zero sum

---

## 2. Sliding Window

**When to Use**: Contiguous subarrays/substrings, optimization problems, fixed/variable size windows  
**Time Complexity**: O(n) | **Space Complexity**: O(1) or O(k)

### Problems in `src/problems/SlidingWindow/`:
- ✅ **Fixed Size Window** - `fixedSizeSlidingWindow.ts` - Maximum sum subarray of size K
- ✅ **Variable Size Window** - `variableSizeSlidingWindow.ts` - Longest substring without repeating
- ✅ **Two Pointer Window** - `twoPointerSlidingWindow.ts` - Advanced sliding window patterns

### Problems in Root (Need Organization):
- 🔄 **Max Subarray Sum (Kadane's)** - `maxSubArraySum_KadenceAlgo.js` - Maximum sum subarray (DP/Sliding Window)
- 🔄 **Longest Substring No Duplicates** - `maxSubSequence_noDuplicates_SlidingWindow.js` - Longest substring without repeating chars
- 🔄 **Max Sum Sliding Window** - `maxSum_SLIDING_WINDOW_GivenLength.js` - Maximum sum of subarray of given length

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
- ✅ **Islands Matrix Patterns** - `islandsMatrixPatterns.ts` - Number of islands, flood fill

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
- 🔄 **Kth Largest Element** - `kthLargestElementInArray.js` - Find Kth largest (Heap/QuickSelect)
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

### Hash Table (`DataStructures/HashTable/`):
- ✅ **Hash Table Set and Get** - `hash_table_set_and_get.js`

### Trie (`DataStructures/Trie/`):
- ✅ **Trie** - `index.js` - Trie implementation

### Arrays (`DataStructures/Arrays/`):
- ✅ **Array** - `array.js` - Array utilities

### Puzzles (`DataStructures/puzzles/`):
- ✅ **Find Min Days to Ship** - `findTheMinDaysToShip.js`

### Problems in Root (Need Organization):
- 🔄 **LRU Cache** - `lru_cache_implementation.js`, `lru_function.js` - LRU cache implementation (HashMap + Doubly Linked List)

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
| Kth Largest Element | Heap / QuickSelect | `kthLargestElementInArray.js` | Medium |
| Knapsack | Dynamic Programming | `knapsack.js` | Medium |
| Longest Common Subsequence | Dynamic Programming | `longestCommonSubsequence.js` | Medium |
| Longest Consecutive | Hash Map | `HashMap/longestConsecutive.ts` | Medium |
| Longest Increasing Subsequence | Dynamic Programming | `longestIncreasingSubsequence.js` | Medium |
| Longest Palindrome | String Manipulation | `longestPalindrome.js` | Medium |
| Longest Substring No Repeats | Sliding Window | `maxSubSequence_noDuplicates_SlidingWindow.js` | Medium |
| LRU Cache | Data Structure | `lru_cache_implementation.js` | Medium |
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

---

## 📊 Pattern Statistics

| Pattern | Total Problems | Organized | Needs Organization |
|---------|---------------|------------|-------------------|
| Two Pointers | 12+ | 9 | 3 |
| Sliding Window | 15+ | 3 | 3 |
| Hash Map/Set | 10+ | 3 | 7 |
| Dynamic Programming | 20+ | 2 | 8 |
| Binary Search | 5+ | 1 | 1 |
| Tree Traversal | 10+ | 8 | 1 |
| Fast & Slow Pointers | 5+ | 1 | 0 |
| Merge Intervals | 5+ | 1 | 0 |
| Cyclic Sort | 5+ | 1 | 0 |
| Islands/Matrix | 5+ | 1 | 1 |
| Arrays & Strings | 20+ | 7 | 13 |
| Data Structures | 20+ | 15 | 2 |
| **TOTAL** | **130+** | **51** | **39** |

---

## 🎯 Recommended Organization Actions

1. **Move Two Pointers problems**:
   - `trappingRainWater.js` → `2Pointers/trappingRainWater.js`
   - `2sum.js` → `HashMap/2sum.js` (or keep in 2Pointers if sorted array version)

2. **Move Sliding Window problems**:
   - `maxSubArraySum_KadenceAlgo.js` → `SlidingWindow/kadaneMaxSubarray.ts`
   - `maxSubSequence_noDuplicates_SlidingWindow.js` → `SlidingWindow/longestSubstringNoRepeats.ts`
   - `maxSum_SLIDING_WINDOW_GivenLength.js` → `SlidingWindow/maxSumFixedWindow.ts`

3. **Move Hash Map problems**:
   - `2sum.js` → `HashMap/2sum.ts`
   - `anagram_MULTIPLE_SET_OF_DATA.js` → `HashMap/anagram.ts`
   - `maxChars.js` → `HashMap/maxChars.ts`
   - `listAllPairsOfSum_K.js` → `HashMap/pairsWithSumK.ts`
   - `getUnique.js` → `HashMap/getUnique.ts`
   - `countUnique.js` → `HashMap/countUnique.ts`

4. **Move Dynamic Programming problems**:
   - `coinChange.js` → `DynamicProgramming/coinChange.ts`
   - `longestIncreasingSubsequence.js` → `DynamicProgramming/longestIncreasingSubsequence.ts`
   - `longestCommonSubsequence.js` → `DynamicProgramming/TwoSequencesDP/longestCommonSubsequence.ts`
   - `maxSubsequenceNoAdjacent_HouseRobber.js` → `DynamicProgramming/houseRobber.ts`
   - `maxIncreasingSubSequence.js` → `DynamicProgramming/maxSumIncreasingSubsequence.ts`
   - `maxSubsequenceAdjacentDiffUnity..js` → `DynamicProgramming/lisAdjacentDiffOne.ts`
   - `knapsack.js` → `DynamicProgramming/knapsack.ts`
   - `fibonacci.js` → `DynamicProgramming/fibonacci.ts`

5. **Move Arrays & Strings problems**:
   - Create `Arrays/` and `Strings/` folders
   - Move array manipulation problems to `Arrays/`
   - Move string problems to `Strings/`

6. **Move Data Structure problems**:
   - `lru_cache_implementation.js` → `DataStructures/LRUCache/lruCache.js`

---

## 🔗 Related Documentation

- [DSA Essential Patterns Guide](./DSA_Essential_Patterns_Guide.md) - Detailed pattern explanations
- [DP Patterns Cheat Sheet](./DP_Patterns_Cheat_Sheet.md) - DP pattern reference
- [Blind 75 Complete](./BLIND_75_COMPLETE.md) - Blind 75 problem tracking
- [DSA Practice Roadmap](./DSA_Practice_Roadmap.md) - Learning roadmap

---

*Last Updated: [Current Date]*  
*Total Problems: 130+*  
*Organized: 51 | Needs Organization: 39*

