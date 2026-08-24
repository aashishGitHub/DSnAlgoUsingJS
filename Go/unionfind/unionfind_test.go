package unionfind

import (
	"slices"
	"testing"
)

func TestUnionFindBasics(t *testing.T) {
	u := NewUnionFind(5)
	if u.Count() != 5 {
		t.Errorf("initial Count = %d, want 5", u.Count())
	}
	if !u.Union(0, 1) {
		t.Error("first Union(0,1) should report a merge")
	}
	// The second attempt must report false — this is the cycle-detection signal.
	if u.Union(0, 1) {
		t.Error("second Union(0,1) should report no merge")
	}
	if u.Count() != 4 {
		t.Errorf("Count = %d, want 4", u.Count())
	}
	if !u.Connected(1, 0) {
		t.Error("1 and 0 should be connected")
	}
	if u.Connected(0, 2) {
		t.Error("0 and 2 should not be connected")
	}
	// Transitivity through a third element.
	u.Union(1, 2)
	if !u.Connected(0, 2) {
		t.Error("0 and 2 should be connected via 1")
	}
	if u.Find(0) != u.Find(2) {
		t.Error("Find must agree with Connected")
	}
}

func TestUnionFindPathCompressionStaysCorrect(t *testing.T) {
	// A deliberately chain-shaped merge order stresses path halving.
	u := NewUnionFind(10)
	for i := range 9 {
		u.Union(i, i+1)
	}
	if u.Count() != 1 {
		t.Errorf("Count = %d, want 1", u.Count())
	}
	root := u.Find(0)
	for i := range 10 {
		if u.Find(i) != root {
			t.Fatalf("element %d has a different root after compression", i)
		}
	}
}

func TestCountComponents(t *testing.T) {
	cases := []struct {
		n     int
		edges [][]int
		want  int
	}{
		{5, [][]int{{0, 1}, {1, 2}, {3, 4}}, 2},
		{5, [][]int{{0, 1}, {1, 2}, {2, 3}, {3, 4}}, 1},
		{4, nil, 4}, // no edges: every node is its own component
		{1, nil, 1},
		{4, [][]int{{0, 1}, {0, 1}}, 3}, // a duplicate edge merges only once
	}
	for _, c := range cases {
		if got := CountComponents(c.n, c.edges); got != c.want {
			t.Errorf("CountComponents(%d,%v) = %d, want %d", c.n, c.edges, got, c.want)
		}
	}
}

func TestValidTree(t *testing.T) {
	cases := []struct {
		n     int
		edges [][]int
		want  bool
	}{
		{5, [][]int{{0, 1}, {0, 2}, {0, 3}, {1, 4}}, true},
		{5, [][]int{{0, 1}, {1, 2}, {2, 3}, {1, 3}, {1, 4}}, false}, // has a cycle
		{4, [][]int{{0, 1}, {2, 3}}, false},                         // acyclic but disconnected
		{1, nil, true},
		{2, [][]int{{0, 1}}, true},
		{3, [][]int{{0, 1}}, false}, // too few edges to connect 3 nodes
	}
	for _, c := range cases {
		if got := ValidTree(c.n, c.edges); got != c.want {
			t.Errorf("ValidTree(%d,%v) = %v, want %v", c.n, c.edges, got, c.want)
		}
	}
}

func TestFindRedundantConnection(t *testing.T) {
	cases := []struct {
		edges [][]int
		want  []int
	}{
		{[][]int{{1, 2}, {1, 3}, {2, 3}}, []int{2, 3}},
		{[][]int{{1, 2}, {2, 3}, {3, 4}, {1, 4}, {1, 5}}, []int{1, 4}},
		{[][]int{{1, 2}, {1, 3}, {3, 1}}, []int{3, 1}},
	}
	for _, c := range cases {
		if got := FindRedundantConnection(c.edges); !slices.Equal(got, c.want) {
			t.Errorf("FindRedundantConnection(%v) = %v, want %v", c.edges, got, c.want)
		}
	}
}
