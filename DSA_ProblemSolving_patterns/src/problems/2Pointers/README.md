# Two Pointers Pattern

**When to Use**: Sorted arrays, pair/triplet sums, in-place partitioning, palindromes — anywhere a monotonic argument lets you discard one candidate per step instead of rescanning.
**Time Complexity**: usually O(n) (O(n²) for k-sum) | **Space Complexity**: O(1)

Every file here follows the repo standard: PROBLEM → PATTERN → brute-force →
optimized (with dry-run trace) → INTERVIEW NOTES, plus a co-located `.test.ts`.

## The three sub-patterns (know which one you're in)

1. **Converging (both ends → middle)** — sorted input or symmetric checks:
   `sumZero.ts` (pairs / Two Sum II), `3Sum.ts` (+ closest, 4Sum),
   `ContainerWithMostWater.ts`, `trappingRainWater.ts`, `palindrome.ts`,
   `sortedSquares.ts`
2. **Fast/slow same-direction (write-pointer compaction)** — in-place filtering:
   `moveZeros.ts` (+ `moveZeros_solutions.ts` generalizations),
   `removeDuplicatesFromSortedArray.ts`, `removeElement.ts`, `isSubsequence.ts`
3. **Multi-pointer partitioning** — `sortColors.ts` (Dutch National Flag: 3 pointers)

`bestTimeToBuySell.ts` spans patterns: variations 1–2 are two-pointer/greedy,
3–6 are DP state machines (kept together for the stock-problem family view).

## Problems in this folder

| Problem | File | LeetCode |
|---------|------|----------|
| 3Sum / 3Sum Closest / 4Sum | `3Sum.ts` | 15, 16, 18 |
| Container With Most Water | `ContainerWithMostWater.ts` | 11 |
| Trapping Rain Water | `trappingRainWater.ts` | 42 |
| Move Zeroes (+12 variations) | `moveZeros.ts`, `moveZeros_solutions.ts` | 283 |
| Valid Palindrome (4 ways + alphanumeric) | `palindrome.ts` | 125 |
| Is Subsequence | `isSubsequence.ts` | 392 |
| Pairs With Sum Zero / Two Sum II | `sumZero.ts` | 167 |
| Remove Duplicates from Sorted Array | `removeDuplicatesFromSortedArray.ts` | 26 |
| Remove Element | `removeElement.ts` | 27 |
| Sort Colors (Dutch National Flag) | `sortColors.ts` | 75 |
| Squares of a Sorted Array | `sortedSquares.ts` | 977 |
| Best Time to Buy/Sell Stock (6 variations) | `bestTimeToBuySell.ts` | 121–714 |

**Practice first**: `moveZeros_practice_problems.ts` has fill-in-the-blank
stubs — implement them yourself, then compare with `moveZeros_solutions.ts`.

## Key insights to rehearse

- **Why sorted input enables two pointers**: moving left strictly increases
  the sum, moving right strictly decreases it — each step provably discards
  candidates without checking them.
- **On a pair match, advance BOTH pointers** (duplicate-handling bug class —
  see the "Common Mistake" note in `sumZero.ts`).
- **Swap-based partitioning does NOT preserve the displaced group's order**
  once values are distinct — see the trade-off writeup in `moveZeros_solutions.ts`.
- **k-Sum reduction**: fix (k−2) elements with loops, two-pointer the last two.

## Related Patterns

- Sliding Window (same-direction pointers bounding a window)
- Fast & Slow Pointers (different speeds, cycle detection)
- HashMap (unsorted pair-sum → trade O(n) space to skip sorting)
