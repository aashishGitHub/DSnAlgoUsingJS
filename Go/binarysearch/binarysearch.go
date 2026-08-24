// Package binarysearch halves a search space using monotonicity.
//
// PATTERN         Binary Search (on the data, or on the ANSWER)
// WHEN TO USE     Sorted input; or "minimum/maximum X such that <condition>"
// where the condition flips false -> true exactly once.
// WASTE IT KILLS  Scanning a half that provably cannot contain the answer.
//
// THE REAL QUESTION IS NEVER "is it sorted?" — IT IS "IS IT MONOTONE?"
// Koko below is not a sorted-array problem at all: the sorted thing is the
// predicate "can I finish at speed s?", which is false, false, …, true, true.
//
// mid := lo + (hi-lo)/2 rather than (lo+hi)/2 — the habit that avoids overflow
// in languages with 32-bit ints. In Go's 64-bit int it will not overflow for
// slice indices, but interviewers look for it and the cost is zero.
package binarysearch

import "math"

// ---------------------------------------------------------------------------
// The three templates. Learn these shapes, derive everything else.
// ---------------------------------------------------------------------------

// Search is the classic exact-match search (LC704). O(log n).
// CLOSED interval [lo, hi]: the loop runs while lo <= hi, and both ends move
// past mid so the space always shrinks.
func Search(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		switch {
		case nums[mid] == target:
			return mid
		case nums[mid] < target:
			lo = mid + 1
		default:
			hi = mid - 1
		}
	}
	return -1
}

// LowerBound returns the first index whose value is >= target (insertion point).
// HALF-OPEN interval [lo, hi): the loop runs while lo < hi and hi = mid (never
// mid-1), because mid itself is still a candidate answer.
//
// This template never "fails" — it returns len(nums) when everything is
// smaller. That property is what makes it reusable for the two below.
func LowerBound(nums []int, target int) int {
	lo, hi := 0, len(nums)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}

// UpperBound returns the first index whose value is > target.
// Identical to LowerBound with <= instead of <. That single character is the
// whole difference, which is why it is worth memorising as a pair.
func UpperBound(nums []int, target int) int {
	lo, hi := 0, len(nums)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] <= target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}

// SearchInsert is LC35 — literally LowerBound.
func SearchInsert(nums []int, target int) int { return LowerBound(nums, target) }

// SearchRange returns the first and last index of target, or [-1,-1] (LC34).
// Two bounds, one subtraction — no special-casing needed.
func SearchRange(nums []int, target int) []int {
	first := LowerBound(nums, target)
	if first == len(nums) || nums[first] != target {
		return []int{-1, -1}
	}
	return []int{first, UpperBound(nums, target) - 1}
}

// CountOccurrences counts equal values in O(log n) — the payoff for owning both
// bound templates.
func CountOccurrences(nums []int, target int) int {
	return UpperBound(nums, target) - LowerBound(nums, target)
}

// ---------------------------------------------------------------------------
// 2D and rotated inputs: reshape the problem, then use a template
// ---------------------------------------------------------------------------

// SearchMatrix searches a row-sorted matrix where each row starts after the
// previous row ends (LC74). O(log(m·n)).
//
// KEY MOVE: do not search rows then columns. The matrix already IS one sorted
// array — index it virtually with mid/cols and mid%cols.
func SearchMatrix(matrix [][]int, target int) bool {
	if len(matrix) == 0 || len(matrix[0]) == 0 {
		return false
	}
	cols := len(matrix[0])
	lo, hi := 0, len(matrix)*cols-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		switch v := matrix[mid/cols][mid%cols]; {
		case v == target:
			return true
		case v < target:
			lo = mid + 1
		default:
			hi = mid - 1
		}
	}
	return false
}

// SearchRotated searches a rotated sorted array (LC33). O(log n).
//
// INSIGHT: a rotated array cut at mid always leaves at least ONE sorted half.
// Identify that half, ask whether the target lies inside it; if yes recurse
// there, otherwise the answer must be in the other half.
func SearchRotated(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		}
		if nums[lo] <= nums[mid] { // left half [lo..mid] is sorted
			if target >= nums[lo] && target < nums[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else { // right half [mid..hi] is sorted
			if target > nums[mid] && target <= nums[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
		}
	}
	return -1
}

// FindMin finds the smallest value in a rotated sorted array (LC153).
//
// Compare against nums[hi], NOT nums[lo]: "mid is bigger than the last element"
// proves the rotation point is strictly to the right of mid.
func FindMin(nums []int) int {
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] > nums[hi] {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return nums[lo]
}

// FindPeakElement returns any index larger than both neighbours (LC162).
// Not sorted at all — but "uphill" is a monotone signal: walking uphill from
// any point must eventually reach a peak, so discard the downhill side.
func FindPeakElement(nums []int) int {
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] < nums[mid+1] {
			lo = mid + 1 // uphill to the right — a peak lies that way
		} else {
			hi = mid
		}
	}
	return lo
}

// ---------------------------------------------------------------------------
// Binary search on the ANSWER — the highest-value variant in interviews
// ---------------------------------------------------------------------------

// hoursNeeded is the feasibility predicate: monotone non-increasing in speed.
func hoursNeeded(piles []int, speed int) int {
	hours := 0
	for _, p := range piles {
		hours += (p + speed - 1) / speed // integer ceil division
	}
	return hours
}

// MinEatingSpeed is Koko Eating Bananas (LC875). O(n log(max pile)).
//
// THE RECIPE, reusable for "min days to ship", "split array largest sum",
// "minimise max distance":
//  1. Guess an answer s.
//  2. Write feasible(s) — cheap to evaluate, and monotone in s.
//  3. Binary search the smallest feasible s using the LowerBound shape.
func MinEatingSpeed(piles []int, h int) int {
	lo, hi := 1, 0
	for _, p := range piles {
		hi = max(hi, p) // eating the biggest pile per hour is always enough
	}
	for lo < hi {
		mid := lo + (hi-lo)/2
		if hoursNeeded(piles, mid) <= h {
			hi = mid // feasible: try slower
		} else {
			lo = mid + 1 // too slow
		}
	}
	return lo
}

// ---------------------------------------------------------------------------
// Median of Two Sorted Arrays (LC4) — the hard one
// ---------------------------------------------------------------------------

// FindMedianSortedArrays runs in O(log(min(m,n))).
//
// REFRAME: do not merge. Choose a cut in `a` (i elements to the left); the cut
// in `b` is then forced, since the two left parts must together hold half the
// elements. The cut is correct when every element left of it is <= every
// element right of it — checked with just the four values around the cuts.
// Binary search over i, always on the SHORTER array so j stays in range.
func FindMedianSortedArrays(a, b []int) float64 {
	if len(a) > len(b) {
		a, b = b, a
	}
	m, n := len(a), len(b)
	if n == 0 {
		return 0
	}
	total := m + n
	half := (total + 1) / 2 // size of the combined left part

	lo, hi := 0, m
	for lo <= hi {
		i := lo + (hi-lo)/2 // take i from a
		j := half - i       // ...so j must come from b

		// Sentinels turn "cut at the edge" into ordinary comparisons.
		aLeft, aRight := math.MinInt, math.MaxInt
		if i > 0 {
			aLeft = a[i-1]
		}
		if i < m {
			aRight = a[i]
		}
		bLeft, bRight := math.MinInt, math.MaxInt
		if j > 0 {
			bLeft = b[j-1]
		}
		if j < n {
			bRight = b[j]
		}

		switch {
		case aLeft <= bRight && bLeft <= aRight: // valid cut
			if total%2 == 1 {
				return float64(max(aLeft, bLeft))
			}
			return float64(max(aLeft, bLeft)+min(aRight, bRight)) / 2
		case aLeft > bRight:
			hi = i - 1 // took too many from a
		default:
			lo = i + 1 // took too few from a
		}
	}
	return 0
}
