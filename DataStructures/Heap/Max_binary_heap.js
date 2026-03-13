/**
 * ============================================================================
 * MAX BINARY HEAP (Array-Based)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Maintain a collection that supports:
 * - Insert a value in O(log n)
 * - Extract the maximum value in O(log n)
 * - Maximum is always at the root (index 0)
 *
 * PATTERN (ARRAY ↔ TREE):
 * - Complete binary tree stored in an array.
 * - For index i: parent at floor((i-1)/2), left child at 2*i+1, right at 2*i+2.
 * - Insert: append then bubble up (swap with parent until parent >= element).
 * - Extract max: replace root with last element, then sink down (swap with
 *   larger child until both children are <= element).
 *
 * Simple visual (index in brackets):
 *
 *             55[0]
 *           /      \
 *       39[1]      33[2]
 *       /   \      /
 *   18[3] 27[4] 12[5]
 *
 *   Array view: [55, 39, 33, 18, 27, 12]
 *
 * REAL-WORLD ANALOGIES:
 * - Task scheduler: "Always run the highest-priority task next" (extractMax).
 * - Leaderboard: "Insert new score, then get current top score" (insert + peek).
 * - Heap sort: Build max-heap, repeatedly extractMax to get sorted order.
 *
 * WHEN TO USE:
 * - Priority queue where highest priority should be served first.
 * - Top-K largest (use min-heap of size k for that; max-heap for "global" max).
 *
 * Time: insert O(log n), extractMax O(log n). Space: O(n).
 */

// ============================================================================
// MaxBinaryHeap implementation
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
 * Max Binary Heap: parent >= children; root is the maximum.
 */
class MaxBinaryHeap {
  constructor() {
    /** @type {number[]} */
    this.values = [];
  }

  /**
   * Insert a value and restore max-heap property by bubbling up.
   *
   * @example
   * // Real-world: Add a new task with priority; heap keeps highest at root.
   * const scheduler = new MaxBinaryHeap();
   * scheduler.insert(41);
   * scheduler.insert(55);
   * scheduler.extractMax(); // 55 (highest priority task runs first)
   *
   * @param {number} element - Value to insert.
   */
  insert(element) {
    this.values.push(element);
    // Default: iterative bubble-up (interview-friendly).
    this.bubbleUp(this.values.length - 1);
  }

  /**
   * Iterative bubble up: while current node is larger than its parent,
   * keep swapping upwards.
   *
   * VISUAL TRACE (array → tree, after inserting 55 into [41, 39, 33, 18, 27, 12]):
   *
   *   Step 0: [41, 39, 33, 18, 27, 12, 55]
   *              41
   *            /    \
   *          39      33
   *         /  \    /  \
   *       18  27  12  55
   *
   *   Compare 55 with parent 33 → swap:
   *
   *   Step 1: [41, 39, 55, 18, 27, 12, 33]
   *              41
   *            /    \
   *          39      55
   *         /  \    /  \
   *       18  27  12  33
   *
   *   Compare 55 with parent 41 → swap:
   *
   *   Step 2: [55, 39, 41, 18, 27, 12, 33]  (valid max-heap)
   *
   * Bubble up stops when the parent is already >= element or we reach the root.
   *
   * @param {number} index - Index of the node to bubble up (e.g. last after insert).
   */
  bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.values[parent] >= this.values[i]) break;
      swap(this.values, parent, i);
      i = parent;
    }
  }

  /**
   * Recursive bubble-up: move the node up while it is larger than its parent.
   * This version is mainly for learning the tree-recursion viewpoint.
   *
   * @param {number} index - Index of the node to bubble up.
   */
  bubbleUpRecursive(index) {
    if (index === 0) return; // at root

    const parent = Math.floor((index - 1) / 2);
    if (this.values[parent] >= this.values[index]) return;

    swap(this.values, parent, index);
    this.bubbleUpRecursive(parent);
  }

  /**
   * Remove and return the maximum (root). Place last element at root, then sink down.
   *
   * @example
   * // Real-world: "Run the highest-priority task" — extractMax gives it and restores heap.
   * const heap = new MaxBinaryHeap();
   * [10, 30, 20].forEach(v => heap.insert(v));
   * heap.extractMax(); // 30
   *
   * @returns {number | undefined} Maximum value, or undefined if heap is empty.
   *
   * Time: O(log n). Space: O(1).
   */
  extractMax() {
    if (this.values.length === 0) return undefined;

    const max = this.values[0];
    const end = this.values.pop();

    if (this.values.length > 0 && end !== undefined) {
      this.values[0] = end;
      // Default: iterative sink-down (interview-friendly).
      this.sinkDown(0);
    }

    return max;
  }

  /**
   * Sink down the element at `index` until both children are <= it (restore max-heap).
   * Swap with the larger child so the larger value moves up.
   *
   * Intuition: think of "gravity for small values" — a too-small value at the
   * top will get pushed down while bigger values rise above it.
   *
   * @param {number} index - Index of the node to sink down (e.g. 0 after replacing root).
   *
   * Time: O(log n). Space: O(1).
   */
  sinkDown(index) {
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
        if (leftChild > element) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swapIdx === null && rightChild > element) ||
          (swapIdx !== null && rightChild > leftChild)
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
   * Recursive sink-down: at each step, choose the larger child and recurse
   * on that subtree if the child is larger than the current node.
   *
   * @param {number} index - Index of the node to sink down.
   */
  sinkDownRecursive(index) {
    const length = this.values.length;
    const leftChildIdx = 2 * index + 1;
    const rightChildIdx = 2 * index + 2;
    let largestIdx = index;

    if (
      leftChildIdx < length &&
      this.values[leftChildIdx] > this.values[largestIdx]
    ) {
      largestIdx = leftChildIdx;
    }

    if (
      rightChildIdx < length &&
      this.values[rightChildIdx] > this.values[largestIdx]
    ) {
      largestIdx = rightChildIdx;
    }

    if (largestIdx === index) return; // heap property satisfied

    swap(this.values, index, largestIdx);
    this.sinkDownRecursive(largestIdx);
  }
}

// ============================================================================
// Example / sanity check
// ============================================================================

function checkHeap() {
  const heap = new MaxBinaryHeap();
  heap.insert(41);
  heap.insert(39);
  heap.insert(33);
  heap.insert(18);
  heap.insert(27);
  heap.insert(12);
  heap.insert(55);

  console.log("Max-heap after inserts (array view):", heap.values);
  console.log("extractMax():", heap.extractMax());
  console.log("After extractMax:", heap.values);

  // Demonstrate recursive versions explicitly (for learning).
  const heap2 = new MaxBinaryHeap();
  [41, 39, 33, 18, 27, 12, 55].forEach((val) => {
    heap2.values.push(val);
    heap2.bubbleUpRecursive(heap2.values.length - 1);
  });

  console.log("Max-heap built using recursive bubbleUp:", heap2.values);
  heap2.sinkDownRecursive(0);
  console.log("After one recursive sinkDown from root:", heap2.values);
}

checkHeap();

// ============================================================================
// Interview notes (for quick revision)
// ============================================================================
/**
 * INTERVIEW CHECKLIST: Max / Min Binary Heaps
 *
 * 1. Core definitions:
 *    - Max-heap: parent >= children; root is the largest element.
 *    - Min-heap: parent <= children; root is the smallest element.
 *    - Stored as a complete binary tree inside an array.
 *
 * 2. Index formulas (very common question):
 *    - parent(i) = floor((i - 1) / 2)
 *    - left(i)   = 2 * i + 1
 *    - right(i)  = 2 * i + 2
 *
 * 3. Key operations & complexities:
 *    - Insert: O(log n) — put at end, bubble up.
 *    - Extract max/min: O(log n) — move last to root, sink down.
 *    - Peek max/min: O(1).
 *
 * 4. Typical interview questions where max-heap is useful:
 *    - Find K largest elements in an array.
 *    - Kth largest element.
 *    - "Stream of scores": maintain top K scores seen so far.
 *    - Scheduling / choosing next highest-priority job.
 *
 * 5. Common follow-up questions:
 *    - Heap vs. sorted array vs. balanced BST for priority queues.
 *    - Why are heaps good for repeated insert + extractMax/Min?
 *    - Heap sort algorithm and its time/space trade-offs.
 *    - How would you implement a generic heap that works with a comparator?
 *
 * NEXT STEPS / PRACTICE PROBLEMS:
 * - Implement:
 *   - Kth largest / smallest element using max-heap or min-heap.
 *   - Stream "top K" tracker using a heap.
 *   - Priority queue that schedules tasks by deadline or priority.
 *   - Heap sort using MaxBinaryHeap.
 * - For deeper understanding:
 *   - Draw the tree for a few heap arrays and manually simulate bubble-up and
 *     sink-down operations.
 *   - Implement both min-heap and max-heap and switch between them by only
 *     changing comparison operators.
 */

module.exports = MaxBinaryHeap;
