// Package dp covers dynamic programming, 1D then 2D.
//
// PATTERN         Dynamic Programming (memoise or tabulate)
// WHEN TO USE     "min/max cost", "number of ways", "longest … with choices",
// "can I reach/partition" — and the brute force is exponential recursion that
// keeps re-solving the same subproblem.
// WASTE IT KILLS  Re-computing an answer you already computed.
//
// THE FOUR QUESTIONS THAT WRITE A DP FOR YOU:
//  1. STATE — what does the answer depend on? (index, remaining budget, …)
//     The number of state variables IS the dimension of your table.
//  2. TRANSITION — how does a state combine its smaller states? This is the
//     recurrence, and it is almost always "take it or leave it".
//  3. BASE CASE — the smallest state you can answer without recursion.
//  4. ORDER — iterate so every state's dependencies are already computed.
//
// TOP-DOWN OR BOTTOM-UP? Write the recursion first (it mirrors the four
// questions above), then convert. Bottom-up wins on constant factors and allows
// the rolling-array space trick; top-down wins when the reachable state space is
// far smaller than the full table.
//
// THE SPACE TRICK APPLIED THROUGHOUT: if dp[i] only reads dp[i-1] and dp[i-2],
// two variables suffice. If a 2D dp[i][j] only reads row i-1, keep two rows.
package dp

import "math"

// ---------------------------------------------------------------------------
// 1D: one state variable
// ---------------------------------------------------------------------------

// ClimbStairs counts the ways to climb n stairs in 1 or 2 steps (LC70).
// O(n) time, O(1) space.
//
// The recurrence is ways(n) = ways(n-1) + ways(n-2) — Fibonacci in disguise.
// Recognising that "the last move was either a 1 or a 2" IS the transition.
func ClimbStairs(n int) int {
	if n <= 2 {
		return n
	}
	prev, cur := 1, 2
	for range n - 2 {
		prev, cur = cur, prev+cur
	}
	return cur
}

// Rob is House Robber (LC198): no two adjacent houses. O(n) time, O(1) space.
//
// THE CHOICE AT EVERY HOUSE: skip it and keep the best so far, or take it and
// add the best from two houses back. Two rolling variables replace the table.
func Rob(nums []int) int {
	prev, cur := 0, 0 // best excluding, best including the previous house
	for _, n := range nums {
		prev, cur = cur, max(cur, prev+n)
	}
	return cur
}

// RobCircular is House Robber II (LC213): the houses form a circle, so the
// first and last are adjacent.
//
// THE REDUCTION: rather than inventing a circular recurrence, notice that the
// first and last house can never both be robbed. So run the linear solver twice
// — once without the last house, once without the first — and take the better.
// Turning a new problem into one already solved is the move to practise.
func RobCircular(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	if len(nums) == 1 {
		return nums[0] // with one house there is nothing to exclude
	}
	return max(Rob(nums[:len(nums)-1]), Rob(nums[1:]))
}

// CoinChange returns the fewest coins summing to amount, or -1 (LC322).
// O(amount·len(coins)) time, O(amount) space.
//
// WHY GREEDY FAILS, and it is worth saying: with coins {1,3,4} and amount 6,
// taking the biggest first gives 4+1+1 = 3 coins, but 3+3 = 2 is optimal. Only
// exploring every coin at every amount finds it.
func CoinChange(coins []int, amount int) int {
	const unreachable = math.MaxInt / 2 // halved: +1 must not overflow
	dp := make([]int, amount+1)
	for i := 1; i <= amount; i++ {
		dp[i] = unreachable
	}
	for a := 1; a <= amount; a++ {
		for _, c := range coins {
			if c <= a {
				dp[a] = min(dp[a], dp[a-c]+1)
			}
		}
	}
	if dp[amount] >= unreachable {
		return -1
	}
	return dp[amount]
}

// LengthOfLIS is the Longest Increasing Subsequence, O(n²) (LC300).
// dp[i] = the longest increasing subsequence ENDING at i. Anchoring the state at
// "ending here" is what makes the transition a simple scan of earlier indices.
func LengthOfLIS(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	dp := make([]int, len(nums))
	best := 1
	for i := range nums {
		dp[i] = 1
		for j := range i {
			if nums[j] < nums[i] {
				dp[i] = max(dp[i], dp[j]+1)
			}
		}
		best = max(best, dp[i])
	}
	return best
}

// LengthOfLISPatience solves the same problem in O(n log n).
//
// tails[k] holds the SMALLEST possible tail of an increasing subsequence of
// length k+1. Keeping tails minimal keeps it sorted, so binary search finds
// where each value belongs: extend the sequence, or improve an existing tail.
//
// CAUTION: tails is NOT itself a valid subsequence — only its LENGTH is the
// answer. Claiming otherwise is a common and easily-caught error.
func LengthOfLISPatience(nums []int) int {
	tails := []int{}
	for _, n := range nums {
		i := lowerBound(tails, n)
		if i == len(tails) {
			tails = append(tails, n) // strictly bigger than every tail: extend
		} else {
			tails[i] = n // improve the tail of that length
		}
	}
	return len(tails)
}

func lowerBound(xs []int, target int) int {
	lo, hi := 0, len(xs)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if xs[mid] < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}

// WordBreak reports whether s can be segmented into dictionary words (LC139).
// O(n²·wordLen) time, O(n) space.
//
// STATE: dp[i] == "the first i characters are fully segmentable". dp[0] = true
// for the empty prefix, which is what seeds everything else.
func WordBreak(s string, wordDict []string) bool {
	words := make(map[string]bool, len(wordDict))
	for _, w := range wordDict {
		words[w] = true
	}
	dp := make([]bool, len(s)+1)
	dp[0] = true // the empty string is trivially segmentable
	for i := 1; i <= len(s); i++ {
		for j := range i {
			if dp[j] && words[s[j:i]] { // a valid split point plus a real word
				dp[i] = true
				break
			}
		}
	}
	return dp[len(s)]
}

// MaxProduct is Maximum Product Subarray (LC152). O(n) time, O(1) space.
//
// WHY KADANE ALONE FAILS: with multiplication a large NEGATIVE is a strong
// candidate — one more negative flips it to a large positive. So track the
// running minimum alongside the maximum, and swap them when the incoming value
// is negative, because it inverts their roles.
func MaxProduct(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	best, curMax, curMin := nums[0], nums[0], nums[0]
	for _, n := range nums[1:] {
		if n < 0 {
			curMax, curMin = curMin, curMax // a negative swaps best and worst
		}
		curMax = max(n, curMax*n) // start fresh, or extend
		curMin = min(n, curMin*n)
		best = max(best, curMax)
	}
	return best
}

// NumDecodings counts the ways to decode a digit string as letters A-Z (LC91).
// O(n) time, O(1) space.
//
// Like ClimbStairs, but with two validity rules: a single digit must not be '0',
// and a pair must land in 10..26. '0' is the whole difficulty of this problem —
// it can only ever be the second half of "10" or "20".
func NumDecodings(s string) int {
	if len(s) == 0 || s[0] == '0' {
		return 0
	}
	prev2, prev1 := 1, 1 // ways to decode the first i-1 and i characters
	for i := 1; i < len(s); i++ {
		cur := 0
		if s[i] != '0' {
			cur += prev1 // this digit stands alone
		}
		pair := int(s[i-1]-'0')*10 + int(s[i]-'0')
		if pair >= 10 && pair <= 26 {
			cur += prev2 // this digit pairs with its predecessor
		}
		prev2, prev1 = prev1, cur
	}
	return prev1
}

// CanPartition reports whether nums splits into two equal-sum halves (LC416).
// O(n·sum) time, O(sum) space.
//
// THE REFRAME INTO 0/1 KNAPSACK: two equal halves exist iff some subset sums to
// total/2. An odd total is instantly false.
//
// THE DIRECTION OF THE INNER LOOP IS THE WHOLE ANSWER: iterate sums DOWNWARD so
// each item is used at most once. Going upward would let one item be reused (see
// CoinChange2, where that is exactly what we want).
func CanPartition(nums []int) bool {
	total := 0
	for _, n := range nums {
		total += n
	}
	if total%2 == 1 {
		return false // an odd total cannot split evenly
	}
	target := total / 2
	reachable := make([]bool, target+1)
	reachable[0] = true // the empty subset reaches 0
	for _, n := range nums {
		for s := target; s >= n; s-- { // DOWNWARD: each item once
			if reachable[s-n] {
				reachable[s] = true
			}
		}
	}
	return reachable[target]
}

// ---------------------------------------------------------------------------
// Palindromic substrings — expand around centre, not a DP table
// ---------------------------------------------------------------------------

// LongestPalindrome returns the longest palindromic substring (LC5).
// O(n²) time, O(1) space.
//
// The DP table version is also O(n²) time but costs O(n²) SPACE. Expanding
// around each centre gets the same answer with two pointers, so prefer it — and
// remember there are 2n-1 centres, because even-length palindromes are centred
// between two characters.
func LongestPalindrome(s string) string {
	if len(s) == 0 {
		return ""
	}
	bestStart, bestLen := 0, 1
	expand := func(l, r int) {
		for l >= 0 && r < len(s) && s[l] == s[r] {
			l--
			r++
		}
		// The loop overshoots by one on each side.
		if length := r - l - 1; length > bestLen {
			bestStart, bestLen = l+1, length
		}
	}
	for i := 0; i < len(s); i++ {
		expand(i, i)   // odd length, centred on a character
		expand(i, i+1) // even length, centred between characters
	}
	return s[bestStart : bestStart+bestLen]
}

// CountSubstrings counts palindromic substrings (LC647). Same two centres, but
// count every successful expansion instead of tracking the longest.
func CountSubstrings(s string) int {
	count := 0
	expand := func(l, r int) {
		for l >= 0 && r < len(s) && s[l] == s[r] {
			count++
			l--
			r++
		}
	}
	for i := 0; i < len(s); i++ {
		expand(i, i)
		expand(i, i+1)
	}
	return count
}

// ---------------------------------------------------------------------------
// 2D: two state variables
// ---------------------------------------------------------------------------

// UniquePaths counts paths from top-left to bottom-right moving only right or
// down (LC62). O(m·n) time, O(n) space.
//
// dp[r][c] = dp[r-1][c] + dp[r][c-1]. Since only the row above is ever read, one
// row suffices: `row[c] += row[c-1]` reads the updated left neighbour and the
// not-yet-overwritten value above. The rolling-array trick in one line.
func UniquePaths(m, n int) int {
	if m <= 0 || n <= 0 {
		return 0
	}
	row := make([]int, n)
	for i := range row {
		row[i] = 1 // the top row has exactly one path to each cell
	}
	for range m - 1 {
		for c := 1; c < n; c++ {
			row[c] += row[c-1] // above (old value) + left (new value)
		}
	}
	return row[n-1]
}

// LongestCommonSubsequence is LC1143. O(m·n) time and space.
//
// THE TRANSITION IS THE PATTERN FOR EVERY TWO-STRING DP:
//   - characters match    -> 1 + the answer for both prefixes shortened
//   - characters differ   -> the better of dropping one character from either
//
// The +1 row and column represent empty prefixes, which removes all the
// boundary special-casing.
func LongestCommonSubsequence(a, b string) int {
	dp := make([][]int, len(a)+1)
	for i := range dp {
		dp[i] = make([]int, len(b)+1)
	}
	for i := 1; i <= len(a); i++ {
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				dp[i][j] = max(dp[i-1][j], dp[i][j-1])
			}
		}
	}
	return dp[len(a)][len(b)]
}

// CoinChange2 counts the COMBINATIONS that make up amount (LC518).
//
// THE LOOP ORDER IS THE ENTIRE PROBLEM:
//   - coins outer, amounts inner -> combinations. {1,2} is counted once.
//   - amounts outer, coins inner -> permutations. {1,2} and {2,1} both count.
//
// Also note the inner loop runs UPWARD here, because a coin may be reused
// (unbounded knapsack) — the opposite of CanPartition.
func CoinChange2(amount int, coins []int) int {
	ways := make([]int, amount+1)
	ways[0] = 1 // one way to make 0: take nothing
	for _, c := range coins {
		for a := c; a <= amount; a++ {
			ways[a] += ways[a-c]
		}
	}
	return ways[amount]
}

// MinDistance is Edit Distance (LC72). O(m·n) time, O(n) space.
//
// THE THREE OPERATIONS MAP EXACTLY ONTO THREE TABLE NEIGHBOURS:
//   - replace -> diagonal (prev[j-1])
//   - delete  -> above    (prev[j])
//   - insert  -> left     (cur[j-1])
//
// Matching characters cost nothing and just take the diagonal. Naming which
// neighbour is which operation is what makes this memorable rather than magic.
func MinDistance(a, b string) int {
	prev := make([]int, len(b)+1)
	for j := range prev {
		prev[j] = j // turning "" into b's first j characters costs j inserts
	}
	for i := 1; i <= len(a); i++ {
		cur := make([]int, len(b)+1)
		cur[0] = i // turning a's first i characters into "" costs i deletes
		for j := 1; j <= len(b); j++ {
			if a[i-1] == b[j-1] {
				cur[j] = prev[j-1] // free
			} else {
				cur[j] = 1 + min(prev[j-1], prev[j], cur[j-1])
			}
		}
		prev = cur
	}
	return prev[len(b)]
}

// MaxProfitCooldown is Best Time to Buy and Sell Stock with Cooldown (LC309):
// unlimited transactions, but one idle day after every sale.
//
// STATE-MACHINE DP — the shape to reach for whenever the problem has modes with
// legal transitions between them. Three states per day:
//
//	hold — holding a share
//	sold — sold TODAY (so tomorrow is forced idle)
//	rest — holding nothing and free to buy
//
// Transitions: hold = stay held, or buy from rest. sold = sell what was held.
// rest = keep resting, or the cooldown after a sale has elapsed.
//
// Read from a SNAPSHOT of yesterday's values, or a single day would illegally
// perform two transitions.
func MaxProfitCooldown(prices []int) int {
	if len(prices) == 0 {
		return 0
	}
	hold, sold, rest := -prices[0], 0, 0
	for _, p := range prices[1:] {
		prevHold, prevSold, prevRest := hold, sold, rest
		hold = max(prevHold, prevRest-p) // keep holding, or buy today
		sold = prevHold + p              // must have been holding to sell
		rest = max(prevRest, prevSold)   // idle, or cooling down after a sale
	}
	return max(sold, rest) // never end still holding a share
}
