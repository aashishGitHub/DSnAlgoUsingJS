// Package twopointers holds problems solved by two indices moving with purpose.
//
// PATTERN         Two Pointers
// WHEN TO USE     Sorted input + pair/triplet target; "in place"; palindromes.
// WASTE IT KILLS  Checking pairs that sortedness already proves hopeless.
//
// THREE SUB-SHAPES — know which one you are in:
//  1. Converging   (ends -> middle): pair sums, 3Sum, container, palindrome.
//  2. Fast/slow    (same direction): MoveZeroes, RemoveDuplicates — slow marks
//     the boundary of kept elements, fast scans ahead.
//  3. Partition    (three regions):  SortColors / Dutch National Flag.
package twopointers

import "slices"

// ---------------------------------------------------------------------------
// Shape 1: converging pointers
// ---------------------------------------------------------------------------

func isAlnum(c byte) bool {
	return c >= '0' && c <= '9' || c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z'
}

func toLower(c byte) byte {
	if c >= 'A' && c <= 'Z' {
		return c + ('a' - 'A')
	}
	return c
}

// IsPalindrome checks a string ignoring case and non-alphanumerics (LC125).
// O(n) time, O(1) space — no cleaned copy of the string is built.
func IsPalindrome(s string) bool {
	l, r := 0, len(s)-1
	for l < r {
		for l < r && !isAlnum(s[l]) {
			l++
		}
		for l < r && !isAlnum(s[r]) {
			r--
		}
		if toLower(s[l]) != toLower(s[r]) {
			return false
		}
		l++
		r--
	}
	return true
}

// TwoSumSorted finds the pair summing to target in a SORTED array (LC167).
// Returns 1-based indices, as the problem asks. O(n) time, O(1) space.
//
// WHY IT IS SAFE TO DISCARD: if the sum is too small, no smaller left element
// can help, so left must move. Each step eliminates one candidate forever.
func TwoSumSorted(nums []int, target int) []int {
	l, r := 0, len(nums)-1
	for l < r {
		switch sum := nums[l] + nums[r]; {
		case sum == target:
			return []int{l + 1, r + 1}
		case sum < target:
			l++
		default:
			r--
		}
	}
	return nil
}

// ThreeSum returns all unique triplets summing to zero (LC15). O(n²) time.
// NOTE: sorts nums in place — sortedness is what enables the inner two-pointer
// scan, and it is also what makes duplicate-skipping possible.
func ThreeSum(nums []int) [][]int {
	slices.Sort(nums)
	res := [][]int{}
	for i := 0; i < len(nums)-2; i++ {
		if nums[i] > 0 {
			break // sorted: the smallest of the three is positive, so is the sum
		}
		if i > 0 && nums[i] == nums[i-1] {
			continue // same anchor as last round would repeat its triplets
		}
		l, r := i+1, len(nums)-1
		for l < r {
			switch sum := nums[i] + nums[l] + nums[r]; {
			case sum < 0:
				l++
			case sum > 0:
				r--
			default:
				res = append(res, []int{nums[i], nums[l], nums[r]})
				l++
				r-- // move BOTH: reusing either element repeats this triplet
				for l < r && nums[l] == nums[l-1] {
					l++
				}
				for l < r && nums[r] == nums[r+1] {
					r--
				}
			}
		}
	}
	return res
}

// MaxArea is Container With Most Water (LC11). O(n) time, O(1) space.
//
// GREEDY JUSTIFICATION: area is limited by the SHORTER wall. Moving the taller
// wall inward can never beat the current area (width shrinks, height is still
// capped by the short wall), so the only move that can help is the short side.
func MaxArea(height []int) int {
	l, r, best := 0, len(height)-1, 0
	for l < r {
		best = max(best, (r-l)*min(height[l], height[r]))
		if height[l] < height[r] {
			l++
		} else {
			r--
		}
	}
	return best
}

// TrapBrute computes trapped rain water by rescanning for each bar. O(n²).
func TrapBrute(height []int) int {
	total := 0
	for i := range height {
		leftMax, rightMax := 0, 0
		for j := 0; j <= i; j++ {
			leftMax = max(leftMax, height[j])
		}
		for j := i; j < len(height); j++ {
			rightMax = max(rightMax, height[j])
		}
		total += min(leftMax, rightMax) - height[i]
	}
	return total
}

// Trap is Trapping Rain Water (LC42) in O(n) time, O(1) space.
//
// Water above bar i is min(maxLeft, maxRight) - height[i]. The insight: we do
// not need both maxima exactly — we only need the SMALLER one, and whichever
// side currently has the smaller running max is guaranteed to be the limiter.
// So advance that side and settle its water immediately.
func Trap(height []int) int {
	if len(height) == 0 {
		return 0
	}
	l, r := 0, len(height)-1
	leftMax, rightMax := height[l], height[r]
	water := 0
	for l < r {
		if leftMax < rightMax {
			l++
			leftMax = max(leftMax, height[l])
			water += leftMax - height[l]
		} else {
			r--
			rightMax = max(rightMax, height[r])
			water += rightMax - height[r]
		}
	}
	return water
}

// ---------------------------------------------------------------------------
// Shape 2: fast / slow write pointer
// ---------------------------------------------------------------------------

// MoveZeroes pushes zeros to the end, keeping the order of non-zeros (LC283).
// O(n) time, O(1) space. slow = where the next kept element belongs.
func MoveZeroes(nums []int) {
	slow := 0
	for fast, n := range nums {
		if n != 0 {
			nums[slow], nums[fast] = nums[fast], nums[slow]
			slow++
		}
	}
}

// RemoveDuplicates compacts a SORTED slice in place and returns the new length
// (LC26). Duplicates are adjacent once sorted, so one comparison suffices.
func RemoveDuplicates(nums []int) int {
	if len(nums) == 0 {
		return 0
	}
	slow := 0
	for fast := 1; fast < len(nums); fast++ {
		if nums[fast] != nums[slow] {
			slow++
			nums[slow] = nums[fast]
		}
	}
	return slow + 1
}

// IsSubsequence reports whether s is a subsequence of t (LC392). O(len(t)).
// Two pointers over two different strings — advance s only on a match.
func IsSubsequence(s, t string) bool {
	i := 0
	for j := 0; i < len(s) && j < len(t); j++ {
		if s[i] == t[j] {
			i++
		}
	}
	return i == len(s)
}

// ---------------------------------------------------------------------------
// Shape 3: three-way partition
// ---------------------------------------------------------------------------

// SortColors sorts an array of 0s, 1s and 2s in ONE pass (LC75).
// Dutch National Flag: [0,low) are 0s, [low,mid) are 1s, (high,n) are 2s.
//
// Do NOT advance mid after swapping with high: the value pulled in from the
// right is unexamined and could itself be a 0 or a 2.
func SortColors(nums []int) {
	low, mid, high := 0, 0, len(nums)-1
	for mid <= high {
		switch nums[mid] {
		case 0:
			nums[low], nums[mid] = nums[mid], nums[low]
			low++
			mid++
		case 1:
			mid++
		default: // 2
			nums[mid], nums[high] = nums[high], nums[mid]
			high--
		}
	}
}
