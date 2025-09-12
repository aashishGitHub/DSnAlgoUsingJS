// https://www.youtube.com/watch?v=Ua0GhsJSlWM
/*
We see that if an item is found, we can count 1+ to the longestCommonSubsequenceLength and look at the remaining subsequence
as independent sub problem
this is why it is a DP

SO, when we encounter a match, we update the diagonal item in the matrix to +1. 
    If this do not match, we need to look if any other emement in either of the subsequence have a match? i.e look on right and bottom



Dynamic P 2D
Bottom Up


*/

const longestCommonSubsequenceLength = (text1, text2) => {
  let m = text1.length
  let n = text2.length
  // lcs is 2D array of 1 extra item length, so that we add 0 to the end item in code 
  // all with 0 as default
  const lcs = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

  // fill the 2D matrix if there is a match
  // strt from m-1 as mth item means extra 0 item 
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {

      if (text1[i] == text2[j]) {

        lcs[i][j] = 1 + lcs[i + 1][j + 1];
      } else {
        // If no match is found, we take the max that can be obtained from either side? 
        // this represents a solution from rest of sequences
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1])
      }
    }
  }

  return lcs[0][0];
}


const longestCommonSubsequence = (text1, text2) => {
  let m = text1.length;
  let n = text2.length;

  const lcs = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; ++j) {
      if (text1[i - 1] == text2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }
  return lcs;
};

let text1 = "bdacb";
let text2 = "abcdab";

let res = longestCommonSubsequence(text1, text2);
console.log(res);
