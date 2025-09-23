/**
 * Islands/Matrix Traversal Pattern - Main Export
 * 
 * This module exports all island and matrix traversal pattern implementations.
 * Perfect for problems involving 2D arrays, connected components, and path finding.
 */

export * from './islandsMatrixPatterns';

// Re-export specific functions for convenience
export {
    numIslands,
    floodFill,
    hasCycle,
    maxAreaOfIsland,
    solve,
    numIslandsBFS,
    pacificAtlantic,
    printMatrix,
    copyMatrix,
    isValidPosition
} from './islandsMatrixPatterns';
