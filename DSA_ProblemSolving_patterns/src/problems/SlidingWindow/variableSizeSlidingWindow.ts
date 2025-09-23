/**
 * Variable Size Sliding Window Problems
 * 
 * Pattern: Maintain a window that can grow or shrink based on certain conditions
 * Time Complexity: O(n)
 * Space Complexity: O(1) or O(k) depending on the problem
 */

/**
 * 1. Longest Substring Without Repeating Characters
 * Given a string, find the length of the longest substring without repeating characters.
 */
export function lengthOfLongestSubstring(s: string): number {
    const charMap = new Map<string, number>();
    let maxLength = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const rightChar = s[windowEnd];
        
        // If character is already in window, shrink window
        if (charMap.has(rightChar) && charMap.get(rightChar)! >= windowStart) {
            windowStart = charMap.get(rightChar)! + 1;
        }
        
        charMap.set(rightChar, windowEnd);
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}

/**
 * 2. Longest Substring with At Most K Distinct Characters
 * Given a string and an integer k, find the length of the longest substring with at most k distinct characters.
 */
export function longestSubstringWithKDistinct(s: string, k: number): number {
    if (k === 0) return 0;
    
    const charCount = new Map<string, number>();
    let maxLength = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const rightChar = s[windowEnd];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        
        // Shrink window if more than k distinct characters
        while (charCount.size > k) {
            const leftChar = s[windowStart];
            charCount.set(leftChar, charCount.get(leftChar)! - 1);
            
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            windowStart++;
        }
        
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}

/**
 * 3. Longest Substring with At Most Two Distinct Characters
 * Given a string, find the length of the longest substring that contains at most two distinct characters.
 */
export function longestSubstringWithTwoDistinct(s: string): number {
    return longestSubstringWithKDistinct(s, 2);
}

/**
 * 4. Minimum Window Substring
 * Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.
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
    let windowStart = 0;
    let minLength = Infinity;
    let minLeft = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const rightChar = s[windowEnd];
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);
        
        if (tCount.has(rightChar) && windowCount.get(rightChar) === tCount.get(rightChar)) {
            formed++;
        }
        
        // Try to shrink window
        while (formed === required) {
            if (windowEnd - windowStart + 1 < minLength) {
                minLength = windowEnd - windowStart + 1;
                minLeft = windowStart;
            }
            
            const leftChar = s[windowStart];
            windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
            
            if (tCount.has(leftChar) && windowCount.get(leftChar)! < tCount.get(leftChar)!) {
                formed--;
            }
            
            windowStart++;
        }
    }
    
    return minLength === Infinity ? "" : s.substring(minLeft, minLeft + minLength);
}

/**
 * 5. Longest Subarray with Sum Less Than or Equal to K
 * Given an array of integers and a target sum k, find the length of the longest subarray with sum ≤ k.
 */
export function longestSubarrayWithSumLessThanK(arr: number[], k: number): number {
    let maxLength = 0;
    let windowSum = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        windowSum += arr[windowEnd];
        
        // Shrink window if sum exceeds k
        while (windowSum > k) {
            windowSum -= arr[windowStart];
            windowStart++;
        }
        
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}

/**
 * 6. Longest Subarray with Sum Equal to K
 * Given an array of integers and a target sum k, find the length of the longest subarray with sum = k.
 */
export function longestSubarrayWithSumK(arr: number[], k: number): number {
    const prefixSum = new Map<number, number>();
    let maxLength = 0;
    let sum = 0;
    
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        
        if (sum === k) {
            maxLength = i + 1;
        }
        
        if (prefixSum.has(sum - k)) {
            maxLength = Math.max(maxLength, i - prefixSum.get(sum - k)!);
        }
        
        if (!prefixSum.has(sum)) {
            prefixSum.set(sum, i);
        }
    }
    
    return maxLength;
}

/**
 * 7. Fruit Into Baskets
 * You have two baskets, and you want to put the maximum number of fruits in them.
 * The only restriction is that each basket can have only one type of fruit.
 */
export function totalFruit(fruits: number[]): number {
    const fruitCount = new Map<number, number>();
    let maxFruits = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < fruits.length; windowEnd++) {
        const fruit = fruits[windowEnd];
        fruitCount.set(fruit, (fruitCount.get(fruit) || 0) + 1);
        
        // Shrink window if more than 2 types of fruits
        while (fruitCount.size > 2) {
            const leftFruit = fruits[windowStart];
            fruitCount.set(leftFruit, fruitCount.get(leftFruit)! - 1);
            
            if (fruitCount.get(leftFruit) === 0) {
                fruitCount.delete(leftFruit);
            }
            windowStart++;
        }
        
        maxFruits = Math.max(maxFruits, windowEnd - windowStart + 1);
    }
    
    return maxFruits;
}

/**
 * 8. Longest Repeating Character Replacement
 * Given a string s and an integer k, you can choose any character and change it to any other uppercase English letter.
 * You can perform this operation at most k times. Return the length of the longest substring containing the same letter.
 */
export function characterReplacement(s: string, k: number): number {
    const charCount = new Map<string, number>();
    let maxLength = 0;
    let maxCount = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
        const rightChar = s[windowEnd];
        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);
        maxCount = Math.max(maxCount, charCount.get(rightChar)!);
        
        // If current window is invalid, shrink it
        if (windowEnd - windowStart + 1 - maxCount > k) {
            const leftChar = s[windowStart];
            charCount.set(leftChar, charCount.get(leftChar)! - 1);
            windowStart++;
        }
        
        maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
    }
    
    return maxLength;
}

/**
 * 9. Subarray Product Less Than K
 * Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all the elements in the subarray is strictly less than k.
 */
export function numSubarrayProductLessThanK(nums: number[], k: number): number {
    if (k <= 1) return 0;
    
    let count = 0;
    let product = 1;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < nums.length; windowEnd++) {
        product *= nums[windowEnd];
        
        // Shrink window if product >= k
        while (product >= k) {
            product /= nums[windowStart];
            windowStart++;
        }
        
        // All subarrays ending at windowEnd with start from windowStart to windowEnd are valid
        count += windowEnd - windowStart + 1;
    }
    
    return count;
}

/**
 * 10. Maximum Points You Can Obtain from Cards
 * There are several cards arranged in a row, and each card has an associated number of points.
 * You can take k cards from the beginning or from the end of the row.
 * Return the maximum score you can obtain.
 */
export function maxScore(cardPoints: number[], k: number): number {
    const n = cardPoints.length;
    let totalSum = 0;
    
    // Calculate sum of first k cards
    for (let i = 0; i < k; i++) {
        totalSum += cardPoints[i];
    }
    
    let maxSum = totalSum;
    
    // Try taking cards from the end
    for (let i = 0; i < k; i++) {
        totalSum = totalSum - cardPoints[k - 1 - i] + cardPoints[n - 1 - i];
        maxSum = Math.max(maxSum, totalSum);
    }
    
    return maxSum;
}
