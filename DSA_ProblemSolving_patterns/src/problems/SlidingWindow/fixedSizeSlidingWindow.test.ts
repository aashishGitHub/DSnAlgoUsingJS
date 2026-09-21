import {
    describe,
    it,
    test,
    expect } from "vitest";
import {
  maxSumSubarrayOfSizeKBruteForce,
    maxSumSubarrayOfSizeK,
    firstNegativeInWindow,
    countAnagrams,
    maxOfAllSubarrays,
    averageOfAllSubarrays,
    findAnagrams,
    checkInclusion
} from './fixedSizeSlidingWindow';

describe("Fixed-Size Sliding Window", () => {
  describe("maxSumSubarrayOfSizeK (brute force vs. sliding window)", () => {
    it("finds the max window sum", () => {
      expect(maxSumSubarrayOfSizeK([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)).toBe(19);
      expect(maxSumSubarrayOfSizeK([2, 1, 5, 1, 3, 2], 3)).toBe(9);
    });

    it("returns -1 when k exceeds array length", () => {
      expect(maxSumSubarrayOfSizeK([1, 2], 3)).toBe(-1);
    });

    it("brute force agrees with the sliding-window version", () => {
      const cases: Array<[number[], number]> = [
        [[2, 6, 9, 2, 1, 8, 5, 6, 3], 3],
        [[2, 1, 5, 1, 3, 2], 3],
        [[1, 1, 1, 1], 2],
        [[5, 4, 3, 2, 1], 1],
      ];
      for (const [arr, k] of cases) {
        expect(maxSumSubarrayOfSizeKBruteForce(arr, k)).toBe(maxSumSubarrayOfSizeK(arr, k));
      }
    });
  });

  describe("firstNegativeInWindow", () => {
    it("returns the first negative of each window (0 if none)", () => {
      expect(firstNegativeInWindow([12, -1, -7, 8, -15, 30, 16, 28], 3)).toEqual([
        -1, -1, -7, -15, -15, 0,
      ]);
    });
  });

  describe("countAnagrams", () => {
    it("counts anagram occurrences of the pattern", () => {
      expect(countAnagrams("forxxorfxdofr", "for")).toBe(3);
      expect(countAnagrams("aabaabaa", "aaba")).toBe(4);
    });

    it("returns 0 when the pattern is longer than the text", () => {
      expect(countAnagrams("ab", "abc")).toBe(0);
    });
  });

  describe("maxOfAllSubarrays (monotonic deque)", () => {
    it("returns the maximum of each window of size k", () => {
      expect(maxOfAllSubarrays([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([3, 3, 5, 5, 6, 7]);
    });
  });

  describe("averageOfAllSubarrays", () => {
    it("returns the average of each window of size k", () => {
      expect(averageOfAllSubarrays([1, 3, 2, 6, -1, 4, 1, 8, 2], 5)).toEqual([
        2.2, 2.8, 2.4, 3.6, 2.8,
      ]);
    });
  });

  describe("findAnagrams", () => {
    it("returns start indices of every anagram of p in s", () => {
      expect(findAnagrams("cbaebabacd", "abc")).toEqual([0, 6]);
      expect(findAnagrams("abab", "ab")).toEqual([0, 1, 2]);
    });
  });
});

describe('checkInclusion (LC567)', () => {
    test('finds a permutation of s1 inside s2', () => {
        expect(checkInclusion("ab", "eidbaooo")).toBe(true);
        expect(checkInclusion("adc", "dcda")).toBe(true);
        expect(checkInclusion("abc", "cba")).toBe(true);
    });

    test('rejects when no window matches', () => {
        expect(checkInclusion("ab", "eidboaoo")).toBe(false);
        expect(checkInclusion("hello", "ooolleoooleh")).toBe(false);
    });

    test('s1 longer than s2 is impossible', () => {
        expect(checkInclusion("abc", "ab")).toBe(false);
    });

    test('edge cases', () => {
        expect(checkInclusion("", "abc")).toBe(true);
        expect(checkInclusion("a", "a")).toBe(true);
        expect(checkInclusion("a", "b")).toBe(false);
    });

    test('needs the right COUNT, not just the right letters', () => {
        // s2 contains both letters but never two 'a's adjacent to a 'b'.
        expect(checkInclusion("aab", "abab")).toBe(true);  // "aba" -> a:2,b:1 ✓
        expect(checkInclusion("aab", "abba")).toBe(false); // no window has a:2,b:1
    });

    test('agrees with findAnagrams — same scan, different return type', () => {
        const pairs: [string, string][] = [
            ["ab", "eidbaooo"], ["ab", "eidboaoo"], ["abc", "cbaebabacd"],
            ["aab", "abab"], ["xyz", "abc"], ["a", "aaaa"],
        ];
        for (const [s1, s2] of pairs) {
            expect(checkInclusion(s1, s2)).toBe(findAnagrams(s2, s1).length > 0);
        }
    });
});
