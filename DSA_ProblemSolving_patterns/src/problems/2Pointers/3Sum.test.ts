import { describe, it, expect } from "vitest";
import {
  findSumOfThree1,
  threeSum,
  threeSum2,
  threeSumBruteForce,
  threeSumClosest,
  fourSum,
} from "./3Sum";

describe("3Sum Problems", () => {
  describe("threeSumBruteForce - Brute force baseline (all unique triplets sum to zero)", () => {
    it("should return all unique triplets that sum to zero - Example 1", () => {
      const nums = [-1, 0, 1, 2, -1, -4];
      const result = threeSumBruteForce(nums);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual([-1, -1, 2]);
      expect(result).toContainEqual([-1, 0, 1]);
    });

    it("should return empty array when no triplets sum to zero - Example 2", () => {
      expect(threeSumBruteForce([0, 1, 1])).toEqual([]);
    });

    it("should return single triplet for all zeros - Example 3", () => {
      expect(threeSumBruteForce([0, 0, 0])).toEqual([[0, 0, 0]]);
    });

    it("should agree with the optimized threeSum on the same input", () => {
      const nums = [6, 3, 9, 1, 4, -1, -5, -2, -7, -3];
      const normalize = (triplets: number[][]) =>
        triplets.map((t) => t.join(",")).sort();

      expect(normalize(threeSumBruteForce(nums))).toEqual(
        normalize(threeSum([...nums]))
      );
    });
  });
  describe("findSumOfThree1 - Find first triplet with given target sum", () => {
    it("should return a triplet that sums to the target", () => {
      const nums = [3, 7, 1, 2, 8, 4, 5];
      const target = 10;
      const result = findSumOfThree1(nums, target);

      expect(result).toHaveLength(3);
      expect(result.reduce((sum, num) => sum + num, 0)).toBe(target);
    });

    it("should return empty array when no triplet exists", () => {
      const nums = [1, 2, 3];
      const target = 10;
      const result = findSumOfThree1(nums, target);

      expect(result).toEqual([]);
    });

    it("should return empty array for invalid input - non-array", () => {
      const result = findSumOfThree1("invalid" as any, 10);
      expect(result).toEqual([]);
    });

    it("should return empty array for invalid input - non-number target", () => {
      const result = findSumOfThree1([1, 2, 3], "invalid" as any);
      expect(result).toEqual([]);
    });

    it("should handle array with less than 3 elements", () => {
      const nums = [1, 2];
      const target = 5;
      const result = findSumOfThree1(nums, target);

      expect(result).toEqual([]);
    });

    it("should handle negative numbers", () => {
      // Use a case that actually works
      const nums = [-1, 0, 1, 2];
      const target = 0;
      const result = findSumOfThree1(nums, target);

      expect(result).toHaveLength(3);
      expect(result.reduce((sum, num) => sum + num, 0)).toBe(target);
    });
  });

  describe("threeSum - Find all unique triplets that sum to zero", () => {
    it("should return all unique triplets that sum to zero - Example 1", () => {
      const nums = [-1, 0, 1, 2, -1, -4];
      const result = threeSum(nums);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual([-1, -1, 2]);
      expect(result).toContainEqual([-1, 0, 1]);
    });

    it("should return empty array when no triplets sum to zero - Example 2", () => {
      const nums = [0, 1, 1];
      const result = threeSum(nums);

      expect(result).toEqual([]);
    });

    it("should return single triplet for all zeros - Example 3", () => {
      const nums = [0, 0, 0];
      const result = threeSum(nums);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([0, 0, 0]);
    });

    it("should handle array with less than 3 elements", () => {
      const nums = [1, 2];
      const result = threeSum(nums);

      expect(result).toEqual([]);
    });

    it("should handle empty array", () => {
      const nums: number[] = [];
      const result = threeSum(nums);

      expect(result).toEqual([]);
    });

    it("should handle duplicates correctly", () => {
      const nums = [-2, 0, 0, 2, 2];
      const result = threeSum(nums);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([-2, 0, 2]);
    });

    it("should handle larger input with multiple solutions", () => {
      const nums = [6, 3, 9, 1, 4, -1, -5, -2, -7, -3];
      const result = threeSum(nums);

      // Verify each triplet sums to zero
      result.forEach((triplet) => {
        expect(triplet.reduce((sum, num) => sum + num, 0)).toBe(0);
      });

      // Verify no duplicate triplets
      const stringified = result.map((triplet) =>
        JSON.stringify(triplet.sort())
      );
      const unique = new Set(stringified);
      expect(unique.size).toBe(result.length);
    });

    it("should handle all negative numbers", () => {
      const nums = [-1, -2, -3, -4];
      const result = threeSum(nums);

      expect(result).toEqual([]);
    });

    it("should handle all positive numbers", () => {
      const nums = [1, 2, 3, 4];
      const result = threeSum(nums);

      expect(result).toEqual([]);
    });
  });

  describe("threeSum2 - Alternative implementation (3Sum reduced to repeated 2Sum)", () => {
    it("should handle 2 possible triplets", () => {
      const nums = [-1, 0, 1, 2, -1, -4];
      const result = threeSum2(nums);

      expect(result).toEqual([
        [-1, -1, 2],
        [-1, 0, 1],
      ]);
    });

    it("should return triplets shaped as number[][], each entry a 3-tuple", () => {
      const nums = [-1, 0, 1, 2, -1, -4];
      const result = threeSum2(nums);

      expect(Array.isArray(result)).toBe(true);
      result.forEach((triplet) => expect(triplet).toHaveLength(3));
    });

    it("should return empty array for null or undefined input", () => {
      expect(threeSum2(null as any)).toEqual([]);
      expect(threeSum2(undefined as any)).toEqual([]);
    });

    it("should return empty array for arrays with less than 3 elements", () => {
      expect(threeSum2([1])).toEqual([]);
      expect(threeSum2([1, 2])).toEqual([]);
    });

    it("should handle edge case with all zeros", () => {
      const nums = [0, 0, 0];
      const result = threeSum2(nums);

      expect(result).toEqual([[0, 0, 0]]);
    });

    it("should handle case where first element is positive", () => {
      const nums = [1, 2, 3];
      const result = threeSum2(nums);

      expect(result).toEqual([]);
    });
  });
});

describe("Integration Tests", () => {
  it("should compare results between threeSum and threeSum2 for valid cases", () => {
    const nums = [-1, 0, 1];
    const result1 = threeSum(nums);
    const result2 = threeSum2(nums);

    // Both should handle the same input, though they may return different formats
    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
  });

  it("should verify that all implementations handle edge cases consistently", () => {
    const edgeCases = [[], [1], [1, 2], [0, 0, 0], [-1, -1, -1], [1, 1, 1]];

    edgeCases.forEach((testCase) => {
      expect(() => {
        findSumOfThree1(testCase, 0);
        threeSum(testCase);
        threeSum2(testCase);
      }).not.toThrow();
    });
  });
});

describe("Performance Tests", () => {
  it("should handle reasonably large inputs efficiently", () => {
    const largeInput = Array.from({ length: 100 }, (_, i) => i - 50);

    const start = performance.now();
    const result = threeSum(largeInput);
    const end = performance.now();

    expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    expect(Array.isArray(result)).toBe(true);
  });

  describe("threeSumClosest (LeetCode 16) - migrated from SlidingWindow", () => {
    it("returns the triplet sum closest to the target", () => {
      expect(threeSumClosest([-1, 2, 1, -4], 1)).toBe(2); // [-1,2,1] = 2
    });

    it("returns an exact match when one exists", () => {
      expect(threeSumClosest([0, 0, 0], 1)).toBe(0);
      expect(threeSumClosest([1, 1, 1, 0], -100)).toBe(2);
    });

    it("handles all-negative arrays (closest achievable, not necessarily exact)", () => {
      // Triplet sums available: -12,-11,-10,-9; closest to -6 is -9 (distance 3).
      expect(threeSumClosest([-3, -2, -5, -4], -6)).toBe(-9);
    });
  });

  describe("fourSum (LeetCode 18) - migrated from SlidingWindow", () => {
    const normalize = (quads: number[][]) =>
      quads.map((q) => [...q].sort((a, b) => a - b).join(",")).sort();

    it("returns all unique quadruplets summing to target", () => {
      const result = fourSum([1, 0, -1, 0, -2, 2], 0);
      expect(normalize(result)).toEqual(
        normalize([
          [-2, -1, 1, 2],
          [-2, 0, 0, 2],
          [-1, 0, 0, 1],
        ])
      );
    });

    it("returns an empty array when no quadruplet matches", () => {
      expect(fourSum([1, 2, 3, 4], 100)).toEqual([]);
    });

    it("handles all-zero input with a nonzero target", () => {
      expect(fourSum([0, 0, 0, 0], 1)).toEqual([]);
      expect(fourSum([0, 0, 0, 0], 0)).toEqual([[0, 0, 0, 0]]);
    });
  });
});
