import { describe, test, expect } from "vitest";
import {
    PriorityQueue,
    MinHeap,
    MaxHeap,
    MedianFinder,
    KthLargest,
    kClosest,
    lastStoneWeight,
    leastInterval,
} from './heapPatterns';

describe('Heap / Priority Queue Patterns', () => {

    describe('PriorityQueue (the reusable core)', () => {
        test('pops in comparator order', () => {
            const pq = new PriorityQueue<number>((a, b) => a - b); // min-first
            [5, 1, 4, 2, 3].forEach(n => pq.push(n));
            expect([pq.pop(), pq.pop(), pq.pop(), pq.pop(), pq.pop()]).toEqual([1, 2, 3, 4, 5]);
        });

        test('size / isEmpty / peek', () => {
            const pq = new PriorityQueue<number>((a, b) => a - b);
            expect(pq.isEmpty()).toBe(true);
            expect(pq.peek()).toBeUndefined();
            expect(pq.pop()).toBeUndefined();

            pq.push(7);
            pq.push(3);
            expect(pq.size).toBe(2);
            expect(pq.isEmpty()).toBe(false);
            expect(pq.peek()).toBe(3);
            expect(pq.size).toBe(2); // peek must not remove
        });

        test('works with a custom object comparator', () => {
            type Job = { name: string; priority: number };
            const pq = new PriorityQueue<Job>((a, b) => b.priority - a.priority);
            pq.push({ name: 'low', priority: 1 });
            pq.push({ name: 'high', priority: 10 });
            pq.push({ name: 'mid', priority: 5 });
            expect(pq.pop()?.name).toBe('high');
            expect(pq.pop()?.name).toBe('mid');
        });

        test('handles duplicates', () => {
            const pq = new PriorityQueue<number>((a, b) => a - b);
            [2, 2, 2, 1].forEach(n => pq.push(n));
            expect([pq.pop(), pq.pop(), pq.pop(), pq.pop()]).toEqual([1, 2, 2, 2]);
        });
    });

    describe('MinHeap / MaxHeap', () => {
        test('MinHeap surfaces the smallest', () => {
            const h = new MinHeap();
            [5, 1, 3].forEach(n => h.push(n));
            expect(h.peek()).toBe(1);
            expect(h.pop()).toBe(1);
            expect(h.pop()).toBe(3);
        });

        test('MaxHeap surfaces the largest', () => {
            const h = new MaxHeap();
            [5, 1, 3].forEach(n => h.push(n));
            expect(h.peek()).toBe(5);
            expect(h.pop()).toBe(5);
            expect(h.pop()).toBe(3);
        });

        test('heap-sorting agrees with Array.sort', () => {
            const input = [42, -7, 0, 13, 13, 99, -100, 5];
            const h = new MinHeap();
            input.forEach(n => h.push(n));
            const out: number[] = [];
            while (!h.isEmpty()) out.push(h.pop()!);
            expect(out).toEqual([...input].sort((a, b) => a - b));
        });
    });

    describe('MedianFinder (LC295, two heaps)', () => {
        test('tracks the running median', () => {
            const mf = new MedianFinder();
            mf.addNum(1);
            expect(mf.findMedian()).toBe(1);
            mf.addNum(2);
            expect(mf.findMedian()).toBe(1.5);
            mf.addNum(3);
            expect(mf.findMedian()).toBe(2);
        });

        test('handles a descending stream', () => {
            const mf = new MedianFinder();
            [5, 4, 3, 2, 1].forEach(n => mf.addNum(n));
            expect(mf.findMedian()).toBe(3);
        });

        test('agrees with a sort-based median at every step', () => {
            const mf = new MedianFinder();
            const seen: number[] = [];
            for (const n of [6, -1, 3, 3, 9, 0, 12, -5]) {
                mf.addNum(n);
                seen.push(n);
                const sorted = [...seen].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                const expected = sorted.length % 2 === 1
                    ? sorted[mid]
                    : (sorted[mid - 1] + sorted[mid]) / 2;
                expect(mf.findMedian()).toBe(expected);
            }
        });
    });

    describe('KthLargest (LC703, streaming)', () => {
        test('reports the kth largest as values arrive', () => {
            const k = new KthLargest(3, [4, 5, 8, 2]);
            expect(k.add(3)).toBe(4);
            expect(k.add(5)).toBe(5);
            expect(k.add(10)).toBe(5);
            expect(k.add(9)).toBe(8);
            expect(k.add(4)).toBe(8);
        });

        test('works when seeded with fewer than k values', () => {
            const k = new KthLargest(2, [1]);
            expect(k.add(5)).toBe(1); // now [1,5], 2nd largest is 1
        });
    });

    describe('kClosest (LC973)', () => {
        test('returns the k nearest points to the origin', () => {
            const got = kClosest([[1, 3], [-2, 2]], 1);
            expect(got).toEqual([[-2, 2]]);
        });

        test('returns k points, all nearer than the excluded ones', () => {
            const points = [[3, 3], [5, -1], [-2, 4]];
            const got = kClosest(points, 2);
            expect(got.length).toBe(2);
            const dist = (p: number[]) => p[0] * p[0] + p[1] * p[1];
            const chosen = got.map(dist).sort((a, b) => a - b);
            const all = points.map(dist).sort((a, b) => a - b);
            expect(chosen).toEqual(all.slice(0, 2));
        });

        test('k equal to the input length returns everything', () => {
            expect(kClosest([[1, 1], [2, 2]], 2).length).toBe(2);
        });
    });

    describe('lastStoneWeight (LC1046)', () => {
        test('smashes the two heaviest repeatedly', () => {
            expect(lastStoneWeight([2, 7, 4, 1, 8, 1])).toBe(1);
            expect(lastStoneWeight([1])).toBe(1);
            expect(lastStoneWeight([2, 2])).toBe(0);
        });

        test('empty input has no stone left', () => {
            expect(lastStoneWeight([])).toBe(0);
        });
    });

    describe('leastInterval (LC621, task scheduler)', () => {
        test('inserts idles when one task dominates', () => {
            expect(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2)).toBe(8);
        });

        test('no cooldown means no idles', () => {
            expect(leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 0)).toBe(6);
        });

        test('ties for most frequent each claim a final slot', () => {
            expect(leastInterval(['A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'], 2)).toBe(10);
        });

        test('enough distinct tasks means the max clause dominates', () => {
            // Formula alone gives (2-1)*3 + 5 = 8, but there are 10 tasks.
            expect(leastInterval(['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E'], 2)).toBe(10);
        });

        test('single task and empty input', () => {
            expect(leastInterval(['A'], 5)).toBe(1);
            expect(leastInterval([], 2)).toBe(0);
        });

        test('never reports fewer intervals than there are tasks', () => {
            const inputs: [string[], number][] = [
                [['A', 'A', 'A'], 2],
                [['A', 'B', 'C', 'D'], 3],
                [['A', 'A', 'B'], 1],
                [['A', 'A', 'A', 'B', 'B'], 4],
            ];
            for (const [tasks, n] of inputs) {
                expect(leastInterval(tasks, n)).toBeGreaterThanOrEqual(tasks.length);
            }
        });
    });
});
