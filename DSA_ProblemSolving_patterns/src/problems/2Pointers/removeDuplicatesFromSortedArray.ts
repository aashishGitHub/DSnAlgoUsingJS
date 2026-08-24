/**
 * ============================================================================
 * REMOVE DUPLICATES FROM SORTED ARRAY (LeetCode 26)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums` sorted in non-decreasing order, remove the
 * duplicates IN-PLACE such that each unique element appears only once. The
 * relative order of elements is preserved. Return `k`, the number of unique
 * elements — the first `k` slots of `nums` must hold them in order; anything
 * beyond that doesn't matter.
 *
 *   Input:  nums = [1,1,2]
 *   Output: k = 2, nums = [1,2,_]
 *
 *   Input:  nums = [0,0,1,1,1,2,2,3,3,4]
 *   Output: k = 5, nums = [0,1,2,3,4,_,_,_,_,_]
 *
 * FILE HISTORY NOTE: this file used to be named `containsDuplicate.ts` but
 * never actually implemented "Contains Duplicate" (LeetCode 217 — that
 * problem already has a clean home in `HashMap/hashSetPatterns.ts`). Its
 * real content was always this problem, mislabeled. Renamed and fixed here;
 * `SlidingWindow/twoPointerSlidingWindow.ts` has a duplicate `removeDuplicates`
 * slated for cleanup when that file migrates into `2Pointers/`.
 *
 * PATTERN:
 * - **Two Pointers, same-direction (fast/slow).** `slow` marks the boundary
 *   of the unique region built so far; `fast` scans ahead looking for the
 *   next value that's genuinely new. Sortedness is what makes "duplicate"
 *   mean "equal to the immediately preceding element" — no set/map needed.
 *
 * WHEN TO USE:
 * - "Sorted input, remove/compact adjacent duplicates in place" → fast/slow
 *   pointers, O(n) time, O(1) space. (Unsorted? You need a Set — see
 *   `HashMap/hashSetPatterns.ts`'s `containsDuplicate` for the existence-check
 *   version, or dedupe with a Set for the "return unique values" version.)
 *
 * REAL-WORLD ANALOGIES:
 * - Log compaction: collapse consecutive identical log lines into one.
 * - Sorted event streams: compact repeated sensor readings taken back-to-back.
 * - Database merge: dedupe a sorted, already-merged key list in place.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Brute force (generic dedupe, ignores sortedness)  Time O(n²)  Space O(n)
 *   Approach 2  Compare-adjacent (uses sortedness, new array)     Time O(n)   Space O(n)
 *   Approach 3  Two Pointers ★ optimal (in-place, matches LeetCode contract)  Time O(n)  Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (generic dedupe, doesn't exploit sortedness)
 * ----------------------------------------------------------------------------
 * Idea: for each element, check if it already appeared earlier via `indexOf`.
 * Works on ANY array, sorted or not — which is exactly why it's not optimal
 * here: it does more work than necessary given the sorted guarantee.
 *
 * Why it's slow: `indexOf` re-scans from the start every time, and this
 * approach doesn't even use the fact that duplicates are always adjacent in
 * sorted input — Approach 2/3 exploit that to avoid re-scanning entirely.
 *
 * @example
 * removeDuplicatesBruteForce([1, 1, 2, 2, 3]);
 * // [1, 2, 3]
 *
 * Time:  O(n²)  — `indexOf` inside a scan of every element.
 * Space: O(n)   — new array via `filter`.
 */
export function removeDuplicatesBruteForce(nums: number[]): number[] {
  return nums.filter((num, index, self) => self.indexOf(num) === index);
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — COMPARE-ADJACENT (uses sortedness, still a new array)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: because `nums` is sorted, ALL duplicates of a value are
 * adjacent — so a value is worth keeping exactly when it differs from its
 * immediate neighbor. No lookback/indexOf scan needed, just one pass.
 *
 * @example
 * removeDuplicatesCompareAdjacent([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]);
 * // [0, 1, 2, 3, 4]
 *
 * Time:  O(n)  — single pass.
 * Space: O(n)  — new result array (LeetCode 26 wants in-place — see Approach 3).
 */
export function removeDuplicatesCompareAdjacent(nums: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== nums[i + 1]) {
      result.push(nums[i]);
    }
  }
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — TWO POINTERS ★ OPTIMAL (in-place, matches the LeetCode contract)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: same "adjacent duplicate" insight as Approach 2, but
 * instead of building a separate array, overwrite `nums` in place. `slow`
 * always points at the last confirmed-unique slot; when `fast` finds a new
 * value, it gets written just past `slow`.
 *
 * DRY-RUN on [0,0,1,1,1,2,2,3,3,4]:
 *   slow=0
 *   fast=1: nums[1]=0 === nums[0]=0 → skip
 *   fast=2: nums[2]=1 !== nums[0]=0 → slow=1, nums[1]=1 → [0,1,1,1,1,2,2,3,3,4]
 *   fast=3: nums[3]=1 === nums[1]=1 → skip
 *   fast=4: nums[4]=1 === nums[1]=1 → skip
 *   fast=5: nums[5]=2 !== nums[1]=1 → slow=2, nums[2]=2 → [0,1,2,1,1,2,2,3,3,4]
 *   fast=6: nums[6]=2 === nums[2]=2 → skip
 *   fast=7: nums[7]=3 !== nums[2]=2 → slow=3, nums[3]=3 → [0,1,2,3,1,2,2,3,3,4]
 *   fast=8: nums[8]=3 === nums[3]=3 → skip
 *   fast=9: nums[9]=4 !== nums[3]=3 → slow=4, nums[4]=4 → [0,1,2,3,4,2,2,3,3,4]
 *   → k = slow + 1 = 5, first 5 slots = [0,1,2,3,4]  ✓
 *
 * @example
 * const nums = [1, 1, 2];
 * const k = removeDuplicatesInPlace(nums);
 * // k === 2, nums.slice(0, k) is [1, 2]
 *
 * Time:  O(n)  — single pass, `fast` visits each index once.
 * Space: O(1)  — no extra array; overwrites `nums` itself.
 */
export function removeDuplicatesInPlace(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "sorted array, remove duplicates in place" → fast/slow
 *    two pointers, O(n) time, O(1) space. If the array ISN'T sorted, this
 *    exact trick doesn't apply — you'd need a Set instead (O(n) space).
 * 2. Talking point: sortedness is what turns "is this a duplicate?" from an
 *    O(n) lookup (Set/indexOf) into an O(1) adjacent-comparison — always
 *    name that trade explicitly, it's the whole reason this is a Two
 *    Pointers problem instead of a Hash Set problem.
 * 3. Pitfalls: returning a new array (Approach 2) doesn't satisfy the actual
 *    LeetCode constraint (in-place, O(1) extra space, return count `k`) —
 *    know the difference between "a correct algorithm" and "the algorithm
 *    that satisfies THIS problem's exact contract."
 * 4. Follow-ups: "allow at most 2 duplicates" (LeetCode 80 — same skeleton,
 *    compare `nums[fast]` against `nums[slow - 1]` instead of `nums[slow]`);
 *    "remove ALL instances of a given value" (a simpler version of this same
 *    fast/slow pattern — see `moveZeros_solutions.ts`'s `moveValueToEnd`).
 */
