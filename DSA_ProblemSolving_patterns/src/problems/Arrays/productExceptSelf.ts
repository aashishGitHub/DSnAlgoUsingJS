/**
 * ============================================================================
 * PRODUCT OF ARRAY EXCEPT SELF (LeetCode 238) — Blind 75
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums`, return an array `answer` where `answer[i]`
 * is the product of ALL elements except `nums[i]`.
 * Constraints: O(n) time, and you may NOT use division.
 *
 *   Input:  [1,2,3,4]
 *   Output: [24,12,8,6]
 *
 * PATTERN:
 * - **Prefix × Suffix.** The product of "everything except me" is exactly
 *   (product of everything to my LEFT) × (product of everything to my RIGHT).
 *   Precompute those two running products and every answer is one multiply.
 *
 * WHEN TO USE:
 * - "Answer at i depends on everything BEFORE i and everything AFTER i" →
 *   one forward pass + one backward pass. (Same shape as trappingRainWater's
 *   leftMax/rightMax — recognizing the shape matters more than the arithmetic.)
 *
 * REAL-WORLD ANALOGY:
 * - Sales dashboards: "total revenue excluding this region" for every region,
 *   without re-summing everything n times.
 *
 * COMPLEXITY LADDER (n = nums.length):
 *   Step 1  Brute force (re-multiply per i)   Time O(n²)   Space O(1)
 *   Step 2  Division shortcut (NOT allowed)    Time O(n)    breaks on zeros!
 *   Step 3  Prefix + suffix arrays             Time O(n)    Space O(n)
 *   Step 4  Two passes over the output ★       Time O(n)    Space O(1) extra
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: for each position, multiply everything else.
 * ----------------------------------------------------------------------------
 * The most direct reading. Correct, and the version you should be able to
 * write in two minutes.
 *
 * Why it's slow: for position i we re-multiply almost the same numbers we
 * multiplied for position i-1. The inner loop redoes work the previous
 * iteration already knew.
 *
 * Time: O(n²). Space: O(1) beyond output.
 */
export function productExceptSelfBruteForce(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n);

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      if (j !== i) product *= nums[j]; // multiply everyone except me
    }
    answer[i] = product;
  }
  return answer;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — WHY THE "OBVIOUS" DIVISION TRICK IS BANNED
 * ----------------------------------------------------------------------------
 * Idea everyone has first: totalProduct / nums[i]. Two problems:
 *   1. The problem forbids division outright.
 *   2. Even if allowed, a single 0 makes totalProduct 0 and the division
 *      meaningless (and TWO zeros mean every answer is 0). You'd need messy
 *      zero-counting special cases.
 * Interview move: NAME this approach and why it fails, then move on. That
 * sentence is worth points.
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 3 — PREFIX + SUFFIX ARRAYS (the insight, spelled out)
 * ----------------------------------------------------------------------------
 * answer[i] = (product of nums[0..i-1]) × (product of nums[i+1..n-1])
 *           =        prefix[i]          ×         suffix[i]
 * Build each with one pass — no re-multiplication, no division.
 *
 * DRY-RUN on [1,2,3,4]:
 *   prefix  = [1, 1, 2, 6]     (products of everything left of i)
 *   suffix  = [24, 12, 4, 1]   (products of everything right of i)
 *   answer  = [1·24, 1·12, 2·4, 6·1] = [24, 12, 8, 6] ✓
 *
 * Time: O(n). Space: O(n) for the two helper arrays.
 */
export function productExceptSelfPrefixSuffix(nums: number[]): number[] {
  const n = nums.length;
  const prefix = new Array<number>(n);
  const suffix = new Array<number>(n);

  prefix[0] = 1; // nothing to the left of index 0
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];

  suffix[n - 1] = 1; // nothing to the right of the last index
  for (let i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];

  return nums.map((_, i) => prefix[i] * suffix[i]);
}

/**
 * ----------------------------------------------------------------------------
 * STEP 4 ★ — SAME IDEA, O(1) EXTRA SPACE (the interview finish)
 * ----------------------------------------------------------------------------
 * Notice Step 3 never needs the WHOLE prefix/suffix arrays at once — only a
 * running value. Write prefixes INTO the output on the forward pass, then
 * multiply a running suffix into it on the backward pass.
 *
 * Time: O(n). Space: O(1) extra (the output array doesn't count, per LC).
 */
export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n);

  let left = 1; // running product of everything left of i
  for (let i = 0; i < n; i++) {
    answer[i] = left;
    left *= nums[i];
  }

  let right = 1; // running product of everything right of i
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right;
    right *= nums[i];
  }

  return answer;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "for every i, combine everything on both sides of i"
 *    → forward pass + backward pass with running values.
 * 2. Always mention the division approach AND why it fails (banned + zeros) —
 *    it shows you saw the shortcut and understood its flaw.
 * 3. The Step 3 → Step 4 move ("do I need the whole helper array, or just a
 *    running value?") is the same space-squeeze used in DP rolling arrays.
 * 4. Follow-up: "what if updates happen between queries?" → prefix products
 *    become a Fenwick/segment tree conversation.
 */
