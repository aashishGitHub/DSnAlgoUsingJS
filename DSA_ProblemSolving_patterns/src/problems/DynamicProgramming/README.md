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

### Canonical (typed, tested)

- **`dpPatterns.ts`** — 18 problems across the sub-families: climbStairs, rob/rob2 (House Robber I/II), lengthOfLIS, longestCommonSubsequence, wordBreak, coinChange, uniquePaths(+obstacles), canJump/jump, numDecodings, maxProduct, maxSubArray, minDistance (edit distance), maxProductPath variants.
- **`TwoSequencesDP/`** — the 2D two-string family with its own [README](TwoSequencesDP/README.md): LCS (`longestCommonSubsequence.js` + typings), `editDistance.ts`, `deleteOperation.ts`, `interleavingString.ts`.

### Legacy first-attempt studies (`.js`)

Kept deliberately — comparing your first attempt against the canonical version is good revision:

| Study file | Canonical version |
|---|---|
| `fibonacci.js` | `dpPatterns.ts` → `climbStairs` (same recurrence) |
| `houseRobber.js` | `dpPatterns.ts` → `rob`, `rob2` |
| `coinChange.js` | `dpPatterns.ts` → `coinChange` |
| `longestIncreasingSubsequence.js` | `dpPatterns.ts` → `lengthOfLIS` |
| `maxSumIncreasingSubsequence.js` | LIS variant (max sum instead of length) |
| `lisAdjacentDiffOne.js` | LIS variant (adjacent difference = 1) |
| `knapsack.js` | 0/1 knapsack — the choice-based 2D template |

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

**Still to practice** (from the DP learning guide): interval DP (Burst Balloons), digit DP.

## Related Patterns

- Kadane's maximum subarray ([`SlidingWindow/kadaneMaxSubarray.ts`](../SlidingWindow/kadaneMaxSubarray.ts)) — the 1-variable DP
- Backtracking ([`Backtracking/`](../Backtracking/backtrackingPatterns.ts)) — DP's exhaustive cousin: memoize a backtrack and it becomes top-down DP
