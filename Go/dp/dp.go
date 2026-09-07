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

import (
	"math"
	"math/big"
)

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

// ---------------------------------------------------------------------------
// PARITY BLOCK — the problems that existed on the JavaScript side
// (DSA_ProblemSolving_patterns/src/problems/DynamicProgramming/dpPatterns.ts)
// but were missing here, plus the categories neither side had.
//
// The teaching narrative for all of these — the five recipe questions, the
// visualisations, the brute-force → memoise → tabulate → roll ladder — lives
// in the JS file. What is documented HERE is only what Go does differently,
// marked "GO NOTE". Read the JS doc block first, then this.
// ---------------------------------------------------------------------------

// MinPathSum returns the cheapest right/down route through a cost grid (LC64).
// O(m·n) time, O(n) space. JS: minPathSum.
//
// GO NOTE — there is no Infinity for ints. JS seeds the rolling row with
// Infinity; the Go equivalent sentinel is math.MaxInt, but you must never ADD
// to it (grid[r][c] + math.MaxInt silently overflows to a negative number and
// min() then picks the garbage). Two ways out: guard the sentinel before
// adding, or — as done here — avoid the sentinel entirely by seeding the first
// row and column explicitly. Preferring "no sentinel" over "big sentinel" is
// the usual Go answer whenever the value gets arithmetic done to it.
func MinPathSum(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}
	cols := len(grid[0])
	row := make([]int, cols)

	// First row: the only way in is from the left, so it is a prefix sum.
	row[0] = grid[0][0]
	for c := 1; c < cols; c++ {
		row[c] = row[c-1] + grid[0][c]
	}

	for r := 1; r < len(grid); r++ {
		row[0] += grid[r][0] // first column: only ever entered from above
		for c := 1; c < cols; c++ {
			// row[c] is still the row above; row[c-1] is already this row.
			row[c] = grid[r][c] + min(row[c], row[c-1])
		}
	}
	return row[cols-1]
}

// NumSquares returns the fewest perfect squares summing to n (LC279).
// O(n·√n) time, O(n) space. JS: numSquares.
//
// This is Coin Change with the coins generated instead of given.
//
// GO NOTE — the bound is written root*root <= target, deliberately using
// integer multiplication rather than math.Sqrt. Converting to float64 and back
// invites an off-by-one at the boundary when the float lands on 3.9999999; the
// integer form has no such failure mode and needs no import.
func NumSquares(n int) int {
	if n <= 0 {
		return 0
	}
	dp := make([]int, n+1)
	for target := 1; target <= n; target++ {
		dp[target] = math.MaxInt
		for root := 1; root*root <= target; root++ {
			// Safe to add 1 here: dp[target-root*root] is always a real answer,
			// never the sentinel, because smaller targets are solved first.
			dp[target] = min(dp[target], dp[target-root*root]+1)
		}
	}
	return dp[n]
}

// MaximalSquare returns the AREA of the largest all-1s square (LC221).
// O(m·n) time, O(n) space. JS: maximalSquare.
//
// dp[r][c] = side of the biggest square whose BOTTOM-RIGHT corner is (r,c),
// and a square is only as big as its weakest supporting corner — hence min of
// three neighbours, never max.
//
// GO NOTE — the matrix is [][]byte, not [][]string, and the comparison is
// against the RUNE LITERAL '1' (single quotes), which is an untyped constant
// that converts to byte here. Two things that bite JS refugees:
//   - "1" (double quotes) is a string and will not compile against a byte;
//   - indexing a Go string gives a byte, not a one-character string, so
//     s[i] == '1' is the idiom, never s[i] == "1".
//
// Use []rune instead of []byte only when the data is genuinely multi-byte
// UTF-8; for a 0/1 grid, bytes are correct and cheaper.
func MaximalSquare(matrix [][]byte) int {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return 0
	}
	cols := len(matrix[0])
	// One leading pad column of zeros, so column 0 can read left/diagonal
	// neighbours with no special case.
	previous := make([]int, cols+1)
	best := 0

	for r := 0; r < len(matrix); r++ {
		current := make([]int, cols+1)
		for c := 1; c <= cols; c++ {
			if matrix[r][c-1] == '1' {
				current[c] = 1 + min(previous[c], min(current[c-1], previous[c-1]))
				best = max(best, current[c])
			}
		}
		previous = current
	}
	return best * best // side tracked, area asked for
}

// LongestPalindromeSubseq returns the longest palindromic SUBSEQUENCE length
// (LC516). O(n²) time and space. JS: longestPalindromeSubseq.
//
// i must descend because dp[i][j] reads row i+1.
//
// GO NOTE — Go has no Array.from({length: n}, …), so a 2D slice takes an
// explicit allocation loop. The rows are separate allocations: writing
// make([][]int, n) alone gives you n NIL slices, and indexing one panics.
// (For hot code you would allocate one flat []int of n*n and index it as
// flat[i*n+j] to get a single contiguous allocation.)
func LongestPalindromeSubseq(s string) int {
	n := len(s)
	if n == 0 {
		return 0
	}
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n) // without this line every row is nil
	}

	for i := n - 1; i >= 0; i-- {
		dp[i][i] = 1
		for j := i + 1; j < n; j++ {
			if s[i] == s[j] {
				dp[i][j] = dp[i+1][j-1] + 2
			} else {
				dp[i][j] = max(dp[i+1][j], dp[i][j-1])
			}
		}
	}
	return dp[0][n-1]
}

// NumTrees counts structurally distinct BSTs over 1..n (LC96) — the Catalan
// numbers. O(n²) time, O(n) space. JS: numTrees.
//
// Choose the root, multiply the two independent sides. dp[0] must be 1: an
// empty tree is one shape, and a 0 there would zero out every product.
//
// GO NOTE — int is 64-bit on every platform this repo targets, so overflow
// only becomes a real concern past n ≈ 33 (Catalan grows ~4ⁿ). Unlike JS,
// which silently loses precision above 2⁵³ and returns a wrong-but-plausible
// float, Go overflow wraps to a negative int — louder, and easier to spot.
func NumTrees(n int) int {
	if n < 0 {
		return 0
	}
	dp := make([]int, n+1)
	dp[0] = 1
	for nodes := 1; nodes <= n; nodes++ {
		for leftSize := 0; leftSize < nodes; leftSize++ {
			dp[nodes] += dp[leftSize] * dp[nodes-1-leftSize]
		}
	}
	return dp[n]
}

// MaxCoins is Burst Balloons (LC312) — the interval-DP representative.
// O(n³) time, O(n²) space. JS: maxCoins.
//
// THE FLIP: ask which balloon in a range bursts LAST, not first. Then its
// neighbours are the range's untouched walls and the two sides stop
// interacting. Thinking backwards when forwards refuses to decompose is the
// habit to take away from this one.
//
// GO NOTE — the padding step shows the append aliasing trap. This:
//
//	padded := append([]int{1}, nums...)   // safe: fresh backing array
//
// is fine, but appending to a slice you were HANDED can overwrite the
// caller's data when that slice has spare capacity. Slices are a view over a
// shared array, so a function that appends to its argument is not pure the way
// the JS spread [1, ...nums, 1] always is. Allocating with an explicit make +
// copy, as below, is the version that never surprises anyone.
func MaxCoins(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	n := len(nums) + 2
	balloons := make([]int, n)
	balloons[0], balloons[n-1] = 1, 1
	copy(balloons[1:], nums) // explicit: no aliasing of the caller's slice

	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}

	for left := n - 3; left >= 0; left-- {
		for right := left + 2; right < n; right++ {
			for last := left + 1; last < right; last++ {
				coins := balloons[left]*balloons[last]*balloons[right] +
					dp[left][last] + dp[last][right]
				dp[left][right] = max(dp[left][right], coins)
			}
		}
	}
	return dp[0][n-1]
}

// UniquePathsWithObstacles counts right/down routes through a grid where 1
// marks a blocked cell (LC63). O(m·n) time, O(n) space.
// JS: uniquePathsWithObstacles.
//
// GO NOTE — a [][]int argument is a slice of slices, i.e. a reference-like
// view onto the caller's memory. Writing the DP table into `grid` in place
// would be visible to the caller after the call returns — a side effect JS
// arrays share, but which is easier to overlook in Go because the parameter
// looks like a value. The separate `row` slice below keeps the function pure.
func UniquePathsWithObstacles(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 || grid[0][0] == 1 {
		return 0
	}
	cols := len(grid[0])
	row := make([]int, cols)
	row[0] = 1 // one way to stand on the start

	for r := 0; r < len(grid); r++ {
		for c := 0; c < cols; c++ {
			switch {
			case grid[r][c] == 1:
				row[c] = 0 // a wall is reachable zero ways
			case c > 0:
				row[c] += row[c-1] // from above (already in row[c]) + from left
			}
		}
	}
	return row[cols-1]
}

// CanJump reports whether the last index is reachable (LC55).
// O(n) time, O(1) space. JS: canJump.
//
// Greedy beats DP here: track the furthest index reachable so far and fail the
// moment the current index passes it.
func CanJump(nums []int) bool {
	reach := 0
	for i, jump := range nums {
		if i > reach {
			return false // a gap opened up that no earlier jump can clear
		}
		reach = max(reach, i+jump)
	}
	return true
}

// Jump returns the fewest jumps to reach the last index (LC45).
// O(n) time, O(1) space. JS: jump.
//
// A BFS over "levels" in disguise: currentEnd is the last index of this level,
// farthest is how far the next level will reach.
func Jump(nums []int) int {
	jumps, currentEnd, farthest := 0, 0, 0
	for i := 0; i < len(nums)-1; i++ { // stop before the last index
		farthest = max(farthest, i+nums[i])
		if i == currentEnd { // exhausted this level, commit to a jump
			jumps++
			currentEnd = farthest
		}
	}
	return jumps
}

// MaxSubArray is Kadane's algorithm (LC53). O(n) time, O(1) space.
// JS: maxSubArray.
//
// At each element: extend the running subarray, or start fresh here.
//
// GO NOTE — there is no Number.MIN_SAFE_INTEGER-style seed needed; seeding
// both variables from nums[0] and starting the loop at 1 avoids picking a
// sentinel at all. (math.MinInt would also work, but every sentinel is one
// more thing that can be wrong.) An empty slice has no answer to give, so 0
// is returned by convention — document that choice rather than panicking.
func MaxSubArray(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	best, current := nums[0], nums[0]
	for _, v := range nums[1:] {
		current = max(v, current+v) // start fresh, or extend
		best = max(best, current)
	}
	return best
}

// MinCostClimbingStairs pays cost[i] to step off stair i (LC746).
// O(n) time, O(1) space. JS: minCostClimbingStairs.
//
// You may start at index 0 or 1, and the "top" is one past the last stair.
func MinCostClimbingStairs(cost []int) int {
	if len(cost) < 2 {
		return 0
	}
	prev2, prev1 := 0, 0 // cheapest way to STAND on stair 0 / stair 1
	for i := 2; i <= len(cost); i++ {
		current := min(prev1+cost[i-1], prev2+cost[i-2])
		prev2, prev1 = prev1, current
	}
	return prev1
}

// CombinationSum4 counts ORDERED sequences summing to target (LC377).
// O(target·len(nums)) time, O(target) space. JS: combinationSum4.
//
// Compare CoinChange2 in this file: identical table, and the ONLY structural
// difference is which loop is outside. Target outside (here) counts
// permutations — 1+2 and 2+1 are two answers. Coin outside counts
// combinations. Study the two side by side; it is the most commonly confused
// pair in the whole DP family.
func CombinationSum4(nums []int, target int) int {
	dp := make([]int, target+1)
	dp[0] = 1 // one empty sequence
	for t := 1; t <= target; t++ {
		for _, n := range nums {
			if n <= t {
				dp[t] += dp[t-n]
			}
		}
	}
	return dp[target]
}

// Knapsack01 maximises value under a weight capacity, each item usable ONCE.
// O(n·capacity) time, O(capacity) space.
// JS: knapsack01 (which also ships the brute-force and memo rungs).
//
// ⭐ THE ONE LINE THAT MAKES IT 0/1: the capacity loop runs DOWNWARDS. Going
// upwards lets an item be picked up again within the same row, which silently
// solves the UNBOUNDED knapsack instead. That single loop direction is the
// entire difference between the two problems.
//
// GO NOTE — Go has no tuple return destructuring for slices, so paired inputs
// arrive as two parallel slices. Guarding len(weights) != len(values) up front
// is worth it: an index-out-of-range panic mid-loop is a much worse failure
// than an early, explicit zero.
func Knapsack01(weights, values []int, capacity int) int {
	if len(weights) != len(values) || capacity <= 0 {
		return 0
	}
	dp := make([]int, capacity+1)
	for i := range weights {
		// DOWNWARDS — see the note above.
		for c := capacity; c >= weights[i]; c-- {
			dp[c] = max(dp[c], dp[c-weights[i]]+values[i])
		}
	}
	return dp[capacity]
}

// FindTargetSumWays counts +/- assignments hitting target (LC494).
// O(n·sum) time, O(sum) space. JS: findTargetSumWays.
//
// THE ALGEBRA THAT UNLOCKS IT: let P be the numbers you make positive and N
// the ones you negate. Then P-N = target and P+N = total, so P = (target+
// total)/2. Counting subsets summing to P is plain 0/1 subset-sum — the
// exponential search over signs was never necessary.
//
// GO NOTE — the parity guard below matters more in Go than in JS. Integer
// division truncates ((3+2)/2 == 2, no fraction, no error), so an odd
// target+total would quietly produce a wrong target instead of a NaN-ish
// signal. Check divisibility before dividing; Go will not warn you.
func FindTargetSumWays(nums []int, target int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	// Out of range, or the required subset sum is not an integer.
	if abs(target) > total || (target+total)%2 != 0 {
		return 0
	}
	subsetSum := (target + total) / 2

	dp := make([]int, subsetSum+1)
	dp[0] = 1 // one way to make zero: pick nothing
	for _, n := range nums {
		for c := subsetSum; c >= n; c-- { // downwards: each number used once
			dp[c] += dp[c-n]
		}
	}
	return dp[subsetSum]
}

// MaxProductPath returns the largest product along a right/down path.
// O(m·n) time and space. JS: maxProductPath / maxProductPathOptimized —
// this matches those two (the RAW product, 0 for an empty grid). For the
// LeetCode 1594 contract (-1 when the best product is negative, otherwise the
// product modulo 1e9+7) use MaxProductPathMod below, which mirrors the JS
// maxProductPathMod.
//
// ⭐ WHY ONE TABLE IS NOT ENOUGH: a negative times a negative is positive, so
// the most negative product so far is a candidate for the best. Track BOTH the
// max and the min reaching every cell, or the sign flips will beat you.
//
// GO NOTE — this int version can overflow on large grids, and Go's overflow
// WRAPS silently (to a negative-looking number). JS has the mirror-image
// problem: its numbers are float64, so it silently loses PRECISION past 2⁵³
// and returns a plausible-but-wrong integer. Neither language warns you.
// MaxProductPathMod below is the version that is actually safe.
func MaxProductPath(grid [][]int) int {
	if len(grid) == 0 || len(grid[0]) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])
	maxDP := make([][]int, rows)
	minDP := make([][]int, rows)
	for i := range maxDP {
		maxDP[i] = make([]int, cols)
		minDP[i] = make([]int, cols)
	}
	maxDP[0][0], minDP[0][0] = grid[0][0], grid[0][0]

	for c := 1; c < cols; c++ {
		maxDP[0][c] = maxDP[0][c-1] * grid[0][c]
		minDP[0][c] = minDP[0][c-1] * grid[0][c]
	}
	for r := 1; r < rows; r++ {
		maxDP[r][0] = maxDP[r-1][0] * grid[r][0]
		minDP[r][0] = minDP[r-1][0] * grid[r][0]
	}

	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			v := grid[r][c]
			// Four candidates: both neighbours' best AND worst, times v.
			a, b := maxDP[r-1][c]*v, minDP[r-1][c]*v
			d, e := maxDP[r][c-1]*v, minDP[r][c-1]*v
			maxDP[r][c] = max(max(a, b), max(d, e))
			minDP[r][c] = min(min(a, b), min(d, e))
		}
	}

	return maxDP[rows-1][cols-1]
}

// MaxProductPathMod is Maximum Non Negative Product in a Matrix (LC1594):
// the same walk as MaxProductPath, but returning -1 when the best product is
// negative and otherwise the product modulo 1e9+7. JS: maxProductPathMod.
//
// GO NOTE — the intermediate products genuinely exceed 64 bits here, so this
// carries math/big.Int, exactly as the JS version carries BigInt. Two things
// differ from the JS spelling:
//
//   - big.Int is a STRUCT used through pointers, and its methods MUTATE the
//     receiver: z.Mul(x, y) means "z = x*y", it does not return a fresh value.
//     So every product needs its own new(big.Int) destination, or you will
//     quietly overwrite a cell you still need. JS operators (a * b) always
//     produce a new BigInt, which is why this trips people up one way only.
//   - There is no < operator for big.Int; comparison is x.Cmp(y) returning
//     -1/0/+1. Forgetting this is a compile error, so it is a cheap mistake.
//
// The modulus is applied ONCE at the very end, on a value known non-negative.
// Applying it earlier would be wrong: a modulus does not commute with the
// max/min comparisons that pick the winning path.
func MaxProductPathMod(grid [][]int) int {
	const mod = 1_000_000_007
	if len(grid) == 0 || len(grid[0]) == 0 {
		return -1
	}
	rows, cols := len(grid), len(grid[0])

	maxDP := make([][]*big.Int, rows)
	minDP := make([][]*big.Int, rows)
	for r := range maxDP {
		maxDP[r] = make([]*big.Int, cols)
		minDP[r] = make([]*big.Int, cols)
	}

	// mul returns a NEW big.Int holding x*v — see the GO NOTE about mutation.
	mul := func(x *big.Int, v int) *big.Int {
		return new(big.Int).Mul(x, big.NewInt(int64(v)))
	}

	maxDP[0][0] = big.NewInt(int64(grid[0][0]))
	minDP[0][0] = big.NewInt(int64(grid[0][0]))

	for c := 1; c < cols; c++ {
		p := mul(maxDP[0][c-1], grid[0][c])
		maxDP[0][c], minDP[0][c] = p, p // one way in, so max == min
	}
	for r := 1; r < rows; r++ {
		p := mul(maxDP[r-1][0], grid[r][0])
		maxDP[r][0], minDP[r][0] = p, p
	}

	for r := 1; r < rows; r++ {
		for c := 1; c < cols; c++ {
			v := grid[r][c]
			candidates := []*big.Int{
				mul(maxDP[r-1][c], v), mul(minDP[r-1][c], v),
				mul(maxDP[r][c-1], v), mul(minDP[r][c-1], v),
			}
			hi, lo := candidates[0], candidates[0]
			for _, cand := range candidates[1:] {
				if cand.Cmp(hi) > 0 { // no < operator for big.Int
					hi = cand
				}
				if cand.Cmp(lo) < 0 {
					lo = cand
				}
			}
			maxDP[r][c], minDP[r][c] = hi, lo
		}
	}

	best := maxDP[rows-1][cols-1]
	if best.Sign() < 0 {
		return -1 // the problem asks for -1 rather than a negative product
	}
	return int(new(big.Int).Mod(best, big.NewInt(mod)).Int64())
}

// abs is the int absolute value Go's stdlib does not provide (math.Abs is
// float64-only, and round-tripping ints through float64 loses precision above
// 2⁵³ — one of the small places Go asks you to write it yourself).
func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
