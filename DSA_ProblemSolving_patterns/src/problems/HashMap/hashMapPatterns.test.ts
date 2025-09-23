import {
    twoSum,
    topKFrequent,
    firstUniqChar,
    wordPattern,
    isIsomorphic,
    subarraySum,
    findMaxLength,
    lengthOfLongestSubstring,
    minWindow,
    LRUCache,
    Logger,
    UndergroundSystem
} from './hashMapPatterns';

describe('Hash Map Pattern Problems', () => {
    describe('twoSum', () => {
        test('should return indices of two numbers that sum to target', () => {
            expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
            expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
            expect(twoSum([3, 3], 6)).toEqual([0, 1]);
        });
    });

    describe('topKFrequent', () => {
        test('should return top k frequent elements', () => {
            expect(topKFrequent([1, 1, 1, 2, 2, 3], 2)).toEqual([1, 2]);
            expect(topKFrequent([1], 1)).toEqual([1]);
            expect(topKFrequent([4, 1, -1, 2, -1, 2, 3], 2)).toEqual([-1, 2]);
        });
    });

    describe('firstUniqChar', () => {
        test('should return index of first unique character', () => {
            expect(firstUniqChar('leetcode')).toBe(0);
            expect(firstUniqChar('loveleetcode')).toBe(2);
            expect(firstUniqChar('aabb')).toBe(-1);
        });
    });

    describe('wordPattern', () => {
        test('should return true if pattern matches', () => {
            expect(wordPattern('abba', 'dog cat cat dog')).toBe(true);
            expect(wordPattern('abba', 'dog cat cat fish')).toBe(false);
            expect(wordPattern('aaaa', 'dog cat cat dog')).toBe(false);
        });
    });

    describe('isIsomorphic', () => {
        test('should return true if strings are isomorphic', () => {
            expect(isIsomorphic('egg', 'add')).toBe(true);
            expect(isIsomorphic('foo', 'bar')).toBe(false);
            expect(isIsomorphic('paper', 'title')).toBe(true);
        });
    });

    describe('subarraySum', () => {
        test('should return number of subarrays with sum k', () => {
            expect(subarraySum([1, 1, 1], 2)).toBe(2);
            expect(subarraySum([1, 2, 3], 3)).toBe(2);
            expect(subarraySum([1], 0)).toBe(0);
        });
    });

    describe('findMaxLength', () => {
        test('should return maximum length of contiguous subarray with equal 0s and 1s', () => {
            expect(findMaxLength([0, 1])).toBe(2);
            expect(findMaxLength([0, 1, 0])).toBe(2);
            expect(findMaxLength([0, 1, 0, 0, 1, 1, 0])).toBe(6);
        });
    });

    describe('lengthOfLongestSubstring', () => {
        test('should return length of longest substring without repeating characters', () => {
            expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
            expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
            expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
        });
    });

    describe('minWindow', () => {
        test('should return minimum window substring', () => {
            expect(minWindow('ADOBECODEBANC', 'ABC')).toBe('BANC');
            expect(minWindow('a', 'a')).toBe('a');
            expect(minWindow('a', 'aa')).toBe('');
        });
    });

    describe('LRUCache', () => {
        test('should work correctly', () => {
            const lru = new LRUCache(2);
            
            lru.put(1, 1);
            lru.put(2, 2);
            expect(lru.get(1)).toBe(1);
            
            lru.put(3, 3); // evicts key 2
            expect(lru.get(2)).toBe(-1);
            
            lru.put(4, 4); // evicts key 1
            expect(lru.get(1)).toBe(-1);
            expect(lru.get(3)).toBe(3);
            expect(lru.get(4)).toBe(4);
        });
    });

    describe('Logger', () => {
        test('should work correctly', () => {
            const logger = new Logger();
            
            expect(logger.shouldPrintMessage(1, 'foo')).toBe(true);
            expect(logger.shouldPrintMessage(2, 'bar')).toBe(true);
            expect(logger.shouldPrintMessage(3, 'foo')).toBe(false);
            expect(logger.shouldPrintMessage(8, 'bar')).toBe(false);
            expect(logger.shouldPrintMessage(10, 'foo')).toBe(false);
            expect(logger.shouldPrintMessage(11, 'foo')).toBe(true);
        });
    });

    describe('UndergroundSystem', () => {
        test('should work correctly', () => {
            const undergroundSystem = new UndergroundSystem();
            
            undergroundSystem.checkIn(45, 'Leyton', 3);
            undergroundSystem.checkIn(32, 'Paradise', 8);
            undergroundSystem.checkIn(27, 'Leyton', 10);
            
            undergroundSystem.checkOut(45, 'Waterloo', 15);
            undergroundSystem.checkOut(27, 'Waterloo', 20);
            undergroundSystem.checkOut(32, 'Cambridge', 22);
            
            expect(undergroundSystem.getAverageTime('Paradise', 'Cambridge')).toBe(14);
            expect(undergroundSystem.getAverageTime('Leyton', 'Waterloo')).toBe(11);
            
            undergroundSystem.checkIn(10, 'Leyton', 24);
            undergroundSystem.checkOut(10, 'Waterloo', 38);
            
            expect(undergroundSystem.getAverageTime('Leyton', 'Waterloo')).toBe(12);
        });
    });
});
