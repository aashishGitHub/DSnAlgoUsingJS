import {
    binarySearch,
    searchInsert,
    searchRange,
    search,
    findMin,
    findPeakElement,
    searchMatrix,
    minEatingSpeed,
    findDuplicateBinarySearch,
    findMedianSortedArrays,
    mySqrt,
    isPerfectSquare
} from './binarySearchPatterns';

describe('Binary Search Pattern Problems', () => {
    describe('binarySearch', () => {
        test('should return index of target element', () => {
            expect(binarySearch([-1, 0, 3, 5, 9, 12], 9)).toBe(4);
            expect(binarySearch([-1, 0, 3, 5, 9, 12], 2)).toBe(-1);
            expect(binarySearch([5], 5)).toBe(0);
        });
    });

    describe('searchInsert', () => {
        test('should return insertion position', () => {
            expect(searchInsert([1, 3, 5, 6], 5)).toBe(2);
            expect(searchInsert([1, 3, 5, 6], 2)).toBe(1);
            expect(searchInsert([1, 3, 5, 6], 7)).toBe(4);
        });
    });

    describe('searchRange', () => {
        test('should return first and last position of target', () => {
            expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4]);
            expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toEqual([-1, -1]);
            expect(searchRange([], 0)).toEqual([-1, -1]);
        });
    });

    describe('search (rotated array)', () => {
        test('should find target in rotated sorted array', () => {
            expect(search([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
            expect(search([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1);
            expect(search([1], 0)).toBe(-1);
        });
    });

    describe('findMin', () => {
        test('should find minimum in rotated sorted array', () => {
            expect(findMin([3, 4, 5, 1, 2])).toBe(1);
            expect(findMin([4, 5, 6, 7, 0, 1, 2])).toBe(0);
            expect(findMin([11, 13, 15, 17])).toBe(11);
        });
    });

    describe('findPeakElement', () => {
        test('should find peak element', () => {
            expect([1, 2, 3, 1]).toContain(findPeakElement([1, 2, 3, 1]));
            expect([1, 2, 1, 3, 5, 6, 4]).toContain(findPeakElement([1, 2, 1, 3, 5, 6, 4]));
        });
    });

    describe('searchMatrix', () => {
        test('should search in 2D matrix', () => {
            const matrix = [
                [1, 4, 7, 11],
                [2, 5, 8, 12],
                [3, 6, 9, 16],
                [10, 13, 14, 17]
            ];
            expect(searchMatrix(matrix, 5)).toBe(true);
            expect(searchMatrix(matrix, 3)).toBe(true);
            expect(searchMatrix(matrix, 20)).toBe(false);
        });
    });

    describe('minEatingSpeed', () => {
        test('should find minimum eating speed', () => {
            expect(minEatingSpeed([3, 6, 7, 11], 8)).toBe(4);
            expect(minEatingSpeed([30, 11, 23, 4, 20], 5)).toBe(30);
            expect(minEatingSpeed([30, 11, 23, 4, 20], 6)).toBe(23);
        });
    });

    describe('findDuplicateBinarySearch', () => {
        test('should find duplicate number using binary search', () => {
            expect(findDuplicateBinarySearch([1, 3, 4, 2, 2])).toBe(2);
            expect(findDuplicateBinarySearch([3, 1, 3, 4, 2])).toBe(3);
            expect(findDuplicateBinarySearch([1, 1])).toBe(1);
        });
    });

    describe('findMedianSortedArrays', () => {
        test('should find median of two sorted arrays', () => {
            expect(findMedianSortedArrays([1, 3], [2])).toBe(2);
            expect(findMedianSortedArrays([1, 2], [3, 4])).toBe(2.5);
            expect(findMedianSortedArrays([0, 0], [0, 0])).toBe(0);
        });
    });

    describe('mySqrt', () => {
        test('should return square root rounded down', () => {
            expect(mySqrt(4)).toBe(2);
            expect(mySqrt(8)).toBe(2);
            expect(mySqrt(0)).toBe(0);
            expect(mySqrt(1)).toBe(1);
        });
    });

    describe('isPerfectSquare', () => {
        test('should check if number is perfect square', () => {
            expect(isPerfectSquare(16)).toBe(true);
            expect(isPerfectSquare(14)).toBe(false);
            expect(isPerfectSquare(1)).toBe(true);
            expect(isPerfectSquare(0)).toBe(false);
        });
    });
});
