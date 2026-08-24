import { describe, it, expect } from "vitest";
import {
  moveNegativesToEnd,
  moveNegativesToEndSwap,
  moveEvensToFront,
  moveValueToEnd,
  moveZerosMinSwaps,
  moveZerosNoSwaps,
  moveMultipleValues,
  partitionByCondition,
  moveZerosNewArray,
  moveSpacesToEnd,
  moveVowelsToFront,
} from "./moveZeros_solutions";

describe("Move Zeros - generalized partition variations", () => {
  describe("moveNegativesToEnd (O(k) space, preserves order on both sides)", () => {
    it("moves negatives to the end, preserving relative order of BOTH groups", () => {
      const nums = [1, -2, 3, -4, 5];
      moveNegativesToEnd(nums);
      expect(nums).toEqual([1, 3, 5, -2, -4]);
    });

    it("treats zero as non-negative", () => {
      const nums = [0, -1, 2, -3];
      moveNegativesToEnd(nums);
      expect(nums).toEqual([0, 2, -1, -3]);
    });

    it("regression: does not lose values (the original 2-pass overwrite bug)", () => {
      // The original buggy version clobbered -2 before its second pass ever
      // looked for it, producing [1,3,5,-4,5] — silently dropping a value.
      const nums = [1, -2, 3, -4, 5];
      moveNegativesToEnd(nums);
      expect(nums.sort((a, b) => a - b)).toEqual([-4, -2, 1, 3, 5]);
    });
  });

  describe("moveNegativesToEndSwap (O(1) space, front-group order only)", () => {
    it("preserves the KEPT (non-negative) group's order", () => {
      const nums = [1, -2, 3, -4, 5];
      moveNegativesToEndSwap(nums);
      expect(nums.slice(0, 3)).toEqual([1, 3, 5]);
    });

    it("does NOT guarantee the displaced (negative) group's order — documented trade-off", () => {
      const nums = [1, -2, 3, -4, 5];
      moveNegativesToEndSwap(nums);
      // Verified by hand: swap-based partitioning reorders the negatives to
      // [-4, -2] here, unlike moveNegativesToEnd's [-2, -4]. Both are valid
      // partitions; only the front group's order is a guaranteed contract.
      expect(nums).toEqual([1, 3, 5, -4, -2]);
    });

    it("treats zero as non-negative", () => {
      const nums = [0, -1, 2, -3];
      moveNegativesToEndSwap(nums);
      expect(nums).toEqual([0, 2, -1, -3]);
    });
  });

  describe("moveEvensToFront", () => {
    it("moves evens to the front, preserving relative order of both groups", () => {
      const nums = [1, 2, 3, 4, 5, 6];
      moveEvensToFront(nums);
      expect(nums).toEqual([2, 4, 6, 1, 3, 5]);
    });

    it("treats zero as even", () => {
      const nums = [0, 1, 2];
      moveEvensToFront(nums);
      expect(nums).toEqual([0, 2, 1]);
    });
  });

  describe("moveValueToEnd", () => {
    it("moves every instance of the target value to the end", () => {
      const nums = [3, 2, 2, 3, 1];
      moveValueToEnd(nums, 3);
      expect(nums).toEqual([2, 2, 1, 3, 3]);
    });

    it("leaves the array unchanged if the target value never appears", () => {
      const nums = [1, 2, 3];
      moveValueToEnd(nums, 9);
      expect(nums).toEqual([1, 2, 3]);
    });
  });

  describe("moveZerosMinSwaps", () => {
    it("moves zeros to the end", () => {
      const nums = [0, 1, 0, 3, 12];
      moveZerosMinSwaps(nums);
      expect(nums).toEqual([1, 3, 12, 0, 0]);
    });

    it("returns the number of swaps actually performed", () => {
      // Already-positioned non-zeros (index === writePos) should not count
      // as swaps — only [1] moving from index 2 to index 1 should.
      const nums = [1, 0, 2];
      const swaps = moveZerosMinSwaps(nums);
      expect(nums).toEqual([1, 2, 0]);
      expect(swaps).toBe(1);
    });

    it("performs zero swaps when there are no zeros", () => {
      const nums = [1, 2, 3];
      expect(moveZerosMinSwaps(nums)).toBe(0);
    });
  });

  describe("moveZerosNoSwaps", () => {
    it("moves zeros to the end via overwrite", () => {
      const nums = [0, 1, 0, 2, 0, 3, 0];
      moveZerosNoSwaps(nums);
      expect(nums).toEqual([1, 2, 3, 0, 0, 0, 0]);
    });

    it("handles negative numbers", () => {
      const nums = [-1, 0, -2, 0, 3];
      moveZerosNoSwaps(nums);
      expect(nums).toEqual([-1, -2, 3, 0, 0]);
    });
  });

  describe("moveMultipleValues", () => {
    it("Real-world: moves several 'archived status' codes to the end of a queue", () => {
      const nums = [1, 2, 3, 2, 4, 2, 5];
      moveMultipleValues(nums, [2, 4]);
      // Displaced values keep the relative order they were encountered in
      // (not grouped by distinct value) — verified by hand, not assumed.
      expect(nums).toEqual([1, 3, 5, 2, 2, 4, 2]);
    });

    it("leaves the array unchanged if none of the target values appear", () => {
      const nums = [1, 2, 3];
      moveMultipleValues(nums, [9, 10]);
      expect(nums).toEqual([1, 2, 3]);
    });
  });

  describe("partitionByCondition", () => {
    it("moves elements satisfying the predicate to the front", () => {
      const nums = [1, 8, 3, 9, 2, 7];
      partitionByCondition(nums, (n) => n > 5);
      expect(nums).toEqual([8, 9, 7, 1, 3, 2]);
    });

    it("generalizes to the base moveZeros problem via 'n !== 0'", () => {
      const nums = [0, 1, 0, 3, 12];
      partitionByCondition(nums, (n) => n !== 0);
      expect(nums).toEqual([1, 3, 12, 0, 0]);
    });
  });

  describe("moveZerosNewArray", () => {
    it("returns a new array without mutating the input", () => {
      const nums = [0, 1, 0, 3, 12];
      const result = moveZerosNewArray(nums);
      expect(result).toEqual([1, 3, 12, 0, 0]);
      expect(nums).toEqual([0, 1, 0, 3, 12]); // original untouched
    });
  });

  describe("moveSpacesToEnd", () => {
    it("moves spaces to the end of a character array", () => {
      const chars = ["a", " ", "b", " ", "c"];
      moveSpacesToEnd(chars);
      expect(chars).toEqual(["a", "b", "c", " ", " "]);
    });
  });

  describe("moveVowelsToFront", () => {
    it("moves vowels to the front, preserving relative order", () => {
      const chars = ["h", "e", "l", "l", "o"];
      moveVowelsToFront(chars);
      expect(chars).toEqual(["e", "o", "h", "l", "l"]);
    });

    it("is case-insensitive about vowels", () => {
      const chars = ["A", "b", "E", "c"];
      moveVowelsToFront(chars);
      expect(chars).toEqual(["A", "E", "b", "c"]);
    });
  });
});
