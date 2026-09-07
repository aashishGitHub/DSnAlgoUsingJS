# Dynamic Programming Pattern

**When to Use**: optimization ("min cost", "max profit"), counting ("how many ways"), or decision ("can it be done") problems whose recursion re-solves the same subproblems.
**Time Complexity**: O(n) – O(n²) typical | **Space Complexity**: O(n), often reducible to O(1)

## The incremental method for every DP problem

> The full version of this — **the five recipe questions (choice, state,
> transition, base case, order) and the 4-rung ladder** — is at the top of
> [`dpPatterns.ts`](dpPatterns.ts), written for a first-time reader. Every
> problem in that file carries a **`RECIPE APPLIED`** block answering the same
> five questions, so you practise one method 30+ times instead of memorising
> 30 tricks.

1. **Write the brute-force recursion** — just encode the choices. Exponential, correct.
2. **Name the waste** — point at the subproblem being recomputed (`ways(3)` called 2ᵏ times).
3. **Memoize it** (top-down: recursion + cache) — usually a 3-line change.
4. **Tabulate if asked** (bottom-up), then notice how few previous cells you read — roll the table down to O(1)/O(n) space.

Interview tip: top-down is the fastest to get *correct* live; offer bottom-up + space-rolling as the follow-up.

## Files in this folder

### Canonical (typed)

- **`dpPatterns.ts`** — 33 problems across the sub-families:
  - *Linear / choice*: `climbStairs`, `minCostClimbingStairs` (LC746),
    `rob` / `rob2` (House Robber I/II)
  - *Subsequence*: `lengthOfLIS`, `longestCommonSubsequence`
  - *Unbounded knapsack*: `coinChange` (LC322, minimize),
    `coinChange2`/`change` (LC518, count combinations),
    `combinationSum4` (LC377, count permutations), `wordBreak`
  - *0/1 knapsack*: `knapsack01` (+`knapsack01Table`), `canPartition` (LC416),
    `findTargetSumWays` (LC494)
  - *Grid*: `uniquePaths`, `uniquePathsWithObstacles`, `maxProductPath` variants,
    `minPathSum` (LC64, full ladder), `maximalSquare` (LC221)
  - *Strings*: `minDistance` (edit distance), `countSubstrings` (LC647),
    `longestPalindromeSubseq` (LC516)
  - *Interval DP*: `maxCoins` (LC312 Burst Balloons) — the "burst LAST, not
    first" flip; this is the category the header table used to advertise
    without implementing
  - *Counting by split*: `numTrees` (LC96, Catalan — choose the root, multiply
    the two sides; same move as interval DP)
  - *State machine*: `maxProfitCooldown` (LC309) — three modes, three rolling
    variables, and the "snapshot yesterday first" bug it is easy to write
  - *Other*: `canJump` / `jump`, `numDecodings`, `maxProduct`, `maxSubArray`,
    `numSquares` (LC279, coin change with generated coins),
    `lengthOfLISPatience` (LC300 in O(n log n) — the follow-up to `lengthOfLIS`)
- **`TwoSequencesDP/`** — the 2D two-string family with its own
  [README](TwoSequencesDP/README.md): LCS (`longestCommonSubsequence.js` +
  hand-written typings), `editDistance.ts`, `deleteOperation.ts`,
  `interleavingString.ts`. **Untested**, and its LCS is still `.js` + a `.d.ts`
  rather than typed source.

> ⚠️ **Two problems are implemented twice.** `minDistance` (LC72) and
> `longestCommonSubsequence` (LC1143) exist both here and in `TwoSequencesDP/`,
> with **different return types** — the versions here return a number, the
> `TwoSequencesDP` ones return the DP table. Only `dpPatterns.ts` is re-exported
> from `src/problems/index.ts`, so the barrel does not collide, but pick
> deliberately when importing directly.

### Where the 4-step method is actually demonstrated

The method above is prescribed for every problem but only *shown* as separate
runnable functions for these — read these first:

| Problem | Ladder |
|---|---|
| Climbing Stairs | `climbStairsBruteForce` → `climbStairsMemo` → `climbStairs` |
| Coin Change | `coinChangeBruteForce` → `coinChangeMemo` → `coinChange` |
| Min Cost Climbing Stairs | `…BruteForce` → `…Memo` → `minCostClimbingStairs` |
| Combination Sum IV | `…BruteForce` → `…Memo` → `combinationSum4` |
| Coin Change II | `…BruteForce` → `…Memo` → `coinChange2` |
| 0/1 Knapsack | `…BruteForce` → `…Memo` → `knapsack01Table` → `knapsack01` |
| Partition Equal Subset Sum | `…BruteForce` → `…Memo` → `canPartition` |
| Target Sum | `…BruteForce` → `…Memo` → `findTargetSumWays` |
| Palindromic Substrings | `…BruteForce` → `…DP` → `countSubstrings` |
| Min Path Sum | `minPathSumBruteForce` → `minPathSumMemo` → `minPathSum` |

The remaining problems ship only their final solution; space optimization is
described in prose in their doc comments rather than as a second function.

**Three problems worth studying side by side**: `coinChange` (LC322) minimizes coin
count, `coinChange2` (LC518) counts combinations, `combinationSum4` (LC377)
counts permutations — same input shape, one table, and the only structural
difference between the last two is which loop is on the outside.

### Legacy first-attempt studies (`.js`)

Kept deliberately — comparing your first attempt against the canonical version
is good revision. **None of these are exported**, so none are reachable from
`src/problems/index.ts`.

| Study file | Status | Canonical version |
|---|---|---|
| `fibonacci.js` | ⚠️ runs `console.log` at import | `dpPatterns.ts` → `climbStairs` (same recurrence) |
| `houseRobber.js` | 🐛 `robCircularStreet` is missing its `return` — always `undefined` | `dpPatterns.ts` → `rob`, `rob2` |
| `coinChange.js` | ⚠️ runs at import; returns `-1` for amount 0. Historically the folder's only top-down solution | `dpPatterns.ts` → `coinChange`, `coinChangeMemo` |
| `longestIncreasingSubsequence.js` | 🐛 first function uses `L[i] + L[j]` instead of `L[j] + 1`; second one is correct | `dpPatterns.ts` → `lengthOfLIS` |
| `maxSumIncreasingSubsequence.js` | 🐛 despite the name it computes LIS **length**, not max sum, and is buggy (`L[i] += 1`) | the real max-sum variant is **not** implemented anywhere |
| `lisAdjacentDiffOne.js` | 🐛 **empty stub** — declares `curr`/`max`, no body | not implemented anywhere |
| `knapsack.js` | 🐛 calls an undefined `knapSack` (capital S) with swapped args; plain recursion, **no DP table** | `dpPatterns.ts` → `knapsack01` (typed, tabulated, space-rolled) |

## The sub-families (full treatment: [DP_Patterns_Cheat_Sheet.md](../../../DP_Patterns_Cheat_Sheet.md))

| Family | State | Example |
|---|---|---|
| Linear | `dp[i]` from `dp[i-1], dp[i-2]` | climbStairs |
| Choice | take-or-skip | rob |
| Unbounded | reuse allowed | coinChange |
| Subsequence | best over all `j < i` | lengthOfLIS |
| Two sequences | 2D `dp[i][j]` | LCS, edit distance |
| Grid | `dp[r][c]` from top/left | uniquePaths |
| State machine | one var per state | `maxProfitCooldown` (LC309) here; more variations in [`2Pointers/bestTimeToBuySell.ts`](../2Pointers/bestTimeToBuySell.ts) 3–6 |
| Interval | `dp[i][j]` over a range, split on k | `maxCoins` (LC312) |

**Still to practice**: digit DP, Distinct Subsequences (LC115), Regular
Expression / Wildcard Matching (LC10/LC44), Palindrome Partitioning II (LC132),
and the rest of the stock family (LC123/188 — LC121 is in
[`2Pointers/bestTimeToBuySell.ts`](../2Pointers/bestTimeToBuySell.ts), LC309 is
`maxProfitCooldown` here).

~~Interval DP~~ is now covered by `maxCoins` (LC312).

## Related Patterns

- Kadane's maximum subarray ([`SlidingWindow/kadaneMaxSubarray.ts`](../SlidingWindow/kadaneMaxSubarray.ts)) — the 1-variable DP
- Backtracking ([`Backtracking/`](../Backtracking/backtrackingPatterns.ts)) — DP's exhaustive cousin: memoize a backtrack and it becomes top-down DP

## Go counterpart

`dp` in the [Go tree](../../../../Go/dp/dp.go) implements **the same 31
problems** (LC5 excepted — on the JS side it lives in
[`Strings/longestPalindromicSubstring.ts`](../Strings/longestPalindromicSubstring.ts)
rather than being duplicated here).

The division of labour is deliberate:

- **JS carries the teaching** — recipe questions, visualisations, the ladder.
- **Go carries only the Go-specific notes**, marked `GO NOTE`, e.g. why
  `math.MaxInt` is a trap once you add to it (`MinPathSum`), `byte` vs `rune`
  when a grid is `[][]byte` (`MaximalSquare`), why a 2D slice needs an explicit
  allocation loop (`LongestPalindromeSubseq`), the `append` aliasing trap
  (`MaxCoins`), and integer-division truncation with no warning
  (`FindTargetSumWays`).

Read the JS doc block first, then the Go note for the same problem.
