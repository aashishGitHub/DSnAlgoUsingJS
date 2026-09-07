# Linked List — Rewiring Patterns

**When to Use**: building or splicing lists by moving POINTERS.
**Time Complexity**: O(n) / O(N log k) | **Space Complexity**: O(1) / O(k)

## Scope of this folder

The **traversal**-flavoured list problems live in
[`../FastSlowPointers/`](../FastSlowPointers/) — that is also where `ListNode`
and the `createLinkedList` / `linkedListToArray` helpers are defined. This
folder covers the **rewiring** problems and imports that same node type rather
than redeclaring it.

| Already in FastSlowPointers | Here |
|---|---|
| `reverseList`, `reorderList`, `removeNthFromEnd`, `isPalindrome`, `middleNode`, `hasCycle`, `detectCycle` | `mergeTwoLists`, `mergeKLists` |

## The dummy-head technique

Building a list means special-casing the first node — it has no predecessor. A
**dummy node placed before the real head** removes that branch entirely: there is
always a predecessor, the loop body has one shape, and the answer is
`dummy.next`. Reach for it whenever a list is built or nodes are removed.

## Files

- **`linkedListPatterns.ts`**
  - `mergeTwoLists` (LC21) — the dummy-head archetype; O(1) space, relinks nodes
  - `mergeKListsBruteForce` (LC23) — the O(N · k) baseline, kept for the story
  - `mergeKLists` (LC23) ★ — heap of k cursors, O(N log k)
  - `mergeKListsDivide` (LC23) — pairwise merging, same O, **no heap needed**

## The LC23 story

Name the naive fold as O(N · k), point at the **re-traversal of already-merged
nodes** as the waste, then remove it two ways: a heap of k cursors, or pairwise
divide and conquer. Being able to offer both is what distinguishes the answer —
and the second is the one to reach for when told "now without a priority queue".

## Related

- [`../Heap/`](../Heap/) — supplies the `PriorityQueue` used by `mergeKLists`

> **Tests:** no vitest file yet. Verified against LeetCode samples plus a
> randomized oracle across all three `mergeK` implementations; not committed.
