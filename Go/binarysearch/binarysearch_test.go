package binarysearch

import (
	"math"
	"slices"
	"testing"
)

func TestSearch(t *testing.T) {
	nums := []int{-1, 0, 3, 5, 9, 12}
	for i, v := range nums {
		if got := Search(nums, v); got != i {
			t.Errorf("Search(%d) = %d, want %d", v, got, i)
		}
	}
	if got := Search(nums, 2); got != -1 {
		t.Errorf("Search(2) = %d, want -1", got)
	}
	if got := Search(nil, 1); got != -1 {
		t.Errorf("Search(nil) = %d, want -1", got)
	}
}

func TestBounds(t *testing.T) {
	nums := []int{1, 2, 2, 2, 3}
	cases := []struct {
		target, lower, upper, count int
	}{
		{2, 1, 4, 3},
		{1, 0, 1, 1},
		{3, 4, 5, 1},
		{0, 0, 0, 0}, // below everything
		{9, 5, 5, 0}, // above everything
	}
	for _, c := range cases {
		if got := LowerBound(nums, c.target); got != c.lower {
			t.Errorf("LowerBound(%d) = %d, want %d", c.target, got, c.lower)
		}
		if got := UpperBound(nums, c.target); got != c.upper {
			t.Errorf("UpperBound(%d) = %d, want %d", c.target, got, c.upper)
		}
		if got := CountOccurrences(nums, c.target); got != c.count {
			t.Errorf("CountOccurrences(%d) = %d, want %d", c.target, got, c.count)
		}
	}
}

func TestSearchRange(t *testing.T) {
	if got := SearchRange([]int{5, 7, 7, 8, 8, 10}, 8); !slices.Equal(got, []int{3, 4}) {
		t.Errorf("SearchRange = %v, want [3 4]", got)
	}
	if got := SearchRange([]int{5, 7, 7, 8, 8, 10}, 6); !slices.Equal(got, []int{-1, -1}) {
		t.Errorf("SearchRange = %v, want [-1 -1]", got)
	}
	if got := SearchRange(nil, 1); !slices.Equal(got, []int{-1, -1}) {
		t.Errorf("SearchRange(nil) = %v", got)
	}
}

func TestSearchInsert(t *testing.T) {
	nums := []int{1, 3, 5, 6}
	cases := []struct{ target, want int }{{5, 2}, {2, 1}, {7, 4}, {0, 0}}
	for _, c := range cases {
		if got := SearchInsert(nums, c.target); got != c.want {
			t.Errorf("SearchInsert(%d) = %d, want %d", c.target, got, c.want)
		}
	}
}

func TestSearchMatrix(t *testing.T) {
	m := [][]int{{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}}
	for _, target := range []int{1, 3, 11, 34, 60} {
		if !SearchMatrix(m, target) {
			t.Errorf("SearchMatrix(%d) = false, want true", target)
		}
	}
	for _, target := range []int{0, 13, 61} {
		if SearchMatrix(m, target) {
			t.Errorf("SearchMatrix(%d) = true, want false", target)
		}
	}
	if SearchMatrix(nil, 1) || SearchMatrix([][]int{{}}, 1) {
		t.Error("empty matrix must return false")
	}
}

func TestSearchRotated(t *testing.T) {
	nums := []int{4, 5, 6, 7, 0, 1, 2}
	for i, v := range nums {
		if got := SearchRotated(nums, v); got != i {
			t.Errorf("SearchRotated(%d) = %d, want %d", v, got, i)
		}
	}
	if got := SearchRotated(nums, 3); got != -1 {
		t.Errorf("SearchRotated(3) = %d, want -1", got)
	}
	if got := SearchRotated([]int{1}, 0); got != -1 {
		t.Errorf("SearchRotated single = %d, want -1", got)
	}
	// Not rotated at all is still a valid input.
	if got := SearchRotated([]int{1, 2, 3, 4}, 3); got != 2 {
		t.Errorf("SearchRotated unrotated = %d, want 2", got)
	}
}

func TestFindMin(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{3, 4, 5, 1, 2}, 1},
		{[]int{4, 5, 6, 7, 0, 1, 2}, 0},
		{[]int{11, 13, 15, 17}, 11}, // no rotation
		{[]int{2, 1}, 1},
		{[]int{1}, 1},
	}
	for _, c := range cases {
		if got := FindMin(c.nums); got != c.want {
			t.Errorf("FindMin(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestFindPeakElement(t *testing.T) {
	// Several peaks may be valid, so assert the PROPERTY, not a fixed index.
	inputs := [][]int{
		{1, 2, 3, 1},
		{1, 2, 1, 3, 5, 6, 4},
		{1},
		{1, 2},
		{2, 1},
	}
	for _, nums := range inputs {
		i := FindPeakElement(nums)
		leftOK := i == 0 || nums[i-1] < nums[i]
		rightOK := i == len(nums)-1 || nums[i+1] < nums[i]
		if !leftOK || !rightOK {
			t.Errorf("FindPeakElement(%v) = %d, which is not a peak", nums, i)
		}
	}
}

func TestMinEatingSpeed(t *testing.T) {
	cases := []struct {
		piles []int
		h     int
		want  int
	}{
		{[]int{3, 6, 7, 11}, 8, 4},
		{[]int{30, 11, 23, 4, 20}, 5, 30},
		{[]int{30, 11, 23, 4, 20}, 6, 23},
		{[]int{312884470}, 968709470, 1}, // huge h: the slowest speed works
	}
	for _, c := range cases {
		if got := MinEatingSpeed(c.piles, c.h); got != c.want {
			t.Errorf("MinEatingSpeed(%v,%d) = %d, want %d", c.piles, c.h, got, c.want)
		}
	}
}

// medianOracle is the obvious O((m+n)log(m+n)) implementation, used to judge the
// clever O(log(min(m,n))) one.
func medianOracle(a, b []int) float64 {
	all := make([]int, 0, len(a)+len(b))
	all = append(all, a...)
	all = append(all, b...)
	slices.Sort(all)
	n := len(all)
	if n == 0 {
		return 0
	}
	if n%2 == 1 {
		return float64(all[n/2])
	}
	return float64(all[n/2-1]+all[n/2]) / 2
}

func TestFindMedianSortedArrays(t *testing.T) {
	cases := [][2][]int{
		{{1, 3}, {2}},
		{{1, 2}, {3, 4}},
		{{}, {1}},
		{{2}, {}},
		{{1, 1, 1}, {1, 1, 1}},
		{{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}},
		{{6, 7, 8, 9, 10}, {1, 2, 3, 4, 5}}, // fully disjoint, reversed order
		{{1}, {2, 3, 4, 5, 6, 7}},           // very lopsided sizes
		{{-5, -3, -1}, {-2, 0}},
	}
	for _, c := range cases {
		got := FindMedianSortedArrays(c[0], c[1])
		want := medianOracle(c[0], c[1])
		if math.Abs(got-want) > 1e-9 {
			t.Errorf("FindMedianSortedArrays(%v,%v) = %v, want %v", c[0], c[1], got, want)
		}
	}
}
