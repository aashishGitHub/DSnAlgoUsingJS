/**
 * ============================================================================
 * VALID PALINDROME (warm-up + LeetCode 125)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * A string is a palindrome if it reads the same forwards and backwards
 * (case-insensitive), e.g. "Heeh", "racecar".
 *
 * LeetCode 125 extends this: given a string that may contain spaces and
 * punctuation, consider ONLY alphanumeric characters (ignoring case) and
 * determine whether that filtered string is a palindrome.
 *
 *   "A man, a plan, a canal: Panama"  → true  (→ "amanaplanacanalpanama")
 *
 * PATTERN:
 * - **Two Pointers, converging from both ends.** Compare the outermost
 *   unresolved characters; if they ever disagree, it's not a palindrome. Stop
 *   once the pointers meet — no need to re-check the middle twice.
 *
 * WHEN TO USE:
 * - Any "does this sequence mirror itself" check: palindromes, symmetric
 *   arrays, matching brackets from both ends.
 *
 * REAL-WORLD ANALOGIES:
 * - Input validation: "is this confirmation code a palindrome" style checks.
 * - Bioinformatics: detecting reverse-complement palindromic DNA motifs.
 * - Text UX: puzzle games / word toys that highlight palindromic phrases.
 *
 * COMPLEXITY SUMMARY (n = string length):
 *   Approach 1  Reverse & compare               Time O(n)    Space O(n)
 *   Approach 2  every() with mirrored index      Time O(n)    Space O(n)*
 *   Approach 3  Index arithmetic, half-length     Time O(n/2)  Space O(1)
 *   Approach 4  Two Pointers ★ optimal            Time O(n/2)  Space O(1)
 *   Extension   Valid Palindrome (alphanumeric)   Time O(n)    Space O(1)
 *   (*) `.split("")`/`.slice()` allocate an intermediate array/string.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE: reverse the string and compare
 * ----------------------------------------------------------------------------
 * Idea: a palindrome is, by definition, equal to its own reverse. So just
 * build the reverse and compare with `===`.
 *
 * Why it's not optimal: building the reversed copy allocates a whole new
 * array + string (O(n) extra space) just to answer a yes/no question — the
 * answer is knowable by comparing characters directly, in place, without
 * ever materializing the reverse.
 *
 * @example
 * reverseAndCompare("Heeh");
 * // true
 */
export function reverseAndCompare(inputString: string): boolean {
  const originalString = inputString.toLowerCase();
  const reversed = originalString.split("").reverse().join("");
  return originalString === reversed;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — every() with a mirrored index (full-length, functional style)
 * ----------------------------------------------------------------------------
 * Idea: for every index i, compare it against its mirror (length-1-i) using
 * Array.prototype.every. This is already the two-pointer COMPARISON, just
 * expressed without named pointers — and it redundantly re-checks each pair
 * twice (once as i, once again as its own mirror), which Approach 3 fixes.
 *
 * @example
 * palindromeEvery("abba");
 * // true
 */
export function palindromeEvery(inputString: string): boolean {
  const originalString = inputString.toLowerCase();
  return originalString
    .split("")
    .every((char, index) => char === originalString[originalString.length - 1 - index]);
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — index arithmetic, only half the string
 * ----------------------------------------------------------------------------
 * Pattern reasoning: once index i has been compared against its mirror, there
 * is no reason to later compare the mirror against i again — so only walk
 * the first half. This is the two-pointer idea in disguise: `i` and
 * `length-1-i` ARE the two pointers, just derived from one loop variable
 * instead of two.
 *
 * @example
 * palindromeHalfLength("abba");
 * // true
 */
export function palindromeHalfLength(inputString: string): boolean {
  const s = inputString.toLowerCase();

  for (let i = 0; i < s.length / 2; i++) {
    if (s[i] !== s[s.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 4 — TWO POINTERS ★ OPTIMAL (explicit, converging pointers)
 * ----------------------------------------------------------------------------
 * The canonical form: two named pointers start at both ends and walk inward,
 * stopping the moment they cross or a mismatch is found. This is the version
 * that generalizes cleanly to variants (see Extension below, and "Valid
 * Palindrome II" which allows skipping one mismatched pair via deletion).
 *
 * @example
 * isPalindrome("racecar");
 * // true
 *
 * @example
 * isPalindrome("hello");
 * // false
 *
 * Time:  O(n/2)  — pointers meet in the middle.
 * Space: O(1)    — no extra string/array allocated.
 */
export function isPalindrome(s: string): boolean {
  if (typeof s !== "string") return false;

  const lower = s.toLowerCase(); // match the case-insensitive contract of Approaches 1-3
  let start = 0;
  let end = lower.length - 1;

  while (start <= end) {
    if (lower[start] !== lower[end]) {
      return false;
    }
    start++;
    end--;
  }

  return true;
}

/**
 * ----------------------------------------------------------------------------
 * EXTENSION — LeetCode 125: Valid Palindrome (ignore non-alphanumeric, case)
 * ----------------------------------------------------------------------------
 * Same two-pointer skeleton as Approach 4, but each pointer first SKIPS over
 * any character that isn't a letter or digit before comparing. This is the
 * version almost always meant when an interviewer says "valid palindrome."
 *
 * @example
 * // Real-world: puzzle/UX feature that ignores punctuation and spacing.
 * isValidPalindromeAlphanumeric("A man, a plan, a canal: Panama");
 * // true
 *
 * @example
 * isValidPalindromeAlphanumeric("race a car");
 * // false
 *
 * Time:  O(n)   — each pointer visits each character at most once.
 * Space: O(1)
 */
export function isValidPalindromeAlphanumeric(s: string): boolean {
  const isAlphanumeric = (ch: string): boolean => /[a-z0-9]/i.test(ch);

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (!isAlphanumeric(s[left])) {
      left++;
      continue;
    }
    if (!isAlphanumeric(s[right])) {
      right--;
      continue;
    }
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "reads the same forwards/backwards" → two pointers from
 *    both ends, O(1) extra space — never build the reversed copy in an
 *    interview setting unless explicitly fine with O(n) space.
 * 2. Talking point: Approaches 1-3 are all O(n) time but Approach 1/2 use
 *    O(n) space (materialize a reversed/split copy); Approach 3/4 are the
 *    O(1)-space answers interviewers are usually looking for.
 * 3. Pitfalls: case sensitivity (lowercase both sides, or compare
 *    case-insensitively per character); off-by-one in the half-length loop
 *    (`length / 2`, not `length / 2 - 1` — non-integer division is fine since
 *    the loop condition truncates naturally on the comparison, not the bound).
 *    Real example from this exact file: the original `isPalindrome` forgot
 *    the `.toLowerCase()` that the other three approaches had — four
 *    functions that all "solve the same problem" quietly disagreed on
 *    "RaceCar". When you keep multiple approaches to the same problem
 *    side-by-side, cross-test them against EACH OTHER, not just against your
 *    own hand-picked examples — that's what surfaces this class of bug.
 * 4. Follow-ups:
 *      - Valid Palindrome II (LeetCode 680): allow deleting at most one
 *        character — on a mismatch, try skipping either the left or right
 *        character and check if THAT makes the rest a palindrome.
 *      - Longest Palindromic Substring: a different pattern (expand-around-
 *        center or DP), not a direct extension of this two-pointer check.
 */
