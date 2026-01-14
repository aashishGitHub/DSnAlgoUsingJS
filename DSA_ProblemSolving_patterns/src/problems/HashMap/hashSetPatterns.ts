/**
 * ============================================================================
 * HASH SET / HASH MAP PATTERN PROBLEMS
 * ============================================================================
 *
 * Core Insight: Trade space for time - O(n) space enables O(1) lookups
 *
 * WHEN TO USE:
 * - "Have I seen this before?" → Set for existence check
 * - "Where did I see this?" → Map for value/index lookup
 * - "How many times?" → Map for frequency counting
 * - "Group similar items" → Map<key, items[]>
 *
 * PATTERN RECOGNITION:
 * - Nested loop O(n²) → Often reducible to O(n) with HashSet/Map
 * - "Find pair/match" → Store complement, check on each iteration
 * - "Unique/Duplicate" → Set tracks seen elements
 * - "Frequency/Count" → Map<element, count>
 *
 * Time: O(n) typically | Space: O(n) for the set/map
 */

// ============================================================================
// 1. CONTAINS DUPLICATE - "Have I seen this number before?"
// ============================================================================
/**
 * @problem Given an integer array, return true if any value appears at least twice
 * @pattern Set for O(1) existence check
 * @realWorld Detecting duplicate usernames, duplicate transactions, unique visitors
 *
 * @example
 * containsDuplicate([1,2,3,1]) → true  // 1 appears twice
 * containsDuplicate([1,2,3,4]) → false // all unique
 *
 * Time: O(n) | Space: O(n)
 */
export function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      return true; // Duplicate found!
    }
    seen.add(num);
  }

  return false;
}

// ============================================================================
// 2. TWO SUM - "Have I seen the complement before?"
// ============================================================================
/**
 * @problem Find two numbers that add up to target, return their indices
 * @pattern Map stores {value: index} for O(1) complement lookup
 * @realWorld Finding matching transactions, pairing orders with inventory
 *
 * @example
 * twoSum([2,7,11,15], 9) → [0,1] // nums[0] + nums[1] = 2 + 7 = 9
 *
 * KEY INSIGHT: For each num, check if (target - num) exists in map
 * - If yes → found the pair!
 * - If no → store current num for future lookups
 *
 * Time: O(n) | Space: O(n)
 */
export function twoSum(nums: number[], target: number): number[] {
  const numMap = new Map<number, number>(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (numMap.has(complement)) {
      return [numMap.get(complement)!, i];
    }

    numMap.set(nums[i], i);
  }

  return [];
}

// ============================================================================
// 3. VALID ANAGRAM - "Do both strings have same character frequencies?"
// ============================================================================
/**
 * @problem Return true if t is an anagram of s (same chars, different order)
 * @pattern Map for frequency counting, increment/decrement approach
 * @realWorld Spell checker suggestions, word scramble games, detecting plagiarism
 *
 * @example
 * isAnagram("anagram", "nagaram") → true
 * isAnagram("rat", "car") → false
 *
 * APPROACH: Count chars in s (+1), then subtract chars in t (-1)
 * If all counts = 0 at end → anagram!
 *
 * Time: O(n) | Space: O(1) - max 26 lowercase letters
 */
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Map<string, number>();

  // Count characters in s
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Decrease count for characters in t
  for (const char of t) {
    if (!charCount.has(char)) return false;

    const count = charCount.get(char)! - 1;
    if (count === 0) {
      charCount.delete(char);
    } else {
      charCount.set(char, count);
    }
  }

  return charCount.size === 0;
}

// ============================================================================
// 4. GROUP ANAGRAMS - "Group strings by their sorted character signature"
// ============================================================================
/**
 * @problem Given array of strings, group anagrams together
 * @pattern Map<sortedKey, originalStrings[]> for grouping
 * @realWorld Categorizing products, grouping similar search queries
 *
 * @example
 * groupAnagrams(["eat","tea","tan","ate","nat","bat"])
 * → [["eat","tea","ate"], ["tan","nat"], ["bat"]]
 *
 * KEY INSIGHT: All anagrams have the same sorted character sequence
 * "eat" → "aet", "tea" → "aet", "ate" → "aet" → all same key!
 *
 * Time: O(n * k log k) where k = max string length | Space: O(n)
 */
export function groupAnagrams(strs: string[]): string[][] {
  const anagramMap = new Map<string, string[]>();

  for (const str of strs) {
    // Sort characters to create a canonical key
    const sorted = str.split("").sort().join("");

    if (!anagramMap.has(sorted)) {
      anagramMap.set(sorted, []);
    }
    anagramMap.get(sorted)!.push(str);
  }

  return Array.from(anagramMap.values());
}

// ============================================================================
// 5. INTERSECTION OF TWO ARRAYS - "What elements exist in both?"
// ============================================================================
/**
 * @problem Return array of elements present in both arrays (unique)
 * @pattern Set for O(1) membership check
 * @realWorld Common friends, shared interests, product comparison
 *
 * @example
 * intersection([1,2,2,1], [2,2]) → [2]
 * intersection([4,9,5], [9,4,9,8,4]) → [4,9]
 *
 * Time: O(n + m) | Space: O(n + m)
 */
export function intersection(nums1: number[], nums2: number[]): number[] {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  const result: number[] = [];

  for (const num of set1) {
    if (set2.has(num)) {
      result.push(num);
    }
  }

  return result;
}

// ============================================================================
// 6. HAPPY NUMBER - "Does this sequence cycle or reach 1?"
// ============================================================================
/**
 * @problem A number is happy if sum of squares of digits eventually = 1
 * @pattern Set to detect cycles (if we see same number twice → cycle → not happy)
 * @realWorld Cycle detection in state machines, detecting infinite loops
 *
 * @example
 * isHappy(19) → true  // 1²+9²=82 → 8²+2²=68 → ... → 1
 * isHappy(2)  → false // enters cycle, never reaches 1
 *
 * KEY INSIGHT: Either reaches 1 OR enters a cycle. Set detects the cycle.
 *
 * Time: O(log n) | Space: O(log n)
 */
export function isHappy(n: number): boolean {
  const seen = new Set<number>();

  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    n = getSumOfSquares(n);
  }

  return n === 1;
}

function getSumOfSquares(n: number): number {
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += digit * digit;
    n = Math.floor(n / 10);
  }
  return sum;
}

// ============================================================================
// 7. SINGLE NUMBER - "Find the element that appears only once"
// ============================================================================
/**
 * @problem Every element appears twice except one. Find the single one.
 * @pattern Set: add if not seen, remove if seen → only single remains
 * @realWorld Finding unique visitor, detecting odd-one-out, error detection
 *
 * @example
 * singleNumber([2,2,1]) → 1
 * singleNumber([4,1,2,1,2]) → 4
 *
 * NOTE: Optimal solution uses XOR (a ^ a = 0, a ^ 0 = a) for O(1) space
 * This Set approach is more intuitive but uses O(n) space
 *
 * Time: O(n) | Space: O(n) [XOR approach: O(1) space]
 */
export function singleNumber(nums: number[]): number {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      seen.delete(num); // Second occurrence - remove it
    } else {
      seen.add(num); // First occurrence - add it
    }
  }

  return Array.from(seen)[0]; // Only the single number remains
}

// ============================================================================
// 8. FIND THE DUPLICATE NUMBER - "Which number appears more than once?"
// ============================================================================
/**
 * @problem Array has n+1 integers in range [1,n], find the duplicate
 * @pattern Set tracks seen numbers, return first duplicate found
 * @realWorld Detecting duplicate entries, finding repeated transactions
 *
 * @example
 * findDuplicate([1,3,4,2,2]) → 2
 * findDuplicate([3,1,3,4,2]) → 3
 *
 * NOTE: Can also solve with Floyd's cycle detection for O(1) space
 *
 * Time: O(n) | Space: O(n) [Floyd's: O(1) space]
 */
export function findDuplicate(nums: number[]): number {
  const seen = new Set<number>();

  for (const num of nums) {
    if (seen.has(num)) {
      return num; // Found the duplicate!
    }
    seen.add(num);
  }

  return -1;
}

// ============================================================================
// 9. MISSING NUMBER - "Which number in [0,n] is missing?"
// ============================================================================
/**
 * @problem Array has n distinct numbers in [0,n], find the missing one
 * @pattern Set for O(1) lookup, check each number in range
 * @realWorld Finding gaps in sequences, missing IDs, incomplete data detection
 *
 * @example
 * missingNumber([3,0,1]) → 2
 * missingNumber([9,6,4,2,3,5,7,0,1]) → 8
 *
 * NOTE: Math approach: expected_sum - actual_sum = missing (O(1) space)
 * XOR approach also works: XOR all indices and values, result = missing
 *
 * Time: O(n) | Space: O(n) [Math/XOR: O(1) space]
 */
export function missingNumber(nums: number[]): number {
  const numSet = new Set(nums);
  const n = nums.length;

  for (let i = 0; i <= n; i++) {
    if (!numSet.has(i)) {
      return i;
    }
  }

  return -1;
}

// ============================================================================
// 10. FIND ALL DISAPPEARED NUMBERS - "Which numbers in [1,n] are missing?"
// ============================================================================
/**
 * @problem Array of n integers in [1,n], find ALL missing numbers
 * @pattern Set for existence check, iterate through expected range
 * @realWorld Finding all missing records, incomplete data audit
 *
 * @example
 * findDisappearedNumbers([4,3,2,7,8,2,3,1]) → [5,6]
 * findDisappearedNumbers([1,1]) → [2]
 *
 * NOTE: Can mark indices as negative for O(1) space (modifies input)
 *
 * Time: O(n) | Space: O(n) [In-place marking: O(1) extra space]
 */
export function findDisappearedNumbers(nums: number[]): number[] {
  const numSet = new Set(nums);
  const result: number[] = [];

  for (let i = 1; i <= nums.length; i++) {
    if (!numSet.has(i)) {
      result.push(i);
    }
  }

  return result;
}

// ============================================================================
// 11. JEWELS AND STONES - "How many of my stones are jewels?"
// ============================================================================
/**
 * @problem Count how many characters in 'stones' appear in 'jewels'
 * @pattern Set for O(1) jewel lookup
 * @realWorld Inventory counting, category matching, permission checking
 *
 * @example
 * numJewelsInStones("aA", "aAAbbbb") → 3  // 'a' and 'A' are jewels
 * numJewelsInStones("z", "ZZ") → 0        // case sensitive
 *
 * Time: O(j + s) | Space: O(j) where j=jewels.length, s=stones.length
 */
export function numJewelsInStones(jewels: string, stones: string): number {
  const jewelSet = new Set(jewels);
  let count = 0;

  for (const stone of stones) {
    if (jewelSet.has(stone)) {
      count++;
    }
  }

  return count;
}

// ============================================================================
// 12. UNIQUE EMAIL ADDRESSES - "How many unique destinations after processing?"
// ============================================================================
/**
 * @problem Count unique email addresses after applying Gmail-style rules:
 *          - Dots in local name are ignored: a.b@x.com = ab@x.com
 *          - Everything after + in local is ignored: a+spam@x.com = a@x.com
 * @pattern Set to store normalized emails
 * @realWorld Email deduplication, spam detection, user counting
 *
 * @example
 * numUniqueEmails(["a.b@x.com", "ab@x.com"]) → 1  // same after removing dots
 * numUniqueEmails(["a+b@x.com", "a@x.com"]) → 1   // same after removing +suffix
 *
 * Time: O(n * m) where m = avg email length | Space: O(n)
 */
export function numUniqueEmails(emails: string[]): number {
  const uniqueEmails = new Set<string>();

  for (const email of emails) {
    const [local, domain] = email.split("@");

    // Process local: remove everything after +, remove all dots
    const processedLocal = local.split("+")[0].replace(/\./g, "");

    uniqueEmails.add(`${processedLocal}@${domain}`);
  }

  return uniqueEmails.size;
}
