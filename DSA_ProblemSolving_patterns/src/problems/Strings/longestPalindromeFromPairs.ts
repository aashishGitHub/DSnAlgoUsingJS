/**
 * ============================================================================
 * LONGEST PALINDROME BY CONCATENATING WORDS (generalizes LeetCode 2131)
 * ============================================================================
 * (The original longestPalindrome.js sketched this idea but never returned a
 *  value and dropped the middle-word case — completed here.)
 *
 * PROBLEM STATEMENT:
 * Given an array of words, choose some of them and concatenate them in some
 * order to form the LONGEST possible palindrome. Return its length.
 *
 *   Input:  ["ab", "ba", "gg", "kc", "na", "ck", "an"]
 *   Output: 14 — e.g. "ab kc an gg na ck ba" (each reversed pair mirrors
 *           around the self-palindrome "gg" in the middle)
 *
 * PATTERN:
 * - **Hash-map pairing (frequency counter).** A word can appear on the LEFT
 *   half iff its REVERSE appears on the right half. So: pair each word with
 *   its reverse via a map. Self-palindromic words ("gg") pair with each
 *   other — and ONE leftover self-palindrome may sit alone in the middle.
 *
 * COMPLEXITY LADDER (n words, k = word length):
 *   Step 1  Try all orderings of all subsets    O(n! · …) — hopeless; skip to the insight
 *   Step 2  Count map + pair with reverse ★     Time O(n·k)   Space O(n·k)
 * ============================================================================
 */

/**
 * STEP 2 ★ — count words, match each against its reverse.
 *
 * Walkthrough of the rules:
 *  - word ≠ its reverse ("ab"/"ba"): every matched pair contributes
 *    2·k letters (one on each side). Count min(count[w], count[rev]) pairs —
 *    handled by decrementing both as we pair greedily.
 *  - word === its reverse ("gg"): pairs among themselves → ⌊count/2⌋ pairs
 *    contribute 2·k each; if any single one is left over, ONE of them (the
 *    longest such leftover — here all same length k) can sit in the middle
 *    exactly once.
 *
 * DRY-RUN on ["ab","ba","gg","kc","na","ck","an"] (k = 2):
 *   pairs: ab↔ba, kc↔ck, na↔an → 3 pairs → 3 · 2·2 = 12
 *   "gg" is self-palindromic, count 1 → no pair, but middle slot → +2
 *   → 14 ✓
 *
 * Time: O(n·k) — reverse each word once, O(1) map ops. Space: O(n·k).
 */
export function longestPalindromeFromPairs(words: string[]): number {
  const count = new Map<string, number>();
  for (const w of words) count.set(w, (count.get(w) || 0) + 1);

  let length = 0;
  let middleAvailable = false;

  for (const [word, c] of count) {
    const rev = word.split("").reverse().join("");

    if (word === rev) {
      // Self-palindrome: pair copies with each other.
      const pairs = Math.floor(c / 2);
      length += pairs * 2 * word.length;
      if (c % 2 === 1) middleAvailable = true; // one leftover may go in the middle
    } else if (word < rev && count.has(rev)) {
      // word < rev: process each (word, rev) pair exactly once, not twice.
      const pairs = Math.min(c, count.get(rev)!);
      length += pairs * 2 * word.length;
    }
  }

  if (middleAvailable) {
    // One unpaired self-palindrome can anchor the center.
    // (All words here share... no — lengths may differ: take the LONGEST leftover.)
    let bestMiddle = 0;
    for (const [word, c] of count) {
      const isSelfPal = word === word.split("").reverse().join("");
      if (isSelfPal && c % 2 === 1) bestMiddle = Math.max(bestMiddle, word.length);
    }
    length += bestMiddle;
  }

  return length;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "build a palindrome from PIECES" → pair pieces with
 *    their reverses via a count map; self-palindromic pieces are the special
 *    case (pair internally + one middle slot).
 * 2. The `word < rev` guard prevents double-counting each cross pair — the
 *    same dedup trick as processing unordered pairs anywhere.
 * 3. The middle slot: exactly ONE leftover self-palindrome may be used —
 *    forgetting it loses length; adding more than one breaks the mirror.
 * 4. Sibling problems: LC2131 (two-letter words — this exact logic), LC409
 *    (longest palindrome from CHARACTERS — same idea, chars instead of words).
 * 5. Don't confuse with Longest Palindromic SUBSTRING (LC5) — that's
 *    expand-around-center in `longestPalindromicSubstring.ts`.
 */
