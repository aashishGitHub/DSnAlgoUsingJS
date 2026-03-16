## Tree & Heap Revision Guide

This guide connects the core **tree data structures** in this repo (Binary Tree, Binary Search Tree, Max/Min Heap) with the **practice problems** so you can revise everything quickly in one place.

---

## 1. Concepts: Binary Tree vs BST vs Heap

### Binary Tree (general)

- **Structure**: Each node has at most **two children** (`left`, `right`).
- **Ordering**: **No ordering rule** on values. Parent can be smaller, larger, or equal to children.
- **Use**: General hierarchical data, many interview problems (depth, paths, views, serialization).

### Binary Search Tree (BST)

- **Structure**: Still a binary tree (max two children).
- **Ordering (global rule)**:
  - All values in **left subtree < node.value**.
  - All values in **right subtree > node.value**.
  - This holds **recursively** for every subtree.
- **Key property**: **Inorder traversal gives a sorted list**.
- **Typical operations (balanced BST)**:
  - Search, insert, delete: **O(log n)** average.
  - Great when you need **fast search by key** and **sorted iteration**.

### Max Heap / Min Heap

- **Structure**: A **complete binary tree** (all levels full except possibly the last, filled left‑to‑right).
- **Storage**: Usually stored in an **array**:
  - Index `i`: left child at `2*i + 1`, right child at `2*i + 2`, parent at `Math.floor((i - 1) / 2)`.

#### Max Heap

- **Heap property**: For every node, **parent ≥ both children**.
- **Root**: Always holds the **maximum** element.
- **Operations**:
  - Get max: **O(1)**.
  - Insert: **O(log n)** (bubble up).
  - Extract max: **O(log n)** (sink down).
  - Search arbitrary value: **O(n)** (no global ordering like BST).

#### Min Heap

- Same idea, but **parent ≤ both children** and the root is the **minimum** element.

### Quick comparisons

- **BST vs Max/Min Heap**
  - BST has a **global ordering** (left < root < right); heap only has **local parent/child ordering**.
  - BST supports **fast search by key** (O(log n) average); heap is for **fast access to only the best (max/min)** element.
  - BST can be unbalanced (degrading to O(n)); heap shape is always **complete**, so height is O(log n).

- **Heap vs general Binary Tree**
  - Every heap is a binary tree, but **not every binary tree is a heap**.
  - Heap adds:
    - **Shape constraint**: complete tree.
    - **Order constraint**: parent ≥ children (max) or parent ≤ children (min).

---

## 2. Where to find these in this repo

### Core implementations

- **Binary Search Tree**  
  - File: `DataStructures/Tree/binarySearchTree.js`  
  - Concepts: BST insert, find, traversal (DFS/BFS).

- **General Tree (n‑ary)**  
  - File: `DataStructures/Tree/tree.js`  
  - Concepts: tree node with `children[]`, BFS/DFS traversals (not limited to 2 children).

- **Binary Tree traversals & classic problems**  
  - File: `DSA_ProblemSolving_patterns/src/problems/TreeTraversal/treePatterns.ts`  
  - Contains:
    - `TreeNode` class (binary tree node).
    - Implementations for core binary tree problems:
      - Maximum Depth of Binary Tree (104)
      - Same Tree (100)
      - Invert Binary Tree (226)
      - Level Order & Zigzag Level Order (102, 103)
      - Maximum Path Sum (124)
      - Lowest Common Ancestor (236)
      - Validate BST (98)
      - Construct Tree from Preorder/Inorder (105)
      - Construct Tree from Inorder/Postorder (106)
      - Serialize & Deserialize (297)
      - Subtree of Another Tree (572)
      - Path Sum I & II (112, 113)
      - Right Side View (199)
      - Count Complete Tree Nodes (222)

- **Max Binary Heap (array‑based complete binary tree)**  
  - File: `DataStructures/Heap/Max_binary_heap.js`  
  - Concepts:
    - Array representation of a complete binary tree.
    - `insert` with bubble‑up.
    - `extractMax` with sink‑down.
    - Heap as a max‑priority queue.

### Heap usage in problems

- **Min Heap for Top‑K / Kth Largest**  
  - File: `DSA_ProblemSolving_patterns/src/problems/Arrays/kthLargest.js`  
  - `MinHeap` class shows a **min‑heap** implementation used for top‑k style problems.

---

## 3. Question lists to practice (Binary Tree / BST / Heap)

### Tree Traversal pattern (Binary Tree)

- **Overview / checklist**:  
  - File: `DSA_ProblemSolving_patterns/BLIND_75_COMPLETE.md`  
  - Section: **Tree Traversal Pattern (17 problems)**  
  - Problems include:
    - Maximum Depth of Binary Tree (104)
    - Same Tree (100)
    - Invert Binary Tree (226)
    - Binary Tree Level Order (102)
    - Binary Tree Zigzag Level Order (103)
    - Binary Tree Maximum Path Sum (124)
    - Validate BST (98)
    - Kth Smallest in BST (230)
    - Construct Tree from Preorder/Inorder (105)
    - Construct Tree from Inorder/Postorder (106)
    - Serialize and Deserialize Binary Tree (297)
    - Subtree of Another Tree (572)
    - Binary Tree Right Side View (199)
    - Count Complete Tree Nodes (222)

- **Roadmap view**:  
  - File: `DSA_ProblemSolving_patterns/DSA_Practice_Roadmap.md`  
  - Week 7: **Tree Traversals (DFS/BFS)**  
  - Highlights:
    - Must‑do problems (104, 100, 226, 102, 98)
    - Practice problems (101, 112, 199, etc.)

### Heap / Priority Queue problems

- See **Kth Largest Element** (QuickSelect + Min‑Heap):  
  - File: `DSA_ProblemSolving_patterns/src/problems/Arrays/kthLargest.js`  
  - Shows how min‑heap fits into **Top‑K / priority queue** style problems.

---

## 4. Suggested quick‑revision flow

When you come back to revise:

1. **Re‑read this README** for the high‑level differences:
   - Binary Tree vs BST vs Max/Min Heap.
2. **Skim the implementations**:
   - `binarySearchTree.js` → BST insert/find/traversals.
   - `Max_binary_heap.js` → array‑based heap, bubble‑up, sink‑down.
   - `treePatterns.ts` → core binary tree problems and traversals.
3. **Run through the question lists**:
   - `BLIND_75_COMPLETE.md` → Tree Traversal pattern table.
   - `DSA_Practice_Roadmap.md` → Week 7 section.
4. **Re‑implement 2–3 problems** from `treePatterns.ts` from scratch
   (e.g. max depth, invert tree, level order, right side view) to lock in the concepts.

