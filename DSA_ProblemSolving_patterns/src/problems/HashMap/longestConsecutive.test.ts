import {
    longestConsecutive1,
    longestConsecutive2,
    longestConsecutive3,
    longestConsecutive4,
    runTests,
    performanceTest
} from './longestConsecutive';

describe('Longest Consecutive Sequence', () => {
    describe('longestConsecutive1 (Hash Set)', () => {
        test('should return length of longest consecutive sequence', () => {
            expect(longestConsecutive1([100, 4, 200, 1, 3, 2])).toBe(4);
            expect(longestConsecutive1([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
            expect(longestConsecutive1([])).toBe(0);
            expect(longestConsecutive1([1])).toBe(1);
            expect(longestConsecutive1([1, 2, 0, 1])).toBe(3);
        });
    });

    describe('longestConsecutive2 (Hash Map Union-Find)', () => {
        test('should return length of longest consecutive sequence', () => {
            expect(longestConsecutive2([100, 4, 200, 1, 3, 2])).toBe(4);
            expect(longestConsecutive2([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
            expect(longestConsecutive2([])).toBe(0);
            expect(longestConsecutive2([1])).toBe(1);
            expect(longestConsecutive2([1, 2, 0, 1])).toBe(3);
        });
    });

    describe('longestConsecutive3 (Hash Map Boundaries)', () => {
        test('should return length of longest consecutive sequence', () => {
            expect(longestConsecutive3([100, 4, 200, 1, 3, 2])).toBe(4);
            expect(longestConsecutive3([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
            expect(longestConsecutive3([])).toBe(0);
            expect(longestConsecutive3([1])).toBe(1);
            expect(longestConsecutive3([1, 2, 0, 1])).toBe(3);
        });
    });

    describe('longestConsecutive4 (Sorting)', () => {
        test('should return length of longest consecutive sequence', () => {
            expect(longestConsecutive4([100, 4, 200, 1, 3, 2])).toBe(4);
            expect(longestConsecutive4([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
            expect(longestConsecutive4([])).toBe(0);
            expect(longestConsecutive4([1])).toBe(1);
            expect(longestConsecutive4([1, 2, 0, 1])).toBe(3);
        });
    });

    describe('All approaches should return same result', () => {
        test('should return consistent results across all approaches', () => {
            const testCases = [
                [100, 4, 200, 1, 3, 2],
                [0, 3, 7, 2, 5, 8, 4, 6, 0, 1],
                [],
                [1],
                [1, 2, 0, 1],
                [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]
            ];

            testCases.forEach(nums => {
                const result1 = longestConsecutive1(nums);
                const result2 = longestConsecutive2(nums);
                const result3 = longestConsecutive3(nums);
                const result4 = longestConsecutive4(nums);

                expect(result1).toBe(result2);
                expect(result2).toBe(result3);
                expect(result3).toBe(result4);
            });
        });
    });

    describe('Edge cases', () => {
        test('should handle single element', () => {
            expect(longestConsecutive1([5])).toBe(1);
        });

        test('should handle all same elements', () => {
            expect(longestConsecutive1([1, 1, 1, 1])).toBe(1);
        });

        test('should handle negative numbers', () => {
            expect(longestConsecutive1([-1, 0, 1])).toBe(3);
        });

        test('should handle large gaps', () => {
            expect(longestConsecutive1([1, 100, 200, 2])).toBe(2);
        });
    });
});
