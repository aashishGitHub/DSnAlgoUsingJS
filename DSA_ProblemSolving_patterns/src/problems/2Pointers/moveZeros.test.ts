import { describe, it, expect } from "vitest";
import { moveZerosBruteForce, moveZerosOverwrite, moveZeroes, moveZeroes2 } from "./moveZeros";

// All four approaches mutate in place (or, for the brute-force baseline,
// behave as if they do) and must agree on every input.
const implementations: Array<[string, (nums: number[]) => void]> = [
  ["moveZerosBruteForce", moveZerosBruteForce],
  ["moveZerosOverwrite", moveZerosOverwrite],
  ["moveZeroes", moveZeroes],
  ["moveZeroes2", moveZeroes2],
];

describe("Move Zeroes (LeetCode 283)", () => {
  for (const [name, moveZeros] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1", () => {
        const nums = [0, 1, 0, 3, 12];
        moveZeros(nums);
        expect(nums).toEqual([1, 3, 12, 0, 0]);
      });

      it("LeetCode Example 2: single zero", () => {
        const nums = [0];
        moveZeros(nums);
        expect(nums).toEqual([0]);
      });

      it("handles an empty array", () => {
        const nums: number[] = [];
        moveZeros(nums);
        expect(nums).toEqual([]);
      });

      it("leaves an array with no zeros unchanged", () => {
        const nums = [1, 2, 3];
        moveZeros(nums);
        expect(nums).toEqual([1, 2, 3]);
      });

      it("handles an array of all zeros", () => {
        const nums = [0, 0, 0];
        moveZeros(nums);
        expect(nums).toEqual([0, 0, 0]);
      });

      it("preserves relative order of non-zero elements with alternating zeros", () => {
        const nums = [0, 1, 0, 1, 0];
        moveZeros(nums);
        expect(nums).toEqual([1, 1, 0, 0, 0]);
      });

      it("handles zeros already at the end", () => {
        const nums = [1, 2, 0, 0];
        moveZeros(nums);
        expect(nums).toEqual([1, 2, 0, 0]);
      });

      it("handles negative numbers (only literal 0 should move)", () => {
        const nums = [0, -1, 2, 0, -3];
        moveZeros(nums);
        expect(nums).toEqual([-1, 2, -3, 0, 0]);
      });
    });
  }

  it("all four approaches agree on the same batch of inputs", () => {
    const cases = [
      [0, 1, 0, 3, 12],
      [0, 0, 1, 2],
      [1, 2, 0, 0],
      [0, -1, 2, 0, -3],
      [],
      [0],
      [1],
    ];

    for (const original of cases) {
      const results = implementations.map(([, fn]) => {
        const copy = [...original];
        fn(copy);
        return copy;
      });
      const serialized = results.map((r) => JSON.stringify(r));
      expect(new Set(serialized).size).toBe(1);
    }
  });
});
