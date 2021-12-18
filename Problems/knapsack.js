

const knapsack = (W, values, weights, n) => {
    // Base case: if Weight or n i.e. last element is reached
     if(W <=0 || n==0) {
         return 0;
     }

        // If weight of the nth item is
        // more than Knapsack capacity W,
        // then this item cannot be included
        // in the optimal solution
        if (weights[n - 1] > W)
            return knapSack(W, weights, values, n - 1);


     return Math.max(
         values[n-1] + knapsack(W-weights[n-1], values, weights, n-1),
         knapsack(W, values, weights, n-1)
     )
}