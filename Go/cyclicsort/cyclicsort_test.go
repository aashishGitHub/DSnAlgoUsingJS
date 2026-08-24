package cyclicsort

import (
	"slices"
	"testing"
)

func TestCyclicSort(t *testing.T) {
	cases := [][]int{
		{3, 1, 5, 4, 2},
		{2, 6, 4, 3, 1, 5},
		{1},
		{2, 1},
	}
	for _, in := range cases {
		nums := slices.Clone(in)
		CyclicSort(nums)
		want := slices.Clone(in)
		slices.Sort(want)
		if !slices.Equal(nums, want) {
			t.Errorf("CyclicSort(%v) = %v, want %v", in, nums, want)
		}
	}
}

func TestMissingNumber(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{3, 0, 1}, 2},
		{[]int{0, 1}, 2}, // the missing value is n itself
		{[]int{9, 6, 4, 2, 3, 5, 7, 0, 1}, 8},
		{[]int{1}, 0}, // the missing value is 0
	}
	for _, c := range cases {
		if got := MissingNumber(c.nums); got != c.want {
			t.Errorf("MissingNumber(%v) = %d, want %d", c.nums, got, c.want)
		}
		if got := MissingNumberSum(c.nums); got != c.want {
			t.Errorf("MissingNumberSum(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestFindDisappearedNumbers(t *testing.T) {
	cases := []struct {
		nums, want []int
	}{
		{[]int{4, 3, 2, 7, 8, 2, 3, 1}, []int{5, 6}},
		{[]int{1, 1}, []int{2}},
		{[]int{2, 2}, []int{1}},
		{[]int{1, 2, 3}, nil}, // nothing missing
	}
	for _, c := range cases {
		in := slices.Clone(c.nums)
		got := FindDisappearedNumbers(slices.Clone(c.nums))
		if len(c.want) == 0 && len(got) == 0 {
			continue
		}
		if !slices.Equal(got, c.want) {
			t.Errorf("FindDisappearedNumbers(%v) = %v, want %v", in, got, c.want)
		}
	}
}

func TestFindDuplicates(t *testing.T) {
	cases := []struct {
		nums, want []int
	}{
		{[]int{4, 3, 2, 7, 8, 2, 3, 1}, []int{2, 3}},
		{[]int{1, 1, 2}, []int{1}},
		{[]int{1}, nil},
	}
	for _, c := range cases {
		in := slices.Clone(c.nums)
		got := FindDuplicates(slices.Clone(c.nums))
		if len(c.want) == 0 && len(got) == 0 {
			continue
		}
		if !slices.Equal(got, c.want) {
			t.Errorf("FindDuplicates(%v) = %v, want %v", in, got, c.want)
		}
	}
}

func TestFirstMissingPositive(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{1, 2, 0}, 3},
		{[]int{3, 4, -1, 1}, 2},
		{[]int{7, 8, 9, 11, 12}, 1}, // every value out of range
		{[]int{1}, 2},
		{[]int{1, 1}, 2}, // duplicates must not loop forever
		{[]int{2, 2, 2}, 1},
		{[]int{1, 2, 3, 4, 5}, 6}, // all present => n+1
		{nil, 1},
	}
	for _, c := range cases {
		in := slices.Clone(c.nums)
		if got := FirstMissingPositive(slices.Clone(c.nums)); got != c.want {
			t.Errorf("FirstMissingPositive(%v) = %d, want %d", in, got, c.want)
		}
	}
}
