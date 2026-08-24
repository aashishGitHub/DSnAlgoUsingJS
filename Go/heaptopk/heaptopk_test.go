package heaptopk

import (
	"math"
	"slices"
	"testing"
)

func TestFindKthLargestAllThreeAgree(t *testing.T) {
	cases := []struct {
		nums []int
		k    int
		want int
	}{
		{[]int{3, 2, 1, 5, 6, 4}, 2, 5},
		{[]int{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4, 4},
		{[]int{1}, 1, 1},
		{[]int{7, 7, 7}, 2, 7},
		{[]int{-1, -2, -3}, 1, -1},
		{[]int{5, 4, 3, 2, 1}, 5, 1}, // k == n: the minimum
	}
	for _, c := range cases {
		before := slices.Clone(c.nums)
		if got := FindKthLargest(c.nums, c.k); got != c.want {
			t.Errorf("FindKthLargest(%v,%d) = %d, want %d", before, c.k, got, c.want)
		}
		if got := FindKthLargestSort(c.nums, c.k); got != c.want {
			t.Errorf("FindKthLargestSort(%v,%d) = %d, want %d", before, c.k, got, c.want)
		}
		if got := FindKthLargestQuickSelect(c.nums, c.k); got != c.want {
			t.Errorf("FindKthLargestQuickSelect(%v,%d) = %d, want %d", before, c.k, got, c.want)
		}
		// None of the three may disturb the caller's slice.
		if !slices.Equal(c.nums, before) {
			t.Errorf("input mutated: %v -> %v", before, c.nums)
		}
	}
}

func TestHeapDirections(t *testing.T) {
	// Guards the one-character difference between the two heap types.
	minH := &MinIntHeap{}
	maxH := &MaxIntHeap{}
	for _, v := range []int{5, 1, 9, 3} {
		pushMin(minH, v)
		pushMax(maxH, v)
	}
	if got := minH.Peek(); got != 1 {
		t.Errorf("min-heap root = %d, want 1", got)
	}
	if got := maxH.Peek(); got != 9 {
		t.Errorf("max-heap root = %d, want 9", got)
	}
}

func TestLastStoneWeight(t *testing.T) {
	cases := []struct {
		stones []int
		want   int
	}{
		{[]int{2, 7, 4, 1, 8, 1}, 1},
		{[]int{1}, 1},
		{[]int{1, 1}, 0}, // equal stones annihilate
		{[]int{3, 7, 2}, 2},
	}
	for _, c := range cases {
		before := slices.Clone(c.stones)
		if got := LastStoneWeight(c.stones); got != c.want {
			t.Errorf("LastStoneWeight(%v) = %d, want %d", before, got, c.want)
		}
		if !slices.Equal(c.stones, before) {
			t.Errorf("LastStoneWeight mutated its input: %v -> %v", before, c.stones)
		}
	}
}

func TestTopKFrequentHeap(t *testing.T) {
	got := TopKFrequentHeap([]int{1, 1, 1, 2, 2, 3}, 2)
	slices.Sort(got)
	if !slices.Equal(got, []int{1, 2}) {
		t.Errorf("TopKFrequentHeap = %v, want [1 2]", got)
	}
	if got := TopKFrequentHeap([]int{1}, 1); !slices.Equal(got, []int{1}) {
		t.Errorf("TopKFrequentHeap = %v", got)
	}
	// The most frequent value must come out first.
	if got := TopKFrequentHeap([]int{4, 4, 4, 9, 9, 7}, 3); got[0] != 4 {
		t.Errorf("TopKFrequentHeap = %v, want 4 first", got)
	}
}

func TestKClosest(t *testing.T) {
	got := KClosest([][]int{{1, 3}, {-2, 2}}, 1)
	if len(got) != 1 || got[0][0] != -2 || got[0][1] != 2 {
		t.Errorf("KClosest = %v, want [[-2 2]]", got)
	}
	got = KClosest([][]int{{3, 3}, {5, -1}, {-2, 4}}, 2)
	slices.SortFunc(got, func(a, b []int) int { return a[0] - b[0] })
	want := [][]int{{-2, 4}, {3, 3}}
	for i := range want {
		if got[i][0] != want[i][0] || got[i][1] != want[i][1] {
			t.Errorf("KClosest = %v, want %v", got, want)
			break
		}
	}
}

func TestLeastInterval(t *testing.T) {
	cases := []struct {
		tasks []byte
		n     int
		want  int
	}{
		{[]byte("AAABBB"), 2, 8},
		{[]byte("AAABBB"), 0, 6},        // no cooldown: just run them all
		{[]byte("AAAAAABCDEFG"), 2, 16}, // idle slots dominate
		{[]byte("ABCDEF"), 1, 6},        // enough variety to never idle
		{[]byte("A"), 5, 1},
	}
	for _, c := range cases {
		if got := LeastInterval(c.tasks, c.n); got != c.want {
			t.Errorf("LeastInterval(%q,%d) = %d, want %d", c.tasks, c.n, got, c.want)
		}
	}
}

func TestMedianFinder(t *testing.T) {
	m := NewMedianFinder()
	m.AddNum(1)
	if got := m.FindMedian(); got != 1 {
		t.Errorf("median after [1] = %v, want 1", got)
	}
	m.AddNum(2)
	if got := m.FindMedian(); got != 1.5 {
		t.Errorf("median after [1 2] = %v, want 1.5", got)
	}
	m.AddNum(3)
	if got := m.FindMedian(); got != 2 {
		t.Errorf("median after [1 2 3] = %v, want 2", got)
	}

	// Descending input is the case that exposes a broken rebalance.
	m2 := NewMedianFinder()
	seen := []int{}
	for _, v := range []int{5, 4, 3, 2, 1} {
		m2.AddNum(v)
		seen = append(seen, v)
		want := medianOf(seen)
		if got := m2.FindMedian(); math.Abs(got-want) > 1e-9 {
			t.Errorf("after %v median = %v, want %v", seen, got, want)
		}
	}
}

// medianOf is the obvious sort-based oracle for the streaming version.
func medianOf(xs []int) float64 {
	s := slices.Clone(xs)
	slices.Sort(s)
	n := len(s)
	if n%2 == 1 {
		return float64(s[n/2])
	}
	return float64(s[n/2-1]+s[n/2]) / 2
}
