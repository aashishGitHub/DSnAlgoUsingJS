# Islands/Matrix Traversal Pattern

The Islands/Matrix Traversal pattern is used for efficient traversal of 2D arrays or matrices. This pattern is essential for problems involving connected components, path finding, or matrix manipulation where you need to explore adjacent cells systematically.

## Pattern Types

### 1. DFS (Depth-First Search) Traversal
- **Recursive approach** for exploring connected components
- Perfect for island counting, flood fill, and path finding
- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n) for recursion stack

**Common Problems:**
- Number of Islands
- Flood Fill
- Max Area of Island
- Surrounded Regions
- Pacific Atlantic Water Flow

### 2. BFS (Breadth-First Search) Traversal
- **Iterative approach** using a queue
- Better for shortest path problems and when you need level-by-level exploration
- **Time Complexity:** O(m * n)
- **Space Complexity:** O(min(m, n)) for queue

**Common Problems:**
- Shortest path in matrix
- Level order traversal of matrix
- Multi-source BFS problems

### 3. Cycle Detection in Matrix
- **Detect cycles** in 2D grids
- Useful for validating matrix structures
- **Time Complexity:** O(m * n)
- **Space Complexity:** O(m * n)

**Common Problems:**
- Cycle in a Matrix
- Detect cycles in directed graphs represented as matrices

## Implementation Templates

### DFS Template
```typescript
function dfsTraversal(grid: string[][], row: number, col: number): void {
    // Base cases: out of bounds or invalid cell
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || 
        grid[row][col] === '0') {
        return;
    }
    
    // Mark current cell as visited
    grid[row][col] = '0';
    
    // Explore all four directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
        dfsTraversal(grid, row + dr, col + dc);
    }
}
```

### BFS Template
```typescript
function bfsTraversal(grid: string[][], startRow: number, startCol: number): void {
    const queue: number[][] = [[startRow, startCol]];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (queue.length > 0) {
        const [row, col] = queue.shift()!;
        
        // Process current cell
        grid[row][col] = '0'; // Mark as visited
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < grid.length && 
                newCol >= 0 && newCol < grid[0].length && 
                grid[newRow][newCol] === '1') {
                queue.push([newRow, newCol]);
            }
        }
    }
}
```

### Cycle Detection Template
```typescript
function hasCycle(matrix: number[][]): boolean {
    const visited = Array(matrix.length).fill(null)
        .map(() => Array(matrix[0].length).fill(false));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number, parentRow: number, parentCol: number): boolean {
        if (row < 0 || row >= matrix.length || col < 0 || col >= matrix[0].length) {
            return false;
        }
        
        if (visited[row][col]) {
            return true; // Found a cycle
        }
        
        visited[row][col] = true;
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if ((newRow === parentRow && newCol === parentCol) ||
                matrix[newRow]?.[newCol] !== matrix[row][col]) {
                continue;
            }
            
            if (dfs(newRow, newCol, row, col)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Check each cell
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (!visited[i][j] && dfs(i, j, -1, -1)) {
                return true;
            }
        }
    }
    
    return false;
}
```

## Key Concepts

### Direction Vectors
- **Four directions:** `[[-1, 0], [1, 0], [0, -1], [0, 1]]` (up, down, left, right)
- **Eight directions:** Include diagonals for more complex traversals
- **Custom directions:** Based on problem requirements

### Visited Tracking
- **In-place modification:** Change cell values to mark as visited
- **Separate visited array:** When you can't modify the original matrix
- **Set/Map:** For complex state tracking

### Boundary Conditions
- **Always check bounds** before accessing matrix cells
- **Handle edge cases** like empty matrices
- **Consider matrix dimensions** for space complexity

## When to Use Islands/Matrix Traversal

✅ **Use when:**
- Problem involves 2D arrays or matrices
- Need to find connected components
- Path finding in grids
- Flood fill operations
- Cycle detection in 2D structures
- Multi-source problems (like Pacific Atlantic)

❌ **Don't use when:**
- Problem doesn't involve 2D structures
- Need to process elements in a specific order
- Problem requires complex data structures
- Working with 1D arrays or strings

## Common Patterns

### 1. Island Counting Pattern
```typescript
// Count connected components
let count = 0;
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (grid[i][j] === '1') {
            count++;
            dfs(i, j); // Mark entire island as visited
        }
    }
}
```

### 2. Flood Fill Pattern
```typescript
// Change all connected cells of same value
function floodFill(row: number, col: number, newValue: number): void {
    if (isValid(row, col) && grid[row][col] === originalValue) {
        grid[row][col] = newValue;
        // Recursively fill adjacent cells
        floodFill(row + 1, col, newValue);
        floodFill(row - 1, col, newValue);
        floodFill(row, col + 1, newValue);
        floodFill(row, col - 1, newValue);
    }
}
```

### 3. Multi-Source BFS Pattern
```typescript
// Start from multiple sources simultaneously
const queue: number[][] = [];
const visited = new Set<string>();

// Add all starting points to queue
for (const [row, col] of startingPoints) {
    queue.push([row, col]);
    visited.add(`${row},${col}`);
}

while (queue.length > 0) {
    const [row, col] = queue.shift()!;
    // Process and add neighbors
}
```

## Common Mistakes

1. **Forgetting boundary checks**
   - Always validate row and column indices
   - Handle edge cases like empty matrices

2. **Incorrect visited marking**
   - Mark cells as visited before processing
   - Use consistent marking strategy

3. **Wrong direction vectors**
   - Double-check direction arrays
   - Consider diagonal movements if needed

4. **Memory issues with large matrices**
   - Use BFS for better space complexity
   - Consider iterative approaches for deep recursion

## Performance Tips

1. **Choose the right traversal method**
   - DFS for connected components
   - BFS for shortest path problems

2. **Optimize space usage**
   - Use in-place modification when possible
   - Consider iterative approaches for deep recursion

3. **Handle large matrices efficiently**
   - Use BFS to avoid stack overflow
   - Consider parallel processing for independent regions

## Practice Problems

### Easy
- [ ] Number of Islands
- [ ] Flood Fill
- [ ] Max Area of Island
- [ ] Island Perimeter

### Medium
- [ ] Surrounded Regions
- [ ] Pacific Atlantic Water Flow
- [ ] Rotting Oranges
- [ ] Walls and Gates

### Hard
- [ ] Shortest Path in Binary Matrix
- [ ] Critical Connections in a Network
- [ ] Minimum Cost to Make at Least One Valid Path
- [ ] Shortest Path with Alternating Colors

## Files in this Directory

- `islandsMatrixPatterns.ts` - Main implementation file
- `islandsMatrixPatterns.test.ts` - Test cases
- `README.md` - This documentation

## Advanced Topics

### Union-Find for Islands
- Disjoint Set Union (DSU) for dynamic connectivity
- More efficient for multiple queries
- Path compression and union by rank

### Multi-threaded Matrix Traversal
- Parallel processing of independent regions
- Thread-safe data structures
- Load balancing strategies

### Memory-Efficient Traversals
- Iterative DFS using explicit stack
- Bit manipulation for visited tracking
- Streaming algorithms for very large matrices
