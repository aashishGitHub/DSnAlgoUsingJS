/**
 * ============================================================================
 * DYNAMIC PROGRAMMING PATTERN PROBLEMS
 * ============================================================================
 *
 * Core Insight: Solve complex problems by breaking into overlapping subproblems
 *
 * ============================================================================
 * 🎯 PATTERN RECOGNITION - When to use DP?
 * ============================================================================
 *
 * 1. OPTIMAL SUBSTRUCTURE
 *    → Optimal solution contains optimal solutions to subproblems
 *    → "Best way to X" depends on "best way to smaller X"
 *
 * 2. OVERLAPPING SUBPROBLEMS
 *    → Same subproblem solved multiple times
 *    → Without memoization: exponential time
 *    → With memoization: polynomial time
 *
 * 3. KEYWORDS TO LOOK FOR:
 *    → "How many ways...?" (counting)
 *    → "Minimum/Maximum...?" (optimization)
 *    → "Is it possible...?" (feasibility)
 *    → "Longest/Shortest...?" (extremes)
 *
 * ============================================================================
 * 🧠 DP APPROACHES
 * ============================================================================
 *
 * 1. TOP-DOWN (Memoization)
 *    → Start from main problem, recurse to subproblems
 *    → Cache results to avoid recomputation
 *    → More intuitive, but uses call stack
 *
 * 2. BOTTOM-UP (Tabulation)
 *    → Start from smallest subproblems, build up
 *    → Usually more space-efficient
 *    → Often can optimize to O(1) space
 *
 * ============================================================================
 * 🪜 THE FOREVER RECIPE — 5 questions that write ANY DP for you
 * ============================================================================
 *
 * You do NOT need to "spot the trick". You answer these five questions, in
 * this order, out loud, every single time. The answers ARE the code. Every
 * problem in this file has a "RECIPE APPLIED" block showing its five answers,
 * so you can practise the same five questions 30+ times.
 *
 * Q1. WHAT AM I CHOOSING?  → find the choice
 *     At each step, what are my options? "Take this coin, or skip it."
 *     "Climb 1 stair, or 2." "Match these letters, or delete one."
 *     If you cannot name a choice, it is probably not a DP problem.
 *
 * Q2. WHAT DO I HAVE TO REMEMBER?  → the STATE
 *     To know where I am, how many numbers do I need? "Which index I'm at"
 *     is one number. "Which index AND how much budget is left" is two.
 *     ⭐ HOW MANY NUMBERS YOU MUST REMEMBER = HOW MANY DIMENSIONS YOUR TABLE
 *     HAS. One number → dp[i]. Two → dp[i][j]. That is the whole rule.
 *
 * Q3. HOW DOES A BIGGER ANSWER USE SMALLER ANSWERS?  → the TRANSITION
 *     Write ONE line: dp[i] = <something using dp[smaller than i]>.
 *     This line is usually just Q1's choices with a min/max/+ around them.
 *
 * Q4. WHAT IS THE SMALLEST ANSWER I KNOW FOR FREE?  → the BASE CASE
 *     "Zero stairs = 1 way." "Empty string = 0 edits." Get this wrong and
 *     everything above it is wrong, so say it before you write any loop.
 *
 * Q5. IN WHAT ORDER DO I FILL THE TABLE?  → the ORDER
 *     Every cell must be filled AFTER the cells it reads. If dp[i] reads
 *     dp[i-1], go left→right. If it reads dp[i+1], go right→left.
 *
 * Then, where do I write the answer? → usually dp[n] or dp[0][n-1]. Say it
 * out loud too, because "the answer is the last cell" is not always true
 * (sometimes it is the max over the whole table — e.g. Maximal Square).
 *
 * ----------------------------------------------------------------------------
 * THE 4-RUNG LADDER — how to get from "no idea" to optimal, without a leap
 * ----------------------------------------------------------------------------
 * Never jump straight to the clever loop. Climb:
 *
 *   RUNG 1  BRUTE FORCE recursion. Just encode Q1's choice. It is exponential
 *           and that is FINE — it is correct, and it is your reference answer.
 *   RUNG 2  NAME THE WASTE. Point at one specific subproblem that gets
 *           computed twice ("ways(3) is computed on both sides"). This single
 *           sentence is what earns you the right to add a cache.
 *   RUNG 3  MEMOIZE. Add a cache to RUNG 1. Usually a 3-line change, and it
 *           turns exponential into polynomial without changing your thinking.
 *   RUNG 4  TABULATE (loops instead of recursion), then LOOK AT HOW FEW CELLS
 *           YOU ACTUALLY READ. If dp[i] only reads dp[i-1] and dp[i-2], throw
 *           the array away and keep two variables → O(1) space.
 *
 * In an interview: RUNG 1 + RUNG 2 out loud, RUNG 3 on the board (fastest way
 * to a CORRECT solution), then offer RUNG 4 as the follow-up optimization.
 *
 * ⭐ IF YOU REMEMBER NOTHING ELSE:
 *    FIND THE CHOICE → NAME WHAT YOU MUST REMEMBER → WRITE ONE LINE OF
 *    RECURRENCE → CACHE IT → THEN SHRINK THE TABLE.
 *
 * ============================================================================
 * 📊 COMMON DP CATEGORIES
 * ============================================================================
 *
 * | Category          | Examples                        | Typical Recurrence    |
 * |-------------------|---------------------------------|-----------------------|
 * | 1D Linear         | Climbing Stairs, House Robber   | dp[i] = f(dp[i-1], dp[i-2]) |
 * | 2D Grid           | Unique Paths, Min Path Sum      | dp[i][j] = f(up, left) |
 * | String            | LCS, Edit Distance, Word Break  | dp[i][j] = f(chars match?) |
 * | Knapsack          | Coin Change, Subset Sum         | dp[i] = f(include/exclude) |
 * | Interval          | Matrix Chain, Burst Balloons    | dp[i][j] = f(split point k) |
 *
 * Time Complexity: Usually O(n), O(n²), or O(n³)
 * Space Complexity: O(n) or O(n²), often optimizable
 */

/**
 * ============================================================================
 * 1. Climbing Stairs (LeetCode 70) - THE CLASSIC DP INTRO
 * ============================================================================
 *
 * You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps.
 * How many distinct ways can you reach the top?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Your LAST move was either a 1-stair step or a 2-stair step.
 *                That is it. Two options, nothing else to decide.
 * Q2 STATE       "Which stair am I standing on" — ONE number → 1D dp[i].
 * Q3 TRANSITION  dp[i] = dp[i-1] + dp[i-2]
 *                ⭐ Note the PLUS. We are COUNTING ways, so the two options are
 *                ADDED. If the question asked for the cheapest climb we would
 *                take a min instead. Counting → add; optimising → min/max.
 * Q4 BASE CASE   dp[1] = 1, dp[2] = 2. (Say these out loud before looping.)
 * Q5 ORDER       i = 3 upward, because dp[i] reads smaller i.
 * ANSWER         dp[n] — held in `prev1` after the roll to O(1) space.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. DECISION PATHS: How many ways to complete a multi-step process
 *    - Payment options: pay in 1 or 2 installments
 *    - Route planning: take 1 or 2 stops at a time
 *
 * 2. FIBONACCI IN DISGUISE: This IS the Fibonacci sequence!
 *    - n=1: 1 way  (1)
 *    - n=2: 2 ways (1+1, 2)
 *    - n=3: 3 ways (1+1+1, 1+2, 2+1) = fib(3)
 *    - n=4: 5 ways = fib(4)
 *
 * ============================================================================
 * VISUALIZATION - Building up from smaller problems
 * ============================================================================
 *
 * n = 5 stairs
 *
 *       🏁 TOP (step 5)
 *      ┌───┐
 *    ┌─┤ 5 │ ways(5) = ways(4) + ways(3) = 5 + 3 = 8
 *    │ └───┘
 *    │ ┌───┐
 *    ├─┤ 4 │ ways(4) = ways(3) + ways(2) = 3 + 2 = 5
 *    │ └───┘
 *    │ ┌───┐
 *    ├─┤ 3 │ ways(3) = ways(2) + ways(1) = 2 + 1 = 3
 *    │ └───┘
 *    │ ┌───┐
 *    ├─┤ 2 │ ways(2) = 2 (either 1+1 or 2)
 *    │ └───┘
 *    │ ┌───┐
 *    └─┤ 1 │ ways(1) = 1 (only one way: take 1 step)
 *      └───┘
 *      🚶 START
 *
 * Step-by-step for n=4:
 * ┌──────────────────────────────────────────────────────────┐
 * │ Step 1: ways[1] = 1                                      │
 * │ Step 2: ways[2] = 2                                      │
 * │ Step 3: ways[3] = ways[2] + ways[1] = 2 + 1 = 3          │
 * │ Step 4: ways[4] = ways[3] + ways[2] = 3 + 2 = 5 ✨        │
 * └──────────────────────────────────────────────────────────┘
 *
 * The 5 ways to climb 4 stairs:
 *   1. 1+1+1+1    2. 1+1+2    3. 1+2+1    4. 2+1+1    5. 2+2
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Why does this work?
 * ============================================================================
 *
 * To reach step n, you MUST have come from either:
 *   - Step n-1 (took 1 step), OR
 *   - Step n-2 (took 2 steps)
 *
 * So: ways(n) = ways(n-1) + ways(n-2)
 *
 * This IS the Fibonacci recurrence! 🎯
 *
 * ============================================================================
 * SPACE OPTIMIZATION: O(n) → O(1)
 * ============================================================================
 *
 * We only need the previous TWO values, not the entire array!
 *
 * Instead of: dp = [1, 2, 3, 5, 8, ...]
 * We use:     prev2, prev1, current (just 3 variables)
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 2 variables (optimized from O(n))
 */
/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE (the rung before `climbStairs` below)
 * ----------------------------------------------------------------------------
 * Encode the choice and nothing else: from step n you arrived from n-1 or n-2.
 * Correct, and unusable past n ≈ 40.
 *
 * NAME THE WASTE: ways(5) calls ways(4) and ways(3); ways(4) calls ways(3)
 * AGAIN. The whole left subtree of ways(3) is recomputed from scratch. That
 * single observation — an overlapping subproblem — is what licenses a cache.
 *
 * @example
 * climbStairsBruteForce(5); // 8
 *
 * Time: O(2ⁿ). Space: O(n) call stack.
 */
export function climbStairsBruteForce(n: number): number {
  // Same base cases as the canonical `climbStairs` below: 1 step = 1 way,
  // 2 steps = 2 ways. (LeetCode guarantees n >= 1.)
  if (n <= 2) return n;
  return climbStairsBruteForce(n - 1) + climbStairsBruteForce(n - 2);
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — MEMOIZE (same recursion, one cache — O(2ⁿ) → O(n))
 * ----------------------------------------------------------------------------
 * @example
 * climbStairsMemo(45); // 1836311903
 *
 * Time: O(n). Space: O(n).
 */
export function climbStairsMemo(n: number): number {
  const memo = new Map<number, number>();

  function ways(step: number): number {
    if (step <= 2) return step; // matches `climbStairs` exactly
    if (memo.has(step)) return memo.get(step)!;

    const total = ways(step - 1) + ways(step - 2);
    memo.set(step, total);
    return total;
  }

  return ways(n);
}

/**
 * STEP 3 — TABULATE + ROLL TO O(1) ★ OPTIMAL (below).
 */
export function climbStairs(n: number): number {
  // Base cases: 1 step = 1 way, 2 steps = 2 ways
  if (n <= 2) return n;

  // Only need previous two values (space optimization)
  let prev2 = 1; // ways to reach step 1
  let prev1 = 2; // ways to reach step 2

  // Build up from step 3 to step n
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2; // ways(i) = ways(i-1) + ways(i-2)
    prev2 = prev1; // shift window
    prev1 = current;
  }

  return prev1;
}

/**
 * ============================================================================
 * 2. House Robber (LeetCode 198) - INCLUDE/EXCLUDE PATTERN
 * ============================================================================
 *
 * You're a robber planning to rob houses along a street. Adjacent houses have
 * connected security systems - robbing two adjacent houses triggers the alarm.
 * Return the maximum amount you can rob without alerting the police.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      At house i: ROB it (then you must have skipped i-1, so add the
 *                best from i-2), or SKIP it (keep the best from i-1).
 * Q2 STATE       "Which house am I deciding on" — ONE number → 1D dp[i].
 * Q3 TRANSITION  dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *                           └ skip ┘   └──── rob ────┘
 * Q4 BASE CASE   dp[0] = nums[0], dp[1] = max(nums[0], nums[1]).
 * Q5 ORDER       i = 2 upward.
 * ANSWER         dp[n-1] — held in `prev1`.
 *
 * ⭐ THE TAKE-OR-SKIP SHAPE: this exact `max(skip, take + dp[two back])` line
 * reappears in 0/1 knapsack (#22), Partition Equal Subset Sum (#23) and Target
 * Sum (#24). Learn it here, where it is only one line long.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. SCHEDULING CONFLICTS:
 *    - Select non-overlapping jobs for maximum profit
 *    - Choose talks at a conference (can't attend back-to-back)
 *
 * 2. RESOURCE ALLOCATION:
 *    - Assign tasks where consecutive tasks can't be done together
 *    - Rest days between workouts (can't do intense training daily)
 *
 * 3. ADVERTISING:
 *    - Place ads with minimum gap between impressions
 *    - Select billboards along highway (minimum distance apart)
 *
 * ============================================================================
 * VISUALIZATION - The Decision at Each House
 * ============================================================================
 *
 * Houses: [2, 7, 9, 3, 1]
 *
 *         🏠      🏠      🏠      🏠      🏠
 *         $2      $7      $9      $3      $1
 *          0       1       2       3       4
 *
 * At each house, we ask: "Rob this house, or skip it?"
 *
 * ┌───────┬───────────────────────────────────────────────────────────────────┐
 * │ House │ Decision                                                          │
 * ├───────┼───────────────────────────────────────────────────────────────────┤
 * │   0   │ Rob it! Best so far: $2                                           │
 * │       │ dp[0] = 2                                                         │
 * ├───────┼───────────────────────────────────────────────────────────────────┤
 * │   1   │ Rob $7 (skip house 0) OR skip (keep $2)?                          │
 * │       │ max(7, 2) = 7                                                     │
 * │       │ dp[1] = 7                                                         │
 * ├───────┼───────────────────────────────────────────────────────────────────┤
 * │   2   │ Rob $9 + dp[0]=$2 = $11  OR  skip (keep dp[1]=$7)?                │
 * │       │ max(9+2, 7) = max(11, 7) = 11 ✨                                   │
 * │       │ dp[2] = 11                                                        │
 * ├───────┼───────────────────────────────────────────────────────────────────┤
 * │   3   │ Rob $3 + dp[1]=$7 = $10  OR  skip (keep dp[2]=$11)?               │
 * │       │ max(3+7, 11) = max(10, 11) = 11                                   │
 * │       │ dp[3] = 11                                                        │
 * ├───────┼───────────────────────────────────────────────────────────────────┤
 * │   4   │ Rob $1 + dp[2]=$11 = $12  OR  skip (keep dp[3]=$11)?              │
 * │       │ max(1+11, 11) = max(12, 11) = 12 ✨                                │
 * │       │ dp[4] = 12                                                        │
 * └───────┴───────────────────────────────────────────────────────────────────┘
 *
 * Answer: $12 (rob houses 0, 2, 4: $2 + $9 + $1 = $12)
 *
 * Verify against the alternatives:
 *   $2 + $9 + $1 = $12  ← best
 *   $7 + $3      = $10
 *   $2 + $9      = $11
 * So $12 is correct ✨
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: The Include/Exclude Pattern
 * ============================================================================
 *
 * At each house i, you have exactly TWO choices:
 *
 *   1. ROB this house: Take nums[i] + best from 2 houses ago (dp[i-2])
 *      (Can't take dp[i-1] because that's adjacent!)
 *
 *   2. SKIP this house: Keep the best from previous house (dp[i-1])
 *
 * Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *
 *   "Best up to house i" = max("Skip this house", "Rob this house")
 *
 * ============================================================================
 * SPACE OPTIMIZATION: O(n) → O(1)
 * ============================================================================
 *
 * Only need previous TWO values, not entire array:
 *   - prev2 = best up to 2 houses ago
 *   - prev1 = best up to previous house
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 2 variables
 */
export function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  // prev2 = best from 2 houses ago, prev1 = best from previous house
  let prev2 = nums[0];
  let prev1 = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    // Choice: skip this house (prev1) OR rob it (prev2 + nums[i])
    const current = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

/**
 * ============================================================================
 * 3. House Robber II (LeetCode 213) - CIRCULAR DP
 * ============================================================================
 *
 * Same as House Robber, but houses are arranged in a CIRCLE.
 * First and last houses are adjacent - can't rob both!
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Same rob-or-skip as #2, plus ONE decision made before any
 *                looping: the first and last house are now neighbours, so at
 *                most one of them can be robbed.
 * Q2 STATE       ⭐ Unchanged from #2 — and that is the whole point. Rather than
 *                inventing a circular state, you REDUCE to the problem you have
 *                already solved: run the linear robber twice.
 * Q3 TRANSITION  Identical to #2, applied to two ranges:
 *                   range A = houses 0 … n-2  (exclude the last)
 *                   range B = houses 1 … n-1  (exclude the first)
 * Q4 BASE CASE   Same as #2 within each range; n <= 2 handled directly.
 * Q5 ORDER       Same as #2, once per range.
 * ANSWER         max(rangeA, rangeB).
 *
 * ⭐ TURNING A NEW PROBLEM INTO ONE YOU OWN is the most valuable move in this
 * whole file — worth more than any single recurrence.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. CIRCULAR SEATING:
 *    - Assign alternating seats at a round table
 *    - Schedule shifts for circular manufacturing line
 *
 * 2. RING NETWORKS:
 *    - Select non-adjacent nodes in a ring topology
 *    - Place base stations with minimum interference
 *
 * ============================================================================
 * VISUALIZATION - The Circular Problem
 * ============================================================================
 *
 * Houses in a circle: [2, 3, 2]
 *
 *        🏠 House 0 ($2)
 *         ╱         ╲
 *        ╱   CIRCLE  ╲
 *       ╱             ╲
 *  🏠 House 2 ($2) ─── 🏠 House 1 ($3)
 *
 * Problem: If we rob House 0, we CAN'T rob House 2 (they're neighbors!)
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Break the Circle into Two Linear Problems
 * ============================================================================
 *
 * Since first and last are adjacent, we can't rob BOTH.
 * So we solve TWO separate linear problems:
 *
 *   1. INCLUDE first house, EXCLUDE last:  rob houses [0, 1, ..., n-2]
 *   2. EXCLUDE first house, INCLUDE last:  rob houses [1, 2, ..., n-1]
 *
 * Answer = max(case1, case2)
 *
 * Example: [2, 3, 2]
 *
 *   Case 1: Rob [2, 3] (exclude last)
 *           → max(2, 3) = 3
 *
 *   Case 2: Rob [3, 2] (exclude first)
 *           → max(3, 2) = 3
 *
 *   Answer: max(3, 3) = 3 ✨
 *
 * ============================================================================
 * VISUALIZATION - Breaking the Circle
 * ============================================================================
 *
 * Original:  🏠─🏠─🏠─🏠─🏠
 *             0  1  2  3  4
 *             └─────────────┘  (0 and 4 are connected!)
 *
 * Case 1:   🏠─🏠─🏠─🏠      (houses 0-3, exclude house 4)
 *            0  1  2  3
 *
 * Case 2:      🏠─🏠─🏠─🏠   (houses 1-4, exclude house 0)
 *               1  2  3  4
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - two linear passes
 * Space: O(1) - only 2 variables per pass
 */
export function rob2(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return Math.max(nums[0], nums[1]);

  // Case 1: Rob houses 0 to n-2 (include first, exclude last)
  const robFirst = robHelper(nums, 0, nums.length - 2);

  // Case 2: Rob houses 1 to n-1 (exclude first, include last)
  const robLast = robHelper(nums, 1, nums.length - 1);

  // Take the better of the two cases
  return Math.max(robFirst, robLast);
}

/**
 * Helper: Standard linear house robber on a subarray
 * @param nums - house values
 * @param start - start index (inclusive)
 * @param end - end index (inclusive)
 */
function robHelper(nums: number[], start: number, end: number): number {
  let prev2 = 0;
  let prev1 = 0;

  for (let i = start; i <= end; i++) {
    const current = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

/**
 * ============================================================================
 * 4. Longest Increasing Subsequence (LeetCode 300) - CLASSIC SUBSEQUENCE DP
 * ============================================================================
 *
 * Given an integer array nums, return the length of the longest strictly
 * increasing subsequence. (Subsequence = not necessarily contiguous!)
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      For each earlier index j < i with nums[j] < nums[i]: extend
 *                the run that ENDS at j, or do not.
 * Q2 STATE       ⭐ dp[i] = the length of the longest increasing run that ENDS
 *                EXACTLY AT i. Anchoring the state at "ending here" is what
 *                makes the transition a simple scan of earlier indices. The same
 *                trick powers Kadane (#14) and Maximal Square (#28).
 * Q3 TRANSITION  dp[i] = max(dp[i], dp[j] + 1) for every valid j.
 * Q4 BASE CASE   dp[i] = 1 — any single element is a run of length 1.
 * Q5 ORDER       i upward; j scans everything before i.
 * ANSWER         ⚠️ NOT dp[n-1]. The longest run can end anywhere, so the answer
 *                is the MAX OVER THE WHOLE dp ARRAY. Reaching for the last cell
 *                out of habit is the classic wrong answer here.
 *
 * 🔗 See #32 (`lengthOfLISPatience`) for the O(n log n) follow-up.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. STOCK TRADING:
 *    - Find longest sequence of increasing stock prices
 *    - Identify sustained growth periods
 *
 * 2. VERSION CONTROL:
 *    - Find longest chain of compatible software versions
 *    - Dependency resolution (each depends on lower version)
 *
 * 3. CAREER PROGRESSION:
 *    - Longest sequence of promotions (salary increases)
 *    - Project milestones with increasing complexity
 *
 * 4. SCHEDULING:
 *    - Chain of tasks where each needs more resources than previous
 *    - Stacking boxes (each bigger than the one below)
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * nums = [10, 9, 2, 5, 3, 7, 101, 18]
 *
 * dp[i] = length of LIS ending at index i
 *
 * ┌──────┬───────┬─────────────────────────────────────────────────────────────┐
 * │  i   │nums[i]│  Calculation                                                │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  0   │  10   │  dp[0] = 1 (just itself)                                    │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  1   │   9   │  Check j=0: 10 > 9? No, can't extend                        │
 * │      │       │  dp[1] = 1                                                  │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  2   │   2   │  Check j=0,1: None < 2                                      │
 * │      │       │  dp[2] = 1                                                  │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  3   │   5   │  Check j=0: 10 < 5? No                                      │
 * │      │       │  Check j=1: 9 < 5? No                                       │
 * │      │       │  Check j=2: 2 < 5? YES! dp[3] = dp[2] + 1 = 2 ✨            │
 * │      │       │  dp[3] = 2  (subsequence: [2, 5])                           │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  4   │   3   │  Check j=2: 2 < 3? YES! dp[4] = dp[2] + 1 = 2               │
 * │      │       │  dp[4] = 2  (subsequence: [2, 3])                           │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  5   │   7   │  Check j=2: 2 < 7? YES! dp[5] = max(1, dp[2]+1) = 2         │
 * │      │       │  Check j=3: 5 < 7? YES! dp[5] = max(2, dp[3]+1) = 3 ✨      │
 * │      │       │  Check j=4: 3 < 7? YES! dp[5] = max(3, dp[4]+1) = 3         │
 * │      │       │  dp[5] = 3  (subsequence: [2, 5, 7] or [2, 3, 7])           │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  6   │  101  │  All previous < 101, best is dp[5] + 1 = 4 ✨               │
 * │      │       │  dp[6] = 4  (subsequence: [2, 5, 7, 101])                   │
 * ├──────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  7   │  18   │  Check j=5: 7 < 18? YES! dp[7] = dp[5] + 1 = 4              │
 * │      │       │  dp[7] = 4  (subsequence: [2, 5, 7, 18])                    │
 * └──────┴───────┴─────────────────────────────────────────────────────────────┘
 *
 * Final dp = [1, 1, 1, 2, 2, 3, 4, 4]
 * Answer: max(dp) = 4
 *
 * One LIS: [2, 5, 7, 101] or [2, 3, 7, 18] or [2, 5, 7, 18]
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: "What's the best I can extend?"
 * ============================================================================
 *
 * For each element, look at ALL previous elements:
 *   - If nums[j] < nums[i], we CAN extend the subsequence ending at j
 *   - Take the maximum: dp[i] = max(dp[i], dp[j] + 1)
 *
 * Recurrence: dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n²) - nested loops (can be O(n log n) with binary search!)
 * Space: O(n) - dp array
 *
 * Note: O(n log n) solution uses binary search with a "tails" array
 */
export function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  // dp[i] = length of LIS ending at index i
  const dp = new Array(nums.length).fill(1);
  let maxLength = 1;

  for (let i = 1; i < nums.length; i++) {
    // Check all previous elements
    for (let j = 0; j < i; j++) {
      // Can we extend the subsequence ending at j?
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }

  return maxLength;
}

/**
 * ============================================================================
 * 5. Longest Common Subsequence (LeetCode 1143) - 2D STRING DP
 * ============================================================================
 *
 * Given two strings, return the length of their longest common subsequence.
 * A subsequence is a sequence derived by deleting some (or no) elements
 * without changing the order of remaining elements.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Look at the last character of each prefix. If they MATCH,
 *                consume both and add 1. If they do not, you must give up one
 *                character — try dropping it from the first string, then from
 *                the second, and keep whichever pays better.
 * Q2 STATE       "How much of string 1 have I used" AND "how much of string 2"
 *                — TWO numbers → 2D dp[i][j].
 * Q3 TRANSITION  match    → dp[i][j] = dp[i-1][j-1] + 1
 *                no match → dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * Q4 BASE CASE   dp[0][*] = dp[*][0] = 0 — an empty string shares nothing.
 *                (The table is (m+1)x(n+1) so row/column 0 IS the base case and
 *                needs no special-casing inside the loop. Padding a DP table by
 *                one is a habit worth copying.)
 * Q5 ORDER       i and j both upward.
 * ANSWER         dp[m][n].
 *
 * ⚠️ THE OFF-BY-ONE: dp indices are 1-based over a 0-based string, so the
 * characters compared are text1[i-1] and text2[j-1], never text1[i].
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. DIFF TOOLS (git diff):
 *    - Find common lines between two file versions
 *    - LCS shows what stayed the same; the rest is additions/deletions
 *
 * 2. DNA SEQUENCE ALIGNMENT:
 *    - Find common genetic sequences between species
 *    - Identify evolutionary relationships
 *
 * 3. PLAGIARISM DETECTION:
 *    - Find common subsequences between documents
 *    - Longer LCS = more similarity
 *
 * 4. SPELL CHECKING:
 *    - Suggest corrections based on longest common parts
 *    - "recieve" vs "receive" - LCS helps measure similarity
 *
 * ============================================================================
 * VISUALIZATION - 2D DP Table
 * ============================================================================
 *
 * text1 = "abcde", text2 = "ace"
 *
 * Build a 2D table where dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
 *
 *         ""    a     c     e
 *     ┌─────┬─────┬─────┬─────┐
 *  "" │  0  │  0  │  0  │  0  │
 *     ├─────┼─────┼─────┼─────┤
 *  a  │  0  │  1  │  1  │  1  │  ← 'a' matches 'a'
 *     ├─────┼─────┼─────┼─────┤
 *  b  │  0  │  1  │  1  │  1  │  ← 'b' doesn't match, carry forward
 *     ├─────┼─────┼─────┼─────┤
 *  c  │  0  │  1  │  2  │  2  │  ← 'c' matches 'c' → 1+1=2
 *     ├─────┼─────┼─────┼─────┤
 *  d  │  0  │  1  │  2  │  2  │  ← 'd' doesn't match
 *     ├─────┼─────┼─────┼─────┤
 *  e  │  0  │  1  │  2  │  3  │  ← 'e' matches 'e' → 2+1=3 ✨
 *     └─────┴─────┴─────┴─────┘
 *
 * Answer: dp[5][3] = 3
 * The LCS is "ace"
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Match or Skip
 * ============================================================================
 *
 * At each cell (i, j), we compare text1[i-1] with text2[j-1]:
 *
 *   IF characters MATCH:
 *      dp[i][j] = dp[i-1][j-1] + 1
 *      (Extend the LCS we had before this character)
 *
 *   IF characters DON'T MATCH:
 *      dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 *      (Take the better of: skip char from text1, or skip char from text2)
 *
 * Visual of the decision:
 *
 *      dp[i-1][j-1]  dp[i-1][j]
 *            ↖          ↑
 *              ╲        │
 *      dp[i][j-1] → dp[i][j]
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m × n) - fill the 2D table
 * Space: O(m × n) - the 2D table (can optimize to O(min(m,n)))
 */
export function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
  // Extra row/col for empty string base case
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        // Characters match! Extend the LCS
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // No match - take the better of skipping either character
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * ============================================================================
 * 6. Word Break (LeetCode 139) - STRING SEGMENTATION DP
 * ============================================================================
 *
 * Given a string s and a dictionary wordDict, return true if s can be
 * segmented into space-separated dictionary words.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      "Where does the LAST word start?" Try every split point j and
 *                ask: is the front part s[0..j] already known-breakable AND is
 *                the remaining chunk s[j..i] a dictionary word?
 * Q2 STATE       "How many characters have I consumed" — ONE number → 1D
 *                dp[i], and it holds a BOOLEAN, not a count.
 * Q3 TRANSITION  dp[i] = OR over all j < i of (dp[j] && s.slice(j,i) in dict)
 *                Feasibility questions ("can it be done") use OR the way
 *                counting questions use + and optimisation uses min/max.
 * Q4 BASE CASE   dp[0] = true — the empty string is trivially breakable. This
 *                seed is what every other cell is ultimately built on.
 * Q5 ORDER       i upward from 1; every j is smaller, so already decided.
 * ANSWER         dp[s.length].
 *
 * The `break` in the inner loop is not an optimisation of the logic — once one
 * valid split is found, dp[i] is already true and nothing can improve on it.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. TEXT SEGMENTATION:
 *    - Break concatenated text into words (no spaces)
 *    - Example: "ilovecoding" → "i love coding"
 *
 * 2. URL PARSING:
 *    - Split domain-like strings: "stackoverflow" → "stack overflow"
 *    - Parse hashtags: "#machinelearning" → "machine learning"
 *
 * 3. KEYBOARD AUTOCOMPLETE:
 *    - Segment user input without spaces
 *    - Suggest word boundaries
 *
 * 4. LANGUAGE PROCESSING:
 *    - Chinese/Japanese text (no spaces between words)
 *    - Named entity recognition
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * s = "leetcode", wordDict = ["leet", "code"]
 *
 * dp[i] = true if s[0..i-1] can be segmented into dictionary words
 *
 *   String:    l   e   e   t   c   o   d   e
 *   Index:     0   1   2   3   4   5   6   7
 *   dp index:  1   2   3   4   5   6   7   8
 *
 * ┌───────┬─────────────────────────────────────────────────────────────────────┐
 * │ i     │ Check                                                               │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[0] │ true (empty string is valid base case)                              │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[1] │ s[0:1]="l" in dict? No → false                                      │
 * │ dp[2] │ s[0:2]="le" in dict? No → false                                     │
 * │ dp[3] │ s[0:3]="lee" in dict? No → false                                    │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[4] │ s[0:4]="leet" in dict? YES! And dp[0]=true                          │
 * │       │ dp[4] = true ✨                                                      │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[5] │ s[0:5]="leetc"? No, s[4:5]="c"? No → false                          │
 * │ dp[6] │ s[0:6]="leetco"? No, s[4:6]="co"? No → false                        │
 * │ dp[7] │ s[0:7]="leetcod"? No, s[4:7]="cod"? No → false                      │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[8] │ s[4:8]="code" in dict? YES! And dp[4]=true                          │
 * │       │ dp[8] = true ✨ ANSWER!                                              │
 * └───────┴─────────────────────────────────────────────────────────────────────┘
 *
 * Answer: true ("leet" + "code")
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: "Is there a valid split point?"
 * ============================================================================
 *
 * For each position i, check ALL possible split points j:
 *   - Is s[0..j-1] valid? (dp[j] = true)
 *   - Is s[j..i-1] in the dictionary?
 *   - If BOTH yes → dp[i] = true
 *
 * Recurrence: dp[i] = true if ∃ j where dp[j]=true AND s[j:i] in dict
 *
 * Visual:
 *   s = "leetcode"
 *        └────┘ └────┘
 *         leet   code
 *         j=0    j=4
 *       dp[4]=T  in dict
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n² × k) - n positions, n split points, k = avg word length for substring
 * Space: O(n) - dp array
 */
export function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict); // O(1) lookup
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // Empty string is valid

  for (let i = 1; i <= s.length; i++) {
    // Try all possible split points
    for (let j = 0; j < i; j++) {
      // If s[0..j-1] is valid AND s[j..i-1] is in dictionary
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break; // Found one valid segmentation, no need to continue
      }
    }
  }

  return dp[s.length];
}

/**
 * ============================================================================
 * 7. Coin Change (LeetCode 322) - UNBOUNDED KNAPSACK PATTERN
 * ============================================================================
 *
 * Given coin denominations and a target amount, return the MINIMUM number
 * of coins needed to make that amount. (Unlimited coins of each type!)
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      "Which coin do I use LAST?" Try each denomination.
 * Q2 STATE       "How much amount is still left to build" — ONE number → 1D
 *                dp[amount]. Coins are REUSABLE, so you never need to remember
 *                which ones you already spent. (Contrast #22, 0/1 knapsack,
 *                where reuse is banned and the state grows a dimension.)
 * Q3 TRANSITION  dp[i] = min(dp[i - coin] + 1) over every coin that fits.
 * Q4 BASE CASE   dp[0] = 0 — zero coins make zero.
 * Q5 ORDER       i = 1 upward; i - coin is always smaller, so already solved.
 * ANSWER         dp[amount], or -1 if it is still Infinity (unreachable).
 *
 * ⚠️ WHY GREEDY FAILS — say this out loud in an interview: with coins {1,3,4}
 * and amount 6, biggest-first gives 4+1+1 = 3 coins, but 3+3 = 2 is optimal.
 * Only trying every coin at every amount finds it. Infinity is used as the
 * "no way to build this" sentinel so min() naturally ignores it.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. CASH REGISTER / ATM:
 *    - Dispense minimum bills/coins for withdrawal
 *    - Optimize change given to customers
 *
 * 2. CURRENCY EXCHANGE:
 *    - Minimum transactions to convert currencies
 *    - Optimal denomination selection
 *
 * 3. RESOURCE ALLOCATION:
 *    - Minimum servers to handle workload (server sizes vary)
 *    - Minimum containers to ship cargo
 *
 * 4. TIME SCHEDULING:
 *    - Minimum meeting slots (30min, 1hr, 2hr) to cover duration
 *    - Minimum number of shifts to cover hours
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * coins = [1, 2, 5], amount = 11
 *
 * dp[i] = minimum coins to make amount i
 *
 * ┌────────┬───────────────────────────────────────────────────────────────────┐
 * │ Amount │ Calculation                                                       │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │   0    │ dp[0] = 0 (base case: 0 coins for amount 0)                       │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │   1    │ Use coin 1: dp[1-1] + 1 = dp[0] + 1 = 1                           │
 * │        │ dp[1] = 1  (one $1 coin)                                          │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │   2    │ Use coin 1: dp[2-1] + 1 = dp[1] + 1 = 2                           │
 * │        │ Use coin 2: dp[2-2] + 1 = dp[0] + 1 = 1 ← Better!                 │
 * │        │ dp[2] = 1  (one $2 coin)                                          │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │   3    │ Use coin 1: dp[2] + 1 = 2                                         │
 * │        │ Use coin 2: dp[1] + 1 = 2                                         │
 * │        │ dp[3] = 2  ($2 + $1 or $1 + $1 + $1... but 2 is better)           │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │   5    │ Use coin 1: dp[4] + 1 = 3                                         │
 * │        │ Use coin 2: dp[3] + 1 = 3                                         │
 * │        │ Use coin 5: dp[0] + 1 = 1 ← Best!                                 │
 * │        │ dp[5] = 1  (one $5 coin) ✨                                        │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │  ...   │ ...                                                               │
 * ├────────┼───────────────────────────────────────────────────────────────────┤
 * │  11    │ Use coin 1: dp[10] + 1 = 3                                        │
 * │        │ Use coin 2: dp[9] + 1 = 4                                         │
 * │        │ Use coin 5: dp[6] + 1 = 3                                         │
 * │        │ dp[11] = 3  ($5 + $5 + $1) ✨                                      │
 * └────────┴───────────────────────────────────────────────────────────────────┘
 *
 * Answer: 3 coins ($5 + $5 + $1 = $11)
 *
 * Full dp array:
 *   Amount:  0  1  2  3  4  5  6  7  8  9  10  11
 *   dp:      0  1  1  2  2  1  2  2  3  3   2   3
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: "What's the best coin to use last?"
 * ============================================================================
 *
 * For each amount i, try using each coin denomination:
 *   - If we use coin c, we need dp[i-c] coins for the remainder, plus 1 for c
 *   - Take the minimum across all valid coin choices
 *
 * Recurrence: dp[i] = 1 + min(dp[i-c]) for all coins c where c ≤ i
 *
 * Why UNBOUNDED KNAPSACK?
 *   - We can use each coin UNLIMITED times
 *   - Unlike 0/1 knapsack where each item used once
 *
 * ============================================================================
 * EDGE CASES
 * ============================================================================
 * - Amount = 0 → 0 coins needed
 * - Impossible to make amount → return -1 (e.g., coins=[2], amount=3)
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(amount × numCoins) - for each amount, try all coins
 * Space: O(amount) - dp array
 */
/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE (the rung before `coinChange` below)
 * ----------------------------------------------------------------------------
 * Try every coin at every step and keep the shallowest success. Correct, and
 * exponential: the same `remaining` is re-solved through many different coin
 * orders — 5 then 2 and 2 then 5 both land on the same subproblem.
 *
 * Returns Infinity internally for "unreachable" so Math.min composes cleanly;
 * the -1 that LeetCode wants is applied once at the boundary.
 *
 * @example
 * coinChangeBruteForce([1, 2, 5], 11); // 3  (5 + 5 + 1)
 *
 * Time: O(amountⁿ). Space: O(amount) call stack.
 */
export function coinChangeBruteForce(coins: number[], amount: number): number {
  function fewest(remaining: number): number {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity; // overshot this branch

    let best = Infinity;
    for (const coin of coins) {
      best = Math.min(best, 1 + fewest(remaining - coin));
    }
    return best;
  }

  const answer = fewest(amount);
  return answer === Infinity ? -1 : answer;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — MEMOIZE (top-down; the fastest route to a CORRECT answer live)
 * ----------------------------------------------------------------------------
 * @example
 * coinChangeMemo([1, 2, 5], 11); // 3
 * coinChangeMemo([2], 3);        // -1
 *
 * Time: O(amount × coins). Space: O(amount).
 */
export function coinChangeMemo(coins: number[], amount: number): number {
  const memo = new Map<number, number>();

  function fewest(remaining: number): number {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) return memo.get(remaining)!;

    let best = Infinity;
    for (const coin of coins) {
      best = Math.min(best, 1 + fewest(remaining - coin));
    }
    memo.set(remaining, best);
    return best;
  }

  const answer = fewest(amount);
  return answer === Infinity ? -1 : answer;
}

/**
 * STEP 3 — TABULATE ★ OPTIMAL (below). Bottom-up, no recursion depth limit.
 */
export function coinChange(coins: number[], amount: number): number {
  // dp[i] = minimum coins to make amount i
  // Initialize with Infinity (impossible until proven otherwise)
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 coins to make amount 0

  for (let i = 1; i <= amount; i++) {
    // Try each coin denomination
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        // Use this coin: 1 coin + coins needed for remainder
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  // If still Infinity, amount is impossible to make
  return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * ============================================================================
 * 8. Unique Paths (LeetCode 62) - 2D GRID DP COUNTING
 * ============================================================================
 *
 * Robot starts at top-left, wants to reach bottom-right.
 * Can only move RIGHT or DOWN. How many unique paths exist?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Every cell has exactly two doors in: from ABOVE, or from the
 *                LEFT. (Movement is only right/down, so those are the only ways.)
 * Q2 STATE       "Which cell am I on" = row + column = TWO numbers → 2D dp[i][j].
 * Q3 TRANSITION  dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *                ⭐ PLUS, because we are counting routes. Compare Min Path Sum
 *                (#26), which is the same grid walk with min() instead — same
 *                state, same order, different operator. Recognising that pairing
 *                is worth more than memorising either one.
 * Q4 BASE CASE   The whole top row and whole first column are 1: there is
 *                exactly one way to travel in a straight line.
 * Q5 ORDER       Rows top→bottom, columns left→right.
 * ANSWER         dp[m-1][n-1].
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. NAVIGATION:
 *    - Manhattan grid: how many ways to walk from A to B?
 *    - Warehouse robot: paths from loading dock to storage
 *
 * 2. COMBINATORICS:
 *    - This is C(m+n-2, m-1) in disguise!
 *    - Choosing m-1 "down" moves from total m+n-2 moves
 *
 * 3. NETWORK ROUTING:
 *    - Paths through a grid network
 *    - Data packet routing options
 *
 * ============================================================================
 * VISUALIZATION - Building the Path Count
 * ============================================================================
 *
 * 3x7 grid: How many paths from (0,0) to (2,6)?
 *
 * ┌───┬───┬───┬───┬───┬───┬───┐
 * │ 1 │ 1 │ 1 │ 1 │ 1 │ 1 │ 1 │  ← First row: only 1 way (all right)
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ 1 │ 3 │ 6 │10 │15 │21 │28 │  ← Answer: 28 paths
 * └───┴───┴───┴───┴───┴───┴───┘
 *   ↑
 *   First col: only 1 way (all down)
 *
 * How to fill each cell:
 *   dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *              (from up)   (from left)
 *
 * Example: dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6
 *
 *         3 (from up)
 *         ↓
 *   3 → [ 6 ]
 *   (from left)
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Each cell = sum of paths from UP and LEFT
 * ============================================================================
 *
 * To reach cell (i,j), you MUST come from either:
 *   - Cell above: (i-1, j)
 *   - Cell to left: (i, j-1)
 *
 * So: paths(i,j) = paths(i-1,j) + paths(i,j-1)
 *
 * Base case: First row and first column all have 1 path (only one direction)
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m × n) - fill the grid
 * Space: O(m × n) - can optimize to O(n) with 1D array
 */
export function uniquePaths(m: number, n: number): number {
  // Initialize grid: first row and column are all 1s
  const dp = Array(m)
    .fill(null)
    .map(() => Array(n).fill(1));

  // Fill the rest: each cell = up + left
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * ============================================================================
 * 9. Unique Paths II (LeetCode 63) - GRID DP WITH OBSTACLES
 * ============================================================================
 *
 * Same as Unique Paths, but some cells have obstacles (marked as 1).
 * Robot cannot pass through obstacles. How many paths exist?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Same two doors as #8 (from above, from the left).
 * Q2 STATE       Same 2D dp[i][j] — the obstacles do not add a dimension.
 * Q3 TRANSITION  obstacle → dp[i][j] = 0 (nothing can route through a wall)
 *                otherwise → dp[i][j] = dp[i-1][j] + dp[i][j-1]
 * Q4 BASE CASE   ⚠️ THE TRAP LIVES HERE. In #8 the top row was all 1s. Now a
 *                wall in the top row blocks EVERYTHING after it, so the base
 *                row must be filled as "1 until the first obstacle, then 0
 *                forever" — which the code does by carrying dp[0][j-1] forward
 *                rather than writing a literal 1. Same for the first column.
 * Q5 ORDER       Rows down, columns right.
 * ANSWER         dp[m-1][n-1] — 0 if the start or finish is itself walled.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. WAREHOUSE NAVIGATION:
 *    - Robot paths avoiding storage racks and equipment
 *    - Delivery routes avoiding construction zones
 *
 * 2. GAME AI PATHFINDING:
 *    - Character movement avoiding walls/obstacles
 *    - Counting possible movement patterns
 *
 * 3. NETWORK ROUTING WITH FAILURES:
 *    - Routes avoiding failed nodes/links
 *    - Backup path calculations
 *
 * ============================================================================
 * VISUALIZATION - Obstacles Block Paths
 * ============================================================================
 *
 * Grid with obstacle (1 = obstacle, 0 = free):
 *
 *   obstacleGrid:            dp (path counts):
 *   ┌───┬───┬───┐            ┌───┬───┬───┐
 *   │ 0 │ 0 │ 0 │            │ 1 │ 1 │ 1 │
 *   ├───┼───┼───┤            ├───┼───┼───┤
 *   │ 0 │ 1 │ 0 │   →→→      │ 1 │ 0 │ 1 │  ← Obstacle blocks paths!
 *   ├───┼───┼───┤            ├───┼───┼───┤
 *   │ 0 │ 0 │ 0 │            │ 1 │ 1 │ 2 │  ← Answer: 2 paths
 *   └───┴───┴───┘            └───┴───┴───┘
 *
 * The obstacle at (1,1) means:
 *   - dp[1][1] = 0 (can't reach it)
 *   - Paths that would go through (1,1) are blocked
 *
 * Two valid paths:
 *   Path 1: → → ↓ ↓ (right, right, down, down)
 *   Path 2: ↓ ↓ → → (down, down, right, right)
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Obstacle = 0 paths to that cell
 * ============================================================================
 *
 * Modification from basic Unique Paths:
 *   - If cell has obstacle: dp[i][j] = 0
 *   - Otherwise: dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *
 * Special edge cases:
 *   - Obstacle at start or end → 0 paths total
 *   - Obstacle in first row/col → blocks all cells after it in that row/col
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m × n) - visit each cell once
 * Space: O(m × n) - dp grid (can optimize to O(n))
 */
export function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;

  // Edge case: start or end is blocked
  if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) {
    return 0;
  }

  const dp = Array(m)
    .fill(null)
    .map(() => Array(n).fill(0));
  dp[0][0] = 1;

  // Initialize first row: 1 path until we hit an obstacle, then 0
  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 1 ? 0 : dp[0][j - 1];
  }

  // Initialize first column: 1 path until we hit an obstacle, then 0
  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 1 ? 0 : dp[i - 1][0];
  }

  // Fill the rest
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0; // Obstacle: no paths through here
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
}

/**
 * ============================================================================
 * 10. Jump Game (LeetCode 55) - GREEDY REACHABILITY
 * ============================================================================
 *
 * Given array where nums[i] = max jump length from position i.
 * Can you reach the last index starting from index 0?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * ⭐ FIRST, THE HONEST ANSWER: this one does NOT need a table. It is in the DP
 * folder because the DP instinct is what you will reach for first, and knowing
 * when to put the table DOWN is part of the skill.
 *
 * Q1 CHOICE      From index i you may jump 1..nums[i] steps. But you never
 *                have to decide WHICH jump — you only care how far you COULD get.
 * Q2 STATE       ONE running number: `maxReach`, the furthest index reachable
 *                so far. That collapse from "a table of reachability" to "one
 *                integer" is the whole optimisation.
 * Q3 TRANSITION  maxReach = max(maxReach, i + nums[i])
 * Q4 BASE CASE   maxReach = 0 — you start at index 0 and can trivially be there.
 * Q5 ORDER       Left to right, one pass.
 * ANSWER         true, unless some index i is reached where i > maxReach —
 *                that is a gap no earlier jump can clear, so fail immediately.
 *
 * The DP version (dp[i] = "is i reachable") is O(n²) and correct; this greedy
 * is O(n) and is what the interviewer is waiting for.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. GAME LEVEL DESIGN:
 *    - Can the player reach the exit?
 *    - Power-ups determine jump distance
 *
 * 2. NETWORK CONNECTIVITY:
 *    - Can a signal reach the destination?
 *    - Each node has a transmission range
 *
 * 3. FUEL/ENERGY PLANNING:
 *    - Can you reach destination with given fuel stops?
 *    - Each stop gives you range for next segment
 *
 * ============================================================================
 * VISUALIZATION - Tracking Maximum Reach
 * ============================================================================
 *
 * nums = [2, 3, 1, 1, 4]
 *
 * ┌─────┬───────┬─────────────────────────────────────────────────────────────┐
 * │  i  │nums[i]│ Can reach?  New maxReach                                    │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  0  │   2   │ i=0 ≤ maxReach=0 ✓   maxReach = max(0, 0+2) = 2             │
 * │     │       │ From here, can reach up to index 2                          │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  1  │   3   │ i=1 ≤ maxReach=2 ✓   maxReach = max(2, 1+3) = 4             │
 * │     │       │ From here, can reach up to index 4 (the end!)               │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  2  │   1   │ i=2 ≤ maxReach=4 ✓   maxReach = max(4, 2+1) = 4             │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  3  │   1   │ i=3 ≤ maxReach=4 ✓   maxReach = max(4, 3+1) = 4             │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  4  │   4   │ i=4 ≤ maxReach=4 ✓   Reached the end! ✨                     │
 * └─────┴───────┴─────────────────────────────────────────────────────────────┘
 *
 * Answer: true (can reach index 4)
 *
 * Visual of jumps:
 *   [2, 3, 1, 1, 4]
 *    ↓  ↓
 *    └──┴──→ can jump to index 1, which extends reach to index 4
 *
 * ============================================================================
 * FAILURE CASE: nums = [3, 2, 1, 0, 4]
 * ============================================================================
 *
 * ┌─────┬───────┬─────────────────────────────────────────────────────────────┐
 * │  i  │nums[i]│ Can reach?  New maxReach                                    │
 * ├─────┼───────┼─────────────────────────────────────────────────────────────┤
 * │  0  │   3   │ ✓  maxReach = 3                                             │
 * │  1  │   2   │ ✓  maxReach = max(3, 1+2) = 3                               │
 * │  2  │   1   │ ✓  maxReach = max(3, 2+1) = 3                               │
 * │  3  │   0   │ ✓  maxReach = max(3, 3+0) = 3  ← Stuck! Can't go further    │
 * │  4  │   4   │ ❌  i=4 > maxReach=3  CAN'T REACH!                           │
 * └─────┴───────┴─────────────────────────────────────────────────────────────┘
 *
 * The 0 at index 3 creates a "trap" - can't jump past it!
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Greedy - Track the farthest reachable index
 * ============================================================================
 *
 * At each step:
 *   1. Check: Can I even reach this position? (i ≤ maxReach?)
 *   2. Update: How far can I reach from here? (maxReach = max(maxReach, i + nums[i]))
 *
 * If at any point i > maxReach, we're stuck → return false
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - just one variable
 */
export function canJump(nums: number[]): boolean {
  let maxReach = 0; // Farthest index we can reach

  for (let i = 0; i < nums.length; i++) {
    // Can we reach this position?
    if (i > maxReach) {
      return false; // Stuck! Can't reach here
    }
    // Update maximum reach from this position
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true; // Reached the end
}

/**
 * ============================================================================
 * 11. Jump Game II (LeetCode 45) - GREEDY MINIMUM JUMPS
 * ============================================================================
 *
 * Same setup as Jump Game, but now find the MINIMUM number of jumps
 * to reach the last index. (Guaranteed to be reachable)
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * ⭐ Like #10, no table — but the reason is different and worth naming: this is
 * secretly a BREADTH-FIRST SEARCH over "levels", where level k is the set of
 * indices reachable in exactly k jumps.
 *
 * Q1 CHOICE      Which index in the current level to jump from. You never
 *                actually pick one — you only need where the NEXT level ends.
 * Q2 STATE       TWO running numbers: `currentEnd` (last index of this level)
 *                and `farthest` (furthest the next level will reach).
 * Q3 TRANSITION  farthest = max(farthest, i + nums[i]); and when i reaches
 *                currentEnd, you have exhausted this level → jumps++ and
 *                currentEnd = farthest.
 * Q4 BASE CASE   jumps = currentEnd = farthest = 0.
 * Q5 ORDER       Left to right, stopping BEFORE the last index.
 * ANSWER         jumps.
 *
 * ⚠️ WHY THE LOOP STOPS AT n-2: arriving at the last index means you are done.
 * Including it would count one extra jump you never had to make.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. MINIMUM HOPS IN NETWORKING:
 *    - Minimum routers to reach destination
 *    - Optimize network latency
 *
 * 2. GAME SPEEDRUNNING:
 *    - Minimum moves to complete level
 *    - Optimal power-up usage
 *
 * 3. TRAVEL OPTIMIZATION:
 *    - Minimum fuel stops on a road trip
 *    - Each stop has different range capability
 *
 * ============================================================================
 * VISUALIZATION - BFS-like Level Exploration
 * ============================================================================
 *
 * nums = [2, 3, 1, 1, 4]
 *
 * Think of it as BFS levels:
 *   - Level 0 (0 jumps): positions reachable = [0]
 *   - Level 1 (1 jump):  positions reachable = [1, 2] (from index 0)
 *   - Level 2 (2 jumps): positions reachable = [3, 4] (from indices 1,2)
 *                        Index 4 is the end! ✨
 *
 *   Index:    0    1    2    3    4
 *   Value:   [2]  [3]  [1]  [1]  [4]
 *             │    │    │
 *   Level 0:  ●────┼────┤ (can reach 1,2)
 *   Level 1:       ●────┼────● (can reach 3,4)
 *   Level 2:                 🏁 END
 *
 * ┌─────┬───────┬───────────┬───────────┬───────────────────────────────────┐
 * │  i  │nums[i]│ currentEnd│ farthest  │ Action                            │
 * ├─────┼───────┼───────────┼───────────┼───────────────────────────────────┤
 * │  0  │   2   │     0     │     2     │ i=0, reached currentEnd → JUMP!   │
 * │     │       │           │           │ jumps=1, currentEnd=2             │
 * ├─────┼───────┼───────────┼───────────┼───────────────────────────────────┤
 * │  1  │   3   │     2     │     4     │ farthest = max(2, 1+3) = 4        │
 * ├─────┼───────┼───────────┼───────────┼───────────────────────────────────┤
 * │  2  │   1   │     2     │     4     │ i=2, reached currentEnd → JUMP!   │
 * │     │       │           │           │ jumps=2, currentEnd=4             │
 * ├─────┼───────┼───────────┼───────────┼───────────────────────────────────┤
 * │  3  │   1   │     4     │     4     │ (don't process i=4, loop ends)    │
 * └─────┴───────┴───────────┴───────────┴───────────────────────────────────┘
 *
 * Answer: 2 jumps (0→1→4 or 0→2→4)
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Greedy - Jump when you MUST, to the farthest point
 * ============================================================================
 *
 * Variables:
 *   - currentEnd: the farthest index reachable with current number of jumps
 *   - farthest: the farthest index reachable if we take one more jump
 *   - jumps: number of jumps taken
 *
 * When i reaches currentEnd:
 *   - We've explored all options at this "level"
 *   - Time to make a jump!
 *   - Update currentEnd to farthest
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - constant space
 */
export function jump(nums: number[]): number {
  if (nums.length <= 1) return 0;

  let jumps = 0;
  let currentEnd = 0; // End of current "level" (reachable range)
  let farthest = 0; // Farthest we can reach with one more jump

  // Don't include last index - we just need to REACH it
  for (let i = 0; i < nums.length - 1; i++) {
    // Update farthest reachable from any position in current range
    farthest = Math.max(farthest, i + nums[i]);

    // Reached the end of current range - must jump!
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest; // Extend range to farthest

      // Early exit: if we can already reach the end
      if (currentEnd >= nums.length - 1) break;
    }
  }

  return jumps;
}

/**
 * ============================================================================
 * 12. Decode Ways (LeetCode 91) - STRING PARTITION COUNTING
 * ============================================================================
 *
 * Message encoded: A=1, B=2, ..., Z=26
 * Given a digit string, count how many ways to decode it.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Read the next piece as ONE digit (1-9 → a letter), or as TWO
 *                digits (10-26 → a letter). Those are the only two options.
 * Q2 STATE       "How many characters have I decoded so far" — ONE number → 1D
 *                dp[i].
 * Q3 TRANSITION  dp[i] += dp[i-1]  if the single digit s[i-1] is 1..9
 *                dp[i] += dp[i-2]  if the pair s[i-2..i] is 10..26
 *                Counting again, so both legal options are ADDED.
 * Q4 BASE CASE   dp[0] = 1 (empty string: one way — decode nothing) and
 *                dp[1] = 1. A leading '0' is invalid, rejected up front.
 * Q5 ORDER       i = 2 upward.
 * ANSWER         dp[s.length].
 *
 * ⚠️ ZEROS ARE THE ENTIRE DIFFICULTY. '0' alone decodes to nothing, so it
 * contributes no dp[i-1] term; "06" is not a valid pair either (must be >= 10).
 * "10" has exactly 1 decoding, not 2. Test the zeros, always.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. TEXT ENCODING/DECODING:
 *    - Parsing compressed numeric codes
 *    - Ambiguous encoding resolution
 *
 * 2. BARCODE/QR INTERPRETATION:
 *    - Multiple valid interpretations of scan
 *    - Error-tolerant parsing
 *
 * 3. PHONE NUMBER PARSING:
 *    - Old phone keypads: "2" = ABC, how many interpretations?
 *    - SMS encoding ambiguities
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * s = "226"
 *
 * Possible decodings:
 *   "2" "2" "6"  → B B F
 *   "22" "6"     → V F
 *   "2" "26"     → B Z
 *
 * Answer: 3 ways
 *
 * dp[i] = number of ways to decode s[0..i-1]
 *
 * ┌───────┬─────────────────────────────────────────────────────────────────────┐
 * │ i     │ Calculation                                                         │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[0] │ 1 (empty string base case)                                          │
 * │ dp[1] │ s[0]='2' → valid single digit → dp[1] = 1                           │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[2] │ s[1]='2' → valid single digit → add dp[1] = 1                       │
 * │       │ s[0:2]="22" → valid (10-26) → add dp[0] = 1                         │
 * │       │ dp[2] = 1 + 1 = 2                                                   │
 * ├───────┼─────────────────────────────────────────────────────────────────────┤
 * │ dp[3] │ s[2]='6' → valid single digit → add dp[2] = 2                       │
 * │       │ s[1:3]="26" → valid (10-26) → add dp[1] = 1                         │
 * │       │ dp[3] = 2 + 1 = 3 ✨                                                 │
 * └───────┴─────────────────────────────────────────────────────────────────────┘
 *
 * ============================================================================
 * EDGE CASES & INVALID INPUTS
 * ============================================================================
 *
 * "0"      → 0 ways (0 alone is invalid)
 * "06"     → 0 ways (leading zero is invalid)
 * "10"     → 1 way ("10" = J, but "1""0" is invalid since 0 alone is invalid)
 * "27"     → 1 way ("2""7" only, "27" > 26 is invalid)
 * "101"    → 1 way ("10""1" = JA, "1""01" is invalid)
 *
 * Key rules:
 *   - Single digit: valid if 1-9 (not 0!)
 *   - Two digits: valid if 10-26
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Two ways to decode current position
 * ============================================================================
 *
 * At position i, we can either:
 *   1. Take s[i-1] as a SINGLE digit (if 1-9)
 *      → Add dp[i-1] (ways to decode rest)
 *
 *   2. Take s[i-2..i-1] as a TWO-digit number (if 10-26)
 *      → Add dp[i-2] (ways to decode rest)
 *
 * Recurrence:
 *   dp[i] = (valid single? dp[i-1] : 0) + (valid double? dp[i-2] : 0)
 *
 * ============================================================================
 * SIMILARITY TO CLIMBING STAIRS
 * ============================================================================
 *
 * This is climbing stairs with CONSTRAINTS!
 *   - Climbing stairs: always can take 1 or 2 steps
 *   - Decode ways: 1-step only if digit is 1-9, 2-step only if digits form 10-26
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(n) - dp array (can optimize to O(1) with 2 variables)
 */
export function numDecodings(s: string): number {
  // Edge case: empty or starts with 0
  if (s.length === 0 || s[0] === "0") return 0;

  // dp[i] = number of ways to decode s[0..i-1]
  const dp = new Array(s.length + 1).fill(0);
  dp[0] = 1; // Empty string: 1 way (base case)
  dp[1] = 1; // First char is valid (already checked not '0')

  for (let i = 2; i <= s.length; i++) {
    const oneDigit = parseInt(s[i - 1]); // Current single digit
    const twoDigit = parseInt(s.substring(i - 2, i)); // Last two digits

    // Option 1: Decode current digit as single letter (1-9)
    if (oneDigit >= 1 && oneDigit <= 9) {
      dp[i] += dp[i - 1];
    }

    // Option 2: Decode last two digits as single letter (10-26)
    if (twoDigit >= 10 && twoDigit <= 26) {
      dp[i] += dp[i - 2];
    }
  }

  return dp[s.length];
}

/**
 * ============================================================================
 * 13. Maximum Product Subarray (LeetCode 152)
 * ============================================================================
 *
 * Given an integer array nums, find a contiguous non-empty subarray within
 * the array that has the largest product, and return the product.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      At each element: EXTEND the running product, or START FRESH
 *                from this element.
 * Q2 STATE       ⭐ TWO rolling numbers, not one: the best product ending here
 *                AND the WORST (most negative) product ending here. This is the
 *                one idea in the problem — a big negative is one negative number
 *                away from becoming the winner, so you must carry it along.
 * Q3 TRANSITION  maxSoFar = max(v, maxSoFar*v, minSoFar*v)
 *                minSoFar = min(v, maxSoFar_OLD*v, minSoFar*v)
 * Q4 BASE CASE   Both start at nums[0].
 * Q5 ORDER       Left to right, one pass.
 * ANSWER         A running maximum over every position — not the final cell,
 *                since the best subarray can end anywhere.
 *
 * ⚠️ THE BUG EVERYONE WRITES: you must snapshot the OLD maxSoFar (the `temp`
 * variable) before overwriting it, because minSoFar's formula still needs the
 * old value. Overwrite first and the two lines silently disagree about which
 * "day" they are on — the same class of bug as #33's cooldown snapshot.
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * Example: nums = [2, 3, -2, 4]
 *
 * ┌─────┬────────┬──────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                 │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 0   │   2    │  Initialize: maxSoFar=2, minSoFar=2, result=2                │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 1   │   3    │  temp = 2 (save old max)                                     │
 * │     │        │  Candidates for max: 3, 2×3=6, 2×3=6 → max = 6               │
 * │     │        │  Candidates for min: 3, 2×3=6, 2×3=6 → min = 3               │
 * │     │        │  maxSoFar=6, minSoFar=3, result=6 ✨                          │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 2   │  -2    │  temp = 6 (save old max)                                     │
 * │     │        │  Candidates for max: -2, 6×(-2)=-12, 3×(-2)=-6 → max = -2    │
 * │     │        │  Candidates for min: -2, 6×(-2)=-12, 3×(-2)=-6 → min = -12   │
 * │     │        │  maxSoFar=-2, minSoFar=-12, result=6 (unchanged)             │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 3   │   4    │  temp = -2 (save old max)                                    │
 * │     │        │  Candidates for max: 4, (-2)×4=-8, (-12)×4=-48 → max = 4     │
 * │     │        │  Candidates for min: 4, (-2)×4=-8, (-12)×4=-48 → min = -48   │
 * │     │        │  maxSoFar=4, minSoFar=-48, result=6 (unchanged)              │
 * └─────┴────────┴──────────────────────────────────────────────────────────────┘
 *
 * Final Answer: 6 (subarray [2, 3])
 *
 * ============================================================================
 * Example with Sign Flip: nums = [-2, 3, -4]
 * ============================================================================
 *
 * ┌─────┬────────┬──────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                 │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 0   │  -2    │  Initialize: maxSoFar=-2, minSoFar=-2, result=-2             │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 1   │   3    │  temp = -2                                                   │
 * │     │        │  Candidates for max: 3, (-2)×3=-6, (-2)×3=-6 → max = 3       │
 * │     │        │  Candidates for min: 3, (-2)×3=-6, (-2)×3=-6 → min = -6      │
 * │     │        │  maxSoFar=3, minSoFar=-6, result=3                           │
 * ├─────┼────────┼──────────────────────────────────────────────────────────────┤
 * │ 2   │  -4    │  temp = 3                                                    │
 * │     │        │  Candidates for max: -4, 3×(-4)=-12, (-6)×(-4)=24 → max = 24 │
 * │     │        │  Candidates for min: -4, 3×(-4)=-12, (-6)×(-4)=24 → min = -12│
 * │     │        │  maxSoFar=24, minSoFar=-12, result=24 ✨ SIGN FLIP!          │
 * └─────┴────────┴──────────────────────────────────────────────────────────────┘
 *
 * 🔑 KEY INSIGHT: minSoFar (-6) × nums[i] (-4) = 24 became the new max!
 *    The "villain" (most negative) became the "hero" (most positive)!
 *
 * ============================================================================
 * WHY USE temp? - CRITICAL UNDERSTANDING
 * ============================================================================
 *
 * Problem: We need OLD maxSoFar to calculate minSoFar, but we update maxSoFar first!
 *
 * WITHOUT temp (WRONG):
 *   maxSoFar = Math.max(...);  // maxSoFar is now UPDATED
 *   minSoFar = Math.min(..., maxSoFar * nums[i], ...);  // Uses NEW maxSoFar! ❌
 *
 * WITH temp (CORRECT):
 *   temp = maxSoFar;           // Save OLD value
 *   maxSoFar = Math.max(...);  // Update maxSoFar
 *   minSoFar = Math.min(..., temp * nums[i], ...);  // Uses OLD maxSoFar ✓
 *
 * Example: nums = [2, -1], at i=1:
 *   - maxSoFar=2, minSoFar=2, nums[1]=-1
 *   - We need: minSoFar = min(-1, 2×(-1), 2×(-1)) = -2
 *   - But if we update maxSoFar first to -1, we'd wrongly calculate:
 *     minSoFar = min(-1, (-1)×(-1)=1, 2×(-1)) = -2 (happens to be same here)
 *   - In other cases this causes incorrect results!
 *
 * ============================================================================
 * EDGE CASES
 * ============================================================================
 *
 * 1. EMPTY ARRAY: []
 *    → Return 0 (or throw error depending on requirements)
 *
 * 2. SINGLE ELEMENT: [5] or [-3]
 *    → Return that element (it's the only subarray)
 *
 * 3. ALL POSITIVE: [1, 2, 3, 4]
 *    → Product of entire array = 24
 *    → maxSoFar keeps growing, minSoFar equals maxSoFar
 *
 * 4. ALL NEGATIVE: [-1, -2, -3, -4]
 *    → Either single element (-1) or product of even count
 *    → [-1,-2] = 2, [-1,-2,-3,-4] = 24, but [-1,-2,-3] = -6
 *    → Answer depends on count; here it's 24
 *
 * 5. CONTAINS ZERO: [2, 3, 0, 4, 5]
 *    → Zero RESETS the product chain!
 *    → Subarrays: [2,3]=6 or [4,5]=20 → answer = 20
 *    → Zero acts as a "wall" separating subarrays
 *
 * 6. ZERO AT ENDS: [0, 2, 3] or [2, 3, 0]
 *    → Zero doesn't contribute, answer is 6
 *
 * 7. LARGE NEGATIVES: [-2, -3, 7]
 *    → [-2,-3] = 6, [7] = 7, [-2,-3,7] = 42 → answer = 42
 *
 * 8. ALTERNATING SIGNS: [2, -5, 3, -2]
 *    → Need to track min to catch sign flips
 *    → [2,-5,3,-2] = 60 → answer = 60
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 4 variables (maxSoFar, minSoFar, result, temp)
 */
export function maxProduct(nums: number[]): number {
  // Edge case: empty array
  if (nums.length === 0) return 0;

  // Initialize with first element
  // Both max and min start the same (single element subarray)
  let maxSoFar = nums[0]; // Maximum product ending at current position
  let minSoFar = nums[0]; // Minimum product ending at current position
  let result = nums[0]; // Global maximum we've found

  for (let i = 1; i < nums.length; i++) {
    // 🔑 CRITICAL: Save maxSoFar BEFORE updating!
    // We need the OLD maxSoFar value to calculate minSoFar correctly
    const temp = maxSoFar;

    // For maxSoFar, consider 3 candidates:
    // 1. nums[i] alone (start fresh)
    // 2. maxSoFar * nums[i] (extend positive streak)
    // 3. minSoFar * nums[i] (negative × negative = positive!)
    maxSoFar = Math.max(
      nums[i],
      Math.max(maxSoFar * nums[i], minSoFar * nums[i])
    );

    // For minSoFar, consider 3 candidates:
    // 1. nums[i] alone (start fresh)
    // 2. temp * nums[i] (old max × current, use temp not maxSoFar!)
    // 3. minSoFar * nums[i] (extend negative streak)
    minSoFar = Math.min(nums[i], Math.min(temp * nums[i], minSoFar * nums[i]));

    // Update global maximum
    result = Math.max(result, maxSoFar);
  }

  return result;
}

/**
 * ============================================================================
 * 14. Maximum Subarray - Kadane's Algorithm (LeetCode 53)
 * ============================================================================
 *
 * Given an integer array nums, find the contiguous subarray (containing at
 * least one number) which has the largest SUM and return its sum.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      At each element, exactly one question: does the running
 *                subarray still help me, or should I START FRESH here?
 * Q2 STATE       ONE rolling number: the best sum ENDING AT this index.
 *                (Same "ending here" anchoring as LIS in #4.)
 * Q3 TRANSITION  maxEndingHere = max(nums[i], maxEndingHere + nums[i])
 *                If the running sum ever hurts more than starting over, it is
 *                discarded — that comparison IS Kadane's algorithm.
 * Q4 BASE CASE   Both trackers start at nums[0], and the loop starts at 1.
 *                ⭐ Seeding from the data instead of from 0 is what makes the
 *                all-negative case work: [-3,-1,-2] correctly returns -1, while
 *                a 0 seed would wrongly return 0 for a non-empty array.
 * Q5 ORDER       Left to right, one pass.
 * ANSWER         A running max over all positions (`maxSoFar`).
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * Example: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *
 * ┌─────┬────────┬─────────────────────────────────────────────────────────────┐
 * │  i  │ nums[i]│  Calculation                                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 0   │  -2    │  Initialize: maxEndingHere=-2, maxSoFar=-2                  │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 1   │   1    │  max(1, -2+1=-1) = 1 → START FRESH!                         │
 * │     │        │  maxEndingHere=1, maxSoFar=1 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 2   │  -3    │  max(-3, 1+(-3)=-2) = -2 → CONTINUE (carry the sum)         │
 * │     │        │  maxEndingHere=-2, maxSoFar=1                               │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 3   │   4    │  max(4, -2+4=2) = 4 → START FRESH!                          │
 * │     │        │  maxEndingHere=4, maxSoFar=4 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 4   │  -1    │  max(-1, 4+(-1)=3) = 3 → CONTINUE                           │
 * │     │        │  maxEndingHere=3, maxSoFar=4                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 5   │   2    │  max(2, 3+2=5) = 5 → CONTINUE                               │
 * │     │        │  maxEndingHere=5, maxSoFar=5 ✨                              │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 6   │   1    │  max(1, 5+1=6) = 6 → CONTINUE                               │
 * │     │        │  maxEndingHere=6, maxSoFar=6 ✨ FINAL ANSWER!               │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 7   │  -5    │  max(-5, 6+(-5)=1) = 1 → CONTINUE                           │
 * │     │        │  maxEndingHere=1, maxSoFar=6                                │
 * ├─────┼────────┼─────────────────────────────────────────────────────────────┤
 * │ 8   │   4    │  max(4, 1+4=5) = 5 → CONTINUE                               │
 * │     │        │  maxEndingHere=5, maxSoFar=6                                │
 * └─────┴────────┴─────────────────────────────────────────────────────────────┘
 *
 * Answer: 6 (subarray [4, -1, 2, 1])
 *
 * Visual of the winning subarray:
 *   [-2,  1, -3,  4, -1,  2,  1, -5,  4]
 *                 └──────────────┘
 *                  4 + -1 + 2 + 1 = 6
 *
 * ============================================================================
 * 🔥 CONTRAST: MAX SUM vs MAX PRODUCT
 * ============================================================================
 *
 * ┌─────────────────┬─────────────────────────┬─────────────────────────────┐
 * │ Aspect          │ MAX SUM (Kadane)        │ MAX PRODUCT                 │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Operation       │ Addition (+)            │ Multiplication (×)          │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Track           │ Only maxEndingHere      │ BOTH max AND min            │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Why?            │ Negatives always hurt   │ Neg × Neg = Pos! 🔑         │
 * │                 │ the sum                 │ Min can become max          │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Variables       │ 2 (maxEndingHere,       │ 4 (maxSoFar, minSoFar,      │
 * │                 │    maxSoFar)            │    result, temp)            │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Need temp?      │ NO ✓                    │ YES - to save old max       │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Reset when      │ currentSum becomes      │ Element is 0 (0 × x = 0)    │
 * │                 │ worse than starting     │                             │
 * │                 │ fresh                   │                             │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Formula         │ max(a, prev + a)        │ max(a, max×a, min×a)        │
 * ├─────────────────┼─────────────────────────┼─────────────────────────────┤
 * │ Zero handling   │ Zero is just 0, can     │ Zero KILLS the chain!       │
 * │                 │ continue or restart     │ Must restart after 0        │
 * └─────────────────┴─────────────────────────┴─────────────────────────────┘
 *
 * ============================================================================
 * WHY KADANE ONLY NEEDS maxEndingHere (not min)
 * ============================================================================
 *
 * In ADDITION: negative numbers ALWAYS hurt the sum.
 *   - Adding a negative makes sum smaller
 *   - There's no way a negative "flips" to help later
 *   - So we only care about the maximum sum ending here
 *
 * In MULTIPLICATION: negative numbers can HELP!
 *   - Neg × Neg = Pos (two wrongs make a right!)
 *   - A very negative min can become very positive max
 *   - So we MUST track both min and max
 *
 * EXAMPLE showing the difference:
 *
 *   Array: [-2, -3]
 *
 *   MAX SUM:     -2 + (-3) = -5  → Best is just -2 (single element)
 *   MAX PRODUCT: -2 × (-3) = 6   → Product of both is positive! ✨
 *
 * ============================================================================
 * MENTAL MODEL: "Should I continue or start fresh?"
 * ============================================================================
 *
 * At each element, ask: "Is my running sum helping or hurting?"
 *
 *   - If currentSum > 0: It's helping! Keep it and add current element.
 *   - If currentSum ≤ 0: It's hurting! Drop it and start fresh.
 *
 * This is equivalent to: max(nums[i], currentSum + nums[i])
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) - single pass
 * Space: O(1) - only 2 variables
 */
export function maxSubArray(nums: number[]): number {
  // Global maximum - best sum we've ever seen
  let maxSoFar = nums[0];

  // Local maximum - best sum ending at current position
  // This is our "running sum" that we either continue or reset
  let maxEndingHere = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // THE KEY DECISION:
    // Option 1: Start fresh with nums[i] (drop previous sum)
    // Option 2: Extend previous sum with nums[i]
    // We pick whichever is larger
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);

    // Update global maximum if we found a better subarray
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

/**
 * ============================================================================
 * 15. Edit Distance / Levenshtein Distance (LeetCode 72)
 * ============================================================================
 *
 * Given two strings word1 and word2, return the minimum number of operations
 * to convert word1 to word2. Operations: Insert, Delete, Replace.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Compare the last characters of the two prefixes. If they
 *                match, the edit is FREE. If not, pay 1 and try all three
 *                repairs: REPLACE, DELETE, or INSERT.
 * Q2 STATE       "How much of word1 is processed" AND "how much of word2" —
 *                TWO numbers → 2D dp[i][j].
 * Q3 TRANSITION  match    → dp[i][j] = dp[i-1][j-1]                  (free)
 *                no match → dp[i][j] = 1 + min(dp[i-1][j-1],  replace
 *                                               dp[i-1][j],    delete
 *                                               dp[i][j-1])    insert
 *                ⭐ Which neighbour means which operation is the only thing to
 *                memorise: diagonal = replace, up = delete, left = insert.
 * Q4 BASE CASE   dp[i][0] = i (delete everything) and dp[0][j] = j (insert
 *                everything). These are NOT zeros — a common wrong start.
 * Q5 ORDER       i and j both upward.
 * ANSWER         dp[m][n].
 *
 * 🔗 Same table shape as LCS (#5); in fact the two are closely related, and
 * `TwoSequencesDP/` in this folder explores the family further.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. SPELL CHECKERS:
 *    - Suggest corrections based on minimum edits
 *    - "recieve" → "receive" (1 edit: swap 'ie' to 'ei')
 *
 * 2. DNA SEQUENCE ALIGNMENT:
 *    - Measure genetic similarity/distance
 *    - Track evolutionary mutations
 *
 * 3. PLAGIARISM DETECTION:
 *    - How similar are two documents?
 *    - Lower edit distance = more similar
 *
 * 4. AUTOCORRECT / FUZZY SEARCH:
 *    - Match user input to closest valid option
 *    - "javascrpit" → "javascript"
 *
 * 5. VERSION CONTROL (diff):
 *    - Minimum changes between file versions
 *    - Git diff algorithms use similar concepts
 *
 * ============================================================================
 * VISUALIZATION - 2D DP Table
 * ============================================================================
 *
 * word1 = "horse", word2 = "ros"
 *
 * dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
 *
 *         ""    r     o     s
 *     ┌─────┬─────┬─────┬─────┐
 *  "" │  0  │  1  │  2  │  3  │  ← Insert r, o, s
 *     ├─────┼─────┼─────┼─────┤
 *  h  │  1  │  1  │  2  │  3  │  ← Replace h→r, then insert o,s
 *     ├─────┼─────┼─────┼─────┤
 *  o  │  2  │  2  │  1  │  2  │  ← 'o' matches!
 *     ├─────┼─────┼─────┼─────┤
 *  r  │  3  │  2  │  2  │  2  │  ← 'r' was already there
 *     ├─────┼─────┼─────┼─────┤
 *  s  │  4  │  3  │  3  │  2  │  ← 's' matches!
 *     ├─────┼─────┼─────┼─────┤
 *  e  │  5  │  4  │  4  │  3  │  ← Delete 'e'
 *     └─────┴─────┴─────┴─────┘
 *
 * Answer: dp[5][3] = 3
 * Operations: horse → rorse (replace h→r) → rose (delete r) → ros (delete e)
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: Three Operations = Three Choices
 * ============================================================================
 *
 * At each cell (i, j), if characters DON'T match:
 *
 *   dp[i-1][j-1]  dp[i-1][j]
 *        ↖          ↑
 *   REPLACE     DELETE
 *
 *   dp[i][j-1] → dp[i][j]
 *      INSERT
 *
 * Recurrence:
 *   If word1[i-1] == word2[j-1]:
 *       dp[i][j] = dp[i-1][j-1]  (no operation needed!)
 *   Else:
 *       dp[i][j] = 1 + min(
 *           dp[i-1][j-1],  // REPLACE: change word1[i-1] to word2[j-1]
 *           dp[i-1][j],    // DELETE: remove word1[i-1]
 *           dp[i][j-1]     // INSERT: add word2[j-1] to word1
 *       )
 *
 * ============================================================================
 * BASE CASES
 * ============================================================================
 *
 * - dp[i][0] = i  (delete all i characters from word1)
 * - dp[0][j] = j  (insert all j characters to make word2)
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m × n) - fill the 2D table
 * Space: O(m × n) - the 2D table (can optimize to O(n))
 */
export function minDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;

  // dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Base case: converting to/from empty string
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i; // Delete all i characters
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j; // Insert all j characters
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // Characters match! No operation needed
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Take minimum of 3 operations + 1
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j - 1], // Replace
            dp[i - 1][j], // Delete
            dp[i][j - 1] // Insert
          );
      }
    }
  }

  return dp[m][n];
}

/**
 * ============================================================================
 * 16. Maximum Product Path in Matrix
 * ============================================================================
 *
 * Given a matrix of integers, find the maximum product of elements in any path
 * from the top-left corner (0,0) to the bottom-right corner (m-1, n-1).
 * You can only move DOWN or RIGHT at each step.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Two doors into every cell: from ABOVE or from the LEFT.
 * Q2 STATE       ⭐ The cell (2 numbers) AND, for each cell, BOTH extremes —
 *                the biggest and the smallest product reaching it. So: two
 *                tables, not one. This is #13 (Max Product Subarray) lifted
 *                into 2D, for the identical reason: a negative times a negative
 *                is positive, so the smallest value is a live candidate.
 * Q3 TRANSITION  four candidates = {maxUp, minUp, maxLeft, minLeft} x cell
 *                maxDP = max(candidates), minDP = min(candidates)
 * Q4 BASE CASE   The top row and first column have exactly one route in, so
 *                max == min there: a straight running product.
 * Q5 ORDER       Rows down, columns right.
 * ANSWER         maxDP[m-1][n-1].
 *
 * ⚠️ OVERFLOW IS REAL HERE. `maxProductPathMod` below carries BigInt because
 * the products exceed JavaScript's exact-integer range (2⁵³) and would
 * silently return a plausible wrong number. The Go twin documents the mirror
 * problem: Go's int does not lose precision, it WRAPS.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. INVESTMENT MULTIPLIERS:
 *    - Each cell represents a multiplier for your investment
 *    - Moving through different market sectors (right) or time periods (down)
 *    - Find the path that maximizes your final investment value
 *
 * 2. GAME POWER-UPS:
 *    - Grid-based game where each cell multiplies your power score
 *    - Some cells have negative multipliers (debuffs)
 *    - Find optimal path to maximize final power
 *
 * 3. PRODUCTION LINE EFFICIENCY:
 *    - Factory floor layout where each station multiplies throughput
 *    - Find the most efficient path through production stages
 *
 * @example
 * // Investment Portfolio Path
 * // Each cell is a multiplier: 2 = double, -1 = complete reversal
 * const grid = [[1, -2, 3], [4, 5, -6], [7, -8, 9]];
 * console.log(maxProductPath(grid)); // Find the maximum product path
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: WHY TRACK BOTH MAX AND MIN?
 * ============================================================================
 *
 * Unlike path SUM problems (where negatives always hurt), path PRODUCT has
 * a special property:
 *
 *   NEGATIVE × NEGATIVE = POSITIVE! 🎯
 *
 * This means a path with the MINIMUM (most negative) product can suddenly
 * become the MAXIMUM when multiplied by another negative number!
 *
 * Example:
 *   Path A has product = -100 (minimum, very negative)
 *   Path B has product = 10 (maximum, positive)
 *   Current cell = -5
 *
 *   Path A × (-5) = 500  ← The "worst" path became the BEST! ✨
 *   Path B × (-5) = -50  ← The "best" path became worse
 *
 * ============================================================================
 * VISUALIZATION - Step by Step
 * ============================================================================
 *
 * Matrix:
 *   ┌─────┬─────┬─────┐
 *   │  1  │ -2  │  3  │
 *   ├─────┼─────┼─────┤
 *   │  4  │  5  │ -6  │
 *   ├─────┼─────┼─────┤
 *   │  7  │ -8  │  9  │
 *   └─────┴─────┴─────┘
 *
 * We track TWO values at each cell:
 *   maxDP[i][j] = maximum product to reach (i,j)
 *   minDP[i][j] = minimum product to reach (i,j)
 *
 * Step-by-step fill:
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Cell (0,0): Starting point                                              │
 * │   maxDP[0][0] = 1, minDP[0][0] = 1                                      │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Cell (0,1): Can only come from LEFT                                     │
 * │   maxDP[0][1] = max(1×-2) = -2                                          │
 * │   minDP[0][1] = min(1×-2) = -2                                          │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Cell (0,2): Can only come from LEFT                                     │
 * │   maxDP[0][2] = max(-2×3) = -6                                          │
 * │   minDP[0][2] = min(-2×3) = -6                                          │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Cell (1,0): Can only come from UP                                       │
 * │   maxDP[1][0] = max(1×4) = 4                                            │
 * │   minDP[1][0] = min(1×4) = 4                                            │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Cell (1,1): Can come from UP or LEFT 🔑 KEY CELL                        │
 * │   From UP:   max=4, min=4                                               │
 * │   From LEFT: max=-2, min=-2                                             │
 * │   Current cell value: 5                                                 │
 * │                                                                         │
 * │   Candidates for max: 4×5=20, (-2)×5=-10                                │
 * │   Candidates for min: 4×5=20, (-2)×5=-10                                │
 * │                                                                         │
 * │   maxDP[1][1] = 20                                                      │
 * │   minDP[1][1] = -10                                                     │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │ Cell (1,2): Can come from UP or LEFT                                    │
 * │   From UP:   max=-6, min=-6                                             │
 * │   From LEFT: max=20, min=-10                                            │
 * │   Current cell value: -6                                                │
 * │                                                                         │
 * │   Candidates: (-6)×(-6)=36, 20×(-6)=-120, (-10)×(-6)=60                 │
 * │                                                                         │
 * │   maxDP[1][2] = max(36, -120, 60) = 60  ← min became max! 🎯            │
 * │   minDP[1][2] = min(36, -120, 60) = -120                                │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Final maxDP and minDP grids:
 *
 * maxDP:                    minDP:
 * ┌─────┬─────┬─────┐      ┌──────┬──────┬──────┐
 * │  1  │ -2  │ -6  │      │   1  │  -2  │  -6  │
 * ├─────┼─────┼─────┤      ├──────┼──────┼──────┤
 * │  4  │ 20  │ 60  │      │   4  │ -10  │-120  │
 * ├─────┼─────┼─────┤      ├──────┼──────┼──────┤
 * │ 28  │-160 │1080 │      │  28  │-160  │-540  │
 * └─────┴─────┴─────┘      └──────┴──────┴──────┘
 *
 * Answer: maxDP[2][2] = 1080
 * Best Path: 1 → 4 → 5 → -6 → -8 × 9 ... (algorithm finds optimal)
 *
 * ============================================================================
 * RECURRENCE RELATION
 * ============================================================================
 *
 * For each cell (i, j):
 *
 *   candidates = [
 *     maxDP[i-1][j] × matrix[i][j],  // max from UP
 *     minDP[i-1][j] × matrix[i][j],  // min from UP (might become max!)
 *     maxDP[i][j-1] × matrix[i][j],  // max from LEFT
 *     minDP[i][j-1] × matrix[i][j]   // min from LEFT (might become max!)
 *   ]
 *
 *   maxDP[i][j] = max(candidates)
 *   minDP[i][j] = min(candidates)
 *
 * Base cases:
 *   - maxDP[0][0] = minDP[0][0] = matrix[0][0]
 *   - First row: only from LEFT
 *   - First column: only from UP
 *
 * ============================================================================
 * EDGE CASES
 * ============================================================================
 *
 * 1. SINGLE CELL: [[5]]
 *    → Return 5
 *
 * 2. SINGLE ROW: [[1, 2, 3]]
 *    → Only one path: 1×2×3 = 6
 *
 * 3. SINGLE COLUMN: [[1], [2], [3]]
 *    → Only one path: 1×2×3 = 6
 *
 * 4. CONTAINS ZERO: [[1, 0], [2, 3]]
 *    → Paths through 0 will have product 0
 *    → Best: 1→2→3 = 6
 *
 * 5. ALL NEGATIVE: [[-1, -2], [-3, -4]]
 *    → Even count of negatives gives positive product
 *    → Path: -1→-2→-4 = -8 OR -1→-3→-4 = -12
 *    → Best is -8 (less negative)
 *
 * 6. MIXED WITH NEGATIVES: Creates sign flip opportunities
 *
 * 7. LARGE VALUES: May cause integer overflow!
 *    → Consider using BigInt or modulo for very large products
 *
 * ============================================================================
 * 🆚 COMPARISON: PATH SUM vs PATH PRODUCT
 * ============================================================================
 *
 * ┌───────────────────┬────────────────────────┬─────────────────────────────┐
 * │ Aspect            │ PATH SUM               │ PATH PRODUCT                │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Operation         │ Addition (+)           │ Multiplication (×)          │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Track             │ Only max (or min)      │ BOTH max AND min            │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Why both?         │ Negatives always hurt  │ Neg × Neg = Pos! 🔑         │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Space             │ O(m×n) or O(n)         │ O(m×n) or O(n) × 2          │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Zero behavior     │ Adds nothing           │ KILLS the product chain     │
 * ├───────────────────┼────────────────────────┼─────────────────────────────┤
 * │ Recurrence        │ dp[i][j] = val +       │ maxDP = val × max(all opts) │
 * │                   │   max(up, left)        │ minDP = val × min(all opts) │
 * └───────────────────┴────────────────────────┴─────────────────────────────┘
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 *
 * Time:  O(m × n) - visit each cell once
 * Space: O(m × n) - two 2D arrays for max and min
 *        Can optimize to O(n) using rolling arrays
 *
 * ============================================================================
 * SIMILAR PROBLEMS
 * ============================================================================
 *
 * 1. Unique Paths (LeetCode 62) - Count paths, same structure
 * 2. Minimum Path Sum (LeetCode 64) - Sum instead of product, only track min
 * 3. Maximum Product Subarray (LeetCode 152) - 1D version of this concept
 * 4. Cherry Pickup - Two paths simultaneously
 * 5. Maximum Non-negative Product in a Matrix (LeetCode 1594) - Same problem!
 *
 * @param matrix - 2D array of integers (can be positive, negative, or zero)
 * @returns Maximum product of any valid path from (0,0) to (m-1,n-1)
 */
export function maxProductPath(matrix: number[][]): number {
    // Edge case: empty matrix
    if (matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }

    const m = matrix.length;
    const n = matrix[0].length;

    // Edge case: single cell
    if (m === 1 && n === 1) {
        return matrix[0][0];
    }

    // Two DP arrays: one for max product, one for min product
    // We need both because negative × negative = positive
    const maxDP: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
    const minDP: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));

    // Initialize starting point
    maxDP[0][0] = matrix[0][0];
    minDP[0][0] = matrix[0][0];

    // Initialize first row (can only come from left)
    for (let j = 1; j < n; j++) {
        const prod = maxDP[0][j - 1] * matrix[0][j];
        maxDP[0][j] = prod;
        minDP[0][j] = prod;
    }

    // Initialize first column (can only come from up)
    for (let i = 1; i < m; i++) {
        const prod = maxDP[i - 1][0] * matrix[i][0];
        maxDP[i][0] = prod;
        minDP[i][0] = prod;
    }

    // Fill the rest of the grid
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const val = matrix[i][j];

            // All candidates: multiply current cell with max/min from up and left
            const candidates = [
                maxDP[i - 1][j] * val,  // max from UP
                minDP[i - 1][j] * val,  // min from UP (might flip to max!)
                maxDP[i][j - 1] * val,  // max from LEFT
                minDP[i][j - 1] * val   // min from LEFT (might flip to max!)
            ];

            // Max product ending at this cell
            maxDP[i][j] = Math.max(...candidates);

            // Min product ending at this cell (needed for future sign flips)
            minDP[i][j] = Math.min(...candidates);
        }
    }

    // Answer is the maximum product to reach bottom-right
    return maxDP[m - 1][n - 1];
}

/**
 * ============================================================================
 * 16b. Space-Optimized Version - O(n) space instead of O(m×n)
 * ============================================================================
 *
 * Uses rolling arrays - only keeps track of previous row.
 * Same logic, but more memory efficient for large matrices.
 *
 * @example
 * const grid = [[1, -2, 3], [4, 5, -6], [7, -8, 9]];
 * console.log(maxProductPathOptimized(grid)); // Same result, less memory
 */
export function maxProductPathOptimized(matrix: number[][]): number {
    if (matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }

    const m = matrix.length;
    const n = matrix[0].length;

    if (m === 1 && n === 1) {
        return matrix[0][0];
    }

    // Only keep track of previous row's max and min
    let prevMax: number[] = Array(n).fill(0);
    let prevMin: number[] = Array(n).fill(0);

    // Initialize first row
    prevMax[0] = matrix[0][0];
    prevMin[0] = matrix[0][0];

    for (let j = 1; j < n; j++) {
        const prod = prevMax[j - 1] * matrix[0][j];
        prevMax[j] = prod;
        prevMin[j] = prod;
    }

    // Process remaining rows
    for (let i = 1; i < m; i++) {
        const currMax: number[] = Array(n).fill(0);
        const currMin: number[] = Array(n).fill(0);

        // First column: can only come from up
        const firstVal = matrix[i][0];
        const prod1 = prevMax[0] * firstVal;
        const prod2 = prevMin[0] * firstVal;
        currMax[0] = Math.max(prod1, prod2);
        currMin[0] = Math.min(prod1, prod2);

        // Rest of the row
        for (let j = 1; j < n; j++) {
            const val = matrix[i][j];

            const candidates = [
                prevMax[j] * val,     // max from UP
                prevMin[j] * val,     // min from UP
                currMax[j - 1] * val, // max from LEFT
                currMin[j - 1] * val  // min from LEFT
            ];

            currMax[j] = Math.max(...candidates);
            currMin[j] = Math.min(...candidates);
        }

        // Move to next row
        prevMax = currMax;
        prevMin = currMin;
    }

    return prevMax[n - 1];
}

/**
 * ============================================================================
 * 16c. LeetCode 1594: Maximum Non-negative Product in a Matrix
 * ============================================================================
 *
 * Same problem but returns:
 * - Result modulo 10^9 + 7 if maximum is non-negative
 * - -1 if maximum product is negative (no non-negative path exists)
 *
 * Uses BigInt to handle large products before applying modulo.
 *
 * @example
 * const grid = [[-1, -2, -3], [-2, -3, -3], [-3, -3, -2]];
 * console.log(maxProductPathMod(grid)); // Returns result % (10^9 + 7) or -1
 */
export function maxProductPathMod(matrix: number[][]): number {
    const MOD = 1e9 + 7;

    if (matrix.length === 0 || matrix[0].length === 0) {
        return -1;
    }

    const m = matrix.length;
    const n = matrix[0].length;

    // Use BigInt for large products before modulo
    const maxDP: bigint[][] = Array(m).fill(null).map(() => Array(n).fill(0n));
    const minDP: bigint[][] = Array(m).fill(null).map(() => Array(n).fill(0n));

    maxDP[0][0] = BigInt(matrix[0][0]);
    minDP[0][0] = BigInt(matrix[0][0]);

    // First row
    for (let j = 1; j < n; j++) {
        const val = BigInt(matrix[0][j]);
        const prod = maxDP[0][j - 1] * val;
        maxDP[0][j] = prod;
        minDP[0][j] = prod;
    }

    // First column
    for (let i = 1; i < m; i++) {
        const val = BigInt(matrix[i][0]);
        const prod = maxDP[i - 1][0] * val;
        maxDP[i][0] = prod;
        minDP[i][0] = prod;
    }

    // Fill rest
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const val = BigInt(matrix[i][j]);

            const candidates = [
                maxDP[i - 1][j] * val,
                minDP[i - 1][j] * val,
                maxDP[i][j - 1] * val,
                minDP[i][j - 1] * val
            ];

            maxDP[i][j] = candidates.reduce((a, b) => a > b ? a : b);
            minDP[i][j] = candidates.reduce((a, b) => a < b ? a : b);
        }
    }

    const result = maxDP[m - 1][n - 1];

    if (result < 0n) {
        return -1;
    }

    return Number(result % BigInt(MOD));
}

/**
 * ============================================================================
 * 19. Min Cost Climbing Stairs (LeetCode 746) - THE LADDER, DEMONSTRATED
 * ============================================================================
 *
 * PROBLEM: `cost[i]` is the price of stepping OFF stair i. You may start at
 * index 0 or index 1, and each move climbs 1 or 2 stairs. Reach the top (index
 * `n`, one past the last stair) for the minimum total cost.
 *
 * Real-World: a toll road where each on-ramp charges a fee and you may skip at
 * most one exit at a time — what is the cheapest way to the end?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      To stand on stair i you stepped off i-1 or i-2, paying THAT
 *                stair's cost (not your own — read the problem twice).
 * Q2 STATE       "Which stair am I standing on" — ONE number → 1D dp[i].
 * Q3 TRANSITION  dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
 * Q4 BASE CASE   dp[0] = dp[1] = 0 — you may START on either stair for free.
 *                ⭐ This is the whole difference from Climbing Stairs (#1), and
 *                the reason `prev2` and `prev1` both start at 0 here.
 * Q5 ORDER       i = 2 up to and INCLUDING n.
 * ANSWER         dp[n] — the "top" is one PAST the last stair, so the loop
 *                runs to n, not n-1. Off-by-one here is the standard mistake.
 *
 * ----------------------------------------------------------------------------
 * THIS PROBLEM IS THE FOLDER'S WORKED EXAMPLE OF THE 4-STEP METHOD
 * ----------------------------------------------------------------------------
 * The README prescribes: brute force → name the waste → memoize → tabulate →
 * roll to O(1). Below, each step is a SEPARATE exported function so the
 * progression can be read, run and compared rather than just described.
 *
 * ============================================================================
 * 🔑 KEY INSIGHT
 * ============================================================================
 * To stand at position i you must have come from i-1 or i-2, and you paid that
 * stair's cost to leave it:
 *
 *   minCost(i) = min( minCost(i-1) + cost[i-1], minCost(i-2) + cost[i-2] )
 *
 * Base: minCost(0) = minCost(1) = 0 — starting at either is free.
 * Answer: minCost(n) — the top is one PAST the last stair. Off-by-one here is
 * the single most common wrong submission.
 *
 * ============================================================================
 * DRY RUN: cost = [10, 15, 20]
 * ============================================================================
 * ┌───┬────────────────────────────────────────────┬────────┐
 * │ i │ from i-1 / from i-2                        │ dp[i]  │
 * ├───┼────────────────────────────────────────────┼────────┤
 * │ 0 │ base                                       │ 0      │
 * │ 1 │ base (free start)                          │ 0      │
 * │ 2 │ dp[1]+cost[1]=15  vs  dp[0]+cost[0]=10     │ 10     │
 * │ 3 │ dp[2]+cost[2]=30  vs  dp[1]+cost[1]=15     │ 15  ✨ │
 * └───┴────────────────────────────────────────────┴────────┘
 * Answer: 15 — start at stair 1, pay 15, jump two straight to the top.
 *
 * Time: O(n)  Space: O(1) for the final version
 */

/**
 * STEP 1 — BRUTE FORCE. Just encode the choice; correct but exponential.
 * Every call re-solves both smaller positions, and those overlap heavily:
 * minCost(5) needs minCost(3) via TWO different routes, and recomputes it both
 * times. That duplication is the "waste" the next step removes.
 *
 * @example
 * minCostClimbingStairsBruteForce([10, 15, 20]); // 15
 *
 * Time: O(2ⁿ) — a binary recursion tree. Space: O(n) call stack.
 */
export function minCostClimbingStairsBruteForce(cost: number[]): number {
  function minCost(i: number): number {
    if (i <= 1) return 0; // starting at 0 or 1 is free
    return Math.min(
      minCost(i - 1) + cost[i - 1], // arrived by a single step
      minCost(i - 2) + cost[i - 2]  // arrived by a double step
    );
  }
  return minCost(cost.length);
}

/**
 * STEP 2 — MEMOIZE. The identical recursion plus a cache: a 3-line change that
 * collapses O(2ⁿ) to O(n), because each position is now solved exactly once.
 * This is the version to write first in an interview — it is the fastest route
 * to a CORRECT answer, and tabulation is the natural follow-up.
 *
 * @example
 * minCostClimbingStairsMemo([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]); // 6
 *
 * Time: O(n) — n distinct subproblems, O(1) work each. Space: O(n).
 */
export function minCostClimbingStairsMemo(cost: number[]): number {
  const memo = new Map<number, number>();

  function minCost(i: number): number {
    if (i <= 1) return 0;
    if (memo.has(i)) return memo.get(i)!; // already solved — do not recurse

    const best = Math.min(
      minCost(i - 1) + cost[i - 1],
      minCost(i - 2) + cost[i - 2]
    );
    memo.set(i, best);
    return best;
  }

  return minCost(cost.length);
}

/**
 * STEP 3 — TABULATE, THEN ROLL TO O(1) ★ OPTIMAL.
 * Bottom-up removes the recursion; then notice the recurrence only ever reads
 * dp[i-1] and dp[i-2], so the whole array collapses into two variables.
 *
 * @example
 * // Real-world: cheapest sequence of toll booths, allowed to skip one at a time.
 * minCostClimbingStairs([10, 15, 20]);                              // 15
 * minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]);      // 6
 *
 * Time: O(n) — single pass. Space: O(1) — two rolling variables.
 */
export function minCostClimbingStairs(cost: number[]): number {
  // prev2 = best cost to reach i-2, prev1 = best cost to reach i-1
  let prev2 = 0;
  let prev1 = 0;

  for (let i = 2; i <= cost.length; i++) {
    const current = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
    prev2 = prev1; // slide the window forward one stair
    prev1 = current;
  }

  return prev1;
}

/**
 * ============================================================================
 * 20. Combination Sum IV (LeetCode 377) - COUNTING PERMUTATIONS
 * ============================================================================
 *
 * PROBLEM: given distinct positive integers `nums` and a `target`, count the
 * number of ORDERED sequences that sum to target. (1,1,2) and (2,1,1) count
 * separately — despite the problem's name, this counts permutations.
 *
 * Real-World: how many distinct sequences of coin taps reach an exact amount on
 * a vending machine, where tap order is visibly different to the user.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      "Which number comes NEXT in the sequence?" Try each.
 * Q2 STATE       "How much target is left" — ONE number → 1D dp[target].
 * Q3 TRANSITION  dp[t] += dp[t - num] for every num that fits.
 * Q4 BASE CASE   dp[0] = 1 — the empty sequence. Every count is grown from
 *                this single seed, so a 0 here zeroes the whole answer.
 * Q5 ORDER       ⭐⭐ THE TARGET LOOP IS ON THE OUTSIDE. That one fact is the
 *                entire difference between this problem and #21 (Coin Change II).
 *                Target outside → each t is free to be reached by any number in
 *                any order → ORDER MATTERS → permutations (1+2 and 2+1 both
 *                count). Coin outside → combinations.
 * ANSWER         dp[target].
 *
 * Read this block and #21's side by side. Same table, same base case, same
 * transition — one loop swap, two different answers.
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — the loop order IS the answer
 * ============================================================================
 * This problem and Coin Change II (#21 below) have nearly identical code and
 * count DIFFERENT things. The ONLY structural difference is which loop is
 * outer, and it is the single most-tested DP subtlety in interviews:
 *
 *   TARGET outer, NUMS inner  → PERMUTATIONS (order matters)   ← this problem
 *   COINS  outer, TARGET inner → COMBINATIONS (order ignored)  ← #21
 *
 * WHY: with target outer, every amount is completed by trying every number as
 * the LAST element, so each ordering is reached by a different final choice.
 * With coins outer, coin k is never considered before coin k-1 is exhausted, so
 * a multiset can only be built in one canonical order — orderings collapse.
 *
 * Recurrence: dp[t] = Σ dp[t - num] for every num ≤ t;  dp[0] = 1.
 * dp[0] = 1 is "the empty sequence sums to 0" — the seed that makes the whole
 * count non-zero, not an edge case.
 *
 * ============================================================================
 * DRY RUN: nums = [1, 2, 3], target = 4
 * ============================================================================
 * ┌───┬──────────────────────────────────────────┬───────┐
 * │ t │ dp[t] = dp[t-1] + dp[t-2] + dp[t-3]      │ value │
 * ├───┼──────────────────────────────────────────┼───────┤
 * │ 0 │ seed: the empty sequence                 │ 1     │
 * │ 1 │ dp[0]                                    │ 1     │
 * │ 2 │ dp[1] + dp[0]                            │ 2     │
 * │ 3 │ dp[2] + dp[1] + dp[0]                    │ 4     │
 * │ 4 │ dp[3] + dp[2] + dp[1]  = 4 + 2 + 1       │ 7  ✨ │
 * └───┴──────────────────────────────────────────┴───────┘
 * The 7: (1,1,1,1) (1,1,2) (1,2,1) (2,1,1) (2,2) (1,3) (3,1)
 *
 * FOLLOW-UP interviewers love: "what if negatives were allowed?" Then sequences
 * can be infinitely long (+1 -1 +1 -1 …), the count is unbounded, and you would
 * need a cap on sequence length to make the question well-posed.
 */

/**
 * STEP 1 — BRUTE FORCE: try every number at every position.
 *
 * @example
 * combinationSum4BruteForce([1, 2, 3], 4); // 7
 *
 * Time: O(nᵗ) exponential. Space: O(t) call stack.
 */
export function combinationSum4BruteForce(nums: number[], target: number): number {
  function count(remaining: number): number {
    if (remaining === 0) return 1; // one complete sequence found
    if (remaining < 0) return 0;   // overshot — dead end

    let total = 0;
    for (const num of nums) total += count(remaining - num);
    return total;
  }
  return count(target);
}

/**
 * STEP 2 — MEMOIZE on `remaining`, the only thing that varies.
 *
 * @example
 * combinationSum4Memo([1, 2, 3], 4); // 7
 *
 * Time: O(target × n). Space: O(target).
 */
export function combinationSum4Memo(nums: number[], target: number): number {
  const memo = new Map<number, number>();

  function count(remaining: number): number {
    if (remaining === 0) return 1;
    if (remaining < 0) return 0;
    if (memo.has(remaining)) return memo.get(remaining)!;

    let total = 0;
    for (const num of nums) total += count(remaining - num);
    memo.set(remaining, total);
    return total;
  }

  return count(target);
}

/**
 * STEP 3 — TABULATE ★ OPTIMAL. Target outer, nums inner → permutations.
 *
 * @example
 * // Real-world: distinct ordered tap sequences that reach an exact amount.
 * combinationSum4([1, 2, 3], 4); // 7  — order matters, so (1,2,1) ≠ (2,1,1)
 * combinationSum4([9], 3);       // 0
 *
 * Time: O(target × n). Space: O(target).
 */
export function combinationSum4(nums: number[], target: number): number {
  const dp = new Array<number>(target + 1).fill(0);
  dp[0] = 1; // the empty sequence — the seed every other count is built from

  // TARGET is the outer loop → each amount tries every num as its LAST element
  // → orderings are counted separately.
  for (let t = 1; t <= target; t++) {
    for (const num of nums) {
      if (num <= t) dp[t] += dp[t - num];
    }
  }

  return dp[target];
}

/**
 * ============================================================================
 * 21. Coin Change II (LeetCode 518) - COUNTING COMBINATIONS
 * ============================================================================
 *
 * PROBLEM: given coin denominations and an `amount`, count how many distinct
 * COMBINATIONS of coins sum to it. {1,1,2} and {2,1,1} are the same multiset
 * and count ONCE.
 *
 * Real-World: how many distinct ways can a cash drawer make exactly $2.35? The
 * order coins leave the drawer is irrelevant — only the multiset matters.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      "How many of THIS coin do I use — 0, 1, 2, …?" Handled
 *                implicitly: the inner loop sweeps upward, so a coin can be
 *                re-added to an amount it already contributed to.
 * Q2 STATE       "Which amount am I building" — ONE number → 1D dp[amount].
 * Q3 TRANSITION  dp[t] += dp[t - coin]
 * Q4 BASE CASE   dp[0] = 1 — exactly one way to make 0: take nothing.
 * Q5 ORDER       ⭐⭐ THE COIN LOOP IS ON THE OUTSIDE. Each coin is fully
 *                processed before the next is introduced, so a multiset is only
 *                ever counted once, in one canonical order → COMBINATIONS
 *                ({1,1,2} and {2,1,1} are the same answer). Swap the loops and
 *                you have written #20 instead.
 *
 *                And note the inner loop goes UPWARD, which permits reuse of a
 *                coin. #22 (0/1 knapsack) runs it DOWNWARD to forbid reuse.
 *                Two loop directions, three different problems.
 * ANSWER         dp[amount].
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — read this next to #20 above
 * ============================================================================
 * Same recurrence, loops swapped. Putting COINS on the outside means each coin
 * is fully considered before the next one is introduced, so a multiset is only
 * ever assembled in one canonical (non-decreasing) order and permutations
 * collapse into a single count.
 *
 * ┌──────────────────────┬───────────────────┬──────────────────────────┐
 * │                      │ Coin Change II    │ Combination Sum IV       │
 * │                      │ (LC518, #21)      │ (LC377, #20)             │
 * ├──────────────────────┼───────────────────┼──────────────────────────┤
 * │ counts               │ combinations      │ permutations             │
 * │ outer loop           │ coins             │ target                   │
 * │ inner loop           │ target            │ nums                     │
 * │ [1,2], target 3      │ 2 → {1,1,1}, {1,2}│ 3 → (1,1,1), (1,2), (2,1)│
 * │                      │ order ignored     │ (1,2) and (2,1) differ   │
 * └──────────────────────┴───────────────────┴──────────────────────────┘
 *
 * That one row is the whole lesson: the SAME two multisets, but the
 * permutation count splits {1,2} into two orderings while the combination
 * count keeps it as one.
 *
 * Also contrast with `coinChange` (#7, LC322) which MINIMIZES coin count on the
 * same input shape. Three problems, one table, three different questions —
 * a favourite interview progression.
 *
 * ============================================================================
 * DRY RUN: coins = [1, 2, 5], amount = 5
 * ============================================================================
 * dp starts [1,0,0,0,0,0]  (dp[0] = 1: one way to make nothing)
 *   after coin 1: [1,1,1,1,1,1]   only all-ones
 *   after coin 2: [1,1,2,2,3,3]   e.g. dp[4]: {1×4}, {1,1,2}, {2,2}
 *   after coin 5: [1,1,2,2,3,4]   dp[5] gains {5} → 4  ✨
 * The 4: {1,1,1,1,1} {1,1,1,2} {1,2,2} {5}
 *
 * ⚠️ The inner loop runs FORWARD (t = coin → amount). That is deliberate: a
 * coin may be reused, so dp[t - coin] must already include this same coin.
 * Compare knapsack01 (#22), which runs BACKWARD precisely to forbid reuse.
 */

/**
 * STEP 1 — BRUTE FORCE: at each coin index, either take it (staying on the same
 * index, since coins are unlimited) or skip to the next. Fixing an index and
 * never going back is what stops permutations being double-counted.
 *
 * @example
 * coinChange2BruteForce([1, 2, 5], 5); // 4
 *
 * Time: exponential. Space: O(amount) call stack.
 */
export function coinChange2BruteForce(coins: number[], amount: number): number {
  function count(index: number, remaining: number): number {
    if (remaining === 0) return 1;
    if (remaining < 0 || index >= coins.length) return 0;

    // take coins[index] again (index unchanged) OR move past it forever
    return count(index, remaining - coins[index]) + count(index + 1, remaining);
  }
  return count(0, amount);
}

/**
 * STEP 2 — MEMOIZE on the (index, remaining) pair — BOTH vary, so both are part
 * of the cache key. Memoizing on `remaining` alone would be wrong here and is a
 * classic interview slip.
 *
 * @example
 * coinChange2Memo([1, 2, 5], 5); // 4
 *
 * Time: O(coins × amount). Space: O(coins × amount).
 */
export function coinChange2Memo(coins: number[], amount: number): number {
  const memo = new Map<string, number>();

  function count(index: number, remaining: number): number {
    if (remaining === 0) return 1;
    if (remaining < 0 || index >= coins.length) return 0;

    const key = `${index},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;

    const total =
      count(index, remaining - coins[index]) + count(index + 1, remaining);
    memo.set(key, total);
    return total;
  }

  return count(0, amount);
}

/**
 * STEP 3 — TABULATE ★ OPTIMAL. Coins outer, amount inner → combinations.
 * The 2D table over (coin index, amount) rolls to 1D because each row only
 * reads the row above and cells to its left.
 *
 * @example
 * // Real-world: distinct ways a cash drawer can make exact change.
 * coinChange2([1, 2, 5], 5); // 4  — {1×5} {1,1,1,2} {1,2,2} {5}
 * coinChange2([2], 3);       // 0
 * coinChange2([1], 0);       // 1  — the empty selection makes 0
 *
 * Time: O(coins × amount). Space: O(amount).
 */
export function coinChange2(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(0);
  dp[0] = 1; // exactly one way to make 0: take nothing

  // COINS is the outer loop → each coin is finished before the next starts,
  // so {1,2} and {2,1} are never both counted.
  for (const coin of coins) {
    // FORWARD, because coins are unlimited: dp[t - coin] may already use `coin`.
    for (let t = coin; t <= amount; t++) {
      dp[t] += dp[t - coin];
    }
  }

  return dp[amount];
}

/** LeetCode names this function `change`. Alias kept for recall. */
export const change = coinChange2;

/**
 * ============================================================================
 * 22. 0/1 Knapsack - THE TAKE-OR-SKIP TEMPLATE
 * ============================================================================
 *
 * PROBLEM: given item weights and values and a capacity, maximize total value.
 * Each item may be taken AT MOST ONCE — that "0 or 1" is the whole difference
 * from coinChange/coinChange2, where items are unlimited.
 *
 * Real-World: which subset of features fits in one release sprint to maximize
 * delivered value? Each feature is built once or not at all.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      TAKE this item (pay its weight, collect its value) or SKIP it.
 *                Each item is offered exactly once.
 * Q2 STATE       "Which item am I deciding" AND "how much capacity is left" —
 *                TWO numbers → 2D dp[i][c], which then rolls down to 1D.
 *                ⭐ Compare Coin Change (#7): there, items were reusable, so
 *                "which item" was not part of the state and 1D was enough from
 *                the start. Banning reuse is exactly what adds the dimension.
 * Q3 TRANSITION  dp[c] = max(dp[c], values[i] + dp[c - weights[i]])
 *                         └ skip ┘   └────────── take ──────────┘
 * Q4 BASE CASE   dp[*] = 0 — zero items in the bag is worth zero.
 * Q5 ORDER       ⭐⭐ Items on the OUTSIDE; capacity DOWNWARD on the inside.
 *                The downward sweep is the entire 0/1 guarantee: going upward
 *                would let dp[c - w] already include the current item, silently
 *                solving UNBOUNDED knapsack (i.e. #21) instead.
 * ANSWER         dp[capacity].
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — why this template is worth memorizing
 * ============================================================================
 * Two problems below (#23 Partition Equal Subset Sum, #24 Target Sum) are this
 * function wearing a costume. Learning the template once buys three problems.
 *
 * At each item you have exactly two choices:
 *   SKIP:  dp[i][c] = dp[i-1][c]
 *   TAKE:  dp[i][c] = values[i-1] + dp[i-1][c - weights[i-1]]   (if it fits)
 *   dp[i][c] = max(SKIP, TAKE)
 *
 * ⚠️ THE BACKWARD-LOOP RULE (the #1 knapsack bug):
 * When rolling to 1D, the capacity loop must run BACKWARD. Going forward would
 * let dp[c - w] already contain the current item, silently turning 0/1 knapsack
 * into UNBOUNDED knapsack. Forward = reuse allowed (coinChange2, #21).
 * Backward = each item used at most once. One loop direction, two problems.
 *
 * ============================================================================
 * DRY RUN: weights = [1, 3, 4, 5], values = [1, 4, 5, 7], capacity = 7
 * ============================================================================
 *      c:   0   1   2   3   4   5   6   7
 *   none:   0   0   0   0   0   0   0   0
 *   w=1:    0   1   1   1   1   1   1   1
 *   w=3:    0   1   1   4   5   5   5   5    (4 alone, or 1+4=5 at c=4)
 *   w=4:    0   1   1   4   5   6   6   9    (c=7: 3+4 → 4+5 = 9) ✨
 *   w=5:    0   1   1   4   5   7   8   9    (c=7 stays 9; 7+1=8 < 9 at c=6→8)
 * Answer: 9 — take items of weight 3 and 4 (values 4 + 5).
 *
 * Time: O(n × capacity)  Space: O(capacity) for the rolled version
 */

/**
 * STEP 1 — BRUTE FORCE: enumerate every subset via take/skip.
 *
 * @example
 * knapsack01BruteForce([1, 3, 4, 5], [1, 4, 5, 7], 7); // 9
 *
 * Time: O(2ⁿ). Space: O(n) call stack.
 */
export function knapsack01BruteForce(
  weights: number[],
  values: number[],
  capacity: number
): number {
  function best(index: number, remaining: number): number {
    if (index >= weights.length || remaining <= 0) return 0;

    const skip = best(index + 1, remaining);
    if (weights[index] > remaining) return skip; // does not fit — no choice

    const take = values[index] + best(index + 1, remaining - weights[index]);
    return Math.max(skip, take);
  }
  return best(0, capacity);
}

/**
 * STEP 2 — MEMOIZE on (index, remaining).
 *
 * @example
 * knapsack01Memo([1, 3, 4, 5], [1, 4, 5, 7], 7); // 9
 *
 * Time: O(n × capacity). Space: O(n × capacity).
 */
export function knapsack01Memo(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const memo = new Map<string, number>();

  function best(index: number, remaining: number): number {
    if (index >= weights.length || remaining <= 0) return 0;

    const key = `${index},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;

    const skip = best(index + 1, remaining);
    const take =
      weights[index] > remaining
        ? skip
        : values[index] + best(index + 1, remaining - weights[index]);

    const answer = Math.max(skip, take);
    memo.set(key, answer);
    return answer;
  }

  return best(0, capacity);
}

/**
 * STEP 3 — TABULATE (2D). The version to draw on the whiteboard: the table IS
 * the explanation, and reading it back proves the recurrence.
 *
 * @example
 * knapsack01Table([1, 3, 4, 5], [1, 4, 5, 7], 7); // 9
 *
 * Time: O(n × capacity). Space: O(n × capacity).
 */
export function knapsack01Table(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const n = weights.length;
  // dp[i][c] = best value using the first i items within capacity c
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let c = 0; c <= capacity; c++) {
      dp[i][c] = dp[i - 1][c]; // SKIP item i-1
      if (weights[i - 1] <= c) {
        // TAKE it: add its value to the best of the REMAINING capacity,
        // using only earlier items (row i-1) so it cannot be taken twice.
        dp[i][c] = Math.max(dp[i][c], values[i - 1] + dp[i - 1][c - weights[i - 1]]);
      }
    }
  }

  return dp[n][capacity];
}

/**
 * STEP 4 — ROLL TO 1D ★ OPTIMAL. Each row reads only the row above, so one
 * array suffices — provided the capacity loop runs BACKWARD (see the rule in
 * the header above).
 *
 * @example
 * // Real-world: pick the feature set that maximizes value within one sprint.
 * knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7); // 9
 *
 * Time: O(n × capacity). Space: O(capacity).
 */
export function knapsack01(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const dp = new Array<number>(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    // BACKWARD: guarantees dp[c - weights[i]] is still the PREVIOUS row's value,
    // i.e. a state where item i has not been used yet.
    for (let c = capacity; c >= weights[i]; c--) {
      dp[c] = Math.max(dp[c], values[i] + dp[c - weights[i]]);
    }
  }

  return dp[capacity];
}

/**
 * ============================================================================
 * 23. Partition Equal Subset Sum (LeetCode 416) - KNAPSACK IN DISGUISE
 * ============================================================================
 *
 * PROBLEM: can `nums` be split into two subsets with equal sums?
 *
 * Real-World: can this batch of jobs be split across two identical machines so
 * both finish at the same time?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      For each number: put it in the subset, or leave it out.
 *                (Take-or-skip again — this is #22 wearing a costume.)
 * Q2 STATE       "Is this sum reachable" — ONE number → 1D dp[sum], holding a
 *                BOOLEAN rather than a value.
 * Q3 TRANSITION  dp[s] = dp[s] || dp[s - num]
 *                           └ skip ┘  └── take ──┘
 *                Feasibility → OR, exactly as in Word Break (#6).
 * Q4 BASE CASE   dp[0] = true — sum 0 is always reachable by taking nothing.
 * Q5 ORDER       Numbers outside, sum DOWNWARD — same 0/1 rule as #22, since
 *                each number may be used at most once.
 * ANSWER         dp[total/2].
 *
 * ⭐ THE REFRAME: "split into two equal halves" means "find a subset summing
 * to total/2", because the leftovers then sum to the same thing automatically.
 * And if `total` is ODD you can return false in O(1) with no DP at all — always
 * look for that free rejection before building a table.
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — the reframe is the whole problem
 * ============================================================================
 * "Split into two equal halves" = "find a subset summing to total/2". The other
 * subset is then forced. So this is 0/1 knapsack (#22) with weight = value =
 * nums[i], asking feasibility instead of maximum.
 *
 * TWO O(1) REJECTIONS BEFORE ANY DP — say these out loud, they earn credit:
 *   1. An ODD total can never split evenly → false immediately.
 *   2. (Optional) any single element greater than total/2 makes it impossible.
 *
 * Recurrence: dp[s] = dp[s] || dp[s - num], capacity loop BACKWARD (each number
 * is used at most once — the same 0/1 rule as #22).
 *
 * ============================================================================
 * DRY RUN: nums = [1, 5, 11, 5] → total 22 → target 11
 * ============================================================================
 *   start:        dp[0]=true, everything else false
 *   after 1:      reachable {0,1}
 *   after 5:      reachable {0,1,5,6}
 *   after 11:     reachable {0,1,5,6,11,12,16,17}   → dp[11] is now true ✨
 *   after 5:      reachable also {10,11,...}
 *   → true: {11} and {1,5,5} both sum to 11.
 * Counter-example [1,2,3,5]: total 11 is ODD → false without any DP work.
 *
 * Time: O(n × total/2)  Space: O(total/2)
 */

/**
 * STEP 1 — BRUTE FORCE: take-or-skip over every element.
 *
 * @example
 * canPartitionBruteForce([1, 5, 11, 5]); // true
 *
 * Time: O(2ⁿ). Space: O(n).
 */
export function canPartitionBruteForce(nums: number[]): boolean {
  const total = nums.reduce((sum, n) => sum + n, 0);
  if (total % 2 !== 0) return false; // odd total can never split evenly

  function reachable(index: number, remaining: number): boolean {
    if (remaining === 0) return true;
    if (index >= nums.length || remaining < 0) return false;
    return (
      reachable(index + 1, remaining - nums[index]) || // take
      reachable(index + 1, remaining)                  // skip
    );
  }

  return reachable(0, total / 2);
}

/**
 * STEP 2 — MEMOIZE on (index, remaining).
 *
 * @example
 * canPartitionMemo([1, 5, 11, 5]); // true
 *
 * Time: O(n × total). Space: O(n × total).
 */
export function canPartitionMemo(nums: number[]): boolean {
  const total = nums.reduce((sum, n) => sum + n, 0);
  if (total % 2 !== 0) return false;

  const memo = new Map<string, boolean>();

  function reachable(index: number, remaining: number): boolean {
    if (remaining === 0) return true;
    if (index >= nums.length || remaining < 0) return false;

    const key = `${index},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;

    const answer =
      reachable(index + 1, remaining - nums[index]) ||
      reachable(index + 1, remaining);
    memo.set(key, answer);
    return answer;
  }

  return reachable(0, total / 2);
}

/**
 * STEP 3 — TABULATE ★ OPTIMAL: a boolean 0/1 knapsack over reachable sums.
 *
 * @example
 * // Real-world: can these jobs be split across two machines evenly?
 * canPartition([1, 5, 11, 5]); // true  ({11} and {1,5,5})
 * canPartition([1, 2, 3, 5]);  // false (total 11 is odd)
 *
 * Time: O(n × total/2). Space: O(total/2).
 */
export function canPartition(nums: number[]): boolean {
  const total = nums.reduce((sum, n) => sum + n, 0);
  if (total % 2 !== 0) return false; // O(1) rejection — no DP needed

  const target = total / 2;
  const dp = new Array<boolean>(target + 1).fill(false);
  dp[0] = true; // sum 0 is always reachable: take nothing

  for (const num of nums) {
    // BACKWARD — 0/1: each number contributes at most once (see #22's rule).
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }

  return dp[target];
}

/**
 * ============================================================================
 * 24. Target Sum (LeetCode 494) - SUBSET SUM AFTER AN ALGEBRA TRICK
 * ============================================================================
 *
 * PROBLEM: assign a '+' or '-' to each number in `nums` so the expression
 * evaluates to `target`. Count the assignments.
 *
 * Real-World: how many ways can a set of credits and debits be signed so the
 * ledger lands on an exact balance?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * Q1 CHOICE      Give each number a '+' or a '-'.
 * Q2 STATE       ⭐ Naively "index + running total", where the total can go
 *                negative — awkward to index. The ALGEBRA below removes that
 *                problem entirely and leaves ONE non-negative number → 1D.
 * Q3 TRANSITION  dp[s] += dp[s - num]   (a counting subset-sum)
 * Q4 BASE CASE   dp[0] = 1 — one way to reach sum 0: the empty subset.
 * Q5 ORDER       Numbers outside, sum DOWNWARD (each number used once, #22's rule).
 * ANSWER         dp[(total + target) / 2].
 *
 * ⭐ THE ALGEBRA THAT UNLOCKS IT — the actual content of this problem:
 *   Let P = the numbers you make positive, N = the ones you negate.
 *     P - N = target      (what the problem asks)
 *     P + N = total       (every number is in one group or the other)
 *   Add them: 2P = target + total, so P = (target + total) / 2.
 * So "count the sign assignments" becomes "count the subsets summing to P" —
 * a problem you already solved in #23. The exponential search over 2ⁿ sign
 * choices was never necessary.
 *
 * ⚠️ TWO FREE REJECTIONS, both worth stating: if |target| > total it is
 * unreachable, and if (target + total) is ODD then P is not an integer, so the
 * answer is 0. Check these before allocating anything.
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — turn signs into a subset choice
 * ============================================================================
 * Let P be the numbers given '+' and N those given '-'. Then:
 *
 *     P - N = target          and          P + N = total
 *   ⇒ 2P = total + target
 *   ⇒ P = (total + target) / 2
 *
 * So "count sign assignments" becomes "count subsets summing to P" — the
 * counting form of 0/1 knapsack (#22). This algebraic reframe is the entire
 * difficulty; the DP afterwards is six lines.
 *
 * ⚠️ TWO GUARDS the reframe forces, both easy to forget:
 *   1. (total + target) must be EVEN — otherwise P is not an integer → 0 ways.
 *   2. |target| must be ≤ total — otherwise P is out of range → 0 ways.
 *
 * ⚠️ ZEROS: a 0 can be signed '+' or '-' with the same result, so each zero
 * DOUBLES the count. The subset-sum formulation handles this automatically
 * (dp[0] starts at 1 and each zero adds dp[s] to itself) — but only if the
 * loop is written over sums rather than over "distinct subsets".
 *
 * ============================================================================
 * DRY RUN: nums = [1,1,1,1,1], target = 3 → total = 5
 * ============================================================================
 *   P = (5 + 3) / 2 = 4  → count subsets of [1,1,1,1,1] summing to 4
 *   dp starts [1,0,0,0,0]
 *   after each 1, dp becomes (backward loop over s):
 *     [1,1,0,0,0] → [1,2,1,0,0] → [1,3,3,1,0] → [1,4,6,4,1] → [1,5,10,10,5]
 *   dp[4] = 5  ✨  (choose which ONE of the five 1s gets the minus sign)
 *
 * Time: O(n × total)  Space: O(total)
 */

/**
 * STEP 1 — BRUTE FORCE: branch on '+' and '-' at every position.
 *
 * @example
 * findTargetSumWaysBruteForce([1, 1, 1, 1, 1], 3); // 5
 *
 * Time: O(2ⁿ). Space: O(n).
 */
export function findTargetSumWaysBruteForce(nums: number[], target: number): number {
  function count(index: number, runningSum: number): number {
    if (index === nums.length) return runningSum === target ? 1 : 0;
    return (
      count(index + 1, runningSum + nums[index]) +
      count(index + 1, runningSum - nums[index])
    );
  }
  return count(0, 0);
}

/**
 * STEP 2 — MEMOIZE on (index, runningSum). Note the running sum can be
 * negative, so a Map keyed by a string beats a plain array here.
 *
 * @example
 * findTargetSumWaysMemo([1, 1, 1, 1, 1], 3); // 5
 *
 * Time: O(n × total). Space: O(n × total).
 */
export function findTargetSumWaysMemo(nums: number[], target: number): number {
  const memo = new Map<string, number>();

  function count(index: number, runningSum: number): number {
    if (index === nums.length) return runningSum === target ? 1 : 0;

    const key = `${index},${runningSum}`;
    if (memo.has(key)) return memo.get(key)!;

    const total =
      count(index + 1, runningSum + nums[index]) +
      count(index + 1, runningSum - nums[index]);
    memo.set(key, total);
    return total;
  }

  return count(0, 0);
}

/**
 * STEP 3 — REFRAME + TABULATE ★ OPTIMAL: count subsets summing to
 * (total + target) / 2.
 *
 * @example
 * // Real-world: ways to sign a ledger's entries to hit an exact balance.
 * findTargetSumWays([1, 1, 1, 1, 1], 3); // 5
 * findTargetSumWays([1], 1);             // 1
 * findTargetSumWays([1], 2);             // 0  (|target| > total)
 *
 * Time: O(n × total). Space: O(total).
 */
export function findTargetSumWays(nums: number[], target: number): number {
  const total = nums.reduce((sum, n) => sum + n, 0);

  // Guard 1: |target| beyond what the numbers can reach at all.
  if (Math.abs(target) > total) return 0;
  // Guard 2: P = (total + target)/2 must be a whole number.
  if ((total + target) % 2 !== 0) return 0;

  const subsetTarget = (total + target) / 2;
  const dp = new Array<number>(subsetTarget + 1).fill(0);
  dp[0] = 1; // one way to reach sum 0: the empty subset

  for (const num of nums) {
    // BACKWARD — each number is assigned a sign exactly once.
    for (let s = subsetTarget; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }

  return dp[subsetTarget];
}

/**
 * ============================================================================
 * 25. Palindromic Substrings (LeetCode 647) - COUNT, DON'T COLLECT
 * ============================================================================
 *
 * PROBLEM: count how many substrings of `s` are palindromes. Substrings at
 * different positions count separately even if they look identical: "aaa" has
 * 6 ("a","a","a","aa","aa","aaa").
 *
 * Real-World: scoring how much symmetry a DNA read contains, or detecting
 * mirrored token runs in a log stream.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions from the file header)
 * ============================================================================
 *
 * ⭐ This problem has TWO good answers, and the shipped one is NOT a table.
 * Read `countSubstringsDP` for the table version and `countSubstrings` for the
 * expand-around-centre version; both are O(n²) time, but the centre version is
 * O(1) space.
 *
 * Q1 CHOICE      Pick a CENTRE, then keep widening while the two ends match.
 * Q2 STATE       The centre and how far you have expanded. Because the
 *                expansion only ever moves outward, no table is needed at all —
 *                two moving indices carry the whole state.
 * Q3 TRANSITION  while s[left] === s[right]: count++, then left--, right++.
 * Q4 BASE CASE   Every single character is a palindrome (the first step of
 *                every odd-length expansion).
 * Q5 ORDER       Centres left to right — and there are 2n-1 of them, not n.
 * ANSWER         The running count.
 *
 * ⚠️ THE FORGOTTEN HALF: palindromes can have EVEN length ("abba"), whose
 * centre sits BETWEEN two characters. That is why the loop calls expand twice
 * per index — expand(i, i) for odd and expand(i, i+1) for even. Omitting the
 * even case is the single most common bug in this problem.
 *
 * For the range-DP treatment of the same string shape, see #29 (Longest
 * Palindromic Subsequence).
 *
 * ============================================================================
 * 🔑 KEY INSIGHT — two valid solutions, know both
 * ============================================================================
 * (a) EXPAND AROUND CENTRE — a palindrome is defined by its centre, and there
 *     are 2n-1 centres (n single characters + n-1 gaps between them). Push out
 *     from each while the ends match. O(n²) time, O(1) SPACE.
 * (b) DP TABLE — dp[i][j] = "s[i..j] is a palindrome" =
 *     s[i] === s[j] AND (the inside is a palindrome or shorter than 2 chars).
 *     O(n²) time and O(n²) space, but it generalizes to Longest Palindromic
 *     Subsequence and friends.
 *
 * Same time complexity; (a) wins on space, (b) wins on transferability. Saying
 * exactly that is the answer interviewers are listening for.
 *
 * ⚠️ THE ODD/EVEN TRAP: expanding only from single characters finds "aba" but
 * MISSES "abba". Both centre kinds must be tried — the most common bug here.
 *
 * ⚠️ DP FILL ORDER: dp[i][j] depends on dp[i+1][j-1] — a shorter, more inward
 * span. So i must sweep BOTTOM-UP (or iterate by increasing length); a naive
 * top-down i loop reads cells that are not filled yet.
 *
 * ============================================================================
 * DRY RUN: s = "aaa"
 * ============================================================================
 *   centre 0   ("a")    → "a"                        → 1
 *   centre 0-1 ("aa")   → "aa"                       → 1
 *   centre 1   ("a")    → "a", then "aaa"            → 2
 *   centre 1-2 ("aa")   → "aa"                       → 1
 *   centre 2   ("a")    → "a"                        → 1
 *   total = 6  ✨
 *
 * Related: `Strings/longestPalindromicSubstring.ts` solves LC5 with the same
 * expand-around-centre engine — return the longest span instead of counting.
 *
 * Time: O(n²)  Space: O(1) for the optimal version
 */

/**
 * STEP 1 — BRUTE FORCE: generate every substring, test each for palindromicity.
 *
 * @example
 * countSubstringsBruteForce("aaa"); // 6
 *
 * Time: O(n³) — O(n²) substrings × O(n) to check each. Space: O(n).
 */
export function countSubstringsBruteForce(s: string): number {
  function isPalindrome(text: string): boolean {
    let left = 0;
    let right = text.length - 1;
    while (left < right) {
      if (text[left] !== text[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  let count = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (isPalindrome(s.slice(i, j + 1))) count++;
    }
  }
  return count;
}

/**
 * STEP 2 — DP TABLE: reuse the shorter span's answer instead of rescanning it.
 * Drops the O(n) inner check to O(1), giving O(n²).
 *
 * @example
 * countSubstringsDP("abc"); // 3
 *
 * Time: O(n²). Space: O(n²).
 */
export function countSubstringsDP(s: string): number {
  const n = s.length;
  // dp[i][j] = is s[i..j] a palindrome?
  const dp: boolean[][] = Array.from({ length: n }, () =>
    new Array<boolean>(n).fill(false)
  );
  let count = 0;

  // i descends so that dp[i+1][j-1] (the inside) is already computed.
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      // Ends match AND (the span is ≤ 2 chars, so there is no inside to check,
      // OR the inside is itself a palindrome).
      if (s[i] === s[j] && (j - i < 2 || dp[i + 1][j - 1])) {
        dp[i][j] = true;
        count++;
      }
    }
  }

  return count;
}

/**
 * STEP 3 — EXPAND AROUND CENTRE ★ OPTIMAL (same O(n²) time, O(1) space).
 *
 * @example
 * // Real-world: how much mirrored structure does this sequence contain?
 * countSubstrings("abc"); // 3  ("a", "b", "c")
 * countSubstrings("aaa"); // 6
 *
 * Time: O(n²) — 2n-1 centres × O(n) expansion. Space: O(1).
 */
export function countSubstrings(s: string): number {
  let count = 0;

  function expand(left: number, right: number): void {
    // Every step outward that still matches is one more palindrome.
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
  }

  for (let centre = 0; centre < s.length; centre++) {
    expand(centre, centre);     // ODD  length: "aba"
    expand(centre, centre + 1); // EVEN length: "abba" — do not forget this one
  }

  return count;
}

/**
 * ============================================================================
 * 26. Min Path Sum (LeetCode 64) - GRID DP, THE FULL LADDER
 * ============================================================================
 *
 * An m x n grid of non-negative costs. Start top-left, finish bottom-right,
 * and you may only ever move RIGHT or DOWN. Return the cheapest total.
 *
 * ============================================================================
 * 🌍 REAL-WORLD SCENARIOS
 * ============================================================================
 *
 * 1. DELIVERY COST: each cell is a toll; you can only drive east or south.
 * 2. IMAGE SEAM CARVING: cheapest top-to-bottom seam of pixel energies.
 * 3. DIFF / ALIGNMENT: this is the same shape as edit distance (problem 15),
 *    which is why learning THIS one makes that one easier.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED (the five questions, in plain English)
 * ============================================================================
 *
 * Q1 CHOICE      At every cell: "did I arrive here from ABOVE, or from the
 *                LEFT?" Those are the only two ways in. That is the choice.
 * Q2 STATE       "Which cell am I standing on" = row + column = TWO numbers
 *                → so the table is 2D: dp[r][c].
 * Q3 TRANSITION  dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])
 *                "my own toll, plus the cheaper of the two doors into me."
 * Q4 BASE CASE   dp[0][0] = grid[0][0] (no doors, you start there).
 *                Top row can only come from the left; first column only from
 *                above. Treat anything off-grid as Infinity so min() ignores it.
 * Q5 ORDER       Top row downwards, each row left to right — then dp[r-1][c]
 *                (above) and dp[r][c-1] (left) are always already filled.
 * ANSWER         dp[m-1][n-1], the bottom-right cell.
 *
 * ============================================================================
 * VISUALIZATION - grid [[1,3,1],[1,5,1],[4,2,1]]
 * ============================================================================
 *
 *   COSTS                    dp (cheapest way to reach each cell)
 *   ┌───┬───┬───┐            ┌───┬───┬───┐
 *   │ 1 │ 3 │ 1 │            │ 1 │ 4 │ 5 │   top row: only ever from the left
 *   ├───┼───┼───┤            ├───┼───┼───┤
 *   │ 1 │ 5 │ 1 │    ──►     │ 2 │ 7 │ 6 │   7 = 5 + min(4 above, 2 left)
 *   ├───┼───┼───┤            ├───┼───┼───┤
 *   │ 4 │ 2 │ 1 │            │ 6 │ 8 │ 7 │   7 = 1 + min(6 above, 8 left) ✨
 *   └───┴───┴───┘            └───┴───┴───┘
 *
 *   The winning route is 1 → 3 → 1 → 1 → 1 = 7 (right, right, down, down).
 *   Notice you never had to enumerate routes — each cell only ever asked its
 *   two neighbours "how cheaply did YOU get here?".
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: why can each cell forget the whole route?
 * ============================================================================
 *
 * Because HOW you reached a cell cannot change what the rest of the trip
 * costs — only WHERE you are matters. So one number per cell ("cheapest way
 * in") is enough, and the number of routes (which is exponential) never has
 * to be enumerated. That sentence is the definition of optimal substructure.
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m·n) — each cell answered once.
 * Space: O(n) after RUNG 4 rolls the table down to a single row.
 */
/**
 * ----------------------------------------------------------------------------
 * RUNG 1 — BRUTE FORCE (correct, and unusable past ~15x15)
 * ----------------------------------------------------------------------------
 * Encode only Q1: from here, try going down, try going right, keep the better.
 *
 * NAME THE WASTE (RUNG 2): to reach cell (2,2) you can go right-then-down or
 * down-then-right — and BOTH branches then re-solve the entire subgrid below
 * and right of (2,2) from scratch. The deeper the grid, the more times the
 * same cell is re-solved: that is the overlapping subproblem.
 *
 * @example
 * minPathSumBruteForce([[1,3,1],[1,5,1],[4,2,1]]); // 7
 *
 * Time: O(2^(m+n)). Space: O(m+n) call stack.
 */
export function minPathSumBruteForce(grid: number[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function walk(r: number, c: number): number {
    // Walked off the board — this route is illegal, so make min() reject it.
    if (r >= rows || c >= cols) return Infinity;
    // Arrived: pay this cell and stop.
    if (r === rows - 1 && c === cols - 1) return grid[r][c];

    return grid[r][c] + Math.min(walk(r + 1, c), walk(r, c + 1));
  }

  return walk(0, 0);
}

/**
 * ----------------------------------------------------------------------------
 * RUNG 3 — MEMOIZE (same recursion + a cache; exponential → O(m·n))
 * ----------------------------------------------------------------------------
 * Literally RUNG 1 with three extra lines. The thinking did not change at all,
 * which is the point of the ladder: you never have to re-derive anything.
 *
 * @example
 * minPathSumMemo([[1,3,1],[1,5,1],[4,2,1]]); // 7
 *
 * Time: O(m·n). Space: O(m·n) cache + O(m+n) stack.
 */
export function minPathSumMemo(grid: number[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  // -1 means "not answered yet" (all real answers are >= 0 here).
  const memo: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(cols).fill(-1)
  );

  function walk(r: number, c: number): number {
    if (r >= rows || c >= cols) return Infinity;
    if (r === rows - 1 && c === cols - 1) return grid[r][c];
    if (memo[r][c] !== -1) return memo[r][c];

    const best = grid[r][c] + Math.min(walk(r + 1, c), walk(r, c + 1));
    memo[r][c] = best;
    return best;
  }

  return walk(0, 0);
}

/**
 * ----------------------------------------------------------------------------
 * RUNG 4 — TABULATE + ROLL TO ONE ROW ★ OPTIMAL
 * ----------------------------------------------------------------------------
 * dp[r][c] only ever reads the row ABOVE and the cell to its LEFT. So one row
 * of numbers is enough: as we sweep left→right, `row[c]` still holds the value
 * from the row above (that is our "up"), and `row[c-1]` has already been
 * overwritten with this row's value (that is our "left"). One array, two
 * meanings, depending on whether we have passed it yet this sweep.
 *
 * @example
 * // Real-world: cheapest east/south delivery route across a toll grid.
 * minPathSum([[1,3,1],[1,5,1],[4,2,1]]); // 7
 * minPathSum([[1,2,3],[4,5,6]]);         // 12
 *
 * Time: O(m·n). Space: O(n) — one row, no recursion.
 */
export function minPathSum(grid: number[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const cols = grid[0].length;

  // Infinity = "unreachable so far", so the first min() picks the real door.
  const row = new Array<number>(cols).fill(Infinity);
  // Seed 0 (not grid[0][0]) so the first cell adds only its OWN cost below.
  row[0] = 0;

  for (let r = 0; r < grid.length; r++) {
    // First column has no "left" — it can only be entered from above,
    // which is exactly the value row[0] still holds from the previous sweep.
    row[0] = row[0] + grid[r][0];

    for (let c = 1; c < cols; c++) {
      //  row[c]  = still the row ABOVE (not overwritten yet this sweep)
      //  row[c-1]= already THIS row (overwritten one step ago) = LEFT
      row[c] = grid[r][c] + Math.min(row[c], row[c - 1]);
    }
  }

  return row[cols - 1];
}

/**
 * ============================================================================
 * 27. Perfect Squares (LeetCode 279) - UNBOUNDED KNAPSACK, DISGUISED AS MATHS
 * ============================================================================
 *
 * Given n, return the FEWEST perfect squares (1, 4, 9, 16, …) that sum to n.
 *
 * ============================================================================
 * 🌍 WHY THIS IS SECRETLY COIN CHANGE
 * ============================================================================
 *
 * Compare with problem 7 (Coin Change, LC322):
 *   - Coin Change: coins = the given array,   target = amount, minimise count.
 *   - This one:    coins = [1,4,9,16,…≤n],    target = n,      minimise count.
 * That is the ENTIRE difference. Recognising "the coins are just generated
 * instead of given" is worth more than memorising a new solution — it is the
 * skill of mapping a new problem onto one you already own.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED
 * ============================================================================
 *
 * Q1 CHOICE      "Which square do I subtract right now?" 1? 4? 9? Try each.
 * Q2 STATE       Only "how much is left to make" — ONE number → 1D dp[target].
 *                (Squares are REUSABLE, so you do NOT need to remember which
 *                ones you already used. That is what makes it 1D instead of 2D
 *                — compare 0/1 knapsack, problem 22, where reuse is banned and
 *                the state grows a second dimension.)
 * Q3 TRANSITION  dp[t] = 1 + min(dp[t - s]) over every square s <= t
 *                "one square now, plus the best way to make the remainder."
 * Q4 BASE CASE   dp[0] = 0 — making zero needs no squares.
 * Q5 ORDER       t from 1 up to n; t - s is always smaller, so it is ready.
 * ANSWER         dp[n].
 *
 * ============================================================================
 * VISUALIZATION - n = 12
 * ============================================================================
 *
 *   squares available: 1, 4, 9
 *
 *   t :  0  1  2  3  4  5  6  7  8  9 10 11 12
 *   dp:  0  1  2  3  1  2  3  4  2  1  2  3  3
 *              ▲        ▲              ▲     ▲
 *              |        |              |     └ 12 = 4+4+4 → 3 squares ✨
 *              |        |              └ 9 = 9        → 1 square
 *              |        └ 4 = 4                       → 1 square
 *              └ 2 = 1+1                              → 2 squares
 *
 *   dp[12] asks three questions and takes the best:
 *     subtract 1 → 1 + dp[11] = 1 + 3 = 4
 *     subtract 4 → 1 + dp[8]  = 1 + 2 = 3   ← winner
 *     subtract 9 → 1 + dp[3]  = 1 + 3 = 4
 *
 * ⚠️ GREEDY FAILS, and it is worth saying out loud: for n = 12 the biggest
 * square first gives 9 + 1 + 1 + 1 = 4 squares, but 4 + 4 + 4 = 3 is optimal.
 * "Biggest first" is exactly the instinct DP exists to overrule.
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n·√n) — for each of n targets, about √n squares to try.
 * Space: O(n).
 */
export function numSquares(n: number): number {
  if (n <= 0) return 0;

  // Infinity = "no way to build this yet", so min() always prefers a real answer.
  const dp = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0; // BASE CASE: zero needs zero squares

  for (let target = 1; target <= n; target++) {
    // Try every square that fits, keep the cheapest remainder.
    for (let root = 1; root * root <= target; root++) {
      dp[target] = Math.min(dp[target], dp[target - root * root] + 1);
    }
  }

  return dp[n];
}

/**
 * ============================================================================
 * 28. Maximal Square (LeetCode 221) - GRID DP WHERE THE ANSWER IS NOT dp[last]
 * ============================================================================
 *
 * Given a matrix of '0'/'1' characters, find the largest square made entirely
 * of '1's and return its AREA.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED
 * ============================================================================
 *
 * Q1 CHOICE      Not really "a choice" — the question is how BIG a square can
 *                END at this cell. The trick is to make the state answer that.
 * Q2 STATE       dp[r][c] = the side length of the biggest all-1s square whose
 *                BOTTOM-RIGHT CORNER is exactly (r,c). Two numbers → 2D.
 *                ⭐ Choosing "ending exactly here" as the meaning of the state
 *                is the single most reusable trick in this file (it is the same
 *                move as LIS in problem 4 and Kadane in problem 14).
 * Q3 TRANSITION  if cell is '1':
 *                  dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])
 *                if cell is '0': dp[r][c] = 0 (no square can end on a hole).
 * Q4 BASE CASE   Row 0 / column 0: a '1' there can only ever be a 1x1 square.
 *                (Handled below by an extra padding column of zeros.)
 * Q5 ORDER       Top to bottom, left to right — the three cells we read (up,
 *                left, diagonal) are all already computed.
 * ANSWER         ⚠️ NOT the last cell — the MAXIMUM dp value anywhere in the
 *                table, squared (because we tracked side length, not area).
 *
 * ============================================================================
 * 🔑 KEY INSIGHT: why the MINIMUM of three neighbours?
 * ============================================================================
 *
 * To grow a square of side k+1 ending at (r,c), you need three squares of side
 * k already ending at the cell above, the cell left, and the cell diagonally
 * up-left. A square is only as big as its WEAKEST supporting corner, so the
 * limiter is the min. Using max here is the classic wrong answer.
 *
 *   1 1 1        dp:  1 1 1
 *   1 1 1             1 2 2      dp[1][1] = 1 + min(1,1,1) = 2
 *   1 1 1             1 2 3      dp[2][2] = 1 + min(2,2,2) = 3  → area 9 ✨
 *
 *   Now break one corner:
 *   1 1 1        dp:  1 1 1
 *   1 1 1             1 2 2
 *   1 1 0             1 2 0      biggest side is 2 → area 4
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(m·n). Space: O(n) — two rolling rows.
 */
export function maximalSquare(matrix: string[][]): number {
  if (matrix.length === 0 || matrix[0].length === 0) return 0;
  const cols = matrix[0].length;

  // Both rows are padded with one leading 0 so that column 0 can read a
  // "left" and "diagonal" neighbour without any special-casing.
  let previousRow = new Array<number>(cols + 1).fill(0);
  let bestSide = 0;

  for (let r = 0; r < matrix.length; r++) {
    const currentRow = new Array<number>(cols + 1).fill(0);

    for (let c = 1; c <= cols; c++) {
      // A square can only end on a '1'; a '0' leaves this cell at 0.
      if (matrix[r][c - 1] === '1') {
        currentRow[c] =
          1 +
          Math.min(
            previousRow[c],     // up
            currentRow[c - 1],  // left
            previousRow[c - 1]  // diagonal up-left
          );
        bestSide = Math.max(bestSide, currentRow[c]);
      }
    }

    previousRow = currentRow;
  }

  return bestSide * bestSide; // we tracked SIDE; the question wants AREA
}

/**
 * ============================================================================
 * 29. Longest Palindromic Subsequence (LeetCode 516) - SUBSTRING-RANGE DP
 * ============================================================================
 *
 * Longest subsequence (delete anything, keep order) of s that reads the same
 * both ways. "bbbab" → "bbbb" → 4.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED
 * ============================================================================
 *
 * Q1 CHOICE      Look at the two ENDS of the piece you are considering.
 *                If they match, keep both. If they do not, you must throw one
 *                away — try dropping the left one, try dropping the right one.
 * Q2 STATE       "Which piece of the string am I looking at" = a start AND an
 *                end = TWO numbers → dp[i][j] over the substring s[i..j].
 * Q3 TRANSITION  s[i] === s[j] → dp[i][j] = dp[i+1][j-1] + 2
 *                otherwise     → dp[i][j] = max(dp[i+1][j], dp[i][j-1])
 * Q4 BASE CASE   dp[i][i] = 1 — one character is a palindrome of length 1.
 * Q5 ORDER       ⚠️ dp[i][j] reads dp[i+1][…], i.e. a LARGER i. So i must run
 *                DOWNWARDS (n-1 → 0) and j upwards from i+1. Getting this
 *                direction wrong is the #1 bug in range DP — re-read Q5 of
 *                the FOREVER RECIPE: fill after what you read.
 * ANSWER         dp[0][n-1] — the whole string.
 *
 * ============================================================================
 * VISUALIZATION - s = "bbbab"  (i = row, j = column)
 * ============================================================================
 *
 *         j=0  j=1  j=2  j=3  j=4
 *          b    b    b    a    b
 *   i=0 b [ 1 [ 2 [ 3 [ 3 [ 4 ]     ← dp[0][4] = 4  ✨ ("bbbb")
 *   i=1 b      [ 1 [ 2 [ 2 [ 3 ]
 *   i=2 b           [ 1 [ 1 [ 3 ]   ← s[2]='b' = s[4]='b' → dp[3][3]+2 = 1+2
 *   i=3 a                [ 1 [ 1 ]
 *   i=4 b                     [ 1 ]
 *
 *   Only the upper triangle is meaningful (a piece cannot end before it starts).
 *   The diagonal is the base case, and each answer leans on the answer one step
 *   INSIDE it — which is why we fill from the bottom row upwards.
 *
 * 🔗 RELATED: this is LCS (problem 5) of s against its own reverse. Both work;
 * knowing they are the same problem is the point.
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n²). Space: O(n²) (rollable to O(n), left explicit here for clarity).
 */
export function longestPalindromeSubseq(s: string): number {
  const n = s.length;
  if (n === 0) return 0;

  const dp: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0)
  );

  // i runs DOWNWARDS because dp[i][j] depends on row i+1 (see Q5 above).
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1; // BASE CASE: a single character

    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        // Ends match: keep both and solve the strictly smaller inside piece.
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        // Ends clash: drop one end or the other, keep whichever paid better.
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}

/**
 * ============================================================================
 * 30. Unique Binary Search Trees (LeetCode 96) - COUNT BY SPLITTING ON A ROOT
 * ============================================================================
 *
 * How many structurally distinct BSTs can you build from the values 1..n?
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED
 * ============================================================================
 *
 * Q1 CHOICE      "Which value is the ROOT?" Any of the n values can be. That
 *                single choice is the whole problem.
 * Q2 STATE       Because BST shapes depend only on HOW MANY values you have
 *                (not which ones — 1..3 and 5..7 make the same shapes), the
 *                state is just a COUNT. One number → 1D dp[nodes].
 * Q3 TRANSITION  Pick root k out of `nodes` values. Then k-1 values are
 *                forced into the left subtree and nodes-k into the right, and
 *                every left shape can pair with every right shape → MULTIPLY:
 *                  dp[nodes] = Σ over k of dp[k-1] * dp[nodes-k]
 * Q4 BASE CASE   dp[0] = 1. ⭐ The empty tree is ONE shape, not zero — if you
 *                set this to 0 every product collapses to 0. Base cases that
 *                feed a MULTIPLICATION must be 1, not 0.
 * Q5 ORDER       nodes = 1 upward; both dp[k-1] and dp[nodes-k] are smaller.
 * ANSWER         dp[n].
 *
 * ============================================================================
 * VISUALIZATION - n = 3 (dp[3] = 5)
 * ============================================================================
 *
 *  root=1: left has {} (1 shape), right has {2,3} (2 shapes) → 1*2 = 2
 *  root=2: left has {1} (1 shape), right has {3}   (1 shape) → 1*1 = 1
 *  root=3: left has {1,2} (2 shapes), right has {} (1 shape) → 2*1 = 2
 *                                                      total = 5 ✨
 *
 *      1        1         2        3        3
 *       \        \       / \      /        /
 *        2        3     1   3    1        2
 *         \      /                 \     /
 *          3    2                   2   1
 *
 *  dp: [1, 1, 2, 5, 14, 42, …]   (these are the Catalan numbers)
 *
 * 🔑 THE TRANSFERABLE MOVE: "choose the root / the split point, then multiply
 * the two independent sides". The next problem (Burst Balloons) uses the same
 * move, and so do Matrix Chain Multiplication and all interval DP.
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n²) — n targets, each summing over n root choices. Space: O(n).
 */
export function numTrees(n: number): number {
  if (n < 0) return 0;

  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1; // BASE CASE: the empty tree is one valid shape (see Q4)

  for (let nodes = 1; nodes <= n; nodes++) {
    // leftSize = how many values land in the left subtree.
    // The root takes 1, so the right subtree gets nodes - 1 - leftSize.
    for (let leftSize = 0; leftSize < nodes; leftSize++) {
      dp[nodes] += dp[leftSize] * dp[nodes - 1 - leftSize];
    }
  }

  return dp[n];
}

/**
 * ============================================================================
 * 31. Burst Balloons (LeetCode 312) - ⭐ INTERVAL DP (the category this file
 *     advertised for a long time without actually implementing)
 * ============================================================================
 *
 * Each balloon has a number. Bursting balloon i earns
 * left_neighbour * i * right_neighbour, and its neighbours then become
 * adjacent. Burst all of them in the best order; return the max coins.
 *
 * ============================================================================
 * 🧠 WHY THE OBVIOUS STATE FAILS (read this before the code)
 * ============================================================================
 *
 * The instinct is "choose which balloon to burst FIRST". Try it and you get
 * stuck: the moment you burst one, the array JOINS UP, so the subproblems you
 * are left with are not clean ranges of the original array — they interact.
 * A state you cannot describe with two indices is a dead end.
 *
 * ⭐ THE FLIP THAT RESCUES IT: choose which balloon in the range is burst
 * LAST. If balloon `last` is bursted last in the range (left..right), then by
 * definition everything strictly inside was already gone, so its two
 * neighbours at that moment are exactly `left` and `right` — the untouched
 * WALLS of the range. Now the two sides never interact, and the state really
 * is just "which range am I solving".
 *
 * Thinking backwards ("who goes last?") when forwards refuses to decompose is
 * the single most valuable habit in hard DP.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED
 * ============================================================================
 *
 * Q1 CHOICE      Which balloon inside this range is burst LAST (not first).
 * Q2 STATE       The range's two untouched walls: dp[left][right] = best coins
 *                from bursting everything STRICTLY between left and right.
 *                Two numbers → 2D.
 * Q3 TRANSITION  dp[left][right] = max over last in (left, right) of
 *                  balloons[left]*balloons[last]*balloons[right]
 *                  + dp[left][last] + dp[last][right]
 *                (the two sides are independent — that is the payoff of the flip)
 * Q4 BASE CASE   Ranges with nothing strictly inside earn 0 — the zero-filled
 *                table already says this, so no special code is needed.
 * Q5 ORDER       left DOWNWARD, right UPWARD, so the two smaller ranges
 *                dp[left][last] and dp[last][right] are always ready.
 * ANSWER         dp[0][n-1] over the padded array.
 *
 * ============================================================================
 * THE PADDING TRICK
 * ============================================================================
 *
 * Wrap the input in 1s: [3,1,5,8] → [1, 3,1,5,8, 1]. Multiplying by 1 is
 * harmless, and it means the edge balloons have real neighbours, so there is
 * no "what if it is at the boundary" special case anywhere in the loop.
 *
 * DRY-RUN [3,1,5,8] → padded [1,3,1,5,8,1], answer 167:
 *   burst 1 (value 1) → 3*1*5  = 15   remaining [3,5,8]
 *   burst 5           → 3*5*8  = 120  remaining [3,8]
 *   burst 3           → 1*3*8  = 24   remaining [8]
 *   burst 8           → 1*8*1  = 8    total = 15+120+24+8 = 167 ✨
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n³) — O(n²) ranges × O(n) choices of "last". Space: O(n²).
 * This is the standard cost of interval DP; O(n³) is the expected answer here.
 */
export function maxCoins(nums: number[]): number {
  if (nums.length === 0) return 0;

  // Pad with 1s so every real balloon has a neighbour (see THE PADDING TRICK).
  const balloons = [1, ...nums, 1];
  const n = balloons.length;

  const dp: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0)
  );

  // left counts DOWN, right counts UP: always solve smaller ranges first.
  // right starts at left+2 because a range needs at least one balloon inside.
  for (let left = n - 3; left >= 0; left--) {
    for (let right = left + 2; right < n; right++) {
      for (let last = left + 1; last < right; last++) {
        // `last` is burst LAST, so its neighbours are the walls left/right.
        const coins =
          balloons[left] * balloons[last] * balloons[right] +
          dp[left][last] +
          dp[last][right];

        dp[left][right] = Math.max(dp[left][right], coins);
      }
    }
  }

  return dp[0][n - 1];
}

/**
 * ============================================================================
 * 32. Longest Increasing Subsequence in O(n log n) (LeetCode 300, revisited)
 * ============================================================================
 *
 * Same problem as number 4 (`lengthOfLIS`, O(n²)). This is the follow-up the
 * interviewer asks next, and it is NOT a DP table at all — it is a greedy
 * invariant plus binary search. Included so the O(n²) version has its partner.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED — why this one has NO table
 * ============================================================================
 *
 * Run the five questions and they refuse to produce a table, which is the
 * useful lesson: not every "DP problem" stays a DP.
 *
 * Q1 CHOICE      For each value: extend the longest run, or improve the tail
 *                of a run you already have.
 * Q2 STATE       ⭐ Not an index at all — a SORTED LIST of best-possible tails
 *                (see THE INVARIANT below). One array replaces the dp table.
 * Q3 TRANSITION  Binary search for the first tail >= this value; overwrite it,
 *                or append if the value beats every tail.
 * Q4 BASE CASE   An empty tails list — length 0.
 * Q5 ORDER       Left to right through the input, once.
 * ANSWER         tails.length (⚠️ the LENGTH only — see the trap below).
 *
 * ============================================================================
 * 🔑 THE INVARIANT (the only thing to remember)
 * ============================================================================
 *
 * tails[k] = the SMALLEST possible last value of any increasing subsequence
 *            of length k+1 seen so far.
 *
 * Keeping each tail as small as possible keeps the most room to grow later,
 * and it forces `tails` to stay SORTED — which is what licenses binary search.
 *
 * For each incoming value, binary search for the first tail >= it:
 *   - found none → this value extends the longest run → push it
 *   - found one  → overwrite it; same length, but a smaller (better) tail
 *
 * ⚠️ THE TRAP: `tails` is NOT itself a valid subsequence of the input. Only
 * its LENGTH is meaningful. If you need the actual subsequence you must keep
 * predecessor indices as well. Claiming tails is the answer is a common and
 * easily-caught interview error.
 *
 * ============================================================================
 * DRY-RUN nums = [10, 9, 2, 5, 3, 7, 101, 18]
 * ============================================================================
 *
 *   10  → tails [10]                (new length 1)
 *    9  → tails [9]                 (9 replaces 10: same length, smaller tail)
 *    2  → tails [2]                 (better still)
 *    5  → tails [2,5]               (extends to length 2)
 *    3  → tails [2,3]               (3 replaces 5 — room to grow)
 *    7  → tails [2,3,7]             (length 3)
 *  101  → tails [2,3,7,101]         (length 4)
 *   18  → tails [2,3,7,18]          (18 replaces 101; length still 4)
 *
 *   answer = tails.length = 4  ✨   (a real LIS is [2,3,7,18] or [2,3,7,101])
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n log n) — one binary search per element.
 * Space: O(n) for tails.
 */
export function lengthOfLISPatience(nums: number[]): number {
  const tails: number[] = [];

  for (const num of nums) {
    // Binary search for the FIRST tail >= num (a lower bound).
    let low = 0;
    let high = tails.length;

    while (low < high) {
      const mid = (low + high) >> 1;
      if (tails[mid] < num) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    if (low === tails.length) {
      tails.push(num);   // num is bigger than every tail → longest run grows
    } else {
      tails[low] = num;  // same length, but a smaller tail is strictly better
    }
  }

  return tails.length;
}

/**
 * ============================================================================
 * 33. Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)
 *     - STATE-MACHINE DP
 * ============================================================================
 *
 * Unlimited transactions, but after you SELL you must sit out one full day
 * before buying again. Maximise profit.
 *
 * ============================================================================
 * 🪜 RECIPE APPLIED — and the new idea: the state is a MODE, not an index
 * ============================================================================
 *
 * Q1 CHOICE      Each day: buy, sell, or do nothing — but which of these is
 *                even LEGAL depends on what you are currently holding.
 * Q2 STATE       ⭐ Here is the new move: as well as "which day", you must
 *                remember WHICH MODE YOU ARE IN. There are exactly three:
 *                  hold — you own a share
 *                  sold — you sold TODAY (so tomorrow is the forced cooldown)
 *                  rest — you own nothing and are free to buy
 *                Three modes × rolling over days → three variables, not a table.
 * Q3 TRANSITION  hold = max(stay holding, buy today from rest)
 *                sold = hold + price          (you must have held to sell)
 *                rest = max(keep resting, yesterday's sold cooled down)
 * Q4 BASE CASE   Day 0: hold = -prices[0] (bought in), sold = 0, rest = 0.
 * Q5 ORDER       Day by day, left to right.
 * ANSWER         max(sold, rest) — ⚠️ never `hold`: ending the last day still
 *                holding a share means you never realised the profit.
 *
 * ============================================================================
 * ⚠️ THE BUG EVERY BEGINNER WRITES
 * ============================================================================
 *
 * You MUST compute today's three values from a SNAPSHOT of yesterday's. If you
 * overwrite `hold` and then use the new `hold` to compute `sold`, you have
 * silently allowed buying and selling on the SAME day, which skips the
 * cooldown and reports too much profit. The three `previous*` constants below
 * exist entirely to prevent that.
 *
 * ============================================================================
 * VISUALIZATION - prices = [1,2,3,0,2] (answer 3)
 * ============================================================================
 *
 *   day   price   hold   sold   rest
 *    0      1      -1      0      0     bought in at 1
 *    1      2      -1      1      0     sell → +1
 *    2      3      -1      2      1     sell → +2, or cool down
 *    3      0      -1      3      2     ⭐ buy at 0 (rest 1 - 0 = 1 → keep -1?)
 *    4      2       1      1      3     answer = max(sold 1, rest 3) = 3 ✨
 *
 *   The winning plan: buy 1, sell 2, cooldown, buy 0, sell 2 → (2-1)+(2-0) = 3.
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(n) — one pass. Space: O(1) — three variables.
 *
 * 🔗 The whole stock family (LC121/122/123/188/309/714) is this same machine
 * with more or fewer modes. See also
 * [`2Pointers/bestTimeToBuySell.ts`](../2Pointers/bestTimeToBuySell.ts).
 */
export function maxProfitCooldown(prices: number[]): number {
  if (prices.length === 0) return 0;

  let hold = -prices[0]; // own a share (paid for it)
  let sold = 0;          // sold today → tomorrow is cooldown
  let rest = 0;          // own nothing, free to buy

  for (let day = 1; day < prices.length; day++) {
    // Snapshot yesterday FIRST — see "THE BUG EVERY BEGINNER WRITES".
    const previousHold = hold;
    const previousSold = sold;
    const previousRest = rest;

    hold = Math.max(previousHold, previousRest - prices[day]); // keep, or buy
    sold = previousHold + prices[day];                         // must have held
    rest = Math.max(previousRest, previousSold);               // idle, or cooled
  }

  // Never finish still holding — that profit was never realised.
  return Math.max(sold, rest);
}
