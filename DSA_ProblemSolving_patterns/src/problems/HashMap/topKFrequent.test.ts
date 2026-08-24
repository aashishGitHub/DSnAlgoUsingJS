import { describe, it, expect } from "vitest";
import { topKFrequentSort, topKFrequentHeap, topKFrequentBucketSort } from "./topKFrequent";

function normalize(result: number[]): number[] {
  return [...result].sort((a, b) => a - b);
}

const implementations: Array<[string, (nums: number[], k: number) => number[]]> = [
  ["topKFrequentSort", topKFrequentSort],
  ["topKFrequentHeap", topKFrequentHeap],
  ["topKFrequentBucketSort", topKFrequentBucketSort],
];

describe("Top K Frequent Elements (LeetCode 347)", () => {
  for (const [name, fn] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1", () => {
        expect(normalize(fn([1, 1, 1, 2, 2, 3], 2))).toEqual([1, 2]);
      });

      it("LeetCode Example 2: single element", () => {
        expect(fn([1], 1)).toEqual([1]);
      });

      it("returns all elements when k equals the number of distinct values", () => {
        expect(normalize(fn([1, 2], 2))).toEqual([1, 2]);
      });

      it("handles negative numbers", () => {
        expect(normalize(fn([4, 1, -1, 2, -1, 2, 3], 2))).toEqual([-1, 2]);
      });

      it("Real-world: top 2 most-visited page IDs from a traffic log", () => {
        const pageViews = [101, 102, 101, 103, 101, 102, 104];
        expect(normalize(fn(pageViews, 2))).toEqual([101, 102]);
      });
    });
  }

  it("all three implementations agree across a batch of inputs", () => {
    const cases: Array<[number[], number]> = [
      [[1, 1, 1, 2, 2, 3], 2],
      [[1], 1],
      [[1, 2], 2],
      [[1, 1, 1, 2, 2, 3, 3, 3, 3], 2],
      [[4, 1, -1, 2, -1, 2, 3], 2],
    ];

    for (const [nums, k] of cases) {
      const results = implementations.map(([, fn]) => normalize(fn(nums, k)));
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(results[0]);
      }
    }
  });
});
