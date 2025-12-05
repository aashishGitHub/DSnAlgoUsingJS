/**
 * ============================================================================
 * VIRUS INFECTION SPREAD - DEMONSTRATION
 * ============================================================================
 * 
 * This file demonstrates the Multi-Source BFS solution for the virus
 * infection spread problem with detailed visualization.
 * 
 * Problem: Find minimum minutes to infect all systems in a grid
 * Pattern: Multi-Source BFS (Breadth-First Search)
 * 
 * ============================================================================
 */

/**
 * Main solution function
 * @param {number[][]} grid - Grid where 0=empty, 1=non-infected, 2=infected
 * @returns {number} Minimum minutes to infect all, or -1 if impossible
 */
function minTimeToInfectAll(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    let nonInfectedCount = 0;
    
    // Step 1: Find all initially infected cells and count non-infected
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j]);
            } else if (grid[i][j] === 1) {
                nonInfectedCount++;
            }
        }
    }
    
    if (nonInfectedCount === 0) return 0;
    if (queue.length === 0) return -1;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let minutes = 0;
    
    // Step 2: Multi-source BFS
    while (queue.length > 0) {
        const currentLevelSize = queue.length;
        
        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === 1) {
                    
                    grid[newRow][newCol] = 2;
                    nonInfectedCount--;
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        if (queue.length > 0) {
            minutes++;
        }
    }
    
    return nonInfectedCount === 0 ? minutes : -1;
}

/**
 * Solution with step-by-step visualization
 */
function minTimeToInfectAllWithVisualization(grid) {
    console.log('\n' + '='.repeat(80));
    console.log('🦠 VIRUS INFECTION SPREAD - MULTI-SOURCE BFS');
    console.log('='.repeat(80));
    
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        console.log('Empty grid!');
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    let nonInfectedCount = 0;
    
    // Create a copy for visualization (we'll modify the original)
    const gridCopy = grid.map(row => [...row]);
    
    // Step 1: Find all initially infected cells
    console.log('\n📊 INITIAL STATE:');
    console.log('Grid:');
    printGrid(gridCopy);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 2) {
                queue.push([i, j]);
                console.log(`  ✓ Found infected cell at [${i}, ${j}]`);
            } else if (grid[i][j] === 1) {
                nonInfectedCount++;
            }
        }
    }
    
    console.log(`\n📈 Statistics:`);
    console.log(`  - Initially infected cells: ${queue.length}`);
    console.log(`  - Non-infected cells to infect: ${nonInfectedCount}`);
    
    if (nonInfectedCount === 0) {
        console.log('\n✅ All systems already infected!');
        return 0;
    }
    
    if (queue.length === 0) {
        console.log('\n❌ No infected cells found. Cannot infect any system!');
        return -1;
    }
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let minutes = 0;
    
    console.log('\n' + '='.repeat(80));
    console.log('🔄 INFECTION SPREAD PROCESS:');
    console.log('='.repeat(80));
    
    // Step 2: Multi-source BFS
    while (queue.length > 0) {
        const currentLevelSize = queue.length;
        const newlyInfected = [];
        
        console.log(`\n⏱️  MINUTE ${minutes}:`);
        console.log(`  Processing ${currentLevelSize} infected cell(s) at this level...`);
        
        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    grid[newRow][newCol] === 1) {
                    
                    grid[newRow][newCol] = 2;
                    nonInfectedCount--;
                    newlyInfected.push([newRow, newCol]);
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        if (newlyInfected.length > 0) {
            minutes++;
            console.log(`  ✨ Infected ${newlyInfected.length} new cell(s):`);
            newlyInfected.forEach(([r, c]) => {
                console.log(`     - Cell [${r}, ${c}] became infected`);
            });
            console.log(`  📊 Remaining non-infected cells: ${nonInfectedCount}`);
            console.log(`  📋 Grid state after minute ${minutes}:`);
            printGrid(grid);
        }
    }
    
    console.log('\n' + '='.repeat(80));
    if (nonInfectedCount === 0) {
        console.log(`✅ SUCCESS! All systems infected in ${minutes} minute(s).`);
    } else {
        console.log(`❌ FAILED! ${nonInfectedCount} cell(s) could not be infected.`);
        console.log('   (These cells are likely surrounded by empty cells (0))');
    }
    console.log('='.repeat(80) + '\n');
    
    return nonInfectedCount === 0 ? minutes : -1;
}

/**
 * Helper function to print grid
 */
function printGrid(grid) {
    console.log('   ' + grid[0].map((_, i) => ` ${i} `).join(''));
    grid.forEach((row, i) => {
        console.log(` ${i} ` + row.map(cell => {
            if (cell === 0) return ' 0 ';      // Empty
            if (cell === 1) return ' 1 ';      // Non-infected
            if (cell === 2) return ' 2 ';      // Infected
            return ' ? ';
        }).join(''));
    });
    console.log('\n   Legend: 0 = Empty, 1 = Non-infected, 2 = Infected\n');
}

// ============================================================================
// TEST CASES
// ============================================================================

console.log('\n🧪 TESTING VIRUS INFECTION SPREAD PROBLEM\n');

// Test Case 1: User's example
console.log('\n📝 Test Case 1: User\'s Example');
const grid1 = [
    [2, 1, 1],
    [1, 1, 0],
    [0, 1, 1]
];
const grid1Copy = grid1.map(row => [...row]);
const result1 = minTimeToInfectAllWithVisualization(grid1Copy);
console.log(`Result: ${result1} minutes`);
console.log(`Expected: 4 minutes`);
console.log(result1 === 4 ? '✅ PASSED' : '❌ FAILED');

// Test Case 2: All already infected
console.log('\n\n📝 Test Case 2: All Already Infected');
const grid2 = [
    [2, 2, 2],
    [2, 2, 2]
];
const grid2Copy = grid2.map(row => [...row]);
const result2 = minTimeToInfectAll(grid2Copy);
console.log(`Result: ${result2} minutes`);
console.log(`Expected: 0 minutes`);
console.log(result2 === 0 ? '✅ PASSED' : '❌ FAILED');

// Test Case 3: Impossible to infect all
console.log('\n\n📝 Test Case 3: Impossible Case');
const grid3 = [
    [1, 1, 1],
    [1, 1, 0],
    [0, 1, 1]
];
const grid3Copy = grid3.map(row => [...row]);
const result3 = minTimeToInfectAll(grid3Copy);
console.log(`Result: ${result3}`);
console.log(`Expected: -1 (impossible)`);
console.log(result3 === -1 ? '✅ PASSED' : '❌ FAILED');

// Test Case 4: Single infected cell
console.log('\n\n📝 Test Case 4: Single Infected Cell');
const grid4 = [
    [2, 1, 1],
    [1, 1, 1]
];
const grid4Copy = grid4.map(row => [...row]);
const result4 = minTimeToInfectAll(grid4Copy);
console.log(`Result: ${result4} minutes`);
console.log(`Expected: 3 minutes`);
console.log(result4 === 3 ? '✅ PASSED' : '❌ FAILED');

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { minTimeToInfectAll, minTimeToInfectAllWithVisualization };
}

