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
 * Real-World Applications:
 * - Stock trading algorithms
 * - Cryptocurrency trading bots
 * - Options trading strategies
 * - Resource allocation over time
 * - Energy trading systems
 */

// ============================================================================
// VARIATION 1: Buy Once, Sell Once (LeetCode 121)
// ============================================================================
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
 * @param {number[]} prices - Array of stock prices for each day
 * @returns {number} Maximum profit from one buy and one sell
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
const maxProfitOneTransaction = (prices) => {
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
const maxProfitOneTransactionTwoPointers = (prices) => {
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
 * @param {number[]} prices - Array of stock prices for each day
 * @returns {number} Maximum profit from unlimited transactions
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 *
 * Strategy: Capture every price increase. If price goes up, we profit.
 */
function maxProfitUnlimited(prices) {
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
const maxProfitUnlimitedSimple = (prices) => {
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
 * @param {number[]} prices - Array of stock prices for each day
 * @returns {number} Maximum profit with at most 2 transactions
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
const maxProfitTwoTransactions = (prices) => {
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
 * @param {number[]} prices - Array of stock prices for each day
 * @param {number} k - Maximum number of transactions allowed
 * @returns {number} Maximum profit with at most k transactions
 *
 * Time Complexity: O(n * k) - n days, k transactions
 * Space Complexity: O(k) - Array to track k transaction states
 */
const maxProfitKTransactions = (prices, k) => {
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
 * @param {number[]} prices - Array of stock prices for each day
 * @returns {number} Maximum profit with cooldown constraint
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
const maxProfitWithCooldown = (prices) => {
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
 * @param {number[]} prices - Array of stock prices for each day
 * @param {number} fee - Transaction fee for each buy or sell
 * @returns {number} Maximum profit after accounting for fees
 *
 * Time Complexity: O(n) - Single pass through array
 * Space Complexity: O(1) - Only using constant extra space
 */
const maxProfitWithFee = (prices, fee) => {
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

// ============================================================================
// EXPORTS
// ============================================================================
module.exports = {
  maxProfitOneTransaction,
  maxProfitOneTransactionTwoPointers,
  maxProfitUnlimited,
  maxProfitUnlimitedSimple,
  maxProfitTwoTransactions,
  maxProfitKTransactions,
  maxProfitWithCooldown,
  maxProfitWithFee,
};
