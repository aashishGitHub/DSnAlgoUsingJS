// Package toposort orders nodes so every edge points forward.
//
// PATTERN         Topological Sort (Kahn's BFS on in-degrees)
// WHEN TO USE     "prerequisites", "build order", "depends on", "install
// before", and — critically — DETECTING A CYCLE in a directed graph.
// WASTE IT KILLS  Guessing an order and backtracking when it fails.
//
// KAHN'S ALGORITHM IN ONE SENTENCE: repeatedly take a node with no remaining
// prerequisites, output it, and decrement its dependents' counters.
//
// THE FREE CYCLE CHECK, which is why this beats DFS for interviews: if the
// output is shorter than the node count, the leftovers are exactly the nodes
// trapped in a cycle — every one of them is waiting on another. No colouring,
// no recursion-stack bookkeeping.
//
// O(V+E) time and space.
package toposort

import (
	"slices"
	"strings"
)

// FindOrder returns a valid course order, or nil if the prerequisites contain a
// cycle (LC210). Each pair is [course, prerequisite].
//
// EDGE DIRECTION IS THE #1 BUG HERE. "course depends on prereq" means the edge
// runs prereq -> course, and the in-degree belongs to the COURSE. Draw two
// nodes and one arrow before writing the loop.
func FindOrder(numCourses int, prerequisites [][]int) []int {
	adj := make([][]int, numCourses)
	indegree := make([]int, numCourses)
	for _, p := range prerequisites {
		course, prereq := p[0], p[1]
		adj[prereq] = append(adj[prereq], course) // finish prereq, unlock course
		indegree[course]++
	}

	queue := []int{}
	for c, d := range indegree {
		if d == 0 {
			queue = append(queue, c) // no prerequisites: available immediately
		}
	}

	order := make([]int, 0, numCourses)
	for len(queue) > 0 {
		course := queue[0]
		queue = queue[1:]
		order = append(order, course)
		for _, next := range adj[course] {
			indegree[next]--
			if indegree[next] == 0 { // its last prerequisite just cleared
				queue = append(queue, next)
			}
		}
	}
	if len(order) < numCourses {
		return nil // some nodes never reached in-degree 0 => cycle
	}
	return order
}

// CanFinish reports whether all courses can be completed (LC207).
// The same algorithm, asking only whether an order exists.
func CanFinish(numCourses int, prerequisites [][]int) bool {
	return FindOrder(numCourses, prerequisites) != nil
}

// AlienOrder infers a letter ordering from a sorted dictionary (LC269).
//
// THE INSIGHT: adjacent words are the only source of information. At their FIRST
// differing character, the earlier word's letter precedes the later word's — and
// nothing after that position tells you anything, so break immediately.
//
// THE EDGE CASE INTERVIEWERS PROBE: "abc" before "ab" is invalid input. A longer
// word can never precede its own prefix in a sorted list, so return "".
//
// LC accepts any valid order; this returns the lexicographically smallest one by
// keeping the ready set sorted, which makes the result deterministic and
// testable. Say that out loud — a randomly ordered answer is equally correct.
func AlienOrder(words []string) string {
	adj := map[byte]map[byte]bool{}
	indegree := map[byte]int{}
	for _, w := range words {
		for i := 0; i < len(w); i++ {
			if _, seen := indegree[w[i]]; !seen {
				indegree[w[i]] = 0
				adj[w[i]] = map[byte]bool{}
			}
		}
	}

	for i := 0; i+1 < len(words); i++ {
		a, b := words[i], words[i+1]
		shorter := min(len(a), len(b))
		if len(a) > len(b) && a[:shorter] == b[:shorter] {
			return "" // "abc" listed before "ab" is impossible
		}
		for j := range shorter {
			if a[j] != b[j] {
				if !adj[a[j]][b[j]] { // the set prevents double-counting an edge
					adj[a[j]][b[j]] = true
					indegree[b[j]]++
				}
				break // only the FIRST difference carries information
			}
		}
	}

	ready := []byte{}
	for c, d := range indegree {
		if d == 0 {
			ready = append(ready, c)
		}
	}
	slices.Sort(ready)

	var out strings.Builder
	for len(ready) > 0 {
		c := ready[0]
		ready = ready[1:]
		out.WriteByte(c)
		for nb := range adj[c] {
			indegree[nb]--
			if indegree[nb] == 0 {
				ready = append(ready, nb)
			}
		}
		slices.Sort(ready) // keep the choice deterministic
	}
	if out.Len() != len(indegree) {
		return "" // cycle
	}
	return out.String()
}
