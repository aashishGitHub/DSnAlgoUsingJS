/**
 * MOVE ZEROS PATTERN - SOLUTION IMPLEMENTATIONS
 * 
 * These solutions demonstrate the core two-pointer partitioning pattern
 * with various modifications and optimizations.
 */

// ========== BASIC VARIATIONS - SOLUTIONS ==========

/**
 * Solution 1: Move Negative Numbers to End
 * Pattern: Same as move zeros, but condition is num < 0
 */
function moveNegativesToEnd(nums: number[]): void {
    let writeIndex = 0;
    
    // First pass: move all positive numbers to front
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] >= 0) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Second pass: fill remaining positions with negatives
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < 0) {
            nums[writeIndex++] = nums[i];
        }
    }
}

/**
 * Solution 1 Alternative: Using swap approach (more efficient)
 */
function moveNegativesToEndSwap(nums: number[]): void {
    let left = 0;
    
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] >= 0) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
        }
    }
}

/**
 * Solution 2: Move Even Numbers to Front
 */
function moveEvensToFront(nums: number[]): void {
    let evenIndex = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] % 2 === 0) {
            [nums[evenIndex], nums[i]] = [nums[i], nums[evenIndex]];
            evenIndex++;
        }
    }
}

/**
 * Solution 3: Move Specific Value to End
 */
function moveValueToEnd(nums: number[], val: number): void {
    let writeIndex = 0;
    
    // Move all non-target values to front
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Fill remaining with target value
    while (writeIndex < nums.length) {
        nums[writeIndex++] = val;
    }
}

// ========== OPTIMIZED SOLUTIONS ==========

/**
 * Solution 6: Move Zeros - Minimize Swaps
 * Only swap when necessary (when we encounter a zero followed by non-zero)
 */
function moveZerosMinSwaps(nums: number[]): number {
    let swaps = 0;
    let writePos = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            if (i !== writePos) {
                [nums[writePos], nums[i]] = [nums[i], nums[writePos]];
                swaps++;
            }
            writePos++;
        }
    }
    
    return swaps;
}

/**
 * Solution 7: Move Zeros - No Swaps (Overwrite Method)
 */
function moveZerosNoSwaps(nums: number[]): void {
    let writeIndex = 0;
    
    // First pass: overwrite with non-zeros
    // it shifts non zeros to left even if there are multiple non zeros
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Second pass: fill remaining with zeros
    while (writeIndex < nums.length) {
        nums[writeIndex++] = 0;
    }
}

// ========== ADVANCED VARIATIONS ==========

/**
 * Solution 8: Move Multiple Values
 */
function moveMultipleValues(nums: number[], toMove: Set<number>): void {
    let writeIndex = 0;
    const moved: number[] = [];
    
    // Collect non-target values and target values separately
    for (let i = 0; i < nums.length; i++) {
        if (!toMove.has(nums[i])) {
            nums[writeIndex++] = nums[i];
        } else {
            moved.push(nums[i]);
        }
    }
    
    // Append moved values at the end
    for (const val of moved) {
        nums[writeIndex++] = val;
    }
}

/**
 * Solution 9: Partition Array by Condition
 */
function partitionByCondition(nums: number[], condition: (n: number) => boolean): void {
    let writeIndex = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (condition(nums[i])) {
            [nums[writeIndex], nums[i]] = [nums[i], nums[writeIndex]];
            writeIndex++;
        }
    }
}

/**
 * Solution 10: Move Zeros - Return New Array
 */
function moveZerosNewArray(nums: number[]): number[] {
    const result: number[] = [];
    let zeroCount = 0;
    
    // Add non-zeros first
    for (const num of nums) {
        if (num !== 0) {
            result.push(num);
        } else {
            zeroCount++;
        }
    }
    
    // Add zeros at the end
    for (let i = 0; i < zeroCount; i++) {
        result.push(0);
    }
    
    return result;
}

// ========== STRING VARIATIONS ==========

/**
 * Solution 11: Move Spaces to End
 */
function moveSpacesToEnd(chars: string[]): void {
    let writeIndex = 0;
    
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== ' ') {
            [chars[writeIndex], chars[i]] = [chars[i], chars[writeIndex]];
            writeIndex++;
        }
    }
}

/**
 * Solution 12: Move Vowels to Front
 */
function moveVowelsToFront(chars: string[]): void {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    let writeIndex = 0;
    
    for (let i = 0; i < chars.length; i++) {
        if (vowels.has(chars[i])) {
            [chars[writeIndex], chars[i]] = [chars[i], chars[writeIndex]];
            writeIndex++;
        }
    }
}

// ========== TESTING UTILITIES ==========

/**
 * Test runner for edge cases
 */
function testEdgeCases(): void {
    const testCases = [
        { input: [], expected: [] },
        { input: [0], expected: [0] },
        { input: [1], expected: [1] },
        { input: [0, 0, 0], expected: [0, 0, 0] },
        { input: [1, 2, 3], expected: [1, 2, 3] },
        { input: [0, 1, 0, 1, 0], expected: [1, 1, 0, 0, 0] },
        { input: [0, 0, 1, 2], expected: [1, 2, 0, 0] },
        { input: [1, 2, 0, 0], expected: [1, 2, 0, 0] }
    ];
    
    console.log("Testing Move Zeros implementations...");
    
    testCases.forEach((testCase, index) => {
        // Test original implementation
        const nums1 = [...testCase.input];
        moveZerosNoSwaps(nums1);
        
        const passed = JSON.stringify(nums1) === JSON.stringify(testCase.expected);
        console.log(`Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
        if (!passed) {
            console.log(`  Input: ${JSON.stringify(testCase.input)}`);
            console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
            console.log(`  Got: ${JSON.stringify(nums1)}`);
        }
    });
}

/**
 * Performance comparison between different approaches
 */
function comparePerformance(): void {
    const sizes = [1000, 10000, 100000];
    
    sizes.forEach(size => {
        // Generate test array with 30% zeros
        const nums = Array.from({ length: size }, () => 
            Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 100) + 1
        );
        
        console.log(`\\nTesting with array size: ${size}`);
        
        // Test swap approach
        const nums1 = [...nums];
        const start1 = performance.now();
        moveZerosMinSwaps(nums1);
        const time1 = performance.now() - start1;
        
        // Test overwrite approach
        const nums2 = [...nums];
        const start2 = performance.now();
        moveZerosNoSwaps(nums2);
        const time2 = performance.now() - start2;
        
        console.log(`Swap approach: ${time1.toFixed(2)}ms`);
        console.log(`Overwrite approach: ${time2.toFixed(2)}ms`);
    });
}

// ========== KEY INSIGHTS AND PATTERNS ==========

/**
 * PATTERN RECOGNITION GUIDE:
 * 
 * 1. TWO-POINTER TECHNIQUE:
 *    - Use when you need to partition/rearrange array elements
 *    - One pointer tracks "write position", other scans the array
 *    - Maintains relative order of elements
 * 
 * 2. SWAP vs OVERWRITE:
 *    - Swap: Preserves all original values, minimal writes
 *    - Overwrite: May require two passes, but can be more cache-friendly
 * 
 * 3. WHEN TO USE EACH APPROACH:
 *    - Swap: When you need to minimize the number of array modifications
 *    - Overwrite: When you want to minimize conditional logic in the loop
 * 
 * 4. COMPLEXITY ANALYSIS:
 *    - Time: O(n) for all approaches - single pass through array
 *    - Space: O(1) for in-place modifications
 *    - Writes: Swap approach minimizes writes, overwrite may do more
 * 
 * 5. EDGE CASES TO ALWAYS TEST:
 *    - Empty array
 *    - Single element (target and non-target)
 *    - All elements are target
 *    - No target elements
 *    - Target elements at beginning/end/scattered
 */

export {
    moveNegativesToEnd,
    moveNegativesToEndSwap,
    moveEvensToFront,
    moveValueToEnd,
    moveZerosMinSwaps,
    moveZerosNoSwaps,
    moveMultipleValues,
    partitionByCondition,
    moveZerosNewArray,
    moveSpacesToEnd,
    moveVowelsToFront,
    testEdgeCases,
    comparePerformance
};
