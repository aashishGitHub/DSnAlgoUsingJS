import {
    maxArea,
    trap,
    threeSum,
    threeSumClosest,
    fourSum,
    removeDuplicates,
    removeElement,
    moveZeroes,
    sortColors,
    isPalindrome,
    twoSum,
    sortedSquares
} from './twoPointerSlidingWindow';

describe('Two Pointer Sliding Window Problems', () => {
    describe('maxArea', () => {
        test('should return maximum area of water container', () => {
            expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
            expect(maxArea([1, 1])).toBe(1);
            expect(maxArea([4, 3, 2, 1, 4])).toBe(16);
        });
    });

    describe('trap', () => {
        test('should return amount of trapped water', () => {
            expect(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
            expect(trap([4, 2, 0, 3, 2, 5])).toBe(9);
            expect(trap([3, 0, 2, 0, 4])).toBe(7);
        });
    });

    describe('threeSum', () => {
        test('should return all unique triplets that sum to zero', () => {
            const result = threeSum([-1, 0, 1, 2, -1, -4]);
            expect(result).toHaveLength(2);
            expect(result).toEqual(expect.arrayContaining([
                [-1, -1, 2],
                [-1, 0, 1]
            ]));
            
            expect(threeSum([0, 1, 1])).toEqual([]);
            expect(threeSum([0, 0, 0])).toEqual([[0, 0, 0]]);
        });
    });

    describe('threeSumClosest', () => {
        test('should return sum closest to target', () => {
            expect(threeSumClosest([-1, 2, 1, -4], 1)).toBe(2);
            expect(threeSumClosest([0, 0, 0], 1)).toBe(0);
            expect(threeSumClosest([1, 1, 1, 0], -100)).toBe(2);
        });
    });

    describe('fourSum', () => {
        test('should return all unique quadruplets that sum to target', () => {
            const result = fourSum([1, 0, -1, 0, -2, 2], 0);
            expect(result).toHaveLength(3);
            expect(result).toEqual(expect.arrayContaining([
                [-2, -1, 1, 2],
                [-2, 0, 0, 2],
                [-1, 0, 0, 1]
            ]));
        });
    });

    describe('removeDuplicates', () => {
        test('should remove duplicates and return new length', () => {
            const nums1 = [1, 1, 2];
            expect(removeDuplicates(nums1)).toBe(2);
            expect(nums1.slice(0, 2)).toEqual([1, 2]);
            
            const nums2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
            expect(removeDuplicates(nums2)).toBe(5);
            expect(nums2.slice(0, 5)).toEqual([0, 1, 2, 3, 4]);
        });
    });

    describe('removeElement', () => {
        test('should remove all instances of val and return new length', () => {
            const nums1 = [3, 2, 2, 3];
            expect(removeElement(nums1, 3)).toBe(2);
            expect(nums1.slice(0, 2)).toEqual([2, 2]);
            
            const nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
            expect(removeElement(nums2, 2)).toBe(5);
            expect(nums2.slice(0, 5)).toEqual([0, 1, 3, 0, 4]);
        });
    });

    describe('moveZeroes', () => {
        test('should move all zeros to the end', () => {
            const nums1 = [0, 1, 0, 3, 12];
            moveZeroes(nums1);
            expect(nums1).toEqual([1, 3, 12, 0, 0]);
            
            const nums2 = [0];
            moveZeroes(nums2);
            expect(nums2).toEqual([0]);
        });
    });

    describe('sortColors', () => {
        test('should sort colors in-place', () => {
            const nums1 = [2, 0, 2, 1, 1, 0];
            sortColors(nums1);
            expect(nums1).toEqual([0, 0, 1, 1, 2, 2]);
            
            const nums2 = [2, 0, 1];
            sortColors(nums2);
            expect(nums2).toEqual([0, 1, 2]);
        });
    });

    describe('isPalindrome', () => {
        test('should check if string is palindrome', () => {
            expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
            expect(isPalindrome('race a car')).toBe(false);
            expect(isPalindrome('')).toBe(true);
            expect(isPalindrome('a')).toBe(true);
        });
    });

    describe('twoSum', () => {
        test('should return indices of two numbers that sum to target', () => {
            expect(twoSum([2, 7, 11, 15], 9)).toEqual([1, 2]);
            expect(twoSum([2, 3, 4], 6)).toEqual([1, 3]);
            expect(twoSum([-1, 0], -1)).toEqual([1, 2]);
        });
    });

    describe('sortedSquares', () => {
        test('should return squares of numbers in sorted order', () => {
            expect(sortedSquares([-4, -1, 0, 3, 10])).toEqual([0, 1, 9, 16, 100]);
            expect(sortedSquares([-7, -3, 2, 3, 11])).toEqual([4, 9, 9, 49, 121]);
            expect(sortedSquares([-5, -3, -2, -1])).toEqual([1, 4, 9, 25]);
        });
    });
});
