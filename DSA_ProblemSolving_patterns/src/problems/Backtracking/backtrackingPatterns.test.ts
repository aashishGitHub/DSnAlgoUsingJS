import { describe, test, expect } from "vitest";
import {
    subsets,
    permute,
    combinationSum,
    letterCombinations,
    subsetsWithDup,
    exist,
    palindromePartition,
    solveNQueens,
} from './backtrackingPatterns';

/** Order-insensitive comparison of a list of lists. */
function sameSets<T>(actual: T[][], expected: T[][]): void {
    const key = (x: T[]) => JSON.stringify(x);
    expect(actual.map(key).sort()).toEqual(expected.map(key).sort());
}

describe('Backtracking Patterns', () => {

    describe('subsets (LC78)', () => {
        test('generates the power set', () => {
            sameSets(subsets([1, 2, 3]), [
                [], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3],
            ]);
        });

        test('produces 2^n subsets', () => {
            expect(subsets([1, 2, 3, 4]).length).toBe(16);
            expect(subsets([]).length).toBe(1); // just the empty subset
        });

        test('results are independent copies, not aliases', () => {
            const out = subsets([1, 2]);
            out[0].push(999);
            expect(out[1]).not.toContain(999);
        });
    });

    describe('permute (LC46)', () => {
        test('generates all orderings', () => {
            sameSets(permute([1, 2, 3]), [
                [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
            ]);
        });

        test('produces n! permutations', () => {
            expect(permute([1, 2, 3, 4]).length).toBe(24);
            expect(permute([1]).length).toBe(1);
        });
    });

    describe('combinationSum (LC39)', () => {
        test('allows reusing a candidate', () => {
            sameSets(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
            sameSets(combinationSum([2, 3, 5], 8), [[2, 2, 2, 2], [2, 3, 3], [3, 5]]);
        });

        test('returns nothing when the target is unreachable', () => {
            expect(combinationSum([2], 1)).toEqual([]);
        });
    });

    describe('letterCombinations (LC17)', () => {
        test('maps digits to letter products', () => {
            sameSets(
                letterCombinations("23").map(s => [s]),
                ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].map(s => [s]),
            );
        });

        test('empty input gives no combinations', () => {
            expect(letterCombinations("")).toEqual([]);
        });

        test('a single digit gives its own letters', () => {
            sameSets(letterCombinations("7").map(s => [s]),
                ["p", "q", "r", "s"].map(s => [s]));
        });
    });

    describe('subsetsWithDup (LC90)', () => {
        test('skips duplicate subsets', () => {
            sameSets(subsetsWithDup([1, 2, 2]), [
                [], [1], [2], [1, 2], [2, 2], [1, 2, 2],
            ]);
        });

        test('all-duplicate input gives n+1 subsets', () => {
            expect(subsetsWithDup([2, 2, 2]).length).toBe(4); // [], [2], [2,2], [2,2,2]
        });
    });

    describe('exist (LC79 word search)', () => {
        const board = [
            ['A', 'B', 'C', 'E'],
            ['S', 'F', 'C', 'S'],
            ['A', 'D', 'E', 'E'],
        ];

        test('finds words that snake through the grid', () => {
            expect(exist(board, "ABCCED")).toBe(true);
            expect(exist(board, "SEE")).toBe(true);
        });

        test('rejects a word needing a reused cell', () => {
            expect(exist(board, "ABCB")).toBe(false);
        });

        test('rejects an absent word', () => {
            expect(exist(board, "XYZ")).toBe(false);
        });
    });

    describe('palindromePartition (LC131)', () => {
        test('splits into all-palindrome pieces', () => {
            sameSets(palindromePartition("aab"), [["a", "a", "b"], ["aa", "b"]]);
        });

        test('single character', () => {
            sameSets(palindromePartition("a"), [["a"]]);
        });

        test('a string with no multi-char palindrome splits into singles only', () => {
            sameSets(palindromePartition("abc"), [["a", "b", "c"]]);
        });

        test('all-same characters prune nothing — 2^(n-1) splits', () => {
            expect(palindromePartition("aaaa").length).toBe(8); // 2^3
        });

        test('every returned piece really is a palindrome', () => {
            for (const split of palindromePartition("aabbc")) {
                for (const piece of split) {
                    expect(piece).toBe([...piece].reverse().join(''));
                }
            }
        });

        test('every split reassembles to the original string', () => {
            for (const split of palindromePartition("aabaa")) {
                expect(split.join('')).toBe("aabaa");
            }
        });

        test('empty string has one (empty) split', () => {
            expect(palindromePartition("")).toEqual([[]]);
        });
    });

    describe('solveNQueens (LC51)', () => {
        test('n = 4 has exactly two solutions', () => {
            const solutions = solveNQueens(4);
            expect(solutions.length).toBe(2);
            sameSets(solutions, [
                [".Q..", "...Q", "Q...", "..Q."],
                ["..Q.", "Q...", "...Q", ".Q.."],
            ]);
        });

        test('n = 1 is trivially solvable', () => {
            expect(solveNQueens(1)).toEqual([["Q"]]);
        });

        test('n = 2 and n = 3 are impossible', () => {
            expect(solveNQueens(2)).toEqual([]);
            expect(solveNQueens(3)).toEqual([]);
        });

        test('known solution counts for n = 5..8', () => {
            expect(solveNQueens(5).length).toBe(10);
            expect(solveNQueens(6).length).toBe(4);
            expect(solveNQueens(7).length).toBe(40);
            expect(solveNQueens(8).length).toBe(92);
        });

        test('every returned board is genuinely conflict-free', () => {
            for (const board of solveNQueens(6)) {
                const queens: [number, number][] = [];
                board.forEach((row, r) => {
                    [...row].forEach((cell, c) => {
                        if (cell === 'Q') queens.push([r, c]);
                    });
                });

                expect(queens.length).toBe(6); // one per row

                for (let i = 0; i < queens.length; i++) {
                    for (let j = i + 1; j < queens.length; j++) {
                        const [r1, c1] = queens[i];
                        const [r2, c2] = queens[j];
                        expect(r1).not.toBe(r2);                       // same row
                        expect(c1).not.toBe(c2);                       // same column
                        expect(Math.abs(r1 - r2)).not.toBe(Math.abs(c1 - c2)); // diagonal
                    }
                }
            }
        });
    });
});
