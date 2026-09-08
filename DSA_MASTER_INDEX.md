# DSA Master Index — every pattern, both tracks, and the honest gaps

*The one page that tells you what exists, what does not, and what order to work
through it. Two language tracks: **Go** (`Go/`) and **TypeScript**
(`DSA_ProblemSolving_patterns/src/problems/`).*

---

## How this index was verified

Two different levels of confidence, and they are not the same — treat the
columns accordingly:

| Column | How it was checked | Confidence |
|---|---|---|
| **Go** | Function-level. Every entry is a named function with a passing test. `cd Go && go test ./...` → 26 packages, 267 functions, 337 tests. | High |
| **TS** | Folder- and spot-check level: the folder exists and named functions were grepped. I did **not** re-verify every TypeScript function against its tests in this pass. | Moderate |
| **Gaps** | Grepped the whole repo for each pattern's canonical function names, then opened the hits to separate real implementations from comment mentions. | High |

Where a "hit" turned out to be only a comment, it is listed as **missing** — for
example Kruskal's MST and segment trees are *mentioned* in
`UnionFind/unionFind.ts` and `Arrays/productExceptSelf.ts` but not implemented.

**Legend:** ✅ implemented & tested · 🟡 partial or one track only · 📦 exists
only as older untested JavaScript · ❌ missing from both tracks

---

## Part 1 — The complete pattern taxonomy

Ordered by the learning ladder, not alphabetically. Each tier depends on the one
above it.

### Tier 1 — Linear scans (remember something as you go)

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 1 | Hash Map / Set | ✅ | ✅ | [Go/hashmap/](Go/hashmap/) · `HashMap/` |
| 2 | Frequency counting / bucketing | ✅ | ✅ | `hashmap.TopKFrequent` · `HashMap/topKFrequent.ts` |
| 3 | Prefix Sum | ✅ | 🟡 | [Go/prefixsum/](Go/prefixsum/) · TS has it scattered in `SlidingWindow/`+`HashMap/`, no dedicated module |
| 4 | **Difference Array** (range update, point query) | ❌ | ❌ | — *see gap A3* |
| 5 | Two Pointers (3 sub-shapes) | ✅ | ✅ | [Go/twopointers/](Go/twopointers/) · `2Pointers/` |
| 6 | Sliding Window (fixed + variable) | ✅ | ✅ | [Go/slidingwindow/](Go/slidingwindow/) · `SlidingWindow/` |
| 7 | Kadane / running-value DP | ✅ | ✅ | `slidingwindow.MaxSubarray` · `SlidingWindow/kadaneMaxSubarray.ts` |

### Tier 2 — Exploit order

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 8 | Binary Search on data | ✅ | ✅ | [Go/binarysearch/](Go/binarysearch/) · `BinarySearch/` |
| 9 | Binary Search on the **answer** | ✅ | 🟡 | `binarysearch.MinEatingSpeed` · TS has `minEatingSpeed` in `binarySearchPatterns.ts` |
| 10 | Lower/upper bound templates | ✅ | 🟡 | `binarysearch.LowerBound`/`UpperBound` |
| 11 | Stack (matching, evaluation) | ✅ | 🟡 | [Go/stack/](Go/stack/) · TS only `easy/validParenthesis_STACK.ts` |
| 12 | **Monotonic Stack** (next greater, histogram) | ✅ | ✅ | `stack.DailyTemperatures`, `LargestRectangleArea` · TS [`Stack/stackPatterns.ts`](DSA_ProblemSolving_patterns/src/problems/Stack/stackPatterns.ts) |
| 13 | Monotonic Deque (window max) | ✅ | 🟡 | `slidingwindow.MaxSlidingWindow` |
| 14 | Fast & Slow Pointers (Floyd) | ✅ | ✅ | [Go/linkedlist/](Go/linkedlist/) · `FastSlowPointers/` |
| 15 | Linked-list rewiring | ✅ | ✅ | [Go/linkedlist/](Go/linkedlist/) · `DataStructures/LinkedList/` 📦 |
| 16 | Merge Intervals / sweep | ✅ | ✅ | [Go/intervals/](Go/intervals/) · `MergeIntervals/` |
| 17 | Cyclic Sort / index-as-hash | ✅ | ✅ | [Go/cyclicsort/](Go/cyclicsort/) · `CyclicSort/` |

### Tier 3 — Structures

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 18 | Heap / Top-K | ✅ | 🟡 | [Go/heaptopk/](Go/heaptopk/) · TS has `topKFrequentHeap/Sort/BucketSort` but no reusable heap type — only `DataStructures/Heap/` 📦 |
| 19 | QuickSelect | ✅ | 🟡 | `heaptopk.FindKthLargestQuickSelect` · `Arrays/kthLargest.js` 📦 |
| 20 | Two Heaps (streaming median) | ✅ | ✅ | `heaptopk.MedianFinder` · TS [`Heap/heapPatterns.ts`](DSA_ProblemSolving_patterns/src/problems/Heap/heapPatterns.ts) (`MedianFinder`, plus a reusable `PriorityQueue`) |
| 21 | Tree DFS (combine subtree answers) | ✅ | ✅ | [Go/trees/](Go/trees/) · `TreeTraversal/` |
| 22 | Tree BFS (levels) | ✅ | ✅ | `trees.LevelOrder` · `TreeTraversal/treePatterns.ts` |
| 23 | BST properties | ✅ | ✅ | `trees.IsValidBST`, `KthSmallest` · `DataStructures/Tree/` 📦 |
| 24 | Trie | ✅ | ✅ | [Go/trie/](Go/trie/) · TS [`Trie/triePatterns.ts`](DSA_ProblemSolving_patterns/src/problems/Trie/triePatterns.ts) (LC208/211/212) |
| 25 | Design / composition (LRU, TimeMap) | ✅ | 🟡 | [Go/design/](Go/design/) · `HashMap/hashMapPatterns.ts`, `DataStructures/LRUCache/` 📦 |

### Tier 4 — Graphs

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 26 | Grid DFS (islands, regions) | ✅ | ✅ | [Go/graphs/](Go/graphs/) · `IslandsMatrix/`, `Graph/` |
| 27 | Multi-source BFS | ✅ | ✅ | `graphs.OrangesRotting`, `WallsAndGates` · TS `minTimeToInfectAll` |
| 28 | Reverse-thinking grid search | ✅ | ✅ | `graphs.PacificAtlantic`, `SolveSurroundedRegions` · TS `pacificAtlantic`, `solve` |
| 29 | Graph clone / adjacency traversal | ✅ | ❌ | `graphs.CloneGraph` — *no TS equivalent* |
| 30 | Topological Sort (Kahn) | ✅ | ✅ | [Go/toposort/](Go/toposort/) · `Graph/graphPatterns.ts` |
| 31 | Union-Find (DSU) | ✅ | ✅ | [Go/unionfind/](Go/unionfind/) · `UnionFind/` |
| 32 | Dijkstra (weighted shortest path) | ✅ | ❌ | [Go/shortestpath/](Go/shortestpath/) — *no TS equivalent* |
| 33 | Bellman-Ford (k-edge constraint) | ✅ | ❌ | `shortestpath.FindCheapestPrice` |
| 34 | **Bipartite check / 2-colouring** | ❌ | ❌ | — *see gap A1* |
| 35 | **MST — Kruskal / Prim** | ❌ | ❌ | — *see gap A2* (only comment mentions today) |
| 36 | **Eulerian path (Hierholzer)** | ❌ | ❌ | — *see gap A9* |

### Tier 5 — Choice under constraint

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 37 | Backtracking (subsets/permutations) | ✅ | ✅ | [Go/backtracking/](Go/backtracking/) · `Backtracking/` |
| 38 | Backtracking on a grid | ✅ | 🟡 | `backtracking.Exist`, `trie.FindWords` |
| 39 | Constraint placement (N-Queens) | ✅ | ❌ | `backtracking.SolveNQueens` — *no TS equivalent* |
| 40 | DP 1D | ✅ | ✅ | [Go/dp/](Go/dp/) · `DynamicProgramming/` |
| 41 | DP 2D / two-sequence | ✅ | ✅ | `dp.LongestCommonSubsequence`, `MinDistance` · `DynamicProgramming/TwoSequencesDP/` |
| 42 | Knapsack (0/1 vs unbounded) | ✅ | ✅ | `dp.CanPartition` vs `dp.CoinChange2` |
| 43 | State-machine DP | ✅ | 🟡 | `dp.MaxProfitCooldown` |
| 44 | **DFS + memo on a grid/graph** | ❌ | ❌ | — *see gap A6* |
| 45 | **Interval DP** | ❌ | ❌ | — *see gap B5* |
| 46 | **Bitmask DP** | ❌ | ❌ | — *see gap B4* |
| 47 | Greedy (jumps, fuel, coverage) | ✅ | 🟡 | [Go/greedy/](Go/greedy/) · `canJump` lives in `dpPatterns.ts` |

### Tier 6 — Standalone toolkit

| # | Pattern | Go | TS | Where |
|---|---|:--:|:--:|---|
| 48 | Bit manipulation | ✅ | 🟡 | [Go/mathbits/](Go/mathbits/) · `HashMap/hashSetPatterns.ts` has `singleNumber` only |
| 49 | Matrix transforms (rotate/spiral/zeroes) | ✅ | ✅ | [Go/matrix/](Go/matrix/) · `Arrays/arrayPatternProblems.ts` — `rotateMatrix90`, `spiralOrder`, `setZeroes` |
| 50 | Math: primes, GCD, fast power | 🟡 | 🟡 | `mathbits.MyPow` · `Misc/superPrime.ts`, `easy/GCD_of_strings.ts` |
| 51 | **Boyer-Moore majority vote** | ❌ | ❌ | — *see gap A4* |
| 52 | **String matching (KMP / Rabin-Karp)** | ❌ | ❌ | — *see gap A5* |
| 53 | **Randomised (shuffle, reservoir)** | ❌ | ❌ | — *see gap A7* |
| 54 | **Sorting algorithms as algorithms** | ❌ | 🟡 | Only `Sorting/bubbleSort.js` 📦; merge sort is buried inside `countInversions` |
| 55 | **Segment Tree / Fenwick (BIT)** | ❌ | ❌ | — *see gap B1* |

---

## Part 2 — The gaps, in priority order

### Tier A — close these before interviewing (9 gaps, all missing from both tracks)

| # | Gap | Canonical problems | Why it matters | Effort |
|---|---|---|---|---|
| **A1** | Bipartite check / graph 2-colouring | LC785, LC886 | The standard "can you colour this graph" question; a BFS you already know with one extra array | Small |
| **A2** | MST — Kruskal | LC1584 Min Cost to Connect All Points | Sort edges + the DSU **already built** in `Go/unionfind/`. Highest value per line of code here | Small |
| **A3** | Difference array | LC1109, LC1094 | The exact complement of prefix sum (range **update**, point query) — it belongs next to §4.2 pedagogically | Small |
| **A4** | Boyer-Moore majority vote | LC169, LC229 | A classic O(1)-space trick that people either know or do not | Small |
| **A5** | String matching: KMP + Rabin-Karp | LC28 follow-up, LC187, LC1044 | `findSubstring.ts` *mentions* KMP without implementing it. Rolling hash is the reusable half | Medium |
| **A6** | DFS + memo on a grid | LC329 Longest Increasing Path | The bridge between graph traversal and DP — a genuinely distinct pattern, not covered by either | Medium |
| **A7** | Fisher-Yates shuffle, reservoir sampling | LC384, LC382 | The whole "randomised algorithms" section is absent | Small |
| **A8** | Sorting algorithms proper | LC148 Sort List, LC912 | Merge sort on a linked list is common; "which sorts are stable?" is asked verbally. The repo has only bubble sort | Medium |
| **A9** | Eulerian path (Hierholzer) | LC332 Reconstruct Itinerary | The one graph traversal whose shape is not DFS/BFS/topo | Medium |

### Tier A′ — track imbalances (the pattern exists, but only on one side)

| Missing from | What | Note |
|---|---|---|
| **Go** | `LowestCommonAncestor` for a **general binary tree** (LC236) | Go has only the BST variant. **LC236 is in Blind 75** — correcting my own claim from the previous session, where I listed the Blind 75 gaps but omitted this one |
| **Go** | RandomizedSet (LC380), `nextPermutation` (LC31), `countInversions` | All three exist in `Arrays/arrayPatternProblems.ts` |
| **TS** | Dijkstra/Bellman-Ford/MST, TimeMap, LFU, and two backtracking problems (N-Queens, Palindrome Partitioning) | Each exists and is tested on the Go side. Closed since this table was written: Trie, monotonic stack, two-heaps median, Clone Graph, Generate Parentheses, Word Search, bit manipulation, merge-k-lists, Set Matrix Zeroes |

### Tier B — senior / less frequent (worth knowing, not urgent)

| # | Gap | Problems | When it shows up |
|---|---|---|---|
| B1 | Segment Tree / Fenwick (BIT) | LC307, LC315 | Range query **with updates**. Only a comment mention today |
| B2 | LFU Cache | LC460 | The follow-up after LRU |
| B3 | XOR trie | LC421 Maximum XOR | Trie applied to bits |
| B4 | Bitmask DP | LC698, LC1494 | Small-n subset states |
| B5 | Interval DP | LC312 Burst Balloons, LC1039 | "Solve inner ranges first" |
| B6 | Floyd-Warshall (all-pairs) | LC1334 | When V is small and you need every pair |
| B7 | Line sweep beyond intervals | LC218 Skyline | Sweep + heap combined |
| B8 | Digit DP | counting numbers with a property | Rare outside competitive programming |

### Tier C — deliberately out of scope

Suffix arrays/automata, heavy-light decomposition, max-flow (Dinic/Edmonds-Karp),
A*, persistent data structures, treaps/skip lists, meet-in-the-middle, matrix
exponentiation.

**Why:** these effectively never appear in product/platform engineering
interviews. If you are targeting competitive programming or a specialised
systems role, that changes — but adding them now would dilute the ladder.

---

## Part 3 — Follow-along order

Do not go top to bottom of Part 1. Follow the dependency order — each step only
uses things you already have.

```
STEP 1  Foundations        Hash Map -> Prefix Sum -> Two Pointers -> Sliding Window
        You can now solve roughly a third of Blind 75.

STEP 2  Order              Binary Search (data, then ANSWER) -> Monotonic Stack
        Add gap A4 (majority vote) here — it is a one-pass trick that fits.

STEP 3  Sequences          Fast & Slow -> Linked List rewiring -> Intervals -> Cyclic Sort
        Add gap A8 (merge sort, on a linked list) here — it reuses the merge you
        already wrote for LC21.

STEP 4  Structures         Heap/Top-K -> QuickSelect -> Two Heaps -> Trees -> Trie -> Design
        Add gap A′ (LC236 general LCA) here, right after tree DFS.

STEP 5  Graphs             Grid DFS -> Multi-source BFS -> Topological Sort -> Union-Find -> Dijkstra
        Add gaps A1 (bipartite) and A2 (Kruskal) here — bipartite is a BFS
        variant, Kruskal is DSU + a sort. Both are cheap once this step is done.

STEP 6  Choice             Backtracking -> DP 1D -> DP 2D -> Knapsack -> State machine -> Greedy
        Add gap A6 (DFS + memo on a grid) here — it needs both graphs and DP.

STEP 7  Toolkit            Bits -> Matrix -> Math -> gaps A3, A5, A7
        Independent of everything else; slot in wherever convenient.
```

**Rule of thumb:** you are ready for the next step when you can write the
previous step's *template* from memory and state its complexity — not when you
have solved every problem in it.

---

## Part 4 — Progress checklist

Tick a pattern only when you can write its template from memory **and** say the
brute force it replaces.

**Tier 1** ☐ Hash Map ☐ Prefix Sum ☐ Difference Array *(gap)* ☐ Two Pointers ☐ Sliding Window ☐ Kadane

**Tier 2** ☐ Binary Search ☐ BS on answer ☐ Lower/Upper bound ☐ Stack ☐ Monotonic Stack ☐ Monotonic Deque ☐ Fast & Slow ☐ List rewiring ☐ Intervals ☐ Cyclic Sort

**Tier 3** ☐ Heap/Top-K ☐ QuickSelect ☐ Two Heaps ☐ Tree DFS ☐ Tree BFS ☐ BST ☐ Trie ☐ Design

**Tier 4** ☐ Grid DFS ☐ Multi-source BFS ☐ Reverse-thinking ☐ Clone Graph ☐ Topo Sort ☐ Union-Find ☐ Dijkstra ☐ Bellman-Ford ☐ Bipartite *(gap)* ☐ MST *(gap)* ☐ Euler *(gap)*

**Tier 5** ☐ Backtracking ☐ Grid backtracking ☐ N-Queens ☐ DP 1D ☐ DP 2D ☐ Knapsack ☐ State machine ☐ DFS+memo *(gap)* ☐ Greedy

**Tier 6** ☐ Bits ☐ Matrix ☐ Math ☐ Majority vote *(gap)* ☐ String matching *(gap)* ☐ Randomised *(gap)* ☐ Sorting *(gap)*

---

## Part 5 — Where everything lives

| Document | Scope |
|---|---|
| **This file** | Cross-track index + gap analysis + follow-along order |
| [Go/GO_INTERVIEW_QA.md](Go/GO_INTERVIEW_QA.md) | **Go**: Q&A per pattern, recognition table, JS→Go translation, Go gotchas |
| [Go/README.md](Go/README.md) | Go module layout and how to run the tests |
| [DSA_ProblemSolving_patterns/PATTERNS_REVISION_GUIDE.md](DSA_ProblemSolving_patterns/PATTERNS_REVISION_GUIDE.md) | **TypeScript**: the same patterns, revision format |
| [DSA_ProblemSolving_patterns/PROBLEM_INDEX.md](DSA_ProblemSolving_patterns/PROBLEM_INDEX.md) | TypeScript file-by-file index |
| [DataStructures/README.md](DataStructures/README.md) | Raw data structures (older JavaScript, mostly untested) |

**Verify the Go track:**

```bash
cd Go && go test ./... && go vet ./... && gofmt -l .
```

**Verify the TypeScript track:**

```bash
cd DSA_ProblemSolving_patterns && npm test && npx tsc --noEmit
```

---

*Last audited: 2026-08-04. The gap list was produced by grepping the repository
for each pattern's canonical function names and opening every hit to distinguish
implementations from comment mentions.*
