# Stack Pattern (including the Monotonic Stack)

**When to Use**: an item's answer depends on something that comes **later** —
park it, resolve it when that something arrives.
**Time Complexity**: O(n) | **Space Complexity**: O(n)

## The monotonic stack

Keeps its contents sorted by popping anything that would break the order.

**Derive the direction, don't memorize it** — ask what a new element should destroy:

| Want | Pop while top is | Stack is |
|---|---|---|
| next **greater** | smaller | decreasing |
| next **smaller** | larger | increasing |

**The complexity sentence** (say it before being asked): the inner `while` looks
quadratic, but each index is pushed once and popped at most once, so the total
is **O(n) amortized**.

**Store indices, not values**, whenever the answer is a distance or a width.

## Files

- **`stackPatterns.ts`**
  - `MinStack` (LC155) — a second, parallel stack of "min as of this depth"
  - `evalRPN` (LC150) — ⚠️ second pop is the LEFT operand; `Math.trunc` not `floor`
  - `dailyTemperatures` (LC739) — **the monotonic stack archetype, start here**
  - `nextGreaterElement` (LC496) / `nextGreaterElements` (LC503, circular)
  - `largestRectangleArea` (LC84) — the hard one
  - `generateParenthesis` (LC22) — the stack invariant as two counters
  - `decodeString` (LC394) — suspended contexts

## The LC84 reframe

Every rectangle is capped by its **shortest** bar. So ask, for each bar, "how far
could I extend if I were the shortest?" — bounded by the first shorter bar on
each side. When a pop happens both boundaries are known at once, which is why
the width is `i - newTop - 1` rather than `i - poppedIndex`.

## Related

- [`../SlidingWindow/`](../SlidingWindow/) → `maxOfAllSubarrays` — a monotonic
  **deque** (same idea, removal at both ends)
- [`../2Pointers/trappingRainWater.ts`](../2Pointers/trappingRainWater.ts) —
  also solvable with a monotonic stack
- `../easy/validParenthesis_STACK.ts` — LC20, the plain-stack warm-up

> **Tests:** no vitest file yet; verified against LeetCode samples only.
