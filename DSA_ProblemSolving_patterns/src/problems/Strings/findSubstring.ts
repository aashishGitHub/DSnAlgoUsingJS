/**
 * ============================================================================
 * FIND THE FIRST INDEX OF A SUBSTRING (LeetCode 28 — strStr / indexOf)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Return the index of the first occurrence of `needle` in `haystack`, or −1.
 * (Implement it by hand — no indexOf / includes / regex.)
 *
 *   Input:  haystack = "abcdefg", needle = "bcd"   → 1
 *   Input:  haystack = "abcdefg", needle = "x"     → −1
 *
 * BUG FIXED DURING REWORK: the original .js looped
 * `i < haystack.length - needle.length` — one short. A match at the very END
 * was never found: findIndex("abcdef", "def") returned −1. The correct bound
 * is `<=` (a needle of length m can start at index n − m).
 *
 * COMPLEXITY LADDER (n = haystack, m = needle):
 *   Step 1  Check every alignment ★ (fine for interviews)  Time O(n·m)  Space O(1)
 *   Step 2  KMP (name it; code only if asked)               Time O(n+m)  Space O(m)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 ★ — BRUTE FORCE, done correctly: try every starting alignment.
 * ----------------------------------------------------------------------------
 * For each candidate start i (0 .. n−m INCLUSIVE), compare the m characters.
 * Mismatch → slide to i+1. Simple, and genuinely acceptable for LC28.
 *
 * DRY-RUN on ("abcdef", "def")  [the case the old bug missed]:
 *   n−m = 3, so i ranges 0..3
 *   i=0: 'a'≠'d' ✗   i=1: 'b'≠'d' ✗   i=2: 'c'≠'d' ✗
 *   i=3: d,e,f all match → return 3 ✓
 *
 * Time: O(n·m) worst case. Space: O(1).
 */
export function strStr(haystack: string, needle: string): number {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0; // by convention (matches LC28 / indexOf)
  if (m > n) return -1;

  for (let i = 0; i <= n - m; i++) { // <=  — the fix; last valid start is n−m
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i; // matched the whole needle
  }
  return -1;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 — WHY KMP EXISTS (the sentence to say, not the code to write):
 * ----------------------------------------------------------------------------
 * The brute force's waste: on a mismatch it slides ONE step and re-compares
 * characters it already matched. Worst case "aaaab" in "aaaaaaaab" re-scans
 * the same 'a's over and over → O(n·m).
 * KMP pre-computes, for each needle prefix, the longest proper prefix that is
 * also a suffix (the failure table) — so on a mismatch the needle "slides
 * itself" to the next viable alignment WITHOUT moving back in the haystack.
 * O(n+m). Rarely required live; naming the idea + the waste it removes is
 * usually the full credit. (Rabin-Karp — rolling hash — is the other name
 * worth dropping, especially for multi-pattern search.)
 */

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The loop bound: last valid start is n−m, so `i <= n - m`. Off-by-one
 *    here (the original file's bug) silently loses end-of-string matches —
 *    ALWAYS test a match at the very end.
 * 2. Edge cases to state up front: empty needle (→ 0), needle longer than
 *    haystack (→ −1).
 * 3. Escalation path: brute O(n·m) → KMP / Rabin-Karp O(n+m) → for MANY
 *    patterns at once, Aho-Corasick (name only).
 */
