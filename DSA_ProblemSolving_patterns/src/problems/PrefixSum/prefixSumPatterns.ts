/**
 * ============================================================================
 * PREFIX SUM PATTERN
 * ============================================================================
 *
 * PATTERN:
 * - Precompute cumulative totals once, then answer any RANGE query in O(1)
 *   by subtracting two of them.
 *
 * ============================================================================
 * ⭐ THE ONE IDENTITY THE WHOLE PATTERN RESTS ON
 * ============================================================================
 *
 *     sum(nums[left..right]) = prefix[right + 1] - prefix[left]
 *
 * where prefix[i] is the sum of the FIRST i elements (so prefix[0] = 0).
 *
 * ⭐ WHY THE ARRAY IS ONE LONGER THAN THE INPUT: that leading 0 represents the
 * empty prefix, and it is what removes every "what if the range starts at
 * index 0?" special case. Sizing prefix as n instead of n+1 is the single most
 * common way to get this pattern wrong — you then need an `if (left === 0)`
 * branch in every query, and it is easy to forget one.
 *
 *   nums   :        3    1    4    1    5
 *   prefix :   0    3    4    8    9   14
 *   index  :   0    1    2    3    4    5
 *
 *   sum(nums[1..3]) = prefix[4] - prefix[1] = 9 - 3 = 6   (1 + 4 + 1) ✓
 *   sum(nums[0..2]) = prefix[3] - prefix[0] = 8 - 0 = 8   (3 + 1 + 4) ✓
 *                                       └── the empty prefix earns its place
 *
 * ============================================================================
 * THE TRADE, STATED PLAINLY
 * ============================================================================
 *   naive : O(1) setup, O(n) per query   → good for ONE query
 *   prefix: O(n) setup, O(1) per query   → good for MANY queries
 *
 * So the recognition cue is not "sum a range" — it is "sum MANY ranges", or
 * "sum ranges repeatedly on unchanging data". If the array is updated between
 * queries, a prefix array has to be rebuilt each time and you want a Fenwick
 * tree or a segment tree instead; say that if asked about updates.
 *
 * ============================================================================
 * THE SECOND, LESS OBVIOUS USE: PREFIX SUM + HASH MAP
 * ============================================================================
 * Counting subarrays with a given property becomes a lookup problem:
 *   "does a subarray sum to k?"  → has some earlier prefix equal to (sum - k)?
 * That variant is what makes prefix sums work with NEGATIVE numbers, where a
 * sliding window is invalid (growing a window can decrease its sum). See
 * `subarraySum` in [`HashMap/hashMapPatterns.ts`](../HashMap/hashMapPatterns.ts)
 * and `findMaxLength` there, plus `longestSubarrayWithSumK` in
 * [`SlidingWindow/`](../SlidingWindow/variableSizeSlidingWindow.ts) which
 * documents exactly why it cannot use a window.
 *
 * ============================================================================
 * WHERE THE REST OF THE PREFIX PROBLEMS LIVE IN THIS REPO
 * ============================================================================
 *   - Product Except Self (LC238) → `Arrays/productExceptSelf.ts` (the same
 *     idea with multiplication, and a prefix/suffix pass instead of one)
 *   - Subarray Sum Equals K (LC560) → `HashMap/hashMapPatterns.ts`
 *   - Contiguous Array (LC525) → `HashMap/hashMapPatterns.ts`
 *   - Longest Subarray with Sum K → `SlidingWindow/`
 *
 * Go counterpart: the `prefixsum` package.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * FIND PIVOT INDEX (LeetCode 724)
 * ----------------------------------------------------------------------------
 * PROBLEM: return the leftmost index where the sum of everything to its LEFT
 * equals the sum of everything to its RIGHT (the pivot itself belongs to
 * neither side). Return -1 if there is none.
 *
 * MENTAL MODEL: you do not need two prefix arrays, or even one. Compute the
 * TOTAL once, then sweep left to right carrying `left`. At index i the right
 * side is whatever is left over:
 *
 *     right = total - left - nums[i]
 *
 * so the test is `left === total - left - nums[i]`. One pass, O(1) space —
 * the prefix "array" has collapsed into a single running variable, which is
 * the usual endgame for this pattern when only one sweep is needed.
 *
 * ⚠️ THE EDGES ARE THE TEST CASES. At index 0 the left side is the EMPTY sum,
 * which is 0 — not "invalid". Likewise the right side is empty at the last
 * index. So [-1, -1, -1, 0, 1, 1] pivots at index 0, and [2, 1, -1] pivots at
 * index 0 as well (0 === 1 + -1). Any implementation that starts the loop at
 * index 1 gets these wrong.
 *
 * DRY-RUN nums = [1, 7, 3, 6, 5, 6], total = 28
 *   i=0: left=0,  right = 28-0-1  = 27  ✗
 *   i=1: left=1,  right = 28-1-7  = 20  ✗
 *   i=2: left=8,  right = 28-8-3  = 17  ✗
 *   i=3: left=11, right = 28-11-6 = 11  ✓ → return 3
 *
 * @example
 * pivotIndex([1, 7, 3, 6, 5, 6]); // 3
 * pivotIndex([1, 2, 3]);          // -1
 * pivotIndex([2, 1, -1]);         // 0  (empty left sum === 0)
 * pivotIndex([]);                 // -1
 *
 * Time: O(n) — two passes, no allocation. Space: O(1).
 */
export function pivotIndex(nums: number[]): number {
    let total = 0;
    for (const n of nums) total += n;

    let left = 0;
    for (let i = 0; i < nums.length; i++) {
        // The right side is whatever the total has left over.
        if (left === total - left - nums[i]) return i;
        left += nums[i];
    }

    return -1;
}

/**
 * ============================================================================
 * RANGE SUM QUERY - IMMUTABLE (LeetCode 303)
 * ============================================================================
 * PROBLEM: given a fixed array, answer many `sumRange(left, right)` queries.
 *
 * THIS IS THE PATTERN IN ITS PUREST FORM, and the reason it is a CLASS rather
 * than a function is the whole point: the O(n) work happens ONCE in the
 * constructor, and every query afterwards is a single subtraction. If this
 * were a plain function it would have to rebuild the prefix array per call and
 * there would be no gain at all.
 *
 * "Immutable" in the title is doing real work — it is the guarantee that lets
 * the prefix array be built once and trusted forever. The mutable follow-up
 * (LC307, Range Sum Query - Mutable) breaks that guarantee: a single update
 * invalidates every prefix entry after it, so an update costs O(n). That is
 * when you move to a Fenwick (binary indexed) tree or a segment tree, both
 * O(log n) for update AND query. Naming that follow-up unprompted is a good
 * signal in an interview.
 *
 * COMPLEXITY, stated as the trade it is:
 *   constructor : O(n) time, O(n) space   — paid once
 *   sumRange    : O(1) time, O(1) space   — paid per query
 *   Over q queries: O(n + q) total, versus O(n·q) for the naive re-summing.
 *
 * @example
 * const store = new NumArray([-2, 0, 3, -5, 2, -1]);
 * store.sumRange(0, 2); //  1  (-2 + 0 + 3)
 * store.sumRange(2, 5); // -1  (3 - 5 + 2 - 1)
 * store.sumRange(0, 5); // -3  (the whole array)
 */
export class NumArray {
    /** prefix[i] = sum of the first i elements; prefix[0] = 0 (empty prefix). */
    private readonly prefix: number[];

    constructor(nums: number[]) {
        // One longer than the input, so index 0 is the empty prefix — see the
        // header for why that removes every left === 0 special case.
        this.prefix = new Array<number>(nums.length + 1).fill(0);

        for (let i = 0; i < nums.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + nums[i];
        }
    }

    /**
     * Inclusive sum of nums[left..right] in O(1).
     * Returns 0 for an inverted or out-of-range window rather than throwing.
     */
    sumRange(left: number, right: number): number {
        if (left > right) return 0;

        // Clamp instead of trusting the caller; an out-of-range index would
        // otherwise read `undefined` and produce NaN, which is far harder to
        // debug than a 0.
        const lo = Math.max(0, left);
        const hi = Math.min(this.prefix.length - 2, right);
        if (lo > hi) return 0;

        return this.prefix[hi + 1] - this.prefix[lo];
    }
}
