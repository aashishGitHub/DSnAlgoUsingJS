import { describe, test, expect } from "vitest";
import {
    hammingWeight,
    hammingWeightNaive,
    countBits,
    reverseBits,
    missingNumberXOR,
    getSum,
    singleNumberXOR,
    singleNumberII,
    singleNumberIII,
    myPow,
    plusOne,
} from './bitPatterns';

describe('Bit Manipulation Patterns', () => {

    describe('hammingWeight / hammingWeightNaive (LC191)', () => {
        test('counts set bits', () => {
            expect(hammingWeight(11)).toBe(3);   // 1011
            expect(hammingWeight(128)).toBe(1);
            expect(hammingWeight(0)).toBe(0);
            expect(hammingWeight(4294967293)).toBe(31);
        });

        test('the Kernighan version agrees with the naive one', () => {
            for (const n of [0, 1, 2, 7, 11, 128, 255, 1023, 4294967293]) {
                expect(hammingWeight(n)).toBe(hammingWeightNaive(n));
            }
        });

        test('negative inputs terminate (the >>> vs >> trap)', () => {
            // -1 as unsigned 32-bit is 0xFFFFFFFF → all 32 bits set.
            expect(hammingWeight(-1)).toBe(32);
            expect(hammingWeightNaive(-1)).toBe(32);
        });
    });

    describe('countBits (LC338)', () => {
        test('builds the table by DP on i >> 1', () => {
            expect(countBits(2)).toEqual([0, 1, 1]);
            expect(countBits(5)).toEqual([0, 1, 1, 2, 1, 2]);
        });

        test('agrees with hammingWeight for every index', () => {
            const table = countBits(64);
            table.forEach((count, i) => expect(count).toBe(hammingWeight(i)));
        });

        test('n = 0 gives just the zero entry', () => {
            expect(countBits(0)).toEqual([0]);
        });
    });

    describe('reverseBits (LC190)', () => {
        test('reverses a 32-bit pattern', () => {
            expect(reverseBits(43261596)).toBe(964176192);
        });

        test('reversing twice returns the original', () => {
            for (const n of [1, 2, 43261596, 255]) {
                expect(reverseBits(reverseBits(n))).toBe(n);
            }
        });

        test('zero reverses to zero', () => {
            expect(reverseBits(0)).toBe(0);
        });
    });

    describe('missingNumberXOR (LC268)', () => {
        test('finds the missing value in 0..n', () => {
            expect(missingNumberXOR([3, 0, 1])).toBe(2);
            expect(missingNumberXOR([0, 1])).toBe(2);
            expect(missingNumberXOR([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
        });

        test('handles the single-element cases', () => {
            expect(missingNumberXOR([0])).toBe(1);
            expect(missingNumberXOR([1])).toBe(0);
        });
    });

    describe('getSum (LC371)', () => {
        test('adds without + or -', () => {
            expect(getSum(1, 2)).toBe(3);
            expect(getSum(2, 3)).toBe(5);
            expect(getSum(0, 0)).toBe(0);
        });

        test('handles negatives and mixed signs', () => {
            expect(getSum(-1, 1)).toBe(0);
            expect(getSum(-2, -3)).toBe(-5);
            expect(getSum(-5, 3)).toBe(-2);
        });
    });

    describe('singleNumberXOR (LC136)', () => {
        test('finds the unpaired element', () => {
            expect(singleNumberXOR([2, 2, 1])).toBe(1);
            expect(singleNumberXOR([4, 1, 2, 1, 2])).toBe(4);
            expect(singleNumberXOR([1])).toBe(1);
        });
    });

    describe('singleNumberII (LC137, triples)', () => {
        test('finds the element appearing once among triples', () => {
            expect(singleNumberII([2, 2, 3, 2])).toBe(3);
            expect(singleNumberII([0, 1, 0, 1, 0, 1, 99])).toBe(99);
            expect(singleNumberII([5])).toBe(5);
        });

        test('works with negative values', () => {
            expect(singleNumberII([-2, -2, 1, -2])).toBe(1);
            expect(singleNumberII([7, 7, 7, -8])).toBe(-8);
        });

        test('plain XOR would NOT solve this — the reason the masks exist', () => {
            const nums = [2, 2, 3, 2];
            const plainXor = nums.reduce((a, b) => a ^ b, 0);
            expect(plainXor).not.toBe(3);        // 2^2^3^2 = 3^2 = 1
            expect(singleNumberII(nums)).toBe(3); // the mod-3 counter gets it right
        });
    });

    describe('singleNumberIII (LC260, two singletons)', () => {
        test('finds both unpaired elements', () => {
            expect(singleNumberIII([1, 2, 1, 3, 2, 5]).sort((a, b) => a - b)).toEqual([3, 5]);
            expect(singleNumberIII([0, 1]).sort((a, b) => a - b)).toEqual([0, 1]);
            expect(singleNumberIII([9, 9, 4, 7]).sort((a, b) => a - b)).toEqual([4, 7]);
        });

        test('handles a negative singleton', () => {
            expect(singleNumberIII([-1, 0]).sort((a, b) => a - b)).toEqual([-1, 0]);
        });
    });

    describe('myPow (LC50)', () => {
        test('positive exponents', () => {
            expect(myPow(2, 10)).toBe(1024);
            expect(myPow(3, 3)).toBe(27);
            expect(myPow(5, 1)).toBe(5);
        });

        test('exponent 0 is always 1', () => {
            expect(myPow(2, 0)).toBe(1);
            expect(myPow(-7, 0)).toBe(1);
            expect(myPow(0, 0)).toBe(1);
        });

        test('negative exponents invert', () => {
            expect(myPow(2, -2)).toBe(0.25);
            expect(myPow(2, -1)).toBe(0.5);
        });

        test('negative bases alternate sign with the exponent parity', () => {
            expect(myPow(-2, 2)).toBe(4);
            expect(myPow(-2, 3)).toBe(-8);
        });

        test('agrees with Math.pow across a range', () => {
            for (let base = -3; base <= 3; base++) {
                for (let exp = -4; exp <= 4; exp++) {
                    if (base === 0 && exp < 0) continue; // division by zero
                    expect(myPow(base, exp)).toBeCloseTo(Math.pow(base, exp), 10);
                }
            }
        });

        test('a large exponent terminates quickly (O(log n), not O(n))', () => {
            expect(myPow(1.0000001, 1_000_000_000)).toBeGreaterThan(1);
        });
    });

    describe('plusOne (LC66)', () => {
        test('increments the last digit when there is no carry', () => {
            expect(plusOne([1, 2, 3])).toEqual([1, 2, 4]);
            expect(plusOne([0])).toEqual([1]);
        });

        test('propagates a carry', () => {
            expect(plusOne([1, 2, 9])).toEqual([1, 3, 0]);
            expect(plusOne([1, 9, 9])).toEqual([2, 0, 0]);
        });

        test('all nines grows the array — the only interesting case', () => {
            expect(plusOne([9])).toEqual([1, 0]);
            expect(plusOne([9, 9])).toEqual([1, 0, 0]);
            expect(plusOne([9, 9, 9])).toEqual([1, 0, 0, 0]);
        });

        test('does not mutate the caller\'s array', () => {
            const input = [1, 2, 9];
            plusOne(input);
            expect(input).toEqual([1, 2, 9]);
        });

        test('handles more digits than a JS number can hold exactly', () => {
            // 20 digits — past 2^53, so a numeric round-trip would lose precision.
            const big = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9];
            expect(plusOne(big)).toEqual(
                [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 7, 9, 0, 0],
            );
        });
    });
});
