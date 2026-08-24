/**
 * Union-Find / Disjoint Set Union Pattern - Main Export
 *
 * Near-constant-time connectivity and grouping. The canonical tool for
 * "connected components", "cycle in an undirected graph", and "merge sets as
 * edges arrive over time" (where DFS/BFS would need the whole graph up front).
 */

export {
    NaiveUnionFind,
    UnionFind,
    countComponentsUnionFind,
    hasCycleUndirected,
} from './unionFind';
