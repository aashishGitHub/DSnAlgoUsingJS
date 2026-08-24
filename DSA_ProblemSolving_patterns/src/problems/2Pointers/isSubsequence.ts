/**
 * ============================================================================
 * IS SUBSEQUENCE (LeetCode 392)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given two strings `s` and `t`, return true if `s` is a subsequence of `t`
 * — i.e., every character of `s` appears in `t` in the same relative order,
 * though not necessarily contiguously.
 *
 *   s = "abc", t = "ahbgdc"  → true   ("a__b___c" in order)
 *   s = "axc", t = "ahbgdc"  → false  ("x" never appears after "a")
 *
 * PATTERN:
 * - **Two Pointers, greedy match.** Walk `t` once; whenever the current `t`
 *   character matches the character `s` is waiting for, advance `s`'s pointer.
 *   Greedily matching the EARLIEST possible position in `t` is always at
 *   least as good as matching later — never worse for what remains of `s`.
 *
 * WHEN TO USE:
 * - "Can A be formed by deleting some characters from B, keeping order?" →
 *   two pointers, greedy advance, no backtracking needed.
 *
 * REAL-WORLD ANALOGIES:
 * - Autocomplete/fuzzy search: does the typed string's letters appear in
 *   order within a longer candidate (e.g. "gto" inside "Google Photos")?
 * - Git/diff tooling: checking if a sequence of lines survived (in order)
 *   across an edit.
 * - Bioinformatics: checking if a short marker sequence occurs, in order,
 *   within a longer DNA/RNA strand (a simplified version of real alignment).
 *
 * COMPLEXITY SUMMARY (n = s.length, m = t.length):
 *   Approach 1  Brute force (try all index subsets)  Time O(C(m,n))  Space O(n)
 *   Approach 2  Two Pointers ★ optimal                Time O(m)       Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (backtracking over all ways to pick n indices from t)
 * ----------------------------------------------------------------------------
 * Idea: recursively try either "use t[tp] to match s[sp]" or "skip t[tp]".
 * This explores every increasing index subset of `t` of size `s.length`,
 * checking whether ANY of them spells out `s`.
 *
 * Why it's slow: it explores an exponential number of skip/match branches
 * even though, for THIS problem, skipping is never actually a mistake to
 * reconsider — the earliest match is always safe. That's the redundant work
 * Approach 2 removes by matching greedily instead of branching.
 *
 * @example
 * isSubsequenceBruteForce("abc", "ahbgdc");
 * // true
 *
 * Time:  O(C(m, n))  worst case — exponential branching (skip vs. match).
 * Space: O(n)         — recursion depth up to s.length.
 */
export function isSubsequenceBruteForce(s: string, t: string): boolean {
  function backtrack(sp: number, tp: number): boolean {
    if (sp === s.length) return true; // matched all of s
    if (tp === t.length) return false; // ran out of t first

    if (s[sp] === t[tp]) {
      // Try matching here...
      if (backtrack(sp + 1, tp + 1)) return true;
    }
    // ...or skip this character of t and keep looking.
    return backtrack(sp, tp + 1);
  }

  return backtrack(0, 0);
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — TWO POINTERS ★ OPTIMAL (greedy earliest match)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: greedily matching `s[sp]` to the FIRST available
 * occurrence in `t` never hurts — any later match would only leave less of
 * `t` for the rest of `s`. So there is no need to branch/backtrack: a single
 * forward pass with two pointers is sufficient and optimal.
 *
 * DRY-RUN on s="abc", t="ahbgdc":
 *   tp=0 t[0]=a === s[0]=a → sp=1
 *   tp=1 t[1]=h !== s[1]=b → sp stays
 *   tp=2 t[2]=b === s[1]=b → sp=2
 *   tp=3 t[3]=g !== s[2]=c → sp stays
 *   tp=4 t[4]=d !== s[2]=c → sp stays
 *   tp=5 t[5]=c === s[2]=c → sp=3 === s.length → true
 *
 * @example
 * isSubsequence("abc", "ahbgdc");
 * // true
 *
 * @example
 * isSubsequence("axc", "ahbgdc");
 * // false — 'x' is never found after 'a', so sp never reaches s.length
 *
 * Time:  O(m)  — single pass over t.
 * Space: O(1)
 */
export function isSubsequence(s: string, t: string): boolean {
  let sp = 0;
  let tp = 0;

  while (sp < s.length && tp < t.length) {
    if (s[sp] === t[tp]) sp++;
    tp++;
  }

  return sp === s.length;
}

/**
 * ----------------------------------------------------------------------------
 * VARIANT — same greedy two-pointer idea, driven by a single for-loop over t
 * ----------------------------------------------------------------------------
 * Identical time/space complexity to Approach 2; kept because "iterate the
 * longer string, advance a cursor into the shorter one" is a common way this
 * pattern is phrased in the wild (and worth recognizing as the same idea).
 */
export function isSubsequenceForLoop(s: string, t: string): boolean {
  let sp = 0;

  for (let tp = 0; tp < t.length; tp++) {
    if (s[sp] === t[tp]) {
      sp++;
    }
  }

  return sp === s.length;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "in order, not necessarily contiguous" + one string
 *    much shorter than the other → two pointers, greedy match, no backtracking.
 * 2. Why greedy is provably correct here (interviewers may ask): matching a
 *    character as early as possible in `t` can never make the remaining
 *    suffix of `t` worse for matching the rest of `s` — it can only leave
 *    MORE of `t` available, never less.
 * 3. Pitfalls: empty `s` should return true immediately (vacuously a
 *    subsequence) — both approaches above satisfy this since the loop/
 *    recursion never runs and `sp === s.length` (0 === 0) holds instantly.
 * 4. Follow-up (LeetCode 392's own follow-up, a favorite at Google/Meta):
 *    "If there are ~10,000 different `s` queries against the SAME fixed `t`,
 *    how do you speed it up?" → precompute, for `t`, a sorted list of indices
 *    per character; for each `s`, binary-search the next valid index for each
 *    character instead of rescanning `t` from scratch. Turns O(m) per query
 *    into O(n log m).
 */
