import { describe, test, expect } from "vitest";
import { pivotIndex, NumArray } from './prefixSumPatterns';

describe('Prefix Sum Patterns', () => {

    describe('pivotIndex (LC724)', () => {
        test('finds the balance point', () => {
            expect(pivotIndex([1, 7, 3, 6, 5, 6])).toBe(3);
            expect(pivotIndex([2, 1, -1])).toBe(0);
        });

        test('returns -1 when no pivot exists', () => {
            expect(pivotIndex([1, 2, 3])).toBe(-1);
            expect(pivotIndex([])).toBe(-1);
        });

        test('the empty side counts as 0 — index 0 and the last index are valid', () => {
            // Index 0: the LEFT side is empty, so its sum is 0, and the rest
            // of the array also sums to 0.
            expect(pivotIndex([-1, -1, -1, 0, 1, 1])).toBe(0);
            // Last index: the RIGHT side is empty. Here left = 1 + -1 = 0 and
            // the right side is the empty sum, 0.
            expect(pivotIndex([1, -1, 0])).toBe(2);
        });

        test('a single element pivots at 0 (both sides empty)', () => {
            expect(pivotIndex([5])).toBe(0);
        });

        test('returns the LEFTMOST pivot', () => {
            // Both index 1 and index 3 balance; the first must win.
            expect(pivotIndex([1, 0, 1, 0, 1])).toBe(2);
        });

        test('agrees with a brute-force check', () => {
            const brute = (nums: number[]) => {
                for (let i = 0; i < nums.length; i++) {
                    const left = nums.slice(0, i).reduce((a, b) => a + b, 0);
                    const right = nums.slice(i + 1).reduce((a, b) => a + b, 0);
                    if (left === right) return i;
                }
                return -1;
            };
            for (let trial = 0; trial < 200; trial++) {
                const n = Math.floor(Math.random() * 8);
                const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 7) - 3);
                expect(pivotIndex(nums)).toBe(brute(nums));
            }
        });
    });

    describe('NumArray (LC303, range sum query)', () => {
        test('answers the LeetCode example', () => {
            const store = new NumArray([-2, 0, 3, -5, 2, -1]);
            expect(store.sumRange(0, 2)).toBe(1);
            expect(store.sumRange(2, 5)).toBe(-1);
            expect(store.sumRange(0, 5)).toBe(-3);
        });

        test('single-element ranges', () => {
            const store = new NumArray([1, 2, 3]);
            expect(store.sumRange(0, 0)).toBe(1);
            expect(store.sumRange(1, 1)).toBe(2);
            expect(store.sumRange(2, 2)).toBe(3);
        });

        test('repeated queries return the same answer (no state mutated)', () => {
            const store = new NumArray([1, 2, 3, 4]);
            expect(store.sumRange(1, 3)).toBe(9);
            expect(store.sumRange(1, 3)).toBe(9);
            expect(store.sumRange(0, 3)).toBe(10);
        });

        test('degenerate and out-of-range windows return 0 rather than NaN', () => {
            const store = new NumArray([1, 2, 3]);
            expect(store.sumRange(2, 1)).toBe(0);   // inverted
            expect(store.sumRange(5, 9)).toBe(0);   // entirely past the end
            expect(new NumArray([]).sumRange(0, 0)).toBe(0);
        });

        test('agrees with naive re-summing on every window', () => {
            const nums = [4, -1, 0, 7, -3, 2, 2, -8, 5];
            const store = new NumArray(nums);
            for (let l = 0; l < nums.length; l++) {
                for (let r = l; r < nums.length; r++) {
                    const naive = nums.slice(l, r + 1).reduce((a, b) => a + b, 0);
                    expect(store.sumRange(l, r)).toBe(naive);
                }
            }
        });
    });
});
