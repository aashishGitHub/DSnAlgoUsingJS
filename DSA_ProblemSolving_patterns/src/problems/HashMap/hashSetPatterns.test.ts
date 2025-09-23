import {
    containsDuplicate,
    twoSum as twoSumSet,
    isAnagram,
    groupAnagrams,
    intersection,
    isHappy,
    singleNumber,
    findDuplicate,
    missingNumber,
    findDisappearedNumbers,
    numJewelsInStones,
    numUniqueEmails
} from './hashSetPatterns';

describe('Hash Set Pattern Problems', () => {
    describe('containsDuplicate', () => {
        test('should return true if array contains duplicates', () => {
            expect(containsDuplicate([1, 2, 3, 1])).toBe(true);
            expect(containsDuplicate([1, 2, 3, 4])).toBe(false);
            expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true);
        });
    });

    describe('twoSum', () => {
        test('should return indices of two numbers that sum to target', () => {
            expect(twoSumSet([2, 7, 11, 15], 9)).toEqual([0, 1]);
            expect(twoSumSet([3, 2, 4], 6)).toEqual([1, 2]);
            expect(twoSumSet([3, 3], 6)).toEqual([0, 1]);
        });
    });

    describe('isAnagram', () => {
        test('should return true if strings are anagrams', () => {
            expect(isAnagram('anagram', 'nagaram')).toBe(true);
            expect(isAnagram('rat', 'car')).toBe(false);
            expect(isAnagram('listen', 'silent')).toBe(true);
        });
    });

    describe('groupAnagrams', () => {
        test('should group anagrams together', () => {
            const result = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
            expect(result).toHaveLength(3);
            expect(result).toEqual(expect.arrayContaining([
                expect.arrayContaining(['eat', 'tea', 'ate']),
                expect.arrayContaining(['tan', 'nat']),
                expect.arrayContaining(['bat'])
            ]));
        });
    });

    describe('intersection', () => {
        test('should return intersection of two arrays', () => {
            expect(intersection([1, 2, 2, 1], [2, 2])).toEqual([2]);
            expect(intersection([4, 9, 5], [9, 4, 9, 8, 4])).toEqual(expect.arrayContaining([4, 9]));
        });
    });

    describe('isHappy', () => {
        test('should return true for happy numbers', () => {
            expect(isHappy(19)).toBe(true);
            expect(isHappy(2)).toBe(false);
            expect(isHappy(1)).toBe(true);
        });
    });

    describe('singleNumber', () => {
        test('should return the single number', () => {
            expect(singleNumber([2, 2, 1])).toBe(1);
            expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
            expect(singleNumber([1])).toBe(1);
        });
    });

    describe('findDuplicate', () => {
        test('should return the duplicate number', () => {
            expect(findDuplicate([1, 3, 4, 2, 2])).toBe(2);
            expect(findDuplicate([3, 1, 3, 4, 2])).toBe(3);
            expect(findDuplicate([1, 1])).toBe(1);
        });
    });

    describe('missingNumber', () => {
        test('should return the missing number', () => {
            expect(missingNumber([3, 0, 1])).toBe(2);
            expect(missingNumber([0, 1])).toBe(2);
            expect(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
        });
    });

    describe('findDisappearedNumbers', () => {
        test('should return disappeared numbers', () => {
            expect(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])).toEqual([5, 6]);
            expect(findDisappearedNumbers([1, 1])).toEqual([2]);
        });
    });

    describe('numJewelsInStones', () => {
        test('should return number of jewels in stones', () => {
            expect(numJewelsInStones('aA', 'aAAbbbb')).toBe(3);
            expect(numJewelsInStones('z', 'ZZ')).toBe(0);
        });
    });

    describe('numUniqueEmails', () => {
        test('should return number of unique emails', () => {
            const emails = [
                'test.email+alex@leetcode.com',
                'test.e.mail+bob.cathy@leetcode.com',
                'testemail+david@lee.tcode.com'
            ];
            expect(numUniqueEmails(emails)).toBe(2);
        });
    });
});
