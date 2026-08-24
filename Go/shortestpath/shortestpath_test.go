package shortestpath

import "testing"

func TestNetworkDelayTime(t *testing.T) {
	cases := []struct {
		times [][]int
		n, k  int
		want  int
	}{
		{[][]int{{2, 1, 1}, {2, 3, 1}, {3, 4, 1}}, 4, 2, 2},
		{[][]int{{1, 2, 1}}, 2, 1, 1},
		{[][]int{{1, 2, 1}}, 2, 2, -1}, // node 1 is unreachable from 2
		{nil, 1, 1, 0},                 // the source alone, zero delay
		// A cheap two-hop route must win over an expensive direct edge, which is
		// what a plain BFS would get wrong.
		{[][]int{{1, 2, 10}, {1, 3, 1}, {3, 2, 1}}, 3, 1, 2},
	}
	for _, c := range cases {
		if got := NetworkDelayTime(c.times, c.n, c.k); got != c.want {
			t.Errorf("NetworkDelayTime(%v,%d,%d) = %d, want %d", c.times, c.n, c.k, got, c.want)
		}
	}
}

func TestFindCheapestPrice(t *testing.T) {
	flights := [][]int{{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}}
	if got := FindCheapestPrice(4, flights, 0, 3, 1); got != 700 {
		t.Errorf("FindCheapestPrice(k=1) = %d, want 700", got)
	}

	cheap := [][]int{{0, 1, 100}, {1, 2, 100}, {0, 2, 500}}
	// With one stop allowed the two-hop route is cheaper...
	if got := FindCheapestPrice(3, cheap, 0, 2, 1); got != 200 {
		t.Errorf("FindCheapestPrice(k=1) = %d, want 200", got)
	}
	// ...but with zero stops only the direct flight qualifies. This is the case
	// that catches an in-place relaxation bug.
	if got := FindCheapestPrice(3, cheap, 0, 2, 0); got != 500 {
		t.Errorf("FindCheapestPrice(k=0) = %d, want 500", got)
	}
	if got := FindCheapestPrice(2, [][]int{{0, 1, 50}}, 1, 0, 5); got != -1 {
		t.Errorf("unreachable = %d, want -1", got)
	}
	if got := FindCheapestPrice(2, nil, 0, 0, 0); got != 0 {
		t.Errorf("src == dst = %d, want 0", got)
	}
	// A three-hop chain needs k=2; k=1 must reject it.
	chain := [][]int{{0, 1, 1}, {1, 2, 1}, {2, 3, 1}}
	if got := FindCheapestPrice(4, chain, 0, 3, 2); got != 3 {
		t.Errorf("chain with k=2 = %d, want 3", got)
	}
	if got := FindCheapestPrice(4, chain, 0, 3, 1); got != -1 {
		t.Errorf("chain with k=1 = %d, want -1", got)
	}
}
