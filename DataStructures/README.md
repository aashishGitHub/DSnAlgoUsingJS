# Data Structures

Hand-built implementations of the core data structures every interview assumes
you can build from scratch. These are the foundations the pattern problems in
[`../DSA_ProblemSolving_patterns/`](../DSA_ProblemSolving_patterns/) rely on.

> **Gold-standard reference:** [`Heap/Max_binary_heap.js`](Heap/Max_binary_heap.js)
> is the template all files aspire to — full header, array↔tree visual, insert/
> extract with bubble-up/sink-down, iterative AND recursive variants, and an
> interview checklist. Use it as the model when reworking any file here.

## Index

| Structure | Folder | Key operations / notes |
|---|---|---|
| **Array** | [`Arrays/`](Arrays/), [`2DArray/`](2DArray/) | basics; `searchInMatrix` (staircase search) |
| **Hash Table** | [`HashTable/`](HashTable/) | set/get with collision handling |
| **Stack** | [`Stack/`](Stack/) | LIFO; powers Valid Parentheses, monotonic-stack problems |
| **Queue** | [`Queue/`](Queue/) | FIFO; `queueFromStack` (two-stack queue) |
| **Linked List** | [`LinkedList/`](LinkedList/) | traversal, rotate, swap-alternate; pairs with Fast & Slow Pointers |
| **Binary Heap** | [`Heap/`](Heap/) | ★ Max & Min heaps, priority queue — see the gold standard above |
| **Tree / BST** | [`Tree/`](Tree/), [`Exercise/`](Exercise/) | insert/search, BFS/DFS traversals, level order, left view, kth-max via reverse in-order |
| **Trie** | [`Trie/`](Trie/) | prefix tree — autocomplete / word-dictionary problems |
| **LRU Cache** | [`LRUCache/`](LRUCache/) | O(1) get/put — hash map + doubly linked list (see its [README](LRUCache/README.md)) |
| **Puzzles** | [`puzzles/`](puzzles/) | applied: `findTheMinDaysToShip` |

## How this connects to the patterns

- **Heap** → Top-K / K-th largest ([`../DSA_ProblemSolving_patterns/src/problems/HashMap/topKFrequent.ts`](../DSA_ProblemSolving_patterns/src/problems/HashMap/topKFrequent.ts), [`Arrays/kthLargest.js`](../DSA_ProblemSolving_patterns/src/problems/Arrays/kthLargest.js))
- **Stack** → Valid Parentheses ([`easy/validParenthesis_STACK.ts`](../DSA_ProblemSolving_patterns/src/problems/easy/validParenthesis_STACK.ts)), removeStars
- **Linked List** → Fast & Slow Pointers (cycle, middle, palindrome)
- **Tree** → Tree Traversal patterns (DFS/BFS)
- **Hash Table** → the entire HashMap pattern family
- **Disjoint Set** → Union-Find pattern ([`../DSA_ProblemSolving_patterns/src/problems/UnionFind/unionFind.ts`](../DSA_ProblemSolving_patterns/src/problems/UnionFind/unionFind.ts))

## Status note

These implementations are correct and well-commented but predate the
repo-wide TypeScript + test rework done in `DSA_ProblemSolving_patterns/`. A
future pass could port them to `.ts` with vitest coverage, using
`Max_binary_heap.js` as the structural model. Not yet done — flagged honestly
rather than claimed complete.
