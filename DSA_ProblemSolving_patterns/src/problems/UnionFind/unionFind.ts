/**
 * ============================================================================
 * UNION-FIND / DISJOINT SET UNION (DSU)
 * ============================================================================
 *
 * WHAT IT IS:
 * A structure that tracks a collection of elements partitioned into disjoint
 * groups, supporting two operations blazingly fast:
 *   - find(x):  which group is x in? (returns the group's representative "root")
 *   - union(a, b): merge the groups containing a and b.
 *
 * PATTERN:
 * - **Represent each group as a tree; the root identifies the group.** Two
 *   elements are connected iff they share a root. Merging = point one root at
 *   the other. Two optimizations turn near-linear trees into near-flat ones.
 *
 * WHEN TO USE:
 * - "How many groups / are these connected / detect a cycle in an UNDIRECTED
 *   graph / progressively merge sets." Especially when edges ARRIVE OVER TIME
 *   (online) — DFS/BFS want the whole graph up front; union-find merges
 *   incrementally.
 *
 * REAL-WORLD ANALOGIES:
 * - Network connectivity: are machines A and B on the same network as cables
 *   get plugged in one by one?
 * - Account/friend merging: "same person" clusters as duplicate links appear.
 * - Kruskal's MST: add an edge iff it joins two different components.
 *
 * COMPLEXITY LADDER (n elements, m operations):
 *   Step 1  Naive (root chains can grow linear)     find/union O(n)
 *   Step 2  + Path compression                       ~O(log n) amortized
 *   Step 3  + Union by rank/size ★                   ~O(α(n)) ≈ O(1) amortized
 *           (α = inverse Ackermann — ≤ 4 for any practical n)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — NAIVE UNION-FIND (the mental model, before optimizing)
 * ----------------------------------------------------------------------------
 * `parent[i]` points at i's parent; a root points at itself. `find` walks up
 * to the root; `union` links one root under the other.
 *
 * Why it's slow: repeated unions can build a long chain (a linked list), so
 * `find` degrades to O(n) — walking the whole chain each time. Steps 2-3 keep
 * the trees shallow.
 */
export class NaiveUnionFind {
  protected parent: number[];

  constructor(size: number) {
    // Everyone starts in their own group: parent[i] = i (i is its own root).
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  find(x: number): number {
    while (this.parent[x] !== x) x = this.parent[x]; // walk up to the root
    return x;
  }

  union(a: number, b: number): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent[rootA] = rootB; // hang one root under the other
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 & 3 ★ — OPTIMIZED UNION-FIND (path compression + union by rank)
 * ----------------------------------------------------------------------------
 * PATH COMPRESSION: while finding the root, re-point every node along the way
 * DIRECTLY at the root — so the next find is nearly O(1). "Flatten as you go."
 *
 * UNION BY RANK: always attach the SHORTER tree under the taller one, so the
 * height grows as slowly as possible (never make the tall tree taller for no
 * reason).
 *
 * Together these give ~O(α(n)) amortized per op — effectively constant.
 *
 * `count` tracks the number of disjoint groups: starts at `size`, drops by one
 * on every union that actually merges two different groups.
 */
export class UnionFind {
  private parent: number[];
  private rank: number[]; // upper bound on tree height rooted at i
  private groupCount: number;

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array<number>(size).fill(0);
    this.groupCount = size; // every element is its own group initially
  }

  /** find with PATH COMPRESSION (iterative two-pass: find root, then flatten). */
  find(x: number): number {
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];

    // Second pass: point everything on the path straight at the root.
    while (this.parent[x] !== root) {
      const next = this.parent[x];
      this.parent[x] = root;
      x = next;
    }
    return root;
  }

  /** union by RANK. Returns true if a merge happened (they were separate). */
  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false; // already in the same group

    // Attach the shorter tree under the taller one.
    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA; // equal ranks: pick one, its rank grows by 1
      this.rank[rootA]++;
    }

    this.groupCount--; // two groups just became one
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  /** Number of disjoint groups remaining. */
  count(): number {
    return this.groupCount;
  }
}

/**
 * ----------------------------------------------------------------------------
 * APPLICATION — Number of Connected Components (LeetCode 323), the DSU way
 * ----------------------------------------------------------------------------
 * Union every edge; the leftover group count is the answer. Compare with the
 * DFS version in Graph/graphPatterns.ts — DSU shines when edges stream in or
 * when you also need "are these two connected?" queries interleaved.
 *
 * DRY-RUN on n=5, edges=[[0,1],[1,2],[3,4]]:
 *   start count=5
 *   union(0,1) → 4 · union(1,2) → 3 · union(3,4) → 2
 *   → 2 components ({0,1,2}, {3,4}) ✓
 *
 * Time: O(n + m·α(n)) ≈ O(n + m). Space: O(n).
 */
export function countComponentsUnionFind(n: number, edges: number[][]): number {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) uf.union(a, b);
  return uf.count();
}

/**
 * APPLICATION — cycle detection in an UNDIRECTED graph.
 * If an edge connects two nodes already in the same group, that edge closes a
 * cycle. (This is the reject/accept test at the heart of Kruskal's MST.)
 *
 * @example
 * hasCycleUndirected(3, [[0,1],[1,2],[2,0]]); // true  (triangle)
 * hasCycleUndirected(3, [[0,1],[1,2]]);       // false (a path)
 */
export function hasCycleUndirected(n: number, edges: number[][]): boolean {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return true; // both endpoints already connected → cycle
  }
  return false;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "connected components / connectivity queries / detect
 *    cycle in undirected graph / merge sets as edges arrive." If edges stream
 *    in over time, prefer DSU over DFS/BFS (which need the whole graph first).
 * 2. The two optimizations are the whole interview: PATH COMPRESSION (flatten
 *    on find) + UNION BY RANK/SIZE (shorter under taller). Quote the result:
 *    ~O(α(n)) amortized, effectively constant.
 * 3. `union` returning "did a merge happen?" is what powers component-counting
 *    and cycle detection — don't discard that boolean.
 * 4. Directed-graph cycle detection is DIFFERENT — use DFS colors or Kahn's
 *    topological sort (Graph/graphPatterns.ts), NOT union-find.
 * 5. Follow-ups: Kruskal's MST, Accounts Merge (LC721), Redundant Connection
 *    (LC684 — the first edge that fails union IS the redundant one), Number of
 *    Islands via DSU.
 */
