# Go DSA Interview Q&A

*One document to learn, revise and recall every pattern — in Go. Built as a
ladder: each tier reuses the one below it, so by the end no Blind 75 question is
a new idea, only a new combination.*

> **Every snippet in this document is copied from compiling, tested Go code.**
> The module lives beside this file. Run `cd Go && go test ./...` — 22 packages,
> 267 solution functions, 337 test functions, all passing. Where a claim is a
> judgement call rather than a fact (which approach an interviewer prefers, how
> a name is pronounced in practice), it is marked as such.

---

## How to use this document

| You have | Read |
|---|---|
| **10 minutes** before an interview | [Part 1 (the method)](#part-1--the-method-that-generates-every-pattern) + [Part 2 (recognition table)](#part-2--recognition-table-cue--pattern) + [Part 8 (Go gotchas)](#part-8--go-gotcha-cheat-sheet) |
| **60 minutes** on one weak pattern | That pattern's section: *Where it comes from → Recognise it → Template → Q&A → Pitfalls* |
| **A study session** | [Part 3 (the ladder)](#part-3--the-ladder-how-the-patterns-connect) in order, running the tests as you go |
| **Two weeks to prepare** | [Part 6 (the schedule)](#part-6--a-two-week-revision-schedule) |

Each pattern section answers the same five questions in the same order. That
repetition is deliberate: recall is easier when every entry has the same shape.

**A note on the Q&A format.** Each answer starts with the *brute force*, names
the *waste*, and only then reaches the optimal code. That is not padding — it is
the script you say out loud in an interview, and it is also how you re-derive a
solution you have half-forgotten.

---

## Part 0 — The Go layer (read this first)

You cannot practise patterns while fighting the language. Twenty minutes here
saves hours later. **If you are coming from JavaScript/TypeScript, start with
the translation table at [0.6](#06-javascript--go-translation-table).**

### 0.1 Slices — the number one source of bugs

A slice is a *header*: a pointer to a backing array, a length, and a capacity.
Copying a slice copies the header, **not the data**.

```go
a := []int{1, 2, 3}
b := a          // b and a share the SAME backing array
b[0] = 99       // a[0] is now 99 too
c := slices.Clone(a)  // an independent copy
```

Three consequences that bite in interviews:

```go
// 1. append may or may not allocate. Never rely on it either way.
//    Always assign the result back: s = append(s, x)

// 2. copy() on a [][]int is SHALLOW — the inner slices stay shared.
outer := make([][]int, len(src))
copy(outer, src)        // reordering outer is safe; writing outer[i][0] is NOT

// 3. THE BACKTRACKING KILLER: recording a slice that is still being mutated.
out = append(out, path)               // BUG: every entry aliases path
out = append(out, slices.Clone(path)) // correct
```

That third one is the single most common Go-specific interview failure. It is
why every function in [Go/backtracking/backtracking.go](Go/backtracking/backtracking.go)
clones before recording.

**The slice as a stack** (there is no stack type in Go — you do not need one):

```go
s = append(s, v)        // push
top := s[len(s)-1]      // peek — check len(s) > 0 first
s = s[:len(s)-1]        // pop
```

**The slice as a queue** — `q = q[1:]` is O(1) and idiomatic for interview code.
It never reclaims the front of the array, so a long-running service would want a
ring buffer; for a BFS over one input, `q[1:]` is correct and clear.

### 0.2 Maps

```go
m := map[string]int{}
v, ok := m["missing"]   // v == 0, ok == false — the comma-ok idiom
m["a"]++                // works on a missing key: the zero value is 0
delete(m, "a")
len(m)
```

- **Reading a missing key returns the zero value, it does not panic.** This is
  why `count[x]++` needs no initialisation, and why `SubarraySumEqualsK` can
  write `count += seen[sum-k]` with no lookup guard.
- **Iteration order is deliberately randomised.** Never assume order; if you need
  determinism (or a stable test), collect and sort.
- **The set idiom** is `map[T]struct{}` — `struct{}` occupies zero bytes:
  ```go
  seen := map[int]struct{}{}
  seen[x] = struct{}{}
  _, exists := seen[x]
  ```
  `map[T]bool` is also fine and reads better; use it when you will not be judged
  on the last byte.
- **Arrays are comparable, slices are not.** So `[26]int` can be a map key but
  `[]int` cannot. `GroupAnagrams` exploits exactly this:
  ```go
  groups := map[[26]int][]string{}   // letter tally as the key — no sorting
  ```

### 0.3 Strings, bytes and runes

```go
s := "héllo"
len(s)        // 6 — BYTES, not characters
s[0]          // a byte (uint8), not a character
s[1]          // the first byte of 'é' — meaningless on its own
for i, r := range s { }   // r is a RUNE; i skips (byte offsets, not 1,2,3…)
[]rune(s)     // allocate, but now indexable by character
```

For LeetCode-style problems constrained to ASCII, byte indexing (`s[i]`) is
correct and fastest. The moment the interviewer says "what about Unicode?",
switch to runes — that is why [Go/hashmap/hashmap.go](Go/hashmap/hashmap.go) ships
both `IsAnagram` (`[26]int`, ASCII) and `IsAnagramUnicode` (`map[rune]int`).

Building strings in a loop: use `strings.Builder`, not `+=` (which is O(n²)).

### 0.4 The standard library worth knowing

| Need | Use |
|---|---|
| sort a slice | `slices.Sort(s)` / `slices.SortFunc(s, cmp)` |
| compare | `slices.Equal`, `slices.Compare`, `cmp.Compare` |
| copy | `slices.Clone`, `slices.Reverse`, `slices.Contains` |
| binary search | `slices.BinarySearch(s, v)` or `sort.Search(n, pred)` |
| heap | `container/heap` — see [0.5](#05-containerheap-is-an-algorithm-not-a-container) |
| min / max | **built in** since Go 1.21: `min(a, b)`, `max(a, b, c)` — variadic |
| bounds | `math.MaxInt`, `math.MinInt` |

`min`/`max` being builtins removes the helper function every older Go solution
carries. Use them freely.

### 0.5 container/heap is an algorithm, not a container

You supply the storage by implementing five methods. This is the one piece of
Go boilerplate worth memorising outright:

```go
type MinIntHeap []int

func (h MinIntHeap) Len() int           { return len(h) }
func (h MinIntHeap) Less(i, j int) bool { return h[i] < h[j] }   // > for a max-heap
func (h MinIntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinIntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinIntHeap) Pop() any          { old := *h; n := len(old) - 1; x := old[n]; *h = old[:n]; return x }
```

Three rules that explain the shape:

1. `Len`/`Less`/`Swap` take **value** receivers — they only read or swap in place.
2. `Push`/`Pop` take **pointer** receivers — they change the slice **length**.
3. Call `heap.Push(h, x)` and `heap.Pop(h)`, **never** `h.Push` / `h.Pop`. Yours
   only append and truncate; the package versions also restore the heap invariant.

Flip `Less` and you have a max-heap. That single character is the whole difference.

### 0.6 JavaScript → Go translation table

| JavaScript / TypeScript | Go |
|---|---|
| `arr.push(x)` | `s = append(s, x)` |
| `arr.pop()` | `x := s[len(s)-1]; s = s[:len(s)-1]` |
| `arr.shift()` | `x := s[0]; s = s[1:]` |
| `[...arr]` | `slices.Clone(s)` |
| `arr.slice(i, j)` | `s[i:j]` — **a view, not a copy** |
| `new Set()` | `map[T]struct{}{}` |
| `set.has(x)` | `_, ok := set[x]` |
| `new Map()` | `map[K]V{}` |
| `map.get(k) ?? 0` | `m[k]` (zero value is automatic) |
| `arr.sort((a,b) => a-b)` | `slices.Sort(s)` |
| `Math.max(...arr)` | loop with `best = max(best, v)` |
| `Number.MAX_SAFE_INTEGER` | `math.MaxInt` |
| `str[i]` | `s[i]` — a **byte**, not a 1-char string |
| `str.split("")` | `[]byte(s)` or `[]rune(s)` |
| `for (const c of str)` | `for _, r := range s` (runes) |
| `s += x` in a loop | `strings.Builder` |
| truthiness | there is none — compare explicitly |

**The trap for JS developers:** in JS, `arr.slice()` copies. In Go, `s[i:j]`
does **not** — it is a window onto the same array, and writing through it is
visible to the original.

---

## Part 1 — The method that generates every pattern

Never reach for the clever solution first. Three moves, in order.

**Move 1 — write the brute force you can produce in two minutes.**
Usually nested loops or "try everything". Say its complexity out loud. This is
not wasted time: it proves you understand the problem, it earns partial credit
immediately, and it becomes your correctness oracle. Several packages here ship
the brute force alongside the optimal version (`TwoSumBrute`, `TrapBrute`,
`DailyTemperaturesBrute`, `MaxSumSubarrayKBrute`, `FindKthLargestSort`) and the
tests assert that the two agree. Do the same on paper.

**Move 2 — name the repeated work.** Point at the exact line. This one sentence
is the interview:

> *"The inner loop recomputes something the previous iteration already knew."*

**Move 3 — apply the pattern that removes exactly that waste.**

| The waste in the brute force | The pattern that removes it | Go package |
|---|---|---|
| Re-scanning for a partner / complement | Hash Map | `hashmap` |
| Re-summing an overlapping range | Sliding Window / Prefix Sum | `slidingwindow`, `prefixsum` |
| Checking pairs sortedness proves hopeless | Two Pointers | `twopointers` |
| Scanning a half that cannot hold the answer | Binary Search | `binarysearch` |
| Re-scanning forward for the next bigger element | Monotonic Stack | `stack` |
| Storing history just to detect a repeat | Fast & Slow Pointers | `linkedlist` |
| Sorting when values are their own indices | Cyclic Sort | `cyclicsort` |
| Comparing all interval pairs | Sort + one sweep | `intervals` |
| Fully sorting when only k matter | Heap of size k / bucket | `heaptopk` |
| Re-exploring visited cells or nodes | DFS/BFS + visited | `graphs` |
| Re-running a traversal after every new edge | Union-Find | `unionfind` |
| Re-solving the same subproblem | Dynamic Programming | `dp` |
| Exploring branches that cannot succeed | Backtracking + pruning | `backtracking` |

Then **verify**: dry-run the optimised version on the same example you used for
the brute force. If they disagree, the brute force is the judge.

---

## Part 2 — Recognition table (cue → pattern)

| When the problem says… | Reach for | Target | Section |
|---|---|---|---|
| "have I seen…", "group by", "count of" | Hash Map / Set | O(n) | [§4.1](#41-hash-map--set) |
| "count/longest subarray with sum k", negatives present | Prefix Sum + Hash Map | O(n) | [§4.2](#42-prefix-sum) |
| sorted array + pair/triplet with a target | Two Pointers (converging) | O(n) / O(n²) | [§4.3](#43-two-pointers) |
| "remove/move X in place, keep order" | Two Pointers (fast/slow write) | O(n), O(1) space | [§4.3](#43-two-pointers) |
| "contiguous subarray/substring" + longest/shortest | Sliding Window | O(n) | [§4.4](#44-sliding-window) |
| "max sum of a contiguous subarray" | Kadane's | O(n) | [§4.4](#44-sliding-window) |
| "sorted" + find, or "minimum X such that …" | Binary Search (data or answer) | O(log n) | [§4.5](#45-binary-search) |
| "next greater/smaller", "days until", "largest rectangle" | Monotonic Stack | O(n) | [§4.6](#46-stack--monotonic-stack) |
| matching brackets, undo, evaluate an expression | Stack | O(n) | [§4.6](#46-stack--monotonic-stack) |
| linked list + cycle / middle / nth-from-end / palindrome | Fast & Slow Pointers | O(n), O(1) space | [§4.7](#47-linked-list--fast--slow-pointers) |
| meetings, ranges, "merge", "how many rooms" | Sort + sweep | O(n log n) | [§4.8](#48-intervals) |
| "array contains 1..n" + missing/duplicate | Cyclic Sort | O(n), O(1) space | [§4.9](#49-cyclic-sort) |
| "top/least k", "k-th largest", "median of a stream" | Heap of size k / QuickSelect | O(n log k) | [§4.10](#410-heap--top-k) |
| tree + "level / depth / nearest" | BFS | O(n) | [§4.11](#411-trees) |
| tree + "path / validate / combine subtrees" | DFS | O(n) | [§4.11](#411-trees) |
| autocomplete, "starts with", wildcard word search | Trie | O(len) | [§4.12](#412-trie) |
| "design a cache / versioned store with O(1) …" | Composition (map + list) | O(1) | [§4.13](#413-design) |
| grid + islands / regions / flood fill | Grid DFS | O(m·n) | [§4.14](#414-graphs--grids) |
| "minutes until everything spreads", "nearest gate" | Multi-source BFS | O(m·n) | [§4.14](#414-graphs--grids) |
| "prerequisites", "build order", cycle in a DIRECTED graph | Topological Sort (Kahn) | O(V+E) | [§4.15](#415-topological-sort) |
| "connected components", cycle in an UNDIRECTED graph, streaming edges | Union-Find | ~O(1) amortised | [§4.16](#416-union-find) |
| weighted "cheapest/fastest route" | Dijkstra / Bellman-Ford | O(E log V) | [§4.17](#417-shortest-paths) |
| "all combinations / permutations / partitions / placements" | Backtracking | exponential, prune | [§4.18](#418-backtracking) |
| "min/max cost", "number of ways", "can I partition" | Dynamic Programming | O(n)–O(n²) | [§4.19](#419-dynamic-programming) |
| jumps, fuel, coverage, "fewest X to cover Y" | Greedy | O(n) | [§4.20](#420-greedy) |
| "without extra space", "without the + operator", parity | Bit manipulation | O(1)–O(n) | [§4.21](#421-bits--math) |
| rotate / spiral / set-zeroes | Matrix index arithmetic | O(m·n) | [§4.22](#422-matrix) |

---

## Part 3 — The ladder: how the patterns connect

Learn in this order. Each tier is built from the one above it — that is what
makes the whole thing recallable instead of 22 disconnected tricks.

```
TIER 1 — LINEAR SCANS. One pass, remember something as you go.
  Hash Map ──────────► Prefix Sum         (remember running sums, not values)
      │                     │
      │                     └──► "subarray with sum k" when negatives ban windows
      ▼
  Two Pointers ─────────► Sliding Window   (two pointers that never go backwards)
                              │
                              └──► Kadane's (a window with one running value)

TIER 2 — EXPLOIT ORDER. Sortedness or structure discards work.
  Binary Search      ◄── needs the sortedness Two Pointers also relies on
      └──► binary search on the ANSWER (the highest-value variant)
  Monotonic Stack    ◄── the sliding-window deque, generalised
  Fast & Slow        ◄── Two Pointers applied to a list (and to arrays-as-lists)
  Intervals          ◄── sort first, then it is a one-pass sweep
  Cyclic Sort        ◄── the array IS the hash map when values are indices

TIER 3 — STRUCTURES. Pay for a data structure to buy an operation.
  Heap / Top-K       ◄── partial sorting; QuickSelect is its O(n) rival
  Trees (DFS/BFS)    ◄── DFS is recursion; BFS is the queue from Tier 1 windows
  Trie               ◄── a tree keyed by prefix; powers wildcard + grid search
  Design             ◄── compose two structures whose weaknesses cancel

TIER 4 — GRAPHS. Trees without the guarantee of no cycles.
  Grid DFS/BFS       ◄── a tree traversal plus a visited set
  Multi-source BFS   ◄── seed the queue with every source at once
  Topological Sort   ◄── BFS driven by in-degree; free cycle detection
  Union-Find         ◄── when edges ARRIVE over time and DFS would re-run
  Dijkstra           ◄── BFS + a heap, because edges now have weights

TIER 5 — CHOICE UNDER CONSTRAINT. Explore, or prove you need not.
  Backtracking       ◄── DFS over decisions, with undo
  Dynamic Programming◄── backtracking whose repeated subproblems are cached
  Greedy             ◄── DP you can prove is unnecessary
  Bits / Math / Matrix ◄── the standalone toolkit
```

**The three sentences that hold the ladder together:**

1. *Sliding Window is Two Pointers where both pointers only move forward.*
2. *DP is Backtracking with the repeated subproblems remembered; Greedy is DP you proved you did not need.*
3. *BFS + a heap = Dijkstra; BFS + in-degrees = topological sort.*

---

## Part 4 — The patterns

Format for every section: **Where it comes from → Recognise it → The template →
Q&A → Also in this package → Pitfalls.**

---

### 4.1 Hash Map / Set

**Where it comes from.** The starting point. Every later "remember it instead of
recomputing it" pattern is a variation on this one.

**Essence.** Trade O(n) space for O(1) recall. A set answers *"have I seen X?"*;
a map answers *"what do I know about X?"* — its index, its count, its last
position.

**Recognise it.** Complements, duplicates, grouping, frequencies, "first unique".

**The template.**

```go
seen := make(map[int]int, len(nums))   // value -> whatever you need to remember
for i, n := range nums {
    if v, ok := seen[key(n)]; ok { /* use v */ }
    seen[n] = i
}
```

---

**Q1. Two Sum (LC1) — return the indices of the two numbers adding to target.**

*Brute force:* every pair, O(n²).
*The waste:* for each `i`, the inner loop rescans the array for `target - nums[i]`
— a question a map answers in O(1).

```go
func TwoSum(nums []int, target int) []int {
    seen := make(map[int]int, len(nums)) // value -> index
    for i, n := range nums {
        if j, ok := seen[target-n]; ok {
            return []int{j, i}
        }
        seen[n] = i
    }
    return nil
}
```

**The one detail:** check *before* inserting. Insert first and `nums[i]` matches
itself when `target == 2*nums[i]`.

O(n) time, O(n) space. → [Go/hashmap/hashmap.go](Go/hashmap/hashmap.go)

---

**Q2. Group Anagrams (LC49).**

*Brute force:* compare every word with every other, O(n²·k).
*First improvement:* sort each word and group by the sorted string — O(n·k log k).
*The waste in that:* sorting is overkill. Anagrams are defined by their **letter
tally**, and a tally is computable in O(k).

```go
func GroupAnagrams(strs []string) [][]string {
    groups := make(map[[26]int][]string)
    for _, s := range strs {
        var key [26]int              // arrays are comparable => valid map key
        for i := 0; i < len(s); i++ {
            key[s[i]-'a']++
        }
        groups[key] = append(groups[key], s)
    }
    out := make([][]string, 0, len(groups))
    for _, g := range groups {
        out = append(out, g)
    }
    return out
}
```

**The Go-specific win:** `[26]int` is an array, not a slice, so it is comparable
and can be a map key directly. No string building, no sorting. O(n·k).

**Say this out loud:** map iteration order is randomised, so the group order is
unspecified — which the problem allows.

---

**Q3. Longest Consecutive Sequence (LC128) — O(n), not O(n log n).**

*Brute force:* sort, then scan — O(n log n). Perfectly good, and worth offering.
*The ask:* do it in O(n).
*The waste:* sorting orders **everything** when we only need to know whether
`n+1` exists.

```go
func LongestConsecutive(nums []int) int {
    set := make(map[int]struct{}, len(nums))
    for _, n := range nums {
        set[n] = struct{}{}
    }
    best := 0
    for n := range set {
        if _, ok := set[n-1]; ok {
            continue        // not the START of a run — someone else counts it
        }
        length := 1
        for {
            if _, ok := set[n+length]; !ok { break }
            length++
        }
        best = max(best, length)
    }
    return best
}
```

**Why it is actually linear**, and this is the whole interview: the inner loop
looks nested, but the `continue` guarantees a run is only ever walked from its
smallest member. Every value is visited at most twice overall.

---

**Also in this package.** `ContainsDuplicate` (LC217), `IsAnagram` /
`IsAnagramUnicode` (LC242), `TopKFrequent` (LC347 — bucket sort, O(n); see also
the heap version in §4.10), `FirstUniqChar` (LC387), `Encode`/`Decode` (LC271 —
length-prefixing, because any single delimiter can appear in the payload),
`Frequency[T]` (a generic tally).

**Pitfalls.**
- Reading a missing key gives the zero value — convenient, but it means a typo
  in a key silently returns 0 instead of failing.
- `[26]int` indexing assumes lowercase ASCII. On uppercase input `s[i]-'a'`
  **wraps** (see [§8](#part-8--go-gotcha-cheat-sheet)) and panics.
- Do not sort a map's output and call it deterministic unless you actually sort.

---

### 4.2 Prefix Sum

**Where it comes from.** Hash Map applied to *running sums* instead of values.
It is the fallback for range questions that a sliding window cannot handle.

**Essence.** One identity drives everything:

```
sum(i..j) == prefix[j] - prefix[i-1]
```

So *"does a range ending here have sum k?"* becomes *"have I seen prefix − k
before?"* — a map lookup.

**Recognise it.** Range sums; "count/longest subarray with sum k"; **negative
numbers present** (which is what rules out a window).

---

**Q1. Subarray Sum Equals K (LC560) — count subarrays summing to k.**

*Why not a sliding window?* A window needs "growing only ever increases the sum"
to know which end to move. Negatives destroy that guarantee. **Say this** — it is
the reason the problem exists.

```go
func SubarraySumEqualsK(nums []int, k int) int {
    seen := map[int]int{0: 1}   // prefix sum -> how many times seen
    sum, count := 0, 0
    for _, n := range nums {
        sum += n
        count += seen[sum-k]    // every earlier prefix of sum-k closes a range here
        seen[sum]++
    }
    return count
}
```

**The seed `{0: 1}` is not decoration.** It represents the empty prefix; without
it, every subarray that starts at index 0 is missed.

---

**Q2. Same problem, but return the LONGEST such subarray.**

One change, and it is the transferable idea: **counting wants "how many times",
length wants "how early".** So store only the *first* index at which each prefix
appeared, and never overwrite it.

```go
func LongestSubarrayWithSumK(nums []int, k int) int {
    first := map[int]int{0: -1}   // prefix sum -> EARLIEST index
    sum, best := 0, 0
    for i, n := range nums {
        sum += n
        if j, ok := first[sum-k]; ok {
            best = max(best, i-j)
        }
        if _, ok := first[sum]; !ok {
            first[sum] = i        // first occurrence only
        }
    }
    return best
}
```

`{0: -1}` makes a prefix that is itself equal to k give length `i - (-1) = i+1`.

---

**Q3. Product Except Self (LC238) — no division, O(1) extra space.**

*Why division is banned:* one zero destroys it, two zeros destroy it differently.
*The reframe:* each answer is (product of everything left) × (product of
everything right).

```go
func ProductExceptSelf(nums []int) []int {
    n := len(nums)
    out := make([]int, n)
    prefix := 1
    for i := 0; i < n; i++ {
        out[i] = prefix        // everything strictly LEFT of i
        prefix *= nums[i]
    }
    suffix := 1
    for i := n - 1; i >= 0; i-- {
        out[i] *= suffix       // × everything strictly RIGHT of i
        suffix *= nums[i]
    }
    return out
}
```

The trick that reaches O(1) space: write the prefixes into the **output** on the
way forward, then multiply the suffixes in on the way back. The output does not
count against space.

---

**Also in this package.** `FindMaxLength` (LC525 — count 1 as +1 and 0 as −1, so
"equal counts" becomes "sum 0" and the problem collapses into Q2), `PivotIndex`
(LC724), `NumArray`/`SumRange` (LC303 — the "many queries" signal: precompute
once, answer each in O(1)).

**Pitfalls.**
- Forgetting the `{0: 1}` / `{0: -1}` seed.
- Overwriting the first occurrence when you need the longest.
- Using a window on a problem with negatives.

---

### 4.3 Two Pointers

**Where it comes from.** The first pattern that exploits **order**: sortedness
lets a single move discard many candidates at once.

**Recognise it.** Sorted input + pair/triplet target; "in place"; palindromes;
partitioning.

**The three sub-shapes — know which one you are in:**

| Shape | Movement | Problems |
|---|---|---|
| **Converging** | both ends → middle | pair sum, 3Sum, container, palindrome, trapping rain |
| **Fast / slow write pointer** | same direction | Move Zeroes, Remove Duplicates |
| **Three-way partition** | low / mid / high | Sort Colors (Dutch flag) |

---

**Q1. Two Sum II — the input is SORTED (LC167).**

*Brute force:* every pair, O(n²).
*The waste:* once `nums[l] + nums[r]` overshoots, **every** larger `r` also
overshoots — sortedness already told us.

```go
func TwoSumSorted(nums []int, target int) []int {
    l, r := 0, len(nums)-1
    for l < r {
        switch sum := nums[l] + nums[r]; {
        case sum == target:
            return []int{l + 1, r + 1}   // this problem is 1-indexed
        case sum < target:
            l++                          // only a bigger left value can help
        default:
            r--
        }
    }
    return nil
}
```

**The justification to state:** each step eliminates one candidate *forever*, so
the total work is linear. That sentence is what earns the pattern.

---

**Q2. 3Sum (LC15) — all unique triplets summing to zero.**

*Brute force:* three loops, O(n³), plus a set to deduplicate.
*The move:* sort, fix one element, and the rest is Q1. O(n²).

```go
func ThreeSum(nums []int) [][]int {
    slices.Sort(nums)
    res := [][]int{}
    for i := 0; i < len(nums)-2; i++ {
        if nums[i] > 0 { break }                        // sorted: sum can't reach 0
        if i > 0 && nums[i] == nums[i-1] { continue }   // same anchor => same triplets
        l, r := i+1, len(nums)-1
        for l < r {
            switch sum := nums[i] + nums[l] + nums[r]; {
            case sum < 0: l++
            case sum > 0: r--
            default:
                res = append(res, []int{nums[i], nums[l], nums[r]})
                l++
                r--                                     // move BOTH
                for l < r && nums[l] == nums[l-1] { l++ }
                for l < r && nums[r] == nums[r+1] { r-- }
            }
        }
    }
    return res
}
```

**Deduplication is the whole difficulty**, and it happens in three places: skip a
repeated anchor, and skip repeated values on both sides *after* a match. Moving
only one pointer after a match re-finds the same triplet.

**Mention:** `slices.Sort` mutates the caller's slice. Flag it or clone.

---

**Q3. Trapping Rain Water (LC42) — the Hard one, in O(1) space.**

*Brute force:* for each bar, scan left and right for the tallest — O(n²).
*Standard fix:* two precomputed max arrays — O(n) time, O(n) space.
*The final step:* you never need both maxima, only the **smaller** one — and the
side with the smaller running max is provably the limiting side.

```go
func Trap(height []int) int {
    if len(height) == 0 { return 0 }
    l, r := 0, len(height)-1
    leftMax, rightMax := height[l], height[r]
    water := 0
    for l < r {
        if leftMax < rightMax {
            l++
            leftMax = max(leftMax, height[l])
            water += leftMax - height[l]     // settled: left is the limiter
        } else {
            r--
            rightMax = max(rightMax, height[r])
            water += rightMax - height[r]
        }
    }
    return water
}
```

Water above bar `i` is `min(maxLeft, maxRight) - height[i]`. Because we always
advance the side whose max is smaller, that side's max *is* the min, so its water
can be settled immediately. O(n) time, O(1) space.

`TrapBrute` is in the same file and the tests assert the two agree — build that
habit.

---

**Q4. Sort Colors (LC75) — 0s, 1s and 2s in ONE pass.**

```go
func SortColors(nums []int) {
    low, mid, high := 0, 0, len(nums)-1
    for mid <= high {
        switch nums[mid] {
        case 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low++
            mid++
        case 1:
            mid++
        default: // 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high--          // do NOT advance mid
        }
    }
}
```

**The one thing that is always asked:** why not advance `mid` after swapping with
`high`? Because the value pulled in from the right has never been examined — it
could itself be a 0 or a 2. The value pulled in from the *left* has already been
processed, which is why the 0 case does advance.

---

**Also in this package.** `IsPalindrome` (LC125 — skip non-alphanumerics in
place, no cleaned copy), `MaxArea` (LC11 — always move the shorter wall, because
area is capped by it), `MoveZeroes` (LC283), `RemoveDuplicates` (LC26),
`IsSubsequence` (LC392 — two pointers over two different strings).

**Pitfalls.**
- After a match with duplicates, advance **both** pointers.
- Swap-based partitioning does not preserve relative order of the displaced group.
- `l < r` vs `l <= r`: use `<` when the two pointers must not land on the same element.

---

### 4.4 Sliding Window

**Where it comes from.** Two Pointers where **both pointers only ever move
forward**. That restriction is what makes it O(n) even with a nested loop.

**Recognise it.** "Contiguous subarray/substring", "of size k",
"longest/shortest such that ⟨condition⟩".

**Two flavours.**

```go
// FIXED size: one in, one out, every step.
sum := 0
for i := 0; i < k; i++ { sum += nums[i] }
best := sum
for i := k; i < len(nums); i++ {
    sum += nums[i] - nums[i-k]
    best = max(best, sum)
}

// VARIABLE size: grow right greedily, shrink left only while invalid.
l := 0
for r := 0; r < len(s); r++ {
    add(s[r])
    for !valid() { remove(s[l]); l++ }
    best = max(best, r-l+1)
}
```

**Why the inner loop does not make it O(n²):** `l` never decreases, so across the
whole run it advances at most n times. Amortised O(n). Say this — interviewers
ask about it specifically.

---

**Q1. Longest Substring Without Repeating Characters (LC3).**

*Brute force:* every substring, check for duplicates — O(n³) naively, O(n²) with
a set.
*The waste:* when a duplicate is found, restarting from `start+1` re-examines
characters we already know are fine.

```go
func LengthOfLongestSubstring(s string) int {
    last := make(map[byte]int, len(s))   // char -> most recent index
    l, best := 0, 0
    for r := 0; r < len(s); r++ {
        if j, ok := last[s[r]]; ok && j >= l {
            l = j + 1                    // jump past the previous copy
        }
        last[s[r]] = r
        best = max(best, r-l+1)
    }
    return best
}
```

**The `j >= l` guard is the bug everyone hits.** Without it a stale index from
*before* the current window drags `l` backwards. The test case that exposes it is
`"tmmzuxt"` (answer 5) — memorise that string.

---

**Q2. Minimum Window Substring (LC76) — the hardest standard window.**

```go
func MinWindow(s, t string) string {
    if len(t) == 0 || len(s) < len(t) { return "" }
    need := make(map[byte]int, len(t))
    for i := 0; i < len(t); i++ { need[t[i]]++ }

    missing := len(t)              // characters still owed
    bestL, bestLen := 0, -1
    l := 0
    for r := 0; r < len(s); r++ {
        if need[s[r]] > 0 { missing-- }   // only counts if actually owed
        need[s[r]]--                      // may go negative: a surplus
        for missing == 0 {                // valid — now tighten
            if bestLen == -1 || r-l+1 < bestLen {
                bestL, bestLen = l, r-l+1
            }
            need[s[l]]++
            if need[s[l]] > 0 { missing++ }   // dropping this breaks validity
            l++
        }
    }
    if bestLen == -1 { return "" }
    return s[bestL : bestL+bestLen]
}
```

**Two ideas make this tractable:**
1. `missing` turns validity into an integer comparison instead of scanning a map.
2. Counts go **negative** for surplus characters, so `need[c] > 0` cleanly
   distinguishes "this one was required" from "we had spares".

---

**Q3. Longest Repeating Character Replacement (LC424).**

*The reframe:* a window is valid when
`length − (count of its most common letter) ≤ k` — the letters you would have to
overwrite fit the budget.

```go
func CharacterReplacement(s string, k int) int {
    var count [128]int              // ASCII-indexed: no case assumption
    l, maxFreq, best := 0, 0, 0
    for r := 0; r < len(s); r++ {
        count[s[r]]++
        maxFreq = max(maxFreq, count[s[r]])
        for r-l+1-maxFreq > k {
            count[s[l]]--
            l++
        }
        best = max(best, r-l+1)
    }
    return best
}
```

**The subtlety worth raising unprompted:** `maxFreq` is never decreased when the
window shrinks, so it can go stale. That is safe — a stale (too large) `maxFreq`
can only *prevent* the answer from growing, never permit an invalid longer
window. Keeping it monotone is what preserves the single pass.

> **A real bug from building this file.** The first version indexed
> `count[s[r]-'a']`. LC424 uses **uppercase** letters, and Go's byte arithmetic
> is unsigned, so `'A' - 'a'` wraps to **224** rather than −32 — an immediate
> index-out-of-range panic, caught by the test suite. Indexing by the raw byte
> into `[128]int` removes the assumption entirely.

---

**Q4. Sliding Window Maximum (LC239) — the bridge to monotonic stacks.**

*Brute force:* re-scan each window, O(n·k).
*The waste:* a value that is smaller than a newer value can never be the max of
any future window — yet we keep comparing it.

```go
func MaxSlidingWindow(nums []int, k int) []int {
    if k <= 0 || k > len(nums) { return nil }
    deque := make([]int, 0, len(nums))    // INDICES, values decreasing
    out := make([]int, 0, len(nums)-k+1)
    for i, n := range nums {
        for len(deque) > 0 && nums[deque[len(deque)-1]] <= n {
            deque = deque[:len(deque)-1]  // newer and bigger: pop the useless
        }
        deque = append(deque, i)
        if deque[0] <= i-k { deque = deque[1:] }   // front slid out
        if i >= k-1 { out = append(out, nums[deque[0]]) }
    }
    return out
}
```

Store **indices**, not values — that is the only way to know when the front has
left the window. This is the same discard rule as the monotonic stack in §4.6.

---

**Also in this package.** `MaxSumSubarrayK` (+ its brute-force twin),
`CheckInclusion` (LC567 — fixed window; `window == need` compares two `[26]int`
arrays in one operation), `LongestSubstringKDistinct` (the map's **size** is the
constraint — remember to `delete` at zero or `len` lies), `MaxProfit` (LC121 — a
window whose left edge is "cheapest day so far"), `MaxSubarray` (Kadane).

**Kadane's** is the degenerate cousin — one running value, one decision per
element: *extend the streak, or start fresh.*

```go
best, current := nums[0], nums[0]
for _, n := range nums[1:] {
    current = max(n, current+n)
    best = max(best, current)
}
```

Seed with `nums[0]`, **never 0** — an all-negative array must return its largest
element.

**Pitfalls.**
- Windows need a monotone-ish condition. Negatives break sum-based windows →
  switch to Prefix Sum (§4.2).
- `delete` from the count map when it hits zero, or `len(count)` is wrong.
- Guard `k > len(nums)` before `make([]int, 0, len(nums)-k+1)` — a negative
  capacity panics.

---

### 4.5 Binary Search

**Where it comes from.** The same sortedness Two Pointers exploits, used to
discard *half* the space per step instead of one candidate.

**Recognise it.** Sorted input — **or**, far more valuable, "minimum/maximum X
such that ⟨condition⟩", where the condition flips false→true exactly once.

> **The real question is never "is it sorted?" — it is "is it monotone?"**

**The three templates. Learn these shapes and derive everything else.**

```go
// 1. EXACT MATCH — closed interval [lo, hi]
lo, hi := 0, len(nums)-1
for lo <= hi {
    mid := lo + (hi-lo)/2
    switch {
    case nums[mid] == target: return mid
    case nums[mid] < target:  lo = mid + 1
    default:                  hi = mid - 1
    }
}
return -1

// 2. LOWER BOUND — first index with value >= target. Half-open [lo, hi).
lo, hi := 0, len(nums)
for lo < hi {
    mid := lo + (hi-lo)/2
    if nums[mid] < target { lo = mid + 1 } else { hi = mid }  // mid stays a candidate
}
return lo

// 3. UPPER BOUND — identical, with <= instead of <.
```

`mid := lo + (hi-lo)/2` rather than `(lo+hi)/2` avoids overflow in 32-bit
languages. Go's `int` is 64-bit so it cannot overflow for slice indices, but the
habit costs nothing and interviewers look for it.

**Own templates 2 and 3 and you get these for free:** `SearchInsert` *is*
`LowerBound`; `SearchRange` (LC34) is `[LowerBound, UpperBound-1]`;
`CountOccurrences` is `UpperBound − LowerBound`.

---

**Q1. Search in Rotated Sorted Array (LC33).**

*The insight:* cutting a rotated array at `mid` always leaves **at least one
sorted half**. Identify it, ask whether the target lies inside it.

```go
func SearchRotated(nums []int, target int) int {
    lo, hi := 0, len(nums)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target { return mid }
        if nums[lo] <= nums[mid] {                        // LEFT half is sorted
            if target >= nums[lo] && target < nums[mid] { hi = mid - 1 } else { lo = mid + 1 }
        } else {                                          // RIGHT half is sorted
            if target > nums[mid] && target <= nums[hi] { lo = mid + 1 } else { hi = mid - 1 }
        }
    }
    return -1
}
```

Its sibling `FindMin` (LC153) compares against **`nums[hi]`, not `nums[lo]`** —
"mid is bigger than the last element" proves the rotation point is to the right.
Comparing against `nums[lo]` fails on an unrotated array.

---

**Q2. Koko Eating Bananas (LC875) — binary search on the ANSWER.**

This is the highest-value variant in interviews. Nothing here is sorted; the
monotone thing is the *predicate*.

```go
func hoursNeeded(piles []int, speed int) int {
    hours := 0
    for _, p := range piles {
        hours += (p + speed - 1) / speed    // integer ceiling division
    }
    return hours
}

func MinEatingSpeed(piles []int, h int) int {
    lo, hi := 1, 0
    for _, p := range piles { hi = max(hi, p) }   // eating the biggest pile/hour always works
    for lo < hi {
        mid := lo + (hi-lo)/2
        if hoursNeeded(piles, mid) <= h { hi = mid } else { lo = mid + 1 }
    }
    return lo
}
```

**The reusable recipe** — this unlocks "min days to ship", "split array largest
sum", "minimise the maximum distance":

1. Guess an answer `x`.
2. Write `feasible(x)` — cheap, and **monotone** in x.
3. Binary search the smallest feasible `x` with the LowerBound shape.

The search space is the range of *answers*, not the input array.

---

**Q3. Median of Two Sorted Arrays (LC4) — O(log(min(m,n))).**

*The reframe:* do not merge. Choose a cut in `a`; the cut in `b` is then forced,
because the two left parts must together hold half the elements. The cut is
correct when everything left of it is ≤ everything right of it — checkable from
just four values.

```go
if len(a) > len(b) { a, b = b, a }        // binary search the SHORTER array
m, n := len(a), len(b)
half := (m + n + 1) / 2

lo, hi := 0, m
for lo <= hi {
    i := lo + (hi-lo)/2       // take i from a
    j := half - i             // ...so j must come from b

    aLeft, aRight := math.MinInt, math.MaxInt   // sentinels remove edge cases
    if i > 0 { aLeft = a[i-1] }
    if i < m { aRight = a[i] }
    bLeft, bRight := math.MinInt, math.MaxInt
    if j > 0 { bLeft = b[j-1] }
    if j < n { bRight = b[j] }

    switch {
    case aLeft <= bRight && bLeft <= aRight:      // valid cut
        if (m+n)%2 == 1 { return float64(max(aLeft, bLeft)) }
        return float64(max(aLeft, bLeft)+min(aRight, bRight)) / 2
    case aLeft > bRight: hi = i - 1               // took too many from a
    default:             lo = i + 1
    }
}
```

Searching the shorter array is what keeps `j` in range. The `±Inf` sentinels turn
"the cut is at the edge" into an ordinary comparison. The tests compare this
against a merge-and-sort oracle on nine inputs — do the same when you practise.

---

**Also in this package.** `Search` (LC704), `SearchMatrix` (LC74 — a row-sorted
matrix *is* one sorted array; index it virtually with `mid/cols` and `mid%cols`),
`FindPeakElement` (LC162 — not sorted, but "uphill" is a monotone signal).

**Pitfalls.**
- `lo <= hi` with `hi = mid - 1`, or `lo < hi` with `hi = mid`. Mixing them
  either loops forever or skips the answer.
- Off-by-one when returning: template 2 returns an insertion point, not a match.
  Always verify `nums[i] == target` before trusting it.

---

### 4.6 Stack / Monotonic Stack

**Where it comes from.** The discard rule from `MaxSlidingWindow` (§4.4),
generalised: throw away anything a newer element has made irrelevant.

**Recognise it.** *Plain stack:* matching pairs, nesting, expression evaluation.
*Monotonic stack:* "next greater/smaller element", "how far until something
bigger", "largest rectangle" — anything where the brute force scans forward from
every index.

**Go note.** There is no stack type. A slice is the stack (see §0.1).

---

**Q1. Valid Parentheses (LC20).**

```go
var closeToOpen = map[byte]byte{')': '(', ']': '[', '}': '{'}

func IsValid(s string) bool {
    stack := make([]byte, 0, len(s))
    for i := 0; i < len(s); i++ {
        c := s[i]
        if open, isCloser := closeToOpen[c]; isCloser {
            if len(stack) == 0 || stack[len(stack)-1] != open {
                return false          // nothing to close, or closing the wrong thing
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, c)
        }
    }
    return len(stack) == 0            // leftover openers mean unbalanced
}
```

**Why a stack and not a counter:** a counter works for one bracket type but
cannot tell `"([)]"` from `"([])"`. The most recently opened bracket must close
first — that is the definition of LIFO. Driving it from a table beats an if/else
chain and extends to new bracket types for free.

---

**Q2. Min Stack (LC155) — push/pop/top/getMin all O(1).**

*The problem:* after a pop you cannot recompute the minimum in O(1).
*The answer:* do not recompute — **store the min alongside each element.** Every
level remembers "the minimum of everything at or below me", which pops away with
its element for free.

```go
type MinStack struct{ vals, mins []int }

func (s *MinStack) Push(v int) {
    s.vals = append(s.vals, v)
    if len(s.mins) == 0 || v < s.mins[len(s.mins)-1] {
        s.mins = append(s.mins, v)
    } else {
        s.mins = append(s.mins, s.mins[len(s.mins)-1])   // repeat the current min
    }
}
func (s *MinStack) GetMin() int { return s.mins[len(s.mins)-1] }
```

Trading O(n) extra space for O(1) queries is the whole answer — say it that way.

---

**Q3. Daily Temperatures (LC739) — the monotonic template.**

*Brute force:* for each day, scan forward — O(n²).
*The waste:* the same warm stretch is rescanned again and again.

```go
func DailyTemperatures(temps []int) []int {
    out := make([]int, len(temps))
    stack := make([]int, 0, len(temps))   // INDICES, temperatures decreasing
    for i, t := range temps {
        for len(stack) > 0 && temps[stack[len(stack)-1]] < t {
            j := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            out[j] = i - j                // i is j's answer
        }
        stack = append(stack, i)
    }
    return out                            // unresolved days keep 0
}
```

**Why it is O(n) despite the nested loop:** each index is pushed once and popped
once. Total work is bounded by 2n. This is the argument to give.

This template *is* "next greater element" — `NextGreaterElements` in the same
file is the identical code recording values instead of distances.

---

**Q4. Largest Rectangle in Histogram (LC84) — the hard one.**

*Every bar asks:* how far left and right can I extend at my own height? Bounded
by the first strictly shorter bar on each side.

```go
func LargestRectangleArea(heights []int) int {
    best := 0
    stack := make([]int, 0, len(heights)+1)   // indices, heights INCREASING
    for i := 0; i <= len(heights); i++ {
        h := 0                                 // sentinel on the final pass
        if i < len(heights) { h = heights[i] }
        for len(stack) > 0 && heights[stack[len(stack)-1]] >= h {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            left := -1
            if len(stack) > 0 { left = stack[len(stack)-1] }
            best = max(best, heights[top]*(i-left-1))
        }
        stack = append(stack, i)
    }
    return best
}
```

**Two details that make or break it:**
1. When bar `i` is shorter than the top, that top has found its right boundary
   (`i`) and its left boundary (the new stack top after popping) — so width is
   `i - left - 1`.
2. The `i == len(heights)` iteration uses a virtual height of 0 as a **sentinel**
   that flushes the stack. Without it, an increasing input like `[1,2,3]` is
   never settled and the answer is 0.

---

**Also in this package.** `EvalRPN` (LC150 — postfix needs no precedence rules;
the **second** pop is the left operand; Go's integer division truncates toward
zero, which is exactly what LC150 specifies), `DailyTemperaturesBrute`.

**Pitfalls.**
- Always check `len(stack) > 0` before peeking.
- Store indices, not values, whenever you need distances or boundaries.
- Decide `<` vs `<=` in the pop condition deliberately — it decides how ties are
  handled ("strictly warmer" vs "at least as warm").

---

### 4.7 Linked List & Fast / Slow Pointers

**Where it comes from.** Two Pointers on a structure with no indices.

**Recognise it.** Cycle / middle / nth-from-end / palindrome / reorder — and any
"find the repeat with O(1) space".

**Two habits that prevent most bugs:**
1. **Draw three nodes and a nil.** Every rewiring bug is visible in three nodes.
2. **Use a dummy head when the first node may change.** It removes the "am I at
   the head?" special case from every loop.

---

**Q1. Reverse a Linked List (LC206).**

```go
func ReverseList(head *ListNode) *ListNode {
    var prev *ListNode
    for cur := head; cur != nil; {
        next := cur.Next   // 1. remember, or the rest of the list is lost
        cur.Next = prev    // 2. flip
        prev = cur         // 3. advance
        cur = next
    }
    return prev            // prev is the new head
}
```

The three-line dance in that order. `ReverseListRecursive` is in the same file:
*"reverse the rest, then make my successor point back at me"* — O(n) stack.

---

**Q2. Linked List Cycle II (LC142) — find where the cycle STARTS.**

*Brute force:* a set of visited nodes — O(n) space.
*Floyd's:* O(1) space.

```go
func DetectCycleStart(head *ListNode) *ListNode {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {                       // phase 2
            for p := head; p != slow; p = p.Next {
                slow = slow.Next
            }
            return slow
        }
    }
    return nil
}
```

**Why they must meet:** inside the cycle, `fast` gains exactly one position per
step on `slow`. A gap shrinking by one each step cannot skip zero.

**Phase 2 is the part people forget:** after the meeting, reset one pointer to
the head and advance **both one step at a time**. The distance from the head to
the cycle entry equals the distance from the meeting point to the entry, so they
meet exactly there.

---

**Q3. Find the Duplicate Number (LC287) — the pattern transfer that impresses.**

An array where every value is in `[1, n-1]`. Find the repeat **without modifying
the input** and in O(1) space.

*The reframe:* read `i → nums[i]` as "node i points to node nums[i]". Because no
value is 0, no edge leads back to index 0, so the walk must enter a cycle — and
the duplicate is the value two indices point at: **the cycle's entry**.

```go
func FindDuplicate(nums []int) int {
    slow, fast := 0, 0
    for {
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast { break }
    }
    slow = 0                       // phase 2, exactly as above
    for slow != fast {
        slow = nums[slow]
        fast = nums[fast]
    }
    return slow
}
```

Cyclic Sort (§4.9) also solves this — but it **mutates** the array. Floyd is the
answer when "do not modify the input" is a stated constraint. Knowing *which
constraint selects which pattern* is the point.

---

**Q4. Reorder List (LC143) — composition of three primitives.**

L0 → Ln → L1 → Ln−1 … Nothing new is needed: **find the middle, reverse the
second half, zip the two halves.** Recognising a problem as a composition of
primitives you already own is a large part of interview speed.
`IsPalindromeList` (LC234) is the same three-step recipe with a comparison
instead of a zip.

---

**Also in this package.** `MergeTwoLists` (LC21 — dummy head), `MergeKLists`
(LC23 — pairwise divide-and-conquer for O(N log k); merging one at a time is
O(N·k)), `RemoveNthFromEnd` (LC19 — the gap trick, one pass), `MiddleNode`
(LC876), `HasCycle` (LC141), plus `FromSlice`/`ToSlice` test helpers.

**Pitfalls.**
- Save `next` before overwriting `cur.Next`.
- Guard `fast != nil && fast.Next != nil` — checking only one nil-panics.
- Even-length "middle" is ambiguous: LC876 wants the *second* middle;
  `ReorderList` needs the *first*. That is why they use slightly different loop
  conditions — compare them in the source.

---

### 4.8 Intervals

**Where it comes from.** Sorting turns a pairwise-comparison problem into a
single sweep — the same "impose order, then one pass" idea as Two Pointers.

**Recognise it.** Meetings, bookings, ranges, "merge", "how many rooms".

> **The one decision that defines the problem: sort by START or by END?**
> - by **start** → you are building or merging a combined range (`Merge`, `Insert`)
> - by **end** → you are greedily keeping as many as possible (`EraseOverlapIntervals`)
>
> Getting this backwards is the most common failure on this pattern.

---

**Q1. Merge Intervals (LC56).**

```go
func Merge(intervals [][]int) [][]int {
    if len(intervals) == 0 { return nil }
    sorted := sortedCopy(intervals, 0)                     // by start
    out := [][]int{{sorted[0][0], sorted[0][1]}}           // fresh copy: safe to mutate
    for _, iv := range sorted[1:] {
        last := out[len(out)-1]
        if iv[0] <= last[1] {
            last[1] = max(last[1], iv[1])                  // max() handles nesting
        } else {
            out = append(out, []int{iv[0], iv[1]})
        }
    }
    return out
}
```

**After sorting by start, an interval can only overlap its immediate predecessor
in the output** — so one sweep suffices with no lookback.

`max()` is not optional: `[1,10]` followed by `[2,3]` is fully nested, and
assigning `iv[1]` directly would *shrink* the merged range.

**Ask about the convention:** do `[1,4]` and `[4,5]` overlap? `<` versus `<=` is
the entire difference.

**A Go trap this code defends against:** `copy()` on a `[][]int` is *shallow*.
Sorting the copy is safe (only headers move), but writing `iv[1]` would be
visible to the caller — hence the fresh inner slices. There is a test for it.

---

**Q2. Meeting Rooms II (LC253) — the peak concurrency reframe.**

*The reframe that makes it easy:* you do not care **which** meeting is in which
room, only **how many** run at once. So decouple the endpoints entirely.

```go
func MinMeetingRooms(intervals [][]int) int {
    starts := make([]int, 0, len(intervals))
    ends := make([]int, 0, len(intervals))
    for _, iv := range intervals {
        starts = append(starts, iv[0])
        ends = append(ends, iv[1])
    }
    slices.Sort(starts)
    slices.Sort(ends)

    rooms, best, j := 0, 0, 0
    for i := 0; i < len(starts); i++ {
        for j < len(ends) && ends[j] <= starts[i] { rooms--; j++ }   // freed
        rooms++
        best = max(best, rooms)
    }
    return best
}
```

Every start takes a room, every end frees one; the answer is the high-water mark.
`ends[j] <= starts[i]` means a room freed at 10:00 is reusable at 10:00 — flip to
`<` if cleanup time is required. This is also the "minimum platforms" question.

---

**Q3. Non-overlapping Intervals (LC435) — why sorting by END is provably right.**

```go
sorted := sortedCopy(intervals, 1)      // by END
kept, end := 1, sorted[0][1]
for _, iv := range sorted[1:] {
    if iv[0] >= end { kept++; end = iv[1] }
}
return len(intervals) - kept
```

**The exchange argument:** among intervals that conflict, keeping the one that
*finishes earliest* leaves the most room for everything after it, so it can never
be worse than any other choice. This is classic activity selection — the
justification matters more than the code.

---

**Also in this package.** `Insert` (LC57 — three phases: copy before, absorb
overlapping, copy after; O(n), no sort needed), `CanAttendMeetings` (LC252),
`IntervalIntersection` (LC986 — two pointers over two lists; the overlap is
`[max(starts), min(ends)]`, and you advance whichever interval ends first).

---

### 4.9 Cyclic Sort

**Where it comes from.** The Hash Map idea with **zero extra space**: when a
value's correct home is a known index, the array *is* the hash table.

**Recognise it.** "An array of n numbers in the range 1..n (or 0..n)" plus
missing / duplicate / smallest-absent.

**Two ways to use the array as storage:**
1. **Swap** values into place (`CyclicSort`, `FirstMissingPositive`)
2. **Negate** `a[v-1]` as a "seen" bit (`FindDisappearedNumbers`, `FindDuplicates`)

Both mutate the input. If that is forbidden, use Floyd (§4.7).

```go
func CyclicSort(nums []int) {
    i := 0
    for i < len(nums) {
        home := nums[i] - 1
        if nums[i] != nums[home] {
            nums[i], nums[home] = nums[home], nums[i]
        } else {
            i++
        }
    }
}
```

**Compare `nums[i] != nums[home]`, NOT `i != home`.** With duplicates present the
index test spins forever; the value test recognises "the home slot already holds
this value" and moves on. Each swap places at least one value permanently, so
there are at most n swaps — O(n) despite the nested appearance.

---

**Q1. First Missing Positive (LC41) — a Hard question this pattern makes routine.**

*The bounding argument that unlocks it:* with n slots, the answer is always in
`[1, n+1]`. So values ≤ 0 or > n are **irrelevant** and can be ignored entirely.

```go
func FirstMissingPositive(nums []int) int {
    n := len(nums)
    for i := 0; i < n; i++ {
        for nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
            home := nums[i] - 1
            nums[i], nums[home] = nums[home], nums[i]
        }
    }
    for i := 0; i < n; i++ {
        if nums[i] != i+1 { return i + 1 }
    }
    return n + 1
}
```

O(n) time, O(1) space. State the bounding argument first — it is the insight the
interviewer is listening for.

---

**Q2. Missing Number (LC268) — three valid answers, know all three.**

```go
func MissingNumber(nums []int) int {
    missing := len(nums)            // the index n that owns no slot
    for i, n := range nums {
        missing ^= i ^ n            // every present value cancels its index
    }
    return missing
}
```

| Approach | Cost | When to prefer |
|---|---|---|
| Sum formula `n(n+1)/2 − actual` | O(n)/O(1) | simplest to explain |
| **XOR** | O(n)/O(1) | no overflow risk — the answer to "what if n is huge?" |
| Cyclic placement | O(n)/O(1) | generalises to "find all missing" |

Both `MissingNumber` and `MissingNumberSum` are in the file so you can compare.

---

**Also in this package.** `FindDisappearedNumbers` (LC448) and `FindDuplicates`
(LC442) — mirror images using the sign bit as a visited marker. Read through
`abs()`, because the magnitude still holds the original value, and guard the
negation so a value seen twice does not flip a slot back to positive.

---

### 4.10 Heap / Top-K

**Where it comes from.** Sorting gives total order for O(n log n); a heap gives
just "the current extreme" for O(log n) per operation. Pay only for what you need.

**Recognise it.** "k largest/smallest", "k most frequent", "k closest", "median
of a stream", "merge k sorted things".

> **The counter-intuitive bit, and the thing to say out loud: for the k LARGEST
> you keep a MIN-heap of size k.** The root is the weakest survivor, so it is the
> cheapest thing to evict when a better candidate arrives.

See [§0.5](#05-containerheap-is-an-algorithm-not-a-container) for the interface
boilerplate.

---

**Q1. Kth Largest Element (LC215) — three answers, increasing in cleverness.**

```go
// 1. Sort. O(n log n). ALWAYS offer this first — for small n it is correct
//    engineering, and it is your oracle.
func FindKthLargestSort(nums []int, k int) int {
    sorted := slices.Clone(nums)
    slices.Sort(sorted)
    return sorted[len(sorted)-k]
}

// 2. Min-heap of size k. O(n log k) time, O(k) space.
//    The answer when the input is a STREAM, or n is huge and k is small.
func FindKthLargest(nums []int, k int) int {
    h := &MinIntHeap{}
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k { heap.Pop(h) }    // evict the weakest survivor
    }
    return h.Peek()
}

// 3. QuickSelect. O(n) average, O(n²) worst.
func FindKthLargestQuickSelect(nums []int, k int) int {
    work := slices.Clone(nums)
    target := len(work) - k
    lo, hi := 0, len(work)-1
    for {
        p := partition(work, lo, hi)
        switch {
        case p == target: return work[p]
        case p < target:  lo = p + 1
        default:          hi = p - 1
        }
    }
}
```

**Why QuickSelect beats the heap:** quicksort recurses into *both* halves; the
kth element lives in exactly one, so recursing into only that side gives
`n + n/2 + n/4 + … = O(n)`. Randomising the pivot defends the worst case — worth
stating, because a sorted input hits O(n²) with a fixed pivot.

All three are tested against each other on the same inputs.

---

**Q2. Top K Frequent Elements (LC347) — when the heap is the WRONG answer.**

The heap gives O(n log k). But a count can never exceed n, so counts are a
**bounded key** — bucket by count and read from the top:

```go
buckets := make([][]int, len(nums)+1)     // buckets[c] = values seen c times
for n, c := range freq { buckets[c] = append(buckets[c], n) }
for c := len(buckets) - 1; c >= 1 && len(out) < k; c-- { /* collect */ }
```

O(n). Knowing when *not* to reach for the heap is worth as much as knowing how
to use it. Both versions exist here: `hashmap.TopKFrequent` (buckets) and
`heaptopk.TopKFrequentHeap` (heap — better for a stream with unbounded counts).

---

**Q3. Find Median from Data Stream (LC295) — the two-heap trick.**

*Split the data at the median.* `low` is a **max-heap** of the smaller half, so
its root is the largest small value; `high` is a **min-heap** of the larger half.
The median sits at one or both roots.

```go
func (m *MedianFinder) AddNum(n int) {
    heap.Push(m.low, n)
    heap.Push(m.high, heap.Pop(m.low))      // hand low's maximum to high
    if m.low.Len() < m.high.Len() {         // low must never be the smaller half
        heap.Push(m.low, heap.Pop(m.high))
    }
}

func (m *MedianFinder) FindMedian() float64 {
    if m.low.Len() > m.high.Len() { return float64(m.low.Peek()) }
    return float64(m.low.Peek()+m.high.Peek()) / 2
}
```

**The push-then-move dance** keeps both halves correctly partitioned with no
comparisons at all: always insert through `low`, always relay its max to `high`,
then rebalance. `AddNum` is O(log n), `FindMedian` is O(1).

---

**Also in this package.** `KClosest` (LC973 — max-heap of size k on **squared**
distance: same ordering, no square root, no float rounding), `LastStoneWeight`
(LC1046 — `heap.Init` is O(n), cheaper than n pushes), `LeastInterval` (LC621 —
solved by **counting, not a heap**: lay the most frequent task out as
`(maxFreq-1)` frames of width `n+1`, then `max(that, len(tasks))`. Know the heap
simulation too, but this one shows you found the structure).

---

### 4.11 Trees

**Where it comes from.** Recursion made concrete. Trees are graphs with no cycles
— which is why the visited set that §4.14 needs is absent here.

> **The one question that writes a DFS for you:**
> *"What do I need FROM my children, and what do I return TO my parent?"*
> They are often different. `Diameter` returns a height upward while recording
> the widest path in a closure; `MaxPathSum` returns a one-armed gain while
> recording a two-armed best. Noticing that split is the whole trick.

**DFS or BFS?** BFS for "level / depth / nearest / shortest". DFS for "path /
validate / combine subtree answers".

**Complexity to state:** time O(n); space O(h) for the recursion stack — O(log n)
balanced, O(n) for a degenerate list-shaped tree.

---

**Q1. Maximum Depth (LC104) — the template everything else is built from.**

```go
func MaxDepth(root *TreeNode) int {
    if root == nil { return 0 }
    return 1 + max(MaxDepth(root.Left), MaxDepth(root.Right))
}
```

Base case, combine the children, add yourself. Every DFS below is a variation.

---

**Q2. Diameter of a Binary Tree (LC543) — the return/record split.**

```go
func DiameterOfBinaryTree(root *TreeNode) int {
    best := 0
    var height func(*TreeNode) int
    height = func(n *TreeNode) int {
        if n == nil { return 0 }
        l, r := height(n.Left), height(n.Right)
        best = max(best, l+r)      // the path BENDING at n
        return 1 + max(l, r)       // what the PARENT can use
    }
    height(root)
    return best
}
```

The parent cannot use a bent path, so the return value and the recorded answer
differ. Once you see this, `MaxPathSum` (LC124) is the same shape with one extra
idea: **clamp a negative arm to zero**, because you may always decline to extend
into a subtree that would only subtract.

`IsBalanced` (LC110) is the same trick with a **poison value**: return −1 to mean
"already unbalanced below", so height and balance are computed in one pass
instead of O(n²).

---

**Q3. Validate BST (LC98) — the classic wrong answer.**

**The wrong answer** is comparing each node only with its children. A value must
respect every **ancestor**: in `[5,4,6,null,null,3,7]`, the 3 is a valid left
child of 6 but violates the root.

```go
func IsValidBST(root *TreeNode) bool {
    var check func(n, lo, hi *TreeNode) bool
    check = func(n, lo, hi *TreeNode) bool {
        if n == nil { return true }
        if lo != nil && n.Val <= lo.Val { return false }
        if hi != nil && n.Val >= hi.Val { return false }
        return check(n.Left, lo, n) && check(n.Right, n, hi)
    }
    return check(root, nil, nil)
}
```

Going left tightens the upper bound; going right tightens the lower bound.

**A deliberate Go choice:** the bounds are `*TreeNode`, not ints. Sentinel ints
would break on a tree that legitimately contains `math.MinInt`. Small detail,
easy to defend.

---

**Q4. Level Order Traversal (LC102) — the BFS skeleton.**

```go
queue := []*TreeNode{root}
for len(queue) > 0 {
    size := len(queue)              // FREEZE this level's size
    level := make([]int, 0, size)
    for range size {
        node := queue[0]
        queue = queue[1:]
        level = append(level, node.Val)
        if node.Left != nil  { queue = append(queue, node.Left) }
        if node.Right != nil { queue = append(queue, node.Right) }
    }
    out = append(out, level)
}
```

**The essential detail:** capture `len(queue)` *before* the inner loop. Reading it
inside would keep growing as children are appended, and the levels would smear
together. This frozen-size trick reappears in multi-source BFS (§4.14) as "one
level = one minute".

Change only what you record per level and you get the variants for free:
`RightSideView` (keep the last of each level), `ZigzagLevelOrder` (reverse the
odd levels — do **not** reverse the queue).

---

**Q5. Serialize and Deserialize (LC297).**

```go
// Serialize: preorder with '#' for nil.
func Serialize(root *TreeNode) string { /* "1,2,#,#,3,#,#," */ }

// Deserialize: one linear scan, a SHARED cursor rebuilds the branching.
func Deserialize(data string) *TreeNode {
    tokens := strings.Split(data, ",")
    i := 0
    var build func() *TreeNode
    build = func() *TreeNode {
        tok := tokens[i]; i++
        if tok == "#" || tok == "" { return nil }
        v, _ := strconv.Atoi(tok)
        return &TreeNode{Val: v, Left: build(), Right: build()}
    }
    return build()
}
```

**Why preorder plus nil markers:** the markers make the shape unambiguous, so one
traversal suffices. Plain preorder with the nils dropped cannot be decoded —
many different trees share it.

> **Go evaluation-order note:** `&TreeNode{Val: v, Left: build(), Right: build()}`
> relies on the composite literal's fields being evaluated in source order.
> The Go spec orders function calls left to right, so this is correct — but if
> that makes you uneasy under interview pressure, assign `left` then `right` to
> locals first. Same result, zero doubt.

---

**Also in this package.** `InvertTree` (LC226), `IsSameTree` (LC100 — both-nil is
true, one-nil is false), `IsSubtree` (LC572), `GoodNodes` (LC1448 — the template
for carrying information **down** as a parameter rather than combining upward),
`InorderTraversal` (LC94, **iterative** — the honest answer to "without
recursion?"), `KthSmallest` (LC230 — an inorder walk that stops at k: O(h+k), not
O(n)), `LowestCommonAncestorBST` (LC235 — the split point is the answer, O(h),
no recursion), `BuildTree` (LC105 — preorder hands you the root, inorder tells
you the left subtree's size; the index map makes it O(n)), plus `FromLevelOrder`
for building test trees.

---

### 4.12 Trie

**Where it comes from.** A tree keyed by prefix. It exists for the one question a
hash set cannot answer.

**Recognise it.** Autocomplete, "does any word start with…", wildcard search,
"match many words at once against a grid".

> A hash set answers *"is this an exact word?"* in O(1) but cannot answer *"is
> this a PREFIX of anything?"*. That gap is the entire reason the trie exists.

```go
type Trie struct {
    children [26]*Trie
    isWord   bool          // true when a word ENDS here
}
```

**`isWord` is not optional:** after inserting "apple", the node at "app" exists
but no word ends there. `Search("app")` must be false while `StartsWith("app")`
is true.

`[26]*Trie` vs `map[byte]*Trie`: the array is faster and needs no hashing but
costs 26 pointers per node even for sparse data. State the trade-off; for a
lowercase-only problem the array is the right default.

Insert and search are **O(len(word))** — independent of how many words are stored.

---

**Q1. Design Add and Search Words with '.' wildcards (LC211).**

A `.` forks the walk into up to 26 branches, so lookup becomes a **search**:

```go
func (d *WordDictionary) Search(word string) bool {
    var dfs func(node *Trie, i int) bool
    dfs = func(node *Trie, i int) bool {
        if node == nil { return false }
        if i == len(word) { return node.isWord }
        if word[i] != '.' {
            return dfs(node.children[word[i]-'a'], i+1)
        }
        for _, child := range node.children {       // wildcard: try every branch
            if dfs(child, i+1) { return true }
        }
        return false
    }
    return dfs(d.root, 0)
}
```

O(len) with no dots, up to O(26^dots · len) pathologically — but the trie prunes
hard in practice, because a branch dies the moment no child exists.

---

**Q2. Word Search II (LC212) — the capstone: trie + grid backtracking.**

*Brute force:* run Word Search (§4.18) once per word — O(words · cells · 4^len).
*The waste:* every word re-walks the same grid paths.

**The fix:** walk the grid **once** while descending the trie in lockstep. The
moment the current path is not a prefix of *any* word, the branch dies — all
words are pruned simultaneously.

```go
next := node.children[ch-'a']
if next == nil { return }         // dead prefix: no word can continue this way
if next.word != "" {
    out = append(out, next.word)
    next.word = ""                // clearing it deduplicates for free
}
board[r][c] = '#'                 // mark in use
// ...recurse in four directions with `next`...
board[r][c] = ch                  // undo
```

Two neat touches: storing the finished **word** at its terminal node means the
DFS need not reconstruct the path, and clearing it after a hit means a word
reachable by several paths is reported exactly once.

---

### 4.13 Design

**Where it comes from.** No single structure gives you everything; compose two
whose weaknesses cancel.

- a **map** gives O(1) lookup but no order
- a **linked list** gives O(1) reordering but no lookup
- a **sorted slice** gives O(log n) search but O(n) insertion

**Naming which structure supplies which guarantee is what the question tests.**

---

**Q1. LRU Cache (LC146) — O(1) get and put.**

```go
type LRUCache struct {
    capacity   int
    items      map[int]*lruNode   // O(1) lookup
    head, tail *lruNode           // O(1) recency order — SENTINELS, never data
}
```

- **Doubly** linked, not singly: eviction and promotion must *unlink* a node in
  O(1), which requires knowing its predecessor without walking.
- **Two sentinel nodes** mean no branch ever asks "am I at the boundary?" — that
  is where hand-rolled linked lists usually break.
- **The node stores its own key.** On eviction you have the node and must
  `delete(c.items, lru.key)`; without the key stored you cannot find the map entry.

**The detail people miss:** a **read counts as a use**. Forgetting to promote in
`Get` silently turns it into a least-recently-*written* cache — a different
policy. There is a dedicated test for exactly that.

```go
func (c *LRUCache) Get(key int) int {
    n, ok := c.items[key]
    if !ok { return -1 }
    c.unlink(n)
    c.pushFront(n)     // <- the promotion
    return n.val
}
```

---

**Q2. Time Based Key-Value Store (LC981).**

*The observation that picks the structure:* timestamps arrive in **increasing
order**, so each key's history is *already sorted*. No sorting needed — the
lookup is a binary search.

```go
func (m *TimeMap) Get(key string, timestamp int) string {
    history := m.store[key]
    i := sort.Search(len(history), func(i int) bool {
        return history[i].time > timestamp        // first entry STRICTLY after
    })
    if i == 0 { return "" }                       // every version is newer
    return history[i-1].val                       // step back one
}
```

`Set` is O(1), `Get` is O(log n). This is Hash Map + Binary Search composed: the
map narrows to one key's history, the search finds the version inside it.

`sort.Search` is Go's built-in binary search over a predicate — it returns the
first index where the predicate becomes true. Worth knowing; it saves writing
`LowerBound` by hand.

---

### 4.14 Graphs & Grids

**Where it comes from.** Tree traversal plus a **visited set** — because graphs
can revisit.

**DFS or BFS? The only question that matters:**
- Just need to know *whether* things connect, or to enumerate a region? **DFS** —
  shorter, and recursion carries the state.
- Need **distance**, "fewest steps", "how many minutes"? **BFS** — it visits in
  order of distance, so the first arrival is the shortest. DFS gives no such
  guarantee.

**The offsets table** keeps every one of these functions short:

```go
var directions = [4][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
```

---

**Q1. Number of Islands (LC200).**

```go
func NumIslands(grid [][]byte) int {
    rows, cols := len(grid), len(grid[0])
    var sink func(r, c int)
    sink = func(r, c int) {
        if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1' { return }
        grid[r][c] = '0'                    // mark BEFORE recursing
        for _, d := range directions { sink(r+d[0], c+d[1]) }
    }
    count := 0
    for r := range rows {
        for c := range cols {
            if grid[r][c] == '1' { count++; sink(r, c) }
        }
    }
    return count
}
```

**Sinking the cell IS the visited set** — zero extra space. Mark *before*
recursing, or neighbours bounce straight back and you recurse forever.

**Say this:** it mutates the input. If the caller needs the grid intact, use a
separate `visited [][]bool` — mention the trade-off rather than silently
destroying the input.

Every cell is visited at most twice, so despite the nested loop plus recursion
this is O(rows·cols).

---

**Q2. Pacific Atlantic Water Flow (LC417) — reverse the question.**

*Brute force:* from every cell, can water reach both oceans? O((rc)²).
*The reframe that collapses it:* **climb uphill from each ocean's border** and
mark everything that could have drained there. Two sweeps, then intersect.
O(rows·cols).

```go
climb = func(r, c int, seen [][]bool, prev int) {
    if out of bounds || seen[r][c] || heights[r][c] < prev { return }   // uphill only
    seen[r][c] = true
    for _, d := range directions { climb(r+d[0], c+d[1], seen, heights[r][c]) }
}
```

`SolveSurroundedRegions` (LC130) uses the **same inversion**: instead of proving
a region is enclosed, mark everything reachable from the border as safe (`'T'`),
and whatever is still `'O'` is enclosed by definition.

**"Search inward from the border" is the transferable idea here.**

---

**Q3. Rotting Oranges (LC994) — multi-source BFS.**

*Why multi-source:* every already-rotten orange starts spreading at minute 0
**simultaneously**. Seeding the queue with all of them makes one BFS compute the
true parallel spread; looping a separate BFS per source is both slower and wrong
about the timing.

```go
for r := range rows {
    for c := range cols {
        switch grid[r][c] {
        case 1: fresh++
        case 2: queue = append(queue, [2]int{r, c})   // EVERY source, up front
        }
    }
}
minutes := 0
for len(queue) > 0 && fresh > 0 {
    size := len(queue)          // one level == one minute (same freeze as §4.11)
    for range size { /* spread to fresh neighbours, fresh-- */ }
    minutes++
}
if fresh > 0 { return -1 }      // walled-off oranges remain
```

**The `fresh` counter is what distinguishes "finished" from "unreachable"** — the
difference between returning `minutes` and `-1`. Note also that *no* fresh
oranges means 0, not −1.

`WallsAndGates` (LC286) is the same shape seeded from every gate.

---

**Q4. Clone Graph (LC133) — one line is the whole problem.**

```go
clone := &Node{Val: n.Val}
clones[n] = clone                 // REGISTER BEFORE RECURSING
for _, nb := range n.Neighbors {
    clone.Neighbors = append(clone.Neighbors, dfs(nb))
}
```

A graph has cycles, so a neighbour will point back at this node. If the clone is
not registered first, the recursion never terminates. The map doubles as the
visited set and the original→clone lookup.

**Go recursion depth:** a 1000×1000 grid can nest a million frames. Go's
goroutine stacks grow dynamically (into the hundreds of MB), so this survives
where a fixed-stack language overflows. Still prefer BFS for very large grids.

---

### 4.15 Topological Sort

**Where it comes from.** BFS driven by **in-degree** instead of adjacency.

**Recognise it.** "Prerequisites", "build order", "depends on", "install
before" — and, critically, **detecting a cycle in a DIRECTED graph**.

**Kahn's algorithm in one sentence:** repeatedly take a node with no remaining
prerequisites, output it, and decrement its dependents' counters.

> **The free cycle check** — this is why Kahn beats DFS for interviews: if the
> output is shorter than the node count, the leftovers are exactly the nodes
> trapped in a cycle. No colouring, no recursion-stack bookkeeping.

```go
func FindOrder(numCourses int, prerequisites [][]int) []int {
    adj := make([][]int, numCourses)
    indegree := make([]int, numCourses)
    for _, p := range prerequisites {
        course, prereq := p[0], p[1]
        adj[prereq] = append(adj[prereq], course)   // finish prereq -> unlock course
        indegree[course]++
    }
    queue := []int{}
    for c, d := range indegree {
        if d == 0 { queue = append(queue, c) }
    }
    order := make([]int, 0, numCourses)
    for len(queue) > 0 {
        course := queue[0]
        queue = queue[1:]
        order = append(order, course)
        for _, next := range adj[course] {
            indegree[next]--
            if indegree[next] == 0 { queue = append(queue, next) }
        }
    }
    if len(order) < numCourses { return nil }       // cycle
    return order
}
```

`CanFinish` (LC207) is `FindOrder(...) != nil`.

> **Edge direction is the number one bug here.** `[course, prereq]` means the
> edge runs **prereq → course**, and the in-degree belongs to the **course**.
> Draw two nodes and one arrow before writing the loop. There is a test named
> `TestFindOrderEdgeDirection` for exactly this.

---

**Q. Alien Dictionary (LC269).**

*The insight:* **adjacent words are the only source of information.** At their
first differing character, the earlier word's letter precedes the later one's —
and nothing after that position tells you anything, so `break` immediately.

```go
for i := 0; i+1 < len(words); i++ {
    a, b := words[i], words[i+1]
    shorter := min(len(a), len(b))
    if len(a) > len(b) && a[:shorter] == b[:shorter] {
        return ""                       // "abc" before "ab" is impossible input
    }
    for j := range shorter {
        if a[j] != b[j] {
            if !adj[a[j]][b[j]] { adj[a[j]][b[j]] = true; indegree[b[j]]++ }
            break                       // only the FIRST difference informs us
        }
    }
}
```

Then run Kahn over the letters. **The edge case interviewers probe** is the
prefix violation — a longer word can never precede its own prefix in a sorted
list.

*Implementation note:* this version keeps the ready set sorted, so it returns the
**lexicographically smallest** valid order. LeetCode accepts any valid order;
sorting just makes the result deterministic and testable. Say so — a
differently-ordered answer is equally correct.

---

### 4.16 Union-Find (Disjoint Set Union)

**Where it comes from.** DFS answers connectivity for a *fixed* graph. DSU
answers it for a graph whose edges **arrive over time**.

> **DSU or DFS? The deciding question: is the graph fixed or growing?**
> - Fixed, count the components once → **DFS**, it is simpler. Just use it.
> - Edges streaming in, or "which edge closes a cycle" → **DSU**, near-constant
>   per query instead of re-traversing everything.

**Two optimisations, and why each exists:**
1. **Path compression** — after a `Find`, point the nodes on the path straight at
   the root, so the next query is O(1).
2. **Union by rank** — hang the shorter tree under the taller, so the structure
   never degenerates into a linked list.

```go
func (u *UnionFind) Find(x int) int {
    for u.parent[x] != x {
        u.parent[x] = u.parent[u.parent[x]]   // path HALVING: point at grandparent
        x = u.parent[x]
    }
    return x
}

func (u *UnionFind) Union(a, b int) bool {
    rootA, rootB := u.Find(a), u.Find(b)
    if rootA == rootB { return false }        // ALREADY connected
    if u.rank[rootA] < u.rank[rootB] { rootA, rootB = rootB, rootA }
    u.parent[rootB] = rootA
    if u.rank[rootA] == u.rank[rootB] { u.rank[rootA]++ }
    u.count--
    return true
}
```

Together these give **O(α(n)) amortised** — inverse Ackermann, under 5 for any n
you will ever see. Say *"effectively constant"*; claiming exactly O(1) is wrong.

> **`Union` returning `false` IS the cycle detector.** An edge joining two
> already-connected nodes closes a cycle. Every problem below is a one-line
> variation on that fact.

| Problem | The one line |
|---|---|
| **Count Components** (LC323) | start at n, `Count()` after unioning everything |
| **Graph Valid Tree** (LC261) | `len(edges) == n-1` **and** no `Union` returns false **and** one component |
| **Redundant Connection** (LC684) | return the first edge whose `Union` returns false |

For **Valid Tree**, both conditions are needed: acyclic but disconnected is a
forest, not a tree. The edge-count check `len(edges) != n-1` is a free O(1)
pre-filter — too few cannot connect, too many must cycle.

---

### 4.17 Shortest Paths

**Where it comes from.** BFS finds the fewest *edges*. Add weights and BFS is no
longer correct — you need a heap (§4.10) to always expand the cheapest frontier.

**The decision table — this is the part to remember:**

| Situation | Algorithm | Cost |
|---|---|---|
| unweighted, or all weights equal | **plain BFS** — do not over-engineer | O(V+E) |
| weighted, non-negative | **Dijkstra** | O(E log V) |
| **negative** weights | **Bellman-Ford** | O(V·E) |
| "at most k edges/stops" | **Bellman-Ford, k+1 rounds** | O(k·E) |

**Why Dijkstra breaks on negative edges:** it finalises a node the moment it is
popped, betting no cheaper route exists. A negative edge can invalidate that bet
after the fact. Bellman-Ford makes no such bet — it just relaxes every edge
repeatedly.

---

**Q1. Network Delay Time (LC743) — Dijkstra.**

```go
dist := make(map[int]int, n)                        // FINALISED nodes only
frontier := &stateHeap{{node: k, cost: 0}}
for frontier.Len() > 0 {
    cur := heap.Pop(frontier).(state)
    if _, done := dist[cur.node]; done { continue } // already finalised, cheaper
    dist[cur.node] = cur.cost
    for _, nb := range adj[cur.node] {
        if _, done := dist[nb.node]; !done {
            heap.Push(frontier, state{nb.node, cur.cost + nb.cost})
        }
    }
}
if len(dist) != n { return -1 }
// the answer is the MAXIMUM distance — the signal is delivered when the LAST node hears it
```

**The "lazy" variant used here:** Go's heap has no decrease-key without an index
map, so push duplicates and skip a node the second time it is popped. Simpler,
same complexity, one extra log factor of pushes. Mention it; it shows you know
the textbook version differs.

---

**Q2. Cheapest Flights Within K Stops (LC787) — why NOT Dijkstra.**

The constraint is on the **number of edges**, not cost. Dijkstra finalises by
cost and would happily return a cheap 5-stop route when only 1 stop is allowed.
Bellman-Ford's rounds map exactly onto the edge budget.

```go
for range k + 1 {                       // k stops == k+1 flights
    next := slices.Clone(dist)          // read from a SNAPSHOT of last round
    for _, f := range flights {
        from, to, price := f[0], f[1], f[2]
        if dist[from] == unreachable { continue }
        next[to] = min(next[to], dist[from]+price)
    }
    dist = next
}
```

**The one detail that makes it correct:** relax from a *snapshot*. Updating in
place would let a path use two edges within a single round, silently exceeding
the stop limit. The test `FindCheapestPrice(3, cheap, 0, 2, 0) == 500` catches
exactly that bug.

---

### 4.18 Backtracking

**Where it comes from.** DFS over a tree of *decisions* instead of nodes, with an
explicit undo.

**Recognise it.** "All combinations / subsets / permutations / partitions",
"place N things without conflict", "does any arrangement work".

**The template. Every function in the package is this shape:**

```
backtrack(state):
    if state is a complete answer -> record a COPY, return
    for each candidate choice:
        if invalid -> skip            <- this is the pruning
        apply the choice
        backtrack(next state)
        undo the choice               <- the "backtrack"
```

> **Combinations or permutations?** Order does **not** matter → pass a `start`
> index so earlier elements are never revisited. Order **does** matter → loop over
> all elements with a `used` marker.

> **THE GO GOTCHA THAT BREAKS EVERY FIRST ATTEMPT.**
> `out = append(out, path)` stores a slice header sharing `path`'s array. The
> next undo mutates data you already "saved", and every recorded answer silently
> changes. Always `slices.Clone(path)`, or `string(buf)` for strings — which
> copies. There is a test (`TestSubsetsAreIndependentCopies`) whose only job is
> to catch this.

---

**Q1. Subsets (LC78).**

```go
func Subsets(nums []int) [][]int {
    out := [][]int{}
    path := []int{}
    var backtrack func(start int)
    backtrack = func(start int) {
        out = append(out, slices.Clone(path))   // EVERY node is an answer
        for i := start; i < len(nums); i++ {
            path = append(path, nums[i])        // choose
            backtrack(i + 1)                    // explore
            path = path[:len(path)-1]           // un-choose
        }
    }
    backtrack(0)
    return out
}
```

O(n·2ⁿ). Note the record happens on *entry*, not at a leaf — every node of the
recursion tree is a valid subset.

**Subsets II (LC90)** adds duplicate handling: sort, then
`if i > start && sorted[i] == sorted[i-1] { continue }`. **The `i > start` guard
is the trick** — it permits `[2,2]` going deeper (different levels) but blocks a
second `[2]` branch at the same level, which would generate an identical subtree.

---

**Q2. Combination Sum (LC39) — reuse allowed.**

```go
for i := start; i < len(sorted); i++ {
    if sorted[i] > remaining { break }        // real pruning: sorted, so all later fail
    path = append(path, sorted[i])
    backtrack(i, remaining-sorted[i])         // i, NOT i+1 -> reuse allowed
    path = path[:len(path)-1]
}
```

Two details: recursing with `i` is what permits reuse, and sorting enables the
`break` — genuine pruning, not cosmetic.

---

**Q3. Generate Parentheses (LC22) — where pruning IS the algorithm.**

*Brute force:* generate all 2^(2n) strings, filter the valid ones.
*Instead:* encode the two validity rules as the branch conditions, so every leaf
reached is already valid and nothing is ever discarded.

```go
if open < n   { /* '(' */ }     // may open while fewer than n are open
if closed < open { /* ')' */ }  // may close only while closers trail openers
```

The result count is the Catalan numbers (1, 2, 5, 14, …) — a good sanity check.

---

**Q4. N-Queens (LC51) — the O(1) conflict check.**

Place one queen per row, so rows never clash. For the rest:

| Constraint | Key |
|---|---|
| column | `c` |
| `\` diagonal | `r - c` (constant along it) |
| `/` diagonal | `r + c` |

Three sets of occupied keys turn "is this square attacked?" from an O(n) scan
into three lookups. The tests assert `SolveNQueens(8)` returns **92** solutions —
a good self-check on any implementation.

---

**Also in this package.** `Permute` (LC46 — `used` markers, O(n·n!)),
`LetterCombinations` (LC17 — a keypad table beats nested conditionals),
`Exist` (LC79 Word Search — the board itself is the visited set: overwrite with
`'#'`, recurse, restore), `Partition` (LC131 — the choice is *where the next
piece ends*, and the palindrome check prunes immediately).

---

### 4.19 Dynamic Programming

**Where it comes from.** Backtracking whose repeated subproblems are remembered.
If your recursion tree has the same node twice, you have a DP.

**The four questions that write a DP for you:**

1. **STATE** — what does the answer depend on? *(index, remaining budget, …)*
   The number of state variables **is** the dimension of your table.
2. **TRANSITION** — how does a state combine smaller states? Almost always
   *"take it or leave it"*.
3. **BASE CASE** — the smallest state answerable without recursion.
4. **ORDER** — iterate so dependencies are already computed.

**Top-down or bottom-up?** Write the recursion first (it mirrors the four
questions), then convert. Bottom-up wins on constant factors and enables the
rolling-array space trick; top-down wins when the reachable state space is far
smaller than the full table.

**The space trick used throughout:** if `dp[i]` only reads `dp[i-1]` and
`dp[i-2]`, two variables suffice. If a 2D `dp[i][j]` only reads row `i-1`, keep
two rows.

---

#### 1D DP

**Q1. Climbing Stairs (LC70) — the "hello world".**

`ways(n) = ways(n-1) + ways(n-2)`, because the last move was either a 1 or a 2.
Fibonacci in disguise; two rolling variables give O(1) space.

**Q2. House Robber (LC198) and II (LC213).**

```go
func Rob(nums []int) int {
    prev, cur := 0, 0
    for _, n := range nums {
        prev, cur = cur, max(cur, prev+n)   // skip this house, or take it + best from two back
    }
    return cur
}
```

**House Robber II is the reduction worth practising.** The houses form a circle,
so the first and last are adjacent. Rather than inventing a circular recurrence:
they can never *both* be robbed, so run the linear solver twice — once without
the last house, once without the first — and take the better.

```go
return max(Rob(nums[:len(nums)-1]), Rob(nums[1:]))
```

**Turning a new problem into one you have already solved is the move to
practise.** (Guard `len(nums) == 1` — the slicing trick leaves nothing.)

**Q3. Coin Change (LC322) — and why greedy fails.**

```go
for a := 1; a <= amount; a++ {
    for _, c := range coins {
        if c <= a { dp[a] = min(dp[a], dp[a-c]+1) }
    }
}
```

**Have the counter-example ready:** with coins `{1,3,4}` and amount 6, greedy
takes 4+1+1 = 3 coins, but 3+3 = 2 is optimal. That single example is why the
problem is DP and not greedy. It is in the test table.

**Q4. Longest Increasing Subsequence (LC300) — O(n²) then O(n log n).**

`dp[i]` = the longest increasing subsequence **ending at i**. Anchoring the state
at "ending here" is what makes the transition a simple scan of earlier indices.

The O(n log n) version keeps `tails[k]` = the *smallest possible tail* of an
increasing subsequence of length k+1. Keeping tails minimal keeps the array
sorted, so binary search finds where each value belongs.

> **Be precise about this one:** `tails` is **not** itself a valid subsequence —
> only its **length** is the answer. Claiming otherwise is a common error and an
> easy one for an interviewer to catch.

**Q5. Partition Equal Subset Sum (LC416) — 0/1 knapsack, and the loop direction.**

Two equal halves exist iff some subset sums to `total/2`. An odd total is
instantly false.

```go
for _, n := range nums {
    for s := target; s >= n; s-- {      // DOWNWARD
        if reachable[s-n] { reachable[s] = true }
    }
}
```

> **The direction of the inner loop is the entire answer.**
> **Downward** → each item used at most once (0/1 knapsack).
> **Upward** → each item reusable (unbounded knapsack — see `CoinChange2`).
> Same code, opposite meaning. This is the single highest-value DP detail to
> memorise.

**Q6. Maximum Product Subarray (LC152) — why Kadane alone fails.**

With multiplication, a large **negative** is a strong candidate: one more
negative flips it to a large positive. So track the running minimum alongside the
maximum, and **swap them when the incoming value is negative**, because it
inverts their roles.

```go
if n < 0 { curMax, curMin = curMin, curMax }
curMax = max(n, curMax*n)
curMin = min(n, curMin*n)
```

**Q7. Decode Ways (LC91).** Like Climbing Stairs with two validity rules: a
single digit must not be `'0'`, and a pair must land in 10..26. **`'0'` is the
whole difficulty** — it can only ever be the second half of "10" or "20". Check
`"100"` (answer 0) and `"2101"` (answer 1) against any implementation you write.

---

#### 2D DP

**Q8. Unique Paths (LC62) — the rolling array in one line.**

`dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Only the row above is ever read, so one row
suffices:

```go
row[c] += row[c-1]     // above (old value, not yet overwritten) + left (new value)
```

**Q9. Longest Common Subsequence (LC1143) — the two-string template.**

```go
if a[i-1] == b[j-1] {
    dp[i][j] = dp[i-1][j-1] + 1                 // both consumed
} else {
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])      // drop one from either
}
```

The `+1` row and column represent empty prefixes, which removes all boundary
special-casing. **Every two-string DP is a variation on this.**

**Q10. Edit Distance (LC72) — name the neighbours.**

| Operation | Table neighbour |
|---|---|
| replace | diagonal `prev[j-1]` |
| delete | above `prev[j]` |
| insert | left `cur[j-1]` |

```go
cur[j] = 1 + min(prev[j-1], prev[j], cur[j-1])   // Go's min is variadic
```

Matching characters cost nothing and just take the diagonal. **Naming which
neighbour is which operation** is what makes this memorable rather than magic.

**Q11. Coin Change II (LC518) — loop order changes the ANSWER.**

```go
for _, c := range coins {              // coins OUTER
    for a := c; a <= amount; a++ {     // amounts INNER, upward
        ways[a] += ways[a-c]
    }
}
```

> - coins outer, amounts inner → **combinations**. `{1,2}` counted once.
> - amounts outer, coins inner → **permutations**. `{1,2}` and `{2,1}` both count.
>
> Same three lines, different problem. Know which one you were asked for.

**Q12. Best Time to Buy and Sell Stock with Cooldown (LC309) — state-machine DP.**

Reach for this shape whenever the problem has **modes with legal transitions**.
Three states per day:

| State | Meaning | Transition |
|---|---|---|
| `hold` | holding a share | stay held, or buy from `rest` |
| `sold` | sold **today** | must have been holding |
| `rest` | free to buy | keep resting, or the cooldown elapsed |

```go
prevHold, prevSold, prevRest := hold, sold, rest    // SNAPSHOT of yesterday
hold = max(prevHold, prevRest-p)
sold = prevHold + p
rest = max(prevRest, prevSold)
```

Read from a snapshot, or a single day illegally performs two transitions. Return
`max(sold, rest)` — never end still holding.

---

**Also in this package.** `WordBreak` (LC139 — `dp[i]` = "the first i characters
are segmentable"; `dp[0] = true` seeds it), `LongestPalindrome` (LC5) and
`CountSubstrings` (LC647) — both **expand around centre**, which is O(n²) time
but **O(1) space**, beating the O(n²)-space DP table. There are **2n−1 centres**,
because even-length palindromes are centred between two characters.

---

### 4.20 Greedy

**Where it comes from.** DP you have proved you do not need.

> **Greedy or DP? The test that decides it:** can you argue that the locally best
> option never rules out the global optimum? If yes, greedy is O(n) and DP is
> over-engineering. If a locally worse choice can pay off later (Coin Change with
> `{1,3,4}`), greedy is simply **wrong**.

In an interview, state the **exchange argument** out loud — *"any solution using
X can be rewritten to use my choice without getting worse"*. That sentence is
what separates a justified greedy from a lucky guess.

---

**Q1. Jump Game (LC55) and Jump Game II (LC45).**

```go
// Can I reach the end? Only the FARTHEST reachable index matters.
reach := 0
for i, n := range nums {
    if i > reach { return false }        // a gap no earlier jump could clear
    reach = max(reach, i+n)
}
```

```go
// FEWEST jumps — this is BFS in disguise, which is the clean explanation.
jumps, curEnd, farthest := 0, 0, 0
for i := 0; i < len(nums)-1; i++ {       // stop before the last index
    farthest = max(farthest, i+nums[i])
    if i == curEnd {                     // this BFS "level" is exhausted
        jumps++
        curEnd = farthest
    }
}
```

`curEnd` is the boundary of the current level of reachable indices; scanning to
it discovers everything reachable in one more jump.

---

**Q2. Gas Station (LC134) — two independent facts.**

```go
total, tank, start := 0, 0, 0
for i := range gas {
    diff := gas[i] - cost[i]
    total += diff
    tank += diff
    if tank < 0 { start = i + 1; tank = 0 }
}
if total < 0 { return -1 }
return start
```

1. **Feasibility:** if total gas < total cost, no start works. Full stop.
2. **Which start:** whenever the running tank goes negative, no station in the
   stretch just walked can be the answer — each would start with even less fuel.
   So the next station becomes the only remaining candidate.

Given (1) holds, the surviving candidate is guaranteed correct — which is why one
pass suffices instead of trying all n starts.

---

**Q3. Partition Labels (LC763) — precomputation is the trick.**

Record each letter's **last** index first. Then sweep, stretching the current
part's end to the last occurrence of everything seen; when the cursor reaches
that end, nothing inside spills over, so cut.

```go
end = max(end, last[s[i]-'a'])
if i == end { out = append(out, end-start+1); start = i + 1 }
```

---

### 4.21 Bits & Math

**The five identities worth memorising:**

```
x ^ x == 0   and   x ^ 0 == x     ->  XOR cancels pairs
n & (n-1)                          ->  clears the LOWEST set bit
n & -n                             ->  isolates the lowest set bit
n >> 1                             ->  divide by 2 (floor, for n >= 0)
n & 1                              ->  the last bit, i.e. parity
```

> **Go note:** `>>` on a **negative** signed int is an *arithmetic* shift — the
> sign bit is copied, so `-8 >> 1 == -4` and shifting a negative never reaches 0.
> **Use `uint32`/`uint` whenever you loop over bits.**

| Problem | The move |
|---|---|
| **Single Number** (LC136) | XOR everything; pairs cancel, the loner survives. O(1) space beats the hash set. |
| **Number of 1 Bits** (LC191) | `n &= n-1` per iteration → runs once per **set** bit, not 32 times. |
| **Counting Bits** (LC338) | DP: `bits(i) = bits(i>>1) + (i&1)`. `i>>1` is smaller, so already computed. |
| **Reverse Bits** (LC190) | `out = out<<1 \| n&1; n >>= 1`, exactly 32 times. Width must be fixed → `uint32`. |
| **Sum of Two Integers** (LC371) | `a^b` is the sum without carries; `(a&b)<<1` is the carry. Repeat until no carry. |
| **Pow(x, n)** (LC50) | Exponentiation by squaring: `x^10 == (x²)^5`. O(log n). Beware `n == math.MinInt` at `-n`. |
| **Happy Number** (LC202) | **Floyd's fast & slow on a number sequence** — the successor function replaces `node.Next`. O(1) space, no visited set. |
| **Plus One** (LC66) | The only interesting case is all nines: the carry propagates past the front. |

`IsHappy` is the transfer worth pointing out in an interview: *"does this
sequence loop?"* is exactly linked-list cycle detection (§4.7).

---

### 4.22 Matrix

**Two recurring ideas:**
1. **Decompose** a hard transformation into easy ones.
2. **Shrink boundaries** instead of tracking visited cells.

**Q1. Rotate Image (LC48) — decomposition.**

90° clockwise = **transpose, then reverse each row**. Two simple passes replace
one error-prone index formula, and it is far easier to justify at a whiteboard.

```go
for r := range n {
    for c := r + 1; c < n; c++ {          // c starts at r+1, NOT r
        matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    }
}
for r := range n { slices.Reverse(matrix[r]) }
```

Starting `c` at `r` would swap every pair **twice** and undo the work. The test
asserts four rotations return the original — a property check that catches it.

**Q2. Spiral Matrix (LC54) — shrinking boundaries.**

Four boundaries replace a visited grid: walk the top row then push `top` down,
the right column then pull `right` in, and so on.

> **The two guards matter.** After the first two walks the remaining block can be
> empty, and without re-checking `top <= bottom` / `left <= right` a single
> leftover row or column is emitted **twice**. That is the bug this problem is
> really testing — the 4×3 case in the tests exists for it.

**Q3. Set Matrix Zeroes (LC73) — O(1) space by storing marks in the matrix.**

*Why it is tricky:* writing a zero immediately would be read as an *original*
zero by later iterations, cascading until everything is zero. Marks must be
recorded first, applied second.

*The O(1) trick:* use row 0 and column 0 as the mark storage. They overlap at
`[0][0]`, so capture their own original state in two booleans first, and rewrite
them **last** — after they have finished serving as markers. Three passes total.

---

## Part 5 — Blind 75 coverage map

Every entry is a tested function in this module. Use this as a checklist: cover
the column, not the rows.

| Pattern | Problems covered here | Go file |
|---|---|---|
| Hash Map / Set | Two Sum, Contains Duplicate, Valid Anagram, Group Anagrams, Top K Frequent, Longest Consecutive, Encode/Decode Strings, First Unique Char | [Go/hashmap/hashmap.go](Go/hashmap/hashmap.go) |
| Prefix Sum | Product Except Self, Subarray Sum = K, Contiguous Array, Pivot Index, Range Sum Query | [Go/prefixsum/prefixsum.go](Go/prefixsum/prefixsum.go) |
| Two Pointers | Valid Palindrome, Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water, Move Zeroes, Remove Duplicates, Sort Colors, Is Subsequence | [Go/twopointers/twopointers.go](Go/twopointers/twopointers.go) |
| Sliding Window | Best Time to Buy/Sell, Longest Substring w/o Repeating, Longest Repeating Char Replacement, Permutation in String, Minimum Window Substring, Sliding Window Maximum, Max Subarray (Kadane), K Distinct | [Go/slidingwindow/slidingwindow.go](Go/slidingwindow/slidingwindow.go) |
| Binary Search | Binary Search, Search Insert, Search Range, Search 2D Matrix, Search Rotated, Find Min Rotated, Find Peak, Koko, Median of Two Sorted Arrays | [Go/binarysearch/binarysearch.go](Go/binarysearch/binarysearch.go) |
| Stack | Valid Parentheses, Min Stack, Eval RPN, Daily Temperatures, Next Greater Element, Largest Rectangle | [Go/stack/stack.go](Go/stack/stack.go) |
| Linked List | Reverse List, Merge Two Sorted, Merge K Sorted, Remove Nth From End, Middle Node, Cycle I & II, Palindrome List, Reorder List, Find Duplicate | [Go/linkedlist/linkedlist.go](Go/linkedlist/linkedlist.go) |
| Intervals | Merge Intervals, Insert Interval, Non-overlapping, Meeting Rooms I & II, Interval Intersection | [Go/intervals/intervals.go](Go/intervals/intervals.go) |
| Cyclic Sort | Missing Number, Find Disappeared, Find Duplicates, First Missing Positive | [Go/cyclicsort/cyclicsort.go](Go/cyclicsort/cyclicsort.go) |
| Heap / Top-K | Kth Largest (×3), Top K Frequent, K Closest Points, Last Stone Weight, Task Scheduler, Median from Data Stream | [Go/heaptopk/heaptopk.go](Go/heaptopk/heaptopk.go) |
| Trees | Max Depth, Invert, Same Tree, Subtree, Diameter, Balanced, Good Nodes, Max Path Sum, Validate BST, Inorder, Kth Smallest, LCA of BST, Level Order, Right Side View, Zigzag, Build from Pre+In, Serialize/Deserialize | [Go/trees/trees.go](Go/trees/trees.go) |
| Trie | Implement Trie, Add & Search Words, Word Search II | [Go/trie/trie.go](Go/trie/trie.go) |
| Design | LRU Cache, Time Based Key-Value Store | [Go/design/design.go](Go/design/design.go) |
| Graphs | Number of Islands, Max Area of Island, Pacific Atlantic, Surrounded Regions, Rotting Oranges, Walls and Gates, Clone Graph | [Go/graphs/graphs.go](Go/graphs/graphs.go) |
| Topological Sort | Course Schedule I & II, Alien Dictionary | [Go/toposort/toposort.go](Go/toposort/toposort.go) |
| Union-Find | Count Components, Graph Valid Tree, Redundant Connection | [Go/unionfind/unionfind.go](Go/unionfind/unionfind.go) |
| Shortest Path | Network Delay Time, Cheapest Flights Within K Stops | [Go/shortestpath/shortestpath.go](Go/shortestpath/shortestpath.go) |
| Backtracking | Subsets I & II, Combination Sum, Permutations, Letter Combinations, Generate Parentheses, Word Search, Palindrome Partitioning, N-Queens | [Go/backtracking/backtracking.go](Go/backtracking/backtracking.go) |
| DP | Climbing Stairs, House Robber I & II, Coin Change I & II, LIS (×2), Word Break, Max Product Subarray, Decode Ways, Partition Equal Subset, Longest Palindromic Substring, Palindromic Substrings, Unique Paths, LCS, Edit Distance, Stock w/ Cooldown | [Go/dp/dp.go](Go/dp/dp.go) |
| Greedy | Jump Game I & II, Gas Station, Partition Labels | [Go/greedy/greedy.go](Go/greedy/greedy.go) |
| Bits & Math | Single Number, Number of 1 Bits, Counting Bits, Reverse Bits, Sum of Two Integers, Pow(x,n), Happy Number, Plus One | [Go/mathbits/mathbits.go](Go/mathbits/mathbits.go) |
| Matrix | Rotate Image, Spiral Matrix, Set Matrix Zeroes | [Go/matrix/matrix.go](Go/matrix/matrix.go) |

**Honest gaps.** This module does not cover: LFU Cache, Word Ladder, Longest
Consecutive in a BST, Sudoku Solver, Burst Balloons, Regular Expression Matching,
or segment/Fenwick trees. The first two are reasonable next additions; the rest
are beyond the Blind 75 bar for most interviews.

---

## Part 6 — A two-week revision schedule

Built on the ladder in Part 3: never revise a tier before the one it depends on.

| Day | Focus | Do this |
|---|---|---|
| 1 | Part 0 + Part 1 | Write `TwoSum`, `TwoSumSorted`, `MaxSumSubarrayK` from memory in Go |
| 2 | Hash Map, Prefix Sum | Group Anagrams, Longest Consecutive, Subarray Sum = K |
| 3 | Two Pointers | 3Sum, Trapping Rain Water, Sort Colors |
| 4 | Sliding Window | LC3, LC424, LC76 — say the amortised-O(n) argument out loud |
| 5 | Binary Search | Both bound templates from memory, then Koko, then LC33 |
| 6 | Stack | LC20, LC155, LC739, then LC84 |
| 7 | **Review** | Re-derive Part 2's recognition table from memory. Fill the gaps. |
| 8 | Linked List, Intervals, Cyclic Sort | LC142, LC287, LC56, LC253, LC41 |
| 9 | Heap, Design | LC215 three ways, LC295, LC146 |
| 10 | Trees | LC543, LC98, LC102, LC105, LC297 |
| 11 | Graphs, Topo, Union-Find | LC200, LC417, LC994, LC207, LC684 |
| 12 | Backtracking | LC78, LC39, LC22, LC51 — clone every recorded path |
| 13 | DP | The knapsack loop direction, LC1143, LC72, LC518 |
| 14 | Greedy, Bits, Matrix + **full review** | LC55, LC134, LC136, LC48, then re-read Parts 1–3 |

**How to practise, in order of value:**
1. Write the brute force. Say its complexity.
2. Name the waste in one sentence.
3. Write the optimal version **without looking**.
4. Run it against the brute force on the same inputs — that is what the tests in
   this module do, and it is the habit that catches your own wrong assumptions.

---

## Part 7 — Interview execution checklist

What to *say*, in order. The code is maybe half the evaluation.

1. **Restate the problem** and confirm one example by hand.
2. **Ask about constraints** — input size, value ranges, duplicates, empty input,
   negatives, Unicode. Several patterns are *selected* by a constraint
   (`FindDuplicate` uses Floyd rather than cyclic sort purely because "do not
   modify the input" was stated).
3. **State the brute force and its complexity.** Never skip this.
4. **Name the waste.** One sentence.
5. **Name the pattern that removes it**, and the target complexity.
6. **Then write code.** Narrate the invariant, not the syntax.
7. **Dry-run your own code** on the example from step 1, out loud.
8. **Volunteer the edge cases:** empty, single element, all duplicates, all
   negatives, k > n, target absent.
9. **State the final complexity, time and space** — and where the space goes.
10. **Offer the trade-off you did not take**: "the heap version is O(n log k) but
    a bucket sort is O(n) here", "this mutates the input; a visited grid avoids
    that at O(m·n) space".

Point 10 is what separates a senior answer from a correct one.

---

## Part 8 — Go gotcha cheat sheet

| # | Gotcha | The fix |
|---|---|---|
| 1 | Recording `path` in backtracking aliases the backing array | `slices.Clone(path)`, or `string(buf)` |
| 2 | `s[i:j]` is a **view**, not a copy | `slices.Clone` when you need independence |
| 3 | `copy()` on `[][]int` is **shallow** | allocate fresh inner slices before writing |
| 4 | `s[i]-'a'` on uppercase **wraps** to 224 (bytes are unsigned) | index by the raw byte into `[128]int` |
| 5 | `len(s)` on a string is **bytes**, not characters | `[]rune(s)` or `utf8.RuneCountInString` |
| 6 | `for i, r := range s` gives **byte offsets** and runes | use `for i := 0; i < len(s); i++` for byte work |
| 7 | Map iteration order is **randomised** | sort before comparing or printing |
| 8 | `h.Push` is not `heap.Push` | always call the package function |
| 9 | `Len/Less/Swap` value receivers, `Push/Pop` pointer receivers | see [§0.5](#05-containerheap-is-an-algorithm-not-a-container) |
| 10 | `>>` on a negative int is **arithmetic** — never reaches 0 | loop over bits with `uint32` |
| 11 | `make([]T, 0, negative)` **panics** | guard `k > len(nums)` first |
| 12 | Unused imports and variables are **compile errors** | remove them; `_ = x` only as a last resort |
| 13 | `nil` slice vs empty slice: both have `len == 0` | `append` works on `nil`; only `== nil` distinguishes them |
| 14 | Integer division **truncates toward zero** (`-7/2 == -3`) | matches LC150; differs from Python's floor |
| 15 | `min`/`max` are builtins (Go 1.21+) and **variadic** | `min(a, b, c)` — no helper needed |

---

## Running and extending the code

```bash
cd Go
go test ./...              # all 22 packages
go test ./dp/ -v           # one pattern, verbosely
go test ./... -run Median  # one problem across packages
go vet ./... && gofmt -l . # both should be silent
```

Each package's doc comment carries the pattern summary — `go doc dsa/heaptopk`
prints it. Every file follows the same order: **pattern header → brute force (when
instructive) → optimal solution → the "why" in comments**.

**A note on how this was verified.** Every solution here has a table-driven test
with edge cases, and where a brute-force version exists the tests assert the two
agree on the same inputs. Two bugs were caught this way while writing it — a byte
underflow in `CharacterReplacement` (§4.4) and an incorrect island-count
expectation in the author's own test data. That is exactly the value of the
brute-force oracle described in Part 1: **use it on yourself.**

---

*Companion documents: [PATTERNS_REVISION_GUIDE.md](DSA_ProblemSolving_patterns/PATTERNS_REVISION_GUIDE.md)
(the TypeScript version of the same patterns) and
[PROBLEM_INDEX.md](DSA_ProblemSolving_patterns/PROBLEM_INDEX.md) (the full repo index).*
