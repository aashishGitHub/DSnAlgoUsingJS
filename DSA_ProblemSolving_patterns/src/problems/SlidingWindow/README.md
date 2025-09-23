# Sliding Window Pattern

The sliding window pattern is a powerful technique for solving problems involving arrays or strings where you need to find a contiguous subarray or substring that satisfies certain conditions.

## Pattern Types

### 1. Fixed Size Sliding Window
- **Window size remains constant**
- Slide the window by one position at a time
- **Time Complexity:** O(n)
- **Space Complexity:** O(1) or O(k)

**Common Problems:**
- Maximum sum of subarray of size K
- First negative number in every window of size K
- Count anagrams of a pattern in a string
- Maximum of all subarrays of size K

### 2. Variable Size Sliding Window
- **Window size can grow or shrink** based on conditions
- Use two pointers (left and right) to maintain the window
- **Time Complexity:** O(n)
- **Space Complexity:** O(1) or O(k)

**Common Problems:**
- Longest substring without repeating characters
- Longest substring with at most K distinct characters
- Minimum window substring
- Longest subarray with sum less than or equal to K

### 3. Two Pointer Sliding Window
- **Use two pointers moving in different directions**
- Often used for sorted arrays or palindromes
- **Time Complexity:** O(n) or O(n²)
- **Space Complexity:** O(1)

**Common Problems:**
- Container with most water
- Trapping rain water
- 3Sum / 4Sum problems
- Remove duplicates from sorted array

## Implementation Template

### Fixed Size Window
```typescript
function fixedSizeWindow(arr: number[], k: number): number {
    let windowSum = 0;
    let maxSum = 0;
    
    // Calculate sum of first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

### Variable Size Window
```typescript
function variableSizeWindow(s: string): number {
    const charMap = new Map<string, number>();
    let maxLength = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const rightChar = s[windowEnd];
        
        // Expand window
        charMap.set(rightChar, (charMap.get(rightChar) || 0) + 1);
        
        // Contract window if condition not met
        while (/* condition */) {
            const leftChar = s[windowStart];
            charMap.set(leftChar, charMap.get(leftChar)! - 1);
            if (charMap.get(leftChar) === 0) {
                charMap.delete(leftChar);
            }
            windowStart++;
        }
        
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}
```

### Two Pointer Window
```typescript
function twoPointerWindow(arr: number[]): number {
    let left = 0;
    let right = arr.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        // Calculate current area
        const area = Math.min(arr[left], arr[right]) * (right - left);
        maxArea = Math.max(maxArea, area);
        
        // Move pointer with smaller value
        if (arr[left] < arr[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}
```

## Key Concepts

### Window Expansion
- Move the right pointer to include more elements
- Update the window state (count, sum, etc.)
- Check if the current window satisfies the condition

### Window Contraction
- Move the left pointer to exclude elements
- Update the window state accordingly
- Continue until the window is valid again

### Condition Checking
- Validate if the current window meets the problem requirements
- Update the result if a better solution is found
- Decide whether to expand or contract the window

## When to Use Sliding Window

✅ **Use when:**
- Problem involves contiguous subarray/substring
- Need to find min/max length, sum, or count
- Array/string is sorted or can be sorted
- Problem has a constraint that can be checked incrementally

❌ **Don't use when:**
- Problem requires non-contiguous elements
- Need to find all possible combinations
- Problem involves complex data structures
- Elements need to be processed in a specific order

## Common Mistakes

1. **Incorrect window size calculation**
   - Always use `right - left + 1` for window size
   - Be careful with 0-based vs 1-based indexing

2. **Missing edge cases**
   - Empty array/string
   - Single element
   - All elements are the same

3. **Inefficient condition checking**
   - Use hash maps for O(1) lookups
   - Avoid nested loops when possible

4. **Incorrect pointer movement**
   - Ensure pointers move in the right direction
   - Handle boundary conditions properly

## Practice Problems

### Easy
- [ ] Maximum Sum Subarray of Size K
- [ ] Average of All Subarrays of Size K
- [ ] Two Sum (sorted array)

### Medium
- [ ] Longest Substring Without Repeating Characters
- [ ] Longest Substring with At Most K Distinct Characters
- [ ] Minimum Window Substring
- [ ] Container With Most Water
- [ ] 3Sum

### Hard
- [ ] Sliding Window Maximum
- [ ] Longest Repeating Character Replacement
- [ ] Subarray Product Less Than K
- [ ] 4Sum

## Files in this Directory

- `fixedSizeSlidingWindow.ts` - Fixed size window problems
- `variableSizeSlidingWindow.ts` - Variable size window problems
- `twoPointerSlidingWindow.ts` - Two pointer problems
- `index.ts` - Main export file
- `*.test.ts` - Test files for each category
- `README.md` - This documentation
