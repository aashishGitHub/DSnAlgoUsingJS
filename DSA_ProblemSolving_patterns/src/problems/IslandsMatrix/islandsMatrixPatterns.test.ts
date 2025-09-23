import { 
    numIslands, 
    floodFill, 
    hasCycle, 
    maxAreaOfIsland, 
    solve, 
    numIslandsBFS, 
    pacificAtlantic 
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
});
