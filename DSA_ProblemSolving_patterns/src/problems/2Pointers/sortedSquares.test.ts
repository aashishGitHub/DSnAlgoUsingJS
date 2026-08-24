import { describe, it, expect } from "vitest";
import { sortedSquaresBruteForce, sortedSquares } from "./sortedSquares";

const implementations: Array<[string, (nums: number[]) => number[]]> = [
  ["sortedSquaresBruteForce", sortedSquaresBruteForce],
  ["sortedSquares", sortedSquares],
];

describe("Squares of a Sorted Array (LeetCode 977)", () => {
  for (const [name, fn] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1: mixed negatives and positives", () => {
        expect(fn([-4, -1, 0, 3, 10])).toEqual([0, 1, 9, 16, 100]);
      });

      it("LeetCode Example 2", () => {
        expect(fn([-7, -3, 2, 3, 11])).toEqual([4, 9, 9, 49, 121]);
      });

      it("handles all-negative input", () => {
        expect(fn([-5, -3, -1])).toEqual([1, 9, 25]);
      });

      it("handles all-positive input", () => {
        expect(fn([1, 2, 3])).toEqual([1, 4, 9]);
      });

      it("handles a single element", () => {
        expect(fn([-2])).toEqual([4]);
      });

      it("handles an empty array", () => {
        expect(fn([])).toEqual([]);
      });
    });
  }

  it("both approaches agree on the same batch of inputs", () => {
    const cases = [
      [-4, -1, 0, 3, 10],
      [-7, -3, 2, 3, 11],
      [-5, -3, -1],
      [0, 0, 0],
      [-2, -2, 2, 2],
    ];
    for (const nums of cases) {
      expect(sortedSquaresBruteForce([...nums])).toEqual(sortedSquares([...nums]));
    }
  });
});
