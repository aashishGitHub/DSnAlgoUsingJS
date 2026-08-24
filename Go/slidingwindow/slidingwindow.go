// Package slidingwindow keeps a running aggregate over a contiguous range.
//
// PATTERN         Sliding Window
// WHEN TO USE     "contiguous subarray/substring", "of size k", "longest or
// shortest such that <condition> holds".
// WASTE IT KILLS  Recomputing an aggregate that overlaps the previous window.
//
// TWO FLAVOURS:
//   - FIXED size:    one element enters, one leaves, every step.
//   - VARIABLE size: grow right greedily; shrink left only while invalid.
//     Both pointers only move forward => O(n) amortised, even with the inner loop.
package slidingwindow

import "math"

// ---------------------------------------------------------------------------
// Fixed-size windows
// ---------------------------------------------------------------------------

// MaxSumSubarrayKBrute re-sums every window. O(n·k) — the thing to improve on.
func MaxSumSubarrayKBrute(nums []int, k int) int {
	if len(nums) < k || k <= 0 {
		return 0
	}
	best := math.MinInt
	for start := 0; start+k <= len(nums); start++ {
		sum := 0
		for i := start; i < start+k; i++ {
			sum += nums[i] // <- the waste: k-1 of these were just added
		}
		best = max(best, sum)
	}
	return best
}

// MaxSumSubarrayK slides: one add, one subtract per step. O(n) time, O(1) space.
func MaxSumSubarrayK(nums []int, k int) int {
	if len(nums) < k || k <= 0 {
		return 0
	}
	sum := 0
	for i := 0; i < k; i++ {
		sum += nums[i] // build the first window once
	}
	best := sum
	for i := k; i < len(nums); i++ {
		sum += nums[i] - nums[i-k] // enter right, leave left
		best = max(best, sum)
	}
	return best
}

// CheckInclusion reports whether s2 contains a permutation of s1 (LC567).
// A permutation is a fixed-size window whose letter tally matches. O(n).
//
// Go compares arrays with ==, so the whole "do the tallies match?" check is one
// comparison instead of a 26-slot loop.
func CheckInclusion(s1, s2 string) bool {
	if len(s1) > len(s2) {
		return false
	}
	var need, window [26]int
	for i := 0; i < len(s1); i++ {
		need[s1[i]-'a']++
	}
	for i := 0; i < len(s2); i++ {
		window[s2[i]-'a']++
		if i >= len(s1) {
			window[s2[i-len(s1)]-'a']-- // evict the element leaving the window
		}
		if window == need {
			return true
		}
	}
	return false
}

// MaxSlidingWindow returns the maximum of every window of size k (LC239).
// O(n) time with a monotonic deque of INDICES whose values decrease.
//
// This is the bridge from sliding window to the monotonic-stack pattern: the
// deque discards any element that a newer, larger one has made irrelevant.
func MaxSlidingWindow(nums []int, k int) []int {
	if k <= 0 || k > len(nums) {
		return nil
	}
	deque := make([]int, 0, len(nums)) // indices, values strictly decreasing
	out := make([]int, 0, len(nums)-k+1)
	for i, n := range nums {
		// Anyone smaller than the incoming value can never be a max again.
		for len(deque) > 0 && nums[deque[len(deque)-1]] <= n {
			deque = deque[:len(deque)-1]
		}
		deque = append(deque, i)
		if deque[0] <= i-k {
			deque = deque[1:] // front has slid out of the window
		}
		if i >= k-1 {
			out = append(out, nums[deque[0]]) // front is always the window max
		}
	}
	return out
}

// ---------------------------------------------------------------------------
// Variable-size windows
// ---------------------------------------------------------------------------

// LengthOfLongestSubstring is the longest substring with no repeats (LC3). O(n).
// The condition ("no duplicate") only breaks by ADDING, so shrink from the left
// until it holds again.
func LengthOfLongestSubstring(s string) int {
	last := make(map[byte]int, len(s)) // char -> most recent index
	l, best := 0, 0
	for r := 0; r < len(s); r++ {
		if j, ok := last[s[r]]; ok && j >= l {
			l = j + 1 // jump the left edge past the previous copy
		}
		last[s[r]] = r
		best = max(best, r-l+1)
	}
	return best
}

// LongestSubstringKDistinct is the longest substring with at most k distinct
// characters. O(n) time, O(k) space. The map size IS the constraint check.
func LongestSubstringKDistinct(s string, k int) int {
	count := make(map[byte]int)
	l, best := 0, 0
	for r := 0; r < len(s); r++ {
		count[s[r]]++
		for len(count) > k {
			count[s[l]]--
			if count[s[l]] == 0 {
				delete(count, s[l]) // must delete, or len(count) lies
			}
			l++
		}
		best = max(best, r-l+1)
	}
	return best
}

// CharacterReplacement is Longest Repeating Character Replacement (LC424).
// O(n) time, O(1) space.
//
// REFRAME: a window is valid when (length - count of its most common letter)
// <= k, i.e. the letters we would have to overwrite fit the budget.
//
// SUBTLETY WORTH SAYING OUT LOUD: maxFreq is never decreased when the window
// shrinks. That can leave it stale/too large, but a stale value can only ever
// stop the answer from growing — it can never produce a longer invalid window.
// Keeping it monotone is what preserves the single pass.
//
// GO GOTCHA: indexed by the raw byte, not by s[r]-'a'. LC424 uses UPPERCASE
// letters, and byte arithmetic is unsigned — 'A'-'a' wraps to 224 rather than
// going negative, so a [26]int tally panics instead of failing quietly.
func CharacterReplacement(s string, k int) int {
	var count [128]int // ASCII-indexed: no case assumption, still O(1) space
	l, maxFreq, best := 0, 0, 0
	for r := 0; r < len(s); r++ {
		count[s[r]]++
		maxFreq = max(maxFreq, count[s[r]])
		for r-l+1-maxFreq > k {
			count[s[l]]--
			l++
		}
		best = max(best, r-l+1)
	}
	return best
}

// MinWindow is Minimum Window Substring (LC76) — the hardest standard window.
// O(len(s) + len(t)) time, O(unique chars) space.
//
// SHAPE: expand right until the window is valid, then shrink left as far as it
// stays valid, recording the best. `missing` counts characters still owed, so
// validity is an int comparison rather than a map scan.
func MinWindow(s, t string) string {
	if len(t) == 0 || len(s) < len(t) {
		return ""
	}
	need := make(map[byte]int, len(t))
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}
	missing := len(t)
	bestL, bestLen := 0, -1
	l := 0
	for r := 0; r < len(s); r++ {
		if need[s[r]] > 0 {
			missing-- // this char was actually owed, not a surplus
		}
		need[s[r]]--
		for missing == 0 { // valid: try to tighten
			if bestLen == -1 || r-l+1 < bestLen {
				bestL, bestLen = l, r-l+1
			}
			need[s[l]]++
			if need[s[l]] > 0 {
				missing++ // dropping this one breaks validity
			}
			l++
		}
	}
	if bestLen == -1 {
		return ""
	}
	return s[bestL : bestL+bestLen]
}

// ---------------------------------------------------------------------------
// Degenerate windows: one running value
// ---------------------------------------------------------------------------

// MaxProfit is Best Time to Buy and Sell Stock (LC121). O(n) time, O(1) space.
// A window whose left edge is simply "the cheapest day so far".
func MaxProfit(prices []int) int {
	best, cheapest := 0, math.MaxInt
	for _, p := range prices {
		cheapest = min(cheapest, p)
		best = max(best, p-cheapest)
	}
	return best
}

// MaxSubarray is Kadane's algorithm (LC53). O(n) time, O(1) space.
//
// ONE DECISION PER ELEMENT: extend the current streak, or start fresh here.
// Seed with nums[0], never 0 — an all-negative input must return its largest
// element, and seeding 0 would wrongly return 0.
func MaxSubarray(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	best, current := nums[0], nums[0]
	for _, n := range nums[1:] {
		current = max(n, current+n)
		best = max(best, current)
	}
	return best
}
