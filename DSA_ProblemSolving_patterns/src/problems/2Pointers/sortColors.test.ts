import { describe, it, expect } from "vitest";
import { sortColorsCountingSort, sortColors } from "./sortColors";

const implementations: Array<[string, (nums: number[]) => void]> = [
  ["sortColorsCountingSort", sortColorsCountingSort],
  ["sortColors", sortColors],
];

describe("Sort Colors — Dutch National Flag (LeetCode 75)", () => {
  for (const [name, fn] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1", () => {
        const nums = [2, 0, 2, 1, 1, 0];
        fn(nums);
        expect(nums).toEqual([0, 0, 1, 1, 2, 2]);
      });

      it("LeetCode Example 2", () => {
        const nums = [2, 0, 1];
        fn(nums);
        expect(nums).toEqual([0, 1, 2]);
      });

      it("handles an already-sorted array", () => {
        const nums = [0, 0, 1, 1, 2, 2];
        fn(nums);
        expect(nums).toEqual([0, 0, 1, 1, 2, 2]);
      });

      it("handles a single color", () => {
        const nums = [1, 1, 1];
        fn(nums);
        expect(nums).toEqual([1, 1, 1]);
      });

      it("handles a single element", () => {
        const nums = [2];
        fn(nums);
        expect(nums).toEqual([2]);
      });

      it("handles an empty array", () => {
        const nums: number[] = [];
        fn(nums);
        expect(nums).toEqual([]);
      });
    });
  }

  it("both approaches agree on the same batch of inputs", () => {
    const cases = [
      [2, 0, 2, 1, 1, 0],
      [2, 0, 1],
      [0, 0, 0],
      [2, 2, 1, 1, 0, 0],
      [1, 2, 0, 2, 1, 0, 1, 2, 0],
    ];
    for (const original of cases) {
      const a = [...original];
      const b = [...original];
      sortColorsCountingSort(a);
      sortColors(b);
      expect(a).toEqual(b);
    }
  });
});
