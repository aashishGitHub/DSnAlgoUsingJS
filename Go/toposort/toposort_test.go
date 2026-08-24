package toposort

import (
	"slices"
	"testing"
)

// isValidOrder checks the defining property: every prerequisite appears before
// the course that needs it. Several orders are valid, so assert the PROPERTY
// rather than one specific permutation.
func isValidOrder(order []int, numCourses int, prerequisites [][]int) bool {
	if len(order) != numCourses {
		return false
	}
	position := make(map[int]int, len(order))
	for i, c := range order {
		if _, dup := position[c]; dup {
			return false // a course listed twice
		}
		position[c] = i
	}
	for _, p := range prerequisites {
		if position[p[1]] > position[p[0]] { // prereq must come first
			return false
		}
	}
	return true
}

func TestCanFinish(t *testing.T) {
	cases := []struct {
		n      int
		prereq [][]int
		want   bool
	}{
		{2, [][]int{{1, 0}}, true},
		{2, [][]int{{1, 0}, {0, 1}}, false}, // mutual dependency
		{1, nil, true},
		{0, nil, true},
		{4, [][]int{{1, 0}, {2, 1}, {3, 2}}, true},  // a chain
		{3, [][]int{{0, 1}, {1, 2}, {2, 0}}, false}, // a 3-cycle
		{3, [][]int{{1, 0}}, true},                  // node 2 is isolated
	}
	for _, c := range cases {
		if got := CanFinish(c.n, c.prereq); got != c.want {
			t.Errorf("CanFinish(%d,%v) = %v, want %v", c.n, c.prereq, got, c.want)
		}
	}
}

func TestFindOrder(t *testing.T) {
	cases := []struct {
		n      int
		prereq [][]int
	}{
		{4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}}},
		{2, [][]int{{1, 0}}},
		{1, nil},
		{3, nil}, // no edges at all: any order works
	}
	for _, c := range cases {
		got := FindOrder(c.n, c.prereq)
		if !isValidOrder(got, c.n, c.prereq) {
			t.Errorf("FindOrder(%d,%v) = %v, which is not a valid order", c.n, c.prereq, got)
		}
	}
	if got := FindOrder(2, [][]int{{1, 0}, {0, 1}}); got != nil {
		t.Errorf("FindOrder with a cycle = %v, want nil", got)
	}
}

func TestFindOrderEdgeDirection(t *testing.T) {
	// [1,0] means "to take 1, first take 0". A reversed edge would yield [1 0].
	got := FindOrder(2, [][]int{{1, 0}})
	if !slices.Equal(got, []int{0, 1}) {
		t.Errorf("FindOrder = %v, want [0 1] — the edge direction is reversed", got)
	}
}

func TestAlienOrder(t *testing.T) {
	cases := []struct {
		words []string
		want  string
	}{
		{[]string{"wrt", "wrf", "er", "ett", "rftt"}, "wertf"},
		{[]string{"z", "x"}, "zx"},
		{[]string{"z", "x", "z"}, ""},  // cycle
		{[]string{"abc", "ab"}, ""},    // a word before its own prefix is invalid
		{[]string{"ab", "abc"}, "abc"}, // prefix first is fine
		{[]string{"z", "z"}, "z"},      // duplicates carry no information
		{[]string{"ac", "ab", "zc"}, "acbz"},
	}
	for _, c := range cases {
		if got := AlienOrder(c.words); got != c.want {
			t.Errorf("AlienOrder(%v) = %q, want %q", c.words, got, c.want)
		}
	}
}
