# GFE Blind 75 - Quick Revision Index

> Problems from [GreatFrontEnd Blind 75](https://www.greatfrontend.com/interviews/study/blind75) with pattern recognition, real-world applications, and key insights.

---

## 📚 Problem Index

| # | Problem | Pattern | Difficulty | Key Data Structure |
|---|---------|---------|------------|-------------------|
| 1 | [Balanced Brackets](#1-balanced-brackets) | Stack Matching | Easy | Stack |
| 2 | [Find Duplicates in Array](#2-find-duplicates-in-array) | HashSet Lookup | Easy | Set/Map |
| 3 | [Maximum Product Subarray](#3-maximum-product-subarray) | DP Min/Max Tracking | Medium | Variables |

---

## 1. Balanced Brackets

📁 **File:** [`balancedBrackets.ts`](./balancedBrackets.ts)  
🔗 **GFE Link:** [array-balanced-brackets](https://www.greatfrontend.com/interviews/study/blind75/questions/algo/balanced-brackets)  
📌 **Implementation:** [`../problems/easy/validParenthesis_STACK.ts`](../problems/easy/validParenthesis_STACK.ts)

### Pattern: Stack-based Matching

**When to use Stack:**
- Nested structures (HTML, code blocks, math expressions)
- LIFO matching - last opened = first closed
- Open/Close pairs that must match in order

### Key Insight
```
Think "Russian nesting dolls" - inner must close before outer
Stack naturally handles this with LIFO behavior
```

### Algorithm (3 steps)
1. Opening bracket → **push** to stack
2. Closing bracket → **pop** & check match
3. End → stack empty = valid

### Real-World Uses
- IDE bracket matching (VS Code, IntelliJ)
- HTML/XML tag validation
- JSON structure validation
- Compiler parsing

### Quick Test Cases
```typescript
"[]"     → true   |  "([)]"  → false
"([]){}" → true   |  "(]"    → false
```

---

## 2. Find Duplicates in Array

📁 **File:** [`findDuplicatesInArray.ts`](./findDuplicatesInArray.ts)  
🔗 **GFE Link:** [array-find-duplicate](https://www.greatfrontend.com/interviews/study/blind75/questions/algo/array-find-duplicate)  
📌 **Implementation:** [`../problems/HashMap/hashSetPatterns.ts`](../problems/HashMap/hashSetPatterns.ts) (containsDuplicate)

### Pattern: HashSet for O(1) Lookup

**When to use HashSet:**
- "Have I seen this before?" questions
- O(n²) nested loops → O(n) with Set
- Tracking seen/visited elements

### Key Insight
```
Trade SPACE for TIME
O(n) extra space enables O(1) lookups
Guest list at a party - check before adding
```

### Algorithm
```typescript
for each num:
  if seen.has(num) → return true (duplicate!)
  seen.add(num)
return false
```

### Approaches Comparison
| Approach | Time | Space | Modifies Input? |
|----------|------|-------|-----------------|
| HashSet | O(n) | O(n) | No |
| Sorting | O(n log n) | O(1) | Yes |

### Real-World Uses
- Unique username/email validation
- Duplicate transaction detection
- Deduplication in data processing

### Quick Test Cases
```typescript
[1,2,3,1] → true   |  [1,2,3,4] → false
```

---

## 3. Maximum Product Subarray

📁 **File:** [`maxProductSubarray.ts`](./maxProductSubarray.ts)  
🔗 **GFE Link:** [array-maximum-product-contiguous](https://www.greatfrontend.com/interviews/study/blind75/questions/algo/array-maximum-product-contiguous)  
📌 **Implementation:** [`../problems/DynamicProgramming/dpPatterns.ts`](../problems/DynamicProgramming/dpPatterns.ts) (maxProduct)

### Pattern: DP with Min/Max Tracking

**Why track BOTH min AND max?**
```
NEGATIVE × NEGATIVE = POSITIVE! 🔑

[-2, 3, -4]
At -4: min was -6, so -6 × -4 = 24 (new max!)
The villain became the hero!
```

### Key Insight
```
Unlike Kadane's (max sum), products can FLIP signs
Track both "hero" (max) and "villain" (min)
Villain can become hero with one negative!
```

### Algorithm
```typescript
for each num:
  newMax = max(num, maxSoFar * num, minSoFar * num)
  newMin = min(num, maxSoFar * num, minSoFar * num)
  result = max(result, newMax)
```

### Max Sum vs Max Product
| Aspect | Max Sum (Kadane) | Max Product |
|--------|------------------|-------------|
| Track | Just max | Both max AND min |
| Why? | Addition is linear | Neg × Neg = Pos |
| Reset when | currentSum < 0 | Element is 0 |

### Real-World Uses
- Compound investment returns
- Game combo multipliers
- Signal amplification stages

### Quick Test Cases
```typescript
[2,3,-2,4]    → 6   // [2,3]
[-2,3,-4]     → 24  // [-2,3,-4]
[1,2,0,-1,8,-4] → 32 // [-1,8,-4]
```

---

## 🎯 Pattern Cheat Sheet

| Pattern | Key Question | Data Structure | Time |
|---------|-------------|----------------|------|
| **Stack Matching** | "Do pairs match in order?" | Stack | O(n) |
| **HashSet Lookup** | "Have I seen this?" | Set/Map | O(n) |
| **DP Min/Max** | "Can negatives flip to positive?" | Variables | O(n) |

---

## 🧠 Quick Memory Aids

### Stack Pattern
> "Last In, First Out - like stacking plates"

### HashSet Pattern  
> "Guest list at a party - check before adding"

### Min/Max DP Pattern
> "Carry both hero AND villain - villain can become hero"

---

## 📝 Interview Tips

1. **Always clarify constraints first**
   - Can I modify the input?
   - What about empty arrays?
   - Are there negative numbers?

2. **Mention trade-offs**
   - HashSet: O(n) time, O(n) space
   - Sorting: O(n log n) time, O(1) space

3. **Start simple, then optimize**
   - Explain brute force first
   - Then show the optimized approach

---

## 🔗 Related LeetCode Problems

| Problem | Related To |
|---------|-----------|
| #20 Valid Parentheses | Balanced Brackets |
| #217 Contains Duplicate | Find Duplicates |
| #152 Maximum Product Subarray | Max Product |
| #53 Maximum Subarray | Max Product (sum version) |
| #1 Two Sum | HashSet pattern |

---

*Last updated: January 2026*
