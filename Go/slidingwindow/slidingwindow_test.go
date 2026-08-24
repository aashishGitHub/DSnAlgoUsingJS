package slidingwindow

import (
	"slices"
	"testing"
)

func TestMaxSumSubarrayK(t *testing.T) {
	cases := []struct {
		nums []int
		k    int
		want int
	}{
		{[]int{2, 1, 5, 1, 3, 2}, 3, 9},
		{[]int{2, 3, 4, 1, 5}, 2, 7},
		{[]int{-1, -2, -3}, 2, -3},
		{[]int{1, 2}, 5, 0}, // k longer than the input
	}
	for _, c := range cases {
		if got := MaxSumSubarrayK(c.nums, c.k); got != c.want {
			t.Errorf("MaxSumSubarrayK(%v,%d) = %d, want %d", c.nums, c.k, got, c.want)
		}
		// Sliding must agree with the O(n·k) re-summing version.
		if got, want := MaxSumSubarrayK(c.nums, c.k), MaxSumSubarrayKBrute(c.nums, c.k); got != want {
			t.Errorf("slide disagrees with brute on %v/%d: %d vs %d", c.nums, c.k, got, want)
		}
	}
}

func TestCheckInclusion(t *testing.T) {
	cases := []struct {
		s1, s2 string
		want   bool
	}{
		{"ab", "eidbaooo", true},
		{"ab", "eidboaoo", false},
		{"adc", "dcda", true},
		{"abcdxabcde", "abcdeabcdx", true},
		{"abc", "ab", false},
	}
	for _, c := range cases {
		if got := CheckInclusion(c.s1, c.s2); got != c.want {
			t.Errorf("CheckInclusion(%q,%q) = %v, want %v", c.s1, c.s2, got, c.want)
		}
	}
}

func TestMaxSlidingWindow(t *testing.T) {
	got := MaxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3)
	if !slices.Equal(got, []int{3, 3, 5, 5, 6, 7}) {
		t.Errorf("MaxSlidingWindow = %v", got)
	}
	if got := MaxSlidingWindow([]int{1}, 1); !slices.Equal(got, []int{1}) {
		t.Errorf("MaxSlidingWindow = %v", got)
	}
	if got := MaxSlidingWindow([]int{1, 2}, 5); got != nil {
		t.Errorf("k > len must be nil, got %v", got)
	}
	// Decreasing input: the front never gets popped by a bigger value, only by
	// sliding out of the window.
	if got := MaxSlidingWindow([]int{7, 6, 5, 4}, 2); !slices.Equal(got, []int{7, 6, 5}) {
		t.Errorf("MaxSlidingWindow decreasing = %v", got)
	}
}

func TestLengthOfLongestSubstring(t *testing.T) {
	cases := []struct {
		s    string
		want int
	}{
		{"abcabcbb", 3},
		{"bbbbb", 1},
		{"pwwkew", 3},
		{"", 0},
		{"tmmzuxt", 5}, // the case that breaks a naive "l = last+1" without l guard
	}
	for _, c := range cases {
		if got := LengthOfLongestSubstring(c.s); got != c.want {
			t.Errorf("LengthOfLongestSubstring(%q) = %d, want %d", c.s, got, c.want)
		}
	}
}

func TestLongestSubstringKDistinct(t *testing.T) {
	cases := []struct {
		s    string
		k    int
		want int
	}{
		{"eceba", 2, 3},
		{"aa", 1, 2},
		{"abcadcacacaca", 3, 11},
		{"abc", 0, 0},
	}
	for _, c := range cases {
		if got := LongestSubstringKDistinct(c.s, c.k); got != c.want {
			t.Errorf("LongestSubstringKDistinct(%q,%d) = %d, want %d", c.s, c.k, got, c.want)
		}
	}
}

func TestCharacterReplacement(t *testing.T) {
	cases := []struct {
		s    string
		k    int
		want int
	}{
		{"ABAB", 2, 4},
		{"AABABBA", 1, 4},
		{"AAAA", 0, 4},
		{"ABCDE", 0, 1},
	}
	for _, c := range cases {
		if got := CharacterReplacement(c.s, c.k); got != c.want {
			t.Errorf("CharacterReplacement(%q,%d) = %d, want %d", c.s, c.k, got, c.want)
		}
	}
}

func TestMinWindow(t *testing.T) {
	cases := []struct {
		s, t, want string
	}{
		{"ADOBECODEBANC", "ABC", "BANC"},
		{"a", "a", "a"},
		{"a", "aa", ""},
		{"ab", "b", "b"},
		{"", "a", ""},
	}
	for _, c := range cases {
		if got := MinWindow(c.s, c.t); got != c.want {
			t.Errorf("MinWindow(%q,%q) = %q, want %q", c.s, c.t, got, c.want)
		}
	}
}

func TestMaxProfit(t *testing.T) {
	cases := []struct {
		prices []int
		want   int
	}{
		{[]int{7, 1, 5, 3, 6, 4}, 5},
		{[]int{7, 6, 4, 3, 1}, 0},
		{[]int{1}, 0},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxProfit(c.prices); got != c.want {
			t.Errorf("MaxProfit(%v) = %d, want %d", c.prices, got, c.want)
		}
	}
}

func TestMaxSubarray(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}, 6},
		{[]int{1}, 1},
		{[]int{5, 4, -1, 7, 8}, 23},
		{[]int{-3, -1, -2}, -1}, // all negative: seeding with 0 would return 0
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxSubarray(c.nums); got != c.want {
			t.Errorf("MaxSubarray(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}
