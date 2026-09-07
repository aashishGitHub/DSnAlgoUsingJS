# Dynamic Programming Pattern

**When to Use**: optimization ("min cost", "max profit"), counting ("how many ways"), or decision ("can it be done") problems whose recursion re-solves the same subproblems.
**Time Complexity**: O(n) – O(n²) typical | **Space Complexity**: O(n), often reducible to O(1)

## The incremental method for every DP problem

1. **Write the brute-force recursion** — just encode the choices. Exponential, correct.
2. **Name the waste** — point at the subproblem being recomputed (`ways(3)` called 2ᵏ times).
3. **Memoize it** (top-down: recursion + cache) — usually a 3-line change.
4. **Tabulate if asked** (bottom-up), then notice how few previous cells you read — roll the table down to O(1)/O(n) space.

Interview tip: top-down is the fastest to get *correct* live; offer bottom-up + space-rolling as the follow-up.

## Files in this folder

### Canonical (typed)

- **`dpPatterns.ts`** — 25 problems across the sub-families:
  - *Linear / choice*: `climbStairs`, `minCostClimbingStairs` (LC746),
    `rob` / `rob2` (House Robber I/II)
  - *Subsequence*: `lengthOfLIS`, `longestCommonSubsequence`
  - *Unbounded knapsack*: `coinChange` (LC322, minimize),
    `coinChange2`/`change` (LC518, count combinations),
    `combinationSum4` (LC377, count permutations), `wordBreak`
  - *0/1 knapsack*: `knapsack01` (+`knapsack01Table`), `canPartition` (LC416),
    `findTargetSumWays` (LC494)
  - *Grid*: `uniquePaths`, `uniquePathsWithObstacles`, `maxProductPath` variants
  - *Strings*: `minDistance` (edit distance), `countSubstrings` (LC647)
  - *Other*: `canJump` / `jump`, `numDecodings`, `maxProduct`, `maxSubArray`
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
| State machine | one var per state | stock w/ cooldown/fee → [`2Pointers/bestTimeToBuySell.ts`](../2Pointers/bestTimeToBuySell.ts) variations 3–6 |

**Still to practice**: interval DP (Burst Balloons, Matrix Chain — the file
header's category table advertises Interval DP but no interval problem is
implemented), digit DP, Distinct Subsequences (LC115), and Regular Expression /
Wildcard Matching (LC10/LC44).

## Related Patterns

- Kadane's maximum subarray ([`SlidingWindow/kadaneMaxSubarray.ts`](../SlidingWindow/kadaneMaxSubarray.ts)) — the 1-variable DP
- Backtracking ([`Backtracking/`](../Backtracking/backtrackingPatterns.ts)) — DP's exhaustive cousin: memoize a backtrack and it becomes top-down DP
