# 🎯 Dynamic Programming Patterns - Quick Reference Cheat Sheet

*Mental models and templates for rapid problem recognition*

---

## 🔍 **Problem Recognition Guide**

### **Is This a DP Problem?**
Ask these questions:
- ✅ "Count the number of ways..." → DP
- ✅ "Find minimum/maximum..." → DP (if optimal substructure)
- ✅ "Is it possible to..." → DP (if overlapping subproblems)
- ✅ "What's the longest/shortest..." → DP
- ✅ Can I express solution in terms of smaller versions? → DP

---

## 📊 **1D Dynamic Programming Patterns**

### **Pattern 1: Linear DP (Fibonacci-like)**
**Mental Model**: Current state depends on 1-2 previous states

**Template:**
```typescript
function linearDP(n: number): number {
    if (n <= 1) return n;
    
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2; // or other relation
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

**Problems:**
- Climbing Stairs (LeetCode 70)
- Fibonacci Number (LeetCode 509)
- Min Cost Climbing Stairs (LeetCode 746)

**State Definition**: `dp[i]` = answer for subproblem of size `i`

---

### **Pattern 2: Choice-based DP (House Robber)**
**Mental Model**: At each step, make optimal choice between options

**Template:**
```typescript
function choiceDP(nums: number[]): number {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(
            prev1,              // Don't take current
            prev2 + nums[i]      // Take current
        );
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

**Problems:**
- House Robber (LeetCode 198)
- House Robber II (LeetCode 213)
- Maximum Subarray (Kadane's) (LeetCode 53)

**State Definition**: `dp[i]` = optimal answer up to index `i`

---

### **Pattern 3: Unbounded Choice (Coin Change)**
**Mental Model**: Can use each option multiple times, find minimum/maximum

**Template:**
```typescript
function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**Problems:**
- Coin Change (LeetCode 322)
- Coin Change 2 (LeetCode 518)
- Perfect Squares (LeetCode 279)

**State Definition**: `dp[i]` = minimum/maximum to achieve value `i`

---

### **Pattern 4: Subsequence DP (LIS)**
**Mental Model**: For each position, consider all previous positions

**Template:**
```typescript
function longestIncreasingSubsequence(nums: number[]): number {
    const dp = new Array(nums.length).fill(1);
    let maxLength = 1;
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}
```

**Problems:**
- Longest Increasing Subsequence (LeetCode 300)
- Longest Palindromic Subsequence (LeetCode 516)
- Russian Doll Envelopes (LeetCode 354)

**State Definition**: `dp[i]` = answer for subproblem ending at index `i`

---

### **Pattern 5: String DP (Word Break)**
**Mental Model**: Check if prefix can be broken, then check suffix

**Template:**
```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
    const wordSet = new Set(wordDict);
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length];
}
```

**Problems:**
- Word Break (LeetCode 139)
- Decode Ways (LeetCode 91)
- Palindrome Partitioning (LeetCode 131)

**State Definition**: `dp[i]` = answer for substring ending at index `i`

---

## 📐 **2D Dynamic Programming Patterns**

### **Pattern 6: Two Sequences (LCS)**
**Mental Model**: Compare two sequences, build table row by row

**Template:**
```typescript
function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
```

**Problems:**
- Longest Common Subsequence (LeetCode 1143)
- Longest Common Substring
- Edit Distance (LeetCode 72)
- Interleaving String (LeetCode 97)

**State Definition**: `dp[i][j]` = answer for first `i` chars of seq1 and first `j` chars of seq2

---

### **Pattern 7: Grid DP (Unique Paths)**
**Mental Model**: Can only move in certain directions, count paths

**Template:**
```typescript
function uniquePaths(m: number, n: number): number {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}
```

**Problems:**
- Unique Paths (LeetCode 62)
- Unique Paths II (LeetCode 63)
- Minimum Path Sum (LeetCode 64)
- Dungeon Game (LeetCode 174)

**State Definition**: `dp[i][j]` = answer for position `(i, j)`

---

### **Pattern 8: Interval DP**
**Mental Model**: Solve for intervals, combine results

**Template:**
```typescript
function intervalDP(arr: number[]): number {
    const n = arr.length;
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    // Length 1 intervals
    for (let i = 0; i < n; i++) {
        dp[i][i] = arr[i]; // or base case
    }
    
    // Length 2 to n
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            // Try all possible splits
            for (let k = i; k < j; k++) {
                dp[i][j] = Math.max(
                    dp[i][j],
                    dp[i][k] + dp[k + 1][j] + cost(i, k, j)
                );
            }
        }
    }
    
    return dp[0][n - 1];
}
```

**Problems:**
- Burst Balloons (LeetCode 312)
- Palindrome Partitioning II (LeetCode 132)
- Matrix Chain Multiplication

**State Definition**: `dp[i][j]` = answer for interval from `i` to `j`

---

## 🎯 **State Machine DP**

### **Pattern 9: State Transitions (Stock Problems)**
**Mental Model**: Track states and transitions between them

**Template:**
```typescript
function maxProfit(prices: number[]): number {
    let hold = -Infinity;  // State: holding stock
    let sold = 0;          // State: sold (not holding)
    
    for (const price of prices) {
        const prevHold = hold;
        const prevSold = sold;
        
        // Can hold by buying or keeping previous hold
        hold = Math.max(prevHold, prevSold - price);
        
        // Can sell by selling held stock
        sold = Math.max(prevSold, prevHold + price);
    }
    
    return sold;
}
```

**Problems:**
- Best Time to Buy/Sell Stock (LeetCode 121)
- Best Time to Buy/Sell Stock II (LeetCode 122)
- Best Time to Buy/Sell Stock with Cooldown (LeetCode 309)

**State Definition**: `dp[i][state]` = max profit at day `i` in `state`

---

## 🔄 **Top-Down (Memoization) Template**

```typescript
function dpMemoization(n: number, memo = new Map<number, number>()): number {
    // Base cases
    if (n <= 1) return n;
    
    // Check memo
    if (memo.has(n)) return memo.get(n)!;
    
    // Recurrence relation
    const result = dpMemoization(n - 1, memo) + dpMemoization(n - 2, memo);
    
    // Store in memo
    memo.set(n, result);
    return result;
}
```

**When to Use:**
- Natural recursive thinking
- Not all states needed
- Easier to understand initially

---

## ⬆️ **Bottom-Up (Tabulation) Template**

```typescript
function dpTabulation(n: number): number {
    // Base cases
    if (n <= 1) return n;
    
    // Initialize DP array
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill DP array
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]; // Recurrence relation
    }
    
    return dp[n];
}
```

**When to Use:**
- Need optimal space
- Avoid stack overflow
- Iterative preferred

---

## 🎨 **Space Optimization Patterns**

### **1D to Variables**
If `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`:
```typescript
// Instead of: const dp = new Array(n + 1);
let prev2 = 0, prev1 = 1;
for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
}
```

### **2D to 1D**
If `dp[i][j]` only depends on previous row:
```typescript
// Instead of: const dp = Array(m).fill(null).map(() => Array(n));
let prev = new Array(n).fill(0);
for (let i = 0; i < m; i++) {
    const curr = new Array(n).fill(0);
    // Fill curr using prev
    prev = curr;
}
```

### **2D to Variables**
If only need previous row and previous column:
```typescript
let prevRow = 0, prevCol = 0, prevDiag = 0;
// Update as you iterate
```

---

## 🧠 **Mental Model Decision Tree**

```
Is this a DP problem?
│
├─ Yes → What's the state?
│   │
│   ├─ Single variable (n, i) → 1D DP
│   │   ├─ Linear dependency → Pattern 1 (Fibonacci)
│   │   ├─ Choice-based → Pattern 2 (House Robber)
│   │   ├─ Unbounded choice → Pattern 3 (Coin Change)
│   │   └─ Subsequence → Pattern 4 (LIS)
│   │
│   ├─ Two variables (i, j) → 2D DP
│   │   ├─ Two sequences → Pattern 6 (LCS)
│   │   ├─ Grid movement → Pattern 7 (Unique Paths)
│   │   └─ Intervals → Pattern 8 (Burst Balloons)
│   │
│   └─ State machine → Pattern 9 (Stock Problems)
│
└─ No → Try other patterns (Greedy, Two Pointers, etc.)
```

---

## 📝 **Problem-Solving Checklist**

Before coding:
- [ ] Identify it's a DP problem
- [ ] Define the state (`dp[i]` or `dp[i][j]`)
- [ ] Identify base cases
- [ ] Write recurrence relation
- [ ] Choose top-down or bottom-up
- [ ] Consider space optimization
- [ ] Think about edge cases

While coding:
- [ ] Initialize base cases correctly
- [ ] Fill DP array in correct order
- [ ] Handle edge cases (empty, single element)
- [ ] Return correct final state

After coding:
- [ ] Verify time complexity: O(n) or O(n²) typically
- [ ] Verify space complexity
- [ ] Test with edge cases
- [ ] Consider space optimization if possible

---

## 🎯 **Quick Pattern Matching**

| Problem Type | Pattern | State | Recurrence |
|-------------|---------|-------|------------|
| Count ways to reach | Linear DP | `dp[i]` | `dp[i] = dp[i-1] + dp[i-2]` |
| Rob houses | Choice DP | `dp[i]` | `dp[i] = max(take, skip)` |
| Make change | Unbounded | `dp[i]` | `dp[i] = min(dp[i-coin]+1)` |
| Longest subsequence | Subsequence | `dp[i]` | `dp[i] = max(dp[j]+1)` |
| Compare strings | Two sequences | `dp[i][j]` | `match ? dp[i-1][j-1]+1 : max(...)` |
| Grid paths | Grid DP | `dp[i][j]` | `dp[i][j] = dp[i-1][j] + dp[i][j-1]` |
| Stock trading | State machine | `dp[i][state]` | State transitions |

---

## 💡 **Pro Tips**

1. **Start with brute force**: Understand the problem first
2. **Add memoization**: Convert recursive to memoized
3. **Convert to tabulation**: Iterative bottom-up
4. **Optimize space**: Reduce dimensions when possible
5. **Practice pattern recognition**: Speed comes with practice

---

## 🔗 **Your Current Progress**

You've already implemented:
- ✅ Climbing Stairs (Pattern 1)
- ✅ House Robber (Pattern 2)
- ✅ Coin Change (Pattern 3)
- ✅ Longest Increasing Subsequence (Pattern 4)
- ✅ Word Break (Pattern 5)
- ✅ Longest Common Subsequence (Pattern 6)
- ✅ Unique Paths (Pattern 7)
- ✅ Edit Distance (Pattern 6 variant)

**Next Steps:**
- Practice recognizing which pattern applies
- Work on space optimizations
- Try interval DP and state machine problems

---

*Keep this cheat sheet handy while practicing! 🚀*

