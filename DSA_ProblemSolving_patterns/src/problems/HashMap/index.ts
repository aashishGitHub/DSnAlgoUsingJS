/**
 * Hash Map/Set Pattern - Main Export File
 * 
 * This file exports all hash map/set pattern implementations organized by type:
 * 1. Hash Set Patterns - O(1) lookups for membership testing
 * 2. Hash Map Patterns - O(1) lookups with key-value relationships
 * 3. Advanced Hash Map Patterns - Complex data structures and caching
 */

// Hash Set Patterns
// NOTE on aliases: several problems here are ALSO solved in other pattern
// folders with a different technique — that duplication is intentional
// (compare Set-based vs Floyd's-cycle vs cyclic-sort solutions of the same
// problem). To keep the master barrel unambiguous, the OTHER folder owns the
// canonical LeetCode name and the Set-based versions get a `...Set` suffix:
//   isHappy / findDuplicate            → canonical in FastSlowPointers (Floyd's)
//   missingNumber / findDisappearedNumbers → canonical in CyclicSort
export {
    containsDuplicate,
    twoSum as twoSumSet,
    isAnagram,
    intersection,
    isHappy as isHappySet,
    singleNumber,
    findDuplicate as findDuplicateSet,
    missingNumber as missingNumberSet,
    findDisappearedNumbers as findDisappearedNumbersSet,
    numJewelsInStones,
    numUniqueEmails
} from './hashSetPatterns';

// Group Anagrams (own dedicated file: brute force + sorted-key + char-count approaches)
export {
    groupAnagramsBruteForce,
    groupAnagramsBySortedKey,
    groupAnagramsByCharCount,
    groupAnagramsFunctional,
    groupAnagrams
} from './groupAnagrams';

// Hash Map Patterns
// lengthOfLongestSubstring / minWindow are canonically SlidingWindow problems
// (that folder owns the plain names); the copies here demonstrate the
// map-inside-a-window technique and carry a `...Map` suffix in this barrel.
export {
    twoSum,
    firstUniqChar,
    wordPattern,
    isIsomorphic,
    subarraySum,
    findMaxLength,
    lengthOfLongestSubstring as lengthOfLongestSubstringMap,
    minWindow as minWindowMap,
    LRUCache,
    Logger,
    UndergroundSystem
} from './hashMapPatterns';

// Top K Frequent Elements (own dedicated file: sort + heap + bucket-sort approaches)
export {
    topKFrequentSort,
    topKFrequentHeap,
    topKFrequentBucketSort,
    topKFrequent
} from './topKFrequent';

// Frequency Counter Patterns (consolidated + fixed from legacy .js files:
// 2sum/anagram/countUnique/getUnique/maxChars/pairsWithSumK/same)
export {
    same,
    maxChar,
    pairsWithTargetSum,
    countUniqueValuesSorted,
    uniqueValuesBruteForce,
    uniqueValues
} from './frequencyCounter';

// Longest Consecutive Sequence (Hash Set/Map Pattern)
export {
    longestConsecutive1,
    longestConsecutive2,
    longestConsecutive3,
    longestConsecutive4
} from './longestConsecutive';

/**
 * Hash Map/Set Pattern Guide
 * 
 * 1. HASH SET PATTERN:
 *    - Use Set for O(1) membership testing
 *    - Perfect for duplicate detection, intersection, union
 *    - Examples: Contains duplicate, Two sum, Anagram detection
 *    - Time: O(n), Space: O(n)
 * 
 * 2. HASH MAP PATTERN:
 *    - Use Map for O(1) key-value lookups
 *    - Perfect for frequency counting, indexing, caching
 *    - Examples: Top K frequent, First unique char, Subarray sum
 *    - Time: O(n), Space: O(n)
 * 
 * 3. ADVANCED HASH MAP PATTERNS:
 *    - Complex data structures (LRU Cache, Logger)
 *    - Multi-level mappings and state tracking
 *    - Examples: LRU Cache, Underground System, Logger
 *    - Time: O(1) for most operations, Space: O(n)
 * 
 * COMMON PATTERNS:
 * - Frequency counting: Map<element, count>
 * - Index mapping: Map<element, index>
 * - State tracking: Map<key, state>
 * - Caching: Map<key, value> with eviction
 * 
 * WHEN TO USE:
 * - Need O(1) lookups instead of O(n) linear search
 * - Counting frequencies or occurrences
 * - Detecting duplicates or unique elements
 * - Building indexes or caches
 * - Two-sum type problems
 * - Pattern matching and anagrams
 * 
 * PERFORMANCE BENEFITS:
 * - O(1) average case lookups vs O(n) linear search
 * - Enables O(n) solutions instead of O(n²) nested loops
 * - Essential for many optimization problems
 * - Foundation for advanced data structures
 */
