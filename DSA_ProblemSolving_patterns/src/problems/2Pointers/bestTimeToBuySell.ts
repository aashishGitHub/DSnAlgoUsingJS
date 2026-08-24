/**
 * ============================================================================
 * BEST TIME TO BUY AND SELL STOCK - ALL VARIATIONS
 * ============================================================================
 *
 * This file contains solutions to all common variations of the stock trading
 * problem. Each variation has different constraints on buying/selling.
 *
 * Problem Variations:
 * 1. LeetCode 121: Buy once, sell once (single transaction)
 * 2. LeetCode 122: Buy and sell unlimited times (multiple transactions)
 * 3. LeetCode 123: At most 2 transactions
 * 4. LeetCode 188: At most k transactions
 * 5. LeetCode 309: With cooldown period (can't buy day after selling)
 * 6. LeetCode 714: With transaction fee
 *
 * PATTERN NOTE (categorization):
 * - Variations 1-2 are genuinely **Two Pointers / greedy single-pass** —
 *   track a running min (or capture every upward step) with O(1) state.
 * - Variations 3-6 are actually **Dynamic Programming (state machine)**: the
 *   O(1)-space variables (`buy1`, `sell1`, `hold`, `rest`, ...) are a rolled-up
 *   DP table where each variable represents "best profit in state X ending
 *   today." They're kept in this file for the "all stock problems together"
 *   revision view, but when pattern-matching in an interview, recognize them
 *   as DP, not two pointers.
 *
 * Real-World Applications:
 * - Stock trading algorithms
 * - Cryptocurrency trading bots
 * - Options trading strategies
 * - Resource allocation over time
 * - Energy trading systems
 * ============================================================================
 */

// ============================================================================
// VARIATION 1: Buy Once, Sell Once (LeetCode 121)
// ============================================================================

/**
 * Brute force baseline: try every (buy day, sell day) pair with buy < sell.
 *
 * Why it's slow: for each candidate sell day, the best buy day is always
 * "the minimum price seen so far" — a value that's cheap to maintain
 * incrementally instead of re-scanning all earlier days for every sell day.
 * That's exactly what `maxProfitOneTransaction` below does in one pass.
 *
 * @example
 * maxProfitOneTransactionBruteForce([7,1,5,3,6,4]);
 * // 5
 *
 * Time:  O(n²)  — every (buy, sell) pair.
 * Space: O(1)
 */
export const maxProfitOneTransactionBruteForce = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  let maxProfit = 0;
  for (let buy = 0; buy < prices.length; buy++) {
    for (let sell = buy + 1; sell < prices.length; sell++) {
      maxProfit = Math.max(maxProfit, prices[sell] - prices[buy]);
    }
  }
  return maxProfit;
};

/**
 * Find the maximum profit from buying and selling stock exactly once.
 *
 * @example
 * // Real-world: Single investment opportunity
 * // You have one chance to buy and sell a stock. When should you trade?
 * maxProfitOneTransaction([7,1,5,3,6,4])
 * // Returns: 5
 * // Explanation: Buy at day 2 (price=1), sell at day 5 (price=6), profit=5
 *
 * @example
 * // Real-world: One-time asset purchase decision
 * maxProfitOneTransaction([7,6,4,3,1])
 * // Returns: 0
 * // Explanation: Prices only decrease, no profit possible
 *
 * @param prices - Array of stock prices for each day
 * @returns Maximum profit from one buy and one sell
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
export const maxProfitOneTransaction = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  let minPrice = prices[0]; // Track minimum price seen so far
  let maxProfit = 0; // Track maximum profit achievable

  // Two pointer approach: track minimum buy price and maximum profit
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];

    // Update profit if selling today gives better profit
    maxProfit = Math.max(maxProfit, currentPrice - minPrice);

    // Update minimum price if we found a better buy point
    minPrice = Math.min(minPrice, currentPrice);
  }

  return maxProfit;
};

// Alternative implementation using explicit two pointers
export const maxProfitOneTransactionTwoPointers = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  let leftP = 0; // Buy pointer (tracks minimum price)
  let rightP = 1; // Sell pointer (tracks current day)
  let maxProfit = 0;

  while (rightP < prices.length) {
    const profit = prices[rightP] - prices[leftP];
    maxProfit = Math.max(maxProfit, profit);

    // If current price is lower than buy price, move buy pointer
    // This ensures we always buy at the lowest price seen so far
    if (prices[leftP] > prices[rightP]) {
      leftP = rightP;
    }
    rightP += 1;
  }

  return maxProfit;
};

// ============================================================================
// VARIATION 2: Buy and Sell Unlimited Times (LeetCode 122)
// ============================================================================
/**
 * Find maximum profit by buying and selling stock unlimited times.
 * You can only hold one share at a time, but can buy/sell multiple times.
 *
 * @example
 * // Real-world: Day trading strategy
 * // You can trade multiple times per day. Capture all upward price movements.
 * maxProfitUnlimited([7,1,5,3,6,4])
 * // Returns: 7
 * // Explanation: Buy at 1, sell at 5 (profit=4). Buy at 3, sell at 6 (profit=3). Total=7
 *
 * @example
 * // Real-world: Active trading portfolio
 * // Continuously buying low and selling high throughout the period
 * maxProfitUnlimited([1,2,3,4,5])
 * // Returns: 4
 * // Explanation: Buy at 1, sell at 5. Or buy/sell every day: (2-1)+(3-2)+(4-3)+(5-4)=4
 *
 * @param prices - Array of stock prices for each day
 * @returns Maximum profit from unlimited transactions
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 *
 * Strategy: Capture every price increase. If price goes up, we profit.
 */
export function maxProfitUnlimited(prices: number[]): number {
  if (!prices || prices.length < 2) return 0;

  let buyPrice = prices[0];
  let sellPrice = prices[0];
  let totalProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    const previousPrice = prices[i - 1];

    // If price is increasing, update sell price (hold the stock)
    if (currentPrice > previousPrice) {
      sellPrice = currentPrice;
    } else {
      // Price decreased - book the profit and reset buy/sell prices
      if (sellPrice > buyPrice) {
        totalProfit += sellPrice - buyPrice;
      }
      buyPrice = currentPrice;
      sellPrice = currentPrice;
    }
  }

  // Book final profit if we're still holding
  if (sellPrice > buyPrice) {
    totalProfit += sellPrice - buyPrice;
  }

  return totalProfit;
}

// Alternative simpler approach: Sum all positive price differences
export const maxProfitUnlimitedSimple = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  let totalProfit = 0;

  // Capture every price increase
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      totalProfit += prices[i] - prices[i - 1];
    }
  }

  return totalProfit;
};

// ============================================================================
// VARIATION 3: At Most 2 Transactions (LeetCode 123)
// ============================================================================
/**
 * Find maximum profit with at most 2 buy-sell transactions.
 *
 * @example
 * // Real-world: Limited trading opportunities
 * // You can only make 2 trades total. When should you buy and sell?
 * maxProfitTwoTransactions([3,3,5,0,0,3,1,4])
 * // Returns: 6
 * // Explanation: Buy at 0, sell at 3 (profit=3). Buy at 1, sell at 4 (profit=3). Total=6
 *
 * @param prices - Array of stock prices for each day
 * @returns Maximum profit with at most 2 transactions
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
export const maxProfitTwoTransactions = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  // Track best profit for first and second transaction
  let buy1 = -prices[0]; // Best profit after first buy
  let sell1 = 0; // Best profit after first sell
  let buy2 = -prices[0]; // Best profit after second buy
  let sell2 = 0; // Best profit after second sell

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];

    // First transaction states
    buy1 = Math.max(buy1, -price); // Buy today or keep previous buy
    sell1 = Math.max(sell1, buy1 + price); // Sell today or keep previous sell

    // Second transaction states
    buy2 = Math.max(buy2, sell1 - price); // Buy today or keep previous buy
    sell2 = Math.max(sell2, buy2 + price); // Sell today or keep previous sell
  }

  return sell2;
};

// ============================================================================
// VARIATION 4: At Most K Transactions (LeetCode 188)
// ============================================================================
/**
 * Find maximum profit with at most k buy-sell transactions.
 *
 * @example
 * // Real-world: Limited trading budget
 * // You can only make k trades. Optimize your trading strategy.
 * maxProfitKTransactions([2,4,1], 2)
 * // Returns: 2
 * // Explanation: Buy at 2, sell at 4. One transaction, profit=2
 *
 * @param prices - Array of stock prices for each day
 * @param k - Maximum number of transactions allowed
 * @returns Maximum profit with at most k transactions
 *
 * Time Complexity: O(n * k) - n days, k transactions
 * Space Complexity: O(k) - Array to track k transaction states
 */
export const maxProfitKTransactions = (prices: number[], k: number): number => {
  if (!prices || prices.length < 2 || k === 0) return 0;

  const n = prices.length;

  // If k >= n/2, we can make unlimited transactions (same as Variation 2)
  if (k >= n / 2) {
    return maxProfitUnlimitedSimple(prices);
  }

  // DP approach: track best profit for each transaction
  // buy[i] = best profit after buying in transaction i
  // sell[i] = best profit after selling in transaction i
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const price = prices[i];

    // Update states for each transaction level
    for (let j = k; j >= 1; j--) {
      sell[j] = Math.max(sell[j], buy[j] + price);
      buy[j] = Math.max(buy[j], sell[j - 1] - price);
    }
  }

  return sell[k];
};

// ============================================================================
// VARIATION 5: With Cooldown Period (LeetCode 309)
// ============================================================================
/**
 * Find maximum profit with unlimited transactions, but with a cooldown period.
 * After selling, you cannot buy on the next day (cooldown).
 *
 * @example
 * // Real-world: Trading restrictions
 * // After selling, you must wait one day before buying again (settlement period).
 * maxProfitWithCooldown([1,2,3,0,2])
 * // Returns: 3
 * // Explanation: Buy at 1, sell at 3 (profit=2). Cooldown. Buy at 0, sell at 2 (profit=2). Total=3
 *
 * @param prices - Array of stock prices for each day
 * @returns Maximum profit with cooldown constraint
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
export const maxProfitWithCooldown = (prices: number[]): number => {
  if (!prices || prices.length < 2) return 0;

  // State machine approach
  let hold = -prices[0]; // Holding stock (bought)
  let sold = 0; // Just sold (in cooldown)
  let rest = 0; // Resting (can buy)

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];
    const prevHold = hold;
    const prevSold = sold;
    const prevRest = rest;

    // State transitions
    hold = Math.max(prevHold, prevRest - price); // Buy or keep holding
    sold = prevHold + price; // Sell (from hold state)
    rest = Math.max(prevRest, prevSold); // Rest or continue resting
  }

  return Math.max(sold, rest);
};

// ============================================================================
// VARIATION 6: With Transaction Fee (LeetCode 714)
// ============================================================================
/**
 * Find maximum profit with unlimited transactions, but each transaction has a fee.
 *
 * @example
 * // Real-world: Brokerage fees
 * // Each trade costs a fee. Should you trade or hold?
 * maxProfitWithFee([1,3,2,8,4,9], 2)
 * // Returns: 8
 * // Explanation: Buy at 1, sell at 8 (profit=7-2=5). Buy at 4, sell at 9 (profit=5-2=3). Total=8
 *
 * @param prices - Array of stock prices for each day
 * @param fee - Transaction fee for each buy or sell
 * @returns Maximum profit after accounting for fees
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
export const maxProfitWithFee = (prices: number[], fee: number): number => {
  if (!prices || prices.length < 2) return 0;

  let hold = -prices[0]; // Best profit while holding stock
  let sold = 0; // Best profit while not holding stock

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];
    const prevHold = hold;
    const prevSold = sold;

    // Can hold by buying today or keeping previous hold
    hold = Math.max(prevHold, prevSold - price);

    // Can sell by selling held stock (pay fee) or keeping previous sold state
    sold = Math.max(prevSold, prevHold + price - fee);
  }

  return sold;
};

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "buy/sell stock, maximize profit" is a FAMILY —
 *    identify it by its CONSTRAINT, not just the word "stock":
 *      - 1 transaction           → running-min two-pointer (Variation 1)
 *      - unlimited transactions  → greedy, sum every positive delta (Variation 2)
 *      - ≤2 / ≤k transactions    → DP with per-transaction buy/sell state (3, 4)
 *      - cooldown / fee          → DP state machine with extra states (5, 6)
 * 2. Variation 4 (≤k) generalizes Variation 3 (≤2) — if asked for ≤2 first,
 *    mention that ≤k is the natural follow-up and you'd roll the two pairs
 *    of (buy, sell) variables into arrays indexed by transaction number.
 * 3. Pitfalls: Variation 4's `k >= n/2` short-circuit matters — without it,
 *    the O(n·k) DP can be far worse than O(n) when k is large relative to n.
 * 4. Common mistake: conflating Variation 1 (single transaction, running
 *    min) with Variation 2 (unlimited, sum positive deltas) — they look
 *    similar but the moment "sell then immediately re-buy" becomes legal,
 *    the whole strategy changes from "track one global min" to "capture
 *    every uphill segment."
 */
