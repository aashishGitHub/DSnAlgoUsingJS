import { PriorityQueue } from "../Heap/heapPatterns";

/**
 * ============================================================================
 * SHORTEST PATH ON A WEIGHTED GRAPH
 * ============================================================================
 *
 * PATTERN:
 * - Dijkstra (a priority queue over the frontier) and Bellman-Ford (relax
 *   every edge, repeatedly).
 *
 * ============================================================================
 * ⭐ THE DECISION TABLE — this is the part to remember
 * ============================================================================
 *
 *   unweighted, or all weights equal   → plain BFS.       O(V + E)
 *   weighted, all weights >= 0         → Dijkstra.        O(E log V)
 *   any NEGATIVE weight                → Bellman-Ford.    O(V · E)
 *   "at most k edges" constraint       → Bellman-Ford, k+1 rounds
 *
 * The first row matters most in interviews: reaching for Dijkstra on an
 * unweighted graph is over-engineering, because BFS already visits in order of
 * distance and is simpler and faster. Say "the weights are all 1, so BFS is
 * enough" and you have answered a question the interviewer did not have to ask.
 *
 * ============================================================================
 * ⚠️ WHY DIJKSTRA BREAKS ON NEGATIVE EDGES
 * ============================================================================
 * Dijkstra FINALISES a node the moment it pops it, betting that no cheaper
 * route to it can exist — which is sound only because every remaining edge
 * would add a non-negative amount. A negative edge can invalidate that bet
 * after the fact, so a node finalised early may turn out to have a cheaper
 * route later, and Dijkstra never revisits it.
 *
 * Bellman-Ford makes no such bet. It just relaxes every edge over and over, so
 * a late improvement still propagates. That is why it is slower (O(V·E)) and
 * why it is the only correct choice with negative weights.
 *
 * ============================================================================
 * 🔗 RELATED FOLDERS
 * ============================================================================
 *   - unweighted traversal, bipartite, word ladder → `Graph/graphPatterns.ts`
 *   - grid BFS / multi-source spreading            → `IslandsMatrix/`
 *   - dependency ordering                          → `Graph/` (topological sort)
 *   - the priority queue used below                → `Heap/heapPatterns.ts`
 *
 * Go counterpart: the `shortestpath` package.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * NETWORK DELAY TIME (LeetCode 743) — DIJKSTRA
 * ----------------------------------------------------------------------------
 * PROBLEM: `times[i] = [from, to, weight]` describes a DIRECTED weighted
 * graph over nodes 1..n. A signal is sent from node k. Return the time for
 * every node to receive it, or -1 if some node never does.
 *
 * MENTAL MODEL: "when does the LAST node hear the signal" is
 * `max(shortest path from k to every node)`. So this is single-source shortest
 * path, then one maximum — the second step is what makes it look like a
 * different problem than it is.
 *
 * ============================================================================
 * 🔑 THE TWO DETAILS THAT MAKE DIJKSTRA CORRECT
 * ============================================================================
 *
 * 1. ALWAYS EXPAND THE CHEAPEST FRONTIER NODE. That is the priority queue's
 *    only job. Because all weights are non-negative, the cheapest unfinalised
 *    node cannot be improved by any longer route, so popping it FINALISES it.
 *
 * 2. SKIP ALREADY-FINALISED NODES ON POP. A node can be pushed several times,
 *    once per incoming edge, at different costs. The first pop is the cheapest
 *    and therefore the real answer; every later pop of the same node is stale
 *    and must be discarded. This "lazy deletion" is why the code does not
 *    bother updating entries already in the queue — it is simpler than a
 *    decrease-key operation and has the same complexity.
 *
 * ⚠️ WITHOUT THE SKIP the algorithm still terminates but does extra work, and
 * if you also overwrite the recorded distance you will replace a correct
 * shorter path with a longer one. Check "have I finalised this?" on POP, not
 * on push.
 *
 * DRY-RUN times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
 *   pop (2, cost 0) → finalise 2. push (1,1), (3,1)
 *   pop (1, cost 1) → finalise 1. no outgoing edges
 *   pop (3, cost 1) → finalise 3. push (4,2)
 *   pop (4, cost 2) → finalise 4
 *   all 4 nodes finalised; the slowest is 2  ✓
 *
 * @example
 * networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2); //  2
 * networkDelayTime([[1,2,1]], 2, 1);                 //  1
 * networkDelayTime([[1,2,1]], 2, 2);                 // -1 (node 1 unreachable)
 *
 * Time:  O(E log V) — each edge can push once, each pop is O(log V).
 * Space: O(V + E).
 */
export function networkDelayTime(times: number[][], n: number, k: number): number {
    // Adjacency list: from → [[to, weight], ...]
    const adjacency = new Map<number, [number, number][]>();
    for (const [from, to, weight] of times) {
        if (!adjacency.has(from)) adjacency.set(from, []);
        adjacency.get(from)!.push([to, weight]);
    }

    // Min-heap over [cost, node] — always expand the cheapest frontier node.
    const frontier = new PriorityQueue<[number, number]>((a, b) => a[0] - b[0]);
    frontier.push([0, k]);

    const finalised = new Map<number, number>(); // node → its shortest time

    while (!frontier.isEmpty()) {
        const [cost, node] = frontier.pop()!;

        // DETAIL 2: the first pop of a node is its cheapest; later ones are
        // stale duplicates and must be discarded.
        if (finalised.has(node)) continue;
        finalised.set(node, cost);

        for (const [next, weight] of adjacency.get(node) ?? []) {
            if (!finalised.has(next)) {
                frontier.push([cost + weight, next]);
            }
        }
    }

    // Every node must have heard the signal.
    if (finalised.size !== n) return -1;

    let slowest = 0;
    for (const time of finalised.values()) {
        slowest = Math.max(slowest, time);
    }
    return slowest;
}

/**
 * ----------------------------------------------------------------------------
 * CHEAPEST FLIGHTS WITHIN K STOPS (LeetCode 787) — BELLMAN-FORD
 * ----------------------------------------------------------------------------
 * PROBLEM: `flights[i] = [from, to, price]`. Find the cheapest route from src
 * to dst using AT MOST k stops (so at most k + 1 flights), or -1.
 *
 * ============================================================================
 * ⭐ WHY NOT DIJKSTRA? THE CONSTRAINT IS THE REASON
 * ============================================================================
 * All prices are positive, so Dijkstra's correctness bet is fine — but
 * Dijkstra optimises COST ALONE. Here a route can be cheap and use too many
 * hops, or slightly dearer and legal. Dijkstra would finalise a node by its
 * cheapest route and never reconsider it, even though a pricier route with
 * fewer stops is the one that can actually be extended to dst legally.
 *
 * (You CAN make Dijkstra work by putting stops into the state — a visited set
 * keyed by (node, stopsUsed) — and that is a fine answer too. Bellman-Ford is
 * cleaner here because the hop limit maps directly onto its round count.)
 *
 * ⭐ BELLMAN-FORD'S ROUNDS ARE EXACTLY WHAT THE PROBLEM ASKS FOR: after r
 * rounds of relaxing every edge, `dist` holds the cheapest cost reachable
 * using AT MOST r edges. So run k + 1 rounds and read off the answer. The hop
 * limit is not an extra constraint bolted on — it IS the loop bound.
 *
 * ============================================================================
 * ⚠️ THE SNAPSHOT IS MANDATORY — the bug this problem is famous for
 * ============================================================================
 * Each round must read the PREVIOUS round's distances and write into a fresh
 * copy. If you relax in place, a value updated earlier in the same round can
 * be used again later in that round, letting one round travel two or more
 * edges — which silently ignores the stop limit and returns a too-cheap
 * answer. Cloning `dist` per round is what pins each round to exactly one
 * extra edge.
 *
 * (This is the same class of bug as the "snapshot yesterday" rule in the stock
 * state machines — see `maxProfitCooldown` in
 * [`DynamicProgramming/dpPatterns.ts`](../DynamicProgramming/dpPatterns.ts).)
 *
 * DRY-RUN n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],
 *         src=0, dst=3, k=1  (so at most 2 flights)
 *   start : [0, ∞, ∞, ∞]
 *   round1: [0, 100, ∞, ∞]              — reachable in 1 flight
 *   round2: [0, 100, 200, 700]          — 0→1→3 costs 700
 *   answer = 700  ✓  (0→1→2→3 is only 400 but needs 3 flights — too many)
 *
 * @example
 * findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1); // 700
 * findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1); // 200
 * findCheapestPrice(3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0); // 500 (direct only)
 *
 * Time:  O(k · E). Space: O(V).
 */
export function findCheapestPrice(
    n: number,
    flights: number[][],
    src: number,
    dst: number,
    k: number
): number {
    // Infinity is safe here (unlike in Go, where a MaxInt sentinel would
    // overflow when a price is added to it) — Infinity + price is Infinity.
    let dist = new Array<number>(n).fill(Infinity);
    dist[src] = 0;

    // k stops means at most k + 1 flights, so k + 1 rounds.
    for (let round = 0; round < k + 1; round++) {
        // SNAPSHOT: read `dist`, write `next`. See the warning above.
        const next = [...dist];

        for (const [from, to, price] of flights) {
            if (dist[from] === Infinity) continue; // not yet reachable
            next[to] = Math.min(next[to], dist[from] + price);
        }

        dist = next;
    }

    return dist[dst] === Infinity ? -1 : dist[dst];
}
