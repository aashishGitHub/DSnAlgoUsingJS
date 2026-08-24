import { describe, it, expect } from "vitest";
import {
  removeDuplicatesBruteForce,
  removeDuplicatesCompareAdjacent,
  removeDuplicatesInPlace,
} from "./removeDuplicatesFromSortedArray";

describe("Remove Duplicates from Sorted Array (LeetCode 26)", () => {
  describe("removeDuplicatesBruteForce", () => {
    it("dedupes a sorted array", () => {
      expect(removeDuplicatesBruteForce([1, 1, 2])).toEqual([1, 2]);
    });

    it("handles an array with no duplicates", () => {
      expect(removeDuplicatesBruteForce([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("handles an empty array", () => {
      expect(removeDuplicatesBruteForce([])).toEqual([]);
    });
  });

  describe("removeDuplicatesCompareAdjacent", () => {
    it("dedupes a sorted array using adjacency", () => {
      expect(removeDuplicatesCompareAdjacent([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])).toEqual([
        0, 1, 2, 3, 4,
      ]);
    });

    it("handles an empty array", () => {
      expect(removeDuplicatesCompareAdjacent([])).toEqual([]);
    });

    it("handles a single element", () => {
      expect(removeDuplicatesCompareAdjacent([5])).toEqual([5]);
    });
  });

  describe("removeDuplicatesInPlace (matches the exact LeetCode contract)", () => {
    it("LeetCode Example 1", () => {
      const nums = [1, 1, 2];
      const k = removeDuplicatesInPlace(nums);
      expect(k).toBe(2);
      expect(nums.slice(0, k)).toEqual([1, 2]);
    });

    it("LeetCode Example 2", () => {
      const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
      const k = removeDuplicatesInPlace(nums);
      expect(k).toBe(5);
      expect(nums.slice(0, k)).toEqual([0, 1, 2, 3, 4]);
    });

    it("returns 0 for an empty array", () => {
      expect(removeDuplicatesInPlace([])).toBe(0);
    });

    it("handles an array with no duplicates", () => {
      const nums = [1, 2, 3];
      const k = removeDuplicatesInPlace(nums);
      expect(k).toBe(3);
      expect(nums.slice(0, k)).toEqual([1, 2, 3]);
    });

    it("handles an array that is all duplicates", () => {
      const nums = [7, 7, 7, 7];
      const k = removeDuplicatesInPlace(nums);
      expect(k).toBe(1);
      expect(nums.slice(0, k)).toEqual([7]);
    });
  });

  it("all three approaches agree on the unique-values result across inputs", () => {
    const cases = [
      [1, 1, 2],
      [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
      [1, 2, 3],
      [7, 7, 7, 7],
    ];

    for (const nums of cases) {
      const brute = removeDuplicatesBruteForce([...nums]);
      const adjacent = removeDuplicatesCompareAdjacent([...nums]);
      const inPlaceCopy = [...nums];
      const k = removeDuplicatesInPlace(inPlaceCopy);

      expect(brute).toEqual(adjacent);
      expect(inPlaceCopy.slice(0, k)).toEqual(adjacent);
    }
  });
});
