import { describe, it, expect } from "vitest";
import { trapBruteForce, trapPrefixSuffix, trap } from "./trappingRainWater";

const implementations: Array<[string, (h: number[]) => number]> = [
  ["trapBruteForce", trapBruteForce],
  ["trapPrefixSuffix", trapPrefixSuffix],
  ["trap", trap],
];

describe("Trapping Rain Water (LeetCode 42)", () => {
  for (const [name, fn] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1", () => {
        expect(fn([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
      });

      it("LeetCode Example 2", () => {
        expect(fn([4, 2, 0, 3, 2, 5])).toBe(9);
      });

      it("returns 0 for fewer than 3 bars", () => {
        expect(fn([])).toBe(0);
        expect(fn([5])).toBe(0);
        expect(fn([5, 3])).toBe(0);
      });

      it("returns 0 for strictly increasing heights (nothing to trap)", () => {
        expect(fn([1, 2, 3, 4, 5])).toBe(0);
      });

      it("returns 0 for strictly decreasing heights (nothing to trap)", () => {
        expect(fn([5, 4, 3, 2, 1])).toBe(0);
      });

      it("returns 0 for flat terrain", () => {
        expect(fn([3, 3, 3, 3])).toBe(0);
      });

      it("Real-world: terrain profile that pools water in a single basin", () => {
        // A single valley between two equal walls of height 5, width 3 gap.
        expect(fn([5, 0, 0, 0, 5])).toBe(15);
      });
    });
  }

  it("all three approaches agree across a batch of inputs", () => {
    const cases = [
      [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      [4, 2, 0, 3, 2, 5],
      [1, 2, 3, 4, 5],
      [5, 0, 0, 0, 5],
      [3, 3, 3, 3],
      [],
    ];

    for (const height of cases) {
      const results = implementations.map(([, fn]) => fn(height));
      expect(new Set(results).size).toBe(1);
    }
  });

  it("is a different problem from Container With Most Water on the same input", async () => {
    // Same array used in ContainerWithMostWater's docs (max area = 49);
    // trapping total water is a different number entirely (verifies this
    // file was not left as a mislabeled duplicate of that algorithm).
    const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const { maxArea } = await import("./ContainerWithMostWater");

    expect(trap(height)).not.toBe(maxArea(height));
  });
});
