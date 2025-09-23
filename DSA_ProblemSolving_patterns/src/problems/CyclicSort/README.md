# Cyclic Sort Pattern

The Cyclic Sort pattern solves problems with array values in a fixed range by swapping elements into their correct positions in-place. This pattern is particularly useful for problems involving missing numbers, duplicate numbers, and array elements in a specific range where each number should be in a specific position.

## Pattern Types

### 1. Basic Cyclic Sort
- **Sort arrays** containing numbers from 1 to n
- **In-place sorting** with O(1) extra space
- **Time Complexity:** O(n) - each element is visited at most twice
- **Space Complexity:** O(1) - constant extra space

**Common Problems:**
- Cyclic Sort
- Find Missing Number
- Find Duplicate Number
- Set Mismatch

### 2. Missing Numbers Problems
- **Find missing numbers** in arrays with specific ranges
- **Handle multiple missing** numbers efficiently
- **Work with ranges** beyond array length
- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - excluding output array

**Common Problems:**
- Find All Missing Numbers
- First Missing Positive
- Find First K Missing Positive Numbers
- Missing Number

### 3. Duplicate Numbers Problems
- **Find duplicate numbers** in arrays
- **Handle multiple duplicates** efficiently
- **Identify unique duplicates** in sorted arrays
- **Time Complexity:** O(n)
- **Space Complexity:** O(1) - excluding output array

**Common Problems:**
- Find All Duplicate Numbers
- Find Duplicate Number
- Set Mismatch
- Find Error Nums

## Implementation Templates

### Basic Cyclic Sort Template
```typescript
function cyclicSort(nums: number[]): void {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1; // Correct position for nums[i]
        
        // If element is not in correct position, swap it
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++; // Move to next element
        }
    }
}
```

### Find Missing Numbers Template
```typescript
function findMissingNumbers(nums: number[]): number[] {
    // First, place each number in its correct position
    let i = 0;
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find all positions that don't contain the correct number
    const missing: number[] = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            missing.push(i + 1);
        }
    }
    
    return missing;
}
```

### Find Duplicates Template
```typescript
function findDuplicates(nums: number[]): number[] {
    // First, place each number in its correct position
    let i = 0;
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find all positions that contain duplicate numbers
    const duplicates: number[] = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            duplicates.push(nums[i]);
        }
    }
    
    return duplicates;
}
```

### First Missing Positive Template
```typescript
function firstMissingPositive(nums: number[]): number {
    const n = nums.length;
    let i = 0;
    
    // Place each positive number in its correct position
    while (i < n) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find the first missing positive
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1; // All numbers from 1 to n are present
}
```

## Key Concepts

### Core Principle
- **Each number should be at index (number - 1)** in a 1-indexed array
- **Swap elements** until they are in their correct positions
- **Only move to next element** when current element is in correct position
- **Avoid infinite loops** by checking if swap is needed

### Position Mapping
- **For 1-indexed arrays:** `correctIndex = nums[i] - 1`
- **For 0-indexed arrays:** `correctIndex = nums[i]`
- **Range validation:** Ensure numbers are within valid range
- **Boundary checking:** Handle edge cases properly

### Swap Strategy
- **Only swap when necessary:** `nums[i] !== nums[correctIndex]`
- **Use destructuring:** `[a, b] = [b, a]` for clean swapping
- **Avoid unnecessary swaps:** Check conditions before swapping
- **Handle duplicates:** Prevent infinite loops with duplicates

## When to Use Cyclic Sort

✅ **Use when:**
- Array contains numbers in a specific range (usually 1 to n)
- Need to find missing or duplicate numbers
- Problem involves placing elements in correct positions
- Working with arrays where each number has a "correct" position
- Need O(1) space complexity for sorting

❌ **Don't use when:**
- Array contains numbers outside the expected range
- Need to preserve original array order
- Working with non-numeric data
- Problem doesn't involve position-based sorting
- Need stable sorting algorithm

## Common Patterns

### 1. Basic Sorting Pattern
```typescript
// Sort array containing numbers 1 to n
let i = 0;
while (i < nums.length) {
    const correctIndex = nums[i] - 1;
    if (nums[i] !== nums[correctIndex]) {
        [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    } else {
        i++;
    }
}
```

### 2. Missing Numbers Pattern
```typescript
// Find missing numbers after sorting
const missing: number[] = [];
for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
        missing.push(i + 1);
    }
}
```

### 3. Duplicate Numbers Pattern
```typescript
// Find duplicate numbers after sorting
const duplicates: number[] = [];
for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
        duplicates.push(nums[i]);
    }
}
```

### 4. Range Validation Pattern
```typescript
// Only process numbers in valid range
if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
    [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
} else {
    i++;
}
```

## Common Mistakes

1. **Incorrect position calculation**
   - Use `nums[i] - 1` for 1-indexed arrays
   - Use `nums[i]` for 0-indexed arrays
   - Double-check the mapping formula

2. **Infinite loops with duplicates**
   - Always check if swap is needed before swapping
   - Use `else` clause to increment pointer
   - Handle duplicate numbers properly

3. **Wrong range validation**
   - Check if number is within valid range
   - Handle negative numbers and zero
   - Consider array length constraints

4. **Missing edge cases**
   - Empty arrays
   - Single element arrays
   - Already sorted arrays
   - Arrays with all duplicates

## Performance Tips

1. **Efficient swapping**
   - Use destructuring for clean swaps
   - Avoid unnecessary array operations
   - Minimize memory allocations

2. **Early termination**
   - Stop when array is sorted
   - Use appropriate loop conditions
   - Avoid redundant iterations

3. **Range optimization**
   - Only process valid numbers
   - Skip numbers outside range
   - Handle edge cases efficiently

## Practice Problems

### Easy
- [ ] Missing Number
- [ ] Find the Duplicate Number
- [ ] Set Mismatch
- [ ] First Missing Positive

### Medium
- [ ] Find All Missing Numbers
- [ ] Find All Duplicate Numbers
- [ ] Find First K Missing Positive Numbers
- [ ] Correct Array

### Hard
- [ ] Find Missing In Range
- [ ] Cyclic Sort Variations
- [ ] Advanced Missing/Duplicate Problems
- [ ] Custom Range Problems

## Files in this Directory

- `cyclicSort.ts` - Main implementation file
- `cyclicSort.test.ts` - Test cases
- `README.md` - This documentation

## Advanced Topics

### Custom Range Handling
- Handle ranges other than 1 to n
- Support for 0-indexed arrays
- Custom position mapping functions
- Flexible range validation

### Memory Optimization
- In-place operations only
- Minimal extra space usage
- Efficient swap operations
- Avoid creating new arrays

### Performance Analysis
- Time complexity: O(n) - each element visited at most twice
- Space complexity: O(1) - constant extra space
- Swap count analysis
- Comparison with other sorting algorithms

## Mathematical Insights

### Position Mapping Mathematics
- **1-indexed array:** Position of number `x` is `x - 1`
- **0-indexed array:** Position of number `x` is `x`
- **Range validation:** Number `x` is valid if `1 <= x <= n`
- **Swap condition:** Swap if `nums[i] !== nums[correctIndex]`

### Time Complexity Analysis
- **Each element is visited at most twice:** Once to place it, once to verify
- **Total operations:** O(n) swaps + O(n) comparisons
- **Best case:** O(n) when array is already sorted
- **Worst case:** O(n) when array is completely reversed

### Space Complexity
- **Constant extra space:** Only using variables for indices
- **In-place sorting:** Modifying original array
- **No recursion:** Iterative approach
- **No additional data structures:** Pure array manipulation
