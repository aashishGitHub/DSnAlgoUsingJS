# Arrays Pattern

**When to Use**: Array manipulation, rotation, flattening, product operations  
**Time Complexity**: O(n) to O(n²) | **Space Complexity**: O(1) to O(n)

## 📚 Documentation

- **[Pattern Categorization Guide](./PATTERN_CATEGORIZATION_GUIDE.md)** - Complete guide to identify which pattern to use
- **[Detailed Explanations](./ARRAY_PROBLEMS_DETAILED_EXPLANATIONS.md)** - Step-by-step solutions with visualizations

## Problems in this folder:

### Basic Array Operations
1. **flattenArray.js** - Flatten nested array
2. **productExceptSelf.js** - Product of array except self (prefix/suffix)
3. **mergeTwoSortedArrays.js** - Merge two sorted arrays
4. **rotateArray.js** - Rotate array by k positions
5. **rotateArrayOptimized.js** - Optimized array rotation
6. **maxMin.js** - Find max and min in array
7. **increasingSequencesOfSizeK.js** - Generate increasing sequences
8. **kthLargest.js** - Find Kth largest element (Heap/QuickSelect)

### Pattern-Based Problems (New!)
9. **arrayPatternProblems.ts** - Comprehensive array pattern problems:
   - Sort Colors (Dutch National Flag) - Two Pointers
   - Next Permutation - Array Manipulation
   - Next Greater Number - Array Manipulation
   - Spiral Matrix - Matrix Traversal
   - Rotate Matrix 90° - Matrix Manipulation
   - Celebrity Problem - Two Pointers (Elimination)
   - Count Inversions - Sorting (Merge Sort)
   - Count Frequencies - HashMap
   - O(1) Data Structure - HashMap + Array

### Documentation
10. **rotateArrayComparison.md** - Comparison of rotation approaches
11. **PATTERN_CATEGORIZATION_GUIDE.md** - Pattern identification guide
12. **ARRAY_PROBLEMS_DETAILED_EXPLANATIONS.md** - Detailed explanations with visualizations

## Pattern Categories

### 1. Two Pointers
- Sort Colors (0s, 1s, 2s)
- Celebrity Problem
- Merge Two Sorted Arrays

### 2. Array Manipulation
- Next Permutation
- Next Greater Number
- Rotate Array

### 3. Matrix Traversal
- Spiral Matrix
- Rotate Matrix 90°

### 4. Sorting (Divide & Conquer)
- Count Inversions (Merge Sort)
- Merge Sort

### 5. HashMap
- Count Frequencies
- O(1) Data Structure

## Common Techniques:

- **Two Pointers**: For merging, partitioning, elimination
- **Prefix/Suffix**: For product problems
- **In-place Operations**: For space optimization
- **Heap/QuickSelect**: For Kth element problems
- **Matrix Manipulation**: Transpose, reverse, boundary tracking

## Related Patterns:

- Two Pointers (for merging, partitioning)
- Sliding Window (for subarray problems)
- Dynamic Programming (for subsequence problems)
- Binary Search (for sorted array problems)
- HashMap (for frequency counting)

