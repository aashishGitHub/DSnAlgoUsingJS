const bestTime = (arr) => {
    let leftP = 0;
    let rightP = 1;

    let maxProfit = 0;
    let current_max = 0;

    while (rightP < arr.length) {
        current_max = arr[rightp] - arr[leftP];
        maxProfit = Math.max(maxProfit, current_max);

        if (arr[leftP] > arr[rightP]) {
            leftP = rightP;
        }
        rightP += 1;
    }
    
    return maxProfit;
}
