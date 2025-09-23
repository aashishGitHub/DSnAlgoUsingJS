/**
 * Binary Search Pattern Problems
 * 
 * Pattern: Use binary search for O(log n) search in sorted arrays
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */

/**
 * 1. Binary Search (LeetCode 704)
 * Given an array of integers nums which is sorted in ascending order, and an integer target,
 * write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.
 */
export function binarySearch(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

/**
 * 2. Search Insert Position (LeetCode 35)
 * Given a sorted array of distinct integers and a target value, return the index if the target is found.
 * If not, return the index where it would be if it were inserted in order.
 */
export function searchInsert(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
}

/**
 * 3. Find First and Last Position of Element in Sorted Array (LeetCode 34)
 * Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.
 */
export function searchRange(nums: number[], target: number): number[] {
    const first = findFirst(nums, target);
    if (first === -1) return [-1, -1];
    
    const last = findLast(nums, target);
    return [first, last];
}

function findFirst(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            result = mid;
            right = mid - 1; // Continue searching left
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

function findLast(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            result = mid;
            left = mid + 1; // Continue searching right
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

/**
 * 4. Search in Rotated Sorted Array (LeetCode 33)
 * There is an integer array nums sorted in ascending order (with distinct values).
 * Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.
 */
export function search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // Check which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

/**
 * 5. Find Minimum in Rotated Sorted Array (LeetCode 153)
 * Given the sorted rotated array nums of unique elements, return the minimum element of this array.
 */
export function findMin(nums: number[]): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[right]) {
            // Minimum is in right half
            left = mid + 1;
        } else {
            // Minimum is in left half (including mid)
            right = mid;
        }
    }
    
    return nums[left];
}

/**
 * 6. Find Peak Element (LeetCode 162)
 * A peak element is an element that is strictly greater than its neighbors.
 * Given a 0-indexed integer array nums, find a peak element, and return its index.
 */
export function findPeakElement(nums: number[]): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[mid + 1]) {
            // Peak is in left half (including mid)
            right = mid;
        } else {
            // Peak is in right half
            left = mid + 1;
        }
    }
    
    return left;
}

/**
 * 7. Search a 2D Matrix (LeetCode 74)
 * Write an efficient algorithm that searches for a value target in an m x n integer matrix.
 * This matrix has the following properties:
 * - Integers in each row are sorted from left to right.
 * - The first integer of each row is greater than the last integer of the previous row.
 */
export function searchMatrix(matrix: number[][], target: number): boolean {
    const m = matrix.length;
    const n = matrix[0].length;
    
    let left = 0;
    let right = m * n - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const row = Math.floor(mid / n);
        const col = mid % n;
        
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

/**
 * 8. Koko Eating Bananas (LeetCode 875)
 * Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas.
 * The guards have gone and will come back in h hours.
 * Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile.
 * Return the minimum integer k such that she can eat all the bananas within h hours.
 */
export function minEatingSpeed(piles: number[], h: number): number {
    let left = 1;
    let right = Math.max(...piles);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canEatAll(piles, mid, h)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}

function canEatAll(piles: number[], speed: number, hours: number): boolean {
    let totalHours = 0;
    
    for (const pile of piles) {
        totalHours += Math.ceil(pile / speed);
    }
    
    return totalHours <= hours;
}

/**
 * 9. Find the Duplicate Number (LeetCode 287) - Binary Search Approach
 * Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.
 * There is only one repeated number in nums, return this repeated number.
 */
export function findDuplicateBinarySearch(nums: number[]): number {
    let left = 1;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        let count = 0;
        
        // Count numbers <= mid
        for (const num of nums) {
            if (num <= mid) {
                count++;
            }
        }
        
        if (count > mid) {
            // Duplicate is in [1, mid]
            right = mid;
        } else {
            // Duplicate is in [mid + 1, n]
            left = mid + 1;
        }
    }
    
    return left;
}

/**
 * 10. Median of Two Sorted Arrays (LeetCode 4)
 * Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
 */
export function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    const totalLength = nums1.length + nums2.length;
    const isEven = totalLength % 2 === 0;
    
    if (isEven) {
        const leftMedian = findKth(nums1, nums2, Math.floor(totalLength / 2));
        const rightMedian = findKth(nums1, nums2, Math.floor(totalLength / 2) + 1);
        return (leftMedian + rightMedian) / 2;
    } else {
        return findKth(nums1, nums2, Math.floor(totalLength / 2) + 1);
    }
}

function findKth(nums1: number[], nums2: number[], k: number): number {
    let left1 = 0;
    let left2 = 0;
    
    while (k > 1) {
        const halfK = Math.floor(k / 2);
        const mid1 = Math.min(left1 + halfK - 1, nums1.length - 1);
        const mid2 = Math.min(left2 + halfK - 1, nums2.length - 1);
        
        if (nums1[mid1] <= nums2[mid2]) {
            k -= (mid1 - left1 + 1);
            left1 = mid1 + 1;
        } else {
            k -= (mid2 - left2 + 1);
            left2 = mid2 + 1;
        }
    }
    
    if (left1 >= nums1.length) return nums2[left2];
    if (left2 >= nums2.length) return nums1[left1];
    
    return Math.min(nums1[left1], nums2[left2]);
}

/**
 * 11. Sqrt(x) (LeetCode 69)
 * Given a non-negative integer x, return the square root of x rounded down to the nearest integer.
 */
export function mySqrt(x: number): number {
    if (x < 2) return x;
    
    let left = 2;
    let right = Math.floor(x / 2);
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === x) {
            return mid;
        } else if (square < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right;
}

/**
 * 12. Valid Perfect Square (LeetCode 367)
 * Given a positive integer num, write a function which returns True if num is a perfect square else False.
 */
export function isPerfectSquare(num: number): boolean {
    if (num < 1) return false;
    
    let left = 1;
    let right = num;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const square = mid * mid;
        
        if (square === num) {
            return true;
        } else if (square < num) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}
