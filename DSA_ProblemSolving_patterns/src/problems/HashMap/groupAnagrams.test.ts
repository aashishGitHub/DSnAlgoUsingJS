import { describe, it, expect } from "vitest";
import {
  groupAnagramsBruteForce,
  groupAnagramsBySortedKey,
  groupAnagramsByCharCount,
  groupAnagramsFunctional,
} from "./groupAnagrams";

/**
 * Grouping order (and order within a group) is NOT guaranteed by the problem,
 * so we normalize before comparing: sort each group, then sort the list of
 * groups. This lets one assertion validate any correct implementation.
 */
function normalize(groups: string[][]): string[][] {
  return groups
    .map((g) => [...g].sort())
    .sort((a, b) => a.join(",").localeCompare(b.join(",")));
}

// Every implementation must satisfy the same contract → test them uniformly.
const implementations: Array<[string, (s: string[]) => string[][]]> = [
  ["groupAnagramsBruteForce", groupAnagramsBruteForce],
  ["groupAnagramsBySortedKey", groupAnagramsBySortedKey],
  ["groupAnagramsByCharCount", groupAnagramsByCharCount],
  ["groupAnagramsFunctional", groupAnagramsFunctional],
];

describe("Group Anagrams (LeetCode 49)", () => {
  for (const [name, groupAnagrams] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1: groups classic anagrams", () => {
        const result = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
        expect(normalize(result)).toEqual(
          normalize([["eat", "tea", "ate"], ["tan", "nat"], ["bat"]])
        );
      });

      it("LeetCode Example 2: single empty string", () => {
        expect(normalize(groupAnagrams([""]))).toEqual([[""]]);
      });

      it("LeetCode Example 3: single character", () => {
        expect(normalize(groupAnagrams(["a"]))).toEqual([["a"]]);
      });

      it("handles an empty input array", () => {
        expect(groupAnagrams([])).toEqual([]);
      });

      it("puts every string in its own group when none are anagrams", () => {
        const result = groupAnagrams(["abc", "def", "ghi"]);
        expect(result).toHaveLength(3);
        expect(normalize(result)).toEqual(
          normalize([["abc"], ["def"], ["ghi"]])
        );
      });

      it("collapses all strings into one group when all are anagrams", () => {
        const result = groupAnagrams(["abc", "bca", "cab", "acb"]);
        expect(result).toHaveLength(1);
        expect(normalize(result)).toEqual([["abc", "acb", "bca", "cab"]]);
      });

      it("Real-world: dedup scrambled search queries into intent buckets", () => {
        const queries = ["listen", "silent", "enlist", "google", "elgoog"];
        const result = groupAnagrams(queries);
        expect(normalize(result)).toEqual(
          normalize([["listen", "silent", "enlist"], ["google", "elgoog"]])
        );
      });

      it("keeps duplicates as separate members of the same group", () => {
        const result = groupAnagrams(["aa", "aa", "bb"]);
        expect(normalize(result)).toEqual(normalize([["aa", "aa"], ["bb"]]));
      });
    });
  }

  it("all four implementations agree on the same input", () => {
    const input = ["eat", "tea", "tan", "ate", "nat", "bat", "", "a", "aa"];
    const results = implementations.map(([, fn]) => normalize(fn(input)));
    for (let i = 1; i < results.length; i++) {
      expect(results[i]).toEqual(results[0]);
    }
  });
});
