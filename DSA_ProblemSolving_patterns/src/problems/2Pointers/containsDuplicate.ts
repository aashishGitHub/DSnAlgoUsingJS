// check if an array contains duplicate elements

// It can be solved by using a hashMap, which will be set if the item being iterared is not already present in the map, 
// and if the item is already present in the map it means it us a duplicate item, so just return true



// Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.

// Consider the number of unique elements of nums to be k, to get accepted, you need to do the following things:

// Change the array nums such that the first k elements of nums contain the unique elements in the order they were present in nums initially. The remaining elements of nums are not important as well as the size of nums.
// Return k.
// Custom Judge:

// The judge will test your solution with the following code:

// int[] nums = [...]; // Input array
// int[] expectedNums = [...]; // The expected answer with correct length

// int k = removeDuplicates(nums); // Calls your implementation

// assert k == expectedNums.length;
// for (int i = 0; i < k; i++) {
//     assert nums[i] == expectedNums[i];
// }
// If all assertions pass, then your solution will be accepted.

 

// Example 1:

// Input: nums = [1,1,2]
// Output: 2, nums = [1,2,_]
// Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
// It does not matter what you leave beyond the returned k (hence they are underscores).
// Example 2:

// Input: nums = [0,0,1,1,1,2,2,3,3,4]
// Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
// Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
// It does not matter what you leave beyond the returned k (hence they are underscores).
 




function removeDuplicates(nums: number[]): number[] {
    return nums.filter((num, index, self) => self.indexOf(num) === index);
  }
  
  function removeDuplicatesSortedArray(nums: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < nums.length; i++) {
      // Taking advantage of the sorted array
      if (nums[i] !== nums[i + 1]) {
        result.push(nums[i]);
      }
    }
    return result;
  }
  
  // LeetCode: Remove Duplicates from Sorted Array - Correct Solution
  function removeDuplicatesUnsortedArrayInplace(nums: number[]): number {
    if (nums.length === 0) return 0;
  
    let left = 0; // slow pointer for unique elements position
  
    for (let i = 1; i < nums.length; i++) {
      // fast pointer
      if (nums[left] !== nums[i]) {
        left++;
        nums[left] = nums[i];
      }
    }
  
    return left + 1; // return the length of unique elements
  }
  