/**
 * ============================================================================
 * STACK PATTERNS (LeetCode 155, 150, 739, 496, 503, 84, 22, 394)
 * ============================================================================
 *
 * PATTERN:
 * - A stack answers "what is the most recent thing still waiting?" Whenever the
 *   ANSWER TO AN ITEM DEPENDS ON SOMETHING LATER, park the item on a stack and
 *   resolve it when that something arrives. That single sentence covers
 *   matching brackets, nested decoding, and every monotonic-stack problem here.
 *
 * ============================================================================
 * THE MONOTONIC STACK — the idea most of this file is about
 * ============================================================================
 * A monotonic stack keeps its contents sorted (increasing or decreasing) by
 * POPPING anything that would break the order before pushing.
 *
 * The brute force for "next greater element" scans forward from every index:
 * O(n²). Name the waste: when scanning from index i we re-examine elements that
 * an earlier scan already rejected, and we relearn the same facts.
 *
 * The fix: walk once, keeping a stack of indices still WAITING for their
 * answer, kept in decreasing value order. A new value taller than the stack top
 * is precisely the "next greater element" for that top — so pop and resolve it.
 * Anything the new value cannot resolve stays waiting.
 *
 * THE AMORTIZATION ARGUMENT (say this out loud — it is the whole complexity
 * discussion): the inner while-loop looks like it makes this O(n²), but each
 * index is PUSHED once and POPPED at most once across the entire run. Total
 * work is therefore 2n operations → O(n).
 *
 *   Which direction? Ask what a new element should DESTROY:
 *     next GREATER  → pop while stack top is SMALLER  (decreasing stack)
 *     next SMALLER  → pop while stack top is LARGER   (increasing stack)
 *
 * RECOGNITION CUES:
 * - "next greater / warmer / smaller element"        → monotonic stack
 * - "largest rectangle / trapped water / span"       → monotonic stack
 * - "valid / balanced / matching brackets"           → plain stack
 * - "nested encoding, innermost first"               → stack of contexts
 * - "get the min/max in O(1) alongside push/pop"     → a second, parallel stack
 * - "postfix / reverse polish"                       → operand stack
 *
 * REAL-WORLD ANALOGIES:
 * - Undo history and browser back-stacks.
 * - Call stacks and nested JSON/XML parsing.
 * - Stock span analysis: "how many days until a higher price?" (LC739's shape).
 *
 * COMPLEXITY SUMMARY (n = input size):
 *   MinStack ops               Time O(1) each     Space O(n)
 *   evalRPN                    Time O(n)          Space O(n)
 *   dailyTemperatures          Time O(n)          Space O(n)
 *   nextGreaterElement         Time O(n + m)      Space O(n)
 *   largestRectangleArea       Time O(n)          Space O(n)
 *   generateParenthesis        Time O(4ⁿ/√n)      Space O(n)
 *   decodeString               Time O(output)     Space O(depth)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * MIN STACK (LeetCode 155) — push/pop/top/getMin, all O(1)
 * ----------------------------------------------------------------------------
 * THE TRAP: keeping a single `min` variable breaks on POP. If the minimum is
 * popped off, there is no way to recover the previous minimum without scanning
 * the whole stack — which makes getMin O(n).
 *
 * THE FIX: a SECOND stack holding the minimum "as of" each depth. Because it is
 * pushed and popped in lockstep with the main stack, its top is always the
 * minimum of exactly the elements currently present. History is preserved
 * because every level remembers its own answer.
 *
 * DRY-RUN — push -2, push 0, push -3, getMin, pop, top, getMin:
 *   push -2 → stack [-2]        mins [-2]
 *   push  0 → stack [-2, 0]     mins [-2, -2]   (0 is not smaller; repeat -2)
 *   push -3 → stack [-2, 0, -3] mins [-2, -2, -3]
 *   getMin  → mins top          = -3 ✓
 *   pop     → stack [-2, 0]     mins [-2, -2]   ← -3 leaves BOTH stacks
 *   top     → 0 ✓
 *   getMin  → mins top          = -2 ✓  the old minimum is back, no rescan
 *
 * SPACE FOLLOW-UP: pushing the min only when it ties-or-beats the current one
 * saves space, but then pop must compare before popping the min stack. Mention
 * it; the lockstep version is harder to get wrong under time pressure.
 *
 * @example
 * const s = new MinStack();
 * s.push(-2); s.push(0); s.push(-3);
 * s.getMin(); // -3
 * s.pop();
 * s.top();    // 0
 * s.getMin(); // -2
 *
 * Time: O(1) for every operation. Space: O(n).
 */
export class MinStack {
  private stack: number[] = [];
  private mins: number[] = []; // mins[i] = minimum of stack[0..i]

  push(val: number): void {
    this.stack.push(val);
    // Carry the previous minimum forward when the new value is not smaller.
    const currentMin = this.mins.length === 0 ? val : Math.min(val, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);
  }

  pop(): void {
    this.stack.pop();
    this.mins.pop(); // lockstep — this is what restores the earlier minimum
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.mins[this.mins.length - 1];
  }
}

/**
 * ----------------------------------------------------------------------------
 * EVALUATE REVERSE POLISH NOTATION (LeetCode 150)
 * ----------------------------------------------------------------------------
 * Postfix notation needs no parentheses and no precedence rules, which is
 * exactly why compilers and calculators use it internally.
 *
 * THE RULE: numbers get pushed; an operator pops the TWO most recent operands,
 * combines them, and pushes the result back. The stack always holds the
 * operands still waiting for an operator.
 *
 * ⚠️ ORDER MATTERS for '-' and '/': the SECOND value popped is the LEFT
 * operand. Writing `a - b` after popping a then b computes the answer backwards
 * — the most common bug in this problem.
 *
 * ⚠️ JS DIVISION: the problem truncates toward zero, but JS `/` yields floats
 * and `Math.floor(-7/2)` gives -4 instead of -3. `Math.trunc` is correct.
 *
 * DRY-RUN on ["2", "1", "+", "3", "*"]:
 *   "2" → [2]
 *   "1" → [2, 1]
 *   "+" → pop 1 then 2 → 2 + 1 = 3 → [3]
 *   "3" → [3, 3]
 *   "*" → pop 3 then 3 → 3 * 3 = 9 → [9]
 *   → 9  ✨   (equivalent to (2 + 1) * 3)
 *
 * @example
 * evalRPN(["2", "1", "+", "3", "*"]);      // 9
 * evalRPN(["4", "13", "5", "/", "+"]);     // 6
 *
 * Time: O(n). Space: O(n).
 */
export function evalRPN(tokens: string[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const right = stack.pop()!; // popped FIRST, so it is the RIGHT operand
      const left = stack.pop()!;

      if (token === "+") stack.push(left + right);
      else if (token === "-") stack.push(left - right);
      else if (token === "*") stack.push(left * right);
      else stack.push(Math.trunc(left / right)); // trunc, not floor: -7/2 → -3
    } else {
      stack.push(Number(token));
    }
  }

  return stack[0];
}

/**
 * ----------------------------------------------------------------------------
 * DAILY TEMPERATURES (LeetCode 739) ★ THE MONOTONIC STACK ARCHETYPE
 * ----------------------------------------------------------------------------
 * PROBLEM: for each day, how many days until a WARMER temperature? 0 if none.
 *
 * BRUTE FORCE: for each day scan forward until something warmer → O(n²).
 * NAME THE WASTE: day i's scan walks over days that day i-1's scan already
 * examined and rejected. Those rejections are re-derived from scratch.
 *
 * THE FIX: keep a stack of INDICES still waiting for a warmer day, held in
 * decreasing temperature order. When today is warmer than the stack top, today
 * IS that day's answer — pop and record the distance. Repeat, because today may
 * resolve several waiting days at once.
 *
 * WHY INDICES AND NOT VALUES: the answer is a DISTANCE, so the position must be
 * remembered. Storing values loses exactly the information being asked for.
 *
 * DRY-RUN on [73, 74, 75, 71, 69, 72, 76, 73]:
 * ┌─────┬──────┬───────────────────────────┬──────────────┬──────────────────┐
 * │ day │ temp │ pops (resolved)           │ stack after  │ result so far    │
 * ├─────┼──────┼───────────────────────────┼──────────────┼──────────────────┤
 * │ 0   │ 73   │ —                         │ [0]          │ [0,...]          │
 * │ 1   │ 74   │ 0 → 1-0 = 1               │ [1]          │ [1,0,...]        │
 * │ 2   │ 75   │ 1 → 2-1 = 1               │ [2]          │ [1,1,0,...]      │
 * │ 3   │ 71   │ — (colder, must wait)     │ [2,3]        │ …                │
 * │ 4   │ 69   │ — (colder still)          │ [2,3,4]      │ …                │
 * │ 5   │ 72   │ 4 → 1, then 3 → 2         │ [2,5]        │ …                │
 * │ 6   │ 76   │ 5 → 1, then 2 → 4         │ [6]          │ …                │
 * │ 7   │ 73   │ —                         │ [6,7]        │ never resolved→0 │
 * └─────┴──────┴───────────────────────────┴──────────────┴──────────────────┘
 * → [1, 1, 4, 2, 1, 1, 0, 0]
 * Day 6 resolving TWO waiting days at once is the amortization in action.
 * Indices left on the stack at the end never found an answer — they stay 0.
 *
 * @example
 * // Real-world: how long until a stock closes above today's price?
 * dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]); // [1,1,4,2,1,1,0,0]
 * dailyTemperatures([30, 40, 50, 60]);                 // [1,1,1,0]
 *
 * Time: O(n) — each index is pushed once and popped at most once.
 * Space: O(n).
 */
export function dailyTemperatures(temperatures: number[]): number[] {
  const result = new Array<number>(temperatures.length).fill(0);
  const waiting: number[] = []; // INDICES, decreasing by temperature

  for (let day = 0; day < temperatures.length; day++) {
    // Today resolves every colder day still waiting — possibly several.
    while (
      waiting.length > 0 &&
      temperatures[day] > temperatures[waiting[waiting.length - 1]]
    ) {
      const coldDay = waiting.pop()!;
      result[coldDay] = day - coldDay; // the distance is the answer
    }
    waiting.push(day); // today now waits for its own warmer day
  }

  return result; // anything never popped keeps its 0
}

/**
 * ----------------------------------------------------------------------------
 * NEXT GREATER ELEMENT I (LeetCode 496)
 * ----------------------------------------------------------------------------
 * `nums1` is a SUBSET of `nums2`. For each value in nums1, find the first
 * greater value to its right IN nums2, or -1.
 *
 * Same monotonic stack as LC739, with one addition: because the query order
 * differs from the scan order, results are recorded in a Map keyed by VALUE
 * (safe here — the problem guarantees all values are distinct).
 *
 * DRY-RUN on nums2 = [1, 3, 4, 2]:
 *   1 → stack [1]
 *   3 → 3 > 1, pop → map{1:3};  stack [3]
 *   4 → 4 > 3, pop → map{3:4};  stack [4]
 *   2 → 2 < 4, no pop;          stack [4, 2]
 *   leftover 4 and 2 → no greater element → -1
 *   nums1 = [4,1,2] → [-1, 3, -1]  ✨
 *
 * @example
 * nextGreaterElement([4, 1, 2], [1, 3, 4, 2]); // [-1, 3, -1]
 * nextGreaterElement([2, 4], [1, 2, 3, 4]);    // [3, -1]
 *
 * Time: O(n + m). Space: O(n).
 */
export function nextGreaterElement(nums1: number[], nums2: number[]): number[] {
  const nextGreater = new Map<number, number>(); // value → its next greater
  const stack: number[] = []; // VALUES, decreasing (distinctness makes this safe)

  for (const num of nums2) {
    while (stack.length > 0 && num > stack[stack.length - 1]) {
      nextGreater.set(stack.pop()!, num);
    }
    stack.push(num);
  }
  // Whatever remains on the stack has no greater element to its right.

  return nums1.map((num) => nextGreater.get(num) ?? -1);
}

/**
 * ----------------------------------------------------------------------------
 * NEXT GREATER ELEMENT II (LeetCode 503) — the CIRCULAR variant
 * ----------------------------------------------------------------------------
 * The array wraps, so the search may continue past the end and back to index 0.
 *
 * THE STANDARD TRICK: iterate 2n times using `i % n`. The second lap lets
 * still-waiting indices be resolved by elements before them, exactly simulating
 * the wrap-around — without physically concatenating the array.
 *
 * ⚠️ Push only during the FIRST lap. Pushing on the second lap would let an
 * index wait for an answer more than one full circle away, which the problem
 * does not allow.
 *
 * DRY-RUN on [1, 2, 1]:
 *   lap 1: i=0 (1) push[0]; i=1 (2) pops 0 → result[0]=2, push[1];
 *          i=2 (1) push[2]  → stack [1, 2]
 *   lap 2: i=0 (1) not > 2 (idx1) and not > 1 (idx2)… 1 is not > 1 → nothing
 *          i=1 (2) pops idx2 → result[2]=2; idx1 holds 2, not > 2 → stops
 *   idx1 never resolved → -1
 *   → [2, -1, 2]  ✨
 *
 * @example
 * nextGreaterElements([1, 2, 1]);    // [2, -1, 2]
 * nextGreaterElements([1, 2, 3, 4]); // [2, 3, 4, -1]
 *
 * Time: O(n) — 2n iterations, each index pushed/popped once. Space: O(n).
 */
export function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n).fill(-1);
  const waiting: number[] = []; // indices

  for (let step = 0; step < 2 * n; step++) {
    const i = step % n; // the wrap, without copying the array

    while (waiting.length > 0 && nums[i] > nums[waiting[waiting.length - 1]]) {
      result[waiting.pop()!] = nums[i];
    }

    if (step < n) waiting.push(i); // first lap only — one circle maximum
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * LARGEST RECTANGLE IN HISTOGRAM (LeetCode 84) ★ THE HARD ONE
 * ----------------------------------------------------------------------------
 * PROBLEM: given bar heights of width 1, find the largest axis-aligned
 * rectangle that fits inside the histogram.
 *
 * THE REFRAME THAT UNLOCKS IT: every maximal rectangle is limited by its
 * SHORTEST bar. So instead of enumerating rectangles, ask for each bar:
 * "if THIS bar were the shortest, how far left and right could I extend?"
 * The answer is bounded by the first strictly SHORTER bar on each side —
 * which is the previous/next-smaller-element problem, i.e. a monotonic stack.
 *
 * Brute force computes those boundaries by scanning outward from every bar:
 * O(n²). The INCREASING stack finds them in one pass.
 *
 * WHY INCREASING: we want the next SMALLER element, so a new bar destroys
 * (pops) everything TALLER than it. At the moment bar j pops bar i:
 *   - j is i's first shorter bar on the RIGHT
 *   - the new stack top is i's first shorter bar on the LEFT
 * Both boundaries become known simultaneously — that is the whole trick, and
 * the reason width is `j - stack.top - 1` rather than `j - i`.
 *
 * DRY-RUN on [2, 1, 5, 6, 2, 3]:
 *   i=0 h=2 → push [0]
 *   i=1 h=1 → 1 < 2, pop 0: height 2, left boundary = none → width 1, area 2
 *             push [1]
 *   i=2 h=5 → push [1,2]
 *   i=3 h=6 → push [1,2,3]
 *   i=4 h=2 → 2 < 6, pop 3: height 6, width 4-2-1 = 1, area 6
 *             2 < 5, pop 2: height 5, width 4-1-1 = 2, area 10  ✨ best
 *             push [1,4]
 *   i=5 h=3 → push [1,4,5]
 *   drain: 3 → width 6-4-1=1 area 3; 2 → width 6-1-1=4 area 8; 1 → width 6 area 6
 *   → 10  (bars of height 5 and 6 spanning width 2)
 *
 * THE SENTINEL: appending a height of 0 forces the stack to drain at the end,
 * so the final bars are measured without duplicating the drain logic.
 *
 * @example
 * largestRectangleArea([2, 1, 5, 6, 2, 3]); // 10
 * largestRectangleArea([2, 4]);             // 4
 *
 * Time: O(n) — each bar pushed and popped once. Space: O(n).
 */
export function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // indices, INCREASING by height
  let best = 0;

  // The 0 sentinel is shorter than every bar, so it drains the stack.
  for (let i = 0; i <= heights.length; i++) {
    const current = i === heights.length ? 0 : heights[i];

    while (stack.length > 0 && current < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()!];
      // Left boundary is the new stack top; right boundary is i.
      // Width spans strictly between them, hence the -1.
      const left = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - left - 1;
      best = Math.max(best, height * width);
    }

    stack.push(i);
  }

  return best;
}

/**
 * ----------------------------------------------------------------------------
 * GENERATE PARENTHESES (LeetCode 22) — backtracking with a stack-shaped rule
 * ----------------------------------------------------------------------------
 * PROBLEM: produce all combinations of n well-formed parenthesis pairs.
 *
 * THE INSIGHT: generating all 2^(2n) strings and filtering with a validity
 * check is wasteful. Enforce validity DURING construction with two counting
 * rules that are exactly the stack discipline, checked without a stack:
 *
 *   - add '(' while open  < n           (still have pairs to spend)
 *   - add ')' while close < open        (never close what was not opened)
 *
 * The second rule is the stack invariant "the stack is never popped empty",
 * expressed as a counter. Because no invalid prefix is ever built, every leaf
 * reached is a valid answer — no filtering step at all.
 *
 * DRY-RUN for n = 2:
 *   ""        → only '(' allowed
 *   "("       → open 1: may add '(' (open<2) or ')' (close<open)
 *     "(("    → open 2: only ')' now
 *       "(()" → "(())" ✓
 *     "()"    → open 1 close 1: only '(' (close is not < open)
 *       "()(" → "()()" ✓
 *   → ["(())", "()()"]  ✨
 *
 * @example
 * generateParenthesis(3); // ["((()))","(()())","(())()","()(())","()()()"]
 * generateParenthesis(1); // ["()"]
 *
 * Time:  O(4ⁿ / √n) — the nth Catalan number of valid strings, each O(n) to emit.
 * Space: O(n) recursion depth (excluding the output).
 */
export function generateParenthesis(n: number): string[] {
  const result: string[] = [];

  function build(current: string, open: number, close: number): void {
    if (current.length === 2 * n) {
      result.push(current); // every complete string here is valid by construction
      return;
    }

    // Spend an opening bracket while any remain.
    if (open < n) build(current + "(", open + 1, close);
    // Close only what is already open — the stack-never-underflows rule.
    if (close < open) build(current + ")", open, close + 1);
  }

  build("", 0, 0);
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * DECODE STRING (LeetCode 394) — nested contexts on a stack
 * ----------------------------------------------------------------------------
 * PROBLEM: decode "3[a2[c]]" → "accaccacc". Encodings nest arbitrarily.
 *
 * THE INSIGHT: on '[' the current context must be SUSPENDED and resumed later —
 * the textbook signal for a stack. Push the string built so far and the
 * repetition count, then start a fresh context for the inner group. On ']' pop
 * the outer context and splice the repeated inner result back into it.
 *
 * Two parallel stacks (or one stack of pairs) are needed because BOTH the
 * prefix and its multiplier must be restored together.
 *
 * ⚠️ MULTI-DIGIT NUMBERS: "12[a]" means twelve, not one then two. The digit
 * accumulator `count = count * 10 + digit` handles this; reading a single
 * character is a common failure.
 *
 * DRY-RUN on "3[a2[c]]":
 *   '3'  → count 3
 *   '['  → push ("" , 3);  current = "",  count = 0
 *   'a'  → current = "a"
 *   '2'  → count 2
 *   '['  → push ("a", 2);  current = "",  count = 0
 *   'c'  → current = "c"
 *   ']'  → pop ("a", 2) → current = "a" + "c"×2 = "acc"
 *   ']'  → pop ("",  3) → current = ""  + "acc"×3 = "accaccacc"  ✨
 *
 * @example
 * decodeString("3[a]2[bc]"); // "aaabcbc"
 * decodeString("3[a2[c]]");  // "accaccacc"
 * decodeString("2[abc]3[cd]ef"); // "abcabccdcdcdef"
 *
 * Time:  O(length of the decoded output). Space: O(nesting depth).
 */
export function decodeString(s: string): string {
  const stringStack: string[] = []; // suspended prefixes
  const countStack: number[] = [];  // their repeat counts
  let current = "";
  let count = 0;

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      count = count * 10 + Number(ch); // accumulate multi-digit numbers
    } else if (ch === "[") {
      // Suspend the outer context and start a fresh inner one.
      stringStack.push(current);
      countStack.push(count);
      current = "";
      count = 0;
    } else if (ch === "]") {
      // Resume the outer context, splicing in the repeated inner result.
      const repeat = countStack.pop()!;
      const previous = stringStack.pop()!;
      current = previous + current.repeat(repeat);
    } else {
      current += ch;
    }
  }

  return current;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The universal stack cue: an item's answer depends on something that comes
 *    LATER. Park it, resolve it when the answer arrives. Brackets, nested
 *    decoding and every monotonic-stack problem are the same sentence.
 * 2. Monotonic stack direction — derive it, do not memorize it. Ask what a new
 *    element should DESTROY:
 *      next GREATER → pop smaller tops → stack decreasing (LC739, LC496, LC503)
 *      next SMALLER → pop larger tops  → stack increasing (LC84)
 * 3. THE complexity sentence for monotonic stacks: "the inner while-loop looks
 *    quadratic, but each index is pushed once and popped at most once, so the
 *    total is O(n) amortized." Say it before being asked.
 * 4. Store INDICES, not values, whenever the answer is a distance or a width
 *    (LC739, LC84). Values lose the position the question is about.
 * 5. LC84's reframe is the hardest idea here: every rectangle is capped by its
 *    shortest bar, so ask "how far can THIS bar extend?" — bounded by the first
 *    shorter bar each side. When a pop happens, both boundaries are known at
 *    once, which is why width is `i - newTop - 1`.
 * 6. Sentinels remove duplicated drain logic — the trailing 0 in LC84 flushes
 *    the stack so the tail bars need no separate loop.
 * 7. Pitfalls: RPN operand order (second pop is the LEFT operand) and
 *    Math.trunc vs Math.floor for negative division; multi-digit counts in
 *    LC394; pushing only on the first lap in the circular LC503.
 * 8. Follow-ups you may get: Trapping Rain Water (already in
 *    ../2Pointers/trappingRainWater.ts — solvable by monotonic stack too),
 *    Maximal Rectangle (LC85 = run LC84 once per row), and Sliding Window
 *    Maximum (../SlidingWindow/fixedSizeSlidingWindow.ts, a monotonic DEQUE —
 *    same idea with removal at both ends).
 */
