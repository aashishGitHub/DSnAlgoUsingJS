# The Patterns Revision Guide

*One document to revise every pattern in this repo — built around incremental coding: start naive, name the waste, upgrade.*

---

## How to use this guide

- **5 minutes before an interview**: read §1 (the method) and §2 (the recognition table).
- **30-minute revision**: read the sections for the patterns you're rusty on. Each follows the same template: *Essence → Recognize it → Incremental build → Pitfalls → Where in this repo*.
- **Deep practice**: open the linked repo file for a pattern — every reworked file contains the full brute-force → optimized progression with dry-run traces and interview notes.

Every code snippet here is deliberately short. The point is the *step between* the snippets — that step is what you say out loud in an interview.

> **Practising in Go?** [`Go/GO_INTERVIEW_QA.md`](../Go/GO_INTERVIEW_QA.md) is the
> companion document: the same patterns arranged as a Q&A ladder, with a
> JavaScript→Go translation table, `container/heap` boilerplate, and Go-specific
> gotchas. Every snippet there is copied from compiling, tested code
> (`cd Go && go test ./...`). Two areas remain Go-only: **shortest paths
> (Dijkstra, Bellman-Ford, MST)** and **TimeMap / LFU design**. Trie and bit
> manipulation now exist on the TS side too — see
> [`src/problems/Trie/`](src/problems/Trie/) and
> [`src/problems/BitManipulation/`](src/problems/BitManipulation/).

---

## 1. The Method: Incremental Coding

Never reach for the clever solution first. Build in three moves:

**Move 1 — Write the brute force you can produce in two minutes.**
It is almost always nested loops or "try everything." Say its complexity out loud. This is not wasted work: it proves you understand the problem, gives you a correctness oracle to test the clever version against, and earns partial credit immediately.

**Move 2 — Name the repeated work.**
Point at the exact line doing redundant computation. This sentence is the whole interview:

> "The inner loop re-computes something the previous iteration already knew."

Every pattern in this guide is just a different answer to *"how do I remember it instead of re-computing it?"*

**Move 3 — Apply the pattern that removes exactly that waste.**

| The waste in the brute force | The pattern that removes it |
|---|---|
| Re-scanning for a partner/complement | Hash Map (remember what you've seen) |
| Re-summing an overlapping range | Sliding Window / Prefix Sum (update, don't recompute) |
| Checking pairs that provably can't win | Two Pointers (sortedness discards candidates) |
| Scanning half that can't contain the answer | Binary Search (monotonicity halves the space) |
| Re-solving the same subproblem | Dynamic Programming (memoize / tabulate) |
| Re-exploring visited cells/nodes | DFS/BFS with visited marking |
| Storing history just to detect repetition | Fast & Slow Pointers (a second pointer proves the loop) |
| Sorting when values are their own indices | Cyclic Sort (swap items home) |
| Comparing all interval pairs | Sort + single sweep (overlaps become adjacent) |
| Fully sorting when you need only the top k | Heap of size k / bucket by bounded key |

Then verify: dry-run the optimized version on the same example you used for the brute force. If they disagree, the brute force is your judge.

---

## 2. Recognition Table — cue → pattern

| When the problem says… | Reach for | Target complexity |
|---|---|---|
| "sorted array" + pair/triplet with target | Two Pointers (converging) | O(n) / O(n²) for 3Sum |
| "remove/move X in place, keep order" | Two Pointers (fast/slow write pointer) | O(n), O(1) space |
| "contiguous subarray/substring" + longest/shortest/max | Sliding Window | O(n) |
| "max/min sum of a contiguous subarray" | Kadane's | O(n) |
| "have I seen…", "group by…", "count of…" | Hash Map / Set | O(n), O(n) space |
| "count of subarrays with exact sum k" (negatives allowed) | Prefix Sum + Hash Map | O(n) |
| "sorted" + find / "minimum X such that condition holds" | Binary Search (on data / on answer) | O(log n) |
| linked list + cycle / middle / nth-from-end / palindrome | Fast & Slow Pointers | O(n), O(1) space |
| "array contains numbers 1..n" + missing/duplicate | Cyclic Sort | O(n), O(1) space |
| meetings / ranges / merge / rooms needed | Merge Intervals (sort + sweep) | O(n log n) |
| tree + "level / depth / nearest" | BFS (queue) | O(n) |
| tree + "path / validate / combine subtree answers" | DFS (recursion) | O(n) |
| grid + islands / regions / flood fill / spread | Grid DFS/BFS (multi-source BFS for "time to spread") | O(m·n) |
| "top/least k frequent", "k-th largest" | Heap of size k / bucket sort / QuickSelect | O(n log k) / O(n) |
| "all combinations / permutations / ways to place" | Backtracking | exponential, prune hard |
| "prerequisites / build order / depends on" | Topological Sort (Kahn's BFS) | O(V+E) |
| "connected components / cycle in undirected graph / merge as edges arrive" | Union-Find (DSU) | ~O(1) amortized |
| "min cost / number of ways / longest … with choices" | Dynamic Programming | O(n)–O(n²) |

---

## 3. Two Pointers

**Essence.** Two indices that move with purpose. Sortedness (or symmetry) guarantees each move safely discards candidates, so nothing is re-scanned.

**Recognize it:** sorted input + pair/triplet target; "in place"; palindromes; partition by predicate.

**Incremental build — Pair With Target Sum (sorted array):**

```ts
// Move 1 — brute force: try every pair. O(n²).
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)
    if (nums[i] + nums[j] === target) return [i, j];
```

*Move 2 — name the waste:* once `nums[i] + nums[j]` is too big, every larger `j` is also too big — the array is sorted. We keep checking pairs we could prove hopeless.

```ts
// Move 3 — converge from both ends. Each step discards one candidate forever. O(n).
let left = 0, right = n - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  sum < target ? left++ : right--;   // only one direction can possibly help
}
```

**The three sub-shapes** (know which you're in):
1. **Converging** (ends → middle): pair sums, 3Sum (fix one element + converge on the rest), Container With Most Water (always move the shorter wall), palindrome checks.
2. **Fast/slow write-pointer** (same direction): Move Zeroes, Remove Duplicates — `slow` marks the boundary of "kept" elements, `fast` scans.
3. **Three-pointer partition**: Sort Colors (Dutch National Flag) — `low / mid / high` regions in one pass.

**Pitfalls.**
- On a pair match with duplicates, advance **both** pointers (single-advance reuses a consumed element — this exact bug lived in `sumZero` here).
- k-Sum dedup needs skipping at *every* fixed level and after every match.
- Swap-based partitioning does **not** preserve the displaced group's order once values are distinct (documented trade-off in `moveZeros_solutions.ts`).

**In this repo:** [`src/problems/2Pointers/`](src/problems/2Pointers/README.md) — 12 problems, each with the full progression. Flagships: `3Sum.ts`, `trappingRainWater.ts`, `moveZeros.ts`.

---

## 4. Sliding Window

**Essence.** A window over contiguous elements whose aggregate is **updated incrementally** — subtract what leaves, add what enters — instead of recomputed.

**Recognize it:** "contiguous subarray/substring", "of size k", "longest/shortest such that ⟨condition⟩".

**Incremental build — Max Sum of Subarray of Size K:**

```ts
// Move 1 — brute force: re-sum every window. O(n·k).
for (let start = 0; start + k <= n; start++) {
  let sum = 0;
  for (let i = start; i < start + k; i++) sum += arr[i];   // ← the waste
  best = Math.max(best, sum);
}
```

*Move 2 — name the waste:* adjacent windows share k−1 elements; the inner loop re-adds them all.

```ts
// Move 3 — slide: one subtract + one add per step. O(n).
let sum = 0;
for (let i = 0; i < k; i++) sum += arr[i];        // first window once
let best = sum;
for (let i = k; i < n; i++) {
  sum += arr[i] - arr[i - k];                      // enter right, leave left
  best = Math.max(best, sum);
}
```

**Variable-size windows** add one idea: grow `right` greedily; the moment the window violates the condition, shrink from `left` just enough to restore it. Both pointers only move forward → O(n) amortized.

```ts
// Longest substring without repeating characters — O(n).
const seen = new Set<string>();
let left = 0, best = 0;
for (let right = 0; right < s.length; right++) {
  while (seen.has(s[right])) seen.delete(s[left++]);  // shrink until valid
  seen.add(s[right]);
  best = Math.max(best, right - left + 1);
}
```

**Kadane's** (Max Subarray, LC53) is the degenerate cousin — one running value, one decision per element: *extend the streak or start fresh:* `current = max(x, current + x)`.

**Pitfalls.**
- The window trick needs a *monotonic-ish* condition: adding an element must only make it "more violated". With negative numbers, sum-based windows break → switch to **Prefix Sum + Hash Map** (see `longestSubarrayWithSumK`).
- Initialize Kadane with `nums[0]`, not `0` (all-negative arrays).

**In this repo:** [`src/problems/SlidingWindow/`](src/problems/SlidingWindow/README.md) — `fixedSizeSlidingWindow.ts`, `variableSizeSlidingWindow.ts`, `kadaneMaxSubarray.ts` (O(n³)→O(n²)→O(n) progression).

---

## 5. Hash Map / Set

**Essence.** Trade O(n) space for O(1) recall. A Set answers *"have I seen X?"*; a Map answers *"what do I know about X?"* (its index, count, last position, prefix-sum frequency).

**Recognize it:** complements, duplicates, grouping, frequencies, "first unique", caches.

**Incremental build — Two Sum (unsorted):**

```ts
// Move 1 — brute force: for each element, rescan for its complement. O(n²).
// Move 2 — the waste: the rescan rediscovers elements we already walked past.
// Move 3 — remember them. One pass, O(n):
const seen = new Map<number, number>();          // value → index
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need)!, i];
  seen.set(nums[i], i);
}
```

**The grouping variant** — design a *canonical key* so equal-by-property items collide: Group Anagrams keys by sorted letters (O(K log K)) or, better, by the 26-char count signature (O(K)).

**The frequency-counter variant** — count first, answer second. Critical detail: exact multiset comparisons must **decrement** (existence checks alone pass `'ab'` vs `'aa'` — a real bug found in this repo's legacy code).

**Prefix Sum + Map** — the advanced move: store how often each running sum has occurred; then "subarrays summing to k" = lookups of `runningSum − k`. Works where sliding windows can't (negative numbers).

**Pitfalls.**
- Plain-object keys coerce to strings — use `Map`/`Set` for numeric data.
- Bijective mapping problems (Word Pattern, Isomorphic Strings) need maps in **both** directions.

**In this repo:** [`src/problems/HashMap/`](src/problems/HashMap/README.md) — `hashSetPatterns.ts`, `hashMapPatterns.ts`, flagships `groupAnagrams.ts` & `topKFrequent.ts`, `frequencyCounter.ts`, `longestConsecutive.ts`.

---

## 6. Binary Search

**Essence.** If one O(1) check at the midpoint tells you which half holds the answer, you never look at the other half. Requirement: **monotonicity**, not "a sorted array".

**Recognize it:** sorted input; but also *"minimum/maximum X such that condition(X)"* with no array in sight — if `condition` flips once from false to true as X grows, binary-search X itself.

**Incremental build — the three levels:**

```ts
// Level 1 — exact match. O(log n).
let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (a[mid] === target) return mid;
  a[mid] < target ? (lo = mid + 1) : (hi = mid - 1);
}
return -1;
```

```ts
// Level 2 — boundary (first index where condition holds). Template to memorize:
let lo = 0, hi = n;                    // hi = n: "not found" lands past the end
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  if (condition(a[mid])) hi = mid;     // mid might be the answer — keep it in range
  else lo = mid + 1;                   // mid is definitely not — discard it
}
return lo;                             // first index satisfying condition
```

```ts
// Level 3 — search on the ANSWER (Koko eating bananas, ship capacity):
// candidates = possible answers; feasible(x) is monotonic ("if speed x works, x+1 works")
let lo = minAnswer, hi = maxAnswer;
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  feasible(mid) ? (hi = mid) : (lo = mid + 1);
}
return lo;                             // minimum feasible answer
```

**Pitfalls.**
- Mixing the templates causes the classic infinite loop / off-by-one. Pick by question: *exact* → `lo <= hi` with `±1` on both sides; *boundary/answer* → `lo < hi`, only `lo = mid + 1` moves past mid.
- LC74 vs LC240: "matrix flattens to one sorted array" (binary search the flat index) vs "rows and columns sorted independently" (staircase from a corner). The wrong test data for exactly this confusion was found and fixed here.

**In this repo:** [`src/problems/BinarySearch/binarySearchPatterns.ts`](src/problems/BinarySearch/binarySearchPatterns.ts) — 12+ functions across all three levels.

---

## 7. Fast & Slow Pointers (Floyd's)

**Essence.** Cycle questions without memory: a 2× pointer must lap a 1× pointer inside a loop. No Set of visited nodes needed — O(1) space.

**Recognize it:** linked list + cycle/middle/nth-from-end/palindrome; or any sequence defined by "follow the value as the next position" (happy numbers, `nums[i]` as pointer — the array is an *implicit* linked list).

**Incremental build — Detect a cycle:**

```ts
// Move 1 — brute force: Set of visited nodes. O(n) space.
// Move 2 — the waste: memory used only to detect revisiting.
// Move 3 — a second pointer proves revisiting by catching up. O(1) space:
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow!.next;
  fast = fast.next.next;
  if (slow === fast) return true;      // lapped ⇒ cycle
}
return false;
```

**The two famous extensions:**
- **Cycle start (LC142):** after meeting, reset one pointer to head; advance both by 1; they meet exactly at the cycle entrance. (Why: head→entrance distance ≡ meeting→entrance distance, mod cycle length.)
- **Middle in one pass:** when `fast` hits the end, `slow` is at the middle — no length-counting first pass.

**Pitfalls.**
- Guard `fast && fast.next` before double-stepping.
- Circular-array loops (LC457) additionally require *same direction throughout* and *length > 1* — a subtle spec; the buggy shortcut version here reported phantom cycles until rewritten.

**In this repo:** [`src/problems/FastSlowPointers/fastSlowPointers.ts`](src/problems/FastSlowPointers/fastSlowPointers.ts).

---

## 8. Cyclic Sort

**Essence.** When values are `1..n`, a value **is** its own address (`v` belongs at index `v−1`). Swap everything home in one pass; the slots that still disagree reveal the missing/duplicated values.

**Recognize it:** "array contains numbers from 1 to n (or 0 to n)" + missing / duplicate / first-missing-positive. The **range constraint is the giveaway** — without it, this pattern doesn't apply.

**Incremental build — Find the Missing Number(s):**

```ts
// Move 1 — brute force: sort (O(n log n)) or a Set (O(n) extra space).
// Move 2 — the waste: comparison sorting ignores that values ARE indices.
// Move 3 — cyclic sort: place each value at index value−1. O(n) time, O(1) space:
let i = 0;
while (i < n) {
  const home = nums[i] - 1;                       // where nums[i] belongs
  if (nums[i] >= 1 && nums[i] <= n && nums[i] !== nums[home]) {
    [nums[i], nums[home]] = [nums[home], nums[i]]; // send it home; don't advance
  } else i++;                                      // already home (or out of range)
}
// Second pass: index i without value i+1 ⇒ i+1 is missing.
```

**Why it's O(n) despite the nested look:** every swap puts at least one element in its final home permanently — at most n swaps total. Say this amortized argument out loud; it's the interview point.

**In this repo:** [`src/problems/CyclicSort/cyclicSort.ts`](src/problems/CyclicSort/cyclicSort.ts) — missing, duplicates, findErrorNums, first-missing-positive. The Set-based alternates live in HashMap (`missingNumberSet`, …) for comparison.

---

## 9. Merge Intervals

**Essence.** Sort by start; then overlaps are only ever **adjacent**, so one linear sweep with a running "current merged block" settles everything.

**Recognize it:** meetings, bookings, ranges, "merge", "conflicts", "rooms needed", "free time".

**Incremental build — Merge Overlapping Intervals:**

```ts
// Move 1 — brute force: compare every pair for overlap, union-find style merging. O(n²).
// Move 2 — the waste: after sorting by start, an interval can only extend
//          the block right before it — later blocks start even further right.
// Move 3 — sort + sweep. O(n log n):
intervals.sort((a, b) => a[0] - b[0]);
const merged = [intervals[0]];
for (const [start, end] of intervals.slice(1)) {
  const last = merged[merged.length - 1];
  if (start <= last[1]) last[1] = Math.max(last[1], end);  // overlap → extend
  else merged.push([start, end]);                          // gap → new block
}
```

**The two checks to memorize** (closed intervals): overlap ⇔ `a.start <= b.end && b.start <= a.end`; merge = `[min(starts), max(ends)]`.

**The counting variant** (min meeting rooms / train platforms): sort **starts and ends separately**, sweep chronologically, `+1` on a start, `−1` on an end; the running maximum is the answer.

**Pitfalls.**
- Ask whether touching endpoints count: `[1,5]` and `[5,8]` overlap for LC56/986 (closed), but a meeting ending at 5 usually doesn't block one starting at 5. Two wrong tests in this repo came from exactly this ambiguity.

**In this repo:** [`src/problems/MergeIntervals/mergeIntervals.ts`](src/problems/MergeIntervals/mergeIntervals.ts) — merge, insert, intersections, rooms, platforms, free time, covered intervals.

---

## 10. Trees — DFS & BFS

**Essence.** Two skeletons cover nearly everything:
- **DFS (recursion):** the answer for a node = combine the answers of its subtrees. Pre/in/post-order is just *where the work sits* relative to the two recursive calls.
- **BFS (queue):** process level by level.

**Recognize it:** "level / depth / nearest / by rows" → BFS. "Path / sum / validate / lowest common ancestor" → DFS. **BST mentioned? In-order traversal visits values in sorted order** — the single most-used BST fact.

**Incremental build — the optimization move for trees isn't complexity, it's *not re-traversing*:**

```ts
// Balanced tree check.
// Move 1 — naive: for each node compute height (O(n)) then recurse → O(n²).
// Move 2 — the waste: height is recomputed for every ancestor.
// Move 3 — one post-order pass returns height AND balance together. O(n):
function check(node: TreeNode | null): number {   // height, or -1 = "unbalanced"
  if (!node) return 0;
  const l = check(node.left);  if (l === -1) return -1;
  const r = check(node.right); if (r === -1) return -1;
  return Math.abs(l - r) > 1 ? -1 : 1 + Math.max(l, r);
}
```

*"Can one pass carry more information up?"* is the tree-optimization question.

**BFS template:**

```ts
const queue = [root];
while (queue.length) {
  const levelSize = queue.length;                 // freeze the level boundary
  for (let i = 0; i < levelSize; i++) {
    const node = queue.shift()!;
    // process node — last node of the loop = right-side view, etc.
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
```

**In this repo:** [`src/problems/TreeTraversal/treePatterns.ts`](src/problems/TreeTraversal/treePatterns.ts); classic implementations in [`DataStructures/Tree/`](../DataStructures/Tree/).

---

## 11. Grids & Graphs — DFS, BFS, Topological Sort

**Essence.** A grid **is** a graph: each cell a node, each neighbor an edge. Mark visited (or sink cells in place) and each cell is processed once → O(m·n).

**Recognize it:** islands / regions / flood fill → DFS per component. "Minimum time to spread / infect / rot" → **multi-source BFS** (seed *all* sources at level 0; the number of waves is the answer). "Prerequisites / build order" → **topological sort**.

**Incremental build — Number of Islands:**

```ts
// Move 2 — the waste (skipping Move 1: without visited-marking, DFS re-explores
//          shared cells exponentially).
// Move 3 — sink what you count. Each cell visited once. O(m·n):
function numIslands(grid: string[][]): number {
  let count = 0;
  const sink = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== "1") return;
    grid[r][c] = "0";                              // mark visited by sinking
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === "1") { count++; sink(r, c); }
  return count;
}
```

**Border-first inversion** (Surrounded Regions, Pacific-Atlantic): instead of asking "can this cell escape?" for every cell (O((mn)²)), start from the border and mark what's *reachable* (O(mn)). Inverting the traversal direction is the insight.

**Topological sort (Kahn's)** — dependency ordering in O(V+E): repeatedly take a node with indegree 0, decrement its neighbors. If you can't consume every node, there's a cycle (Course Schedule = "is a valid order possible?").

**In this repo:** [`src/problems/IslandsMatrix/`](src/problems/IslandsMatrix/README.md) (grid work incl. multi-source BFS virus spread) and [`src/problems/Graph/graphPatterns.ts`](src/problems/Graph/graphPatterns.ts) (adjacency lists, BFS/DFS, topological sort, Course Schedule, connected components).

---

## 11.5 Union-Find (Disjoint Set Union)

**Essence.** The other tool for "who is connected to whom." Each group is a tree named by its root; two elements are connected iff they share a root. `union` points one root at the other. Two optimizations keep trees nearly flat → ~O(α(n)) ≈ O(1) per op.

**Recognize it:** "connected components", "cycle in an UNDIRECTED graph", or edges that **arrive over time** (DFS/BFS want the whole graph up front; DSU merges incrementally).

**Incremental build:**

```
Step 1 — Naive: parent[] pointers, find() walks to the root.        find O(n) worst
Step 2 — Path compression: on find(), re-point the whole path
         straight at the root ("flatten as you go").                 ~O(log n)
Step 3 — Union by rank: attach the shorter tree under the taller.    ~O(α(n)) ≈ O(1)
```

```ts
// Core of the optimized version (see unionFind.ts for the full class):
find(x) { let r = x; while (parent[r] !== r) r = parent[r];        // find root
          while (parent[x] !== r) { const n = parent[x]; parent[x] = r; x = n; } // compress
          return r; }
union(a, b) { const ra = find(a), rb = find(b); if (ra === rb) return false;
              /* attach shorter under taller by rank */ count--; return true; }
```

**The two payoffs:** `count` (components remaining) powers "number of connected components"; a `union` that returns false means both endpoints were already connected — i.e. this edge closes a **cycle** (the accept/reject test in Kruskal's MST).

**Pitfall.** Directed-graph cycle detection is NOT union-find — use DFS colors or Kahn's topo sort.

**In this repo:** [`src/problems/UnionFind/unionFind.ts`](src/problems/UnionFind/unionFind.ts) — naive → compressed+ranked, plus `countComponentsUnionFind` and `hasCycleUndirected`.

---

## 12. Heap / Top-K

**Essence.** You rarely need a full ordering — only "the best k so far." A min-heap capped at size k evicts the smallest whenever it grows past k, so exactly the k largest survive. O(n log k) beats O(n log n) whenever k ≪ n.

**Incremental build — Kth Largest / Top-K Frequent:**

```
Move 1 — sort everything, take the top k.            O(n log n)
Move 2 — the waste: fully ordering elements you'll discard.
Move 3 — min-heap of size k.                          O(n log k)
Move 4 (when the key is bounded) — bucket sort:       O(n)
        frequencies can't exceed n → bucket[freq] = values; walk buckets high→low.
Alt    — QuickSelect for k-th element:                O(n) average, in place.
```

**Heap mechanics to be fluent in** (array-backed): `parent(i) = ⌊(i−1)/2⌋`, `left = 2i+1`, `right = 2i+2`; insert = push + bubble-up; extract = swap-root-with-last, pop, sink-down. Both O(log n).

**In this repo:** [`DataStructures/Heap/Max_binary_heap.js`](../DataStructures/Heap/Max_binary_heap.js) (a gold-standard reference file), [`src/problems/Arrays/kthLargest.js`](src/problems/Arrays/kthLargest.js) (QuickSelect vs heap — the other gold standard), [`src/problems/HashMap/topKFrequent.ts`](src/problems/HashMap/topKFrequent.ts) (sort → heap → bucket progression).

---

## 13. Backtracking

**Essence.** Systematic exhaustive search as a recursion tree: **choose → explore → un-choose**. You can't write nested loops when the depth is variable — recursion *is* the variable-depth loop. The optimization is never asymptotic; it's **pruning** branches that can't succeed, as early as possible.

**Incremental build — Subsets:**

```ts
// Move 1 — "brute force" for k nested levels is k nested loops — impossible
//          when depth varies. Recursion generalizes the nesting.
// Move 3 — the template. Every backtracking problem is this shape:
function subsets(nums: number[]): number[][] {
  const result: number[][] = [], path: number[] = [];
  function backtrack(start: number): void {
    result.push([...path]);                       // record current state (copy!)
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                         // choose
      backtrack(i + 1);                           // explore (start=i+1: no reuse)
      path.pop();                                 // un-choose — restore state
    }
  }
  backtrack(0);
  return result;
}
```

**Dial the template:**
- **Permutations**: loop from 0 with a `used[]` array instead of `start`.
- **Combination Sum** (reuse allowed): recurse with `i`, not `i + 1`; prune when the remaining target < 0 — and sort first so you can `break` (not `continue`) at the first overshoot.
- **Duplicates in input**: sort, then skip `nums[i] === nums[i-1]` at the same depth.

**Pitfalls.**
- Push a **copy** (`[...path]`) — pushing the reference records a future-mutated array.
- Forgetting the `pop()` corrupts every sibling branch.

**In this repo:** [`src/problems/Backtracking/backtrackingPatterns.ts`](src/problems/Backtracking/backtrackingPatterns.ts) — subsets, permutations, combination sum, phone-letter combinations, with pruning notes.

---

## 14. Dynamic Programming

**Essence.** Recursion where subproblems **overlap** → remember answers. Two mechanical steps turn brute force into DP: memoize the recursion (top-down), or fill a table in dependency order (bottom-up). The real work is defining the **state**.

**Incremental build — the canonical ladder (Climbing Stairs / Fibonacci):**

```ts
// Move 1 — brute force recursion. O(2ⁿ): ways(n) = ways(n-1) + ways(n-2)
// Move 2 — the waste: ways(3) is recomputed exponentially many times.
// Move 3a — memoize (top-down): same recursion + a cache. O(n).
const memo = new Map<number, number>();
function ways(n: number): number {
  if (n <= 2) return n;
  if (!memo.has(n)) memo.set(n, ways(n - 1) + ways(n - 2));
  return memo.get(n)!;
}
// Move 3b — tabulate (bottom-up), then notice you only read two cells back:
let [a, b] = [1, 2];
for (let i = 3; i <= n; i++) [a, b] = [b, a + b];   // O(1) space
```

**The state-design questions:** *What choice do I make at each step? What's the minimal information the future needs about the past?* That information is your DP state.

**The sub-families** (full cheat sheet: [`DP_Patterns_Cheat_Sheet.md`](DP_Patterns_Cheat_Sheet.md)):

| Family | Recurrence shape | Canonical problems |
|---|---|---|
| Linear | `dp[i] ← dp[i-1], dp[i-2]` | Climb Stairs, House Robber (`rob`) |
| Unbounded choice | `dp[amount] ← dp[amount - coin]` | Coin Change |
| Subsequence | `dp[i] ← best dp[j] for j < i` | Longest Increasing Subsequence |
| Two sequences (2D) | `dp[i][j] ← diagonal / left / top` | LCS, Edit Distance ([`TwoSequencesDP/`](src/problems/DynamicProgramming/TwoSequencesDP/README.md)) |
| Grid paths | `dp[r][c] ← dp[r-1][c] + dp[r][c-1]` | Unique Paths |
| State machine | one variable per state, transitions per element | Stock problems with cooldown/fee ([`bestTimeToBuySell.ts`](src/problems/2Pointers/bestTimeToBuySell.ts) variations 3–6) |

**Pitfalls.**
- "Subsequence" (non-contiguous) vs "subarray" (contiguous — often Kadane, not DP tables).
- 2D DP: get the empty-prefix row/column (index 0 = empty string) right first; off-by-ones die there.
- Top-down is faster to write correctly in interviews; mention the bottom-up + rolling-array space optimization as the follow-up.

**In this repo:** [`src/problems/DynamicProgramming/`](src/problems/DynamicProgramming/README.md) — `dpPatterns.ts` (18 problems), `TwoSequencesDP/`, plus first-attempt `.js` studies.

---

## 15. Revision Drills

**Drill 1 — 30-second pattern ID.** Cover the right column; name pattern + complexity from the cue:

| Cue | Answer |
|---|---|
| "Longest substring with at most 2 distinct chars" | Variable sliding window, O(n) |
| "Array of 1..n, one number appears twice, one missing" | Cyclic sort (findErrorNums), O(n)/O(1) |
| "Is this linked list a palindrome, O(1) space?" | Fast/slow to middle + reverse half + compare |
| "Min speed to finish bananas in h hours" | Binary search on the answer |
| "All phone-keypad letter combinations" | Backtracking |
| "Can all courses be finished given prerequisites?" | Topological sort / cycle detection |
| "K closest points to origin" | Max-heap of size k (or QuickSelect) |
| "Count subarrays summing to k, negatives allowed" | Prefix sum + hash map (window fails here) |
| "Min platforms so no train waits" | Sort starts/ends separately + sweep counter |
| "Edit distance between two words" | Two-sequence 2D DP |

**Drill 2 — say the waste.** For any solved problem, state in one sentence what the brute force recomputes and which structure remembers it. If you can't, re-read that pattern's section.

**Drill 3 — cross-check habit.** When you keep multiple approaches to one problem, test them against each other on random inputs. Several real bugs in this repo (palindrome case-sensitivity, sumZero duplicates, order-scrambling partitions) survived for months because approaches were only ever tested against hand-picked examples — and were found the day the approaches were compared.

---

## 16. JS/TS idioms that bite in interviews

```ts
[3, 20, 100].sort();                 // [100, 20, 3] — LEXICOGRAPHIC. Always pass (a, b) => a - b.
const m = new Map<number, string>(); // Use Map/Set for numeric keys — object keys coerce to strings.
(-7 % 3);                            // -1, not 2. Safe wrap: ((i % n) + n) % n  (see circularArrayLoop).
queue.shift();                       // O(n) on arrays — fine for interviews; mention a real deque for production.
result.push([...path]);              // push a COPY in backtracking; the reference will mutate.
const mid = (lo + hi) >> 1;          // fine in JS (no 32-bit overflow worry for sane sizes).
```

---

*Companion docs: [`DSA_Essential_Patterns_Guide.md`](DSA_Essential_Patterns_Guide.md) (company frequency + roadmaps) · [`DP_Patterns_Cheat_Sheet.md`](DP_Patterns_Cheat_Sheet.md) (deep DP) · [`PROBLEM_INDEX.md`](PROBLEM_INDEX.md) (file-by-file index) · per-folder READMEs for each pattern.*

*Last updated: 2026-07-07 · All linked implementations verified by the test suite (600+ tests green).*
