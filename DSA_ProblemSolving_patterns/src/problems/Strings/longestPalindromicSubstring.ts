/**
 * ============================================================================
 * LONGEST PALINDROMIC SUBSTRING (LeetCode 5) — Blind 75
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given a string s, return the longest substring that is a palindrome.
 *
 *   Input:  "babad"
 *   Output: "bab"  (or "aba" — both length 3 are accepted)
 *
 * PATTERN:
 * - **Expand around center.** Instead of asking "is this substring a
 *   palindrome?" for every substring (outside-in), grow palindromes from
 *   every possible CENTER (inside-out). A palindrome mirrors around its
 *   center — so there are only 2n−1 centers (n letters + n−1 gaps), and each
 *   expansion does no wasted re-checking.
 *
 * COMPLEXITY LADDER (n = s.length):
 *   Step 1  All substrings + palindrome check   Time O(n³)   Space O(1)
 *   Step 2  Expand around center ★              Time O(n²)   Space O(1)
 *   Step 3  Manacher's algorithm                Time O(n)    (name it, don't code it live)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: try every substring, check each outside-in.
 * ----------------------------------------------------------------------------
 * Why it's slow: O(n²) substrings × O(n) palindrome check = O(n³). Worse,
 * checking "abcba" re-verifies its inner "bcb", which re-verifies "c" — the
 * nesting of palindromes is exactly the structure Step 2 exploits.
 *
 * Time: O(n³). Space: O(1).
 */
export function longestPalindromeBruteForce(s: string): string {
  const isPal = (str: string, lo: number, hi: number): boolean => {
    while (lo < hi) {
      if (str[lo++] !== str[hi--]) return false;
    }
    return true;
  };

  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (j - i + 1 > best.length && isPal(s, i, j)) {
        best = s.slice(i, j + 1);
      }
    }
  }
  return best;
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — EXPAND AROUND CENTER: inside-out instead of outside-in.
 * ----------------------------------------------------------------------------
 * Flip the question: not "is s[i..j] a palindrome?" but "how FAR does the
 * palindrome centered here reach?" Walk left-- / right++ while the ends
 * match. Two center types (the classic gotcha):
 *   - ODD  length: center is a letter        → expand(i, i)
 *   - EVEN length: center is BETWEEN letters → expand(i, i+1)
 *
 * DRY-RUN on "babad":
 *   center 'a'(1): b·a·b matches → "bab" (len 3); expand again: edge ≠ → stop
 *   center 'a'(3): a·b? no wait — b(2)a(3)a? s="babad": center 3 'a' → s[2]='b' vs s[4]='d' ✗ → "a"
 *   even centers: none match beyond length 0
 *   → best "bab" ✓
 *
 * Time: O(n²) worst case ("aaaa…"), typically far less. Space: O(1).
 */
export function longestPalindrome(s: string): string {
  if (s.length < 2) return s;

  let bestStart = 0;
  let bestLen = 1;

  // Returns the length of the longest palindrome expanding from lo/hi.
  const expand = (lo: number, hi: number): void => {
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      lo--;
      hi++;
    }
    // Loop overshot by one on each side: the palindrome is (lo+1 .. hi-1).
    const len = hi - lo - 1;
    if (len > bestLen) {
      bestLen = len;
      bestStart = lo + 1;
    }
  };

  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd-length centers  ("aba")
    expand(i, i + 1); // even-length centers ("abba")
  }

  return s.slice(bestStart, bestStart + bestLen);
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The insight to narrate: outside-in checking re-verifies nested inner
 *    palindromes; inside-out expansion never re-checks a matched pair.
 * 2. The bug everyone writes: forgetting EVEN centers ("abba" has no middle
 *    letter). 2n−1 centers total — say that number.
 * 3. After the while-loop overshoots, the palindrome is (lo+1, hi−1) —
 *    off-by-one central. Dry-run one example before declaring done.
 * 4. Follow-ups: count all palindromic substrings (LC647 — same expansion,
 *    count instead of max); Manacher's gets O(n) — name it as the known
 *    optimum; DP table (dp[i][j] = inner && ends match) is O(n²)/O(n²) and
 *    strictly worse than expansion here.
 * 5. Don't confuse with: Valid Palindrome (2Pointers — a CHECK, not a search)
 *    or Longest Palindrome From Pairs (Strings/ — multiset pairing).
 */
