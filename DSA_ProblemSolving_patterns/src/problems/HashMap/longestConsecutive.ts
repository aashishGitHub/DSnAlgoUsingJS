// Longest Consecutive Sequence (LeetCode 128)
// Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.
// You must write an algorithm that runs in O(n) time.

// Example 1:
// Input: nums = [100,4,200,1,3,2]
// Output: 4
// Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.

// Example 2:
// Input: nums = [0,3,7,2,5,8,4,6,0,1]
// Output: 9

/**
 * HASH SET PATTERN - Optimal Solution
 * 
 * Pattern: Use Hash Set for O(1) lookups to avoid nested loops
 * Time: O(n) - each number is visited at most twice
 * Space: O(n) for the hash set
 * 
 * Key insight: Only start counting from the beginning of a sequence
 * This avoids redundant work and ensures O(n) time complexity
 */
function longestConsecutive1(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (const num of numSet) {
      // Only start counting if this is the beginning of a sequence
      // i.e., num-1 is not in the set.
      if (!numSet.has(num - 1)) {
        let currentNum = num;
        let currentLength = 1;

        // Count consecutive numbers
        while (numSet.has(currentNum + 1)) {
          currentNum++;
          currentLength++;
        }

        maxLength = Math.max(maxLength, currentLength);
      }
    }
    
    return maxLength;
}

/**
 * HASH MAP PATTERN - Union-Find approach
 * Time: O(n)
 * Space: O(n)
 * 
 * This approach treats consecutive numbers as components that need to be merged
 * Uses HashMap to track sequence lengths and merge adjacent sequences
 */
function longestConsecutive2(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    const map = new Map<number, number>(); // number -> length of sequence it belongs to
    let maxLength = 0;
    
    for (const num of nums) {
        if (map.has(num)) continue; // Skip duplicates
        
        // Check if neighbors exist
        const leftLength = map.get(num - 1) || 0;
        const rightLength = map.get(num + 1) || 0;
        
        // Current sequence length
        const currentLength = leftLength + rightLength + 1;
        
        // Update the map
        map.set(num, currentLength);
        
        // Update the boundary elements of the merged sequence
        if (leftLength > 0) {
            map.set(num - leftLength, currentLength);
        }
        if (rightLength > 0) {
            map.set(num + rightLength, currentLength);
        }
        
        maxLength = Math.max(maxLength, currentLength);
    }
    
    return maxLength;
}

/**
 * HASH MAP PATTERN - Boundary tracking approach
 * Time: O(n)
 * Space: O(n)
 * 
 * Uses HashMap to track sequence boundaries and merge adjacent sequences
 */
function longestConsecutive3(nums: number[]): number {
    const boundaries = new Map<number, number>(); // Maps sequence boundary to sequence length
    let maxLength = 0;
    
    for (const num of nums) {
        if (boundaries.has(num)) continue; // Skip duplicates
        
        // Check for adjacent sequences
        const leftBoundary = boundaries.get(num - 1) || 0;
        const rightBoundary = boundaries.get(num + 1) || 0;
        
        const newLength = leftBoundary + rightBoundary + 1;
        
        // Update boundaries
        boundaries.set(num - leftBoundary, newLength);
        boundaries.set(num + rightBoundary, newLength);
        boundaries.set(num, newLength);
        
        maxLength = Math.max(maxLength, newLength);
    }
    
    return maxLength;
}

/**
 * SORTING APPROACH - Not optimal but educational
 * Time: O(n log n) - due to sorting
 * Space: O(1) if we ignore sorting space
 * 
 * This approach shows why Hash Set is better for this problem
 */
function longestConsecutive4(nums: number[]): number {
    if (nums.length === 0) return 0;
    
    // Remove duplicates and sort
    const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
    
    let maxLength = 1;
    let currentLength = 1;
    
    for (let i = 1; i < uniqueNums.length; i++) {
        if (uniqueNums[i] === uniqueNums[i - 1] + 1) {
            // Consecutive number found
            currentLength++;
        } else {
            // Sequence broken, update max and reset current
            maxLength = Math.max(maxLength, currentLength);
            currentLength = 1;
        }
    }
    
    // Don't forget to check the last sequence
    return Math.max(maxLength, currentLength);
}

// Test cases
function runTests(): void {
    const testCases = [
        [100, 4, 200, 1, 3, 2],           // Expected: 4 ([1,2,3,4])
        [0, 3, 7, 2, 5, 8, 4, 6, 0, 1],   // Expected: 9 ([0,1,2,3,4,5,6,7,8])
        [],                                // Expected: 0
        [1],                               // Expected: 1
        [1, 2, 0, 1],                      // Expected: 3 ([0,1,2])
        [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6] // Expected: 7 ([-1,0,1,3,4,5,6,7,8,9])
    ];
    
    console.log('Testing Longest Consecutive Sequence:\n');
    
    testCases.forEach((nums, index) => {
        console.log(`Test case ${index + 1}: [${nums}]`);
        console.log('Hash Set approach:', longestConsecutive1(nums));
        console.log('Hash Map Union-Find:', longestConsecutive2(nums));
        console.log('Hash Map Boundaries:', longestConsecutive3(nums));
        console.log('Sort approach:', longestConsecutive4(nums));
        console.log('---');
    });
}

// Performance comparison
function performanceTest(): void {
    // Generate large test case
    const nums = Array.from({length: 10000}, () => Math.floor(Math.random() * 20000));
    
    console.log('Performance test with 10,000 numbers:');
    
    console.time('Hash Set approach');
    const result1 = longestConsecutive1(nums);
    console.timeEnd('Hash Set approach');
    
    console.time('Hash Map approach');
    const result2 = longestConsecutive2(nums);
    console.timeEnd('Hash Map approach');
    
    console.time('Sort approach');
    const result3 = longestConsecutive4(nums);
    console.timeEnd('Sort approach');
    
    console.log('Results match:', result1 === result2 && result2 === result3);
}

// HASH SET/MAP PATTERN INSIGHTS:
// 1. Hash Set allows O(1) lookups, enabling O(n) solution
// 2. Key optimization: only start counting from sequence beginnings
// 3. Each number is visited at most twice (once in outer loop, once in inner while)
// 4. This problem demonstrates the power of hash sets for sequence problems
// 5. Hash Map can be used for more complex sequence merging scenarios

// PATTERN RECOGNITION:
// - When you see "consecutive" and need O(n) time, think hash set/map
// - Look for opportunities to avoid unnecessary work (sequence beginnings)
// - Hash sets/maps are perfect for "membership testing" operations
// - Use Hash Set for simple lookups, Hash Map for complex state tracking

export { 
    longestConsecutive1, 
    longestConsecutive2, 
    longestConsecutive3, 
    longestConsecutive4, 
    runTests, 
    performanceTest 
};
