// Package shortestpath handles WEIGHTED graphs, where BFS is no longer enough.
//
// PATTERN         Dijkstra (heap-based) and Bellman-Ford (edge relaxation)
// WHEN TO USE     "minimum cost/time to reach", "signal delay", "cheapest
// flight with at most k stops".
//
// THE DECISION TABLE — this is the part to remember:
//
//	unweighted (or all weights equal) -> plain BFS. O(V+E). Do not over-engineer.
//	weighted, non-negative            -> Dijkstra. O(E log V).
//	NEGATIVE weights                  -> Bellman-Ford. O(V·E).
//	need "at most k edges"            -> Bellman-Ford, k+1 rounds.
//
// WHY DIJKSTRA BREAKS ON NEGATIVE EDGES: it finalises a node the moment it is
// popped, betting that no cheaper route exists. A negative edge can invalidate
// that bet after the fact. Bellman-Ford makes no such bet — it just relaxes
// every edge repeatedly.
package shortestpath

import (
	"container/heap"
	"math"
	"slices"
)

// state is a (node, cost-so-far) pair on the frontier.
type state struct {
	node, cost int
}

// stateHeap is a min-heap on cost: the closest unfinalised node is at the root.
type stateHeap []state

func (h stateHeap) Len() int           { return len(h) }
func (h stateHeap) Less(i, j int) bool { return h[i].cost < h[j].cost }
func (h stateHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *stateHeap) Push(x any)        { *h = append(*h, x.(state)) }
func (h *stateHeap) Pop() any          { old := *h; n := len(old) - 1; x := old[n]; *h = old[:n]; return x }

// NetworkDelayTime returns the time for a signal from node k to reach ALL n
// nodes, or -1 if some node is unreachable (LC743). O(E log V).
// times entries are [from, to, weight]; nodes are 1-indexed.
//
// DIJKSTRA'S CORE CLAIM: pop the cheapest frontier node and its distance is
// final. With non-negative weights, any alternative route would have to pass
// through another frontier node that is already at least as expensive.
//
// THE "LAZY" VARIANT USED HERE: instead of decrease-key (which Go's heap does
// not offer without an index map), push duplicates and skip a node the second
// time it is popped. Simpler, same complexity, one extra log factor of pushes.
//
// The answer is the MAXIMUM of the finalised distances — the signal is only
// fully delivered when the last node hears it.
func NetworkDelayTime(times [][]int, n, k int) int {
	adj := make(map[int][]state, n)
	for _, t := range times {
		adj[t[0]] = append(adj[t[0]], state{node: t[1], cost: t[2]})
	}

	dist := make(map[int]int, n) // finalised nodes only
	frontier := &stateHeap{{node: k, cost: 0}}
	for frontier.Len() > 0 {
		cur := heap.Pop(frontier).(state)
		if _, done := dist[cur.node]; done {
			continue // a cheaper path already finalised this node
		}
		dist[cur.node] = cur.cost
		for _, nb := range adj[cur.node] {
			if _, done := dist[nb.node]; !done {
				heap.Push(frontier, state{node: nb.node, cost: cur.cost + nb.cost})
			}
		}
	}

	if len(dist) != n {
		return -1 // at least one node was never reached
	}
	slowest := 0
	for _, d := range dist {
		slowest = max(slowest, d)
	}
	return slowest
}

// FindCheapestPrice returns the cheapest src->dst price using at most k stops,
// or -1 (LC787). O(k·E) time, O(V) space.
//
// WHY NOT DIJKSTRA: the constraint is on the NUMBER OF EDGES, not cost. Dijkstra
// finalises by cost and would happily return a cheap 5-stop route when only 1
// stop is allowed. Bellman-Ford's rounds map exactly onto the edge budget.
//
// THE ONE DETAIL THAT MAKES IT CORRECT: relax from a SNAPSHOT of the previous
// round (`next := clone(dist)`, reading dist and writing next). Updating in
// place would let a path use two edges within a single round, silently
// exceeding the stop limit.
//
// k stops means k+1 flights, hence k+1 rounds.
func FindCheapestPrice(n int, flights [][]int, src, dst, k int) int {
	const unreachable = math.MaxInt / 2 // halved so cost + price cannot overflow

	dist := make([]int, n)
	for i := range dist {
		dist[i] = unreachable
	}
	dist[src] = 0

	for range k + 1 {
		next := slices.Clone(dist) // this round reads dist, writes next
		for _, f := range flights {
			from, to, price := f[0], f[1], f[2]
			if dist[from] == unreachable {
				continue
			}
			next[to] = min(next[to], dist[from]+price)
		}
		dist = next
	}

	if dist[dst] == unreachable {
		return -1
	}
	return dist[dst]
}
