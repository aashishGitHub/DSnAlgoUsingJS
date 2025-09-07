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
function moveZeroes(nums: number[]): void {
  for (let firstZero = 0, i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      [nums[firstZero], nums[i]] = [nums[i], nums[firstZero]];
      firstZero++;
    }
  }
}

// implementation 2
function moveZeroes1(nums: number[]): void {
  let insertPos = 0; // Position to insert the next non-zero element
  for (let num of nums) {
    if (num !== 0) {
      nums[insertPos++] = num; // Place non-zero at insertPos and increment insertPos
    }
  }
  // Fill the rest of the array with zeros
  while (insertPos < nums.length) {
    nums[insertPos++] = 0;
  }
}

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
