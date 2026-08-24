/**
 * ============================================================================
 * GROUP ANAGRAMS (LeetCode 49)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given an array of strings `strs`, group the anagrams together. Return the
 * groups in any order. An anagram is a rearrangement of all the original
 * letters exactly once ("eat" ↔ "tea" ↔ "ate").
 *
 *   Input:  ["eat","tea","tan","ate","nat","bat"]
 *   Output: [["eat","tea","ate"],["tan","nat"],["bat"]]   // any order
 *
 * PATTERN:
 * - **Hash Map "group-by-canonical-key"**. The whole problem reduces to one
 *   question: *what single value is identical for two strings iff they are
 *   anagrams?* Find that "canonical key", bucket by it in a Map. Done.
 *
 * WHEN TO USE THIS PATTERN:
 * - "Group / bucket items that share some property" (anagrams, words by length,
 *   users by cohort, files by checksum). The skill is designing the key.
 *
 * REAL-WORLD ANALOGIES:
 * - Search dedup: collapse query variants ("new york" / "york new") into one bucket.
 * - Plagiarism / near-duplicate detection by normalized fingerprint.
 * - Inventory: group SKUs that are the same item under scrambled label codes.
 *
 * COMPLEXITY SUMMARY (N = #strings, K = max string length):
 *   Approach 1  Brute force (pairwise compare)  Time O(N² · K log K)  Space O(N)
 *   Approach 2  Sorted string as key            Time O(N · K log K)   Space O(N·K)
 *   Approach 3  Char-count as key  ★ optimal     Time O(N · K)         Space O(N·K)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (the naive baseline you should be able to derive)
 * ----------------------------------------------------------------------------
 * Idea: For each string, scan every group we've built so far and ask "is this
 * string an anagram of that group's representative?". If yes, join it; else
 * start a new group.
 *
 * How do we test "are A and B anagrams?" the naive way → sort both and compare.
 *
 * Why it is slow: every string is compared against (potentially) every existing
 * group, and each comparison itself sorts. That is the repeated work we will
 * remove in Approach 2/3 by computing a key ONCE per string.
 *
 * @example
 * groupAnagramsBruteForce(["eat","tea","bat"]);
 * // [["eat","tea"],["bat"]]
 *
 * Time:  O(N² · K log K)  — N strings × up-to-N group checks × K log K to sort.
 * Space: O(N)             — output groups (ignoring the sort scratch).
 */
export function groupAnagramsBruteForce(strs: string[]): string[][] {
  const groups: string[][] = [];
  const canonical = (s: string): string => s.split("").sort().join("");

  for (const str of strs) {
    // Try to place `str` into an existing group by comparing to its first member.
    let placed = false;
    for (const group of groups) {
      if (canonical(group[0]) === canonical(str)) {
        group.push(str);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([str]); // no match → new group
  }

  return groups;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — SORTED KEY + HASH MAP (recognize the pattern, kill the N²)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: the brute force keeps *re-deriving* "are these anagrams?".
 * But anagrams share one immutable fingerprint — their **sorted letters**.
 * "eat", "tea", "ate" all sort to "aet". So compute that key ONCE per string
 * and let a Map do the grouping in O(1) average per insert. No pairwise scan.
 *
 * DRY-RUN on ["eat","tea","tan","ate","nat","bat"]:
 *   "eat" → "aet"  map{ aet:[eat] }
 *   "tea" → "aet"  map{ aet:[eat,tea] }
 *   "tan" → "ant"  map{ aet:[eat,tea], ant:[tan] }
 *   "ate" → "aet"  map{ aet:[eat,tea,ate], ant:[tan] }
 *   "nat" → "ant"  map{ aet:[eat,tea,ate], ant:[tan,nat] }
 *   "bat" → "abt"  map{ aet:[eat,tea,ate], ant:[tan,nat], abt:[bat] }
 *   → [[eat,tea,ate],[tan,nat],[bat]]
 *
 * @example
 * groupAnagramsBySortedKey(["abc","bca","xyz"]);
 * // [["abc","bca"],["xyz"]]
 *
 * Time:  O(N · K log K)  — one sort per string.
 * Space: O(N · K)        — keys + grouped strings in the map.
 */
export function groupAnagramsBySortedKey(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split("").sort().join(""); // canonical form
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — CHAR-COUNT KEY ★ OPTIMAL (remove the log K from the key)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: sorting a string is O(K log K). But two strings are
 * anagrams iff they have the *same letter counts* — and counting is O(K), no
 * sort needed. Build a 26-slot frequency array (lowercase a–z) and turn it into
 * a string key like "1#0#0#...#2". Same counts → same key → same bucket.
 *
 * This is the version to reach for in an interview when strings are long or the
 * alphabet is small/fixed: it is provably linear in total input size.
 *
 * @example
 * groupAnagramsByCharCount(["eat","tea","tan"]);
 * // [["eat","tea"],["tan"]]
 *
 * Time:  O(N · K)   — count each string once; no sorting.
 * Space: O(N · K)   — keys + grouped strings.
 */
export function groupAnagramsByCharCount(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  const A = "a".charCodeAt(0);

  for (const str of strs) {
    const count = new Array(26).fill(0);
    for (const ch of str) count[ch.charCodeAt(0) - A]++;
    const key = count.join("#"); // '#' delimiter avoids "1,11" vs "11,1" collisions

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}

/**
 * ----------------------------------------------------------------------------
 * VARIANT — Functional style (same algorithm as Approach 2, reduce-based)
 * ----------------------------------------------------------------------------
 * Kept because it reads well and mirrors how you'd write it in a codebase.
 * Note: uses a plain object instead of a Map — fine here since keys are strings.
 */
export function groupAnagramsFunctional(strs: string[]): string[][] {
  const groups = strs.reduce((acc, str) => {
    const key = str.split("").sort().join("");
    (acc[key] ??= []).push(str);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.values(groups);
}

/** Default export: the optimal char-count approach. */
export const groupAnagrams = groupAnagramsByCharCount;

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "group / bucket things that share a property" → Hash Map
 *    keyed by a CANONICAL FORM. 80% of the work is designing that key.
 * 2. Two canonical keys for anagrams:
 *      - sorted string      → O(K log K) per string, trivial to write.
 *      - 26-length count[]  → O(K) per string, optimal; mention it as the follow-up.
 * 3. Complexity talking point: sorted-key is O(N·K log K); count-key is O(N·K).
 *    State which one and why — interviewers probe the K log K vs K difference.
 * 4. Pitfalls:
 *      - Don't join the count array with "," ("1,11,1" vs "11,1,..." can collide);
 *        use a non-digit delimiter like '#'.
 *      - Unicode / uppercase: a fixed 26-array only works for lowercase a–z.
 *        For general input, use a Map<char,count> or sorted-key instead.
 * 5. Follow-ups you may get: group by length, by character set (ignoring counts),
 *    or stream the strings (same key trick, just don't hold all input at once).
 *
 * BACKWARD-COMPAT ALIASES (old numbered names → descriptive names):
 */
export const groupAnagrams1 = groupAnagramsBySortedKey;
export const groupAnagrams2 = groupAnagramsByCharCount;
export const groupAnagrams3 = groupAnagramsFunctional;
