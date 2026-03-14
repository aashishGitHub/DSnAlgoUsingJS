import { describe, it, expect } from "vitest";
import {
  findKthLargest,
  findKthLargestMinHeap,
  findKthLargestQuickSelect,
} from "./kthLargest.js";

describe("Kth Largest Element", () => {
  it("Example: find 2nd largest from mixed values", () => {
    // Real-world: monitoring spikes (2nd biggest spike)
    const nums = [7, 4, 6, 3, 9, 1];
    const k = 2;

    // QuickSelect mutates, so use separate copies for each approach
    expect(findKthLargestQuickSelect([...nums], k)).toBe(7);
    expect(findKthLargestMinHeap(nums, k)).toBe(7);
    expect(findKthLargest([...nums], k)).toBe(7);
  });

  it("Handles duplicates correctly (LeetCode-style)", () => {
    // Real-world: multiple applicants can have the same score
    const nums = [3, 2, 3, 1, 2, 4, 5, 5, 6];
    const k = 4;
    // Sorted desc: [6,5,5,4,3,3,2,2,1] => 4th largest = 4
    expect(findKthLargestQuickSelect([...nums], k)).toBe(4);
    expect(findKthLargestMinHeap(nums, k)).toBe(4);
  });

  it("Boundary: k=1 returns the maximum", () => {
    const nums = [-10, 0, 8, 7];
    expect(findKthLargestQuickSelect([...nums], 1)).toBe(8);
    expect(findKthLargestMinHeap(nums, 1)).toBe(8);
  });

  it("Boundary: k=n returns the minimum", () => {
    const nums = [5, 4, 9, 1];
    expect(findKthLargestQuickSelect([...nums], nums.length)).toBe(1);
    expect(findKthLargestMinHeap(nums, nums.length)).toBe(1);
  });

  it("Throws on invalid k", () => {
    expect(() => findKthLargestQuickSelect([1, 2, 3], 0)).toThrow();
    expect(() => findKthLargestQuickSelect([1, 2, 3], 4)).toThrow();
    expect(() => findKthLargestMinHeap([1, 2, 3], -1)).toThrow();
  });
});

