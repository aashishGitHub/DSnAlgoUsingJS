# 🗺️ Quick Navigation Guide

*Fast reference for finding problems by pattern, difficulty, or name*

---

## 🔍 Search by Pattern

### Two Pointers
- **Location**: `src/problems/2Pointers/`
- **Key Files**: `moveZeros.ts`, `3Sum.ts`, `ContainerWithMostWater.ts`
- **Unorganized**: `trappingRainWater.js`, `2sum.js` (root)

### Sliding Window
- **Location**: `src/problems/SlidingWindow/`
- **Key Files**: `fixedSizeSlidingWindow.ts`, `variableSizeSlidingWindow.ts`
- **Unorganized**: `maxSubArraySum_KadenceAlgo.js`, `maxSubSequence_noDuplicates_SlidingWindow.js` (root)

### Hash Map/Set
- **Location**: `src/problems/HashMap/`
- **Key Files**: `hashMapPatterns.ts`, `hashSetPatterns.ts`
- **Unorganized**: `2sum.js`, `anagram_MULTIPLE_SET_OF_DATA.js`, `maxChars.js` (root)

### Dynamic Programming
- **Location**: `src/problems/DynamicProgramming/`
- **Key Files**: `dpPatterns.ts`, `TwoSequencesDP/`
- **Unorganized**: `coinChange.js`, `longestIncreasingSubsequence.js`, `knapsack.js` (root)

### Binary Search
- **Location**: `src/problems/BinarySearch/`
- **Key Files**: `binarySearchPatterns.ts`

### Tree Traversal
- **Location**: `src/problems/TreeTraversal/` and `DataStructures/Tree/`
- **Key Files**: `treePatterns.ts`, `binarySearchTree.js`

---

## 🔍 Search by Difficulty

### Easy Problems
- Move Zeros (`2Pointers/moveZeros.ts`)
- Valid Palindrome (`2Pointers/palindrome.js`)
- Contains Duplicate (`2Pointers/containsDuplicate.ts`)
- Two Sum (`2sum.js` - root)
- Reverse String (`reverseString.js` - root)
- Max Chars (`maxChars.js` - root)
- Fibonacci (`fibonacci.js` - root)

### Medium Problems
- 3Sum (`2Pointers/3Sum.ts`)
- Container With Most Water (`2Pointers/ContainerWithMostWater.ts`)
- Coin Change (`coinChange.js` - root)
- House Robber (`maxSubsequenceNoAdjacent_HouseRobber.js` - root)
- Longest Increasing Subsequence (`longestIncreasingSubsequence.js` - root)
- Product of Array Except Self (`productOfArrayExceptItself.js` - root)
- Merge Two Sorted Arrays (`mergeTwoSortedArray.js` - root)

### Hard Problems
- Trapping Rain Water (`trappingRainWater.js` - root)
- Edit Distance (`DynamicProgramming/TwoSequencesDP/editDistance.ts`)
- Interleaving String (`DynamicProgramming/TwoSequencesDP/interleavingString.ts`)

---

## 🔍 Search by Problem Type

### Array Problems
- **Rotation**: `rotateAnArray.js`, `rotateArrayOptimized.js`
- **Sum/Pairs**: `2sum.js`, `listAllPairsOfSum_K.js`, `sumZero_MULTI_POINTER.js`
- **Subarray**: `maxSubArraySum_KadenceAlgo.js`, `maxSum_SLIDING_WINDOW_GivenLength.js`
- **Manipulation**: `flattenArray.js`, `productOfArrayExceptItself.js`, `mergeTwoSortedArray.js`

### String Problems
- **Palindrome**: `palindrome.js`, `longestPalindrome.js`
- **Anagram**: `anagram_MULTIPLE_SET_OF_DATA.js`, `groupAnagrams.ts`
- **Substring**: `maxSubSequence_noDuplicates_SlidingWindow.js`, `findIndexOfGivenSubstring.js`
- **Manipulation**: `reverseString.js`, `merge2StringsAlternatively.ts`

### Tree Problems
- **Traversal**: `levelOrderTraversal.js`, `leftViewOfBT.js`
- **BST**: `binarySearchTree.js`, `BST_kthMax.js`
- **Serialization**: `serializeDeserializeBST.js`

### Graph Problems
- **Matrix**: `searchInMatrix.js`, `islandsMatrixPatterns.ts`
- **Path Finding**: `traversePath.js`, `findPathOfSrcToDestFolder.js`

---

## 🔍 Search by Data Structure

### Stack
- `DataStructures/Stack/stack.js`
- `easy/validParenthesis_STACK.ts`
- `easy/removeStars_STACK.ts`

### Queue
- `DataStructures/Queue/queue.js`
- `DataStructures/Queue/queueFromStack.js`

### Heap
- `DataStructures/Heap/Max_binary_heap.js`
- `DataStructures/Heap/priorityQueue.js`

### Hash Table
- `DataStructures/HashTable/hash_table_set_and_get.js`
- `src/problems/HashMap/`

### Linked List
- `DataStructures/LinkedList/linkedList.js`
- `DataStructures/LinkedList/rotateLinkedList.js`

### Tree
- `DataStructures/Tree/tree.js`
- `DataStructures/Tree/binarySearchTree.js`

### Trie
- `DataStructures/Trie/index.js`

---

## 🎯 Common Interview Questions

### Top 10 Most Common
1. **Two Sum** - `2sum.js` (HashMap)
2. **3Sum** - `2Pointers/3Sum.ts` (Two Pointers)
3. **Longest Substring Without Repeating** - `maxSubSequence_noDuplicates_SlidingWindow.js` (Sliding Window)
4. **Container With Most Water** - `2Pointers/ContainerWithMostWater.ts` (Two Pointers)
5. **Coin Change** - `coinChange.js` (DP)
6. **House Robber** - `maxSubsequenceNoAdjacent_HouseRobber.js` (DP)
7. **Longest Increasing Subsequence** - `longestIncreasingSubsequence.js` (DP)
8. **Move Zeros** - `2Pointers/moveZeros.ts` (Two Pointers)
9. **Product of Array Except Self** - `productOfArrayExceptItself.js` (Arrays)
10. **Valid Palindrome** - `2Pointers/palindrome.js` (Two Pointers)

---

## 📁 File Organization Status

### ✅ Well Organized
- `2Pointers/` - 9 files
- `SlidingWindow/` - 3 main files
- `HashMap/` - 3 main files
- `DynamicProgramming/TwoSequencesDP/` - 4 files
- `BinarySearch/` - 1 main file
- `MergeIntervals/` - 1 main file
- `CyclicSort/` - 1 main file
- `IslandsMatrix/` - 1 main file
- `FastSlowPointers/` - 1 main file

### 🔄 Needs Organization (Root of `src/problems/`)
- Array/String manipulation (15+ files)
- DP problems (8 files)
- Hash Map problems (7 files)
- Sliding Window problems (3 files)
- Two Pointers problems (3 files)

---

## 🚀 Quick Actions

### Find a Problem
1. Check `PROBLEM_INDEX.md` for complete list
2. Use pattern folders for organized problems
3. Check root of `src/problems/` for unorganized files

### Add a New Problem
1. Identify the pattern
2. Place in appropriate pattern folder
3. Update `PROBLEM_INDEX.md`
4. Update `index.ts` if needed

### Study a Pattern
1. Read pattern guide in `DSA_Essential_Patterns_Guide.md`
2. Check pattern folder for examples
3. Practice problems in that folder
4. Review test files for edge cases

---

*For complete details, see [PROBLEM_INDEX.md](./PROBLEM_INDEX.md)*

