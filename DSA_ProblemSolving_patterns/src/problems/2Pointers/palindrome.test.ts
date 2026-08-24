import { describe, it, expect } from "vitest";
import {
  reverseAndCompare,
  palindromeEvery,
  palindromeHalfLength,
  isPalindrome,
  isValidPalindromeAlphanumeric,
} from "./palindrome";

const simpleImplementations: Array<[string, (s: string) => boolean]> = [
  ["reverseAndCompare", reverseAndCompare],
  ["palindromeEvery", palindromeEvery],
  ["palindromeHalfLength", palindromeHalfLength],
  ["isPalindrome", isPalindrome],
];

describe("Valid Palindrome", () => {
  for (const [name, fn] of simpleImplementations) {
    describe(name, () => {
      it("recognizes a simple palindrome", () => {
        expect(fn("racecar")).toBe(true);
      });

      it("is case-insensitive", () => {
        expect(fn("Heeh")).toBe(true);
        expect(fn("RaceCar")).toBe(true);
      });

      it("rejects a non-palindrome", () => {
        expect(fn("hello")).toBe(false);
      });

      it("treats a single character as a palindrome", () => {
        expect(fn("a")).toBe(true);
      });

      it("treats an empty string as a palindrome", () => {
        expect(fn("")).toBe(true);
      });

      it("handles even-length palindromes", () => {
        expect(fn("abba")).toBe(true);
        expect(fn("abcd")).toBe(false);
      });
    });
  }

  it("all simple implementations agree across a batch of inputs", () => {
    const cases = ["racecar", "hello", "abba", "abcd", "a", "", "Noon", "step on no pets"];
    for (const s of cases) {
      const results = simpleImplementations.map(([, fn]) => fn(s));
      expect(new Set(results).size).toBe(1);
    }
  });

  describe("isValidPalindromeAlphanumeric (LeetCode 125 extension)", () => {
    it("ignores punctuation, spaces, and case", () => {
      expect(isValidPalindromeAlphanumeric("A man, a plan, a canal: Panama")).toBe(true);
    });

    it("returns false when letters don't mirror once non-alphanumerics are stripped", () => {
      expect(isValidPalindromeAlphanumeric("race a car")).toBe(false);
    });

    it("treats a string of only punctuation as a palindrome (nothing to compare)", () => {
      expect(isValidPalindromeAlphanumeric(".,")).toBe(true);
    });

    it("handles a single alphanumeric character", () => {
      expect(isValidPalindromeAlphanumeric("a.")).toBe(true);
    });

    it("Real-world: puzzle UI ignoring spacing/punctuation", () => {
      expect(isValidPalindromeAlphanumeric("Was it a car or a cat I saw?")).toBe(true);
    });
  });
});
