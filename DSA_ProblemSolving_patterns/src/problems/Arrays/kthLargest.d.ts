/**
 * Type declarations for kthLargest.js — the repo's GOLD-STANDARD reference
 * file (see .cursorrules), intentionally kept as .js. These declarations give
 * TypeScript consumers (e.g. kthLargest.test.ts) full types without touching
 * the reference file itself.
 */

/** QuickSelect (average O(n), in-place — mutates nums). 1-based k. */
export function findKthLargestQuickSelect(nums: number[], k: number): number;

/** Min-heap of size k (O(n log k), does not mutate input). 1-based k. */
export function findKthLargestMinHeap(nums: number[], k: number): number;

/** Default strategy: QuickSelect. */
export function findKthLargest(nums: number[], k: number): number;

/** Minimal number min-heap used by the heap approach (exported for reuse). */
export class MinHeap {
  data: number[];
  size(): number;
  peek(): number;
  push(value: number): void;
  pop(): number;
  replaceTop(value: number): void;
  bubbleUp(index: number): void;
  bubbleDown(index: number): void;
}
