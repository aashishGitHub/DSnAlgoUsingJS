/**
 * ============================================================================
 * MIN BINARY HEAP (Array-Based)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Maintain a collection that supports:
 * - Insert a value in O(log n)
 * - Extract the minimum value in O(log n)
 * - Minimum is always at the root (index 0)
 *
 * PATTERN:
 * - Complete binary tree stored in an array.
 * - For index i: parent at floor((i-1)/2), left child at 2*i+1, right at 2*i+2.
 * - Insert: append then bubble up (swap with parent until parent <= element).
 * - Extract min: replace root with last element, then sink down (swap with
 *   smaller child until both children are >= element).
 *
 * VISUAL MODEL (TREE ↔ ARRAY):
 *
 *            2 (index 0)
 *          /   \
 *      5 (1)   7 (2)
 *      /  \    /
 *   9(3) 11(4) 15(5)
 *
 *   Array view: [2, 5, 7, 9, 11, 15]
 *
 *   - For node at index i:
 *     - left child index  = 2*i + 1
 *     - right child index = 2*i + 2
 *     - parent index      = floor((i - 1) / 2)
 *
 * REAL-WORLD ANALOGIES:
 * - Task scheduler: "Always run the lowest-cost job next" (extractMin).
 * - Shortest path algorithms: priority queue of "closest-so-far" nodes in Dijkstra.
 * - Event simulation: next event in time is always the minimum timestamp.
 *
 * WHEN TO USE:
 * - Priority queue where the *smallest* value (earliest, cheapest, closest)
 *   should be served first.
 * - Top-K *largest* elements: keep a min-heap of size K and drop smaller ones.
 *
 * Time: insert O(log n), extractMin O(log n). Space: O(n).
 */

// ============================================================================
// MinBinaryHeap implementation
// ============================================================================

/**
 * Swap two elements in an array.
 * @param {number[]} arr
 * @param {number} i
 * @param {number} j
 */
function swap(arr, i, j) {
  if (i === j) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Min Binary Heap: parent <= children; root is the minimum.
 *
 * This class shows both:
 * - Iterative heap operations (bubbleUpIterative, sinkDownIterative) — what you
 *   usually write in interviews.
 * - Recursive heap operations (bubbleUpRecursive, sinkDownRecursive) — great
 *   for understanding the tree nature of the heap.
 */
class MinBinaryHeap {
  constructor() {
    /** @type {number[]} */
    this.values = [];
  }

  // --------------------------------------------------------------------------
  // INSERT (uses iterative bubble-up by default)
  // --------------------------------------------------------------------------

  /**
   * Insert a value and restore min-heap property by bubbling up.
   *
   * @example
   * // Real-world: Add a new "job" with cost; cheapest job should run first.
   * const jobs = new MinBinaryHeap();
   * jobs.insert(10); // cost 10
   * jobs.insert(3);  // cheaper job
   * jobs.insert(7);
   * jobs.extractMin(); // 3 (lowest cost job runs first)
   *
   * @param {number} element - Value to insert.
   */
  insert(element) {
    this.values.push(element);
    // In interviews, use the iterative version (less call-stack overhead).
    this.bubbleUpIterative(this.values.length - 1);
  }

  /**
   * Iterative bubble-up: while the current node is smaller than its parent,
   * keep swapping upwards.
   *
   * VISUAL TRACE (array → tree, after inserting 3 into [5, 9, 7]):
   *
   *   Step 0: [5, 9, 7, 3]
   *              5
   *            /   \
   *           9     7
   *          /
   *         3
   *
   *   Compare 3 with parent 9 → swap:
   *
   *   Step 1: [5, 3, 7, 9]
   *              5
   *            /   \
   *           3     7
   *          /
   *         9
   *
   *   Compare 3 with parent 5 → swap:
   *
   *   Step 2: [3, 5, 7, 9]  (valid min-heap)
   *
   * @param {number} index - Index of the node to bubble up (e.g. last after insert).
   */
  bubbleUpIterative(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.values[parent] <= this.values[i]) break;
      swap(this.values, parent, i);
      i = parent;
    }
  }

  /**
   * Recursive bubble-up: express "move node up while it's smaller than parent"
   * directly as a recursion over the tree height.
   *
   * This is mainly for learning / practicing recursion with heaps.
   *
   * @param {number} index - Index of the node to bubble up.
   */
  bubbleUpRecursive(index) {
    if (index === 0) return; // already at root

    const parent = Math.floor((index - 1) / 2);
    if (this.values[parent] <= this.values[index]) {
      return; // heap property satisfied
    }

    swap(this.values, parent, index);
    this.bubbleUpRecursive(parent);
  }

  // --------------------------------------------------------------------------
  // EXTRACT MIN (uses iterative sink-down by default)
  // --------------------------------------------------------------------------

  /**
   * Remove and return the minimum (root). Place last element at root, then
   * sink down to restore the min-heap property.
   *
   * @example
   * // Real-world: "Next event in time" — extractMin returns the earliest timestamp.
   * const events = new MinBinaryHeap();
   * [50, 10, 30].forEach(t => events.insert(t));
   * events.extractMin(); // 10 (earliest event)
   *
   * @returns {number | undefined} Minimum value, or undefined if heap is empty.
   *
   * Time: O(log n). Space: O(1).
   */
  extractMin() {
    if (this.values.length === 0) return undefined;

    const min = this.values[0];
    const end = this.values.pop();

    if (this.values.length > 0 && end !== undefined) {
      this.values[0] = end;
      // In interviews, use the iterative version.
      this.sinkDownIterative(0);
    }

    return min;
  }

  /**
   * Iterative sink-down: swap the node with its smaller child until both
   * children are greater than or equal to it.
   *
   * Think of it as "gravity" for big values: a big value drops down, while
   * smaller values bubble up above it.
   *
   * @param {number} index - Index of the node to sink down (e.g. 0 after replacing root).
   *
   * Time: O(log n). Space: O(1).
   */
  sinkDownIterative(index) {
    let idx = index;
    const length = this.values.length;
    const element = this.values[idx];

    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swapIdx = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild < element) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swapIdx === null && rightChild < element) ||
          (swapIdx !== null && rightChild < leftChild)
        ) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;

      swap(this.values, idx, swapIdx);
      idx = swapIdx;
    }
  }

  /**
   * Recursive sink-down: at each step, choose the smaller child and recurse
   * on that subtree if the child is smaller than the current node.
   *
   * This mirrors the conceptual "fix the root, then recursively fix the bad
   * child subtree" idea.
   *
   * @param {number} index - Index of the node to sink down.
   */
  sinkDownRecursive(index) {
    const length = this.values.length;
    const leftChildIdx = 2 * index + 1;
    const rightChildIdx = 2 * index + 2;
    let smallestIdx = index;

    if (
      leftChildIdx < length &&
      this.values[leftChildIdx] < this.values[smallestIdx]
    ) {
      smallestIdx = leftChildIdx;
    }

    if (
      rightChildIdx < length &&
      this.values[rightChildIdx] < this.values[smallestIdx]
    ) {
      smallestIdx = rightChildIdx;
    }

    if (smallestIdx === index) return; // heap property satisfied

    swap(this.values, index, smallestIdx);
    this.sinkDownRecursive(smallestIdx);
  }
}

// ============================================================================
// Example / sanity check
// ============================================================================

function checkMinHeap() {
  const heap = new MinBinaryHeap();

  // Insert using the iterative bubble-up (default)
  heap.insert(10);
  heap.insert(30);
  heap.insert(20);
  heap.insert(5);
  heap.insert(7);

  console.log("Min-heap after inserts (array view):", heap.values);
  console.log("extractMin():", heap.extractMin());
  console.log("After extractMin:", heap.values);

  // Demonstrate recursive versions explicitly (for learning)
  const heap2 = new MinBinaryHeap();
  heap2.values = [];
  [10, 30, 20, 5, 7].forEach((val) => {
    heap2.values.push(val);
    heap2.bubbleUpRecursive(heap2.values.length - 1);
  });

  console.log("Min-heap built using recursive bubbleUp:", heap2.values);
  heap2.sinkDownRecursive(0);
  console.log("After one recursive sinkDown from root:", heap2.values);
}

checkMinHeap();

// ============================================================================
// Interview notes (for quick revision)
// ============================================================================
/**
 * INTERVIEW CHECKLIST: Min / Max Binary Heaps
 *
 * 1. Core definitions:
 *    - Min-heap: parent <= children; root is the smallest element.
 *    - Max-heap: parent >= children; root is the largest element.
 *    - Stored as a complete binary tree inside an array.
 *
 * 2. Index formulas (important to say out loud):
 *    - parent(i) = floor((i - 1) / 2)
 *    - left(i)   = 2 * i + 1
 *    - right(i)  = 2 * i + 2
 *
 * 3. Key operations & complexities:
 *    - Insert: O(log n) — put at end, bubble up.
 *    - Extract min/max: O(log n) — move last to root, sink down.
 *    - Peek min/max: O(1).
 *
 * 4. Typical interview questions where min-heap is useful:
 *    - Merge K sorted arrays / lists.
 *    - Find K largest elements (use min-heap of size K).
 *    - Kth smallest / Kth largest element in an array.
 *    - Running median of a stream (two heaps: max-heap + min-heap).
 *    - Dijkstra's shortest path (priority queue of distances).
 *
 * 5. Common follow-up questions:
 *    - Compare array-based heap vs. tree-based (pointer) priority queue.
 *    - Why is the heap height O(log n)?
 *    - Heap vs. binary search tree vs. balanced BST (AVL / Red-Black).
 *    - How heap sort works using a heap.
 *
 * NEXT STEPS / PRACTICE PROBLEMS:
 * - Implement:
 *   - Kth smallest / Kth largest element using a heap.
 *   - Merge K sorted lists using a min-heap.
 *   - Design a "task scheduler" where each task has a priority or deadline.
 *   - Running median of a number stream (two heaps).
 * - Strengthen understanding:
 *   - Convert the array representation to a drawn tree for a few examples,
 *     and walk through bubble-up and sink-down by hand.
 *   - Re-implement this min-heap from memory in both iterative and recursive
 *     styles until it feels natural.
 */

module.exports = MinBinaryHeap;

