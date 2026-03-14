/**
 * ============================================================================
 * KTH LARGEST ELEMENT IN AN ARRAY (QuickSelect + Min-Heap)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums`, find the k'th largest element.
 * (k = 1 means the largest element, k = nums.length means the smallest element)
 *
 * PATTERN:
 * - **QuickSelect** (Selection Algorithm) — average O(n), in-place
 * - **Top-K / Heap** — O(n log k), stable performance, no worst-case surprises
 *
 * WHEN TO USE WHICH:
 * - QuickSelect: When you want the fastest average performance and can tolerate
 *   the fact that it mutates the array (or you can pass a copy).
 * - Min-Heap of size k: When you want predictable performance and/or you are
 *   streaming data and only care about top k.
 *
 * REAL-WORLD ANALOGIES:
 * - HR / Recruiting: "Find the 5th highest interview score from applicants."
 * - Monitoring: "Find the 3rd largest CPU spike value in last 24h samples."
 * - Sales Ops: "Find the 10th largest deal amount closed this quarter."
 */

// ============================================================================
// Input validation helper
// ============================================================================
/**
 * @param {number[]} nums
 * @param {number} k
 */
function validateKthInputs(nums, k) {
  if (!Array.isArray(nums)) {
    throw new TypeError("nums must be an array of numbers");
  }
  if (!Number.isInteger(k)) {
    throw new TypeError("k must be an integer");
  }
  if (k < 1 || k > nums.length) {
    throw new RangeError("k must be between 1 and nums.length");
  }
}

// ============================================================================
// Approach 1: QuickSelect (average O(n), in-place)
// ============================================================================
/**
 * Find the k'th largest element using QuickSelect (in-place).
 *
 * Key idea:
 * - The k'th largest is the \((n - k)\)'th element in sorted (ascending) order.
 * - QuickSelect partitions the array like QuickSort, but only recurses/iterates
 *   into the side that contains the desired index.
 *
 * Why this is "pattern-worthy":
 * - It's a **selection** problem (kth order statistic), not a full sorting
 *   problem. Sorting is extra work.
 *
 * @example
 * // Real-world: Hiring pipeline ranking
 * // You want the 3rd highest interview score to set a cutoff.
 * const scores = [72, 88, 91, 65, 88, 79];
 * findKthLargestQuickSelect(scores, 3);
 * // Returns: 88
 * // Interpretation: Only two scores are higher than 88 (91 and 88/88 tie handling
 * // is natural because we treat duplicates as separate items).
 *
 * @example
 * // Real-world: Monitoring peaks
 * // Find the 2nd largest spike value.
 * findKthLargestQuickSelect([7, 4, 6, 3, 9, 1], 2);
 * // Returns: 7
 *
 * @param {number[]} nums - Input array (will be mutated)
 * @param {number} k - 1-based rank (1 = largest)
 * @returns {number} The k'th largest value
 *
 * Time Complexity:
 * - Average: O(n)
 * - Worst-case: O(n²) (rare; mitigated by randomized pivot)
 *
 * Space Complexity: O(1) extra space (in-place)
 */
export function findKthLargestQuickSelect(nums, k) {
  validateKthInputs(nums, k);

  const targetIndex = nums.length - k; // kth largest == (n-k)th smallest
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivotIndex = partitionWithRandomPivot(nums, left, right);

    if (pivotIndex === targetIndex) return nums[pivotIndex];
    if (pivotIndex < targetIndex) left = pivotIndex + 1;
    else right = pivotIndex - 1;
  }

  // Should never be reached if inputs are valid.
  throw new Error("Unexpected state in QuickSelect");
}

/**
 * Partition `arr[left..right]` around a randomized pivot.
 * After partitioning:
 * - all elements < pivotValue are to the left of the pivot
 * - all elements >= pivotValue are to the right
 *
 * @param {number[]} arr
 * @param {number} left
 * @param {number} right
 * @returns {number} Final pivot index
 */
function partitionWithRandomPivot(arr, left, right) {
  const pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
  swap(arr, pivotIndex, right); // move pivot to end
  return lomutoPartition(arr, left, right);
}

/**
 * Lomuto partition scheme using `arr[right]` as pivot.
 * @param {number[]} arr
 * @param {number} left
 * @param {number} right
 * @returns {number}
 */
function lomutoPartition(arr, left, right) {
  const pivotValue = arr[right];
  let storeIndex = left;

  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, storeIndex);
      storeIndex++;
    }
  }

  swap(arr, storeIndex, right);
  return storeIndex;
}

/**
 * @param {any[]} arr
 * @param {number} i
 * @param {number} j
 */
function swap(arr, i, j) {
  if (i === j) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// ============================================================================
// Approach 2: Min-Heap of size k (O(n log k), does not mutate input)
// ============================================================================
/**
 * Find the k'th largest element using a Min-Heap of size k.
 *
 * Mental model:
 * - Keep the **top k largest** elements seen so far.
 * - The smallest among those top k is exactly the k'th largest overall.
 *
 * @example
 * // Real-world: Top-k deals q
 * // Keep the 5 biggest deals. The smallest among them is your 5th biggest deal.
 * findKthLargestMinHeap([120, 80, 300, 200, 150], 2);
 * // Returns: 200 (2nd largest)
 *
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 *
 * Time Complexity: O(n log k)
 * Space Complexity: O(k)
 */
export function findKthLargestMinHeap(nums, k) {
  validateKthInputs(nums, k);

  const heap = new MinHeap();

  for (const value of nums) {
    if (heap.size() < k) {
      heap.push(value);
      continue;
    }

    // If current value is bigger than the smallest in top-k,
    // it deserves a spot in the heap.
    if (value > heap.peek()) {
      heap.replaceTop(value);
    }
  }

  return heap.peek();
}

/**
 * A minimal Min-Heap implementation for numbers.
 * (Perfect for top-k problems.)
 */
export class MinHeap {
  constructor() {
    /** @type {number[]} */
    this.data = [];
  }

  /** @returns {number} */
  size() {
    return this.data.length;
  }

  /** @returns {number} */
  peek() {
    if (this.data.length === 0) {
      throw new Error("Heap is empty");
    }
    return this.data[0];
  }

  /** @param {number} value */
  push(value) {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  /** @returns {number} */
  pop() {
    if (this.data.length === 0) {
      throw new Error("Heap is empty");
    }

    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0 && last !== undefined) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  /**
   * Replace the heap root with `value` (faster than pop+push).
   * @param {number} value
   */
  replaceTop(value) {
    if (this.data.length === 0) {
      this.data.push(value);
      return;
    }
    this.data[0] = value;
    this.bubbleDown(0);
  }

  /** @param {number} index */
  bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[parent] <= this.data[i]) break;
      swap(this.data, parent, i);
      i = parent;
    }
  }

  /** @param {number} index */
  bubbleDown(index) {
    let i = index;
    const n = this.data.length;

    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.data[left] < this.data[smallest]) {
        smallest = left;
      }
      if (right < n && this.data[right] < this.data[smallest]) {
        smallest = right;
      }

      if (smallest === i) break;
      swap(this.data, i, smallest);
      i = smallest;
    }
  }
}

// ============================================================================
// Convenience export (default strategy)
// ============================================================================
/**
 * Default helper: uses QuickSelect (fast average, in-place).
 *
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 */
export function findKthLargest(nums, k) {
  return findKthLargestQuickSelect(nums, k);
}