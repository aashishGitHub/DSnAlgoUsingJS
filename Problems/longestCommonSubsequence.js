const longestCommonSubsequence = (text1, text2) => {
    let m = text1.length;
    let n = text2.length;
  
    const lcs = new Array(m+1).fill(0).map(() => new Array(n+1).fill(0));
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
  