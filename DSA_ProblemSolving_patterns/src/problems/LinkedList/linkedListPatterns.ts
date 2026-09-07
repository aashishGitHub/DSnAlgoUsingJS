/**
 * ============================================================================
 * LINKED LIST — REWIRING PATTERNS (LeetCode 21, 23)
 * ============================================================================
 *
 * PATTERN:
 * - These problems are about REWIRING pointers, not about traversal. The
 *   traversal-flavoured list problems (cycle detection, middle, reorder,
 *   remove-nth, palindrome) live in ../FastSlowPointers/, which is also where
 *   `ListNode` and the array⇄list helpers are defined — reused here rather than
 *   redeclared, so both folders speak the same node type.
 *
 * ============================================================================
 * THE DUMMY-HEAD TECHNIQUE — the one idea that makes list code clean
 * ============================================================================
 * Building a list means special-casing the very first node: there is no
 * predecessor to attach it to, so every naive solution opens with
 * `if (result === null) { result = node } else { tail.next = node }`.
 *
 * A DUMMY node placed before the real head removes that branch entirely. There
 * is always a predecessor, so the loop body has ONE shape, and the real answer
 * is `dummy.next` at the end. It costs one allocation and deletes a whole class
 * of null-pointer bugs — reach for it whenever a list is being BUILT or nodes
 * are being REMOVED.
 *
 * RECOGNITION CUES:
 * - "merge sorted lists"                  → dummy head + two/k cursors
 * - "remove/insert nodes"                 → dummy head (the head may itself go)
 * - "merge K of anything sorted"          → heap of k cursors, or divide & conquer
 *
 * REAL-WORLD ANALOGIES:
 * - Merging already-sorted log streams from k servers into one timeline.
 * - The merge step of an external merge sort over files too large for memory.
 *
 * COMPLEXITY SUMMARY:
 *   mergeTwoLists          Time O(n + m)      Space O(1)
 *   mergeKListsBruteForce  Time O(N · k)      Space O(1)
 *   mergeKLists (heap)     Time O(N log k)    Space O(k)
 *   mergeKListsDivide      Time O(N log k)    Space O(log k) recursion
 *   (N = total nodes across all lists, k = number of lists)
 * ============================================================================
 */

import { ListNode } from "../FastSlowPointers/fastSlowPointers";
import { PriorityQueue } from "../Heap/heapPatterns";

// Re-exported so list problems can be imported from one place.
export { ListNode };

/**
 * ----------------------------------------------------------------------------
 * MERGE TWO SORTED LISTS (LeetCode 21) ★ THE DUMMY-HEAD ARCHETYPE
 * ----------------------------------------------------------------------------
 * Splice two sorted lists into one sorted list by RELINKING existing nodes —
 * no new nodes, so the space cost is O(1).
 *
 * THE LOOP: compare the two heads, attach the smaller, advance that list only.
 * When one list runs dry the other is already sorted, so attach the remainder
 * wholesale instead of walking it node by node.
 *
 * DRY-RUN on [1,2,4] and [1,3,4]:
 *   dummy → _                     a=1  b=1
 *   1 <= 1 → take a's 1           → _→1        a=2  b=1
 *   2 >  1 → take b's 1           → _→1→1      a=2  b=3
 *   2 <= 3 → take a's 2           → _→1→1→2    a=4  b=3
 *   4 >  3 → take b's 3           → …→3        a=4  b=4
 *   4 <= 4 → take a's 4           → …→4        a=null
 *   a is empty → attach the rest of b (4) in one move
 *   → dummy.next = [1,1,2,3,4,4]  ✨
 *
 * @example
 * // Real-world: merge two already-sorted event streams into one timeline.
 * const a = createLinkedList([1, 2, 4]);
 * const b = createLinkedList([1, 3, 4]);
 * linkedListToArray(mergeTwoLists(a, b)); // [1, 1, 2, 3, 4, 4]
 *
 * Time:  O(n + m) — every node is visited once.
 * Space: O(1) — nodes are relinked, not copied.
 */
export function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0); // removes the "is this the first node?" branch
  let tail = dummy;

  let a = list1;
  let b = list2;

  while (a !== null && b !== null) {
    if (a.val <= b.val) {
      tail.next = a; // <= keeps the merge STABLE (equal values keep list1 first)
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  // Exactly one list can be non-empty, and it is already sorted — attach it whole.
  tail.next = a !== null ? a : b;

  return dummy.next; // the real head; the dummy is discarded
}

/**
 * ----------------------------------------------------------------------------
 * MERGE K SORTED LISTS (LeetCode 23) — APPROACH 1: sequential merging
 * ----------------------------------------------------------------------------
 * The naive baseline: fold the lists one at a time into an accumulator.
 *
 * WHY IT IS SLOW — and the analysis is the point of asking: the accumulator
 * grows as lists are absorbed, and every later merge re-walks all of it. List i
 * is traversed roughly (k - i) more times, giving 1 + 2 + … + k passes over
 * ~N/k nodes each → O(N · k). The waste is RE-TRAVERSAL of already-merged
 * nodes, and both optimal solutions below attack exactly that.
 *
 * @example
 * const lists = [createLinkedList([1,4,5]), createLinkedList([1,3,4]), createLinkedList([2,6])];
 * linkedListToArray(mergeKListsBruteForce(lists)); // [1,1,2,3,4,4,5,6]
 *
 * Time: O(N · k). Space: O(1).
 */
export function mergeKListsBruteForce(lists: (ListNode | null)[]): ListNode | null {
  let merged: ListNode | null = null;
  for (const list of lists) {
    merged = mergeTwoLists(merged, list); // accumulator re-walked every round
  }
  return merged;
}

/**
 * ----------------------------------------------------------------------------
 * MERGE K SORTED LISTS (LeetCode 23) ★ OPTIMAL — heap of k cursors
 * ----------------------------------------------------------------------------
 * THE INSIGHT: at any moment only the k list-heads can be the next smallest, so
 * the question "which of these k is smallest?" repeats N times over a CHANGING
 * set — the exact job of a heap. Keep one cursor per list; pop the smallest,
 * append it, and push that list's successor.
 *
 * Each node enters and leaves the heap once, and the heap never exceeds k, so
 * the cost is O(N log k) instead of the naive O(N · k). Nothing already merged
 * is ever re-examined, which is precisely the waste named above.
 *
 * ⚠️ The heap must hold NODES, not values — the successor pointer is needed to
 * refill the cursor after a pop.
 *
 * DRY-RUN on [[1,4,5], [1,3,4], [2,6]]:
 *   seed heap with the three heads → {1ᴬ, 1ᴮ, 2ᶜ}
 *   pop 1ᴬ → out [1]        push 4ᴬ   heap {1ᴮ, 2ᶜ, 4ᴬ}
 *   pop 1ᴮ → out [1,1]      push 3ᴮ   heap {2ᶜ, 3ᴮ, 4ᴬ}
 *   pop 2ᶜ → out [1,1,2]    push 6ᶜ   heap {3ᴮ, 4ᴬ, 6ᶜ}
 *   pop 3ᴮ → out [1,1,2,3]  push 4ᴮ   heap {4ᴬ, 4ᴮ, 6ᶜ}
 *   … → [1,1,2,3,4,4,5,6]  ✨
 *
 * @example
 * // Real-world: merge k already-sorted log files into one ordered stream.
 * const lists = [createLinkedList([1,4,5]), createLinkedList([1,3,4]), createLinkedList([2,6])];
 * linkedListToArray(mergeKLists(lists)); // [1,1,2,3,4,4,5,6]
 *
 * Time:  O(N log k). Space: O(k) for the heap.
 */
export function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  const heap = new PriorityQueue<ListNode>((a, b) => a.val - b.val);

  // Seed with one cursor per non-empty list.
  for (const list of lists) {
    if (list !== null) heap.push(list);
  }

  const dummy = new ListNode(0);
  let tail = dummy;

  while (!heap.isEmpty()) {
    const smallest = heap.pop()!;
    tail.next = smallest;
    tail = tail.next;

    // Refill the cursor from the list the node came from.
    if (smallest.next !== null) heap.push(smallest.next);
  }

  tail.next = null; // sever any stale pointer from the last node
  return dummy.next;
}

/**
 * ----------------------------------------------------------------------------
 * MERGE K SORTED LISTS — APPROACH 3: divide and conquer (no heap needed)
 * ----------------------------------------------------------------------------
 * Same O(N log k), reached differently: pair the lists up and merge pairwise,
 * halving the count each round, until one remains. Each of the log k rounds
 * touches every node once.
 *
 * Worth knowing because it needs NO auxiliary data structure — useful when the
 * interviewer says "now do it without a priority queue", and it is the same
 * recursion shape as merge sort's merge step.
 *
 *   round 0: [A] [B] [C] [D]  →  merge(A,B), merge(C,D)
 *   round 1: [AB] [CD]        →  merge(AB, CD)
 *   round 2: [ABCD]
 *
 * @example
 * const lists = [createLinkedList([1,4,5]), createLinkedList([1,3,4]), createLinkedList([2,6])];
 * linkedListToArray(mergeKListsDivide(lists)); // [1,1,2,3,4,4,5,6]
 *
 * Time: O(N log k). Space: O(log k) recursion depth.
 */
export function mergeKListsDivide(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;

  function mergeRange(start: number, end: number): ListNode | null {
    if (start === end) return lists[start];

    const mid = (start + end) >> 1;
    const left = mergeRange(start, mid);
    const right = mergeRange(mid + 1, end);
    return mergeTwoLists(left, right);
  }

  return mergeRange(0, lists.length - 1);
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Reach for a DUMMY HEAD whenever a list is built or nodes are removed. It
 *    deletes the "first node has no predecessor" special case, so the loop body
 *    has one shape, and the answer is `dummy.next`.
 * 2. Merging relinks existing nodes — O(1) space. Say so; candidates often
 *    allocate a fresh list without noticing they did not have to.
 * 3. When one list empties, attach the OTHER WHOLE remainder in one assignment
 *    rather than looping. Small thing, but it shows you noticed it is sorted.
 * 4. Use `<=` rather than `<` in the comparison to keep the merge STABLE.
 * 5. LC23's story is the interview: name the naive fold as O(N · k), point at
 *    the re-traversal of already-merged nodes as the waste, then remove it
 *    either with a heap of k cursors (O(N log k), O(k) space) or by pairwise
 *    divide and conquer (same time, no extra structure). Being able to offer
 *    both is what distinguishes the answer.
 * 6. The heap must store NODES, not values — you need `.next` to advance the
 *    cursor after popping.
 * 7. Related, already in this repo: ../FastSlowPointers/ has `reverseList`,
 *    `reorderList`, `removeNthFromEnd`, `hasCycle`/`detectCycle`, `middleNode`
 *    and the `createLinkedList`/`linkedListToArray` test helpers.
 */
