/**
 * ============================================================================
 * FIXED-SIZE SLIDING WINDOW
 * ============================================================================
 *
 * PATTERN:
 * - A window of a FIXED width `k` slides across the array/string one step at a
 *   time. The key move: instead of recomputing the whole window at each step,
 *   UPDATE it incrementally — subtract the element leaving on the left, add the
 *   element entering on the right. That single trick turns an O(n·k) rescan
 *   into an O(n) sweep.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY (this is the whole point of the pattern):
 * - Brute force: for each of the ~n starting positions, recompute the window's
 *   aggregate from scratch by looping over all k elements → O(n·k).
 * - Sliding window: compute the FIRST window once (O(k)), then each slide is
 *   O(1) (one subtract + one add) → O(n) total. `maxSumSubarrayOfSizeKBruteForce`
 *   vs `maxSumSubarrayOfSizeK` below is the canonical side-by-side of this.
 *
 * WHEN TO USE:
 * - "Every contiguous subarray/substring of size EXACTLY k" + an aggregate you
 *   can update incrementally (sum, average, char-frequency, min/max via deque).
 *
 * REAL-WORLD ANALOGIES:
 * - Moving averages: rolling 7-day average of a metric.
 * - Monitoring: peak load in any fixed 5-minute window of samples.
 * - Streaming text: scanning for anagram/keyword matches of a fixed length.
 *
 * FUNCTIONS IN THIS FILE (all O(n) time after the brute-force baseline):
 *   maxSumSubarrayOfSizeK      max window sum          O(n)  / O(1)
 *   firstNegativeInWindow      first negative per win  O(n)  / O(k)
 *   countAnagrams              count pattern anagrams  O(n)  / O(alphabet)
 *   maxOfAllSubarrays          window maxima (deque)   O(n)  / O(k)
 *   averageOfAllSubarrays      window averages         O(n)  / O(1)
 *   findAnagrams               anagram start indices   O(n)  / O(alphabet)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * 1. Maximum Sum of Subarray of Size K
 * ----------------------------------------------------------------------------
 * Given an array of integers and a number k, find the maximum sum of any
 * contiguous subarray of size k.
 */

/**
 * BRUTE FORCE baseline: recompute each window's sum from scratch.
 *
 * Why it's slow: adjacent windows share k-1 elements, but this re-adds all k
 * of them every time instead of reusing the previous sum. That redundant
 * re-summing is exactly what the sliding-window version below removes.
 *
 * @example
 * maxSumSubarrayOfSizeKBruteForce([2,6,9,2,1,8,5,6,3], 3); // 19 (window [8,5,6])
 *
 * Time: O(n·k) — n window positions × k elements summed each. Space: O(1).
 */
export function maxSumSubarrayOfSizeKBruteForce(arr: number[], k: number): number {
    if (arr.length < k) return -1;

    let max = -Infinity;
    for (let i = 0; i <= arr.length - k; i++) {
        let windowSum = 0;
        for (let j = 0; j < k; j++) {
            windowSum += arr[i + j];
        }
        max = Math.max(max, windowSum);
    }
    return max;
}

/**
 * SLIDING WINDOW ★ optimal: compute the first window once, then each slide is
 * one subtract (element leaving) + one add (element entering).
 *
 * @example
 * maxSumSubarrayOfSizeK([2,6,9,2,1,8,5,6,3], 3); // 19  (window [8,5,6] = 19)
 *
 * Time: O(n) — first window O(k), then O(1) per slide. Space: O(1).
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

/**
 * ----------------------------------------------------------------------------
 * PERMUTATION IN STRING (LeetCode 567)
 * ----------------------------------------------------------------------------
 * PROBLEM: does `s2` contain any permutation of `s1` as a CONTIGUOUS substring?
 *
 * MENTAL MODEL: "contains a permutation of s1" means "contains a window of
 * length s1.length whose letter tally equals s1's tally". A permutation cares
 * about WHICH letters and HOW MANY, never their order — so a frequency tally
 * is a complete description of the thing you are looking for, and the window
 * size is fixed at s1.length.
 *
 * 🔗 THIS IS `findAnagrams` (LC438) ASKING A YES/NO QUESTION. LC438 collects
 * every start index; this one only needs to know whether at least one exists,
 * so it can return early. Recognising that two problems are the same scan with
 * a different return type is worth more than learning both — and it is exactly
 * the observation that lets you say "I have already solved this".
 *
 * ============================================================================
 * WHY A 26-SLOT ARRAY BEATS A MAP HERE
 * ============================================================================
 * The alphabet is bounded, so the tally is O(1) space either way — but a
 * fixed-length array can be compared slot-by-slot in a constant 26 steps with
 * no allocation, and it never needs the "delete the key when the count hits
 * zero" bookkeeping that a Map does. That deletion step is a classic bug
 * source: a Map entry holding 0 still counts toward `map.size`, so forgetting
 * to delete it silently breaks any check that reads the size.
 *
 * ⭐ THE MATCH-COUNT REFINEMENT (used below): rather than re-comparing all 26
 * slots per window, keep a running count of how many letters currently have
 * the right frequency. Each slide changes at most two letters, so the update
 * is O(1) and a window matches exactly when `matches === 26`. This turns
 * O(26n) into O(n) — the same constant-factor idea as Brian Kernighan's bit
 * trick: stop redoing work the previous step already established.
 *
 * DRY-RUN s1 = "ab", s2 = "eidbaooo":
 *   window "ei" → tallies differ
 *   window "id" → differ
 *   window "db" → differ ('d' is not in s1)
 *   window "ba" → tally {a:1, b:1} === s1's tally  → TRUE ✓
 *
 * @example
 * checkInclusion("ab", "eidbaooo");  // true  ("ba" is a permutation of "ab")
 * checkInclusion("ab", "eidboaoo");  // false
 * checkInclusion("adc", "dcda");     // true  ("dca")
 * checkInclusion("abc", "ab");       // false — s1 cannot fit in s2
 *
 * Time:  O(n) where n = s2.length — each character enters and leaves once.
 * Space: O(1) — two fixed 26-slot tallies, regardless of input size.
 */
export function checkInclusion(s1: string, s2: string): boolean {
    if (s1.length > s2.length) return false;
    if (s1.length === 0) return true; // an empty string is trivially contained

    const A = 'a'.charCodeAt(0);
    const target = new Array<number>(26).fill(0);
    const window = new Array<number>(26).fill(0);

    for (const char of s1) {
        target[char.charCodeAt(0) - A]++;
    }

    // matches = how many of the 26 letters currently have exactly the right
    // count. Start by counting the letters that agree at zero-vs-zero.
    let matches = 0;
    for (let letter = 0; letter < 26; letter++) {
        if (window[letter] === target[letter]) matches++;
    }

    for (let end = 0; end < s2.length; end++) {
        // --- the character ENTERING the window ---
        const entering = s2.charCodeAt(end) - A;
        window[entering]++;
        if (window[entering] === target[entering]) {
            matches++;                                  // just became correct
        } else if (window[entering] === target[entering] + 1) {
            matches--;                                  // just overshot
        }

        // --- the character LEAVING, once the window is over-length ---
        if (end >= s1.length) {
            const leaving = s2.charCodeAt(end - s1.length) - A;
            window[leaving]--;
            if (window[leaving] === target[leaving]) {
                matches++;                              // just became correct
            } else if (window[leaving] === target[leaving] - 1) {
                matches--;                              // just fell short
            }
        }

        // All 26 letters agree → this window IS a permutation of s1.
        if (matches === 26) return true;
    }

    return false;
}
