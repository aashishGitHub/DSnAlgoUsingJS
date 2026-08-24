// Package unionfind merges sets and answers connectivity queries.
//
// PATTERN         Union-Find / Disjoint Set Union (DSU)
// WHEN TO USE     "connected components", "is this a valid tree", "cycle in an
// UNDIRECTED graph", "which edge is redundant", and anything where edges arrive
// ONE AT A TIME and you must answer connectivity as you go.
// WASTE IT KILLS  Re-running DFS/BFS after every new edge.
//
// DSU OR DFS? THE DECIDING QUESTION: is the graph fixed or growing?
//   - Fixed graph, count the components once  -> DFS is simpler, just use it.
//   - Edges streaming in, or "which edge closes a cycle" -> DSU. It answers
//     each query in near-constant time instead of re-traversing.
//
// TWO OPTIMISATIONS, AND WHY EACH EXISTS:
//  1. PATH COMPRESSION — after a Find, point every node on the path straight at
//     the root, so the next query is O(1).
//  2. UNION BY RANK — always hang the shorter tree under the taller, so the
//     structure never degenerates into a linked list.
//
// Together they give O(α(n)) amortised — inverse Ackermann, under 5 for any n
// you will ever see. Say "effectively constant"; claiming exactly O(1) is wrong.
package unionfind

// UnionFind tracks disjoint sets over 0..n-1.
type UnionFind struct {
	parent []int
	rank   []int // upper bound on tree height, used to keep trees flat
	count  int   // how many disjoint sets remain
}

// NewUnionFind starts with every element in its own set.
func NewUnionFind(n int) *UnionFind {
	u := &UnionFind{
		parent: make([]int, n),
		rank:   make([]int, n),
		count:  n,
	}
	for i := range n {
		u.parent[i] = i // each element is its own root
	}
	return u
}

// Find returns the representative of x's set, compressing the path on the way.
//
// The loop rewires each node to its GRANDPARENT (path halving) — one pass, no
// recursion, and it flattens the tree just as effectively as the two-pass
// version. This is the whole reason DSU is fast.
func (u *UnionFind) Find(x int) int {
	for u.parent[x] != x {
		u.parent[x] = u.parent[u.parent[x]] // halve the path
		x = u.parent[x]
	}
	return x
}

// Union merges the sets containing a and b.
//
// RETURNS FALSE when they were ALREADY connected — and that return value is the
// entire cycle-detection mechanism: an edge joining two already-connected nodes
// closes a cycle.
func (u *UnionFind) Union(a, b int) bool {
	rootA, rootB := u.Find(a), u.Find(b)
	if rootA == rootB {
		return false // already together: this edge is redundant
	}
	// Hang the shorter tree under the taller one.
	if u.rank[rootA] < u.rank[rootB] {
		rootA, rootB = rootB, rootA
	}
	u.parent[rootB] = rootA
	if u.rank[rootA] == u.rank[rootB] {
		u.rank[rootA]++ // equal heights: the merged tree is one taller
	}
	u.count--
	return true
}

// Connected reports whether a and b are in the same set.
func (u *UnionFind) Connected(a, b int) bool { return u.Find(a) == u.Find(b) }

// Count returns the number of disjoint sets.
func (u *UnionFind) Count() int { return u.count }

// ---------------------------------------------------------------------------
// The three questions this pattern owns
// ---------------------------------------------------------------------------

// CountComponents counts connected components of an undirected graph (LC323).
// Start at n components and subtract one for every union that actually merged.
func CountComponents(n int, edges [][]int) int {
	u := NewUnionFind(n)
	for _, e := range edges {
		u.Union(e[0], e[1])
	}
	return u.Count()
}

// ValidTree reports whether the edges form a tree (LC261).
//
// A TREE IS TWO CONDITIONS AT ONCE, and both are needed:
//  1. no cycle        — every Union must actually merge something
//  2. fully connected — exactly one component at the end
//
// The edge-count shortcut (a tree has exactly n-1 edges) plus "no cycle" is
// equivalent, and worth mentioning as the O(1) pre-check.
func ValidTree(n int, edges [][]int) bool {
	if len(edges) != n-1 {
		return false // too few cannot connect; too many must cycle
	}
	u := NewUnionFind(n)
	for _, e := range edges {
		if !u.Union(e[0], e[1]) {
			return false // this edge closed a cycle
		}
	}
	return u.Count() == 1
}

// FindRedundantConnection returns the edge that, when removed, leaves a tree
// (LC684). Nodes are 1-indexed.
//
// WHY DSU IS THE PERFECT FIT: process edges in order and the FIRST one joining
// two already-connected nodes is the answer. The problem explicitly asks for the
// last such edge in the input, and since exactly one extra edge exists, the
// first cycle-closing edge encountered IS that edge.
func FindRedundantConnection(edges [][]int) []int {
	u := NewUnionFind(len(edges) + 1) // 1-indexed: allocate one spare slot
	for _, e := range edges {
		if !u.Union(e[0], e[1]) {
			return e
		}
	}
	return nil
}
