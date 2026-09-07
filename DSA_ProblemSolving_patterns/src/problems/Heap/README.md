# Heap / Priority Queue Pattern

**When to Use**: "what is the smallest/largest right now?" asked **repeatedly
while the collection changes** — especially over a stream.
**Time Complexity**: O(log n) push/pop, O(1) peek | **Space**: O(n)

## ⚠️ The rule people get backwards

| Want | Use | Because |
|---|---|---|
| k **largest** | **MIN**-heap of size k | the root is the weakest survivor — the one to evict |
| k **smallest** | **MAX**-heap of size k | mirror image |

Sorting is O(n log n); a size-k heap is **O(n log k)** and O(k) space. And for a
stream, sorting is not merely slower — there is nothing to sort yet.

## Why a heap is not a sorted list

A heap is only **partially** ordered: every parent beats its children, siblings
are unrelated. That weaker promise is what buys O(log n) insertion — and it means
iterating a heap does **not** give sorted output.

## Files

- **`heapPatterns.ts`**
  - `PriorityQueue<T>` — the reusable binary heap this repo was missing;
    array-backed (`parent = (i-1) >> 1`), `siftUp` / `siftDown`
  - `MinHeap` / `MaxHeap` — number wrappers, just an inverted comparator
  - `MedianFinder` (LC295) — **the two-heaps pattern**
  - `KthLargest` (LC703), `kClosest` (LC973), `lastStoneWeight` (LC1046)

## The two-heaps invariants (LC295)

1. **Order** — every value in `low` (max-heap) ≤ every value in `high` (min-heap)
2. **Balance** — sizes differ by at most 1; `low` carries the extra

Use the fixed **push → shift → rebalance** sequence: always push into `low`, move
`low`'s top to `high` (which enforces invariant 1 unconditionally), then move back
if `high` outgrew `low`. Far harder to get wrong than case analysis.

## Note on other heaps in this repo

`Arrays/kthLargest.js` has its own `MinHeap` and `HashMap/topKFrequent.ts` has a
private one hardcoded to `[value, freq]` tuples. Both predate this folder; new
code should use `PriorityQueue` here.

## Related

- [`../LinkedList/`](../LinkedList/) → `mergeKLists` (LC23) uses this heap
- [`../Graph/`](../Graph/) — Dijkstra is the natural next step (a heap keyed by distance)

> **Tests:** no vitest file yet. Verified against LeetCode samples plus randomized
> oracles (heap drains in sorted order; `MedianFinder` matches a sorted median),
> but those checks are not committed.
