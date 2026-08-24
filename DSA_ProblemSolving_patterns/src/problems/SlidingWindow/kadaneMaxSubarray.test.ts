import { describe, it, expect } from "vitest";
import {
  maxSubarrayBruteForceCubic,
  maxSubarrayBruteForceQuadratic,
  kadaneMaxSubarray,
  kadaneMaxSubarrayWithIndices,
} from "./kadaneMaxSubarray";

const sumImplementations: Array<[string, (nums: number[]) => number]> = [
  ["maxSubarrayBruteForceCubic", maxSubarrayBruteForceCubic],
  ["maxSubarrayBruteForceQuadratic", maxSubarrayBruteForceQuadratic],
  ["kadaneMaxSubarray", kadaneMaxSubarray],
];

describe("Maximum Subarray — Kadane's Algorithm (LeetCode 53)", () => {
  for (const [name, fn] of sumImplementations) {
    describe(name, () => {
      it("LeetCode Example: classic mixed array", () => {
        expect(fn([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
      });

      it("all-positive → entire array", () => {
        expect(fn([1, 2, 3, 4, 5])).toBe(15);
      });

      it("all-negative → least-negative single element", () => {
        expect(fn([-1, -2, -3, -4])).toBe(-1);
      });

      it("single element", () => {
        expect(fn([5])).toBe(5);
        expect(fn([-5])).toBe(-5);
      });

      it("positive start then mixed", () => {
        expect(fn([5, -4, 3, -2, 1])).toBe(5);
      });

      it("best subarray in the middle", () => {
        expect(fn([1, -3, 2, 1, -1])).toBe(3);
      });

      it("Real-world: most profitable contiguous run of daily P&L", () => {
        expect(fn([-1, 3, -2, 5, -1])).toBe(6); // [3,-2,5] = 6
      });
    });
  }

  it("all three sum implementations agree across a batch of inputs", () => {
    const cases = [
      [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      [1, 2, 3, 4, 5],
      [-1, -2, -3, -4],
      [5, -4, 3, -2, 1],
      [1, -3, 2, 1, -1],
      [-1, 3, -2, 5, -1],
    ];
    for (const nums of cases) {
      const results = sumImplementations.map(([, fn]) => fn(nums));
      expect(new Set(results).size).toBe(1);
    }
  });

  describe("kadaneMaxSubarrayWithIndices", () => {
    it("reports the sum AND the exact subarray/indices", () => {
      const result = kadaneMaxSubarrayWithIndices([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      expect(result.maxSum).toBe(6);
      expect(result.startIndex).toBe(3);
      expect(result.endIndex).toBe(6);
      expect(result.subarray).toEqual([4, -1, 2, 1]);
    });

    it("its reported sum always matches plain Kadane", () => {
      const cases = [
        [1, 2, 3, 4, 5],
        [-1, -2, -3, -4],
        [5, -4, 3, -2, 1],
        [1, -3, 2, 1, -1],
      ];
      for (const nums of cases) {
        expect(kadaneMaxSubarrayWithIndices(nums).maxSum).toBe(kadaneMaxSubarray(nums));
      }
    });

    it("the reported subarray actually sums to maxSum", () => {
      const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
      const { maxSum, subarray } = kadaneMaxSubarrayWithIndices(nums);
      expect(subarray.reduce((a, b) => a + b, 0)).toBe(maxSum);
    });

    it("handles an empty array", () => {
      expect(kadaneMaxSubarrayWithIndices([])).toEqual({
        maxSum: 0,
        startIndex: -1,
        endIndex: -1,
        subarray: [],
      });
    });
  });
});
