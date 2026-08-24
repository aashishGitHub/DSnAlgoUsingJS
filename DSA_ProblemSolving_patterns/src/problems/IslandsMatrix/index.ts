/**
 * Islands/Matrix Traversal Pattern - Main Export
 *
 * This module exports all island and matrix traversal pattern implementations.
 * Perfect for problems involving 2D arrays, connected components, and path finding.
 *
 * NOTE: explicit export list (no `export *`) so name clashes with other
 * pattern folders can be resolved deliberately: `hasCycle` here detects a
 * cycle IN A GRID (same-value cell loop), while the canonical `hasCycle`
 * (linked list, Floyd's) lives in FastSlowPointers/ — so the grid version is
 * exported as `hasCycleInGrid` to the master barrel.
 */

export {
    numIslands,
    islandSizes,
    floodFill,
    hasCycle as hasCycleInGrid,
    maxAreaOfIsland,
    solve,
    numIslandsBFS,
    pacificAtlantic,
    printMatrix,
    copyMatrix,
    isValidPosition,
    minTimeToInfectAll,
    minTimeToInfectAllDetailed
} from './islandsMatrixPatterns';
