import { describe, it, expect } from "vitest";
import {
  same,
  maxChar,
  pairsWithTargetSum,
  countUniqueValuesSorted,
  uniqueValuesBruteForce,
  uniqueValues,
} from "./frequencyCounter";

describe("Frequency Counter Patterns", () => {
  describe("same (squared multiset match)", () => {
    it("matches when arr2 is exactly the squares of arr1 (any order)", () => {
      expect(same([1, 2, 3, 2, 5], [9, 1, 4, 4, 25])).toBe(true);
    });

    it("rejects length mismatches", () => {
      expect(same([1, 2, 3], [1, 9])).toBe(false);
    });

    it("rejects frequency mismatches (the case existence-only checks miss)", () => {
      expect(same([1, 2, 1], [4, 4, 1])).toBe(false);
    });

    it("handles empty arrays (vacuously same)", () => {
      expect(same([], [])).toBe(true);
    });
  });

  describe("maxChar", () => {
    it("finds the most frequent character, case-insensitively", () => {
      expect(maxChar("Bhubaneswar")).toBe("b");
    });

    it("returns the winner on a simple tie-free string", () => {
      expect(maxChar("abcc")).toBe("c");
    });

    it("returns null for an empty string", () => {
      expect(maxChar("")).toBeNull();
    });
  });

  describe("pairsWithTargetSum", () => {
    it("finds all pairs summing to k in one pass", () => {
      const result = pairsWithTargetSum([1, 3, 2, 6, 5, 7], 8);
      const normalized = result.map((p) => [...p].sort((a, b) => a - b).join(",")).sort();
      expect(normalized).toEqual(["1,7", "2,6", "3,5"]);
    });

    it("pairs duplicate values with earlier occurrences (multiset semantics)", () => {
      expect(pairsWithTargetSum([3, 3, 5], 6)).toEqual([[3, 3]]);
    });

    it("returns an empty list when no pair matches", () => {
      expect(pairsWithTargetSum([1, 2, 3], 100)).toEqual([]);
    });

    it("Real-world: find offsetting ledger entries netting to a target", () => {
      const result = pairsWithTargetSum([50, -20, 70, 20, -50], 0);
      const normalized = result.map((p) => [...p].sort((a, b) => a - b).join(",")).sort();
      // lexicographic string sort: "-20,20" < "-50,50" because '2' < '5'
      expect(normalized).toEqual(["-20,20", "-50,50"]);
    });
  });

  describe("countUniqueValuesSorted", () => {
    it("counts unique values in a sorted array", () => {
      expect(countUniqueValuesSorted([1, 2, 2, 5, 7, 7, 99])).toBe(5);
    });

    it("returns 0 for an empty array", () => {
      expect(countUniqueValuesSorted([])).toBe(0);
    });

    it("agrees with the Set-based count on the same data", () => {
      const data = [1, 1, 1, 2, 3, 3, 4, 9, 9];
      expect(countUniqueValuesSorted([...data])).toBe(new Set(data).size);
    });
  });

  describe("uniqueValues (brute force vs Set)", () => {
    it("dedupes while preserving first-seen order", () => {
      expect(uniqueValues([1, 2, 1, 1, 2])).toEqual([1, 2]);
    });

    it("regression: preserves zero and negative values (legacy version dropped them)", () => {
      expect(uniqueValues([0, -3, 0, 5, -3])).toEqual([0, -3, 5]);
    });

    it("brute force and Set version agree", () => {
      const cases = [
        [1, 2, 1, 1, 2],
        [0, -3, 0, 5, -3],
        [],
        [7, 7, 7],
      ];
      for (const arr of cases) {
        expect(uniqueValuesBruteForce([...arr])).toEqual(uniqueValues([...arr]));
      }
    });
  });
});
