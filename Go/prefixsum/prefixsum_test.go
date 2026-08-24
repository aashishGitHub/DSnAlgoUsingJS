package prefixsum

import (
	"slices"
	"testing"
)

func TestProductExceptSelf(t *testing.T) {
	cases := []struct {
		nums, want []int
	}{
		{[]int{1, 2, 3, 4}, []int{24, 12, 8, 6}},
		{[]int{-1, 1, 0, -3, 3}, []int{0, 0, 9, 0, 0}}, // a zero must not break it
		{[]int{2, 3}, []int{3, 2}},
	}
	for _, c := range cases {
		if got := ProductExceptSelf(c.nums); !slices.Equal(got, c.want) {
			t.Errorf("ProductExceptSelf(%v) = %v, want %v", c.nums, got, c.want)
		}
	}
}

func TestSubarraySumEqualsK(t *testing.T) {
	cases := []struct {
		nums []int
		k    int
		want int
	}{
		{[]int{1, 1, 1}, 2, 2},
		{[]int{1, 2, 3}, 3, 2},
		{[]int{1, -1, 0}, 0, 3},   // negatives: why a window will not work
		{[]int{3, 4, 7, 2}, 7, 2}, // must count the range starting at index 0
	}
	for _, c := range cases {
		if got := SubarraySumEqualsK(c.nums, c.k); got != c.want {
			t.Errorf("SubarraySumEqualsK(%v,%d) = %d, want %d", c.nums, c.k, got, c.want)
		}
	}
}

func TestLongestSubarrayWithSumK(t *testing.T) {
	cases := []struct {
		nums []int
		k    int
		want int
	}{
		{[]int{1, 2, 3, 4, 5}, 9, 3}, // 2+3+4
		{[]int{1, -1, 5, -2, 3}, 3, 4},
		{[]int{-2, -1, 2, 1}, 1, 2},
		{[]int{1, 2, 3}, 100, 0},
	}
	for _, c := range cases {
		if got := LongestSubarrayWithSumK(c.nums, c.k); got != c.want {
			t.Errorf("LongestSubarrayWithSumK(%v,%d) = %d, want %d", c.nums, c.k, got, c.want)
		}
	}
}

func TestFindMaxLength(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{0, 1}, 2},
		{[]int{0, 1, 0}, 2},
		{[]int{0, 0, 1, 0, 0, 0, 1, 1}, 6},
		{[]int{0, 0, 0}, 0},
	}
	for _, c := range cases {
		if got := FindMaxLength(c.nums); got != c.want {
			t.Errorf("FindMaxLength(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestPivotIndex(t *testing.T) {
	if got := PivotIndex([]int{1, 7, 3, 6, 5, 6}); got != 3 {
		t.Errorf("PivotIndex = %d, want 3", got)
	}
	if got := PivotIndex([]int{1, 2, 3}); got != -1 {
		t.Errorf("PivotIndex = %d, want -1", got)
	}
	if got := PivotIndex([]int{2, 1, -1}); got != 0 {
		t.Errorf("PivotIndex = %d, want 0", got)
	}
}

func TestNumArray(t *testing.T) {
	a := NewNumArray([]int{-2, 0, 3, -5, 2, -1})
	cases := []struct{ l, r, want int }{
		{0, 2, 1},
		{2, 5, -1},
		{0, 5, -3},
		{3, 3, -5},
	}
	for _, c := range cases {
		if got := a.SumRange(c.l, c.r); got != c.want {
			t.Errorf("SumRange(%d,%d) = %d, want %d", c.l, c.r, got, c.want)
		}
	}
}
