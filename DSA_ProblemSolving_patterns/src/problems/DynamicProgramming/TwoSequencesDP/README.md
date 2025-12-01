# 🔗 Two Sequences Dynamic Programming Pattern

*Problems involving comparing or matching two sequences (strings/arrays) using 2D DP*

---

## 📋 **Pattern Overview**

This pattern is used when you need to:
- Compare two sequences (strings, arrays)
- Find relationships between two sequences
- Transform one sequence into another
- Find common elements/patterns between sequences

**Key Characteristics:**
- 2D DP table: `dp[i][j]` = answer for first `i` elements of seq1 and first `j` elements of seq2
- Recurrence typically involves: diagonal (match), left, top
- Time: O(m × n), Space: O(m × n) [can optimize to O(min(m, n))]

---

## 🎯 **Problem List**

### **✅ Implemented**

1. **Longest Common Subsequence (LCS)** - LeetCode 1143
   - Find longest subsequence common to both strings
   - File: `longestCommonSubsequence.ts`

2. **Edit Distance (Levenshtein Distance)** - LeetCode 72
   - Minimum operations to convert word1 to word2 (insert/delete/replace)
   - File: `editDistance.ts`

### **📝 To Implement**

3. **Interleaving String** - LeetCode 97
   - Check if s3 is formed by interleaving s1 and s2
   - Difficulty: Medium ⭐⭐⭐

4. **Delete Operation for Two Strings** - LeetCode 583
   - Minimum deletions to make both strings equal
   - Difficulty: Medium ⭐⭐⭐
   - *Hint: Uses LCS pattern!*

5. **Minimum ASCII Delete Sum for Two Strings** - LeetCode 712
   - Minimum ASCII sum of deleted characters to make strings equal
   - Difficulty: Medium ⭐⭐⭐
   - *Hint: Similar to Delete Operation but with ASCII values*

6. **Longest Common Substring**
   - Find longest contiguous common substring
   - Difficulty: Medium ⭐⭐
   - *Note: Different from LCS - must be contiguous!*

7. **Uncrossed Lines** - LeetCode 1035
   - Maximum number of uncrossed connecting lines between two arrays
   - Difficulty: Medium ⭐⭐⭐
   - *Hint: This is LCS in disguise!*

8. **Regular Expression Matching** - LeetCode 10
   - Match pattern with wildcards (* and .)
   - Difficulty: Hard ⭐⭐⭐⭐
   - *Note: More complex but uses two-sequence DP*

9. **Wildcard Matching** - LeetCode 44
   - Match pattern with wildcards (? and *)
   - Difficulty: Hard ⭐⭐⭐⭐

10. **Distinct Subsequences** - LeetCode 115
    - Count distinct subsequences of s that equal t
    - Difficulty: Hard ⭐⭐⭐⭐

---

## 🧠 **Mental Model**

### **State Definition**
```
dp[i][j] = answer for:
  - First i characters/elements of sequence 1
  - First j characters/elements of sequence 2
```

### **Common Recurrence Patterns**

#### **Pattern 1: Match or Skip (LCS, Edit Distance)**
```typescript
if (seq1[i-1] === seq2[j-1]) {
    dp[i][j] = dp[i-1][j-1] + cost;  // Match: use diagonal
} else {
    dp[i][j] = min/max(
        dp[i-1][j],      // Skip from seq1
        dp[i][j-1],      // Skip from seq2
        dp[i-1][j-1]     // Replace/transform
    );
}
```

#### **Pattern 2: Choice-based (Interleaving)**
```typescript
dp[i][j] = (dp[i-1][j] && seq1[i-1] === target[k]) ||
           (dp[i][j-1] && seq2[j-1] === target[k]);
```

---

## 📊 **Problem Comparison Table**

| Problem | DP State | Match Case | No Match Case | Complexity |
|---------|----------|------------|---------------|------------|
| **LCS** | Length of LCS | `dp[i-1][j-1] + 1` | `max(dp[i-1][j], dp[i][j-1])` | O(m×n) |
| **Edit Distance** | Min operations | `dp[i-1][j-1]` | `1 + min(delete, insert, replace)` | O(m×n) |
| **Delete Operation** | Min deletions | `dp[i-1][j-1]` | `1 + min(dp[i-1][j], dp[i][j-1])` | O(m×n) |
| **ASCII Delete Sum** | Min ASCII sum | `dp[i-1][j-1]` | `min(ascii + dp[i-1][j], ascii + dp[i][j-1])` | O(m×n) |
| **Interleaving** | Can form? | `(dp[i-1][j] && match) \|\| (dp[i][j-1] && match)` | `false` | O(m×n) |
| **Uncrossed Lines** | Max lines | `dp[i-1][j-1] + 1` | `max(dp[i-1][j], dp[i][j-1])` | O(m×n) |

---

## 🎓 **Learning Order**

### **Beginner (Start Here)**
1. ✅ Longest Common Subsequence
2. ✅ Edit Distance
3. Longest Common Substring

### **Intermediate**
4. Delete Operation for Two Strings
5. Minimum ASCII Delete Sum
6. Uncrossed Lines

### **Advanced**
7. Interleaving String
8. Distinct Subsequences
9. Regular Expression Matching
10. Wildcard Matching

---

## 💡 **Key Insights**

1. **LCS is the foundation** - Many problems are variations of LCS
2. **Base cases matter** - First row/column initialization is crucial
3. **Match vs No Match** - The recurrence differs based on whether characters match
4. **Space optimization** - Can reduce to O(min(m, n)) by using only previous row
5. **Reconstruction** - Can trace back to find actual solution, not just the value

---

## 🔗 **Related Patterns**

- **1D DP**: Longest Increasing Subsequence (similar but 1D)
- **String DP**: Palindrome problems, Word Break
- **Grid DP**: Unique Paths (similar 2D structure)

---

## 📚 **Resources**

- [NeetCode - Two Sequences DP](https://www.youtube.com/playlist?list=PLot-Xpze53leF0FeHz2X0aG3zd0mr1AW_)
- [Educative.io - Grokking DP Patterns](https://www.educative.io/courses/grokking-dynamic-programming-patterns-for-coding-interviews)
- LeetCode: Search "Two Sequences" or "2D DP"

---

*Last Updated: 2024*



