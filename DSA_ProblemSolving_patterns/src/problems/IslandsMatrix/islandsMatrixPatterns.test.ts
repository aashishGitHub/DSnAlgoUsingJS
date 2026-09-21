import {
    describe,
    test,
    expect } from "vitest";
import {
    numIslands,
    islandSizes,
    floodFill,
    hasCycle,
    maxAreaOfIsland,
    solve,
    numIslandsBFS,
    pacificAtlantic,
    minTimeToInfectAll,
    wallsAndGates
} from './islandsMatrixPatterns';

describe('Islands/Matrix Traversal Patterns', () => {
    
    describe('Number of Islands', () => {
        test('should find correct number of islands', () => {
            const grid1 = [
                ['1', '1', '1', '1', '0'],
                ['1', '1', '0', '1', '0'],
                ['1', '1', '0', '0', '0'],
                ['0', '0', '0', '0', '0']
            ];
            expect(numIslands(grid1)).toBe(1);
            
            const grid2 = [
                ['1', '1', '0', '0', '0'],
                ['1', '1', '0', '0', '0'],
                ['0', '0', '1', '0', '0'],
                ['0', '0', '0', '1', '1']
            ];
            expect(numIslands(grid2)).toBe(3);
        });

        test('variant: should return area of each island (sizes)', () => {
            // Real-world: connected land blocks; we want each block's size.
            const grid = [
                ['1', '1', '0'],
                ['0', '1', '0'],
                ['1', '0', '1']
            ];

            // islandSizes mutates the grid, so pass a copy
            const gridCopy = grid.map(row => [...row]);
            const sizes = islandSizes(gridCopy);

            // Order depends on traversal; sort to assert reliably.
            expect(sizes.sort((a, b) => a - b)).toEqual([1, 1, 3]);
        });
        
        test('should handle empty grid', () => {
            expect(numIslands([])).toBe(0);
            expect(numIslands([[]])).toBe(0);
        });
        
        test('should handle grid with no islands', () => {
            const grid = [
                ['0', '0', '0'],
                ['0', '0', '0']
            ];
            expect(numIslands(grid)).toBe(0);
        });
    });
    
    describe('Flood Fill', () => {
        test('should perform flood fill correctly', () => {
            const image = [
                [1, 1, 1],
                [1, 1, 0],
                [1, 0, 1]
            ];
            const expected = [
                [2, 2, 2],
                [2, 2, 0],
                [2, 0, 1]
            ];
            expect(floodFill(image, 1, 1, 2)).toEqual(expected);
        });
        
        test('should handle same color', () => {
            const image = [
                [1, 1, 1],
                [1, 1, 1]
            ];
            const result = floodFill(image, 0, 0, 1);
            expect(result).toEqual(image);
        });
    });
    
    describe('Cycle in Matrix', () => {
        test('should detect cycle correctly', () => {
            const matrix1 = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
            expect(hasCycle(matrix1)).toBe(false);
            
            const matrix2 = [
                [1, 1, 1],
                [1, 2, 1],
                [1, 1, 1]
            ];
            expect(hasCycle(matrix2)).toBe(true);
        });
    });
    
    describe('Max Area of Island', () => {
        test('should find maximum area correctly', () => {
            const grid = [
                [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
                [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
            ];
            expect(maxAreaOfIsland(grid)).toBe(6);
        });
    });
    
    describe('Surrounded Regions', () => {
        test('should capture surrounded regions', () => {
            const board = [
                ['X', 'X', 'X', 'X'],
                ['X', 'O', 'O', 'X'],
                ['X', 'X', 'O', 'X'],
                ['X', 'O', 'X', 'X']
            ];
            const expected = [
                ['X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X'],
                ['X', 'X', 'X', 'X'],
                ['X', 'O', 'X', 'X']
            ];
            solve(board);
            expect(board).toEqual(expected);
        });
    });
    
    describe('Number of Islands BFS', () => {
        test('should find correct number of islands using BFS', () => {
            const grid = [
                ['1', '1', '0', '0', '0'],
                ['1', '1', '0', '0', '0'],
                ['0', '0', '1', '0', '0'],
                ['0', '0', '0', '1', '1']
            ];
            expect(numIslandsBFS(grid)).toBe(3);
        });
    });
    
    describe('Pacific Atlantic Water Flow', () => {
        test('should find cells that can reach both oceans', () => {
            const heights = [
                [1, 2, 2, 3, 5],
                [3, 2, 3, 4, 4],
                [2, 4, 5, 3, 1],
                [6, 7, 1, 4, 5],
                [5, 1, 1, 2, 4]
            ];
            const result = pacificAtlantic(heights);
            expect(result.length).toBeGreaterThan(0);
        });
    });
    
    describe('Virus Infection Spread (Multi-Source BFS)', () => {
        test('should find minimum time to infect all systems', () => {
            const grid = [
                [2, 1, 1],
                [1, 1, 0],
                [0, 1, 1]
            ];
            // Create a copy since the function modifies the grid
            const gridCopy = grid.map(row => [...row]);
            expect(minTimeToInfectAll(gridCopy)).toBe(4);
        });
        
        test('should return 0 if all systems are already infected', () => {
            const grid = [
                [2, 2, 2],
                [2, 2, 2]
            ];
            const gridCopy = grid.map(row => [...row]);
            expect(minTimeToInfectAll(gridCopy)).toBe(0);
        });
        
        test('should return -1 if infection is impossible', () => {
            const grid = [
                [1, 1, 1],
                [1, 1, 0],
                [0, 1, 1]
            ];
            const gridCopy = grid.map(row => [...row]);
            expect(minTimeToInfectAll(gridCopy)).toBe(-1);
        });
        
        test('should handle single infected cell', () => {
            const grid = [
                [2, 1, 1],
                [1, 1, 1]
            ];
            const gridCopy = grid.map(row => [...row]);
            expect(minTimeToInfectAll(gridCopy)).toBe(3);
        });
    });
});

describe('wallsAndGates (LC286, multi-source BFS)', () => {
    const INF = Infinity;

    test('fills each room with its distance to the nearest gate', () => {
        const rooms = [
            [INF, -1, 0, INF],
            [INF, INF, INF, -1],
            [INF, -1, INF, -1],
            [0, -1, INF, INF],
        ];
        wallsAndGates(rooms);
        expect(rooms).toEqual([
            [3, -1, 0, 1],
            [2, 2, 1, -1],
            [1, -1, 2, -1],
            [0, -1, 3, 4],
        ]);
    });

    test('a single gate spreads outward', () => {
        const rooms = [[0, INF], [INF, INF]];
        wallsAndGates(rooms);
        expect(rooms).toEqual([[0, 1], [1, 2]]);
    });

    test('walls are left untouched and block the spread', () => {
        const rooms = [[0, -1, INF]];
        wallsAndGates(rooms);
        // The room past the wall is unreachable, so it stays Infinity.
        expect(rooms).toEqual([[0, -1, INF]]);
    });

    test('no gates leaves every room unreachable', () => {
        const rooms = [[INF, INF], [INF, -1]];
        wallsAndGates(rooms);
        expect(rooms).toEqual([[INF, INF], [INF, -1]]);
    });

    test('the nearest gate wins when two compete', () => {
        // Room at index 1 is 1 from the left gate and 2 from the right one.
        const rooms = [[0, INF, INF, 0]];
        wallsAndGates(rooms);
        expect(rooms).toEqual([[0, 1, 1, 0]]);
    });

    test('edge cases do not throw', () => {
        expect(() => wallsAndGates([])).not.toThrow();
        expect(() => wallsAndGates([[]])).not.toThrow();
    });

    test('agrees with minTimeToInfectAll on the max distance', () => {
        // Rotting Oranges and Walls-and-Gates are the same BFS: the number of
        // minutes to cover everything equals the largest room distance.
        const rooms = [[0, INF, INF], [INF, INF, INF]];
        wallsAndGates(rooms);
        const maxDistance = Math.max(...rooms.flat().filter(v => v !== -1));

        const grid = [[2, 1, 1], [1, 1, 1]]; // 2 = rotten (the "gate")
        expect(minTimeToInfectAll(grid)).toBe(maxDistance);
    });
});
