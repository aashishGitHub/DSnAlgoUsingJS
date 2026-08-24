import { describe, it, expect } from "vitest";
import {
  isSubsequenceBruteForce,
  isSubsequence,
  isSubsequenceForLoop,
} from "./isSubsequence";

const implementations: Array<[string, (s: string, t: string) => boolean]> = [
  ["isSubsequenceBruteForce", isSubsequenceBruteForce],
  ["isSubsequence", isSubsequence],
  ["isSubsequenceForLoop", isSubsequenceForLoop],
];

describe("Is Subsequence (LeetCode 392)", () => {
  for (const [name, isSub] of implementations) {
    describe(name, () => {
      it("LeetCode Example 1: true when s is a subsequence of t", () => {
        expect(isSub("abc", "ahbgdc")).toBe(true);
      });

      it("LeetCode Example 2: false when a character never appears in order", () => {
        expect(isSub("axc", "ahbgdc")).toBe(false);
      });

      it("treats an empty s as vacuously true", () => {
        expect(isSub("", "anything")).toBe(true);
      });

      it("returns false when t is empty but s is not", () => {
        expect(isSub("a", "")).toBe(false);
      });

      it("returns true when s equals t exactly", () => {
        expect(isSub("abc", "abc")).toBe(true);
      });

      it("returns false when s is longer than t", () => {
        expect(isSub("abcd", "abc")).toBe(false);
      });

      it("handles repeated characters correctly", () => {
        expect(isSub("aab", "aaab")).toBe(true);
        expect(isSub("aaa", "aab")).toBe(false);
      });

      it("Real-world: fuzzy autocomplete match within a longer phrase", () => {
        expect(isSub("gto", "Google Photos".toLowerCase())).toBe(true);
        expect(isSub("oto", "Google Photos".toLowerCase())).toBe(true);
        expect(isSub("xyz", "Google Photos".toLowerCase())).toBe(false);
      });
    });
  }

  it("all implementations agree across a batch of inputs", () => {
    const cases: Array<[string, string]> = [
      ["abc", "ahbgdc"],
      ["axc", "ahbgdc"],
      ["", "abc"],
      ["a", ""],
      ["aab", "aaab"],
    ];

    for (const [s, t] of cases) {
      const results = implementations.map(([, fn]) => fn(s, t));
      expect(new Set(results).size).toBe(1);
    }
  });
});
