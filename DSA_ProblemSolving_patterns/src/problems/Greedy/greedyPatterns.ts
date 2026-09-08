/**
 * ============================================================================
 * GREEDY PATTERN
 * ============================================================================
 *
 * PATTERN:
 * - Make the locally best choice at each step and never reconsider it.
 * - No table, no backtracking, usually one pass and O(1) extra space.
 *
 * ============================================================================
 * ⭐ THE ONLY HARD PART IS PROVING IT IS ALLOWED
 * ============================================================================
 * Writing a greedy loop is easy. Knowing you are ALLOWED to is the skill,
 * because greedy is wrong far more often than it is right. Two things must
 * hold, and you should be able to say them out loud:
 *
 *   1. GREEDY CHOICE PROPERTY — the locally best move is part of SOME optimal
 *      solution. (Not "the" optimal one; there may be several.)
 *   2. OPTIMAL SUBSTRUCTURE — after committing to that move, what remains is
 *      the same problem on a smaller input.
 *
 * The usual proof shape is an EXCHANGE ARGUMENT: take any optimal solution
 * that disagrees with the greedy choice, swap in the greedy choice, and show
 * the result is still valid and no worse. If you can do that, greedy is safe.
 *
 * ============================================================================
 * ⚠️ WHEN GREEDY FAILS — memorise one counter-example
 * ============================================================================
 * Coin Change with coins {1, 3, 4} and amount 6:
 *   greedy (biggest first) → 4 + 1 + 1 = 3 coins
 *   optimal               → 3 + 3     = 2 coins
 *
 * Taking the biggest coin destroys the remainder's structure, so the greedy
 * choice property fails and you need DP
 * ([`DynamicProgramming/dpPatterns.ts`](../DynamicProgramming/dpPatterns.ts)
 * → `coinChange`). "Greedy fails here, so I need DP" is exactly the sentence
 * an interviewer is listening for.
 *
 * ============================================================================
 * RECOGNITION CUES
 * ============================================================================
 * - "minimum number of X to cover/reach"          → often greedy
 * - "can I reach", "is it possible"               → often greedy reachability
 * - intervals + "keep as many as possible"        → sort by END, then greedy
 * - "maximum/minimum" with a COUNTING constraint  → suspect DP instead
 *
 * ============================================================================
 * WHERE THE REST OF THE GREEDY PROBLEMS LIVE IN THIS REPO
 * ============================================================================
 * This pattern is spread across folders because problems are filed by their
 * dominant shape, not by their technique:
 *   - Jump Game I/II (LC55/45) → `DynamicProgramming/dpPatterns.ts`, where the
 *     doc blocks explain why the DP table collapses to a single integer
 *   - Non-overlapping Intervals (LC435), Min Arrows (LC452)
 *     → `MergeIntervals/mergeIntervals.ts` (sort by END, then sweep)
 *   - Partition Labels (LC763) → `MergeIntervals/mergeIntervals.ts`
 *   - Task Scheduler (LC621) → `Heap/heapPatterns.ts`
 *
 * Go counterpart: the `greedy` package.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * GAS STATION (LeetCode 134)
 * ----------------------------------------------------------------------------
 * PROBLEM: `gas[i]` is the fuel available at station i, `cost[i]` the fuel
 * needed to drive from i to i+1. The stations form a CIRCLE. Return the index
 * to start from to complete one full loop, or -1 if it is impossible. A valid
 * answer is guaranteed to be unique when one exists.
 *
 * ============================================================================
 * 🔑 TWO INDEPENDENT INSIGHTS, AND YOU NEED BOTH
 * ============================================================================
 *
 * INSIGHT 1 — FEASIBILITY IS GLOBAL. A loop is possible if and only if
 *   total(gas) >= total(cost), i.e. sum(gas[i] - cost[i]) >= 0.
 * The reason is simply conservation: driving the whole circle consumes exactly
 * total(cost) and gains exactly total(gas), whatever order you do it in. So
 * one running total answers "is it possible at all?" — and note this is
 * completely independent of WHERE you start.
 *
 * INSIGHT 2 — THE START POINT. Track a running tank from the current
 * candidate start. The moment the tank goes NEGATIVE at station i, no station
 * from the current candidate through i can be a valid start, so jump the
 * candidate to i + 1 and reset the tank.
 *
 * ⭐ WHY THAT JUMP IS SAFE — the part worth being able to defend. Suppose the
 * tank first goes negative when leaving station i, having started at s. Then
 * for every station j between s and i, the stretch s..j did NOT go negative
 * (or we would have failed earlier), so arriving at j with a non-negative
 * tank was better than arriving there with an empty one — yet we still failed
 * before finishing. Starting at j can only be worse, because it reaches i with
 * no more fuel than we had. So every candidate up to i is eliminated at once,
 * and the scan never needs to go back. That is what turns the O(n²)
 * "try every start" into a single pass.
 *
 * ============================================================================
 * DRY-RUN gas = [1,2,3,4,5], cost = [3,4,5,1,2]
 * ============================================================================
 *
 *   i : diff = gas-cost   tank    start   note
 *   0 :  1-3 = -2         -2  →   1       negative, so 0 cannot start
 *   1 :  2-4 = -2         -2  →   2       negative, so 1 cannot start either
 *   2 :  3-5 = -2         -2  →   3       negative again
 *   3 :  4-1 = +3          3       3       surviving
 *   4 :  5-2 = +3          6       3       surviving
 *
 *   total = -2-2-2+3+3 = 0, which is >= 0 → a loop IS possible
 *   answer = 3  ✓  (3 → 4 → 0 → 1 → 2 → 3 completes the circle)
 *
 * ⚠️ THE TOTAL CHECK IS NOT OPTIONAL. Without it, an impossible input still
 * leaves `start` pointing at some index — the last place the tank reset — and
 * you would confidently return a start that cannot finish the loop. The two
 * insights answer different questions: `total` says whether ANY start works,
 * `start` says which one.
 *
 * @example
 * canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]); // 3
 * canCompleteCircuit([2, 3, 4], [3, 4, 3]);             // -1 (not enough fuel)
 * canCompleteCircuit([5], [4]);                         // 0
 *
 * Time:  O(n) — a single pass, no restarts.
 * Space: O(1) — three integers.
 */
export function canCompleteCircuit(gas: number[], cost: number[]): number {
    let total = 0; // INSIGHT 1: is a loop possible at all?
    let tank = 0;  // INSIGHT 2: fuel since the current candidate start
    let start = 0;

    for (let i = 0; i < gas.length; i++) {
        const diff = gas[i] - cost[i];
        total += diff;
        tank += diff;

        // Ran dry: every station from `start` through i is eliminated at once.
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }

    // A negative total means no start can work, whatever `start` now holds.
    return total < 0 ? -1 : start;
}
