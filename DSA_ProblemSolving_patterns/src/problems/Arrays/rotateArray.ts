/**
 * ============================================================================
 * ROTATE ARRAY (LeetCode 189)
 * ============================================================================
 * (Consolidates the former rotateArray.js, rotateArrayOptimized.js, and
 *  easy/rotateArrayByN.ts into one step-by-step file.)
 *
 * PROBLEM STATEMENT:
 * Rotate the array to the RIGHT by k steps, in place.
 *
 *   Input:  [1,2,3,4,5,6,7], k = 3
 *   Output: [5,6,7,1,2,3,4]
 *
 * FIRST, THE UNIVERSAL PREP STEP (applies to every approach):
 *   k = k % n              // rotating by n lands where you started
 *   if (k < 0) k += n      // a left-rotation by k = right-rotation by n-k
 *
 * COMPLEXITY LADDER (n = nums.length):
 *   Step 1  Rotate one step, k times          Time O(n·k)  Space O(1)
 *   Step 2  Extra array (compute final slot)   Time O(n)    Space O(n)
 *   Step 3  Three reversals ★                  Time O(n)    Space O(1)
 *   Bonus   Cyclic replacement                 Time O(n)    Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: rotate by ONE, k times.
 * ----------------------------------------------------------------------------
 * The two-minute version: moving everything right by one is easy (save the
 * last element, shift the rest, put it in front). Do that k times.
 *
 * Why it's slow: each single-step rotation touches all n elements, and we do
 * it k times — the same elements shuffle through the same positions again
 * and again instead of jumping straight to where they belong.
 *
 * Time: O(n·k). Space: O(1).
 */
export function rotateArrayBruteForce(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;
  k = ((k % n) + n) % n;

  for (let step = 0; step < k; step++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) {
      nums[i] = nums[i - 1]; // shift everything right by one
    }
    nums[0] = last;
  }
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — EXTRA ARRAY: send each element straight to its final slot.
 * ----------------------------------------------------------------------------
 * The insight that kills the O(n·k): element at index i ends up at index
 * (i + k) % n. Compute that ONCE per element into a scratch array.
 *
 * DRY-RUN on [1,2,3,4,5,6,7], k=3:
 *   index 0 → 3, 1 → 4, 2 → 5, 3 → 6, 4 → 0, 5 → 1, 6 → 2
 *   result = [5,6,7,1,2,3,4] ✓
 *
 * Time: O(n). Space: O(n) — the trade we remove in Step 3.
 */
export function rotateArrayExtraSpace(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;
  k = ((k % n) + n) % n;

  const result = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    result[(i + k) % n] = nums[i]; // straight to the final slot
  }
  for (let i = 0; i < n; i++) nums[i] = result[i]; // copy back (in-place contract)
}

/**
 * ----------------------------------------------------------------------------
 * STEP 3 ★ — THREE REVERSALS: O(n) time AND O(1) space.
 * ----------------------------------------------------------------------------
 * The classic trick. Reversing is in-place and O(n) — and three well-chosen
 * reversals ARE a rotation:
 *
 *   [1,2,3,4,5,6,7], k=3
 *   1) reverse ALL        → [7,6,5,4,3,2,1]
 *   2) reverse first k    → [5,6,7,4,3,2,1]
 *   3) reverse the rest   → [5,6,7,1,2,3,4] ✓
 *
 * Why it works: reversing the whole array brings the last k elements to the
 * front — but each half is now backwards; the two smaller reversals fix the
 * internal order of each half.
 *
 * Time: O(n) — every element is swapped at most twice. Space: O(1).
 */
export function rotateArray(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;
  k = ((k % n) + n) % n;
  if (k === 0) return;

  const reverse = (start: number, end: number): void => {
    while (start < end) {
      [nums[start], nums[end]] = [nums[end], nums[start]];
      start++;
      end--;
    }
  };

  reverse(0, n - 1); // 1) whole array
  reverse(0, k - 1); // 2) first k
  reverse(k, n - 1); // 3) the rest
}

/**
 * ----------------------------------------------------------------------------
 * BONUS — CYCLIC REPLACEMENT: also O(n)/O(1), harder to get right live.
 * ----------------------------------------------------------------------------
 * Follow each element to its destination, displacing what's there, and keep
 * following the displaced element — a cycle. When a cycle closes early
 * (gcd(n, k) > 1 cycles exist), start the next cycle one index later.
 * Educational; in an interview prefer Step 3 and mention this exists.
 */
export function rotateArrayCyclic(nums: number[], k: number): void {
  const n = nums.length;
  if (n === 0) return;
  k = ((k % n) + n) % n;
  if (k === 0) return;

  let moved = 0;
  for (let start = 0; moved < n; start++) {
    let current = start;
    let carrying = nums[start];
    do {
      const next = (current + k) % n;
      [nums[next], carrying] = [carrying, nums[next]]; // drop off, pick up
      current = next;
      moved++;
    } while (current !== start); // cycle closed — move to the next one
  }
}

/**
 * ----------------------------------------------------------------------------
 * ONE-LINER for JS utility contexts (returns a NEW array, not in-place):
 * last k elements to the front. Fine for app code; interviews usually demand
 * the in-place versions above.
 */
export function rotatedCopy(nums: number[], k: number): number[] {
  const n = nums.length;
  if (n === 0) return [];
  k = ((k % n) + n) % n;
  return [...nums.slice(n - k), ...nums.slice(0, n - k)];
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. FIRST WORDS: "k = k % n" — and handle negative k with the +n trick.
 *    Forgetting the modulo is the #1 fail on this problem.
 * 2. The ladder to narrate: one-step-k-times O(n·k) → "each element's final
 *    slot is computable, so go straight there" O(n)/O(n) → "reversal is the
 *    in-place way to relocate blocks" O(n)/O(1).
 * 3. Left rotation by k ≡ right rotation by n−k — say it, don't derive it live.
 * 4. Related: reversal trick also solves "rotate a string/linked list";
 *    cyclic replacement shape reappears in cyclic sort.
 */
