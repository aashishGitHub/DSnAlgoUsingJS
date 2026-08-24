/**
 * ============================================================================
 * GREATEST COMMON DIVISOR OF STRINGS (LeetCode 1071)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * For two strings, `t` "divides" `s` if `s` is `t` repeated some whole number
 * of times (s = t+t+...+t). Return the LARGEST string that divides BOTH
 * `str1` and `str2` (or "" if none exists).
 *
 *   Input:  str1 = "ABCABC", str2 = "ABC"      → "ABC"
 *   Input:  str1 = "ABABAB", str2 = "ABAB"     → "AB"
 *   Input:  str1 = "LEET",   str2 = "CODE"     → ""
 *
 * BUG FIXED DURING REWORK: the original .js only handled the case where one
 * length divides the other (e.g. "ABCABC"/"ABC") and returned "" for
 * everything else — so "ABABAB"/"ABAB" (answer "AB") wrongly gave "". The
 * general case needs the Euclidean idea below.
 *
 * PATTERN:
 * - **Euclid's GCD, lifted to strings.** Two insights:
 *   (1) A common divisor exists IFF `str1 + str2 === str2 + str1` — if the two
 *       strings share a repeating unit, concatenation order can't matter.
 *   (2) When it exists, its LENGTH is exactly gcd(len1, len2), so the answer
 *       is the first gcd(len1, len2) characters of either string.
 *
 * COMPLEXITY LADDER (n = len1, m = len2):
 *   Step 1  Brute force: test every prefix length as a candidate    O((n+m)·min(n,m))
 *   Step 2  Concatenation check + gcd-length ★                      O(n+m)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * STEP 1 — BRUTE FORCE: try every candidate divisor, longest first.
 * ----------------------------------------------------------------------------
 * A divisor's length must divide BOTH lengths, so only test prefix lengths
 * `L` where `len1 % L === 0 && len2 % L === 0`. For each, check the prefix
 * actually tiles both strings. Return the first (longest) that works.
 *
 * Why it's more work than needed: it re-tiles and re-compares whole strings
 * for several candidate lengths. Step 2 pinpoints the ONE correct length
 * directly via gcd, and replaces tiling with a single concatenation compare.
 *
 * Time: O((n+m)·min(n,m)) worst case. Space: O(n+m) for the built candidate.
 */
export function gcdOfStringsBruteForce(str1: string, str2: string): string {
  const n = str1.length;
  const m = str2.length;

  const tiles = (unit: string, full: string): boolean => {
    if (full.length % unit.length !== 0) return false;
    return unit.repeat(full.length / unit.length) === full;
  };

  // Longest possible divisor can't exceed the shorter string.
  for (let len = Math.min(n, m); len >= 1; len--) {
    if (n % len === 0 && m % len === 0) {
      const candidate = str1.slice(0, len);
      if (tiles(candidate, str1) && tiles(candidate, str2)) {
        return candidate;
      }
    }
  }
  return "";
}

/**
 * ----------------------------------------------------------------------------
 * STEP 2 ★ — CONCATENATION TEST + GCD LENGTH.
 * ----------------------------------------------------------------------------
 * Insight (1): if any common divisor exists, then `str1 + str2` must equal
 * `str2 + str1` (both are the shared unit repeated (n+m)/L times, so order is
 * irrelevant). If they differ, no divisor exists → "".
 *
 * Insight (2): given a divisor exists, its length is gcd(n, m) — the same
 * math as numeric GCD. The answer is the first gcd(n, m) chars of str1.
 *
 * DRY-RUN on "ABABAB" / "ABAB":
 *   "ABABAB"+"ABAB" === "ABAB"+"ABABAB" ? both "ABABABABAB" ✓ → divisor exists
 *   gcd(6, 4) = 2 → answer = "ABABAB".slice(0, 2) = "AB" ✓
 *
 * Time: O(n+m) — one concatenation compare + O(log) gcd. Space: O(n+m).
 */
export function gcdOfStrings(str1: string, str2: string): string {
  // Insight (1): no shared repeating unit ⇒ no common divisor.
  if (str1 + str2 !== str2 + str1) return "";

  // Insight (2): the divisor length is gcd of the two lengths.
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisorLength = gcd(str1.length, str2.length);

  return str1.slice(0, divisorLength);
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The magic line is `str1 + str2 === str2 + str1`. It feels like a trick,
 *    but it's just "a shared periodic unit makes concatenation commutative."
 *    Be ready to justify it, not just recite it.
 * 2. The answer LENGTH being gcd(n, m) is the direct lift of numeric GCD —
 *    same recursion `gcd(a,b) = gcd(b, a%b)`.
 * 3. Pitfall (the original bug): assuming one length divides the other. GCD
 *    handles the general case ("ABABAB"/"ABAB") that naive division misses.
 * 4. Related: string-periodicity problems (Repeated Substring Pattern, LC459)
 *    use the same "does a unit tile the whole string?" reasoning.
 */
