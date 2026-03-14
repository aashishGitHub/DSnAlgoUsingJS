# Pattern Categorization Guide - All 22 Problems

This guide categorizes all 22 problems from the video list by their algorithmic patterns, helping you identify which pattern to use for similar problems.

---

## 📊 Complete Problem Categorization

| # | Problem Name | Pattern Category | Sub-Pattern | Status | Location |
|---|--------------|------------------|-------------|--------|----------|
| 1 | Time Complexity and Space Complexity Introduction | **Theory** | Complexity Analysis | ✅ | N/A (Theory) |
| 2 | Design O(1) Insert, Search, Delete, Random | **HashMap** | Data Structure Design | 🔄 | Needs implementation |
| 3 | Sort array of 0's, 1's, 2's (Dutch Flag) | **Two Pointers** | Partitioning | ✅ | `SlidingWindow/twoPointerSlidingWindow.ts` |
| 4 | Merge Sort Introduction | **Sorting** | Divide & Conquer | 🔄 | Needs implementation |
| 5 | Merge Sort Code Implementation | **Sorting** | Divide & Conquer | 🔄 | Needs implementation |
| 6 | Jump Game (Linear Time) | **Greedy** | Array Traversal | ✅ | `DynamicProgramming/dpPatterns.ts` |
| 7 | Next Greater Number (Digit Rearrangement) | **Array Manipulation** | Permutation | 🔄 | Needs implementation |
| 8 | Minimum Platforms (Greedy) | **Merge Intervals** | Greedy Two-Pointer | ✅ | `MergeIntervals/mergeIntervals.ts` |
| 9 | Spiral Matrix Print | **Matrix Traversal** | Boundary Traversal | 🔄 | Needs implementation |
| 10 | Count Frequencies O(n) | **HashMap** | Frequency Counting | ✅ | `HashMap/hashMapPatterns.ts` |
| 11 | Stock Buy Sell (Linear Time) | **Two Pointers** | Greedy | ✅ | `2Pointers/bestTimeToBuySell.js` |
| 12 | Matrix Rotation 90° In-Place | **Matrix Manipulation** | In-Place Transformation | 🔄 | Needs implementation |
| 13 | Celebrity Problem | **Two Pointers** | Elimination | 🔄 | Needs implementation |
| 14 | Next Permutation | **Array Manipulation** | Permutation | 🔄 | Needs implementation |
| 15-16 | QuickSelect Kth Smallest | **QuickSelect** | Selection Algorithm | ✅ | `Arrays/kthLargest.js` |
| 17 | Square Root (Binary Search) | **Binary Search** | Search Optimization | ✅ | `BinarySearch/binarySearchPatterns.ts` |
| 18 | Trapping Rain Water | **Two Pointers** | Greedy | ✅ | `2Pointers/trappingRainWater.js` |
| 19 | Count Inversions (Merge Sort) | **Sorting** | Divide & Conquer | 🔄 | Needs implementation |
| 20 | Median of Two Sorted Arrays | **Binary Search** | Search Optimization | ✅ | `BinarySearch/binarySearchPatterns.ts` |
| 21-22 | Minimum Window Substring | **Sliding Window** | Variable Size Window | ✅ | `SlidingWindow/variableSizeSlidingWindow.ts` |

---

## 🎯 Pattern Identification Guide

### How to Identify Which Pattern to Use

#### 1. **Two Pointers Pattern**
**When to use:**
- ✅ Sorted arrays
- ✅ Need to find pairs/triplets
- ✅ Partitioning elements (0s, 1s, 2s)
- ✅ Optimizing from O(n²) to O(n)
- ✅ Problems asking for "in-place" solutions

**Problems in this category:**
- Sort Colors (0s, 1s, 2s)
- Stock Buy Sell
- Trapping Rain Water
- Celebrity Problem

**Key indicators:**
- "In-place"
- "Without extra space"
- "Two pointers"
- "Partition"

---

#### 2. **HashMap Pattern**
**When to use:**
- ✅ Need O(1) lookups
- ✅ Counting frequencies
- ✅ Finding duplicates
- ✅ Need to track "seen" elements
- ✅ Complement finding (target - current)

**Problems in this category:**
- Count Frequencies
- O(1) Data Structure Design
- Two Sum variations

**Key indicators:**
- "Frequency"
- "Count occurrences"
- "O(1) lookup"
- "Track seen elements"

---

#### 3. **Greedy Pattern**
**When to use:**
- ✅ Optimization problems
- ✅ Make locally optimal choices
- ✅ No need for backtracking
- ✅ "Maximum" or "Minimum" with constraints
- ✅ Can solve in one pass

**Problems in this category:**
- Jump Game
- Minimum Platforms
- Stock Buy Sell

**Key indicators:**
- "Maximum profit"
- "Minimum steps"
- "Can reach"
- "Optimal"

---

#### 4. **Binary Search Pattern**
**When to use:**
- ✅ Sorted arrays
- ✅ Search optimization (O(log n))
- ✅ Finding boundaries
- ✅ "Search in sorted array"
- ✅ Square root, nth root problems

**Problems in this category:**
- Square Root
- Median of Two Sorted Arrays
- Search in Rotated Array

**Key indicators:**
- "Sorted array"
- "O(log n) time"
- "Search"
- "Find position"

**Locations:**
- Classic implementation: `Searching/binarySearch.js`
- All patterns (rotated, sqrt, median, etc.): `BinarySearch/binarySearchPatterns.ts`
- Index & revision: `Searching/README.md`

---

#### 5. **Sliding Window Pattern**
**When to use:**
- ✅ Contiguous subarrays/substrings
- ✅ "Window" of elements
- ✅ Fixed or variable size window
- ✅ Optimization on subarrays

**Problems in this category:**
- Minimum Window Substring
- Longest Substring Without Repeating

**Key indicators:**
- "Substring"
- "Subarray"
- "Window"
- "Contiguous"

---

#### 6. **Matrix Traversal Pattern**
**When to use:**
- ✅ 2D arrays/matrices
- ✅ Spiral, zigzag traversal
- ✅ Boundary problems
- ✅ In-place matrix operations

**Problems in this category:**
- Spiral Matrix
- Matrix Rotation
- Search in 2D Matrix

**Key indicators:**
- "Matrix"
- "2D array"
- "Spiral"
- "Rotate"

---

#### 7. **Array Manipulation Pattern**
**When to use:**
- ✅ Permutations
- ✅ Rearrangements
- ✅ Next/Previous element problems
- ✅ Digit manipulation

**Problems in this category:**
- Next Permutation
- Next Greater Number
- Digit Rearrangement

**Key indicators:**
- "Next"
- "Permutation"
- "Rearrange"
- "Digits"

---

#### 8. **Sorting Pattern (Divide & Conquer)**
**When to use:**
- ✅ Need sorted order
- ✅ Merge Sort, Quick Sort
- ✅ Count inversions
- ✅ Divide and conquer approach

**Problems in this category:**
- Merge Sort
- Count Inversions
- QuickSelect

**Key indicators:**
- "Sort"
- "Inversions"
- "Divide"
- "Merge"

---

## 🔍 Quick Pattern Decision Tree

```
Is it a 2D matrix problem?
├─ YES → Matrix Traversal Pattern
└─ NO → Continue...

Is it about substrings/subarrays?
├─ YES → Sliding Window Pattern
└─ NO → Continue...

Is the array sorted?
├─ YES → Binary Search OR Two Pointers
│   └─ Need search? → Binary Search
│   └─ Need pairs/partition? → Two Pointers
└─ NO → Continue...

Need O(1) lookups or counting?
├─ YES → HashMap Pattern
└─ NO → Continue...

Need to optimize (max/min) in one pass?
├─ YES → Greedy Pattern
└─ NO → Continue...

Need to rearrange/permute?
├─ YES → Array Manipulation Pattern
└─ NO → Continue...

Need to sort or count inversions?
├─ YES → Sorting Pattern
└─ NO → Other patterns...
```

---

## 📝 Pattern Characteristics Summary

| Pattern | Time Complexity | Space Complexity | Key Technique |
|---------|----------------|------------------|---------------|
| **Two Pointers** | O(n) | O(1) | Two indices moving |
| **HashMap** | O(n) | O(n) | Hash table for lookups |
| **Greedy** | O(n) or O(n log n) | O(1) | Local optimal choices |
| **Binary Search** | O(log n) | O(1) | Divide search space |
| **Sliding Window** | O(n) | O(1) or O(k) | Maintain window |
| **Matrix Traversal** | O(m×n) | O(1) or O(m×n) | Boundary tracking |
| **Array Manipulation** | O(n) | O(1) | In-place swaps |
| **Sorting** | O(n log n) | O(1) or O(n) | Divide & conquer |

---

## 🎓 Learning Path Recommendation

### Beginner (Start Here)
1. Two Pointers - Sort Colors
2. HashMap - Count Frequencies
3. Greedy - Jump Game
4. Binary Search - Square Root

### Intermediate
5. Sliding Window - Minimum Window Substring
6. Matrix Traversal - Spiral Matrix
7. Array Manipulation - Next Permutation
8. Sorting - Count Inversions

### Advanced
9. Matrix Rotation In-Place
10. Celebrity Problem
11. QuickSelect Algorithm
12. Median of Two Sorted Arrays

---

*Use this guide to quickly identify which pattern to apply when solving new problems!*

