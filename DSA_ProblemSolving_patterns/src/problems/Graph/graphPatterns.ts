/**
 * ============================================================================
 * GRAPH PATTERNS (BFS, DFS, Topological Sort, Components, Bipartite, Clone)
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
 * - "deep copy / clone this structure"                → traversal + old→new Map
 * - "is it a valid tree?"                             → n-1 edges AND connected
 * - "split into two groups, no conflicts"             → BFS 2-colouring (bipartite)
 * - "derive the ordering from these examples"         → build edges, then topo sort
 * - "one letter/step at a time, fewest steps"         → BFS on an implicit graph
 * - "which extra edge created the loop?"              → Union-Find, first failed union
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

import { UnionFind } from "../UnionFind/unionFind";


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
 * DRY-RUN on adj = {0:[1,2], 1:[0,3], 2:[0,3], 3:[1,2]}, start = 0:
 *   visited={0}      queue=[0]        order=[]
 *   pop 0 → order=[0];  1,2 unseen → visited={0,1,2}, queue=[1,2]
 *   pop 1 → order=[0,1]; 0 seen, 3 unseen → visited={0,1,2,3}, queue=[2,3]
 *   pop 2 → order=[0,1,2]; 0 and 3 both already seen → queue=[3]
 *           ↑ THIS is where marking on enqueue pays off: 3 was claimed by 1,
 *             so 2 does not enqueue it a second time.
 *   pop 3 → order=[0,1,2,3]; queue empty → done.
 *
 * @example
 * bfsTraversal(buildAdjacencyList(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), 0);
 * // [0, 1, 2, 3]  — node 3 appears once, not twice
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
 * Same graph, same visited discipline, different shape of answer: BFS fans out
 * level by level, DFS commits to one branch until it dead-ends. Use DFS when
 * the question is "what is reachable / is there a cycle / what order do things
 * FINISH in"; use BFS when the question is "how few steps".
 *
 * DRY-RUN on adj = {0:[1,2], 1:[0,3], 2:[0,3], 3:[1,2]}, start = 0:
 *   dfs(0) → order=[0]      → dfs(1)
 *   dfs(1) → order=[0,1]    → dfs(0) returns immediately (visited) → dfs(3)
 *   dfs(3) → order=[0,1,3]  → dfs(1) visited, dfs(2) → dfs(2)
 *   dfs(2) → order=[0,1,3,2]→ both neighbors visited → unwind.
 *   Contrast with BFS on the same graph: [0,1,2,3] vs [0,1,3,2].
 *
 * @example
 * dfsTraversal(buildAdjacencyList(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), 0);
 * // [0, 1, 3, 2]
 *
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
 * DRY-RUN on n=5, edges=[[0,1],[1,2],[3,4]]:
 *   adj = {0:[1], 1:[0,2], 2:[1], 3:[4], 4:[3]}
 *   node 0 unvisited → components=1, consume(0) swallows 0,1,2
 *   node 1 visited → skip        (already inside component 1)
 *   node 2 visited → skip
 *   node 3 unvisited → components=2, consume(3) swallows 3,4
 *   node 4 visited → skip
 *   → 2  ✓  The outer loop counts ENTRY POINTS; consume() guarantees each
 *           component is entered exactly once.
 *
 * @example
 * // Real-world: how many isolated clusters are in this social network?
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
 * DRY-RUN on n=4, edges=[[0,1],[0,2],[1,3],[2,3]]:
 *   indegree = [0, 1, 1, 2]        queue = [0]   (only 0 has no prerequisites)
 *   pop 0 → order=[0];   1→0, 2→0, both hit zero → queue=[1,2]
 *   pop 1 → order=[0,1]; 3 drops 2→1, not zero yet → queue=[2]
 *   pop 2 → order=[0,1,2]; 3 drops 1→0, now ready → queue=[3]
 *   pop 3 → order=[0,1,2,3]; length 4 === n → valid order  ✓
 *   Note 3 waited for BOTH 1 and 2 — that is the indegree count doing its job.
 *
 * CYCLE DRY-RUN on n=2, edges=[[0,1],[1,0]]:
 *   indegree = [1, 1] → queue starts EMPTY → order=[] → 0 < 2 → return []
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
 * Getting this backwards still passes the symmetric test cases and fails the
 * asymmetric ones, which is exactly how it survives to the submission.
 *
 * Time: O(V + E). Space: O(V + E).
 */
export function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const edges = prerequisites.map(([course, prereq]) => [prereq, course]);
  return topologicalSort(numCourses, edges).length > 0 || numCourses === 0;
}

/**
 * ----------------------------------------------------------------------------
 * COURSE SCHEDULE II (LeetCode 210) — return one valid order, not just yes/no
 * ----------------------------------------------------------------------------
 * The natural follow-up to canFinish: same graph, same algorithm, but return
 * the ORDER Kahn's already produced instead of collapsing it to a boolean.
 * Worth saying out loud in an interview — once topologicalSort exists, LC207
 * and LC210 are the same problem with different return types.
 *
 * Any valid order is accepted; which one comes out depends on the queue order,
 * so do not assert on a single expected array.
 *
 * DRY-RUN on numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]:
 *   flip [course, prereq] → [prereq, course]: [[0,1],[0,2],[1,3],[2,3]]
 *   → topologicalSort gives [0,1,2,3]: take 0 first, 3 last  ✓
 *
 * @example
 * // Real-world: the order to run database migrations that depend on each other.
 * findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]); // [0, 1, 2, 3]
 * findOrder(2, [[1, 0], [0, 1]]);                 // [] (circular dependency)
 *
 * Time: O(V + E). Space: O(V + E).
 */
export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const edges = prerequisites.map(([course, prereq]) => [prereq, course]);
  return topologicalSort(numCourses, edges);
}

/**
 * ----------------------------------------------------------------------------
 * NODE-REFERENCE GRAPHS — when the input is a pointer, not an edge list
 * ----------------------------------------------------------------------------
 * Most problems above hand you `n` and an edge list. A second family (Clone
 * Graph being the archetype) hands you a REFERENCE to one node and expects you
 * to discover the rest by walking `neighbors`. Same traversals, different entry
 * shape — and no node ids, so the visited set is keyed by object identity.
 */
export class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

/**
 * ----------------------------------------------------------------------------
 * CLONE GRAPH (LeetCode 133) — deep-copy a connected undirected graph
 * ----------------------------------------------------------------------------
 * PROBLEM: given a reference to a node in a connected undirected graph, return
 * a deep copy: every node and every edge duplicated, sharing nothing with the
 * original.
 *
 * THE TRAP: a graph has CYCLES, so the obvious recursion
 * `clone(n) = new Node(n.val, n.neighbors.map(clone))` never terminates — A
 * clones B, which clones A, forever. A tree deep-copy works because a tree has
 * no cycles; a graph needs one extra thing.
 *
 * THE FIX (the whole problem): a `Map<original, copy>` that doubles as the
 * VISITED set. "Have I already made a copy of this node?" is the same question
 * as "have I visited it?" — so the map both memoizes and breaks the cycle.
 * Critically, the copy is put in the map BEFORE its neighbors are processed;
 * that is what stops the infinite regress.
 *
 * DRY-RUN on 1—2 (two nodes, an edge each way), starting at 1:
 *   seen = {}                       queue = [1]
 *   pre-register 1 → 1'             seen = {1:1'}
 *   pop 1: neighbor 2 not in seen → make 2', seen = {1:1', 2:2'}, queue = [2]
 *          link 1'.neighbors = [2']
 *   pop 2: neighbor 1 IS in seen → reuse 1' (no new node, no recursion)
 *          link 2'.neighbors = [1']
 *   → 1'—2', a fully independent copy.  ✓
 *
 * @example
 * // Real-world: snapshotting a service dependency mesh before a risky
 * // migration, so the original topology can be restored if the rollout fails.
 * const a = new GraphNode(1);
 * const b = new GraphNode(2);
 * a.neighbors.push(b);
 * b.neighbors.push(a);
 * const copy = cloneGraph(a);
 * copy !== a;                     // true — genuinely a different object
 * copy!.neighbors[0].val;         // 2
 *
 * Time:  O(V + E) — each node created once, each edge walked once.
 * Space: O(V)     — the map plus the queue.
 */
export function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;

  // Map does double duty: memo (original → copy) AND visited set.
  const seen = new Map<GraphNode, GraphNode>();
  seen.set(node, new GraphNode(node.val)); // register BEFORE traversing
  const queue: GraphNode[] = [node];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const neighbor of current.neighbors) {
      if (!seen.has(neighbor)) {
        // First sighting: create the copy, then schedule its own neighbors.
        seen.set(neighbor, new GraphNode(neighbor.val));
        queue.push(neighbor);
      }
      // Wire the copy's edge to the copied neighbor — never the original.
      seen.get(current)!.neighbors.push(seen.get(neighbor)!);
    }
  }

  return seen.get(node)!;
}

/**
 * ----------------------------------------------------------------------------
 * GRAPH VALID TREE (LeetCode 261) — is this edge list exactly a tree?
 * ----------------------------------------------------------------------------
 * PROBLEM: given n nodes and an undirected edge list, is the graph a valid
 * tree? A tree is a graph that is (a) fully connected and (b) acyclic.
 *
 * THE COUNTING SHORTCUT: for n nodes, ANY two of these three imply the third —
 * connected, acyclic, exactly n-1 edges. So instead of running both a
 * connectivity check and a cycle check, check:
 *   1. `edges.length === n - 1`  (too few ⇒ disconnected; too many ⇒ a cycle)
 *   2. connected (one DFS reaches everything)
 * ...and acyclicity comes free. This is why the edge count is checked FIRST —
 * it is O(1) and rejects most bad inputs before any traversal runs.
 *
 * DRY-RUN on n=5, edges=[[0,1],[0,2],[0,3],[1,4]]:
 *   edges.length = 4 === 5-1 ✓ → proceed
 *   DFS from 0 → visits 0,1,4,2,3 → 5 nodes reached === n ✓ → true
 * Counter-example n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]:
 *   edges.length = 5 ≠ 4 → false immediately (the 1-2-3 triangle is a cycle).
 *
 * @example
 * // Real-world: validating that an org chart is a genuine hierarchy —
 * // everyone reachable from the CEO, and nobody reporting in a loop.
 * validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]); // true
 * validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]); // false (cycle)
 *
 * Time:  O(V + E). Space: O(V + E).
 */
export function validTree(n: number, edges: number[][]): boolean {
  // A tree on n nodes has exactly n-1 edges. Cheap O(1) rejection.
  if (edges.length !== n - 1) return false;

  const adj = buildAdjacencyList(n, edges);
  const visited = new Set<number>();

  function explore(node: number): void {
    if (visited.has(node)) return;
    visited.add(node);
    for (const next of adj.get(node) ?? []) explore(next);
  }

  explore(0);

  // With n-1 edges guaranteed, "reached everything" ⇒ connected ⇒ acyclic.
  return visited.size === n;
}

/**
 * ----------------------------------------------------------------------------
 * ALIEN DICTIONARY (LeetCode 269) — recover an unknown alphabet's order
 * ----------------------------------------------------------------------------
 * PROBLEM: given words sorted by the rules of an unknown alphabet, return any
 * letter order consistent with them, or "" if the input is contradictory.
 *
 * THE REFRAME (the entire difficulty): this LOOKS like a string problem and IS
 * a topological sort. Each ordering fact "letter x comes before letter y" is a
 * directed edge x → y; a consistent alphabet is a topological order of those
 * edges. Once seen that way, `topologicalSort` above does all the work.
 *
 * WHERE THE EDGES COME FROM: comparing ADJACENT words only. For "wrt" then
 * "wrf", scan in lockstep past the common prefix "wr"; the first differing pair
 * (t, f) yields exactly one edge t → f. Everything after that first difference
 * says nothing — sorting already stopped comparing there.
 *
 * THE EDGE CASE INTERVIEWERS PROBE: ["abc", "ab"] is INVALID. A prefix must
 * sort before the longer word in any alphabet, so a longer word preceding its
 * own prefix is a contradiction no letter ordering can fix — return "".
 *
 * DRY-RUN on ["wrt", "wrf", "er", "ett", "rftt"]:
 *   wrt vs wrf → first diff at index 2: t → f
 *   wrf vs er  → first diff at index 0: w → e
 *   er  vs ett → first diff at index 1: r → t
 *   ett vs rftt→ first diff at index 0: e → r
 *   letters {w,r,t,f,e}; topo order of w→e, e→r, r→t, t→f  →  "wertf"  ✓
 *
 * @example
 * alienOrder(["wrt", "wrf", "er", "ett", "rftt"]); // "wertf"
 * alienOrder(["z", "x", "z"]);                     // "" (contradiction)
 * alienOrder(["abc", "ab"]);                       // "" (prefix violation)
 *
 * Time:  O(C) where C is the total number of characters — building edges is one
 *        pass, and the topo sort is O(V + E) with V ≤ 26.
 * Space: O(1) bounded by the 26-letter alphabet (O(V + E) in general).
 */
export function alienOrder(words: string[]): string {
  // Collect the letters that actually appear — they are the graph's nodes.
  const letters = new Set<string>();
  for (const word of words) {
    for (const ch of word) letters.add(ch);
  }

  // Index letters 0..k-1 so the numeric topologicalSort above can be reused.
  const ordered = [...letters];
  const indexOf = new Map<string, number>();
  ordered.forEach((ch, i) => indexOf.set(ch, i));

  const edges: number[][] = [];

  for (let i = 0; i + 1 < words.length; i++) {
    const first = words[i];
    const second = words[i + 1];
    const shared = Math.min(first.length, second.length);

    // A longer word before its own prefix can never be sorted — invalid input.
    if (first.length > second.length && first.startsWith(second)) return "";

    for (let k = 0; k < shared; k++) {
      if (first[k] !== second[k]) {
        edges.push([indexOf.get(first[k])!, indexOf.get(second[k])!]);
        break; // only the FIRST difference carries information
      }
    }
  }

  const order = topologicalSort(ordered.length, edges);

  // topologicalSort returns [] on a cycle — a contradictory alphabet.
  if (order.length !== ordered.length) return "";
  return order.map((i) => ordered[i]).join("");
}

/**
 * ----------------------------------------------------------------------------
 * WORD LADDER (LeetCode 127) — shortest transformation chain
 * ----------------------------------------------------------------------------
 * PROBLEM: transform `beginWord` into `endWord` changing ONE letter at a time,
 * where every intermediate word must be in `wordList`. Return the number of
 * words in the shortest chain, or 0 if impossible.
 *
 * THE REFRAME: "shortest number of steps, all steps equal cost" is the BFS
 * recognition cue. The graph is IMPLICIT — words are nodes, and two words share
 * an edge when they differ by exactly one letter. Nothing is materialized;
 * neighbors are generated on demand.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY: the naive neighbor lookup compares the
 * current word against every word in the list — O(N · L) per expansion, so
 * O(N² · L) overall. Instead, pre-bucket every word under wildcard patterns
 * ("hot" → "*ot", "h*t", "ho*"). Two words are neighbors exactly when they
 * share a bucket, so expansion becomes O(L) pattern lookups → O(N · L²) total.
 *
 * DRY-RUN on begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]:
 *   buckets: "*ot" → [hot,dot,lot], "d*g" → [dog], "*og" → [dog,log,cog], …
 *   level 1: hit                        (steps = 1)
 *   level 2: hot            via "h*t"   (steps = 2)
 *   level 3: dot, lot       via "*ot"   (steps = 3)
 *   level 4: dog, log       via "d*g"/"l*g" (steps = 4)
 *   level 5: cog            via "*og"   (steps = 5) → endWord reached → 5  ✓
 *
 * @example
 * // Real-world: minimum single-character typo corrections to turn one valid
 * // product SKU into another, passing only through SKUs that really exist.
 * ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]); // 5
 * ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"]);        // 0
 *
 * Time:  O(N · L²) — N words × L patterns × O(L) to build each pattern string.
 * Space: O(N · L²) for the bucket index.
 */
export function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {
  const dictionary = new Set(wordList);
  if (!dictionary.has(endWord)) return 0; // unreachable by definition

  // Pre-bucket by wildcard pattern so neighbors are a hash lookup, not a scan.
  const buckets = new Map<string, string[]>();
  for (const word of dictionary) {
    for (let i = 0; i < word.length; i++) {
      const pattern = word.slice(0, i) + "*" + word.slice(i + 1);
      if (!buckets.has(pattern)) buckets.set(pattern, []);
      buckets.get(pattern)!.push(word);
    }
  }

  const visited = new Set<string>([beginWord]); // mark on ENQUEUE
  let queue: string[] = [beginWord];
  let steps = 1; // the chain length counts beginWord itself

  while (queue.length > 0) {
    const nextLevel: string[] = [];

    for (const word of queue) {
      if (word === endWord) return steps;

      for (let i = 0; i < word.length; i++) {
        const pattern = word.slice(0, i) + "*" + word.slice(i + 1);
        for (const neighbor of buckets.get(pattern) ?? []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            nextLevel.push(neighbor);
          }
        }
      }
    }

    queue = nextLevel;
    steps++; // one whole level consumed = one more word in the chain
  }

  return 0; // queue drained without reaching endWord
}

/**
 * ----------------------------------------------------------------------------
 * IS GRAPH BIPARTITE (LeetCode 785) — can the nodes be split into two camps?
 * ----------------------------------------------------------------------------
 * PROBLEM: can every node be coloured one of two colours so that no edge joins
 * two nodes of the same colour?
 *
 * THE INSIGHT: this is just BFS with one extra rule — colour each neighbor the
 * OPPOSITE of the current node. A conflict (a neighbor already carrying the
 * same colour) proves an odd-length cycle, and odd cycles are exactly what
 * makes a graph non-bipartite.
 *
 * THE BUG TO AVOID: the graph may be DISCONNECTED, so the colouring must be
 * restarted from every uncoloured node — not just from node 0. Missing that
 * passes the LeetCode samples and fails on a two-component input.
 *
 * DRY-RUN on adj = [[1,3],[0,2],[1,3],[0,2]]  (a 4-cycle 0-1-2-3-0):
 *   colour[0] = 0            queue = [0]
 *   pop 0: 1 and 3 uncoloured → colour 1 (opposite)      queue = [1, 3]
 *   pop 1: 0 has colour 0 ≠ 1 ✓; 2 uncoloured → colour 0 queue = [3, 2]
 *   pop 3: 0 ✓; 2 already colour 0, and 3 is colour 1 ✓
 *   pop 2: neighbors 1,3 both colour 1 ≠ 0 ✓ → true (evens {0,2}, odds {1,3})
 *
 * @example
 * // Real-world: can these people be split across two rooms so no pair with a
 * // recorded conflict ends up in the same room?
 * isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]); // true
 * isBipartite([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]); // false (odd cycle)
 *
 * Time:  O(V + E). Space: O(V).
 */
export function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const colour = new Array<number>(n).fill(-1); // -1 = not yet coloured

  // Restart at every node: the graph need not be connected.
  for (let start = 0; start < n; start++) {
    if (colour[start] !== -1) continue;

    colour[start] = 0;
    const queue: number[] = [start];

    while (queue.length > 0) {
      const node = queue.shift()!;

      for (const neighbor of graph[node]) {
        if (colour[neighbor] === -1) {
          colour[neighbor] = 1 - colour[node]; // flip 0↔1
          queue.push(neighbor);
        } else if (colour[neighbor] === colour[node]) {
          return false; // same colour across an edge ⇒ odd cycle
        }
      }
    }
  }

  return true;
}

/**
 * ----------------------------------------------------------------------------
 * TOPOLOGICAL SORT — DFS variant with white/gray/black cycle detection
 * ----------------------------------------------------------------------------
 * The alternative to Kahn's algorithm above, and the one interviewers ask for
 * when they say "now do it with DFS". Both are O(V + E); Kahn's is easier to
 * get right live, but this variant is worth being able to write.
 *
 * HOW IT WORKS: run DFS, and append a node to the output only AFTER all of its
 * descendants are finished (post-order). That guarantees every node appears
 * before its dependents once the list is REVERSED at the end.
 *
 * THE THREE COLOURS — why a plain visited set is not enough:
 *   WHITE (0) — untouched.
 *   GRAY  (1) — on the current recursion stack, still being explored.
 *   BLACK (2) — fully finished.
 * Meeting a GRAY node means walking into a node that is still open on the
 * current path — a back edge, i.e. a CYCLE. Meeting a BLACK node is fine: it is
 * a node already finished on some earlier path, just a diamond, not a cycle.
 * A single visited set cannot tell those two apart, which is the classic bug.
 *
 * DRY-RUN on n=4, edges=[[0,1],[0,2],[1,3],[2,3]]:
 *   visit 0 (gray) → visit 1 (gray) → visit 3 (gray, no deps) → finish 3, out=[3]
 *                    finish 1, out=[3,1]
 *                  → visit 2 (gray) → 3 is BLACK, skip → finish 2, out=[3,1,2]
 *   finish 0, out=[3,1,2,0] → reversed → [0,2,1,3]  ✓ 0 before 1,2; both before 3
 *
 * @example
 * topologicalSortDFS(4, [[0, 1], [0, 2], [1, 3], [2, 3]]); // [0, 2, 1, 3]
 * topologicalSortDFS(2, [[0, 1], [1, 0]]);                 // [] (cycle)
 *
 * Time:  O(V + E). Space: O(V) for colours + recursion.
 */
export function topologicalSortDFS(n: number, edges: number[][]): number[] {
  const adj = buildAdjacencyList(n, edges, true); // directed!
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const colour = new Array<number>(n).fill(WHITE);
  const finished: number[] = [];
  let hasCycle = false;

  function visit(node: number): void {
    if (colour[node] === BLACK) return; // already done — a diamond, not a cycle
    if (colour[node] === GRAY) {
      hasCycle = true; // back edge into the current path
      return;
    }

    colour[node] = GRAY; // open: now on the recursion stack
    for (const dependent of adj.get(node) ?? []) visit(dependent);
    colour[node] = BLACK; // closed: every descendant is finished
    finished.push(node); // POST-order — dependents were pushed first
  }

  for (let node = 0; node < n; node++) {
    if (colour[node] === WHITE) visit(node);
  }

  if (hasCycle) return [];
  return finished.reverse(); // post-order reversed = topological order
}

/**
 * ----------------------------------------------------------------------------
 * RELATED — REDUNDANT CONNECTION (LeetCode 684), reusing the Union-Find pattern
 * ----------------------------------------------------------------------------
 * PROBLEM: a tree had one extra edge added, producing exactly one cycle. Return
 * the edge that can be removed — the LAST one in the input that closes a cycle.
 *
 * WHY UNION-FIND AND NOT DFS: process edges in order, unioning each pair. The
 * first edge whose endpoints are ALREADY connected is the one that closes the
 * cycle. `union` already returns false in exactly that case, so this is a
 * four-line function on top of the existing DSU — a good illustration that the
 * patterns compose rather than stack up.
 *
 * NOTE on indexing: LeetCode numbers these nodes 1..n, so the DSU is sized
 * n + 1 and slot 0 goes unused. Off-by-one here is a common submission failure.
 *
 * DRY-RUN on [[1,2],[1,3],[2,3]]:
 *   union(1,2) → true  (merged)
 *   union(1,3) → true  (merged; {1,2,3} now one group)
 *   union(2,3) → FALSE (already connected) → return [2,3]  ✓
 *
 * @example
 * // Real-world: a network was cabled as a tree, then someone patched in one
 * // extra link creating a loop — find the cable to pull.
 * findRedundantConnection([[1, 2], [1, 3], [2, 3]]); // [2, 3]
 *
 * Time:  O(n · α(n)) ≈ O(n). Space: O(n).
 */
export function findRedundantConnection(edges: number[][]): number[] {
  const dsu = new UnionFind(edges.length + 1); // nodes are 1-indexed

  for (const edge of edges) {
    // union returns false when the two ends were already connected —
    // adding this edge would close a cycle, so this is the redundant one.
    if (!dsu.union(edge[0], edge[1])) return edge;
  }

  return []; // no cycle found (does not happen for well-formed LC684 input)
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
 * 3. Two topological sorts, both O(V + E): Kahn's (topologicalSort, indegree
 *    queue) and DFS post-order reversed with white/gray/black colours
 *    (topologicalSortDFS). Kahn's is easier to get right live; be able to
 *    explain why a plain visited set cannot detect cycles in the DFS version —
 *    GRAY (on the stack) and BLACK (finished) mean different things.
 * 4. When the graph is IMPLICIT, do not materialize it — generate neighbors on
 *    the fly. Grid cells (see ../IslandsMatrix/), word transformations
 *    (ladderLength), and letter-order constraints (alienOrder) are all graphs
 *    wearing a disguise. Spotting the disguise IS the problem; the traversal
 *    afterwards is routine.
 * 5. Counting shortcuts worth memorizing: a tree on n nodes has exactly n-1
 *    edges (validTree); non-bipartite ⇔ contains an odd cycle (isBipartite);
 *    the redundant edge is the first union that fails (findRedundantConnection).
 * 6. Know which tool for "connected components": DFS sweep (countComponents)
 *    when the graph is static, Union-Find (../UnionFind/) when edges arrive
 *    incrementally or you need connectivity queries interleaved with merges.
 * 7. Follow-ups you may get: weighted shortest paths (Dijkstra with a min-heap,
 *    Bellman-Ford when edges can be negative or hops are capped), and minimum
 *    spanning trees (Kruskal is just Union-Find over sorted edges).
 */
