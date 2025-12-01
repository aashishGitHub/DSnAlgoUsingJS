# 📋 Organization Plan

*Detailed plan for organizing all problems by pattern*

---

## ✅ Completed Organization

### Well-Organized Folders:
- `2Pointers/` - 9 TypeScript files with tests
- `SlidingWindow/` - Organized by fixed/variable/two-pointer
- `HashMap/` - Organized by set/map patterns
- `DynamicProgramming/TwoSequencesDP/` - LCS, Edit Distance, etc.
- `BinarySearch/` - Binary search patterns
- `MergeIntervals/` - Merge intervals
- `CyclicSort/` - Cyclic sort patterns
- `IslandsMatrix/` - Matrix traversal
- `FastSlowPointers/` - Fast/slow pointer patterns
- `TreeTraversal/` - Tree patterns
- `easy/` - Easy problems

---

## ✅ Files Organized (Completed!)

### Two Pointers Pattern
**Location**: `src/problems/2Pointers/`

- [x] `trappingRainWater.js` → `2Pointers/trappingRainWater.js` ✅
- [x] `sumZero_MULTI_POINTER.js` → `2Pointers/sumZero_MULTI_POINTER.js` ✅
- [x] `2sum.js` → `HashMap/2sum.js` ✅ (moved to HashMap as it uses hash map)

### Sliding Window Pattern
**Location**: `src/problems/SlidingWindow/`

- [x] `maxSubArraySum_KadenceAlgo.js` → `SlidingWindow/kadaneMaxSubarray.js` ✅
- [x] `maxSubSequence_noDuplicates_SlidingWindow.js` → `SlidingWindow/longestSubstringNoRepeats.js` ✅
- [x] `maxSum_SLIDING_WINDOW_GivenLength.js` → `SlidingWindow/maxSumFixedWindow.js` ✅

### Hash Map/Set Pattern
**Location**: `src/problems/HashMap/`

- [x] `2sum.js` → `HashMap/2sum.js` ✅
- [x] `anagram_MULTIPLE_SET_OF_DATA.js` → `HashMap/anagram.js` ✅
- [x] `maxChars.js` → `HashMap/maxChars.js` ✅
- [x] `listAllPairsOfSum_K.js` → `HashMap/pairsWithSumK.js` ✅
- [x] `getUnique.js` → `HashMap/getUnique.js` ✅
- [x] `countUnique.js` → `HashMap/countUnique.js` ✅
- [x] `same.js` → `HashMap/same.js` ✅

### Dynamic Programming Pattern
**Location**: `src/problems/DynamicProgramming/`

- [x] `coinChange.js` → `DynamicProgramming/coinChange.js` ✅
- [x] `longestIncreasingSubsequence.js` → `DynamicProgramming/longestIncreasingSubsequence.js` ✅
- [x] `longestCommonSubsequence.js` → `DynamicProgramming/TwoSequencesDP/longestCommonSubsequence_root.js` ✅ (kept both versions)
- [x] `maxSubsequenceNoAdjacent_HouseRobber.js` → `DynamicProgramming/houseRobber.js` ✅
- [x] `maxIncreasingSubSequence.js` → `DynamicProgramming/maxSumIncreasingSubsequence.js` ✅
- [x] `maxSubsequenceAdjacentDiffUnity..js` → `DynamicProgramming/lisAdjacentDiffOne.js` ✅
- [x] `knapsack.js` → `DynamicProgramming/knapsack.js` ✅
- [x] `fibonacci.js` → `DynamicProgramming/fibonacci.js` ✅

### Arrays Pattern
**Location**: `src/problems/Arrays/` ✅ (new folder created)

- [x] `flattenArray.js` → `Arrays/flattenArray.js` ✅
- [x] `productOfArrayExceptItself.js` → `Arrays/productExceptSelf.js` ✅
- [x] `mergeTwoSortedArray.js` → `Arrays/mergeTwoSortedArrays.js` ✅
- [x] `rotateAnArray.js` → `Arrays/rotateArray.js` ✅
- [x] `rotateArrayOptimized.js` → `Arrays/rotateArrayOptimized.js` ✅
- [x] `max_min_inArray.js` → `Arrays/maxMin.js` ✅
- [x] `allIncreasingSequenceOfSize_K.js` → `Arrays/increasingSequencesOfSizeK.js` ✅
- [x] `kthLargestElementInArray.js` → `Arrays/kthLargest.js` ✅
- [x] `rotateArrayComparison.md` → `Arrays/rotateArrayComparison.md` ✅

### Strings Pattern
**Location**: `src/problems/Strings/` ✅ (new folder created)

- [x] `reverseString.js` → `Strings/reverseString.js` ✅
- [x] `findIndexOfGivenSubstring.js` → `Strings/findSubstring.js` ✅
- [x] `longestPalindrome.js` → `Strings/longestPalindrome.js` ✅
- [x] `binaryAdd.js` → `Strings/binaryAdd.js` ✅

### Tree Pattern
**Location**: `src/problems/TreeTraversal/`

- [x] `serializeDeserializeBST.js` → `TreeTraversal/serializeDeserializeBST.js` ✅

### Graph/Path Pattern
**Location**: `src/problems/Graph/` ✅ (new folder created)

- [x] `traversePath.js` → `Graph/traversePath.js` ✅
- [x] `findPathOfSrcToDestFolder.js` → `Graph/findPath.js` ✅

### Data Structures
**Location**: `DataStructures/LRUCache/` ✅ (new folder created)

- [x] `lru_cache_implementation.js` → `DataStructures/LRUCache/lruCache.js` ✅
- [x] `lru_function.js` → `DataStructures/LRUCache/lruFunction.js` ✅

### Miscellaneous
**Location**: `src/problems/Misc/` ✅ (new folder created)

- [x] `superPrime.js` → `Misc/superPrime.js` ✅

---

## 📝 Notes

1. **TypeScript Conversion**: Consider converting `.js` files to `.ts` when moving
2. **Test Files**: Create corresponding `.test.ts` files for moved problems
3. **Duplicates**: Check for duplicate implementations (e.g., `longestCommonSubsequence.js` exists in root and `TwoSequencesDP/`)
4. **Documentation**: Update `PROBLEM_INDEX.md` after each move
5. **Index Updates**: Update `index.ts` to export from new locations

---

## 🎯 Priority Order

1. **High Priority** (Most Used Patterns):
   - Dynamic Programming (8 files)
   - Hash Map/Set (7 files)
   - Arrays (7 files)

2. **Medium Priority**:
   - Sliding Window (3 files)
   - Two Pointers (2 files)
   - Strings (4 files)

3. **Low Priority**:
   - Tree (1 file)
   - Graph (2 files)
   - Data Structures (2 files)
   - Misc (2 files)

---

---

## ✅ Organization Complete!

All 39 files have been successfully organized into appropriate pattern folders:
- ✅ Two Pointers: 2 files moved
- ✅ Sliding Window: 3 files moved
- ✅ Hash Map: 7 files moved
- ✅ Dynamic Programming: 8 files moved
- ✅ Arrays: 8 files moved (new folder created)
- ✅ Strings: 4 files moved (new folder created)
- ✅ Tree: 1 file moved
- ✅ Graph: 2 files moved (new folder created)
- ✅ Data Structures: 2 files moved (new folder created)
- ✅ Misc: 1 file moved (new folder created)

**Total**: 39 files organized + 4 new folders created

*All files are now properly organized by pattern! 🎉*

