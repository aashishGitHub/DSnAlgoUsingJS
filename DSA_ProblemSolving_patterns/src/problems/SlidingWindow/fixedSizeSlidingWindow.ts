/**
 * Fixed Size Sliding Window Problems
 * 
 * Pattern: Maintain a window of fixed size k and slide it across the array
 * Time Complexity: O(n)
 * Space Complexity: O(1) or O(k) depending on the problem
 */

/**
 * 1. Maximum Sum of Subarray of Size K
 * Given an array of integers and a number k, find the maximum sum of any contiguous subarray of size k.
 */
export function maxSumSubarrayOfSizeK(arr: number[], k: number): number {
    if (arr.length < k) return -1;
    
    let windowSum = 0;
    let maxSum = 0;
    
    // Calculate sum of first window
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

/**
 * 2. First Negative Number in Every Window of Size K
 * For every window of size k, find the first negative number in that window.
 */
export function firstNegativeInWindow(arr: number[], k: number): number[] {
    const result: number[] = [];
    const negativeIndices: number[] = [];
    
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        // Add current element to window
        if (arr[windowEnd] < 0) {
            negativeIndices.push(windowEnd);
        }
        
        // If window size is k, process the window
        if (windowEnd - windowStart + 1 === k) {
            // Find first negative in current window
            let firstNegative = 0;
            while (negativeIndices.length > 0 && negativeIndices[0] < windowStart) {
                negativeIndices.shift();
            }
            
            if (negativeIndices.length > 0) {
                firstNegative = arr[negativeIndices[0]];
            }
            
            result.push(firstNegative);
            windowStart++;
        }
    }
    
    return result;
}

/**
 * 3. Count Anagrams of a Pattern in a String
 * Given a string and a pattern, find the count of anagrams of the pattern in the string.
 */
export function countAnagrams(text: string, pattern: string): number {
    const patternLength = pattern.length;
    const textLength = text.length;
    
    if (patternLength > textLength) return 0;
    
    const patternCount = new Map<string, number>();
    const windowCount = new Map<string, number>();
    
    // Count characters in pattern
    for (let i = 0; i < patternLength; i++) {
        const char = pattern[i];
        patternCount.set(char, (patternCount.get(char) || 0) + 1);
    }
    
    let count = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < textLength; windowEnd++) {
        const rightChar = text[windowEnd];
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);
        
        // If window size equals pattern length
        if (windowEnd - windowStart + 1 === patternLength) {
            // Check if current window is an anagram
            if (isAnagram(patternCount, windowCount)) {
                count++;
            }
            
            // Remove leftmost character from window
            const leftChar = text[windowStart];
            windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
            if (windowCount.get(leftChar) === 0) {
                windowCount.delete(leftChar);
            }
            windowStart++;
        }
    }
    
    return count;
}

function isAnagram(map1: Map<string, number>, map2: Map<string, number>): boolean {
    if (map1.size !== map2.size) return false;
    
    for (const [key, value] of map1) {
        if (map2.get(key) !== value) return false;
    }
    
    return true;
}

/**
 * 4. Maximum of All Subarrays of Size K
 * Given an array and an integer k, find the maximum for each and every contiguous subarray of size k.
 */
export function maxOfAllSubarrays(arr: number[], k: number): number[] {
    const result: number[] = [];
    const deque: number[] = []; // Store indices
    
    for (let i = 0; i < arr.length; i++) {
        // Remove elements outside current window
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove elements smaller than current element
        while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
            deque.pop();
        }
        
        deque.push(i);
        
        // Add maximum of current window to result
        if (i >= k - 1) {
            result.push(arr[deque[0]]);
        }
    }
    
    return result;
}

/**
 * 5. Average of All Subarrays of Size K
 * Given an array and a number k, find the average of all contiguous subarrays of size k.
 */
export function averageOfAllSubarrays(arr: number[], k: number): number[] {
    const result: number[] = [];
    let windowSum = 0;
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        windowSum += arr[windowEnd];
        
        if (windowEnd - windowStart + 1 === k) {
            result.push(windowSum / k);
            windowSum -= arr[windowStart];
            windowStart++;
        }
    }
    
    return result;
}

/**
 * 6. Find All Anagrams in a String
 * Given a string s and a non-empty string p, find all the start indices of p's anagrams in s.
 */
export function findAnagrams(s: string, p: string): number[] {
    const result: number[] = [];
    const pLength = p.length;
    const sLength = s.length;
    
    if (pLength > sLength) return result;
    
    const pCount = new Map<string, number>();
    const windowCount = new Map<string, number>();
    
    // Count characters in pattern
    for (let i = 0; i < pLength; i++) {
        const char = p[i];
        pCount.set(char, (pCount.get(char) || 0) + 1);
    }
    
    let windowStart = 0;
    
    for (let windowEnd = 0; windowEnd < sLength; windowEnd++) {
        const rightChar = s[windowEnd];
        windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);
        
        if (windowEnd - windowStart + 1 === pLength) {
            if (isAnagram(pCount, windowCount)) {
                result.push(windowStart);
            }
            
            const leftChar = s[windowStart];
            windowCount.set(leftChar, windowCount.get(leftChar)! - 1);
            if (windowCount.get(leftChar) === 0) {
                windowCount.delete(leftChar);
            }
            windowStart++;
        }
    }
    
    return result;
}
