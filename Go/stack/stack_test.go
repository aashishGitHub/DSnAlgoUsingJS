package stack

import (
	"slices"
	"testing"
)

func TestIsValid(t *testing.T) {
	cases := []struct {
		s    string
		want bool
	}{
		{"()", true},
		{"()[]{}", true},
		{"(]", false},
		{"([)]", false}, // a counter-based solution wrongly accepts this
		{"([])", true},
		{"]", false}, // closer with an empty stack
		{"(", false}, // leftover opener
		{"", true},
	}
	for _, c := range cases {
		if got := IsValid(c.s); got != c.want {
			t.Errorf("IsValid(%q) = %v, want %v", c.s, got, c.want)
		}
	}
}

func TestMinStack(t *testing.T) {
	s := NewMinStack()
	s.Push(-2)
	s.Push(0)
	s.Push(-3)
	if got := s.GetMin(); got != -3 {
		t.Errorf("GetMin = %d, want -3", got)
	}
	s.Pop()
	if got := s.Top(); got != 0 {
		t.Errorf("Top = %d, want 0", got)
	}
	if got := s.GetMin(); got != -2 {
		t.Errorf("GetMin = %d, want -2", got)
	}
	// Duplicate minimums must survive one pop each.
	s2 := NewMinStack()
	s2.Push(1)
	s2.Push(1)
	s2.Pop()
	if got := s2.GetMin(); got != 1 {
		t.Errorf("GetMin with duplicate mins = %d, want 1", got)
	}
	if s2.Len() != 1 {
		t.Errorf("Len = %d, want 1", s2.Len())
	}
}

func TestEvalRPN(t *testing.T) {
	cases := []struct {
		tokens []string
		want   int
	}{
		{[]string{"2", "1", "+", "3", "*"}, 9},
		{[]string{"4", "13", "5", "/", "+"}, 6},
		{[]string{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}, 22},
		{[]string{"3", "-4", "/"}, 0},  // truncation toward zero, not floor
		{[]string{"5", "3", "-"}, 2},   // operand order for non-commutative ops
		{[]string{"-7", "2", "/"}, -3}, // Go truncates: -3, not -4
		{[]string{"42"}, 42},
	}
	for _, c := range cases {
		if got := EvalRPN(c.tokens); got != c.want {
			t.Errorf("EvalRPN(%v) = %d, want %d", c.tokens, got, c.want)
		}
	}
}

func TestDailyTemperatures(t *testing.T) {
	cases := []struct {
		temps, want []int
	}{
		{[]int{73, 74, 75, 71, 69, 72, 76, 73}, []int{1, 1, 4, 2, 1, 1, 0, 0}},
		{[]int{30, 40, 50, 60}, []int{1, 1, 1, 0}},
		{[]int{30, 60, 90}, []int{1, 1, 0}},
		{[]int{90, 80, 70}, []int{0, 0, 0}}, // strictly decreasing: never warmer
		{[]int{50, 50, 50}, []int{0, 0, 0}}, // equal is not warmer
	}
	for _, c := range cases {
		if got := DailyTemperatures(c.temps); !slices.Equal(got, c.want) {
			t.Errorf("DailyTemperatures(%v) = %v, want %v", c.temps, got, c.want)
		}
		// The monotonic stack must agree with the O(n²) forward scan.
		if got, want := DailyTemperatures(c.temps), DailyTemperaturesBrute(c.temps); !slices.Equal(got, want) {
			t.Errorf("monotonic disagrees with brute on %v: %v vs %v", c.temps, got, want)
		}
	}
}

func TestNextGreaterElements(t *testing.T) {
	if got := NextGreaterElements([]int{2, 1, 2, 4, 3}); !slices.Equal(got, []int{4, 2, 4, -1, -1}) {
		t.Errorf("NextGreaterElements = %v, want [4 2 4 -1 -1]", got)
	}
	if got := NextGreaterElements([]int{5, 4, 3}); !slices.Equal(got, []int{-1, -1, -1}) {
		t.Errorf("NextGreaterElements = %v", got)
	}
}

func TestLargestRectangleArea(t *testing.T) {
	cases := []struct {
		heights []int
		want    int
	}{
		{[]int{2, 1, 5, 6, 2, 3}, 10},
		{[]int{2, 4}, 4},
		{[]int{1}, 1},
		{[]int{2, 1, 2}, 3},
		{[]int{1, 2, 3, 4, 5}, 9}, // increasing: only the sentinel flushes it
		{[]int{5, 4, 3, 2, 1}, 9}, // decreasing
		{[]int{3, 3, 3}, 9},       // all equal
		{[]int{0, 9}, 9},          // a zero-height bar splits the histogram
		{nil, 0},
	}
	for _, c := range cases {
		if got := LargestRectangleArea(c.heights); got != c.want {
			t.Errorf("LargestRectangleArea(%v) = %d, want %d", c.heights, got, c.want)
		}
	}
}
