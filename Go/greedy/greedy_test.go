package greedy

import (
	"slices"
	"testing"
)

func TestCanJump(t *testing.T) {
	cases := []struct {
		nums []int
		want bool
	}{
		{[]int{2, 3, 1, 1, 4}, true},
		{[]int{3, 2, 1, 0, 4}, false}, // the 0 at index 3 is an unjumpable wall
		{[]int{0}, true},              // already at the end
		{[]int{1, 0}, true},
		{[]int{0, 1}, false},
		{[]int{2, 0, 0}, true},
	}
	for _, c := range cases {
		if got := CanJump(c.nums); got != c.want {
			t.Errorf("CanJump(%v) = %v, want %v", c.nums, got, c.want)
		}
	}
}

func TestJump(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 3, 1, 1, 4}, 2},
		{[]int{2, 3, 0, 1, 4}, 2},
		{[]int{0}, 0}, // no jump needed
		{[]int{1, 2, 3}, 2},
		{[]int{1, 1, 1, 1}, 3},
		{[]int{5, 1, 1, 1, 1}, 1}, // one big jump clears everything
	}
	for _, c := range cases {
		if got := Jump(c.nums); got != c.want {
			t.Errorf("Jump(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestCanCompleteCircuit(t *testing.T) {
	cases := []struct {
		gas, cost []int
		want      int
	}{
		{[]int{1, 2, 3, 4, 5}, []int{3, 4, 5, 1, 2}, 3},
		{[]int{2, 3, 4}, []int{3, 4, 3}, -1}, // total gas < total cost
		{[]int{5}, []int{4}, 0},
		{[]int{3, 1, 1}, []int{1, 2, 2}, 0},
		{[]int{1, 1, 1}, []int{1, 1, 1}, 0}, // exactly enough fuel
	}
	for _, c := range cases {
		if got := CanCompleteCircuit(c.gas, c.cost); got != c.want {
			t.Errorf("CanCompleteCircuit(%v,%v) = %d, want %d", c.gas, c.cost, got, c.want)
		}
	}
}

func TestPartitionLabels(t *testing.T) {
	cases := []struct {
		s    string
		want []int
	}{
		{"ababcbacadefegdehijhklij", []int{9, 7, 8}},
		{"eccbbbbdec", []int{10}}, // one letter spans the whole string
		{"abc", []int{1, 1, 1}},
		{"a", []int{1}},
	}
	for _, c := range cases {
		if got := PartitionLabels(c.s); !slices.Equal(got, c.want) {
			t.Errorf("PartitionLabels(%q) = %v, want %v", c.s, got, c.want)
		}
	}
}

func TestPartitionLabelsSumsToLength(t *testing.T) {
	// Whatever the split, the parts must exactly reconstruct the input.
	for _, s := range []string{"ababcbacadefegdehijhklij", "abcdefg", "aabbcc"} {
		total := 0
		for _, n := range PartitionLabels(s) {
			total += n
		}
		if total != len(s) {
			t.Errorf("parts of %q sum to %d, want %d", s, total, len(s))
		}
	}
}
