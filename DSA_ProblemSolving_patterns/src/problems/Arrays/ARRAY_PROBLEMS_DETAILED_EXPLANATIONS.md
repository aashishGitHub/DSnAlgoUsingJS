# Array Problems - Detailed Explanations with Visualizations

This document provides comprehensive explanations for all array problems, focusing on pattern identification and step-by-step solutions.

---

## 📚 Table of Contents

1. [Sort Colors (Dutch National Flag)](#1-sort-colors-dutch-national-flag)
2. [Next Permutation](#2-next-permutation)
3. [Spiral Matrix](#3-spiral-matrix)
4. [Rotate Matrix 90°](#4-rotate-matrix-90-degrees)
5. [Celebrity Problem](#5-celebrity-problem)
6. [Count Inversions](#6-count-inversions)
7. [Count Frequencies](#7-count-frequencies)
8. [O(1) Data Structure](#8-o1-data-structure)

---

## 1. Sort Colors (Dutch National Flag)

### 🎯 Pattern: **Two Pointers (Partitioning)**

### Problem Statement
Sort an array of 0s, 1s, and 2s in-place without using extra space.

### Why Two Pointers?
- Need to partition array into three sections
- In-place requirement (O(1) space)
- Single pass needed (O(n) time)

### Algorithm

```
Use three pointers:
- low: boundary for 0s (all before low are 0s)
- mid: current element being examined
- high: boundary for 2s (all after high are 2s)

Rules:
- If nums[mid] == 0: swap with low, increment both
- If nums[mid] == 1: just increment mid
- If nums[mid] == 2: swap with high, decrement high
```

### Step-by-Step Visualization

```
Initial: [2, 0, 2, 1, 1, 0]
         ↑              ↑
        low            high
        mid

Iteration 1: mid=0, nums[0]=2
  → Swap with high, high--
  [0, 0, 2, 1, 1, 2]
   ↑           ↑
  low        high
  mid

Iteration 2: mid=0, nums[0]=0
  → Swap with low, low++, mid++
  [0, 0, 2, 1, 1, 2]
      ↑        ↑
     low      high
     mid

Iteration 3: mid=1, nums[1]=0
  → Swap with low, low++, mid++
  [0, 0, 2, 1, 1, 2]
         ↑     ↑
        low  high
        mid

Iteration 4: mid=2, nums[2]=2
  → Swap with high, high--
  [0, 0, 1, 1, 2, 2]
         ↑  ↑
        low high
        mid

Iteration 5: mid=2, nums[2]=1
  → No swap, mid++
  [0, 0, 1, 1, 2, 2]
         ↑  ↑
        low high
           mid

Result: [0, 0, 1, 1, 2, 2] ✅
```

### Key Insights
1. **Three-way partitioning** using three pointers
2. **Don't increment mid** when swapping with high (need to check swapped element)
3. **Increment mid** when swapping with low (already checked)

### Time Complexity: O(n)
### Space Complexity: O(1)

---

## 2. Next Permutation

### 🎯 Pattern: **Array Manipulation (Permutation)**

### Problem Statement
Find the next lexicographically greater permutation of an array.

### Why This Pattern?
- Need to rearrange elements in-place
- Lexicographic ordering requires specific swap and reverse operations
- No need for generating all permutations

### Algorithm

```
1. Find the largest index i where nums[i] < nums[i+1]
   (This is the "pivot" - the rightmost element that can be increased)

2. Find the largest index j > i where nums[j] > nums[i]
   (This is the smallest element greater than nums[i] to the right)

3. Swap nums[i] and nums[j]

4. Reverse the suffix starting at i+1
   (This makes the suffix the smallest possible)
```

### Step-by-Step Visualization

```
Example: [1, 3, 5, 4, 2]

Step 1: Find pivot (rightmost element smaller than next)
  [1, 3, 5, 4, 2]
       ↑  ↑
       i  i+1
  nums[1]=3 < nums[2]=5 ✓
  i = 1

Step 2: Find rightmost element greater than nums[i]
  [1, 3, 5, 4, 2]
       ↑     ↑
       i     j
  nums[3]=4 > nums[1]=3 ✓
  j = 3

Step 3: Swap nums[i] and nums[j]
  [1, 4, 5, 3, 2]

Step 4: Reverse suffix starting at i+1
  Suffix: [5, 3, 2] → [2, 3, 5]
  Result: [1, 4, 2, 3, 5] ✅
```

### Why This Works

```
Lexicographic ordering means:
- Compare from left to right
- First difference determines order

[1, 3, 5, 4, 2] → [1, 4, 2, 3, 5]

We want the smallest increase:
1. Increase the rightmost possible position (pivot)
2. Use the smallest possible value for that position
3. Make the suffix as small as possible (sorted ascending)
```

### Time Complexity: O(n)
### Space Complexity: O(1)

---

## 3. Spiral Matrix

### 🎯 Pattern: **Matrix Traversal (Boundary Tracking)**

### Problem Statement
Print all elements of a matrix in spiral order.

### Why This Pattern?
- Need to traverse boundaries in order
- Layer-by-layer approach is natural
- Four directions: right, down, left, up

### Algorithm

```
Use four boundaries: top, bottom, left, right

While top <= bottom AND left <= right:
  1. Traverse top row: left → right
  2. Traverse right column: top → bottom
  3. Traverse bottom row: right → left (if valid)
  4. Traverse left column: bottom → top (if valid)
  
  Update boundaries: top++, right--, bottom--, left++
```

### Step-by-Step Visualization

```
Matrix: [[1, 2, 3],
         [4, 5, 6],
         [7, 8, 9]]

Layer 1 (outer boundary):
  top=0, bottom=2, left=0, right=2
  
  Step 1: Top row (left to right)
    [1, 2, 3] → result: [1, 2, 3]
    top++ → top=1
  
  Step 2: Right column (top to bottom)
    [6, 9] → result: [1, 2, 3, 6, 9]
    right-- → right=1
  
  Step 3: Bottom row (right to left)
    [8, 7] → result: [1, 2, 3, 6, 9, 8, 7]
    bottom-- → bottom=1
  
  Step 4: Left column (bottom to top)
    [4] → result: [1, 2, 3, 6, 9, 8, 7, 4]
    left++ → left=1

Layer 2 (inner):
  top=1, bottom=1, left=1, right=1
  
  Step 1: Top row
    [5] → result: [1, 2, 3, 6, 9, 8, 7, 4, 5]
    top++ → top=2 (loop ends)

Result: [1, 2, 3, 6, 9, 8, 7, 4, 5] ✅
```

### Key Insights
1. **Boundary tracking** is cleaner than direction tracking
2. **Check validity** before traversing bottom and left (avoid duplicates)
3. **Single element** case handled automatically

### Time Complexity: O(m×n)
### Space Complexity: O(1) excluding output

---

## 4. Rotate Matrix 90 Degrees

### 🎯 Pattern: **Matrix Manipulation (Transpose + Reverse)**

### Problem Statement
Rotate an n×n matrix 90 degrees clockwise in-place.

### Why This Pattern?
- Transpose + reverse is elegant
- In-place requirement
- Mathematical transformation

### Algorithm (Method 1: Transpose + Reverse)

```
Step 1: Transpose the matrix
  Swap matrix[i][j] with matrix[j][i] for all i < j

Step 2: Reverse each row
  Reverse each row from left to right
```

### Step-by-Step Visualization

```
Original:    Step 1 (Transpose):    Step 2 (Reverse rows):
[1, 2, 3]    [1, 4, 7]              [7, 4, 1]
[4, 5, 6] →  [2, 5, 8]          →   [8, 5, 2]
[7, 8, 9]    [3, 6, 9]              [9, 6, 3]

Transpose swaps:
  (0,1) ↔ (1,0): 2 ↔ 4
  (0,2) ↔ (2,0): 3 ↔ 7
  (1,2) ↔ (2,1): 6 ↔ 8

Reverse each row:
  Row 0: [1, 4, 7] → [7, 4, 1]
  Row 1: [2, 5, 8] → [8, 5, 2]
  Row 2: [3, 6, 9] → [9, 6, 3]
```

### Algorithm (Method 2: Layer-by-Layer)

```
For each layer (from outer to inner):
  Rotate four corners:
    top → right
    right → bottom
    bottom → left
    left → top
```

### Why Transpose + Reverse Works

```
90° clockwise rotation:
  Original position (i, j) → New position (j, n-1-i)

Transpose: (i, j) → (j, i)
Reverse row: (j, i) → (j, n-1-i)

Combined: (i, j) → (j, n-1-i) ✓
```

### Time Complexity: O(n²)
### Space Complexity: O(1)

---

## 5. Celebrity Problem

### 🎯 Pattern: **Two Pointers (Elimination)**

### Problem Statement
Find the celebrity who knows nobody but is known by everybody.

### Why This Pattern?
- Elimination strategy reduces candidates
- O(n) time requirement
- Two-pointer comparison is efficient

### Algorithm

```
Step 1: Find candidate using elimination
  candidate = 0
  For i from 1 to n-1:
    If knows(candidate, i):
      candidate = i  // candidate knows i, so candidate can't be celebrity
  
Step 2: Verify candidate
  For i from 0 to n-1:
    If i != candidate:
      If knows(candidate, i): return -1  // candidate knows someone
      If !knows(i, candidate): return -1  // someone doesn't know candidate
  
  Return candidate
```

### Step-by-Step Visualization

```
Knows matrix (row knows column):
       0  1  2  3
    0 [0, 1, 1, 1]  → 0 knows 1,2,3
    1 [1, 0, 1, 1]  → 1 knows 0,2,3
    2 [0, 0, 0, 0]  → 2 knows nobody ✓
    3 [0, 0, 1, 0]  → 3 knows 2

Step 1: Elimination
  candidate = 0
  
  Compare 0 and 1:
    knows(0, 1) = true
    → Eliminate 0, candidate = 1
  
  Compare 1 and 2:
    knows(1, 2) = true
    → Eliminate 1, candidate = 2
  
  Compare 2 and 3:
    knows(2, 3) = false
    → Eliminate 3, candidate = 2

Step 2: Verification
  Check if 2 knows nobody:
    Row 2: [0, 0, 0, 0] ✓
  
  Check if everyone knows 2:
    Column 2: [1, 1, 0, 1] ✓ (except itself)

Result: Celebrity is 2 ✅
```

### Key Insights
1. **Elimination** reduces to one candidate in O(n)
2. **Verification** ensures correctness
3. **At most one celebrity** can exist

### Time Complexity: O(n)
### Space Complexity: O(1)

---

## 6. Count Inversions

### 🎯 Pattern: **Sorting (Divide & Conquer - Merge Sort)**

### Problem Statement
Count the number of inversions in an array.
An inversion is a pair (i, j) where i < j and arr[i] > arr[j].

### Why Merge Sort?
- Divide and conquer naturally counts inversions
- During merge, we can count cross-inversions
- O(n log n) time complexity

### Algorithm

```
Modify merge sort to count inversions:

During merge step:
  When copying from right subarray:
    All remaining elements in left subarray form inversions
    Count += (leftArr.length - i)
```

### Step-by-Step Visualization

```
Array: [2, 4, 1, 3, 5]

Merge Sort Tree:
              [2, 4, 1, 3, 5]
              /              \
        [2, 4, 1]        [3, 5]
        /        \       /     \
     [2, 4]     [1]    [3]    [5]
     /    \
   [2]   [4]

Merge and Count:

Merge [2] and [4]:
  No inversions
  Result: [2, 4], inversions = 0

Merge [2, 4] and [1]:
  leftArr = [2, 4], rightArr = [1]
  
  Compare 2 and 1:
    2 > 1 → inversion!
    Count += (2 - 0) = 2 inversions: (2,1) and (4,1)
    Copy 1
  
  Copy remaining: [2, 4]
  Result: [1, 2, 4], inversions = 2

Merge [3] and [5]:
  No inversions
  Result: [3, 5], inversions = 0

Merge [1, 2, 4] and [3, 5]:
  leftArr = [1, 2, 4], rightArr = [3, 5]
  
  Compare 1 and 3: 1 < 3, copy 1, no inversion
  Compare 2 and 3: 2 < 3, copy 2, no inversion
  Compare 4 and 3: 4 > 3 → inversion!
    Count += (3 - 2) = 1 inversion: (4,3)
    Copy 3
  Compare 4 and 5: 4 < 5, copy 4, no inversion
  Copy 5
  
  Result: [1, 2, 3, 4, 5], inversions = 2 + 1 = 3

Total inversions: 3 ✅
```

### Key Insights
1. **Cross-inversions** are counted during merge
2. **Remaining left elements** form inversions with current right element
3. **Divide and conquer** naturally handles all cases

### Time Complexity: O(n log n)
### Space Complexity: O(n)

---

## 7. Count Frequencies

### 🎯 Pattern: **HashMap / Array Indexing**

### Problem Statement
Count the frequency of each element in an array in O(n) time.

### Why HashMap?
- O(1) average case insertion/lookup
- Works for any range of values
- Simple and intuitive

### Algorithm (HashMap)

```
Create a map
For each element in array:
  Increment count in map
Return map
```

### Algorithm (Array Indexing - when range is 0 to n-1)

```
Create array of size (max + 1)
For each element:
  frequencies[element]++
Return frequencies array
```

### Step-by-Step Visualization

```
Array: [1, 2, 2, 3, 1, 4, 2]

Method 1: HashMap
  Map: {}
  
  Process 1: Map[1] = 1
  Process 2: Map[2] = 1
  Process 2: Map[2] = 2
  Process 3: Map[3] = 1
  Process 1: Map[1] = 2
  Process 4: Map[4] = 1
  Process 2: Map[2] = 3
  
  Result: {1: 2, 2: 3, 3: 1, 4: 1}

Method 2: Array Indexing
  Max = 4, create array[5]
  frequencies = [0, 0, 0, 0, 0]
  
  Process each element:
    frequencies[1]++ → [0, 1, 0, 0, 0]
    frequencies[2]++ → [0, 1, 1, 0, 0]
    frequencies[2]++ → [0, 1, 2, 0, 0]
    frequencies[3]++ → [0, 1, 2, 1, 0]
    frequencies[1]++ → [0, 2, 2, 1, 0]
    frequencies[4]++ → [0, 2, 2, 1, 1]
    frequencies[2]++ → [0, 2, 3, 1, 1]
  
  Result: [0, 2, 3, 1, 1]
    (index 0: 0 occurrences, index 1: 2, index 2: 3, etc.)
```

### When to Use Which?

| Method | When to Use | Space Complexity |
|--------|-------------|------------------|
| HashMap | Any range of values | O(n) |
| Array Indexing | Values in range 0 to n-1 | O(max) |

### Time Complexity: O(n)
### Space Complexity: O(n) for HashMap, O(max) for array

---

## 8. O(1) Data Structure

### 🎯 Pattern: **HashMap + Array**

### Problem Statement
Design a data structure with O(1) insert, search, delete, and getRandom operations.

### Why HashMap + Array?
- **HashMap**: O(1) search and delete
- **Array**: O(1) random access
- **Combination**: Best of both worlds

### Algorithm

```
Data Structure:
  - Array: stores values (for random access)
  - HashMap: maps value → index in array

Insert(val):
  If exists: return false
  Append to array
  Map value → last index

Delete(val):
  If not exists: return false
  Get index from map
  Swap with last element
  Update map for swapped element
  Remove last element
  Delete from map

GetRandom():
  Random index in array
  Return array[randomIndex]
```

### Step-by-Step Visualization

```
Initial: arr = [], map = {}

Insert(10):
  arr = [10]
  map = {10: 0}

Insert(20):
  arr = [10, 20]
  map = {10: 0, 20: 1}

Insert(30):
  arr = [10, 20, 30]
  map = {10: 0, 20: 1, 30: 2}

Delete(20):
  index = map[20] = 1
  lastElement = arr[2] = 30
  
  Swap: arr[1] = 30, arr[2] = 20
  arr = [10, 30, 20]
  
  Update map: map[30] = 1
  Remove last: arr = [10, 30]
  Delete from map: map = {10: 0, 30: 1}

GetRandom():
  randomIndex = 0 or 1
  Return arr[randomIndex] (10 or 30)
```

### Key Insights
1. **Array** provides O(1) random access
2. **HashMap** provides O(1) lookup
3. **Swap with last** makes deletion O(1)
4. **Update map** when swapping is crucial

### Time Complexity: O(1) for all operations
### Space Complexity: O(n)

---

## 🎓 Pattern Summary

| Problem | Pattern | Key Technique | Time | Space |
|---------|---------|---------------|------|-------|
| Sort Colors | Two Pointers | Three-way partitioning | O(n) | O(1) |
| Next Permutation | Array Manipulation | Swap + Reverse | O(n) | O(1) |
| Spiral Matrix | Matrix Traversal | Boundary tracking | O(m×n) | O(1) |
| Rotate Matrix | Matrix Manipulation | Transpose + Reverse | O(n²) | O(1) |
| Celebrity | Two Pointers | Elimination | O(n) | O(1) |
| Count Inversions | Sorting | Merge sort modification | O(n log n) | O(n) |
| Count Frequencies | HashMap | Frequency map | O(n) | O(n) |
| O(1) Data Structure | HashMap + Array | Combined structure | O(1) | O(n) |

---

*Use this guide to understand patterns and solve similar problems!*

