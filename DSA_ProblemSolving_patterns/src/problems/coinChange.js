/***
 * optimal substructure.s.On
 * Optimal structure means that the optimal solution of the problem at hand could be achieved by 
 * leveraging the optimal solutions of its subproblems and overlapping sub-problems
 * 
 *  It also satisfies the property of overlapping sub problems, meaning previously solved sub problem results can be used multiple times.
 * 
 */
let coinChange = (amount, coins, dp) => {
  if (amount === 0 || coins.length === 0) {
    return -1;
  }
  let totalNumberOfCoinsRequired = amount;

    for (let i = 0; i < coins.length; i++) {
      let numberOfCoinsRequiredWHileTakingThisCoin = 0;

      let coin = coins[i];

      if (amount - coin >= 0) {

        if (dp[amount - coin] === -1) {
          numberOfCoinsRequiredWHileTakingThisCoin = coinChange(
            amount - coin,
            coins,
            dp
          );
        } else {
          numberOfCoinsRequiredWHileTakingThisCoin = dp[amount - coin];
        }

        if (
          numberOfCoinsRequiredWHileTakingThisCoin >= 0 &&
          1 + numberOfCoinsRequiredWHileTakingThisCoin <=
          totalNumberOfCoinsRequired
        ) {
          totalNumberOfCoinsRequired =
            numberOfCoinsRequiredWHileTakingThisCoin + 1;

        }

      }
    }

  dp[amount] = totalNumberOfCoinsRequired;
  return totalNumberOfCoinsRequired;
};

let amount = 17;
let coins = [1, 2, 5, 7];
let dp = new Array(amount).fill(-1);
let result = coinChange(amount, coins, dp);
console.log(result);
