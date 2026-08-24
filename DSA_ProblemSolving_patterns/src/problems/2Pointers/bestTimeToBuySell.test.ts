import { describe, it, expect } from "vitest";
import {
  maxProfitOneTransactionBruteForce,
  maxProfitOneTransaction,
  maxProfitOneTransactionTwoPointers,
  maxProfitUnlimited,
  maxProfitUnlimitedSimple,
  maxProfitTwoTransactions,
  maxProfitKTransactions,
  maxProfitWithCooldown,
  maxProfitWithFee,
} from "./bestTimeToBuySell";

describe("Best Time to Buy and Sell Stock - all variations", () => {
  describe("Variation 1: single transaction (LeetCode 121)", () => {
    const implementations: Array<[string, (p: number[]) => number]> = [
      ["maxProfitOneTransactionBruteForce", maxProfitOneTransactionBruteForce],
      ["maxProfitOneTransaction", maxProfitOneTransaction],
      ["maxProfitOneTransactionTwoPointers", maxProfitOneTransactionTwoPointers],
    ];

    for (const [name, fn] of implementations) {
      describe(name, () => {
        it("finds the best single buy/sell pair", () => {
          expect(fn([7, 1, 5, 3, 6, 4])).toBe(5);
        });

        it("returns 0 when prices only decrease", () => {
          expect(fn([7, 6, 4, 3, 1])).toBe(0);
        });

        it("returns 0 for fewer than 2 prices", () => {
          expect(fn([])).toBe(0);
          expect(fn([5])).toBe(0);
        });
      });
    }

    it("all three implementations agree on a batch of inputs", () => {
      const cases = [
        [7, 1, 5, 3, 6, 4],
        [7, 6, 4, 3, 1],
        [1, 2, 3, 4, 5],
        [2, 4, 1],
      ];
      for (const prices of cases) {
        const results = implementations.map(([, fn]) => fn(prices));
        expect(new Set(results).size).toBe(1);
      }
    });
  });

  describe("Variation 2: unlimited transactions (LeetCode 122)", () => {
    it("maxProfitUnlimited captures every upward move", () => {
      expect(maxProfitUnlimited([7, 1, 5, 3, 6, 4])).toBe(7);
      expect(maxProfitUnlimited([1, 2, 3, 4, 5])).toBe(4);
      expect(maxProfitUnlimited([7, 6, 4, 3, 1])).toBe(0);
    });

    it("maxProfitUnlimitedSimple agrees with maxProfitUnlimited", () => {
      const cases = [
        [7, 1, 5, 3, 6, 4],
        [1, 2, 3, 4, 5],
        [7, 6, 4, 3, 1],
      ];
      for (const prices of cases) {
        expect(maxProfitUnlimitedSimple(prices)).toBe(maxProfitUnlimited(prices));
      }
    });
  });

  describe("Variation 3: at most 2 transactions (LeetCode 123)", () => {
    it("finds the best combination of up to 2 trades", () => {
      expect(maxProfitTwoTransactions([3, 3, 5, 0, 0, 3, 1, 4])).toBe(6);
    });

    it("returns 0 when no profitable trade exists", () => {
      expect(maxProfitTwoTransactions([5, 4, 3, 2, 1])).toBe(0);
    });
  });

  describe("Variation 4: at most k transactions (LeetCode 188)", () => {
    it("matches the single-transaction case when k=1", () => {
      expect(maxProfitKTransactions([7, 1, 5, 3, 6, 4], 1)).toBe(
        maxProfitOneTransaction([7, 1, 5, 3, 6, 4])
      );
    });

    it("matches the two-transaction case when k=2", () => {
      const prices = [3, 3, 5, 0, 0, 3, 1, 4];
      expect(maxProfitKTransactions(prices, 2)).toBe(maxProfitTwoTransactions(prices));
    });

    it("degrades to unlimited transactions when k >= n/2", () => {
      const prices = [1, 2, 3, 4, 5];
      expect(maxProfitKTransactions(prices, 10)).toBe(maxProfitUnlimitedSimple(prices));
    });

    it("returns 0 when k is 0", () => {
      expect(maxProfitKTransactions([2, 4, 1], 0)).toBe(0);
    });
  });

  describe("Variation 5: with cooldown (LeetCode 309)", () => {
    it("respects the one-day cooldown after selling", () => {
      expect(maxProfitWithCooldown([1, 2, 3, 0, 2])).toBe(3);
    });

    it("returns 0 when no profitable trade exists", () => {
      expect(maxProfitWithCooldown([5, 4, 3, 2, 1])).toBe(0);
    });
  });

  describe("Variation 6: with transaction fee (LeetCode 714)", () => {
    it("accounts for the fee on each completed transaction", () => {
      expect(maxProfitWithFee([1, 3, 2, 8, 4, 9], 2)).toBe(8);
    });

    it("returns 0 when the fee outweighs any possible profit", () => {
      expect(maxProfitWithFee([1, 2], 5)).toBe(0);
    });
  });
});
