import { describe, test, expect } from "vitest";
import { networkDelayTime, findCheapestPrice } from './shortestPathPatterns';

describe('Shortest Path Patterns', () => {

    describe('networkDelayTime (LC743, Dijkstra)', () => {
        test('returns the time for the last node to receive the signal', () => {
            expect(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2)).toBe(2);
            expect(networkDelayTime([[1, 2, 1]], 2, 1)).toBe(1);
        });

        test('returns -1 when a node is unreachable', () => {
            expect(networkDelayTime([[1, 2, 1]], 2, 2)).toBe(-1);
            expect(networkDelayTime([], 2, 1)).toBe(-1);
        });

        test('a single node needs no time', () => {
            expect(networkDelayTime([], 1, 1)).toBe(0);
        });

        test('prefers a cheaper multi-hop route over a dear direct edge', () => {
            // 1->3 directly costs 10, but 1->2->3 costs 2.
            expect(networkDelayTime([[1, 2, 1], [2, 3, 1], [1, 3, 10]], 3, 1)).toBe(2);
        });

        test('stale duplicate queue entries do not corrupt the answer', () => {
            // Node 4 is pushed via several routes at different costs.
            const times = [
                [1, 2, 1], [1, 3, 4], [2, 3, 1], [2, 4, 10], [3, 4, 1],
            ];
            // Cheapest to 4 is 1->2->3->4 = 3.
            expect(networkDelayTime(times, 4, 1)).toBe(3);
        });

        test('ignores self loops and parallel edges', () => {
            expect(networkDelayTime([[1, 1, 5], [1, 2, 3], [1, 2, 1]], 2, 1)).toBe(1);
        });
    });

    describe('findCheapestPrice (LC787, Bellman-Ford)', () => {
        const flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];

        test('respects the stop limit even when a cheaper longer route exists', () => {
            // 0->1->2->3 costs 400 but needs 3 flights (2 stops).
            expect(findCheapestPrice(4, flights, 0, 3, 1)).toBe(700);
            expect(findCheapestPrice(4, flights, 0, 3, 2)).toBe(400);
        });

        test('k = 0 permits only a direct flight', () => {
            const f = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
            expect(findCheapestPrice(3, f, 0, 2, 0)).toBe(500);
            expect(findCheapestPrice(3, f, 0, 2, 1)).toBe(200);
        });

        test('returns -1 when the destination is unreachable within k stops', () => {
            expect(findCheapestPrice(3, [[0, 1, 100]], 0, 2, 5)).toBe(-1);
            expect(findCheapestPrice(2, [], 0, 1, 5)).toBe(-1);
        });

        test('src === dst costs nothing', () => {
            expect(findCheapestPrice(3, flights, 0, 0, 1)).toBe(0);
        });

        test('more stops can never cost more', () => {
            let previous = Infinity;
            for (let k = 0; k <= 5; k++) {
                const price = findCheapestPrice(4, flights, 0, 3, k);
                if (price === -1) continue;
                expect(price).toBeLessThanOrEqual(previous);
                previous = price;
            }
        });

        test('one round per flight — the snapshot prevents extra hops', () => {
            // A 3-edge chain. With k=1 (2 flights) node 3 is unreachable; an
            // in-place relaxation would wrongly find it in one round.
            const chain = [[0, 1, 1], [1, 2, 1], [2, 3, 1]];
            expect(findCheapestPrice(4, chain, 0, 3, 1)).toBe(-1);
            expect(findCheapestPrice(4, chain, 0, 3, 2)).toBe(3);
        });
    });
});
