import { describe, it, expect } from "vitest";
import { removeElement } from "./removeElement";

describe("Remove Element (LeetCode 27)", () => {
  it("LeetCode Example 1", () => {
    const nums = [3, 2, 2, 3];
    const k = removeElement(nums, 3);
    expect(k).toBe(2);
    expect(nums.slice(0, k)).toEqual([2, 2]);
  });

  it("LeetCode Example 2 (preserves relative order of kept elements)", () => {
    const nums = [0, 1, 2, 2, 3, 0, 4, 2];
    const k = removeElement(nums, 2);
    expect(k).toBe(5);
    expect(nums.slice(0, k)).toEqual([0, 1, 3, 0, 4]);
  });

  it("returns 0 when every element matches", () => {
    const nums = [4, 4, 4];
    expect(removeElement(nums, 4)).toBe(0);
  });

  it("leaves the array intact when no element matches", () => {
    const nums = [1, 2, 3];
    const k = removeElement(nums, 9);
    expect(k).toBe(3);
    expect(nums.slice(0, k)).toEqual([1, 2, 3]);
  });

  it("handles an empty array", () => {
    expect(removeElement([], 1)).toBe(0);
  });
});
