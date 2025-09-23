import {
    lengthOfLongestSubstring,
    longestSubstringWithKDistinct,
    longestSubstringWithTwoDistinct,
    minWindow,
    longestSubarrayWithSumLessThanK,
    longestSubarrayWithSumK,
    totalFruit,
    characterReplacement,
    numSubarrayProductLessThanK,
    maxScore
} from './variableSizeSlidingWindow';

describe('Variable Size Sliding Window Problems', () => {
    describe('lengthOfLongestSubstring', () => {
        test('should return length of longest substring without repeating characters', () => {
            expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
            expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
            expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
            expect(lengthOfLongestSubstring('')).toBe(0);
        });
    });

    describe('longestSubstringWithKDistinct', () => {
        test('should return length of longest substring with k distinct characters', () => {
            expect(longestSubstringWithKDistinct('araaci', 2)).toBe(4);
            expect(longestSubstringWithKDistinct('araaci', 1)).toBe(2);
            expect(longestSubstringWithKDistinct('cbbebi', 3)).toBe(5);
            expect(longestSubstringWithKDistinct('abc', 0)).toBe(0);
        });
    });

    describe('longestSubstringWithTwoDistinct', () => {
        test('should return length of longest substring with two distinct characters', () => {
            expect(longestSubstringWithTwoDistinct('eceba')).toBe(3);
            expect(longestSubstringWithTwoDistinct('ccaabbb')).toBe(5);
        });
    });

    describe('minWindow', () => {
        test('should return minimum window substring', () => {
            expect(minWindow('ADOBECODEBANC', 'ABC')).toBe('BANC');
            expect(minWindow('a', 'a')).toBe('a');
            expect(minWindow('a', 'aa')).toBe('');
            expect(minWindow('ab', 'b')).toBe('b');
        });
    });

    describe('longestSubarrayWithSumLessThanK', () => {
        test('should return length of longest subarray with sum less than k', () => {
            expect(longestSubarrayWithSumLessThanK([1, 2, 3, 4, 5], 10)).toBe(4);
            expect(longestSubarrayWithSumLessThanK([1, 2, 3, 4, 5], 5)).toBe(2);
            expect(longestSubarrayWithSumLessThanK([1, 2, 3, 4, 5], 1)).toBe(1);
        });
    });

    describe('longestSubarrayWithSumK', () => {
        test('should return length of longest subarray with sum k', () => {
            expect(longestSubarrayWithSumK([1, -1, 5, -2, 3], 3)).toBe(4);
            expect(longestSubarrayWithSumK([2, 0, 0, 3], 3)).toBe(3);
            expect(longestSubarrayWithSumK([1, 2, 3, 4, 5], 9)).toBe(2);
        });
    });

    describe('totalFruit', () => {
        test('should return maximum fruits that can be collected', () => {
            expect(totalFruit([1, 2, 1, 2, 3])).toBe(4);
            expect(totalFruit([0, 1, 2, 2])).toBe(3);
            expect(totalFruit([1, 2, 3, 2, 2])).toBe(4);
            expect(totalFruit([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4])).toBe(5);
        });
    });

    describe('characterReplacement', () => {
        test('should return length of longest substring after k replacements', () => {
            expect(characterReplacement('ABAB', 2)).toBe(4);
            expect(characterReplacement('AABABBA', 1)).toBe(4);
            expect(characterReplacement('AAAA', 0)).toBe(4);
        });
    });

    describe('numSubarrayProductLessThanK', () => {
        test('should return number of subarrays with product less than k', () => {
            expect(numSubarrayProductLessThanK([10, 5, 2, 6], 100)).toBe(8);
            expect(numSubarrayProductLessThanK([1, 2, 3], 0)).toBe(0);
            expect(numSubarrayProductLessThanK([1, 1, 1], 1)).toBe(0);
        });
    });

    describe('maxScore', () => {
        test('should return maximum score from k cards', () => {
            expect(maxScore([1, 2, 3, 4, 5, 6, 1], 3)).toBe(12);
            expect(maxScore([2, 2, 2], 2)).toBe(4);
            expect(maxScore([9, 7, 7, 7, 5, 2, 2, 2, 2, 2], 2)).toBe(16);
        });
    });
});
