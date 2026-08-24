# Union-Find / Disjoint Set Union (DSU) Pattern

**When to Use**: connectivity queries, counting connected components, detecting
cycles in an **undirected** graph, and merging sets as edges arrive over time.
**Time Complexity**: ~O(α(n)) ≈ O(1) amortized per operation (α = inverse
Ackermann, ≤ 4 for any practical n) | **Space**: O(n)

## The idea in one line

Each group is a tree; the root names the group. Two elements are connected iff
they share a root. `union` points one root at the other. Two optimizations keep
the trees nearly flat so `find` is almost O(1).

## The incremental build (in `unionFind.ts`)

1. **Naive** (`NaiveUnionFind`) — parent pointers, walk to root. Correct, but a
   chain of unions can make `find` O(n).
2. **Path compression** — while finding the root, re-point every node on the
   path straight at the root. "Flatten as you go."
3. **Union by rank** — attach the shorter tree under the taller one, so height
   grows as slowly as possible.

Steps 2+3 together (`UnionFind`) give the ~O(α(n)) result.

## Applications included

- `countComponentsUnionFind` — Number of Connected Components (LC323)
- `hasCycleUndirected` — an edge joining two already-connected nodes closes a
  cycle (the accept/reject test at the heart of Kruskal's MST)

## When to prefer DSU over DFS/BFS

DFS/BFS need the whole graph built first. DSU merges **incrementally** — ideal
when edges stream in, or when connectivity queries interleave with unions.
(Compare `countComponents` in [`../Graph/graphPatterns.ts`](../Graph/graphPatterns.ts),
the DFS version of the same problem.)

## Follow-ups

Kruskal's MST · Accounts Merge (LC721) · Redundant Connection (LC684 — the
first edge whose `union` returns false IS the answer) · Number of Islands via DSU.

> ⚠️ Directed-graph cycle detection is a DIFFERENT problem — use DFS colors or
> Kahn's topological sort ([`../Graph/graphPatterns.ts`](../Graph/graphPatterns.ts)), not union-find.
