import {
    maxSumSubarrayOfSizeK,
    firstNegativeInWindow,
    countAnagrams,
    maxOfAllSubarrays,
    averageOfAllSubarrays,
    findAnagrams
} from './fixedSizeSlidingWindow';

describe('Fixed Size Sliding Window Problems', () => {
    describe('maxSumSubarrayOfSizeK', () => {
        test('should return maximum sum of subarray of size k', () => {
            expect(maxSumSubarrayOfSizeK([2, 1, 5, 1, 3, 2], 3)).toBe(9);
            expect(maxSumSubarrayOfSizeK([2, 3, 4, 1, 5], 2)).toBe(7);
            expect(maxSumSubarrayOfSizeK([1, 2, 3, 4, 5], 3)).toBe(12);
            expect(maxSumSubarrayOfSizeK([1, 2], 3)).toBe(-1);
        });
    });

    describe('firstNegativeInWindow', () => {
        test('should return first negative number in each window', () => {
            expect(firstNegativeInWindow([12, -1, -7, 8, -15, 30, 16, 28], 3))
                .toEqual([-1, -1, -7, -15, -15, 0]);
            expect(firstNegativeInWindow([-8, 2, 3, -6, 10], 2))
                .toEqual([-8, 0, -6, -6]);
        });
    });

    describe('countAnagrams', () => {
        test('should count anagrams of pattern in text', () => {
            expect(countAnagrams('forxxorfxdofr', 'for')).toBe(3);
            expect(countAnagrams('aabaabaa', 'aaba')).toBe(4);
            expect(countAnagrams('abab', 'ab')).toBe(3);
            expect(countAnagrams('abc', 'def')).toBe(0);
        });
    });

    describe('maxOfAllSubarrays', () => {
        test('should return maximum of all subarrays of size k', () => {
            expect(maxOfAllSubarrays([1, 3, -1, -3, 5, 3, 6, 7], 3))
                .toEqual([3, 3, 5, 5, 6, 7]);
            expect(maxOfAllSubarrays([1, 2, 3, 1, 4, 5, 2, 3, 6], 3))
                .toEqual([3, 3, 4, 5, 5, 5, 6]);
        });
    });

    describe('averageOfAllSubarrays', () => {
        test('should return average of all subarrays of size k', () => {
            expect(averageOfAllSubarrays([1, 3, 2, 6, -1, 4, 1, 8, 2], 5))
                .toEqual([2.2, 2.8, 2.4, 3.6, 2.8]);
            expect(averageOfAllSubarrays([1, 2, 3, 4, 5], 2))
                .toEqual([1.5, 2.5, 3.5, 4.5]);
        });
    });

    describe('findAnagrams', () => {
        test('should find all anagram start indices', () => {
            expect(findAnagrams('cbaebabacd', 'abc')).toEqual([0, 6]);
            expect(findAnagrams('abab', 'ab')).toEqual([0, 1, 2]);
            expect(findAnagrams('baa', 'aa')).toEqual([1]);
        });
    });
});
