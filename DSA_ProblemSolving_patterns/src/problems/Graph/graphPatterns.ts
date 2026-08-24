/**
 * ============================================================================
 * GRAPH PATTERNS (adjacency lists: BFS, DFS, Topological Sort, Components)
 * ============================================================================
 *
 * PATTERN:
 * - Grid problems (see ../IslandsMatrix/) get their graph for free from cell
 *   adjacency. General graphs arrive as EDGE LISTS — step zero is always the
 *   same: build an ADJACENCY LIST (`Map<node, neighbors[]>`), then run BFS
 *   (shortest unweighted paths, level-by-level) or DFS (components, cycles,
 *   ordering) over it with a visited set.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * - Without visited marking, traversal re-explores shared paths exponentially;
 *   with it, every node and edge is touched once → O(V + E). For dependency
 *   ordering, the naive "repeatedly scan for a task with no unmet
 *   prerequisites" is O(V²); Kahn's algorithm keeps an indegree count and a
 *   ready-queue so each edge is decremented exactly once → O(V + E).
 *
 * RECOGNITION CUES:
 * - "prerequisites / depends on / build order"        → topological sort
 * - "can all courses be finished?"                    → cycle detection (same thing)
 * - "how many groups / provinces / networks"          → connected components
 * - "shortest number of steps" (unweighted)           → BFS level count
 *
 * REAL-WORLD ANALOGIES:
 * - Package managers and build systems (npm/make): install/build order IS a
 *   topological sort; a cycle is the dreaded circular dependency.
 * - Social/network clusters: connected components.
 * - CI pipelines: stage ordering with fan-in/fan-out dependencies.
 *
 * Time: O(V + E) for everything in this file. Space: O(V + E).
 * ============================================================================
 */

/**
 * Build an adjacency list from an edge list — step zero of every graph problem.
 *
 * @example
 * buildAdjacencyList(3, [[0, 1], [1, 2]]);            // undirected
 * // Map { 0 => [1], 1 => [0, 2], 2 => [1] }
 *
 * @param directed - when true, each edge [u, v] means u → v only.
 */
export function buildAdjacencyList(
  n: number,
  edges: number[][],
  directed = false
): Map<number, number[]> {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < n; i++) adj.set(i, []);

  for (const [u, v] of edges) {
    adj.get(u)!.push(v);
    if (!directed) adj.get(v)!.push(u);
  }
  return adj;
}

/**
 * ----------------------------------------------------------------------------
 * BFS TRAVERSAL — visit order from a source, level by level
 * ----------------------------------------------------------------------------
 * The queue + visited-on-ENQUEUE discipline: mark nodes when they enter the
 * queue, not when they leave it — otherwise the same node is enqueued twice
 * via different neighbors (the classic BFS bug).
 *
 * Time: O(V + E). Space: O(V).
 */
export function bfsTraversal(adj: Map<number, number[]>, start: number): number[] {
  const order: number[] = [];
  const visited = new Set<number>([start]); // mark on enqueue
  const queue: number[] = [start];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const next of adj.get(node) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

/**
 * ----------------------------------------------------------------------------
 * DFS TRAVERSAL — go deep before wide (iterative-friendly recursive form)
 * ----------------------------------------------------------------------------
 * Time: O(V + E). Space: O(V) recursion worst case.
 */
export function dfsTraversal(adj: Map<number, number[]>, start: number): number[] {
  const order: number[] = [];
  const visited = new Set<number>();

  function dfs(node: number): void {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const next of adj.get(node) ?? []) dfs(next);
  }

  dfs(start);
  return order;
}

/**
 * ----------------------------------------------------------------------------
 * CONNECTED COMPONENTS (LeetCode 323) — "how many separate groups?"
 * ----------------------------------------------------------------------------
 * Sweep all nodes; every time an unvisited node is found, that's a NEW
 * component — consume it entirely with DFS before continuing. (Same shape as
 * numIslands, with an adjacency list instead of a grid.)
 *
 * @example
 * countComponents(5, [[0, 1], [1, 2], [3, 4]]); // 2  ({0,1,2} and {3,4})
 *
 * Time: O(V + E). Space: O(V).
 */
export function countComponents(n: number, edges: number[][]): number {
  const adj = buildAdjacencyList(n, edges);
  const visited = new Set<number>();
  let components = 0;

  function consume(node: number): void {
    if (visited.has(node)) return;
    visited.add(node);
    for (const next of adj.get(node) ?? []) consume(next);
  }

  for (let node = 0; node < n; node++) {
    if (!visited.has(node)) {
      components++;      // found the entry point of a fresh component
      consume(node);     // swallow all of it so it's counted exactly once
    }
  }
  return components;
}

/**
 * ----------------------------------------------------------------------------
 * TOPOLOGICAL SORT — Kahn's algorithm (BFS by indegree)
 * ----------------------------------------------------------------------------
 * Produce an order in which every node appears AFTER all its prerequisites.
 *
 * Incremental story: the naive approach rescans all nodes each round looking
 * for one with no unmet prerequisites → O(V²). Kahn's keeps (a) an indegree
 * count per node and (b) a queue of currently-ready nodes; taking a node
 * "completes" it, decrementing each dependent's indegree — dependents whose
 * count hits zero join the queue. Each edge is processed once → O(V + E).
 *
 * CYCLE DETECTION FOR FREE: if the produced order is shorter than n, some
 * nodes never reached indegree 0 — they sit on a cycle. Returns [] then.
 *
 * @example
 * // edges are [prerequisite, dependent]: 0 → 1 means "0 before 1"
 * topologicalSort(4, [[0, 1], [0, 2], [1, 3], [2, 3]]);
 * // [0, 1, 2] then 3 — e.g. [0, 1, 2, 3]
 *
 * Time: O(V + E). Space: O(V + E).
 */
export function topologicalSort(n: number, edges: number[][]): number[] {
  const adj = buildAdjacencyList(n, edges, true); // directed!
  const indegree = new Array<number>(n).fill(0);
  for (const [, dependent] of edges) indegree[dependent]++;

  // Start with everything that has no prerequisites at all.
  const queue: number[] = [];
  for (let node = 0; node < n; node++) {
    if (indegree[node] === 0) queue.push(node);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node); // safe to schedule: all its prerequisites are done

    for (const dependent of adj.get(node) ?? []) {
      indegree[dependent]--;
      if (indegree[dependent] === 0) queue.push(dependent); // last prereq met
    }
  }

  return order.length === n ? order : []; // shorter ⇒ cycle ⇒ no valid order
}

/**
 * ----------------------------------------------------------------------------
 * COURSE SCHEDULE (LeetCode 207) — "can all courses be finished?"
 * ----------------------------------------------------------------------------
 * Exactly "does a topological order exist?", i.e. "is the dependency graph
 * acyclic?" — a one-liner on top of Kahn's.
 *
 * @example
 * canFinish(2, [[1, 0]]); // true  (take 0, then 1)
 * canFinish(2, [[1, 0], [0, 1]]); // false (0 and 1 require each other)
 *
 * NOTE on input shape: LeetCode's pairs are [course, prerequisite] — the
 * REVERSE of topologicalSort's [prerequisite, dependent] — hence the flip.
 */
export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const edges = prerequisites.map(([course, prereq]) => [prereq, course]);
  return topologicalSort(numCourses, edges).length > 0 || numCourses === 0;
}

/**
 * COURSE SCHEDULE II (LeetCode 210) — return one valid course order (or []).
 */
export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const edges = prerequisites.map(([course, prereq]) => [prereq, course]);
  return topologicalSort(numCourses, edges);
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Step zero is ALWAYS the adjacency list. Say it, build it, then pick the
 *    traversal. Clarify directed vs undirected and the edge-pair convention —
 *    LeetCode's [course, prereq] ordering trips people (see canFinish).
 * 2. BFS marks visited on ENQUEUE; topological sort = Kahn's indegree queue;
 *    order.length < n is the cycle test — three facts, most graph interviews.
 * 3. DFS alternative for topo sort: post-order finish times reversed, with a
 *    three-color (white/gray/black) cycle check — mention it as the variant;
 *    Kahn's is easier to get right live.
 * 4. When the graph is implicit (grid cells, word transformations), don't
 *    materialize it — generate neighbors on the fly (see ../IslandsMatrix/).
 * 5. Next steps from here: Clone Graph (BFS + old→new map), Word Ladder
 *    (BFS on implicit word graph), Union-Find as the other components tool.
 */
