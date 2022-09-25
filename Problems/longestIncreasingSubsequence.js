
////////////////////////////////////////////////////////////////////////////////////////////////

const longestIncreasingSubsequence = function (arr) {
  if (!arr || arr.length === 0) {
    return 0;
  }
  let maxL = 1;
  let L = new Array(arr.length).fill(1);

  for (let i = 0; i < arr.length; i++) {
    let tempLi = L[i];
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && L[i] + L[j] > tempLi) {
        tempLi = L[i] + L[j];
      }
    }
    L[i] = tempLi;
    maxL = Math.max(maxL, L[i]);
  }
  return maxL;
};

let input = [20, 5, 4, 12, 25, 40, 35, 50];
let result = longestIncreasingSubsequence(input);
console.log(result);

////////////////////////////////////////////////////////////////////////////////////////////////


