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

Now implemented in this folder (typed; tests to follow):

- [x] `buildAdjacencyList` — step zero of every graph problem (directed/undirected)
- [x] `bfsTraversal` / `dfsTraversal` — with the visited-on-enqueue discipline
- [x] `countComponents` — Number of Connected Components (LC323)
- [x] `topologicalSort` — Kahn's algorithm, cycle detection for free
- [x] `canFinish` / `findOrder` — Course Schedule I & II (LC207/210)

Still to add:

- [ ] Clone Graph (BFS + old→new node map)
- [ ] Word Ladder (BFS on an implicit word graph)
- [ ] Union-Find (the other connected-components tool)

## Related Patterns

- DFS/BFS (Tree Traversal, Islands/Matrix)
- Backtracking
- Dynamic Programming (for path optimization)
