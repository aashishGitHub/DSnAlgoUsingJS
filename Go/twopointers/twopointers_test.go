package twopointers

import (
	"reflect"
	"slices"
	"testing"
)

func TestIsPalindrome(t *testing.T) {
	cases := []struct {
		s    string
		want bool
	}{
		{"A man, a plan, a canal: Panama", true},
		{"race a car", false},
		{" ", true},
		{"", true},
		{".,", true}, // all separators — the pointers must not run past each other
		{"0P", false},
	}
	for _, c := range cases {
		if got := IsPalindrome(c.s); got != c.want {
			t.Errorf("IsPalindrome(%q) = %v, want %v", c.s, got, c.want)
		}
	}
}

func TestTwoSumSorted(t *testing.T) {
	if got := TwoSumSorted([]int{2, 7, 11, 15}, 9); !slices.Equal(got, []int{1, 2}) {
		t.Errorf("TwoSumSorted = %v, want [1 2]", got)
	}
	if got := TwoSumSorted([]int{2, 3, 4}, 6); !slices.Equal(got, []int{1, 3}) {
		t.Errorf("TwoSumSorted = %v, want [1 3]", got)
	}
	if got := TwoSumSorted([]int{-1, 0}, -1); !slices.Equal(got, []int{1, 2}) {
		t.Errorf("TwoSumSorted = %v, want [1 2]", got)
	}
	if got := TwoSumSorted([]int{1, 2}, 99); got != nil {
		t.Errorf("TwoSumSorted = %v, want nil", got)
	}
}

func TestThreeSum(t *testing.T) {
	got := ThreeSum([]int{-1, 0, 1, 2, -1, -4})
	want := [][]int{{-1, -1, 2}, {-1, 0, 1}}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("ThreeSum = %v, want %v", got, want)
	}
	if got := ThreeSum([]int{0, 0, 0, 0}); !reflect.DeepEqual(got, [][]int{{0, 0, 0}}) {
		t.Errorf("ThreeSum all zeros = %v (duplicate skipping failed)", got)
	}
	if got := ThreeSum([]int{1, 2, 3}); len(got) != 0 {
		t.Errorf("ThreeSum = %v, want empty", got)
	}
	if got := ThreeSum([]int{0}); len(got) != 0 {
		t.Errorf("ThreeSum short input = %v, want empty", got)
	}
}

func TestMaxArea(t *testing.T) {
	if got := MaxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}); got != 49 {
		t.Errorf("MaxArea = %d, want 49", got)
	}
	if got := MaxArea([]int{1, 1}); got != 1 {
		t.Errorf("MaxArea = %d, want 1", got)
	}
}

func TestTrap(t *testing.T) {
	cases := []struct {
		height []int
		want   int
	}{
		{[]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}, 6},
		{[]int{4, 2, 0, 3, 2, 5}, 9},
		{[]int{3, 0, 2, 0, 4}, 7},
		{nil, 0},
		{[]int{5}, 0},
	}
	for _, c := range cases {
		if got := Trap(c.height); got != c.want {
			t.Errorf("Trap(%v) = %d, want %d", c.height, got, c.want)
		}
		// Cross-check the O(1)-space version against the obvious O(n²) one.
		if got, want := Trap(c.height), TrapBrute(c.height); got != want {
			t.Errorf("Trap disagrees with brute on %v: %d vs %d", c.height, got, want)
		}
	}
}

func TestMoveZeroes(t *testing.T) {
	nums := []int{0, 1, 0, 3, 12}
	MoveZeroes(nums)
	if !slices.Equal(nums, []int{1, 3, 12, 0, 0}) {
		t.Errorf("MoveZeroes = %v", nums)
	}
	nums = []int{0}
	MoveZeroes(nums)
	if !slices.Equal(nums, []int{0}) {
		t.Errorf("MoveZeroes = %v", nums)
	}
}

func TestRemoveDuplicates(t *testing.T) {
	nums := []int{1, 1, 2}
	if n := RemoveDuplicates(nums); n != 2 || !slices.Equal(nums[:n], []int{1, 2}) {
		t.Errorf("RemoveDuplicates = %d, %v", n, nums)
	}
	nums = []int{0, 0, 1, 1, 1, 2, 2, 3, 3, 4}
	if n := RemoveDuplicates(nums); n != 5 || !slices.Equal(nums[:n], []int{0, 1, 2, 3, 4}) {
		t.Errorf("RemoveDuplicates = %d, %v", n, nums[:n])
	}
	if n := RemoveDuplicates(nil); n != 0 {
		t.Errorf("RemoveDuplicates(nil) = %d", n)
	}
}

func TestIsSubsequence(t *testing.T) {
	cases := []struct {
		s, t string
		want bool
	}{
		{"abc", "ahbgdc", true},
		{"axc", "ahbgdc", false},
		{"", "anything", true},
		{"abc", "", false},
	}
	for _, c := range cases {
		if got := IsSubsequence(c.s, c.t); got != c.want {
			t.Errorf("IsSubsequence(%q,%q) = %v", c.s, c.t, got)
		}
	}
}

func TestSortColors(t *testing.T) {
	nums := []int{2, 0, 2, 1, 1, 0}
	SortColors(nums)
	if !slices.Equal(nums, []int{0, 0, 1, 1, 2, 2}) {
		t.Errorf("SortColors = %v", nums)
	}
	nums = []int{2, 0, 1}
	SortColors(nums)
	if !slices.Equal(nums, []int{0, 1, 2}) {
		t.Errorf("SortColors = %v", nums)
	}
	nums = []int{2, 2, 2}
	SortColors(nums)
	if !slices.Equal(nums, []int{2, 2, 2}) {
		t.Errorf("SortColors = %v", nums)
	}
}
