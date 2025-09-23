/**
 * Hash Map Pattern Problems
 * 
 * Pattern: Use Map for O(1) lookups with key-value relationships
 * Time Complexity: O(n) typically
 * Space Complexity: O(n) for the map
 */

/**
 * 1. Two Sum (with Map)
 * Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.
 * 
 * Key Insight: Use a map to store complements and their indices for O(1) lookup
 * Time: O(n), Space: O(n)
 * 
 * Example:
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1] (because nums[0] + nums[1] = 2 + 7 = 9)
 * 
 * Input: nums = [3,2,4], target = 6
 * Output: [1,2] (because nums[1] + nums[2] = 2 + 4 = 6)
 */
export function twoSum(nums: number[], target: number): number[] {
    const numMap = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (numMap.has(complement)) {
            return [numMap.get(complement)!, i];
        }
        
        numMap.set(nums[i], i);
    }
    
    return [];
}

/**
 * 2. Top K Frequent Elements
 * Given an integer array nums and an integer k, return the k most frequent elements.
 * 
 * Key Insight: Count frequencies with map, then sort by frequency
 * Time: O(n log n), Space: O(n)
 * 
 * Example:
 * Input: nums = [1,1,1,2,2,3], k = 2
 * Output: [1,2] (1 appears 3 times, 2 appears 2 times)
 * 
 * Input: nums = [1], k = 1
 * Output: [1]
 */
export function topKFrequent(nums: number[], k: number): number[] {
    const frequencyMap = new Map<number, number>();
    
    // Count frequencies
    for (const num of nums) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
    
    // Sort by frequency and return top k
    return Array.from(frequencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(([num]) => num);
}

/**
 * 3. First Unique Character in a String
 * Given a string s, find the first non-repeating character in it and return its index. If it doesn't exist, return -1.
 * 
 * Key Insight: Two-pass approach - count frequencies, then find first char with count = 1
 * Time: O(n), Space: O(1) - at most 26 characters
 * 
 * Example:
 * Input: s = "leetcode"
 * Output: 0 (first unique char 'l' is at index 0)
 * 
 * Input: s = "loveleetcode"
 * Output: 2 (first unique char 'v' is at index 2)
 * 
 * Input: s = "aabb"
 * Output: -1 (no unique characters)
 */
export function firstUniqChar(s: string): number {
    const charCount = new Map<string, number>();
    
    // Count character frequencies
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Find first unique character
    for (let i = 0; i < s.length; i++) {
        if (charCount.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}

/**
 * 4. Word Pattern
 * Given a pattern and a string s, find if s follows the same pattern.
 * 
 * Key Insight: Need bijective mapping - each char maps to unique word AND each word maps to unique char
 * Time: O(n), Space: O(n)
 * 
 * Example:
 * Input: pattern = "abba", s = "dog cat cat dog"
 * Output: true (a->dog, b->cat, b->cat, a->dog)
 * 
 * Input: pattern = "abba", s = "dog cat cat fish"
 * Output: false (a maps to both "dog" and "fish")
 * 
 * Input: pattern = "aaaa", s = "dog cat cat dog"
 * Output: false ("dog" and "cat" both try to map to 'a')
 */
export function wordPattern(pattern: string, s: string): boolean {
    const words = s.split(' ');
    if (pattern.length !== words.length) return false;
    
    const charToWord = new Map<string, string>();
    const wordToChar = new Map<string, string>();
    
    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        const word = words[i];
        
        if (charToWord.has(char) && charToWord.get(char) !== word) {
            return false;
        }
        if (wordToChar.has(word) && wordToChar.get(word) !== char) {
            return false;
        }
        
        charToWord.set(char, word);
        wordToChar.set(word, char);
    }
    
    return true;
}

/**
 * 5. Isomorphic Strings
 * Given two strings s and t, determine if they are isomorphic.
 * Two strings are isomorphic if characters can be replaced to get the other string.
 * 
 * Key Insight: Similar to word pattern - need bijective mapping between characters
 * Time: O(n), Space: O(1) - at most 256 ASCII characters
 * 
 * Example:
 * Input: s = "egg", t = "add"
 * Output: true (e->a, g->d)
 * 
 * Input: s = "foo", t = "bar"
 * Output: false (o maps to both a and r)
 * 
 * Input: s = "paper", t = "title"
 * Output: true (p->t, a->i, p->t, e->l, r->e)
 */
export function isIsomorphic(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    
    const sToT = new Map<string, string>();
    const tToS = new Map<string, string>();
    
    for (let i = 0; i < s.length; i++) {
        const sChar = s[i];
        const tChar = t[i];
        
        if (sToT.has(sChar) && sToT.get(sChar) !== tChar) {
            return false;
        }
        if (tToS.has(tChar) && tToS.get(tChar) !== sChar) {
            return false;
        }
        
        sToT.set(sChar, tChar);
        tToS.set(tChar, sChar);
    }
    
    return true;
}

/**
 * 6. Subarray Sum Equals K
 * Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.
 * 
 * Key Insight: Use prefix sum and map to find subarrays. If prefixSum - k exists, we found a subarray
 * Time: O(n), Space: O(n)
 * 
 * Example:
 * Input: nums = [1,1,1], k = 2
 * Output: 2 (subarrays [1,1] at indices (0,1) and (1,2))
 * 
 * Input: nums = [1,2,3], k = 3
 * Output: 2 (subarrays [3] and [1,2])
 * 
 * Input: nums = [1,-1,0], k = 0
 * Output: 3 (subarrays [1,-1], [0], and [1,-1,0])
 */
export function subarraySum(nums: number[], k: number): number {
    const prefixSumMap = new Map<number, number>();
    prefixSumMap.set(0, 1); // Empty subarray has sum 0
    
    let count = 0;
    let prefixSum = 0;
    
    for (const num of nums) {
        prefixSum += num;
        
        if (prefixSumMap.has(prefixSum - k)) {
            count += prefixSumMap.get(prefixSum - k)!;
        }
        
        prefixSumMap.set(prefixSum, (prefixSumMap.get(prefixSum) || 0) + 1);
    }
    
    return count;
}

/**
 * 7. Contiguous Array
 * Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.
 * 
 * Key Insight: Treat 0 as -1, equal 0s and 1s means sum = 0. Use prefix sum technique
 * Time: O(n), Space: O(n)
 * 
 * Example:
 * Input: nums = [0,1]
 * Output: 2 (entire array has equal 0s and 1s)
 * 
 * Input: nums = [0,0,1,0,0,1,1,0]
 * Output: 6 (subarray [0,1,0,0,1,1] from index 1 to 6)
 * 
 * Input: nums = [0,0,0,0,0]
 * Output: 0 (no equal number of 0s and 1s)
 */
export function findMaxLength(nums: number[]): number {
    const countMap = new Map<number, number>();
    countMap.set(0, -1); // Initialize with count 0 at index -1
    
    let maxLength = 0;
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
        count += nums[i] === 1 ? 1 : -1;
        
        if (countMap.has(count)) {
            maxLength = Math.max(maxLength, i - countMap.get(count)!);
        } else {
            countMap.set(count, i);
        }
    }
    
    return maxLength;
}

/**
 * 8. Longest Substring Without Repeating Characters (with Map)
 * Given a string s, find the length of the longest substring without repeating characters.
 * 
 * Key Insight: Sliding window with map to track last seen index of each character
 * Time: O(n), Space: O(min(m,n)) where m is charset size
 * 
 * Example:
 * Input: s = "abcabcbb"
 * Output: 3 (substring "abc")
 * 
 * Input: s = "bbbbb"
 * Output: 1 (substring "b")
 * 
 * Input: s = "pwwkew"
 * Output: 3 (substring "wke")
 */
export function lengthOfLongestSubstring(s: string): number {
    const charMap = new Map<string, number>();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (charMap.has(char) && charMap.get(char)! >= left) {
            left = charMap.get(char)! + 1;
        }
        
        charMap.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

/**
 * 9. Minimum Window Substring (with Map)
 * Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.
 * 
 * Key Insight: Sliding window with two maps - count required chars and window chars
 * Time: O(|s| + |t|), Space: O(|s| + |t|)
 * 
 * Example:
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * Output: "BANC" (minimum window containing A, B, C)
 * 
 * Input: s = "a", t = "a"
 * Output: "a"
 * 
 * Input: s = "a", t = "aa"
 * Output: "" (s doesn't contain enough 'a's)
 */
export function minWindow(s: string, t: string): string {
    if (s.length < t.length) return "";
    
    const tCount = new Map<string, number>();
    const windowCount = new Map<string, number>();
    
    // Count characters in t
    for (const char of t) {
        tCount.set(char, (tCount.get(char) || 0) + 1);
    }
    
    let required = tCount.size;
    let formed = 0;
    let left = 0;
    let minLength = Infinity;
    let minLeft = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        windowCount.set(char, (windowCount.get(char) || 0) + 1);
        
        if (tCount.has(char) && windowCount.get(char) === tCount.get(char)) {
            formed++;
        }
        
        while (formed === required) {
            if (right - left + 1 < minLength) {
                minLength = right - left + 1;
                minLeft = left;
            }
            
            const leftChar = s[left];
            windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
            
            if (tCount.has(leftChar) && windowCount.get(leftChar)! < tCount.get(leftChar)!) {
                formed--;
            }
            
            left++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minLeft, minLeft + minLength);
}

/**
 * 10. LRU Cache Implementation
 * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
 * 
 * Key Insight: Use Map's insertion order property - last inserted/accessed is most recent
 * Time: O(1) for get/put, Space: O(capacity)
 * 
 * Example:
 * cache = new LRUCache(2)
 * cache.put(1, 1) // cache: {1=1}
 * cache.put(2, 2) // cache: {1=1, 2=2}
 * cache.get(1)    // returns 1, cache: {2=2, 1=1}
 * cache.put(3, 3) // evicts 2, cache: {1=1, 3=3}
 * cache.get(2)    // returns -1 (not found)
 */
export class LRUCache {
    private capacity: number;
    private cache: Map<number, number>;
    
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key: number): number {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key)!;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1;
    }
    
    put(key: number, value: number): void {
        if (this.cache.has(key)) {
            // Update existing key
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey!);
        }
        
        this.cache.set(key, value);
    }
}

/**
 * 11. Logger Rate Limiter
 * Design a logger system that receive stream of messages along with its timestamps.
 * Each message should be printed if and only if it is not printed in the last 10 seconds.
 * 
 * Key Insight: Use map to store last printed timestamp for each message
 * Time: O(1) per call, Space: O(n) where n is unique messages
 * 
 * Example:
 * logger = new Logger()
 * logger.shouldPrintMessage(1, "foo")  // returns true, first time
 * logger.shouldPrintMessage(2, "bar")  // returns true, first time
 * logger.shouldPrintMessage(3, "foo")  // returns false, within 10 seconds
 * logger.shouldPrintMessage(8, "bar")  // returns false, within 10 seconds
 * logger.shouldPrintMessage(10, "foo") // returns false, within 10 seconds
 * logger.shouldPrintMessage(11, "foo") // returns true, 10 seconds passed
 */
export class Logger {
    private messageMap: Map<string, number>;
    
    constructor() {
        this.messageMap = new Map();
    }
    
    shouldPrintMessage(timestamp: number, message: string): boolean {
        if (!this.messageMap.has(message) || timestamp - this.messageMap.get(message)! >= 10) {
            this.messageMap.set(message, timestamp);
            return true;
        }
        return false;
    }
}

/**
 * 12. Design Underground System
 * Design a system that tracks customer travel times between stations.
 * 
 * Key Insight: Two maps - one for active check-ins, one for journey statistics
 * Time: O(1) per operation, Space: O(P + S²) where P=passengers, S=stations
 * 
 * Example:
 * system = new UndergroundSystem()
 * system.checkIn(45, "Leyton", 3)
 * system.checkIn(32, "Paradise", 8)
 * system.checkOut(45, "Waterloo", 15)  // Journey: Leyton -> Waterloo, time: 12
 * system.checkOut(32, "Cambridge", 22) // Journey: Paradise -> Cambridge, time: 14
 * system.getAverageTime("Paradise", "Cambridge") // returns 14.0
 * system.getAverageTime("Leyton", "Waterloo")    // returns 12.0
 */
export class UndergroundSystem {
    private checkIns: Map<number, { station: string; time: number }>;
    private journeys: Map<string, { totalTime: number; count: number }>;
    
    constructor() {
        this.checkIns = new Map();
        this.journeys = new Map();
    }
    
    checkIn(id: number, stationName: string, t: number): void {
        this.checkIns.set(id, { station: stationName, time: t });
    }
    
    checkOut(id: number, stationName: string, t: number): void {
        const checkIn = this.checkIns.get(id)!;
        const journeyKey = `${checkIn.station}-${stationName}`;
        const journeyTime = t - checkIn.time;
        
        if (this.journeys.has(journeyKey)) {
            const journey = this.journeys.get(journeyKey)!;
            journey.totalTime += journeyTime;
            journey.count++;
        } else {
            this.journeys.set(journeyKey, { totalTime: journeyTime, count: 1 });
        }
        
        this.checkIns.delete(id);
    }
    
    getAverageTime(startStation: string, endStation: string): number {
        const journeyKey = `${startStation}-${endStation}`;
        const journey = this.journeys.get(journeyKey)!;
        return journey.totalTime / journey.count;
    }
}
