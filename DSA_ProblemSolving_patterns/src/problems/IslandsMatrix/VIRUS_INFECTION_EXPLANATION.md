# Virus Infection Spread - Pattern Analysis & Solution

## 🎯 Pattern Identification: **MULTI-SOURCE BFS**

### Why This is Multi-Source BFS?

This problem falls under the **Multi-Source Breadth-First Search (BFS)** pattern. Here's why:

#### 1. **Multiple Starting Points**
- We don't have a single source; we have **multiple infected cells** (all cells with value `2`)
- All these cells start spreading infection **simultaneously**
- This is the defining characteristic of multi-source BFS

#### 2. **Level-by-Level Propagation**
- The infection spreads in "waves" or "levels" (minutes):
  - **Minute 0**: All initially infected cells (value `2`)
  - **Minute 1**: All cells adjacent to minute-0 cells
  - **Minute 2**: All cells adjacent to minute-1 cells
  - And so on...
- This is **exactly** how BFS works - it processes nodes level by level!

#### 3. **Shortest Path Property**
- BFS guarantees we find the **minimum time** to reach each cell
- The first time we reach a cell is the shortest path to it
- This is perfect for finding "minimum minutes"

#### 4. **Queue-Based Processing**
- We use a queue to process all cells at the current "level" (minute) together
- This ensures we process all cells at minute `n` before moving to minute `n+1`

#### 5. **Graph Representation**
- Each cell is a node
- 4-directional adjacency creates edges
- We're essentially doing BFS on an implicit graph

---

## 📊 Problem Visualization

### Example:
```
Input: grid = [[2,1,1],
               [1,1,0],
               [0,1,1]]
```

### Step-by-Step Spread:

**Minute 0 (Initial):**
```
[2, 1, 1]    ← Cell [0,0] is infected (value 2)
[1, 1, 0]
[0, 1, 1]
```

**Minute 1:**
```
[2, 2, 1]    ← [0,1] and [1,0] become infected
[2, 1, 0]
[0, 1, 1]
```

**Minute 2:**
```
[2, 2, 2]    ← [0,2] and [1,1] become infected
[2, 2, 0]
[0, 1, 1]
```

**Minute 3:**
```
[2, 2, 2]    ← [2,1] becomes infected
[2, 2, 0]
[0, 2, 1]
```

**Minute 4:**
```
[2, 2, 2]    ← [2,2] becomes infected (last one!)
[2, 2, 0]
[0, 2, 2]
```

**Output: 4 minutes**

---

## 🔑 Key Insights

### Why BFS and Not DFS?
- **BFS processes level by level** → Perfect for "minutes" concept
- **DFS would go deep first** → Wouldn't give us the correct minimum time
- **BFS guarantees shortest path** → First time we reach a cell is minimum

### Why Multi-Source?
- We start with **multiple infected cells** (all `2`s)
- All start spreading **simultaneously**
- Single-source BFS would only start from one point

### Why Not Other Patterns?

❌ **Not Sliding Window**: No fixed window size, no array traversal pattern  
❌ **Not Two Pointers**: Not about finding pairs or subarrays  
❌ **Not Dynamic Programming**: No overlapping subproblems, no memoization needed  
❌ **Not Greedy**: Not about making locally optimal choices  
✅ **BFS**: Level-by-level exploration, shortest path, queue-based

---

## 💻 Algorithm Steps

### Step 1: Initialization
1. Find all initially infected cells (value `2`) → Add to queue
2. Count total non-infected cells (value `1`)
3. Initialize minutes counter to `0`

### Step 2: Multi-Source BFS
1. While queue is not empty:
   - Get size of current level (cells at current minute)
   - Process all cells at current level:
     - For each infected cell, check 4 neighbors
     - If neighbor is non-infected (`1`):
       - Infect it (change to `2`)
       - Add to queue for next level
       - Decrement non-infected count
   - After processing level, increment minutes

### Step 3: Termination
- If all non-infected cells are infected → Return minutes
- If queue empty but cells remain → Return `-1` (impossible)

---

## ⏱️ Complexity Analysis

### Time Complexity: **O(m × n)**
- We visit each cell at most once
- Each cell is processed once when it becomes infected
- `m` = number of rows, `n` = number of columns

### Space Complexity: **O(m × n)**
- Queue can contain at most all cells in worst case
- In practice: O(k) where k = number of infected cells at each level
- Worst case: O(m × n) when all cells are in queue

---

## 🔍 Similar Problems (Same Pattern)

1. **Rotting Oranges** (LeetCode 994) - **Identical pattern!**
   - Oranges rot instead of systems getting infected
   - Same multi-source BFS approach

2. **01 Matrix** (LeetCode 542)
   - Find distance to nearest 0
   - Multi-source BFS from all 0s

3. **Walls and Gates** (LeetCode 286)
   - Find distance to nearest gate
   - Multi-source BFS from all gates

4. **Shortest Path in Binary Matrix** (LeetCode 1091)
   - Find shortest path from top-left to bottom-right
   - Single-source BFS (but similar concept)

---

## 📝 Code Implementation

### Core Algorithm:
```javascript
function minTimeToInfectAll(grid) {
    const queue = [];
    let nonInfectedCount = 0;
    
    // Find all infected cells and count non-infected
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) queue.push([i, j]);
            else if (grid[i][j] === 1) nonInfectedCount++;
        }
    }
    
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    let minutes = 0;
    
    // Multi-source BFS
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (isValid && grid[newRow][newCol] === 1) {
                    grid[newRow][newCol] = 2;
                    nonInfectedCount--;
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        if (queue.length > 0) minutes++;
    }
    
    return nonInfectedCount === 0 ? minutes : -1;
}
```

---

## 🎓 Pattern Recognition Checklist

When you see a problem like this, ask:

1. ✅ **Multiple starting points?** → Multi-source BFS
2. ✅ **Spreading/expanding in levels?** → BFS (not DFS)
3. ✅ **Finding minimum time/distance?** → BFS guarantees shortest path
4. ✅ **Grid/matrix traversal?** → BFS/DFS on implicit graph
5. ✅ **4-directional or 8-directional?** → Define directions array

If you answer "yes" to most of these → **Multi-Source BFS** is likely the pattern!

---

## 🚀 Key Takeaways

1. **Multi-Source BFS** is used when you have multiple starting points
2. **BFS processes level-by-level** → Perfect for time-based problems
3. **Queue tracks current level** → Process all at same level before next
4. **Shortest path property** → BFS finds minimum time/distance
5. **Similar to Rotting Oranges** → Same pattern, different context

---

## 📚 Related Files

- **Solution**: `islandsMatrixPatterns.ts` (functions: `minTimeToInfectAll`, `minTimeToInfectAllDetailed`)
- **Demo**: `virusInfectionDemo.js` (with visualization)
- **Tests**: `islandsMatrixPatterns.test.ts`

---

*Last Updated: Pattern analysis for Virus Infection Spread problem*

