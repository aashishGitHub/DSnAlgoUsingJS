# Graph Pattern

**When to Use**: Path traversal, DFS/BFS, connected components, shortest paths
**Time Complexity**: O(V + E) | **Space Complexity**: O(V)

## Where the graph problems actually live

This folder's former contents were reorganized (2026-07):

- **`traversePath.js`** was not a graph algorithm — it was the lodash-style
  `get(obj, "a.b.c")` object-path utility, so it moved to
  [`src/GFE-75/objectGet.ts`](../../GFE-75/objectGet.ts) (typed + tested).
- **`findPath.js`** was an empty file and was removed.

The repo's real graph material (grids ARE graphs — each cell a node, each
neighbor an edge):

- **[`../IslandsMatrix/`](../IslandsMatrix/)** — DFS/BFS on 2D grids:
  numIslands, floodFill, maxAreaOfIsland, surrounded regions, Pacific-Atlantic
  (border-first reachability), multi-source BFS (minTimeToInfectAll).
- **[`../TreeTraversal/`](../TreeTraversal/)** — DFS (pre/in/post-order) and
  BFS (level order) on trees, the special case of acyclic connected graphs.

## Common Techniques

- **DFS (Depth-First Search)**: recursive component exploration
- **BFS (Breadth-First Search)**: level-order / shortest-unweighted-path / multi-source waves
- **Visited marking**: the difference between O(V+E) and exponential re-exploration
- **Border-first inversion**: start from the boundary and mark what's reachable
  (surrounded regions, Pacific-Atlantic)

## Adjacency-list graph patterns — `graphPatterns.ts`

Implemented in this folder (typed):

**Primitives**

- [x] `buildAdjacencyList` — step zero of every graph problem (directed/undirected)
- [x] `bfsTraversal` / `dfsTraversal` — with the visited-on-enqueue discipline
- [x] `GraphNode` — the node-reference input shape (Clone Graph's world)

**Components & ordering**

- [x] `countComponents` — Number of Connected Components (LC323)
- [x] `topologicalSort` — Kahn's algorithm, cycle detection for free
- [x] `topologicalSortDFS` — the DFS variant: post-order reversed, with
      white/gray/black colouring (a plain visited set cannot detect cycles)
- [x] `canFinish` / `findOrder` — Course Schedule I & II (LC207/210)

**Blind 75 / commonly asked**

- [x] `cloneGraph` — Clone Graph (LC133): traversal + an old→new `Map` that
      doubles as the visited set
- [x] `validTree` — Graph Valid Tree (LC261): exactly n-1 edges AND connected
- [x] `alienOrder` — Alien Dictionary (LC269): derive edges from adjacent-word
      first differences, then topologically sort them
- [x] `ladderLength` — Word Ladder (LC127): BFS on an implicit graph, with
      wildcard bucketing to avoid the O(N²) neighbour scan
- [x] `isBipartite` — LC785: BFS 2-colouring; restart at every component
- [x] `findRedundantConnection` — LC684: the first union that fails, built on
      the existing [`../UnionFind/`](../UnionFind/) DSU

**Union-Find lives in its own folder** — see
[`../UnionFind/unionFind.ts`](../UnionFind/unionFind.ts) for `UnionFind`
(path compression + union by rank), `countComponentsUnionFind` and
`hasCycleUndirected`. Use the DSU when edges arrive incrementally or
connectivity queries interleave with merges; use the DFS sweep
(`countComponents`) when the graph is static.

Not covered here (weighted graphs, a deliberate next tier):

- [ ] Dijkstra / Network Delay Time (LC743) — needs a min-heap
- [ ] Bellman-Ford / Cheapest Flights Within K Stops (LC787)
- [ ] Minimum spanning trees (Kruskal is Union-Find over sorted edges)

> **Tests:** this folder has no vitest file yet. The implementations were
> verified by running every function against its LeetCode sample plus a
> randomized cross-check of `topologicalSortDFS` against Kahn's, but that
> check was not committed. Note `PROBLEM_INDEX.md` currently marks Graph as
> "smoke ✅", which overstates the position.

## Related Patterns

- DFS/BFS (Tree Traversal, Islands/Matrix)
- Backtracking
- Dynamic Programming (for path optimization)
