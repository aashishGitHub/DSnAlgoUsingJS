/**
 * Islands/Matrix Traversal Pattern
 * 
 * This pattern is used for efficient traversal of 2D arrays or matrices.
 * Traversal often involves DFS, BFS, or variations for problems involving
 * connected components, path finding, or matrix manipulation.
 * 
 * Key Points:
 * - Used for efficient traversal of 2D arrays or matrices
 * - Traversal often involves DFS, BFS, or variations
 * - Common for connected components and path finding
 * 
 * Time Complexity: O(m * n) where m and n are matrix dimensions
 * Space Complexity: O(m * n) for recursion stack or O(min(m, n)) for BFS queue
 */

// ============================================================================
// 1. NUMBER OF ISLANDS
// ============================================================================

/**
 * Find the number of islands in a 2D grid
 * 
 * An island is formed by connecting adjacent lands horizontally or vertically.
 * You may assume all four edges of the grid are all surrounded by water.
 * 
 * @param grid - 2D array where '1' represents land and '0' represents water
 * @returns Number of islands
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - recursion stack in worst case
 */
export function numIslands(grid: string[][]): number {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
    
    // Directions: up, down, left, right
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number): void {
        // Base cases: out of bounds or water
        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === '0') {
            return;
        }
        
        // Mark current cell as visited
        grid[row][col] = '0';
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc);
        }
    }
    
    // Traverse the entire grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                dfs(i, j); // Mark entire island as visited
            }
        }
    }
    
    return islandCount;
}

// ============================================================================
// 2. FLOOD FILL
// ============================================================================

/**
 * Perform flood fill on an image
 * 
 * Start from the given pixel and change all connected pixels of the same color
 * to the new color.
 * 
 * @param image - 2D array representing the image
 * @param sr - Starting row
 * @param sc - Starting column
 * @param newColor - New color to fill
 * @returns Modified image after flood fill
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - recursion stack
 */
export function floodFill(
    image: number[][], 
    sr: number, 
    sc: number, 
    newColor: number
): number[][] {
    if (!image || image.length === 0) return image;
    
    const rows = image.length;
    const cols = image[0].length;
    const originalColor = image[sr][sc];
    
    // If already the same color, no need to change
    if (originalColor === newColor) return image;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number): void {
        // Base cases
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            image[row][col] !== originalColor) {
            return;
        }
        
        // Change color
        image[row][col] = newColor;
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc);
        }
    }
    
    dfs(sr, sc);
    return image;
}

// ============================================================================
// 3. CYCLE IN A MATRIX
// ============================================================================

/**
 * Detect if there's a cycle in a 2D matrix
 * 
 * A cycle exists if we can start from a cell and return to it by following
 * adjacent cells with the same value.
 * 
 * @param matrix - 2D array
 * @returns True if cycle exists, false otherwise
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - visited array and recursion stack
 */
export function hasCycle(matrix: number[][]): boolean {
    if (!matrix || matrix.length === 0) return false;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number, parentRow: number, parentCol: number): boolean {
        // Base cases
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            return false;
        }
        
        // If already visited, we found a cycle
        if (visited[row][col]) {
            return true;
        }
        
        // Mark as visited
        visited[row][col] = true;
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            // Skip parent cell and cells with different values
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
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j] && dfs(i, j, -1, -1)) {
                return true;
            }
        }
    }
    
    return false;
}

// ============================================================================
// 4. MAX AREA OF ISLAND
// ============================================================================

/**
 * Find the maximum area of an island in a 2D grid
 * 
 * @param grid - 2D array where 1 represents land and 0 represents water
 * @returns Maximum area of any island
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - recursion stack
 */
export function maxAreaOfIsland(grid: number[][]): number {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let maxArea = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number): number {
        // Base cases
        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === 0) {
            return 0;
        }
        
        // Mark as visited and count current cell
        grid[row][col] = 0;
        let area = 1;
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            area += dfs(row + dr, col + dc);
        }
        
        return area;
    }
    
    // Check each cell
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                maxArea = Math.max(maxArea, dfs(i, j));
            }
        }
    }
    
    return maxArea;
}

// ============================================================================
// 5. SURROUNDED REGIONS
// ============================================================================

/**
 * Capture surrounded regions in a 2D board
 * 
 * Capture all 'O's that are surrounded by 'X's on all four sides.
 * Regions on the border are not captured.
 * 
 * @param board - 2D array with 'X' and 'O' characters
 * @returns Modified board with captured regions
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - recursion stack
 */
export function solve(board: string[][]): void {
    if (!board || board.length === 0) return;
    
    const rows = board.length;
    const cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function dfs(row: number, col: number): void {
        // Base cases
        if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col] !== 'O') {
            return;
        }
        
        // Mark as visited (temporarily as 'T')
        board[row][col] = 'T';
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc);
        }
    }
    
    // Mark border 'O's as temporary 'T'
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((i === 0 || i === rows - 1 || j === 0 || j === cols - 1) && 
                board[i][j] === 'O') {
                dfs(i, j);
            }
        }
    }
    
    // Convert remaining 'O's to 'X' and 'T's back to 'O'
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (board[i][j] === 'O') {
                board[i][j] = 'X';
            } else if (board[i][j] === 'T') {
                board[i][j] = 'O';
            }
        }
    }
}

// ============================================================================
// 6. BFS VERSION OF NUMBER OF ISLANDS
// ============================================================================

/**
 * Find number of islands using BFS approach
 * 
 * @param grid - 2D array where '1' represents land and '0' represents water
 * @returns Number of islands
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(min(m, n)) - queue size in worst case
 */
export function numIslandsBFS(grid: string[][]): number {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function bfs(startRow: number, startCol: number): void {
        const queue: number[][] = [[startRow, startCol]];
        grid[startRow][startCol] = '0'; // Mark as visited
        
        while (queue.length > 0) {
            const [row, col] = queue.shift()!;
            
            // Explore all four directions
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === '1') {
                    grid[newRow][newCol] = '0'; // Mark as visited
                    queue.push([newRow, newCol]);
                }
            }
        }
    }
    
    // Traverse the entire grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                bfs(i, j);
            }
        }
    }
    
    return islandCount;
}

// ============================================================================
// 7. PACIFIC ATLANTIC WATER FLOW
// ============================================================================

/**
 * Find cells that can flow to both Pacific and Atlantic oceans
 * 
 * @param heights - 2D array representing heights
 * @returns Array of coordinates that can reach both oceans
 * 
 * Time: O(m * n) - visit each cell once
 * Space: O(m * n) - visited arrays and recursion stack
 */
export function pacificAtlantic(heights: number[][]): number[][] {
    if (!heights || heights.length === 0) return [];
    
    const rows = heights.length;
    const cols = heights[0].length;
    const pacific = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const atlantic = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const result: number[][] = [];
    
    function dfs(row: number, col: number, ocean: boolean[][], prevHeight: number): void {
        // Base cases
        if (row < 0 || row >= rows || col < 0 || col >= cols || 
            ocean[row][col] || heights[row][col] < prevHeight) {
            return;
        }
        
        // Mark as reachable
        ocean[row][col] = true;
        
        // Explore all four directions
        for (const [dr, dc] of directions) {
            dfs(row + dr, col + dc, ocean, heights[row][col]);
        }
    }
    
    // Start from Pacific (top and left edges)
    for (let i = 0; i < rows; i++) {
        dfs(i, 0, pacific, heights[i][0]);
    }
    for (let j = 0; j < cols; j++) {
        dfs(0, j, pacific, heights[0][j]);
    }
    
    // Start from Atlantic (bottom and right edges)
    for (let i = 0; i < rows; i++) {
        dfs(i, cols - 1, atlantic, heights[i][cols - 1]);
    }
    for (let j = 0; j < cols; j++) {
        dfs(rows - 1, j, atlantic, heights[rows - 1][j]);
    }
    
    // Find cells reachable from both oceans
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.push([i, j]);
            }
        }
    }
    
    return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Print a 2D matrix in a readable format
 */
export function printMatrix(matrix: any[][]): void {
    for (const row of matrix) {
        console.log(row.join(' '));
    }
}

/**
 * Create a copy of a 2D matrix
 */
export function copyMatrix<T>(matrix: T[][]): T[][] {
    return matrix.map(row => [...row]);
}

/**
 * Check if coordinates are within matrix bounds
 */
export function isValidPosition(row: number, col: number, rows: number, cols: number): boolean {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

// ============================================================================
// VIRUS INFECTION SPREAD (Multi-Source BFS)
// ============================================================================

/**
 * ============================================================================
 * 🎯 PATTERN IDENTIFICATION: MULTI-SOURCE BFS
 * ============================================================================
 * 
 * WHY THIS IS MULTI-SOURCE BFS:
 * 
 * 1. **Multiple Starting Points**: We have multiple infected cells (value 2)
 *    that all start spreading simultaneously. This is the key characteristic
 *    of multi-source BFS - we don't have a single starting point.
 * 
 * 2. **Level-by-Level Propagation**: The infection spreads in "waves" or "levels":
 *    - Minute 0: All cells with value 2 are infected
 *    - Minute 1: All cells adjacent to minute-0 cells become infected
 *    - Minute 2: All cells adjacent to minute-1 cells become infected
 *    - And so on...
 *    This is exactly how BFS works - it processes nodes level by level!
 * 
 * 3. **Shortest Path Property**: BFS guarantees that we find the minimum time
 *    to reach each cell because it explores level by level. The first time we
 *    reach a cell is the shortest path to it.
 * 
 * 4. **Queue-Based Processing**: We use a queue to process all cells at the
 *    current "level" (minute) before moving to the next level.
 * 
 * 5. **Similar Problems**:
 *    - Rotting Oranges (LeetCode 994) - identical pattern!
 *    - 01 Matrix (LeetCode 542) - find distance to nearest 0
 *    - Walls and Gates (LeetCode 286) - find distance to nearest gate
 * 
 * ============================================================================
 * 
 * PROBLEM STATEMENT:
 * 
 * You are given an m x n grid where each cell can have one of three values:
 * - 0: empty cell (cannot be infected)
 * - 1: non-infected system
 * - 2: virus infected system
 * 
 * Every minute, any non-infected system (1) that is 4-directionally adjacent
 * to any virus infected system (2) becomes infected.
 * 
 * Return the minimum number of minutes that must elapse so that all systems
 * become virus infected. If it's impossible, return -1.
 * 
 * Example:
 * Input: grid = [[2,1,1],
 *                [1,1,0],
 *                [0,1,1]]
 * 
 * Visual representation:
 * 
 * Minute 0:        Minute 1:        Minute 2:        Minute 3:        Minute 4:
 * [2,1,1]          [2,2,1]          [2,2,2]          [2,2,2]          [2,2,2]
 * [1,1,0]    →     [2,1,0]    →     [2,2,0]    →     [2,2,0]    →     [2,2,0]
 * [0,1,1]          [0,1,1]          [0,2,1]          [0,2,2]          [0,2,2]
 * 
 * Output: 4
 * 
 * ============================================================================
 * 
 * APPROACH:
 * 
 * 1. **Initialization**:
 *    - Find all initially infected cells (value 2) and add them to queue
 *    - Count total non-infected cells (value 1) that need to be infected
 *    - Initialize minutes counter to 0
 * 
 * 2. **Multi-Source BFS**:
 *    - Process all cells at current level (minute) together
 *    - For each infected cell, check its 4 neighbors
 *    - If neighbor is non-infected (1), infect it and add to queue
 *    - Decrement count of non-infected cells
 * 
 * 3. **Level Processing**:
 *    - Use queue size to track current level
 *    - Process all cells at current level before incrementing minutes
 *    - After processing a level, increment minutes counter
 * 
 * 4. **Termination**:
 *    - If all non-infected cells are infected, return minutes
 *    - If queue is empty but cells remain, return -1 (impossible)
 * 
 * ============================================================================
 * 
 * TIME COMPLEXITY: O(m * n)
 * - We visit each cell at most once
 * - Each cell is processed once when it becomes infected
 * 
 * SPACE COMPLEXITY: O(m * n)
 * - Queue can contain at most all cells in worst case
 * - In practice, it's O(k) where k is number of infected cells at each level
 * 
 * ============================================================================
 * 
 * @param grid - 2D array where 0=empty, 1=non-infected, 2=infected
 * @returns Minimum minutes to infect all systems, or -1 if impossible
 */
export function minTimeToInfectAll(grid: number[][]): number {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    
    // Queue for BFS: stores [row, col] of infected cells
    const queue: number[][] = [];
    
    // Count of non-infected cells that need to be infected
    let nonInfectedCount = 0;
    
    // Step 1: Find all initially infected cells and count non-infected cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) {
                // Add infected cell to queue (these are our "sources")
                queue.push([i, j]);
            } else if (grid[i][j] === 1) {
                // Count non-infected cells
                nonInfectedCount++;
            }
        }
    }
    
    // If no non-infected cells, we're done!
    if (nonInfectedCount === 0) {
        return 0;
    }
    
    // If no infected cells but there are non-infected cells, it's impossible
    if (queue.length === 0) {
        return -1;
    }
    
    // Directions: up, down, left, right (4-directional)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    let minutes = 0;
    
    // Step 2: Multi-source BFS
    while (queue.length > 0) {
        // Get the number of cells at current level (current minute)
        const currentLevelSize = queue.length;
        
        // Process all cells at current level
        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift()!;
            
            // Check all 4 neighbors
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                // Check if neighbor is valid and non-infected
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === 1) {
                    
                    // Infect the neighbor!
                    grid[newRow][newCol] = 2;
                    nonInfectedCount--; // One less cell to infect
                    
                    // Add to queue for next level
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        // After processing current level, increment minutes
        // But only if we infected some cells in this minute
        if (queue.length > 0) {
            minutes++;
        }
    }
    
    // If all cells are infected, return minutes
    // Otherwise, some cells couldn't be reached (surrounded by 0s)
    return nonInfectedCount === 0 ? minutes : -1;
}

/**
 * ============================================================================
 * ALTERNATIVE IMPLEMENTATION: With Detailed Tracking
 * ============================================================================
 * 
 * This version provides more detailed tracking and visualization
 * 
 * @param grid - 2D array where 0=empty, 1=non-infected, 2=infected
 * @returns Object with minutes and detailed information
 */
export function minTimeToInfectAllDetailed(grid: number[][]): {
    minutes: number;
    isPossible: boolean;
    infectedAtEachMinute: number[][][];
} {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return { minutes: 0, isPossible: true, infectedAtEachMinute: [] };
    }

    // Create a copy to avoid modifying original
    const gridCopy = grid.map(row => [...row]);
    const rows = gridCopy.length;
    const cols = gridCopy[0].length;
    
    const queue: number[][] = [];
    let nonInfectedCount = 0;
    const infectedAtEachMinute: number[][][] = [];
    
    // Find all initially infected cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gridCopy[i][j] === 2) {
                queue.push([i, j]);
            } else if (gridCopy[i][j] === 1) {
                nonInfectedCount++;
            }
        }
    }
    
    if (nonInfectedCount === 0) {
        return { minutes: 0, isPossible: true, infectedAtEachMinute: [] };
    }
    
    if (queue.length === 0) {
        return { minutes: -1, isPossible: false, infectedAtEachMinute: [] };
    }
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let minutes = 0;
    
    while (queue.length > 0) {
        const currentLevelSize = queue.length;
        const newlyInfected: number[][] = [];
        
        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift()!;
            
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    gridCopy[newRow][newCol] === 1) {
                    
                    gridCopy[newRow][newCol] = 2;
                    nonInfectedCount--;
                    newlyInfected.push([newRow, newCol]);
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        if (newlyInfected.length > 0) {
            minutes++;
            infectedAtEachMinute.push([...newlyInfected]);
        }
    }
    
    return {
        minutes: nonInfectedCount === 0 ? minutes : -1,
        isPossible: nonInfectedCount === 0,
        infectedAtEachMinute
    };
}
