/**
 * ============================================================================
 * REVERSE A STRING / REVERSE WORDS IN A STRING (warm-ups with real depth)
 * ============================================================================
 *
 * Two related warm-ups that interviewers use to probe fundamentals:
 *   A) Reverse the characters of a string.       "farmer"        → "remraf"
 *   B) Reverse the WORDS of a sentence (LC151).  "the sky is"    → "is sky the"
 *
 * COMPLEXITY: all approaches below are O(n) time.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * A1 — BUILT-IN CHAIN: the one-liner to say first.
 * ----------------------------------------------------------------------------
 * split → reverse → join. Caveat worth mentioning: this splits by UTF-16
 * code units, so emoji/surrogate pairs break ("👍" reverses into garbage);
 * `[...str]` (iterator-based spread) handles them better.
 */
export function reverseString(input: string): string {
  return input.split("").reverse().join("");
}

/**
 * ----------------------------------------------------------------------------
 * A2 — TWO POINTERS, NO BUILT-INS: what "do it by hand" means.
 * ----------------------------------------------------------------------------
 * Strings are immutable in JS, so work on a char array: classic converging
 * swap (same skeleton as 2Pointers/palindrome.ts — a palindrome check IS a
 * reverse-and-compare fused into one pass).
 *
 * Time: O(n) — n/2 swaps. Space: O(n) for the char array (unavoidable in JS).
 */
export function reverseStringManual(input: string): string {
  const chars = input.split("");
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars.join("");
}

/**
 * ----------------------------------------------------------------------------
 * A3 — REDUCE (functional flavor): prepend each char to the accumulator.
 * ----------------------------------------------------------------------------
 * Elegant to read; note `curr + acc` builds a new string per step (O(n²) in
 * theory). Know it as a style option, not the performance answer.
 */
export function reverseStringReduce(input: string): string {
  return input.split("").reduce((acc, curr) => curr + acc, "");
}

/**
 * ----------------------------------------------------------------------------
 * B — REVERSE WORDS (LeetCode 151): tokenize, then emit in reverse.
 * ----------------------------------------------------------------------------
 * Incremental story:
 *   Step 1 (built-ins): s.trim().split(/\s+/).reverse().join(" ")
 *   Step 2 (by hand, below): walk once collecting words into a stack —
 *   whitespace ends the current word — then pop the stack. Handles leading /
 *   trailing / repeated spaces naturally because empty tokens never get pushed.
 *
 * DRY-RUN on "  the   sky  ":
 *   words collected: ["the", "sky"] → popped: "sky the" ✓
 *
 * Time: O(n). Space: O(n).
 */
export function reverseWords(s: string): string {
  const words: string[] = [];
  let current = "";

  for (let i = 0; i <= s.length; i++) {
    const ch = i < s.length ? s[i] : " "; // sentinel space flushes the last word
    if (ch === " ") {
      if (current.length > 0) {
        words.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  let result = "";
  for (let i = words.length - 1; i >= 0; i--) {
    result += words[i] + (i > 0 ? " " : "");
  }
  return result;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Lead with the built-in, THEN write the manual version — shows you know
 *    both the platform and the mechanics.
 * 2. Mention Unicode: split("") breaks surrogate pairs; [...str] is safer.
 * 3. Reverse WORDS follow-up "in place, O(1) extra": reverse the whole char
 *    array, then reverse each word — the same three-reversal insight as
 *    Arrays/rotateArray.ts.
 * 4. The empty-token discipline in reverseWords (never push "") is what makes
 *    messy spacing "just work" — call it out.
 */
