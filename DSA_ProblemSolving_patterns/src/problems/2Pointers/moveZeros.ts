// Given an integer array nums, move all 0's to the end of it while maintaining the
//  relative order of the non-zero elements.

// Note that you must do this in-place without making a copy of the array.
// Example 1:

// Input: nums = [0,1,0,3,12]
// Output: [1,3,12,0,0]
// Example 2:

// Input: nums = [0]
// Output: [0]

// MUST NOTE
// The core concepts involve:
// In-place array manipulation
// Maintaining relative order while moving elements
// Two-pointer technique for efficient swapping
// Partitioning elements based on a condition

/**
 * VISUAL EXAMPLE: moveZeroes([0, 1, 0, 3, 12])
 * 
 * Two-Pointer Technique:
 *   - firstZero: Points to the position where next non-zero should be placed
 *   - i: Current element being examined
 * 
 * Step-by-step execution:
 * 
 * Initial state:
 *   nums = [0, 1, 0, 3, 12]
 *   firstZero = 0, i = 0
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [0,   1,   0,   3,  12]                              │
 * │         ↑                                                   │
 * │    firstZero=0, i=0                                         │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Iteration 1: i=0, nums[0]=0
 *   Condition: nums[0] != 0? NO (it's 0)
 *   Action: Skip, no swap
 *   firstZero stays 0, i becomes 1
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [0,   1,   0,   3,  12]  (unchanged)                │
 * │         ↑    ↑                                               │
 * │    firstZero=0, i=1                                         │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Iteration 2: i=1, nums[1]=1
 *   Condition: nums[1] != 0? YES (it's 1, non-zero!)
 *   Action: Swap nums[0] and nums[1]
 *   Swap: [0, 1] → [1, 0]
 *   firstZero becomes 1, i becomes 2
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   0,   0,   3,  12]  (swapped!)                 │
 * │              ↑    ↑                                           │
 * │         firstZero=1, i=2                                     │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Iteration 3: i=2, nums[2]=0
 *   Condition: nums[2] != 0? NO (it's 0)
 *   Action: Skip, no swap
 *   firstZero stays 1, i becomes 3
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   0,   0,   3,  12]  (unchanged)                │
 * │              ↑         ↑                                     │
 * │         firstZero=1, i=3                                     │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Iteration 4: i=3, nums[3]=3
 *   Condition: nums[3] != 0? YES (it's 3, non-zero!)
 *   Action: Swap nums[1] and nums[3]
 *   Swap: [0, 3] → [3, 0]
 *   firstZero becomes 2, i becomes 4
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   3,   0,   0,  12]  (swapped!)                 │
 * │                   ↑         ↑                               │
 * │              firstZero=2, i=4                                │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Iteration 5: i=4, nums[4]=12
 *   Condition: nums[4] != 0? YES (it's 12, non-zero!)
 *   Action: Swap nums[2] and nums[4]
 *   Swap: [0, 12] → [12, 0]
 *   firstZero becomes 3, i becomes 5 (loop ends)
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Index:  0    1    2    3    4                               │
 * │ Array: [1,   3,  12,   0,   0]  (swapped!)                 │
 * │                        ↑                                     │
 * │                   firstZero=3                                │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Final Result: [1, 3, 12, 0, 0] ✅
 * 
 * KEY INSIGHTS:
 * 1. firstZero always points to the first zero (or position for next non-zero)
 * 2. When we find a non-zero, we swap it with the element at firstZero
 * 3. This pushes zeros to the right while maintaining order of non-zeros
 * 4. After swap, firstZero moves forward (now points to next zero or end)
 * 
 * VISUALIZATION OF POINTER MOVEMENT:
 * 
 *   i=0:  [0, 1, 0, 3, 12]  firstZero=0 (points to 0)
 *         ↑
 *   i=1:  [0, 1, 0, 3, 12]  firstZero=0 → swap → [1, 0, 0, 3, 12]
 *            ↑                                    ↑
 *   i=2:  [1, 0, 0, 3, 12]  firstZero=1 (points to 0)
 *               ↑
 *   i=3:  [1, 0, 0, 3, 12]  firstZero=1 → swap → [1, 3, 0, 0, 12]
 *                  ↑                                    ↑
 *   i=4:  [1, 3, 0, 0, 12]  firstZero=2 → swap → [1, 3, 12, 0, 0]
 *                     ↑                                    ↑
 * 
 * 
 * TIME COMPLEXITY: O(n) - single pass through array
 * SPACE COMPLEXITY: O(1) - only using two pointers
 */

function moveZeroes(nums: number[]): void {
  for (let firstZero = 0, i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      [nums[firstZero], nums[i]] = [nums[i], nums[firstZero]];
      firstZero++;
    }
  }
} 

// or same as above but keep the tracker separate
function moveZeroes2(nums: number[]): void {
  let zeroTracker = 0; // Pointer for the last non-zero found position
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      // Swap elements
      [nums[zeroTracker], nums[i]] = [nums[i], nums[zeroTracker]];
      zeroTracker++;
      // If there is no zero, it will swap with itself
      // if there are one zero and many non-zero, it will swap with the first zero which in turn will be swapped with the next non-zero
      // and so on
      // This way, all non-zero elements are moved to the front and zeros to the back
      // similar to linear partitioning in quicksort
    }
  }
}


