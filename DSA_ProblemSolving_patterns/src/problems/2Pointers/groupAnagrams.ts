// Group Anagrams (LeetCode 49)
// Given an array of strings strs, group the anagrams together. You can return the answer in any order.

// An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, 
// typically using all the original letters exactly once.

// Example 1:
// Input: strs = ["eat","tea","tan","ate","nat","bat"]
// Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

// Example 2:
// Input: strs = [""]
// Output: [[""]]

// Example 3:
// Input: strs = ["a"]
// Output: [["a"]]

/**
 * Approach 1: Sort each string and use as hash map key
 * Time: O(N * K * log K) where N = number of strings, K = max length of string
 * Space: O(N * K) for the hash map
 */
function groupAnagrams1(strs: string[]): string[][] {
    const map = new Map<string, string[]>();
    
    for (const str of strs) {
        // Sort characters to create a key for anagrams
        const sortedStr = str.split('').sort().join('');
        
        if (!map.has(sortedStr)) {
            map.set(sortedStr, []);
        }
        
        map.get(sortedStr)!.push(str);
    }
    
    return Array.from(map.values());
}

/**
 * Approach 2: Character frequency count as hash map key
 * Time: O(N * K) where N = number of strings, K = max length of string
 * Space: O(N * K) for the hash map
 * 
 * This is more optimal as we avoid sorting
 */
function groupAnagrams2(strs: string[]): string[][] {
    const map = new Map<string, string[]>();
    
    for (const str of strs) {
        // Create frequency array for 26 lowercase letters
        const count = new Array(26).fill(0);
        
        for (const char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        
        // Use frequency array as key (convert to string)
        const key = count.join(',');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        
        map.get(key)!.push(str);
    }
    
    return Array.from(map.values());
}

/**
 * Approach 3: Using reduce for more functional approach
 */
function groupAnagrams3(strs: string[]): string[][] {
    const groups = strs.reduce((acc, str) => {
        const sortedStr = str.split('').sort().join('');
        
        if (!acc[sortedStr]) {
            acc[sortedStr] = [];
        }
        
        acc[sortedStr].push(str);
        return acc;
    }, {} as Record<string, string[]>);
    
    return Object.values(groups);
}

// Test cases
function runTests(): void {
    const testCases = [
        ["eat","tea","tan","ate","nat","bat"],
        [""],
        ["a"],
        ["abc", "bca", "cab", "xyz", "zyx", "yxz"]
    ];
    
    testCases.forEach((testCase, index) => {
        console.log(`Test case ${index + 1}:`, testCase);
        console.log('Result 1:', groupAnagrams1(testCase));
        console.log('Result 2:', groupAnagrams2(testCase));
        console.log('Result 3:', groupAnagrams3(testCase));
        console.log('---');
    });
}

// Key insights for Group Anagrams:
// 1. Anagrams have the same characters with same frequency
// 2. We can use sorting OR frequency counting to create a unique key
// 3. Hash map groups strings with the same key
// 4. Frequency counting is more efficient than sorting

// Pattern Recognition:
// - This is a classic "grouping by property" problem
// - Hash maps are perfect for grouping operations
// - The key insight is finding the right "canonical form" for the key

export { groupAnagrams1, groupAnagrams2, groupAnagrams3, runTests };
