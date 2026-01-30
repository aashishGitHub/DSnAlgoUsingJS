import {
    climbStairs,
    rob,
    rob2,
    lengthOfLIS,
    longestCommonSubsequence,
    wordBreak,
    coinChange,
    uniquePaths,
    uniquePathsWithObstacles,
    canJump,
    jump,
    numDecodings,
    maxProduct,
    maxSubArray,
    minDistance,
    maxProductPath,
    maxProductPathOptimized,
    maxProductPathMod
} from './dpPatterns';

describe('Dynamic Programming Pattern Problems', () => {
    
    // =========================================================================
    // 16. Maximum Product Path in Matrix
    // =========================================================================
    describe('maxProductPath - Maximum Product Path in Matrix', () => {
        
        describe('Basic Functionality', () => {
            test('should return correct max product for simple positive matrix', () => {
                // All positive: path doesn't matter much
                const matrix = [
                    [1, 2],
                    [3, 4]
                ];
                // Paths: 1→2→4 = 8, 1→3→4 = 12
                expect(maxProductPath(matrix)).toBe(12);
            });

            test('should handle negative numbers creating larger products', () => {
                // Key insight: negative × negative = positive
                const matrix = [
                    [1, -2],
                    [-3, 4]
                ];
                // Path 1→-2→4 = -8
                // Path 1→-3→4 = -12
                // But with negatives flipping... 1→-2→4 = -8 is the max here
                // Actually: only 2 paths, both pass through 4
                // 1→2→4 = 1*(-2)*4 = -8
                // 1→3→4 = 1*(-3)*4 = -12
                expect(maxProductPath(matrix)).toBe(-8);
            });

            test('should find max when min flips to max via negative', () => {
                // The classic case where tracking min matters
                // Path has 5 cells (odd), so all-negative = negative result
                const matrix = [
                    [-1, -2, -3],
                    [-2, -3, -3],
                    [-3, -3, -2]
                ];
                // All paths have 5 elements (odd number of negatives = negative product)
                // The max product is the "least negative" path
                expect(maxProductPath(matrix)).toBe(-36);
                
                // Better example: even path length with negatives that flip
                const matrix2 = [
                    [-1, 2],
                    [3, -4]
                ];
                // Path 1: -1→2→-4 = 8 (neg × pos × neg = pos)
                // Path 2: -1→3→-4 = 12 (neg × pos × neg = pos)
                expect(maxProductPath(matrix2)).toBe(12);
            });
        });

        describe('Edge Cases', () => {
            test('should handle single cell matrix', () => {
                expect(maxProductPath([[5]])).toBe(5);
                expect(maxProductPath([[-5]])).toBe(-5);
                expect(maxProductPath([[0]])).toBe(0);
            });

            test('should handle single row matrix', () => {
                // Only one path: multiply all elements
                expect(maxProductPath([[1, 2, 3]])).toBe(6);
                expect(maxProductPath([[2, -3, 4]])).toBe(-24);
            });

            test('should handle single column matrix', () => {
                // Only one path: multiply all elements
                expect(maxProductPath([[1], [2], [3]])).toBe(6);
                expect(maxProductPath([[-2], [3], [-4]])).toBe(24); // neg × neg = pos
            });

            test('should handle matrix with zeros', () => {
                // Zero kills the product
                const matrix = [
                    [1, 0],
                    [2, 3]
                ];
                // Path through 0: 1→0→3 = 0
                // Path avoiding 0: 1→2→3 = 6
                expect(maxProductPath(matrix)).toBe(6);
            });

            test('should handle empty matrix', () => {
                expect(maxProductPath([])).toBe(0);
                expect(maxProductPath([[]])).toBe(0);
            });
        });

        describe('Real-World Scenarios', () => {
            test('Real-world: Investment portfolio multipliers - find best path', () => {
                // Each cell is a multiplier for your investment
                // 2 = double your money, 0.5 = half, -1 = lose it all and go negative
                const investmentGrid = [
                    [2, 1, 3],
                    [1, 5, 1],
                    [4, 1, 2]
                ];
                // Best path: 2→1→5→1→2 = 20 or 2→1→4→1→2 = 16 or others
                // 2→1→5→1→2 = 20
                const result = maxProductPath(investmentGrid);
                expect(result).toBeGreaterThan(0);
            });

            test('Real-world: Game power multipliers with debuffs', () => {
                // Some cells boost power (positive), some debuff (negative)
                // Strategy: hit even number of debuffs to get positive result
                const gameGrid = [
                    [1, -2, 1],
                    [1, 1, -2],
                    [1, 1, 1]
                ];
                // Find path that maximizes final power
                // Best path: 1→-2→1→-2→1 = 4 (two negatives cancel out!)
                // Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2) = 1×(-2)×1×(-2)×1 = 4
                const result = maxProductPath(gameGrid);
                expect(result).toBe(4);
            });

            test('Real-world: Production line efficiency factors', () => {
                // Each station multiplies throughput
                // Find the most efficient path through the factory floor
                const factoryGrid = [
                    [2, 3, 1],
                    [1, 2, 2],
                    [3, 1, 2]
                ];
                // Multiple paths possible
                const result = maxProductPath(factoryGrid);
                expect(result).toBeGreaterThan(10); // Should find a good path
            });
        });

        describe('Comparison: Standard vs Optimized version', () => {
            test('should produce same results for various inputs', () => {
                const testCases = [
                    [[1, 2], [3, 4]],
                    [[1, -2, 3], [4, 5, -6], [7, -8, 9]],
                    [[-1, -2], [-3, -4]],
                    [[1, 0, 3], [2, 5, 1], [3, 1, 2]],
                    [[5]],
                    [[1, 2, 3, 4, 5]]
                ];

                for (const matrix of testCases) {
                    expect(maxProductPathOptimized(matrix)).toBe(maxProductPath(matrix));
                }
            });
        });
    });

    // =========================================================================
    // 16c. LeetCode 1594: Maximum Non-negative Product in a Matrix
    // =========================================================================
    describe('maxProductPathMod - LeetCode 1594 variant', () => {
        test('should return -1 when max product is negative', () => {
            // All paths result in negative product
            const matrix = [[-1]];
            expect(maxProductPathMod(matrix)).toBe(-1);
        });

        test('should return 0 when matrix contains 0 on all paths', () => {
            const matrix = [
                [1, 0],
                [0, 1]
            ];
            // Both paths go through 0
            expect(maxProductPathMod(matrix)).toBe(0);
        });

        test('should handle large products with modulo', () => {
            const matrix = [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ];
            const result = maxProductPathMod(matrix);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(1e9 + 7);
        });
    });

    // =========================================================================
    // Existing DP Problems (for completeness)
    // =========================================================================
    
    describe('climbStairs', () => {
        test('should return number of ways to climb stairs', () => {
            expect(climbStairs(2)).toBe(2);
            expect(climbStairs(3)).toBe(3);
            expect(climbStairs(4)).toBe(5);
        });
    });

    describe('rob - House Robber', () => {
        test('should return max money that can be robbed', () => {
            expect(rob([1, 2, 3, 1])).toBe(4);
            expect(rob([2, 7, 9, 3, 1])).toBe(12);
        });
    });

    describe('rob2 - House Robber II (circular)', () => {
        test('should handle circular arrangement', () => {
            expect(rob2([2, 3, 2])).toBe(3);
            expect(rob2([1, 2, 3, 1])).toBe(4);
        });
    });

    describe('lengthOfLIS', () => {
        test('should return length of longest increasing subsequence', () => {
            expect(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
            expect(lengthOfLIS([0, 1, 0, 3, 2, 3])).toBe(4);
        });
    });

    describe('longestCommonSubsequence', () => {
        test('should return length of LCS', () => {
            expect(longestCommonSubsequence('abcde', 'ace')).toBe(3);
            expect(longestCommonSubsequence('abc', 'abc')).toBe(3);
            expect(longestCommonSubsequence('abc', 'def')).toBe(0);
        });
    });

    describe('wordBreak', () => {
        test('should determine if string can be segmented', () => {
            expect(wordBreak('leetcode', ['leet', 'code'])).toBe(true);
            expect(wordBreak('applepenapple', ['apple', 'pen'])).toBe(true);
            expect(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])).toBe(false);
        });
    });

    describe('coinChange', () => {
        test('should return fewest coins to make amount', () => {
            expect(coinChange([1, 2, 5], 11)).toBe(3);
            expect(coinChange([2], 3)).toBe(-1);
            expect(coinChange([1], 0)).toBe(0);
        });
    });

    describe('uniquePaths', () => {
        test('should count unique paths in grid', () => {
            expect(uniquePaths(3, 7)).toBe(28);
            expect(uniquePaths(3, 2)).toBe(3);
        });
    });

    describe('uniquePathsWithObstacles', () => {
        test('should count paths avoiding obstacles', () => {
            expect(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])).toBe(2);
            expect(uniquePathsWithObstacles([[0, 1], [0, 0]])).toBe(1);
        });
    });

    describe('canJump - Jump Game', () => {
        test('should determine if can reach last index', () => {
            expect(canJump([2, 3, 1, 1, 4])).toBe(true);
            expect(canJump([3, 2, 1, 0, 4])).toBe(false);
        });
    });

    describe('jump - Jump Game II', () => {
        test('should return minimum jumps to reach end', () => {
            expect(jump([2, 3, 1, 1, 4])).toBe(2);
            expect(jump([2, 3, 0, 1, 4])).toBe(2);
        });
    });

    describe('numDecodings', () => {
        test('should count ways to decode string', () => {
            expect(numDecodings('12')).toBe(2);
            expect(numDecodings('226')).toBe(3);
            expect(numDecodings('06')).toBe(0);
        });
    });

    describe('maxProduct - Maximum Product Subarray', () => {
        test('should find max product subarray', () => {
            expect(maxProduct([2, 3, -2, 4])).toBe(6);
            expect(maxProduct([-2, 0, -1])).toBe(0);
            expect(maxProduct([-2, 3, -4])).toBe(24);
        });
    });

    describe('maxSubArray - Kadane\'s Algorithm', () => {
        test('should find max sum subarray', () => {
            expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
            expect(maxSubArray([1])).toBe(1);
            expect(maxSubArray([5, 4, -1, 7, 8])).toBe(23);
        });
    });

    describe('minDistance - Edit Distance', () => {
        test('should return minimum edit operations', () => {
            expect(minDistance('horse', 'ros')).toBe(3);
            expect(minDistance('intention', 'execution')).toBe(5);
        });
    });
});
