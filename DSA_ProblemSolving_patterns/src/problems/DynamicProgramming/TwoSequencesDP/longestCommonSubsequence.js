/**
 * Longest Common Subsequence
 *
 * Lcs("aab","azb"),
 *     1+lcs("aa", "az"),
 *         max (Lcs("a", "az"),              Lcs("aa", "a")
 *            max(Lcs("a", "a"), Lcs("", "z"))        1+ Lcs("a", ""))
 *                  1                                   1
 *
 *
 *
 *
 */

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

/**
 * VISUAL EXAMPLE: LCS("abc", "ac")
 *
 * Recurrence Relation:
 *   - If text1[i-1] === text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1  (diagonal + 1)
 *   - Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (max of left or top)
 *
 * Step-by-step DP table construction:
 *
 * Initial state (all zeros):
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   0   0
 *      b  0   0   0
 *      c  0   0   0
 *
 * After processing i=1, j=1 (text1[0]='a', text2[0]='a'):
 *   Match found! Use diagonal: dp[1][1] = dp[0][0] + 1 = 0 + 1 = 1
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   0  ← 'a' matches 'a'
 *      b  0   0   0
 *      c  0   0   0
 *
 * After processing i=1, j=2 (text1[0]='a', text2[1]='c'):
 *   No match. Use max(left, top): dp[1][2] = max(dp[0][2], dp[1][1]) = max(0, 1) = 1
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   1  ← max(0, 1)
 *      b  0   0   0
 *      c  0   0   0
 *
 * After processing i=2, j=1 (text1[1]='b', text2[0]='a'):
 *   No match. Use max(left, top): dp[2][1] = max(dp[1][1], dp[2][0]) = max(1, 0) = 1
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   1
 *      b  0   1   0  ← max(1, 0)
 *      c  0   0   0
 *
 * After processing i=2, j=2 (text1[1]='b', text2[1]='c'):
 *   No match. Use max(left, top): dp[2][2] = max(dp[1][2], dp[2][1]) = max(1, 1) = 1
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   1
 *      b  0   1   1  ← max(1, 1)
 *      c  0   0   0
 *
 * After processing i=3, j=1 (text1[2]='c', text2[0]='a'):
 *   No match. Use max(left, top): dp[3][1] = max(dp[2][1], dp[3][0]) = max(1, 0) = 1
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   1
 *      b  0   1   1
 *      c  0   1   0  ← max(1, 0)
 *
 * After processing i=3, j=2 (text1[2]='c', text2[1]='c'):
 *   Match found! Use diagonal: dp[3][2] = dp[2][1] + 1 = 1 + 1 = 2
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   1
 *      b  0   1   1
 *      c  0   1   2  ← 'c' matches 'c', diagonal + 1
 *
 * Final Answer: dp[3][2] = 2
 * LCS = "ac" (length 2)
 *
 *
 * TRACING BACK TO FIND THE ACTUAL LCS STRING:
 * Start from dp[m][n] and work backwards:
 *
 *   1. If text1[i-1] === text2[j-1]:
 *        → This character is part of LCS, add it to result
 *        → Move to dp[i-1][j-1] (diagonal)
 *
 *   2. Else if dp[i-1][j] > dp[i][j-1]:
 *        → Move to dp[i-1][j] (top)
 *
 *   3. Else:
 *        → Move to dp[i][j-1] (left)
 *
 * Example trace for LCS("abc", "ac"):
 *   Start at dp[3][2] = 2
 *   text1[2]='c' === text2[1]='c' → Add 'c', move to dp[2][1]
 *   text1[1]='b' !== text2[0]='a' → dp[1][1]=1 > dp[2][0]=0 → move to dp[1][1]
 *   text1[0]='a' === text2[0]='a' → Add 'a', move to dp[0][0]
 *   Reached base case → Result: "ac" (reversed, so reverse it: "ac")
 *
 *
 * COMPLEXITY:
 *   Time: O(m * n) where m = text1.length, n = text2.length
 *   Space: O(m * n) for the DP table
 *   Space Optimized: O(min(m, n)) by using only previous row
 *
 *
 * ====================================================================================
 * COMPARISON: TWO APPROACHES TO LCS
 * ====================================================================================
 *
 * Both approaches solve the same problem but differ in:
 *
 * 1. ITERATION DIRECTION:
 *    ┌─────────────────────────────────┬─────────────────────────────────┐
 *    │ Approach 1 (Backward)           │ Approach 2 (Forward)            │
 *    ├─────────────────────────────────┼─────────────────────────────────┤
 *    │ for (i = m-1; i >= 0; i--)      │ for (i = 1; i <= m; i++)        │
 *    │   for (j = n-1; j >= 0; j--)    │   for (j = 1; j <= n; j++)      │
 *    │                                 │                                 │
 *    │ Start from END, go to START    │ Start from START, go to END     │
 *    │ Answer at: lcs[0][0]            │ Answer at: lcs[m][n]            │
 *    └─────────────────────────────────┴─────────────────────────────────┘
 *
 * 2. CELL REFERENCES:
 *    ┌─────────────────────────────────┬─────────────────────────────────┐
 *    │ Approach 1 (Backward)           │ Approach 2 (Forward)            │
 *    ├─────────────────────────────────┼─────────────────────────────────┤
 *    │ Match: lcs[i+1][j+1]            │ Match: lcs[i-1][j-1]            │
 *    │      (looks FORWARD/down-right) │      (looks BACKWARD/up-left)   │
 *    │                                 │                                 │
 *    │ No match: max(lcs[i+1][j],      │ No match: max(lcs[i-1][j],      │
 *    │              lcs[i][j+1])       │              lcs[i][j-1])       │
 *    │      (looks FORWARD)            │      (looks BACKWARD)           │
 *    └─────────────────────────────────┴─────────────────────────────────┘
 *
 * 3. INDEX USAGE:
 *    ┌─────────────────────────────────┬─────────────────────────────────┐
 *    │ Approach 1 (Backward)          │ Approach 2 (Forward)            │
 *    ├─────────────────────────────────┼─────────────────────────────────┤
 *    │ text1[i], text2[j]             │ text1[i-1], text2[j-1]          │
 *    │ (direct indices, 0-based)       │ (offset indices, 1-based table) │
 *    │                                 │                                 │
 *    │ DP table: 0 to m (inclusive)   │ DP table: 0 to m (inclusive)    │
 *    │ Uses: indices 0 to m-1        │ Uses: indices 1 to m            │
 *    └─────────────────────────────────┴─────────────────────────────────┘
 *
 * 4. MENTAL MODEL:
 *    ┌─────────────────────────────────┬─────────────────────────────────┐
 *    │ Approach 1 (Backward)          │ Approach 2 (Forward)            │
 *    ├─────────────────────────────────┼─────────────────────────────────┤
 *    │ "What LCS can I build           │ "What LCS have I built          │
 *    │  STARTING from position i,j?"  │  UP TO position i,j?"            │
 *    │                                 │                                 │
 *    │ Looks ahead to future           │ Looks back to past              │
 *    │ subproblems                     │ subproblems                     │
 *    └─────────────────────────────────┴─────────────────────────────────┘
 *
 * 5. VISUAL COMPARISON for LCS("abc", "ac"):
 *
 *    Approach 1 (Backward) - Fills from bottom-right to top-left:
 *        ""  a   c
 *     ""  ?   ?   ?
 *      a  ?   ?   ?
 *      b  ?   ?   ?
 *      c  ?   ?   2  ← Start filling here
 *                  ↑
 *              Fill upward
 *
 *    Approach 2 (Forward) - Fills from top-left to bottom-right:
 *        ""  a   c
 *     ""  0   0   0
 *      a  0   1   ?  ← Start filling here
 *      b  ?   ?   ?
 *      c  ?   ?   ?
 *      ↑
 *   Fill downward
 *
 * 6. WHEN TO USE WHICH:
 *    ┌─────────────────────────────────┬─────────────────────────────────┐
 *    │ Approach 1 (Backward)          │ Approach 2 (Forward)            │
 *    ├─────────────────────────────────┼─────────────────────────────────┤
 *    │ ✅ Less common                  │ ✅ MORE COMMON (standard)       │
 *    │ ✅ Good for recursive thinking  │ ✅ Easier to understand          │
 *    │ ✅ Natural for some problems   │ ✅ Standard DP pattern          │
 *    │ ❌ Harder to reconstruct LCS    │ ✅ Easy to reconstruct LCS       │
 *    │ ❌ Less intuitive               │ ✅ More intuitive               │
 *    └─────────────────────────────────┴─────────────────────────────────┘
 *
 * 7. RECOMMENDATION:
 *    Use Approach 2 (Forward) for:
 *    - Learning and understanding
 *    - Interview preparation
 *    - When you need to reconstruct the actual LCS string
 *    - Most standard DP problems
 *
 *    Approach 1 (Backward) is mathematically equivalent but less intuitive.
 *    Both produce the same result, but Approach 2 is the industry standard.
 */

/**
 * APPROACH 1: Backward Iteration (Bottom-Up from End)
 *
 * Key Characteristics:
 * - Iterates from END to START: i = m-1 down to 0, j = n-1 down to 0
 * - Uses DIRECT indices: text1[i], text2[j] (no offset)
 * - References FUTURE cells: lcs[i+1][j+1], lcs[i+1][j], lcs[i][j+1]
 * - Returns: Only the length (lcs[0][0])
 *
 * Mental Model: "What's the LCS starting from position i,j?"
 * - We look AHEAD to see what LCS we can build from remaining characters
 * - Base case is at the END (all zeros), answer is at START (lcs[0][0])
 *
 * Example for LCS("abc", "ac"):
 *   lcs[2][1] = 1 + lcs[3][2]  ← looks forward to lcs[3][2]
 *   lcs[0][0] = final answer
 */



// NOT MY MIND
const longestCommonSubsequenceLength = (text1, text2) => {
  let m = text1.length;
  let n = text2.length;
  // lcs is 2D array of 1 extra item length, so that we add 0 to the end item in code
  // all with 0 as default
  const lcs = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

  // fill the 2D matrix if there is a match
  // strt from m-1 as mth item means extra 0 item
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] == text2[j]) {
        lcs[i][j] = 1 + lcs[i + 1][j + 1]; // Look forward (down-right)
      } else {
        // If no match is found, we take the max that can be obtained from either side?
        // this represents a solution from rest of sequences
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]); // Look forward (down or right)
      }
    }
  }

  return lcs[0][0];
};

/**
 * APPROACH 2: Forward Iteration (Bottom-Up from Start)
 *
 * Key Characteristics:
 * - Iterates from START to END: i = 1 to m, j = 1 to n
 * - Uses OFFSET indices: text1[i-1], text2[j-1] (1-based DP table, 0-based strings)
 * - References PAST cells: lcs[i-1][j-1], lcs[i-1][j], lcs[i][j-1]
 * - Returns: The entire DP table (for reconstruction)
 *
 * Mental Model: "What's the LCS up to position i,j?"
 * - We look BACK to see what LCS we've built so far
 * - Base case is at START (first row/column zeros), answer is at END (lcs[m][n])
 *
 * Example for LCS("abc", "ac"):
 *   lcs[1][1] = lcs[0][0] + 1  ← looks back to lcs[0][0]
 *   lcs[3][2] = final answer
 *
 * This is the MORE COMMON approach because:
 * - Easier to understand (build up from base cases)
 * - Standard DP pattern (fill table left-to-right, top-to-bottom)
 * - Allows easy reconstruction of the actual LCS string
 */
const longestCommonSubsequence = (text1, text2) => {
  let m = text1.length;
  let n = text2.length;

  const lcs = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0)); // first fill can be empty with no bad effects
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; ++j) {
      if (text1[i - 1] == text2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1; // Look back (diagonal up-left)
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]); // Look back (up or left)
      }
    }
  }
  return lcs;
};

/**
 * Helper function to reconstruct the actual LCS string by tracing back through the DP table
 * @param {string} text1 - First string
 * @param {string} text2 - Second string
 * @param {number[][]} dp - The DP table from longestCommonSubsequence()
 * @returns {string} - The actual longest common subsequence string
 *
 * Example:
 *   const dp = longestCommonSubsequence("abc", "ac");
 *   const lcsString = reconstructLCS("abc", "ac", dp);
 *   console.log(lcsString); // "ac"
 */
const reconstructLCS = (text1, text2, dp) => {
  let i = text1.length;
  let j = text2.length;
  const result = [];

  // Trace back from dp[m][n] to dp[0][0]
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      // Characters match - this is part of LCS
      result.unshift(text1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      // Move to the cell with larger value (top)
      i--;
    } else {
      // Move to the cell with larger value (left)
      j--;
    }
  }

  return result.join("");
};

// Example usage and testing
let text1 = "abc";
let text2 = "ac";

console.log("Example 1: LCS('abc', 'ac')");
console.log("Expected length: 2, Expected string: 'ac'");
const length1 = longestCommonSubsequenceLength(text1, text2);
const dp1 = longestCommonSubsequence(text1, text2);
const lcsString1 = reconstructLCS(text1, text2, dp1);
console.log(`Length: ${length1}`);
console.log(`LCS String: ${lcsString1}`);
console.log("DP Table:");
console.log(dp1);
console.log("\n");

// More complex example
text1 = "bdacb";
text2 = "abcdab";

console.log("Example 2: LCS('bdacb', 'abcdab')");
const length2 = longestCommonSubsequenceLength(text1, text2);
const dp2 = longestCommonSubsequence(text1, text2);
const lcsString2 = reconstructLCS(text1, text2, dp2);
console.log(`Length: ${length2}`);
console.log(`LCS String: ${lcsString2}`);
console.log("DP Table:");
console.log(dp2);
