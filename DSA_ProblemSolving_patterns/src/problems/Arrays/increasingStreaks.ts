/**
 * ============================================================================
 * HIGHLY PROFITABLE MONTHS — count strictly-increasing runs of length k
 * ============================================================================
 * (The original increasingSequencesOfSizeK.js described this problem and its
 *  approach, but the function body was an EMPTY STUB — implemented here.)
 *
 * PROBLEM STATEMENT:
 * Given stock prices over n months and a parameter k, count the "highly
 * profitable" windows: groups of k CONSECUTIVE months whose prices are
 * strictly increasing.
 *
 *   Input:  prices = [5, 6, 5, 7, 8], k = 3
 *   Output: 1   → only [5,7,8] qualifies ([5,6,5] and [6,5,7] both break)
 *
 * PATTERN:
 * - **Streak counting** — a fixed-size sliding window where the window's
 *   "state" is just the length of the current increasing run. No re-checking:
 *   each adjacent pair `prices[i-1] < prices[i]` is examined exactly once.
 *
 * COMPLEXITY LADDER (n = prices.length):
 *   Step 1  Check every window from scratch   Time O(n·k)  Space O(1)
 *   Step 2  Running streak length ★           Time O(n)    Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: test each of the n−k+1 windows independently.
 * ----------------------------------------------------------------------------
 * Why it's slow: windows starting at i and i+1 share k−2 adjacent-pair
 * comparisons — all recomputed. Same waste as maxSumSubarrayOfSizeK's
 * brute force, different aggregate (streak validity instead of sum).
 *
 * Time: O(n·k). Space: O(1).
 */
export function countIncreasingWindowsBruteForce(prices: number[], k: number): number {
  if (k <= 0 || prices.length < k) return 0;
  if (k === 1) return prices.length; // every single month trivially qualifies

  let count = 0;
  for (let start = 0; start + k <= prices.length; start++) {
    let increasing = true;
    for (let i = start + 1; i < start + k; i++) {
      if (prices[i - 1] >= prices[i]) {
        increasing = false;
        break;
      }
    }
    if (increasing) count++;
  }
  return count;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — RUNNING STREAK: one pass.
 * ----------------------------------------------------------------------------
 * Keep `streak` = length of the strictly-increasing run ENDING at index i.
 *   prices[i-1] < prices[i]  → streak++
 *   otherwise                → streak = 1  (a run of just prices[i])
 * Every time streak reaches at least k, the window ending here qualifies.
 *
 * DRY-RUN on [5, 6, 5, 7, 8], k = 3:
 *   i=0: streak=1
 *   i=1: 5<6 → streak=2
 *   i=2: 6≥5 → streak=1
 *   i=3: 5<7 → streak=2
 *   i=4: 7<8 → streak=3 ≥ k → count=1
 *   → 1 ✓
 *
 * Time: O(n) — each adjacent pair compared once. Space: O(1).
 */
export function countIncreasingWindows(prices: number[], k: number): number {
  if (k <= 0 || prices.length < k) return 0;
  if (k === 1) return prices.length;

  let count = 0;
  let streak = 1; // run ending at the current index

  for (let i = 1; i < prices.length; i++) {
    streak = prices[i - 1] < prices[i] ? streak + 1 : 1;
    if (streak >= k) count++; // one qualifying window ENDS at i
  }
  return count;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "count fixed-length windows satisfying an ADJACENT-PAIR
 *    condition" → track the run length ending at i; window valid ⇔ run ≥ k.
 * 2. The `streak >= k` (not `=== k`) detail: a run of length 5 with k=3
 *    contains THREE qualifying windows (ending at positions 3, 4, 5 of the
 *    run) — the ≥ counts each as its ending index arrives.
 * 3. Same one-pass streak idea powers "longest increasing run", "max
 *    consecutive ones", and vineyard/temperature-run style questions.
 */
