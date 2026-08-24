// Package prefixsum handles ranges when a sliding window cannot cope.
//
// PATTERN         Prefix Sum (+ Hash Map)
// WHEN TO USE     Range sums, "count/longest subarray with sum k", negatives present.
// WASTE IT KILLS  Re-adding the same elements for every candidate range.
//
// THE IDENTITY THAT DRIVES EVERYTHING:
//
//	sum(i..j) == prefix[j] - prefix[i-1]
//
// So "does a range with sum k end here?" becomes "have I seen prefix-k before?",
// which is a hash-map lookup — the Hash Map pattern applied to running sums.
package prefixsum

// ---------------------------------------------------------------------------
// Product Except Self (LC238) — prefix/suffix without division
// ---------------------------------------------------------------------------

// ProductExceptSelf returns, for each index, the product of all other elements.
// O(n) time, O(1) extra space (the output does not count).
//
// Division is banned because a single zero destroys it. Instead: each answer is
// (product of everything left) × (product of everything right). Pass 1 writes
// the left products into the output; pass 2 multiplies the right products in
// while walking backwards, so no second array is needed.
func ProductExceptSelf(nums []int) []int {
	n := len(nums)
	out := make([]int, n)

	prefix := 1
	for i := 0; i < n; i++ {
		out[i] = prefix // everything strictly left of i
		prefix *= nums[i]
	}

	suffix := 1
	for i := n - 1; i >= 0; i-- {
		out[i] *= suffix // × everything strictly right of i
		suffix *= nums[i]
	}
	return out
}

// ---------------------------------------------------------------------------
// Subarray Sum Equals K (LC560) — why sliding window is not allowed here
// ---------------------------------------------------------------------------

// SubarraySumEqualsK counts subarrays summing to k. O(n) time, O(n) space.
//
// A sliding window needs "growing only ever increases the sum" to know which
// side to move. With negatives that guarantee dies, so we count prefixes
// instead: seed {0:1} for the empty prefix, else ranges starting at index 0 are
// missed.
func SubarraySumEqualsK(nums []int, k int) int {
	seen := map[int]int{0: 1} // prefix sum -> how many times seen
	sum, count := 0, 0
	for _, n := range nums {
		sum += n
		count += seen[sum-k] // every earlier prefix of sum-k closes a range here
		seen[sum]++
	}
	return count
}

// LongestSubarrayWithSumK returns the length of the longest such subarray.
//
// Counting wants "how many times"; longest wants "how EARLY". So store only the
// FIRST index at which each prefix appeared — never overwrite.
func LongestSubarrayWithSumK(nums []int, k int) int {
	first := map[int]int{0: -1} // prefix sum -> earliest index
	sum, best := 0, 0
	for i, n := range nums {
		sum += n
		if j, ok := first[sum-k]; ok {
			best = max(best, i-j)
		}
		if _, ok := first[sum]; !ok {
			first[sum] = i // first occurrence only
		}
	}
	return best
}

// FindMaxLength returns the longest subarray with equal 0s and 1s (LC525).
//
// THE REFRAME: count 1 as +1 and 0 as -1; "equal counts" becomes "sum 0",
// which is LongestSubarrayWithSumK with k = 0.
func FindMaxLength(nums []int) int {
	first := map[int]int{0: -1}
	diff, best := 0, 0
	for i, n := range nums {
		if n == 1 {
			diff++
		} else {
			diff--
		}
		if j, ok := first[diff]; ok {
			best = max(best, i-j)
		} else {
			first[diff] = i
		}
	}
	return best
}

// PivotIndex returns the leftmost index where left sum == right sum (LC724).
func PivotIndex(nums []int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	left := 0
	for i, n := range nums {
		if left == total-left-n {
			return i
		}
		left += n
	}
	return -1
}

// ---------------------------------------------------------------------------
// Range Sum Query (LC303) — precompute once, answer many
// ---------------------------------------------------------------------------

// NumArray answers arbitrary range sums in O(1) after O(n) setup.
// This is the "many queries" signal: pay once up front, not per query.
type NumArray struct {
	prefix []int // prefix[i] = sum of the first i elements
}

// NewNumArray builds the prefix table. The extra leading 0 removes the
// i == 0 special case from SumRange.
func NewNumArray(nums []int) *NumArray {
	prefix := make([]int, len(nums)+1)
	for i, n := range nums {
		prefix[i+1] = prefix[i] + n
	}
	return &NumArray{prefix: prefix}
}

// SumRange returns the inclusive sum of nums[left..right]. O(1).
func (a *NumArray) SumRange(left, right int) int {
	return a.prefix[right+1] - a.prefix[left]
}
