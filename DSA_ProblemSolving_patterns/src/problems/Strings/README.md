# Strings Pattern

**When to Use**: String manipulation, palindromes, substring search, string operations  
**Time Complexity**: O(n) to O(n²) | **Space Complexity**: O(1) to O(n)

## Problems in this folder (reworked to TypeScript, brute-force → optimized + examples):

1. **reverseString.ts** - Reverse a string (built-in / two-pointer / reduce) + reverse WORDS (LC151)
2. **findSubstring.ts** - First index of a substring, strStr/LC28 (fixed the off-by-one that missed end-of-string matches; notes on KMP)
3. **longestPalindromicSubstring.ts** - Longest palindromic SUBSTRING, LC5 (NEW): expand-around-center vs O(n³) brute force
4. **longestPalindromeFromPairs.ts** - Longest palindrome by concatenating word pairs (completed from the broken .js stub; hash-map pairing)
5. **binaryAdd.ts** - Add two binary strings, LC67 (two-pointer grade-school addition with carry)

> Note the two DIFFERENT palindrome problems: `longestPalindromicSubstring.ts`
> (a search within one string, LC5) vs `longestPalindromeFromPairs.ts`
> (assemble from pieces) vs `../2Pointers/palindrome.ts` (a yes/no CHECK, LC125).

## Common Techniques:

- **Two Pointers**: For palindromes, reversing
- **Sliding Window**: For substring problems
- **Hash Map**: For character frequency
- **String Manipulation**: For basic operations

## Related Patterns:

- Two Pointers (for palindromes)
- Sliding Window (for substring problems)
- Hash Map (for anagrams, frequency)

