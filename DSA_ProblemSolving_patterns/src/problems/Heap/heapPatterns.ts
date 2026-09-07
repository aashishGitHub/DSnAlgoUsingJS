/**
 * ============================================================================
 * HEAP / PRIORITY QUEUE (LeetCode 215, 295, 703, 973, 1046, 23)
 * ============================================================================
 *
 * PATTERN:
 * - A heap answers ONE question in O(log n): "what is the smallest (or largest)
 *   item right now?" — while the collection keeps changing. That last clause is
 *   the whole point: sorting answers it once, a heap answers it continuously.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * - "Find the k largest" by sorting is O(n log n) and throws away almost all of
 *   the work — a full ordering was computed to use k of it. A MIN-heap capped at
 *   size k is O(n log k): push each element, evict the smallest whenever the
 *   heap exceeds k, and whatever survives is the top k. For streaming input,
 *   sorting is not merely slower — it is IMPOSSIBLE, because the data never ends.
 *
 * ⚠️ THE COUNTER-INTUITIVE BIT WORTH SAYING OUT LOUD:
 *   k LARGEST  → use a MIN-heap of size k
 *   k SMALLEST → use a MAX-heap of size k
 *
 * Why a MIN-heap for the k largest: its root is the weakest of the k survivors,
 * which makes it exactly the one to evict when a better element arrives.
 * Getting this pairing backwards is the classic top-k mistake.
 *
 * WHY A HEAP IS NOT A SORTED LIST: a heap is only PARTIALLY ordered — every
 * parent beats its children, and siblings are unrelated. That weaker promise is
 * what makes insertion O(log n) instead of O(n), and it is why iterating a heap
 * does NOT produce sorted output.
 *
 * RECOGNITION CUES:
 * - "top k / k closest / k most frequent"        → heap of size k
 * - "median of a STREAM"                         → two heaps
 * - "merge k sorted things"                      → heap of k cursors
 * - "always process the smallest/largest next"   → heap (Dijkstra, scheduling)
 * - "kth largest, repeatedly, as data arrives"   → heap, not sorting
 *
 * REAL-WORLD ANALOGIES:
 * - OS task scheduling and event loops (earliest deadline first).
 * - Hospital triage: arrival order is irrelevant, severity decides.
 * - Leaderboards over a live event stream.
 *
 * COMPLEXITY SUMMARY:
 *   PriorityQueue push/pop   O(log n)      peek O(1)
 *   MedianFinder addNum      O(log n)      findMedian O(1)
 *   KthLargest.add           O(log k)      Space O(k)
 *   kClosest / lastStoneWeight               O(n log n)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * PRIORITY QUEUE — the reusable binary heap this repo was missing
 * ----------------------------------------------------------------------------
 * A binary heap stored in a flat array. For the node at index i:
 *
 *     parent(i) = (i - 1) >> 1        left(i) = 2i + 1        right(i) = 2i + 2
 *
 * No pointers and no tree nodes — the array indices ARE the tree. That is why
 * heaps are fast in practice: the layout is contiguous and cache-friendly.
 *
 * THE TWO OPERATIONS EVERYTHING IS BUILT FROM:
 *   - siftUp (used by push): a new leaf swaps upward until its parent beats it.
 *   - siftDown (used by pop): the root is replaced by the last leaf, which then
 *     sinks until both of its children lose to it.
 *
 * Both walk a single root-to-leaf path, so both are O(log n).
 *
 * `compare(a, b) < 0` means "a has higher priority than b" — the same contract
 * as Array.prototype.sort, so a min-heap is `(a, b) => a - b`.
 *
 * @example
 * const pq = new PriorityQueue<number>((a, b) => a - b); // min-heap
 * pq.push(5); pq.push(1); pq.push(3);
 * pq.peek(); // 1
 * pq.pop();  // 1
 * pq.pop();  // 3
 *
 * Time: push/pop O(log n), peek O(1). Space: O(n).
 */
export class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private readonly compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /** The highest-priority item, without removing it. O(1). */
  peek(): T | undefined {
    return this.heap[0];
  }

  /** Insert, then bubble the new leaf up to its rightful place. O(log n). */
  push(value: T): void {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  /**
   * Remove and return the highest-priority item. O(log n).
   * The last leaf is moved to the root and sunk, which keeps the tree complete.
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const top = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last; // fill the hole, then restore the heap property
      this.siftDown(0);
    }

    return top;
  }

  /** Snapshot of the contents — NOT in sorted order (a heap is partial). */
  toArray(): T[] {
    return [...this.heap];
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parent = (index - 1) >> 1;
      // Stop as soon as the parent legitimately outranks the child.
      if (this.compare(this.heap[index], this.heap[parent]) >= 0) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private siftDown(index: number): void {
    const n = this.heap.length;

    for (;;) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let best = index;

      // Compare against BOTH children and sink toward the stronger one;
      // sinking toward the weaker child would break the heap property.
      if (left < n && this.compare(this.heap[left], this.heap[best]) < 0) best = left;
      if (right < n && this.compare(this.heap[right], this.heap[best]) < 0) best = right;

      if (best === index) break; // already outranks both children
      this.swap(index, best);
      index = best;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}

/** Min-heap of numbers — smallest on top. */
export class MinHeap extends PriorityQueue<number> {
  constructor() {
    super((a, b) => a - b);
  }
}

/** Max-heap of numbers — largest on top. Just the inverted comparator. */
export class MaxHeap extends PriorityQueue<number> {
  constructor() {
    super((a, b) => b - a);
  }
}

/**
 * ----------------------------------------------------------------------------
 * FIND MEDIAN FROM DATA STREAM (LeetCode 295) ★ THE TWO-HEAPS PATTERN
 * ----------------------------------------------------------------------------
 * PROBLEM: numbers arrive one at a time; report the median at any moment.
 *
 * WHY SORTING FAILS: re-sorting per query is O(n log n) each time, and even an
 * insertion into a sorted array is O(n) because of the shifting. The stream
 * never ends, so any approach that re-processes history is unusable.
 *
 * THE INSIGHT: the median only needs the MIDDLE, so keep the data split in half
 * and never order the halves internally:
 *   - `low` is a MAX-heap holding the smaller half, so its top is the LARGEST
 *     of the small numbers.
 *   - `high` is a MIN-heap holding the larger half, so its top is the SMALLEST
 *     of the large numbers.
 *
 * Those two tops are the middle elements. The median is either `low`'s top
 * (odd count) or the average of both tops (even count) — O(1) to read.
 *
 * THE TWO INVARIANTS to restate every time:
 *   1. ORDER — every value in `low` is ≤ every value in `high`.
 *   2. BALANCE — their sizes differ by at most 1. This implementation lets
 *      `low` hold the extra element, so an odd count reads straight off `low`.
 *
 * THE PUSH-THEN-REBALANCE TRICK: always push into `low`, immediately move
 * `low`'s top into `high` (which enforces invariant 1 unconditionally), then
 * move back if `high` grew too large (restoring invariant 2). Doing it in this
 * fixed order avoids a nest of comparisons and is much harder to get wrong live.
 *
 * DRY-RUN — add 1, add 2, findMedian, add 3, findMedian:
 *   add 1 → low[1] → shift → high[1] → high bigger → shift back → low[1], high[]
 *           median = 1
 *   add 2 → low[2,1] → shift 2 → high[2], low[1]
 *           median = (1 + 2) / 2 = 1.5  ✓
 *   add 3 → low[3,1] → shift 3 → high[2,3], low[1] → high bigger → shift 2 back
 *           low[2,1], high[3]
 *           median = low top = 2  ✓
 *
 * @example
 * const mf = new MedianFinder();
 * mf.addNum(1);
 * mf.addNum(2);
 * mf.findMedian(); // 1.5
 * mf.addNum(3);
 * mf.findMedian(); // 2
 *
 * Time: addNum O(log n), findMedian O(1). Space: O(n).
 */
export class MedianFinder {
  private low = new MaxHeap();  // smaller half — largest of them on top
  private high = new MinHeap(); // larger half  — smallest of them on top

  addNum(num: number): void {
    // 1. Always enter through `low`.
    this.low.push(num);

    // 2. Hand `low`'s largest to `high`. This alone guarantees every element of
    //    `low` is <= every element of `high`, whatever the incoming value was.
    this.high.push(this.low.pop()!);

    // 3. Rebalance so `low` is never smaller than `high`.
    if (this.high.size > this.low.size) {
      this.low.push(this.high.pop()!);
    }
  }

  findMedian(): number {
    // `low` carries the extra element on odd counts, so its top is the median.
    if (this.low.size > this.high.size) return this.low.peek()!;
    return (this.low.peek()! + this.high.peek()!) / 2;
  }
}

/**
 * ----------------------------------------------------------------------------
 * KTH LARGEST ELEMENT IN A STREAM (LeetCode 703)
 * ----------------------------------------------------------------------------
 * Report the kth largest value seen so far, after every insertion.
 *
 * THE SIZE-k MIN-HEAP: hold exactly the k largest values seen. The heap's ROOT
 * is the smallest of those — which is, by definition, the kth largest overall.
 * Any new value bigger than the root evicts it; anything smaller is discarded
 * immediately, because it can never enter the top k.
 *
 * This is the "k largest → MIN-heap" rule from the header, and it is why the
 * structure stays O(k) in space no matter how long the stream runs.
 *
 * DRY-RUN with k = 3 on [4, 5, 8, 2], then add 3, 5, 10:
 *   seed → heap holds {4,5,8} (2 evicted)   root 4 → kth largest = 4
 *   add 3  → 3 < root 4 → rejected           → 4
 *   add 5  → 5 > 4 → evict 4, heap {5,5,8}   → 5
 *   add 10 → 10 > 5 → evict 5, heap {5,8,10} → 5
 *
 * @example
 * const kth = new KthLargest(3, [4, 5, 8, 2]);
 * kth.add(3);  // 4
 * kth.add(5);  // 5
 * kth.add(10); // 5
 *
 * Time: O(log k) per add. Space: O(k) — independent of the stream length.
 */
export class KthLargest {
  private heap = new MinHeap();

  constructor(private readonly k: number, nums: number[]) {
    for (const num of nums) this.add(num);
  }

  add(val: number): number {
    this.heap.push(val);
    // Keep only the k largest; the evicted one is the current smallest.
    if (this.heap.size > this.k) this.heap.pop();
    return this.heap.peek()!; // root of a size-k min-heap = kth largest
  }
}

/**
 * ----------------------------------------------------------------------------
 * K CLOSEST POINTS TO ORIGIN (LeetCode 973)
 * ----------------------------------------------------------------------------
 * "k closest" is "k smallest by distance", so by the rule in the header this
 * wants a MAX-heap of size k — the root is the worst survivor, the one to evict.
 *
 * ⚠️ SKIP THE SQUARE ROOT: comparing √(x²+y²) and comparing x²+y² give the same
 * ORDER, because √ is monotonic on non-negative numbers. Dropping it avoids
 * floating-point error and is faster. Interviewers look for this.
 *
 * DRY-RUN on [[1,3],[-2,2]], k = 1:
 *   [1,3]  → dist² = 1 + 9 = 10 → heap {10}
 *   [-2,2] → dist² = 4 + 4 = 8  → heap {10, 8}, size 2 > 1 → evict the max (10)
 *   → [[-2, 2]]  ✨
 *
 * @example
 * kClosest([[1, 3], [-2, 2]], 1);          // [[-2, 2]]
 * kClosest([[3, 3], [5, -1], [-2, 4]], 2); // [[3,3],[-2,4]]  (order not guaranteed)
 *
 * Time: O(n log k). Space: O(k).
 */
export function kClosest(points: number[][], k: number): number[][] {
  // Max-heap by squared distance: the farthest point sits on top, ready to go.
  const heap = new PriorityQueue<number[]>(
    (a, b) => (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])
  );

  for (const point of points) {
    heap.push(point);
    if (heap.size > k) heap.pop(); // drop the current farthest
  }

  return heap.toArray();
}

/**
 * ----------------------------------------------------------------------------
 * LAST STONE WEIGHT (LeetCode 1046)
 * ----------------------------------------------------------------------------
 * Repeatedly smash the two heaviest stones; if they differ, the difference goes
 * back into the pile. Return the last stone's weight, or 0.
 *
 * A textbook "always take the largest two, then put something back" loop — the
 * put-back is what rules out sorting once, because the pile keeps changing.
 *
 * DRY-RUN on [2, 7, 4, 1, 8, 1]:
 *   heap {8,7,4,2,1,1} → smash 8,7 → 1 back  → {4,2,1,1,1}
 *   smash 4,2 → 2 back                        → {2,1,1,1}
 *   smash 2,1 → 1 back                        → {1,1,1}
 *   smash 1,1 → equal, both destroyed         → {1}
 *   → 1  ✨
 *
 * @example
 * lastStoneWeight([2, 7, 4, 1, 8, 1]); // 1
 * lastStoneWeight([1]);                // 1
 *
 * Time: O(n log n). Space: O(n).
 */
export function lastStoneWeight(stones: number[]): number {
  const heap = new MaxHeap();
  for (const stone of stones) heap.push(stone);

  while (heap.size > 1) {
    const heaviest = heap.pop()!;
    const second = heap.pop()!;
    // Equal stones annihilate; otherwise the remainder rejoins the pile.
    if (heaviest !== second) heap.push(heaviest - second);
  }

  return heap.size === 0 ? 0 : heap.peek()!;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The rule to state before writing any top-k code:
 *      k LARGEST  → MIN-heap of size k   (root = the weakest survivor = answer)
 *      k SMALLEST → MAX-heap of size k
 *    Sorting is O(n log n); a size-k heap is O(n log k) and O(k) space.
 * 2. Say why a heap and not a sorted structure: a heap is only PARTIALLY
 *    ordered (parent beats children, siblings unrelated), which buys O(log n)
 *    insertion. It also means iterating a heap is NOT sorted order.
 * 3. Streaming is the real tell. If data arrives continuously, sorting is not
 *    just slower — there is nothing to sort yet. LC295 and LC703 are both
 *    "sorting is impossible here" questions.
 * 4. Two heaps for a streaming median: max-heap for the low half, min-heap for
 *    the high half. Recite the invariants (order, then balance) and use the
 *    push→shift→rebalance sequence so the ordering invariant holds
 *    unconditionally instead of through case analysis.
 * 5. Compare squared distances, never square roots — same ordering, no floating
 *    point error (LC973).
 * 6. Complexity talking point: building a heap from n items by pushing is
 *    O(n log n), but heapifying in place bottom-up is O(n). Worth naming.
 * 7. Follow-ups you may get: Dijkstra (a heap keyed by distance — the natural
 *    next step from ../Graph/), Merge k Sorted Lists (see
 *    ../LinkedList/linkedListPatterns.ts), and task schedulers / meeting rooms
 *    II, which are heaps keyed by end time.
 */
