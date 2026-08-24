/**
 * ============================================================================
 * REMOVE ELEMENT (LeetCode 27)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an array `nums` and a value `val`, remove ALL occurrences of `val`
 * IN-PLACE. Return `k`, the number of elements that are not `val`; the first
 * `k` slots of `nums` must hold those elements (order can be anything, though
 * this implementation preserves it). Anything past `k` doesn't matter.
 *
 *   Input:  nums = [3,2,2,3], val = 3
 *   Output: k = 2, nums = [2,2,_,_]
 *
 * PATTERN:
 * - **Two Pointers, same-direction (fast/slow).** `slow` is the write cursor
 *   for kept elements; `fast` scans. Whenever `nums[fast] !== val`, copy it to
 *   `slow` and advance `slow`. This is the same in-place compaction skeleton as
 *   `removeDuplicatesFromSortedArray` and the overwrite version of `moveZeros`.
 * - (Migrated here from the mis-categorized SlidingWindow folder.)
 *
 * WHEN TO USE:
 * - "Filter out matching elements in place, return the new logical length" →
 *   write-pointer compaction, O(n) time, O(1) space.
 *
 * REAL-WORLD ANALOGY:
 * - Compacting an array by dropping tombstoned/deleted records without
 *   allocating a new array.
 *
 * COMPLEXITY: Time O(n) (single pass). Space O(1).
 * ============================================================================
 */

/**
 * @example
 * const nums = [3, 2, 2, 3];
 * const k = removeElement(nums, 3);
 * // k === 2, nums.slice(0, k) is [2, 2]
 *
 * @example
 * const nums = [0, 1, 2, 2, 3, 0, 4, 2];
 * const k = removeElement(nums, 2);
 * // k === 5, nums.slice(0, k) is [0, 1, 3, 0, 4]
 */
export function removeElement(nums: number[], val: number): number {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      slow++;
    }
  }

  return slow;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "remove all X in place, return new length" → fast/slow
 *    write-pointer compaction. Sibling of Remove Duplicates (LeetCode 26) and
 *    Move Zeroes (LeetCode 283) — same one-pass skeleton, different predicate.
 * 2. Talking point: if matches are RARE, an alternative swaps matches to the
 *    end (fewer writes) at the cost of not preserving order — mention the
 *    trade-off if the interviewer cares about write count.
 * 3. Pitfall: returning a filtered NEW array violates the in-place / O(1)-space
 *    constraint the problem actually asks for.
 */
