# 🚀 Essential DSA Patterns for Top Tech Company Interviews

*Based on analysis of FAANG+ interview patterns and Blind 75 questions*

## 📊 **Pattern Frequency & Priority**

### **Tier 1: Must-Know (80% of problems)**
1. **Two Pointers** 
2. **Sliding Window**
3. **Hash Map/Set**
4. **Binary Search**
5. **DFS/BFS**
6. **Dynamic Programming**

### **Tier 2: Very Important (60% of problems)**
7. **Fast & Slow Pointers**
8. **Merge Intervals**
9. **Backtracking** 
10. **Heap/Priority Queue**
11. **Stack/Queue**
12. **Tree Traversals**

### **Tier 3: Advanced (40% of problems)**
13. **Topological Sort**
14. **Union Find**
15. **Bit Manipulation**
16. **Greedy Algorithms**
17. **Trie**
18. **Segment Tree/Fenwick Tree**

---

## 🎯 **Detailed Pattern Breakdown**

### **1. Two Pointers** 
**When to Use**: Sorted arrays, palindromes, pair problems
**Time**: O(n) | **Space**: O(1)

**Common Problems**:
- Two Sum (sorted array)
- 3Sum, 4Sum
- Container with Most Water
- Trapping Rain Water
- Valid Palindrome

**Template**:
```javascript
function twoPointers(arr) {
    let left = 0, right = arr.length - 1;
    
    while (left < right) {
        if (condition) {
            // Process and move pointers
            left++;
        } else {
            right--;
        }
    }
}
```

**Companies**: Google ⭐⭐⭐, Meta ⭐⭐⭐, Amazon ⭐⭐⭐

---

### **2. Sliding Window**
**When to Use**: Contiguous subarrays/substrings, optimization problems
**Time**: O(n) | **Space**: O(k)

**Variations**:
- **Fixed Size**: Maximum sum subarray of size K
- **Variable Size**: Longest substring without repeating characters
- **Shrinking**: Minimum window substring

**Template**:
```javascript
function slidingWindow(arr) {
    let left = 0, maxVal = 0;
    
    for (let right = 0; right < arr.length; right++) {
        // Expand window
        
        while (windowConditionViolated) {
            // Shrink window
            left++;
        }
        
        maxVal = Math.max(maxVal, right - left + 1);
    }
    return maxVal;
}
```

**Companies**: Microsoft ⭐⭐⭐, Amazon ⭐⭐⭐, Google ⭐⭐

---

### **3. Hash Map/Set Patterns**
**When to Use**: Frequency counting, lookups, duplicate detection
**Time**: O(n) | **Space**: O(n)

**Common Problems**:
- Two Sum
- Group Anagrams
- Top K Frequent Elements
- Longest Consecutive Sequence

**Template**:
```javascript
function hashMapPattern(arr) {
    const map = new Map();
    
    for (const item of arr) {
        map.set(item, (map.get(item) || 0) + 1);
    }
    
    // Process map entries
}
```

**Companies**: All companies ⭐⭐⭐⭐⭐

---

### **4. Binary Search**
**When to Use**: Sorted arrays, search space reduction, optimization
**Time**: O(log n) | **Space**: O(1)

**Variations**:
- **Classic**: Find target in sorted array
- **Lower/Upper Bound**: First/last occurrence
- **Search in Rotated**: Rotated sorted array
- **Answer Search**: Search for the answer

**Template**:
```javascript
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

**Companies**: Google ⭐⭐⭐⭐, Meta ⭐⭐⭐, Amazon ⭐⭐⭐

---

### **5. DFS/BFS (Tree & Graph)**
**When to Use**: Tree/graph traversal, shortest path, connected components
**Time**: O(V + E) | **Space**: O(V)

**DFS Template**:
```javascript
function dfs(node, visited) {
    if (!node || visited.has(node)) return;
    
    visited.add(node);
    // Process current node
    
    for (const neighbor of node.neighbors) {
        dfs(neighbor, visited);
    }
}
```

**BFS Template**:
```javascript
function bfs(start) {
    const queue = [start];
    const visited = new Set([start]);
    
    while (queue.length) {
        const node = queue.shift();
        // Process current node
        
        for (const neighbor of node.neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}
```

**Companies**: Meta ⭐⭐⭐⭐, Google ⭐⭐⭐⭐, Amazon ⭐⭐⭐

---

### **6. Dynamic Programming**
**When to Use**: Optimization, counting, decision problems with overlapping subproblems
**Time**: Varies | **Space**: O(n) to O(n²)

**Approaches**:
- **Top-down**: Memoization (recursive)
- **Bottom-up**: Tabulation (iterative)

**Template**:
```javascript
// Top-down (Memoization)
function dpTopDown(n, memo = new Map()) {
    if (baseCase) return baseValue;
    if (memo.has(n)) return memo.get(n);
    
    const result = /* recurrence relation */;
    memo.set(n, result);
    return result;
}

// Bottom-up (Tabulation)
function dpBottomUp(n) {
    const dp = new Array(n + 1);
    dp[0] = baseValue;
    
    for (let i = 1; i <= n; i++) {
        dp[i] = /* recurrence relation */;
    }
    return dp[n];
}
```

**Companies**: All companies ⭐⭐⭐⭐⭐

---

### **7. Fast & Slow Pointers**
**When to Use**: Cycle detection, finding middle, palindrome checks
**Time**: O(n) | **Space**: O(1)

**Template**:
```javascript
function fastSlowPointers(head) {
    let slow = head, fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // Cycle detected
            return true;
        }
    }
    return false;
}
```

**Companies**: Microsoft ⭐⭐⭐, Amazon ⭐⭐⭐, Google ⭐⭐

---

### **8. Merge Intervals**
**When to Use**: Overlapping intervals, scheduling problems
**Time**: O(n log n) | **Space**: O(1)

**Template**:
```javascript
function mergeIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        if (current[0] <= lastMerged[1]) {
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    return merged;
}
```

**Companies**: Google ⭐⭐⭐, Amazon ⭐⭐⭐, Microsoft ⭐⭐

---

### **9. Heap/Priority Queue**
**When to Use**: Top K problems, merge operations, scheduling
**Time**: O(n log k) | **Space**: O(k)

**Template**:
```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(val) {
        this.heap.push(val);
        this.bubbleUp();
    }
    
    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }
}
```

**Companies**: Amazon ⭐⭐⭐⭐, Google ⭐⭐⭐, Meta ⭐⭐

---

### **10. Backtracking**
**When to Use**: Generating all solutions, permutations, combinations
**Time**: O(2^n) to O(n!) | **Space**: O(n)

**Template**:
```javascript
function backtrack(path, choices) {
    if (isComplete(path)) {
        result.push([...path]);
        return;
    }
    
    for (const choice of choices) {
        if (isValid(choice)) {
            path.push(choice);
            backtrack(path, getNewChoices(choice));
            path.pop(); // backtrack
        }
    }
}
```

**Companies**: Meta ⭐⭐⭐, Google ⭐⭐⭐, Amazon ⭐⭐

---

## 🏢 **Company-Specific Preferences**

### **Google** 🔍
- **Favorites**: Binary Search, DFS/BFS, Dynamic Programming
- **Focus**: Complex algorithms, optimization
- **Avoid**: Brute force solutions

### **Meta** 👥
- **Favorites**: DFS/BFS, Backtracking, Hash Maps
- **Focus**: Social network problems, graph algorithms
- **Specialty**: Tree/graph traversals

### **Amazon** 📦
- **Favorites**: Two Pointers, Heap, Sliding Window
- **Focus**: System design + algorithms
- **Practical**: Real-world optimization problems

### **Microsoft** 💻
- **Favorites**: Fast/Slow Pointers, Stack/Queue, Intervals
- **Focus**: Clean code, edge cases
- **Balanced**: Mix of all patterns

### **Apple** 🍎
- **Favorites**: Arrays, Strings, Basic DS
- **Focus**: Implementation details
- **Style**: Elegant, efficient solutions

---

## 📈 **Learning Path Recommendation**

### **Week 1-2: Foundation**
1. Two Pointers (start here like your moveZeros problem!)
2. Hash Maps/Sets
3. Sliding Window

### **Week 3-4: Core Patterns**
4. Binary Search
5. Fast & Slow Pointers
6. Stack/Queue problems

### **Week 5-6: Tree & Graph**
7. DFS/BFS
8. Tree Traversals
9. Graph basics

### **Week 7-8: Advanced**
10. Dynamic Programming (start with 1D)
11. Backtracking
12. Heap/Priority Queue

### **Week 9-10: Specialized**
13. Merge Intervals
14. Topological Sort
15. Union Find

---

## 🎯 **Practice Strategy**

### **Daily Schedule**:
- **30 min**: Review pattern theory
- **60 min**: Solve 2-3 problems
- **30 min**: Analyze solutions, edge cases

### **Problem Selection**:
- Start with **Easy** problems to build confidence
- Move to **Medium** after mastering the pattern
- Attempt **Hard** only after 80% Medium success rate

### **Key Resources**:
- **LeetCode**: Pattern-based problem lists
- **NeetCode**: Blind 75 with video explanations  
- **AlgoExpert**: Comprehensive pattern coverage
- **Grokking Coding Patterns**: Structured learning

---

## 🚨 **Red Flags to Avoid**

1. **Jumping patterns**: Master one before moving to next
2. **Ignoring edge cases**: Always test empty, single element, duplicates
3. **Memorizing solutions**: Focus on understanding the pattern
4. **Skipping complexity analysis**: Always analyze time/space
5. **Not practicing variations**: Each pattern has multiple forms

---

## 🏆 **Success Metrics**

- **Pattern Recognition**: 90% accuracy in identifying correct pattern
- **Implementation Speed**: Solve medium problems in 20-30 minutes
- **Edge Case Handling**: Cover all cases without hints
- **Optimization**: Achieve optimal time/space complexity
- **Code Quality**: Clean, readable, bug-free implementation

Start with the patterns you know (like Two Pointers from your moveZeros work) and gradually expand your toolkit. Consistency beats intensity! 🚀
