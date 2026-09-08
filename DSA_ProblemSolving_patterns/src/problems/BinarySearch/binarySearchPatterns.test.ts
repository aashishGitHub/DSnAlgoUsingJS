import {
    describe,
    test,
    expect } from "vitest";
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
    isPerfectSquare,
    lowerBound,
    upperBound,
    countOccurrences
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
            // LeetCode 74 requires ROW-MAJOR sorted: first int of each row >
            // last int of the previous row (so the matrix flattens to one
            // sorted array). The previous test matrix was column-sorted
            // (LeetCode 240) data, which violates this precondition — that was
            // a wrong test, not a bug in the (correct) binary-search impl.
            const matrix = [
                [1, 3, 5, 7],
                [10, 11, 16, 20],
                [23, 30, 34, 60]
            ];
            expect(searchMatrix(matrix, 5)).toBe(true);
            expect(searchMatrix(matrix, 3)).toBe(true);
            expect(searchMatrix(matrix, 13)).toBe(false);
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

describe('lowerBound / upperBound / countOccurrences (the half-open templates)', () => {
    const nums = [1, 3, 3, 3, 5, 8];

    test('lowerBound finds the first value >= target', () => {
        expect(lowerBound(nums, 3)).toBe(1);
        expect(lowerBound(nums, 1)).toBe(0);
        expect(lowerBound(nums, 8)).toBe(5);
        expect(lowerBound(nums, 0)).toBe(0);
    });

    test('upperBound finds the first value > target', () => {
        expect(upperBound(nums, 3)).toBe(4);
        expect(upperBound(nums, 1)).toBe(1);
        expect(upperBound(nums, 8)).toBe(6);
        expect(upperBound(nums, 0)).toBe(0);
    });

    test('an absent target makes both bounds equal — the membership test', () => {
        expect(lowerBound([1, 3, 5], 4)).toBe(2);
        expect(upperBound([1, 3, 5], 4)).toBe(2);
        expect(lowerBound([1, 3, 5], 4)).toBe(upperBound([1, 3, 5], 4));
    });

    test('a target past the end returns the length, never -1', () => {
        expect(lowerBound([1, 2, 3], 99)).toBe(3);
        expect(upperBound([1, 2, 3], 99)).toBe(3);
    });

    test('empty array', () => {
        expect(lowerBound([], 1)).toBe(0);
        expect(upperBound([], 1)).toBe(0);
        expect(countOccurrences([], 1)).toBe(0);
    });

    test('countOccurrences is the distance between the bounds', () => {
        expect(countOccurrences(nums, 3)).toBe(3);
        expect(countOccurrences(nums, 1)).toBe(1);
        expect(countOccurrences(nums, 4)).toBe(0);
        expect(countOccurrences([7, 7, 7, 7], 7)).toBe(4);
    });

    test('lowerBound IS searchInsert on DISTINCT input (LC35\'s constraint)', () => {
        const distinct = [1, 3, 5, 6];
        for (const t of [0, 1, 2, 3, 4, 5, 6, 7]) {
            expect(lowerBound(distinct, t)).toBe(searchInsert(distinct, t));
        }
    });

    test('with DUPLICATES the two deliberately differ', () => {
        // LC35 guarantees distinct values, so this case never arises there.
        // searchInsert uses the exact-match template and returns whichever
        // duplicate `mid` happens to land on; lowerBound always returns the
        // FIRST. When you need the first occurrence, reach for lowerBound.
        expect(searchInsert(nums, 3)).toBe(2); // some index holding 3
        expect(lowerBound(nums, 3)).toBe(1);   // the FIRST index holding 3
        expect(nums[searchInsert(nums, 3)]).toBe(3); // both are valid "found"
    });

    test('agrees with a brute-force linear scan on random arrays', () => {
        const bruteLower = (a: number[], t: number) => {
            const i = a.findIndex(v => v >= t);
            return i === -1 ? a.length : i;
        };
        const bruteUpper = (a: number[], t: number) => {
            const i = a.findIndex(v => v > t);
            return i === -1 ? a.length : i;
        };

        for (let trial = 0; trial < 200; trial++) {
            const len = Math.floor(Math.random() * 12);
            const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 10))
                .sort((a, b) => a - b);
            const target = Math.floor(Math.random() * 12) - 1;
            expect(lowerBound(arr, target)).toBe(bruteLower(arr, target));
            expect(upperBound(arr, target)).toBe(bruteUpper(arr, target));
            expect(countOccurrences(arr, target))
                .toBe(arr.filter(v => v === target).length);
        }
    });
});
