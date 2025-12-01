# 📚 Suggested Problems for Two Sequences DP Pattern

*Additional problems to practice this pattern*

---

## 🎯 **Recommended Practice Order**

### **Level 1: Foundation (Master These First)**
1. ✅ **Longest Common Subsequence** (LeetCode 1143) - *You have this!*
   - The foundation problem for this pattern
   - Understand the recurrence: match → diagonal+1, no match → max(left, top)

2. ✅ **Edit Distance** (LeetCode 72) - *You have this!*
   - Similar to LCS but with three operations
   - Recurrence: match → diagonal, no match → 1 + min(delete, insert, replace)

3. ✅ **Delete Operation for Two Strings** (LeetCode 583) - *You have this!*
   - Can be solved using LCS insight
   - Alternative: direct DP approach

4. ✅ **Interleaving String** (LeetCode 97) - *You have this!*
   - Boolean DP instead of numeric
   - Recurrence: OR of two possibilities

---

### **Level 2: Intermediate (Next Steps)**

5. **Minimum ASCII Delete Sum for Two Strings** (LeetCode 712)
   - **Difficulty**: Medium ⭐⭐⭐
   - **Link**: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/
   - **Pattern**: Similar to Delete Operation but with ASCII values
   - **Hint**: Instead of counting deletions, sum ASCII values of deleted characters
   - **Recurrence**: 
     ```typescript
     if (s1[i-1] === s2[j-1]) {
         dp[i][j] = dp[i-1][j-1];
     } else {
         dp[i][j] = min(
             s1[i-1].charCodeAt(0) + dp[i-1][j],  // Delete from s1
             s2[j-1].charCodeAt(0) + dp[i][j-1]   // Delete from s2
         );
     }
     ```

6. **Longest Common Substring**
   - **Difficulty**: Medium ⭐⭐
   - **Note**: Different from LCS - must be **contiguous**!
   - **Pattern**: Similar structure but different recurrence
   - **Recurrence**:
     ```typescript
     if (s1[i-1] === s2[j-1]) {
         dp[i][j] = dp[i-1][j-1] + 1;  // Extend substring
     } else {
         dp[i][j] = 0;  // Reset - not contiguous
     }
     ```
   - **Answer**: max of all dp[i][j] values (not just dp[m][n])

7. **Uncrossed Lines** (LeetCode 1035)
   - **Difficulty**: Medium ⭐⭐⭐
   - **Link**: https://leetcode.com/problems/uncrossed-lines/
   - **Pattern**: This is **LCS in disguise**!
   - **Insight**: Connecting lines without crossing = finding common subsequence
   - **Solution**: Use exact LCS algorithm

---

### **Level 3: Advanced (Challenge Yourself)**

8. **Distinct Subsequences** (LeetCode 115)
   - **Difficulty**: Hard ⭐⭐⭐⭐
   - **Link**: https://leetcode.com/problems/distinct-subsequences/
   - **Pattern**: Count distinct subsequences of s that equal t
   - **Key Difference**: Counting instead of finding maximum
   - **Recurrence**:
     ```typescript
     if (s[i-1] === t[j-1]) {
         dp[i][j] = dp[i-1][j-1] + dp[i-1][j];  // Use + don't use
     } else {
         dp[i][j] = dp[i-1][j];  // Can't use current char
     }
     ```

9. **Regular Expression Matching** (LeetCode 10)
   - **Difficulty**: Hard ⭐⭐⭐⭐
   - **Link**: https://leetcode.com/problems/regular-expression-matching/
   - **Pattern**: Two sequences with special characters (* and .)
   - **Complexity**: More complex base cases and recurrence
   - **Special Cases**: 
     - `.` matches any character
     - `*` matches zero or more of preceding character

10. **Wildcard Matching** (LeetCode 44)
    - **Difficulty**: Hard ⭐⭐⭐⭐
    - **Link**: https://leetcode.com/problems/wildcard-matching/
    - **Pattern**: Similar to regex but simpler
    - **Special Characters**: `?` (matches any single char), `*` (matches any sequence)

---

## 🎓 **Learning Path**

### **Week 1: Foundation**
- ✅ Master LCS (you already have it!)
- ✅ Master Edit Distance
- ✅ Solve Delete Operation
- ✅ Solve Interleaving String

### **Week 2: Intermediate**
- Solve Minimum ASCII Delete Sum
- Solve Longest Common Substring
- Solve Uncrossed Lines

### **Week 3: Advanced**
- Attempt Distinct Subsequences
- Study Regular Expression Matching
- Practice Wildcard Matching

---

## 💡 **Problem-Specific Tips**

### **Minimum ASCII Delete Sum**
- Think of it as "weighted Delete Operation"
- Instead of counting deletions, sum ASCII values
- Base cases: sum of all ASCII values for empty string conversion

### **Longest Common Substring**
- **Critical Difference**: Must be contiguous!
- Reset to 0 when characters don't match
- Track maximum during iteration (not just final cell)

### **Uncrossed Lines**
- **Key Insight**: This is exactly LCS!
- Visualize: lines can't cross = characters must be in same order
- No need to modify LCS algorithm at all

### **Distinct Subsequences**
- Counting problem, not optimization
- When characters match: can use it OR skip it (sum both)
- When no match: must skip (only one option)

### **Regular Expression Matching**
- Handle `*` carefully: can match 0 or more
- Recurrence for `*`: 
  ```typescript
  if (pattern[j-1] === '*') {
      dp[i][j] = dp[i][j-2] ||  // Match 0 times
                 (match && dp[i-1][j]);  // Match 1+ times
  }
  ```

---

## 📊 **Quick Reference: Which Problem Uses Which Pattern?**

| Problem | Match Case | No Match Case | Special Notes |
|---------|------------|---------------|---------------|
| **LCS** | `dp[i-1][j-1] + 1` | `max(dp[i-1][j], dp[i][j-1])` | Standard pattern |
| **Edit Distance** | `dp[i-1][j-1]` | `1 + min(delete, insert, replace)` | Three operations |
| **Delete Operation** | `dp[i-1][j-1]` | `1 + min(dp[i-1][j], dp[i][j-1])` | Two operations |
| **ASCII Delete Sum** | `dp[i-1][j-1]` | `min(ascii + dp[i-1][j], ascii + dp[i][j-1])` | Weighted |
| **Interleaving** | `(dp[i-1][j] && match) \|\| (dp[i][j-1] && match)` | `false` | Boolean DP |
| **Common Substring** | `dp[i-1][j-1] + 1` | `0` | Reset on mismatch |
| **Uncrossed Lines** | `dp[i-1][j-1] + 1` | `max(dp[i-1][j], dp[i][j-1])` | Same as LCS! |
| **Distinct Subseq** | `dp[i-1][j-1] + dp[i-1][j]` | `dp[i-1][j]` | Counting, not max |

---

## 🔗 **Related Resources**

- **LeetCode Tags**: Search "Dynamic Programming" + "String"
- **NeetCode**: Two Sequences DP playlist
- **Educative.io**: Grokking Dynamic Programming Patterns
- **Your Files**: Check `DP_Patterns_Cheat_Sheet.md` for templates

---

## ✅ **Progress Tracker**

Mark problems as you complete them:

- [x] Longest Common Subsequence
- [x] Edit Distance  
- [x] Delete Operation for Two Strings
- [x] Interleaving String
- [ ] Minimum ASCII Delete Sum
- [ ] Longest Common Substring
- [ ] Uncrossed Lines
- [ ] Distinct Subsequences
- [ ] Regular Expression Matching
- [ ] Wildcard Matching

---

*Happy coding! 🚀*



