# Data Structures and Algorithms
📚 Data Structures and Algorithms in JavaScript
A comprehensive collection of Data Structures and Algorithms implementations and problem-solving solutions written in JavaScript. This repository serves as a complete learning resource for coding interviews, competitive programming, and mastering fundamental computer science concepts.

🎯 What's Inside
📊 Data Structures Implementations:

Arrays & 2D Arrays - Matrix operations and array manipulations
Linked Lists - Singly linked lists with rotation and swapping operations
Stacks & Queues - LIFO and FIFO data structures with practical applications
Trees - Binary Trees, Binary Search Trees with traversal algorithms (BFS, DFS, In-order, Pre-order, Post-order)
Hash Tables - Custom hash table implementation with collision handling
Heaps - Max Binary Heap and Priority Queue implementations
Tries - Prefix tree for efficient string operations
🧩 Problem Solving Categories:

Two Pointers Technique - Palindrome check, 3Sum, and more
Sliding Window - Maximum sum subarrays and subsequences
Dynamic Programming - Fibonacci, Knapsack, Longest Common Subsequence, Coin Change
Graph Algorithms - BFS, DFS, and pathfinding solutions
String Algorithms - Anagram detection, palindromes, pattern matching
Array Problems - Container with most water, trapping rainwater, product of arrays
Sorting & Searching - Binary search and bubble sort implementations
🔥 Featured Problem Solutions:

LRU Cache Implementation
Serialize/Deserialize Binary Search Tree
Kadane's Algorithm for Maximum Subarray
House Robber (Dynamic Programming)
Kth Largest Element in Array
Interview Questions Collection
🚀 Perfect For
Job Interview Preparation - Practice problems commonly asked in technical interviews
Computer Science Students - Learn and understand core data structures and algorithms
Competitive Programming - Sharpen problem-solving skills with optimized solutions
JavaScript Developers - Master algorithmic thinking in your preferred language

## 🧪 Running Tests

Navigate to the `DSA_ProblemSolving_patterns` directory and use the following commands:

```bash
# Run only the 3Sum tests
npm run test:file src/problems/2Pointers/3Sum.test.ts

# Run only the failing test
npm run test:specific "should handle edge case with all zeros"

# Watch the 3Sum tests while you fix them
npm run test:watch-file src/problems/2Pointers/3Sum.test.ts
```

Learn Time Complexity: 
https://youtu.be/luXiytGnYpY

Topic-wise links:

1. Arrays

-Bare Minimum
a. https://www.geeksforgeeks.org/top-50-array-coding-problems-for-interviews/

-Bonus
a. https://www.interviewbit.com/courses/programming/topics/arrays/
b. https://leetcode.com/tag/array/


2. Strings
-Bare Minimum
a. interviewbit.com/courses/programming/topics/strings/

-Bonus
a. https://leetcode.com/tag/string/
b. https://www.hackerrank.com/domains/algorithms?filters%5Bstatus%5D%5B%5D=unsolved&filters%5Bsubdomains%5D%5B%5D=strings&badge_type=problem-solving


3. Linked Lists
-Bare Minimum
a. https://www.interviewbit.com/courses/programming/topics/linked-lists/

-Bonus
a. https://leetcode.com/tag/linked-list/
b. https://www.geeksforgeeks.org/top-20-linked-list-interview-question/

4. Stacks and Queues
-Theory:
a. https://www.geeksforgeeks.org/stack-data-structure-introduction-program/
b. https://www.geeksforgeeks.org/queue-set-1introduction-and-array-implementation/

-Bare Minimum
a. https://www.interviewbit.com/courses/programming/topics/stacks-and-queues/

-Bonus
a. https://leetcode.com/tag/stack/
b. https://leetcode.com/tag/queue/
c. https://www.geeksforgeeks.org/queue-data-structure/
d. https://www.geeksforgeeks.org/stack-data-structure0/

5. Tree-based data structures:
-Theory:
a. https://www.geeksforgeeks.org/binary-tree-data-structure/
b. https://www.geeksforgeeks.org/binary-search-tree-data-structure/
c. https://www.geeksforgeeks.org/trie-insert-and-search/
d. https://www.geeksforgeeks.org/heap-data-structure/
e. https://www.geeksforgeeks.org/hashing-data-structure/

-Bare minimum:
a. https://www.interviewbit.com/courses/programming/topics/tree-data-structure/
b. https://www.interviewbit.com/courses/programming/topics/heaps-and-maps/
c. https://www.interviewbit.com/courses/programming/topics/hashing/

-Bonus
a. https://leetcode.com/tag/tree/
b. https://leetcode.com/tag/heap/
c. https://leetcode.com/tag/trie/
d. https://leetcode.com/tag/hash-table/


6. Graphs:
-Theory:
a. https://www.geeksforgeeks.org/graph-and-its-representations/

-Standard Algos:
a. BFS - https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/
b. DFS - https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/
c. Dijkstra - https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
d. Prim's - https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/
e. Kruskal - https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/
f. Floyd-Warshall - https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/
g. Union Find - https://www.geeksforgeeks.org/union-find-algorithm-union-rank-find-optimized-path-compression/


-Bare Minimum:
a. https://leetcode.com/tag/graph/ (Easy and Medium)

-Bonus:
a. https://www.interviewbit.com/courses/programming/topics/graph-data-structure-algorithms/


7. Dynamic Programming:
-Video lectures:
a. Lec 1 - https://www.youtube.com/watch?v=OQ5jsbhAv_M&list=PLcDimPvbmfT8qAxD6JH_kmXiQwTNcoK78
b. Lec 2 - https://www.youtube.com/watch?v=ENyox7kNKeY&list=PLcDimPvbmfT8qAxD6JH_kmXiQwTNcoK78
c. Lec 3 - https://www.youtube.com/watch?v=ocZMDMZwhCY&list=PLcDimPvbmfT8qAxD6JH_kmXiQwTNcoK78

-Bare minimum (Standard problems):
a. https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/
b. https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/
c. https://www.geeksforgeeks.org/coin-change-dp-7/
d. https://www.geeksforgeeks.org/compute-ncr-p-set-1-introduction-and-dynamic-programming-solution/
e. https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/
f. https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/
g. https://www.geeksforgeeks.org/longest-common-substring-dp-29/


-Bonus:
a. https://www.interviewbit.com/courses/programming/topics/dynamic-programming/
b. https://leetcode.com/tag/dynamic-programming/
