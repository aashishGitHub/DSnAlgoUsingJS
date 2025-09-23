/**
 * Cyclic Sort Pattern
 * 
 * This pattern solves problems with array values in a fixed range by swapping
 * elements into their correct positions in-place. It's particularly useful for
 * problems involving missing numbers, duplicate numbers, and array elements
 * in a specific range.
 * 
 * Key Points:
 * - Solves problems with array values in a fixed range
 * - Swap elements into their correct positions in-place
 * - Common for missing/duplicate number problems
 * 
 * Time Complexity: O(n) - each element is visited at most twice
 * Space Complexity: O(1) - constant extra space
 */

// ============================================================================
// 1. CYCLIC SORT BASIC IMPLEMENTATION
// ============================================================================

/**
 * Sort an array containing numbers from 1 to n using cyclic sort
 * 
 * @param nums - Array containing numbers from 1 to n
 * 
 * Time: O(n) - each element is visited at most twice
 * Space: O(1) - constant extra space
 */
export function cyclicSort(nums: number[]): void {
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

// ============================================================================
// 2. FIND ALL MISSING NUMBERS
// ============================================================================

/**
 * Find all missing numbers in an array containing numbers from 1 to n
 * 
 * @param nums - Array containing numbers from 1 to n (some may be missing)
 * @returns Array of missing numbers
 * 
 * Time: O(n) - cyclic sort + linear scan
 * Space: O(1) - excluding output array
 */
export function findDisappearedNumbers(nums: number[]): number[] {
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

// ============================================================================
// 3. FIND ALL DUPLICATE NUMBERS
// ============================================================================

/**
 * Find all duplicate numbers in an array containing numbers from 1 to n
 * 
 * @param nums - Array containing numbers from 1 to n (some may be duplicated)
 * @returns Array of duplicate numbers
 * 
 * Time: O(n) - cyclic sort + linear scan
 * Space: O(1) - excluding output array
 */
export function findDuplicates(nums: number[]): number[] {
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

// ============================================================================
// 4. FIND THE FIRST K MISSING POSITIVE NUMBERS
// ============================================================================

/**
 * Find the first k missing positive numbers in an array
 * 
 * @param nums - Array of integers
 * @param k - Number of missing positive numbers to find
 * @returns Array of first k missing positive numbers
 * 
 * Time: O(n) - cyclic sort + linear scan
 * Space: O(1) - excluding output array
 */
export function findFirstKMissingPositive(nums: number[], k: number): number[] {
    const n = nums.length;
    
    // First, place each positive number in its correct position
    let i = 0;
    while (i < n) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find missing numbers
    const missing: number[] = [];
    const extraNumbers = new Set<number>();
    
    // First, find missing numbers within the array range
    for (let i = 0; i < n && missing.length < k; i++) {
        if (nums[i] !== i + 1) {
            missing.push(i + 1);
            if (nums[i] > 0) {
                extraNumbers.add(nums[i]);
            }
        }
    }
    
    // If we need more missing numbers, continue beyond the array range
    let candidate = n + 1;
    while (missing.length < k) {
        if (!extraNumbers.has(candidate)) {
            missing.push(candidate);
        }
        candidate++;
    }
    
    return missing;
}

// ============================================================================
// 5. FIND THE DUPLICATE NUMBER
// ============================================================================

/**
 * Find the duplicate number in an array containing n+1 integers from 1 to n
 * 
 * @param nums - Array containing n+1 integers from 1 to n
 * @returns The duplicate number
 * 
 * Time: O(n) - cyclic sort
 * Space: O(1)
 */
export function findDuplicate(nums: number[]): number {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find the duplicate
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            return nums[i];
        }
    }
    
    return -1; // No duplicate found
}

// ============================================================================
// 6. FIND THE MISSING NUMBER
// ============================================================================

/**
 * Find the missing number in an array containing n distinct numbers from 0 to n
 * 
 * @param nums - Array containing n distinct numbers from 0 to n
 * @returns The missing number
 * 
 * Time: O(n) - cyclic sort
 * Space: O(1)
 */
export function missingNumber(nums: number[]): number {
    const n = nums.length;
    let i = 0;
    
    // Place each number in its correct position
    while (i < n) {
        const correctIndex = nums[i];
        
        if (nums[i] < n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find the missing number
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i) {
            return i;
        }
    }
    
    return n; // The missing number is n
}

// ============================================================================
// 7. SET MISMATCH
// ============================================================================

/**
 * Find the duplicate and missing numbers in an array
 * 
 * @param nums - Array containing numbers from 1 to n with one duplicate and one missing
 * @returns [duplicate, missing]
 * 
 * Time: O(n) - cyclic sort
 * Space: O(1) - excluding output array
 */
export function findErrorNums(nums: number[]): number[] {
    let i = 0;
    
    // Place each number in its correct position
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find the duplicate and missing numbers
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            return [nums[i], i + 1]; // [duplicate, missing]
        }
    }
    
    return [-1, -1]; // Should not reach here
}

// ============================================================================
// 8. FIRST MISSING POSITIVE
// ============================================================================

/**
 * Find the first missing positive integer in an array
 * 
 * @param nums - Array of integers
 * @returns First missing positive integer
 * 
 * Time: O(n) - cyclic sort
 * Space: O(1)
 */
export function firstMissingPositive(nums: number[]): number {
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

// ============================================================================
// 9. CORRECT THE ARRAY
// ============================================================================

/**
 * Correct an array by placing each number in its correct position
 * 
 * @param nums - Array containing numbers from 1 to n (may be unsorted)
 * @returns Corrected array
 * 
 * Time: O(n) - each element is visited at most twice
 * Space: O(1)
 */
export function correctArray(nums: number[]): number[] {
    let i = 0;
    
    while (i < nums.length) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    return nums;
}

// ============================================================================
// 10. FIND ALL MISSING NUMBERS IN RANGE
// ============================================================================

/**
 * Find all missing numbers in a specific range
 * 
 * @param nums - Array containing numbers in range [1, n]
 * @param start - Start of range (inclusive)
 * @param end - End of range (inclusive)
 * @returns Array of missing numbers in the range
 * 
 * Time: O(n) - cyclic sort + linear scan
 * Space: O(1) - excluding output array
 */
export function findMissingInRange(nums: number[], start: number, end: number): number[] {
    const n = nums.length;
    let i = 0;
    
    // Place each number in its correct position
    while (i < n) {
        const correctIndex = nums[i] - 1;
        
        if (nums[i] >= 1 && nums[i] <= n && nums[i] !== nums[correctIndex]) {
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find missing numbers in the specified range
    const missing: number[] = [];
    for (let i = 0; i < n; i++) {
        const expectedNumber = i + 1;
        if (expectedNumber >= start && expectedNumber <= end && nums[i] !== expectedNumber) {
            missing.push(expectedNumber);
        }
    }
    
    return missing;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if an array is correctly sorted (contains numbers 1 to n in order)
 */
export function isCorrectlySorted(nums: number[]): boolean {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== i + 1) {
            return false;
        }
    }
    return true;
}

/**
 * Find the correct position for a number in a 1-indexed array
 */
export function getCorrectIndex(num: number): number {
    return num - 1;
}

/**
 * Check if a number is in the valid range for cyclic sort
 */
export function isValidForCyclicSort(num: number, arrayLength: number): boolean {
    return num >= 1 && num <= arrayLength;
}

/**
 * Count the number of swaps needed to sort the array
 */
export function countSwaps(nums: number[]): number {
    const numsCopy = [...nums];
    let swaps = 0;
    let i = 0;
    
    while (i < numsCopy.length) {
        const correctIndex = numsCopy[i] - 1;
        
        if (numsCopy[i] !== numsCopy[correctIndex]) {
            [numsCopy[i], numsCopy[correctIndex]] = [numsCopy[correctIndex], numsCopy[i]];
            swaps++;
        } else {
            i++;
        }
    }
    
    return swaps;
}
