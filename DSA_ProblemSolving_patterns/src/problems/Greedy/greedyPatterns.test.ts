import { describe, test, expect } from "vitest";
import { canCompleteCircuit } from './greedyPatterns';

describe('Greedy Patterns', () => {
    describe('canCompleteCircuit (LC134, gas station)', () => {
        test('finds the only valid starting station', () => {
            expect(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])).toBe(3);
            expect(canCompleteCircuit([3, 3, 4], [3, 4, 4])).toBe(-1);
        });

        test('returns -1 when there is not enough fuel overall', () => {
            expect(canCompleteCircuit([2, 3, 4], [3, 4, 3])).toBe(-1);
            expect(canCompleteCircuit([1, 1], [2, 2])).toBe(-1);
        });

        test('single station', () => {
            expect(canCompleteCircuit([5], [4])).toBe(0);
            expect(canCompleteCircuit([3], [4])).toBe(-1);
        });

        test('starting at 0 when the first station already works', () => {
            expect(canCompleteCircuit([4, 3, 2], [1, 2, 3])).toBe(0);
        });

        test('exactly enough fuel (total === 0) still completes', () => {
            expect(canCompleteCircuit([1, 2], [2, 1])).toBe(1);
        });

        test('empty input', () => {
            expect(canCompleteCircuit([], [])).toBe(0);
        });

        test('the returned start really does complete the loop', () => {
            // Brute-force verification: simulate from the reported start.
            const cases: [number[], number[]][] = [
                [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]],
                [[4, 3, 2], [1, 2, 3]],
                [[1, 2], [2, 1]],
                [[6, 1, 4, 3, 5], [3, 8, 2, 4, 2]],
            ];

            for (const [gas, cost] of cases) {
                const start = canCompleteCircuit(gas, cost);
                if (start === -1) continue;

                let tank = 0;
                for (let step = 0; step < gas.length; step++) {
                    const i = (start + step) % gas.length;
                    tank += gas[i] - cost[i];
                    expect(tank).toBeGreaterThanOrEqual(0);
                }
            }
        });

        test('agrees with a brute-force search over every start', () => {
            const brute = (gas: number[], cost: number[]): number => {
                for (let start = 0; start < gas.length; start++) {
                    let tank = 0;
                    let ok = true;
                    for (let step = 0; step < gas.length; step++) {
                        const i = (start + step) % gas.length;
                        tank += gas[i] - cost[i];
                        if (tank < 0) { ok = false; break; }
                    }
                    if (ok) return start;
                }
                return -1;
            };

            for (let trial = 0; trial < 200; trial++) {
                const n = 1 + Math.floor(Math.random() * 6);
                const gas = Array.from({ length: n }, () => Math.floor(Math.random() * 6));
                const cost = Array.from({ length: n }, () => Math.floor(Math.random() * 6));
                expect(canCompleteCircuit(gas, cost)).toBe(brute(gas, cost));
            }
        });
    });
});
