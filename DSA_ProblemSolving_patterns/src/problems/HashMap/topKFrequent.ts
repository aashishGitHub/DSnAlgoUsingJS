/**
 * ============================================================================
 * TOP K FREQUENT ELEMENTS (LeetCode 347)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an integer array `nums` and an integer `k`, return the `k` most
 * frequent elements. Any order is acceptable.
 *
 *   Input:  nums = [1,1,1,2,2,3], k = 2
 *   Output: [1,2]
 *
 * PATTERN:
 * - **Hash Map for frequency counting** is step one of almost every "top K"
 *   or "most/least frequent" problem. Step two is choosing how to extract the
 *   top K from those frequencies without fully sorting when you don't have to.
 *
 * WHEN TO USE:
 * - "Most/least frequent K items", "top K by some derived score" → count with
 *   a map, then use a heap (K << N) or bucket sort (O(N), frequency-bounded).
 *
 * REAL-WORLD ANALOGIES:
 * - Analytics: top 10 most-visited pages from a day's traffic log.
 * - Search: most frequently typed queries for autocomplete ranking.
 * - Ops: top K error codes appearing in a log window.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Hash Map + full sort              Time O(n log n)  Space O(n)
 *   Approach 2  Hash Map + min-heap of size k      Time O(n log k)  Space O(n + k)
 *   Approach 3  Bucket sort ★ optimal              Time O(n)        Space O(n)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — HASH MAP + FULL SORT (the direct baseline)
 * ----------------------------------------------------------------------------
 * Idea: count every frequency, sort ALL of them descending, take the first k.
 *
 * Why it's not optimal: sorting the entire frequency list is wasteful when
 * k is small — you're fully ordering elements you'll immediately discard.
 *
 * @example
 * topKFrequentSort([1,1,1,2,2,3], 2);
 * // [1,2]
 *
 * Time:  O(n log n)  — counting is O(n); sorting all distinct values dominates.
 * Space: O(n)         — the frequency map.
 */
export function topKFrequentSort(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — HASH MAP + MIN-HEAP OF SIZE K
 * ----------------------------------------------------------------------------
 * Pattern reasoning: you never need a full ordering — only "who are the top
 * k so far?". A min-heap capped at size k does exactly that: push every
 * (value, freq), and whenever the heap exceeds k, evict the SMALLEST — so
 * only the k largest ever survive.
 *
 * @example
 * topKFrequentHeap([1,1,1,2,2,3], 2);
 * // [1,2]  (order not guaranteed)
 *
 * Time:  O(n log k)  — n heap operations, each O(log k).
 * Space: O(n + k)     — frequency map + heap.
 */
class MinHeap {
  private heap: [number, number][] = []; // [value, frequency] pairs

  size(): number {
    return this.heap.length;
  }

  push(item: [number, number]): void {
    this.heap.push(item);
    this.bubbleUp();
  }

  pop(): [number, number] | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown();
    return min;
  }

  private bubbleUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index][1] >= this.heap[parentIndex][1]) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  private bubbleDown(): void {
    let index = 0;
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && this.heap[leftChild][1] < this.heap[minIndex][1]) {
        minIndex = leftChild;
      }
      if (rightChild < this.heap.length && this.heap[rightChild][1] < this.heap[minIndex][1]) {
        minIndex = rightChild;
      }
      if (minIndex === index) break;

      [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
      index = minIndex;
    }
  }
}

export function topKFrequentHeap(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  const minHeap = new MinHeap();
  for (const [num, freq] of freqMap.entries()) {
    minHeap.push([num, freq]);
    if (minHeap.size() > k) {
      minHeap.pop();
    }
  }

  const result: number[] = [];
  while (minHeap.size() > 0) {
    const item = minHeap.pop();
    if (item) result.push(item[0]);
  }
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — BUCKET SORT ★ OPTIMAL (linear time)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: a frequency can never exceed `nums.length`. That bounds
 * the "sort key" range, so instead of comparison-sorting, bucket every value
 * by its exact frequency (index = frequency) and walk the buckets from
 * highest to lowest, collecting until we have k.
 *
 * @example
 * topKFrequentBucketSort([1,1,1,2,2,3], 2);
 * // [1,2]
 *
 * Time:  O(n)  — counting is O(n); bucket array has n+1 slots, one pass to fill.
 * Space: O(n)  — frequency map + buckets.
 */
export function topKFrequentBucketSort(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of freqMap.entries()) {
    buckets[freq].push(num);
  }

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}

/** Default export: bucket sort — optimal and no comparator/heap needed. */
export const topKFrequent = topKFrequentBucketSort;

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "top/bottom K by frequency (or any bounded score)" →
 *    count with a hash map first, always — every approach above starts there.
 * 2. Talking point: full sort is O(n log n); a size-k heap is O(n log k),
 *    better when k is much smaller than n; bucket sort is O(n) because
 *    frequency is bounded by n itself, which comparison sorts can't exploit.
 * 3. Pitfalls: bucket sort needs `nums.length + 1` buckets (frequency ranges
 *    from 0 to n); forgetting the `+1` causes an out-of-bounds bucket index
 *    when one element is repeated `n` times.
 * 4. Follow-ups: "K most frequent WORDS, ties broken alphabetically" (same
 *    pattern, tie-break in the comparator/heap); streaming version where
 *    counts update continuously (heap-based approach adapts naturally,
 *    bucket sort does not).
 */
