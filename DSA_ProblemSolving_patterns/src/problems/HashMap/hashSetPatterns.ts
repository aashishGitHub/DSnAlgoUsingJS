/**
 * Hash Set Pattern Problems
 * 
 * Pattern: Use Set for O(1) lookups to avoid nested loops
 * Time Complexity: O(n) typically
 * Space Complexity: O(n) for the set
 */

/**
 * 1. Contains Duplicate
 * Given an integer array nums, return true if any value appears at least twice in the array.
 */
export function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();
    
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}

/**
 * 2. Two Sum
 * Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.
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
 * 3. Valid Anagram
 * Given two strings s and t, return true if t is an anagram of s.
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

/**
 * 4. Group Anagrams
 * Given an array of strings strs, group the anagrams together.
 */
export function groupAnagrams(strs: string[]): string[][] {
    const anagramMap = new Map<string, string[]>();
    
    for (const str of strs) {
        // Sort characters to create a key
        const sorted = str.split('').sort().join('');
        
        if (!anagramMap.has(sorted)) {
            anagramMap.set(sorted, []);
        }
        anagramMap.get(sorted)!.push(str);
    }
    
    return Array.from(anagramMap.values());
}

/**
 * 5. Intersection of Two Arrays
 * Given two integer arrays nums1 and nums2, return an array of their intersection.
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

/**
 * 6. Happy Number
 * A happy number is a number defined by the following process:
 * Starting with any positive integer, replace the number by the sum of the squares of its digits.
 * Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle.
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

/**
 * 7. Single Number
 * Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.
 */
export function singleNumber(nums: number[]): number {
    const seen = new Set<number>();
    
    for (const num of nums) {
        if (seen.has(num)) {
            seen.delete(num);
        } else {
            seen.add(num);
        }
    }
    
    return Array.from(seen)[0];
}

/**
 * 8. Find the Duplicate Number
 * Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.
 * There is only one repeated number in nums, return this repeated number.
 */
export function findDuplicate(nums: number[]): number {
    const seen = new Set<number>();
    
    for (const num of nums) {
        if (seen.has(num)) {
            return num;
        }
        seen.add(num);
    }
    
    return -1;
}

/**
 * 9. Missing Number
 * Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.
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

/**
 * 10. Find All Numbers Disappeared in an Array
 * Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.
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

/**
 * 11. Jewels and Stones
 * You're given strings jewels representing the types of stones that are jewels, and stones representing the stones you have.
 * Each character in stones is a type of stone you have. You want to know how many of the stones you have are also jewels.
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

/**
 * 12. Unique Email Addresses
 * Every valid email consists of a local name and a domain name, separated by the '@' sign.
 * Besides lowercase letters, the email may contain one or more '.' or '+'.
 * If you add periods '.' between some characters in the local name part of an email address, mail sent there will be forwarded to the same address without dots.
 * If you add a plus '+' in the local name, everything after the first plus sign will be ignored.
 */
export function numUniqueEmails(emails: string[]): number {
    const uniqueEmails = new Set<string>();
    
    for (const email of emails) {
        const [local, domain] = email.split('@');
        
        // Process local part
        let processedLocal = local.split('+')[0].replace(/\./g, '');
        
        uniqueEmails.add(`${processedLocal}@${domain}`);
    }
    
    return uniqueEmails.size;
}
