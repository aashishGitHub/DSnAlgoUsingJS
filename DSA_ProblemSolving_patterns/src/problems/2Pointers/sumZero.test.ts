import { describe, it, expect } from "vitest";
import { pairsWithSumZeroBruteForce, pairsWithSumZero, twoSumSorted } from "./sumZero";

function normalize(pairs: number[][]): string[] {
  return pairs.map((p) => p.join(",")).sort();
}

const implementations: Array<[string, (nums: number[]) => number[][]]> = [
  ["pairsWithSumZeroBruteForce", pairsWithSumZeroBruteForce],
  ["pairsWithSumZero", pairsWithSumZero],
];

describe("Pairs With Sum Zero", () => {
  for (const [name, fn] of implementations) {
    describe(name, () => {
      it("finds all pairs summing to zero in a sorted array", () => {
        const result = fn([-3, -2, -1, 0, 1, 2, 3, 4, 6]);
        expect(normalize(result)).toEqual(normalize([[-3, 3], [-2, 2], [-1, 1]]));
      });

      it("returns an empty array when no pair sums to zero", () => {
        expect(fn([1, 2, 3, 4])).toEqual([]);
      });

      it("returns an empty array for empty input", () => {
        expect(fn([])).toEqual([]);
      });

      it("returns an empty array for a single element", () => {
        expect(fn([0])).toEqual([]);
      });

      it("Real-world: matches an offsetting debit/credit pair", () => {
        const ledger = [-50, -20, -5, 5, 20, 50, 100];
        expect(normalize(fn(ledger))).toEqual(normalize([[-50, 50], [-20, 20], [-5, 5]]));
      });
    });
  }

  it("correctly handles duplicate values without over- or under-counting", () => {
    // Regression check for the bug found in the original console.log-based
    // version: it must NOT reuse the single `2` across all three `-2`s.
    const nums = [-2, -2, -2, 2, 3];
    expect(normalize(pairsWithSumZero(nums))).toEqual(normalize([[-2, 2]]));
  });

  it("both implementations agree on the same sorted input", () => {
    const nums = [-4, -2, -2, 0, 1, 2, 2, 5];
    expect(normalize(pairsWithSumZeroBruteForce(nums))).toEqual(
      normalize(pairsWithSumZero(nums))
    );
  });

  describe("twoSumSorted (LeetCode 167) - migrated from SlidingWindow", () => {
    it("returns the 1-indexed positions of the pair summing to target", () => {
      expect(twoSumSorted([2, 7, 11, 15], 9)).toEqual([1, 2]);
    });

    it("finds a pair that requires walking the left pointer inward", () => {
      // 1+6=7<10, ... , 4+6=10 → positions 4 and 5 (1-indexed)
      expect(twoSumSorted([1, 2, 3, 4, 6], 10)).toEqual([4, 5]);
    });

    it("handles negative numbers (returns the outermost matching pair first)", () => {
      // -3 + 4 = 1 sits at the extremes, so it's found before -1 + 2.
      expect(twoSumSorted([-3, -1, 0, 2, 4], 1)).toEqual([1, 5]);
    });

    it("returns an empty array when no pair sums to target", () => {
      expect(twoSumSorted([1, 2, 3], 100)).toEqual([]);
    });
  });
});
