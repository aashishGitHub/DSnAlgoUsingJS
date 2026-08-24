/**
 * ============================================================================
 * VALID PARENTHESES / BALANCED BRACKETS (LeetCode 20) — the Stack flagship
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given a string of just '(){}[]', return true if every bracket is closed by
 * the SAME type in the CORRECT order.
 *
 *   "()[]{}" → true      "([)]" → false (wrong nesting order)
 *   "([])"   → true      "(]"   → false (mismatched type)
 *
 * PATTERN:
 * - **Stack (LIFO).** The most-recently-opened bracket must be the
 *   first-to-close — that "last in, first out" requirement IS a stack. Push
 *   openers; on a closer, the stack top must be its matching opener.
 *
 * WHY A STACK (the incremental story):
 * - You can't answer with counters alone: "([)]" has balanced counts of each
 *   type yet is invalid. Order matters, and the stack is exactly the memory
 *   of "what's still open, innermost first."
 *
 * COMPLEXITY: Time O(n) — one pass. Space O(n) — up to n/2 openers on the stack.
 * ============================================================================
 */

// Each closing bracket maps to the opening bracket it must match.
const CLOSE_TO_OPEN: Record<string, string> = {
  ")": "(",
  "]": "[",
  "}": "{",
};

/**
 * DRY-RUN on "([)]":
 *   '(' opener → push       stack: ['(']
 *   '[' opener → push       stack: ['(', '[']
 *   ')' closer → top is '[', needs '(' → MISMATCH → false ✓
 *
 * DRY-RUN on "([])":
 *   '(' push → ['(']  ·  '[' push → ['(','[']
 *   ']' closer → top '[' matches → pop → ['(']
 *   ')' closer → top '(' matches → pop → []
 *   end: stack empty → true ✓
 */
export function isValid(s: string): boolean {
  const stack: string[] = []; // holds unmatched OPENING brackets

  for (const ch of s) {
    const expectedOpener = CLOSE_TO_OPEN[ch];

    if (expectedOpener === undefined) {
      // ch is an opening bracket → remember it
      stack.push(ch);
    } else {
      // ch is a closing bracket → the stack top must be its matching opener.
      // (pop() on an empty stack is undefined, which correctly fails the check
      //  for a leading closer like "]".)
      if (stack.pop() !== expectedOpener) return false;
    }
  }

  // Valid only if nothing is left open.
  return stack.length === 0;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "matching / nesting / most-recent-must-resolve-first"
 *    → stack. Counters alone can't detect wrong ORDER ("([)]").
 * 2. Two failure modes to handle: a closer with the wrong/empty top (return
 *    false immediately) AND leftover openers at the end (stack not empty).
 * 3. The map-of-closer→opener keeps the matching O(1) and readable — cleaner
 *    than parallel arrays + indexOf.
 * 4. Follow-ups this unlocks: Min Add to Make Valid (LC921), Longest Valid
 *    Parentheses (LC32 — stack of INDICES, or DP), generate all valid
 *    combinations (LC22 — backtracking with open/close counts).
 */
