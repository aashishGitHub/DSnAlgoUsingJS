/**
 * ============================================================================
 * REMOVE CHARACTER AT A GIVEN INDEX (string warm-up)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Return a new string with the character at `index` removed. Out-of-bounds
 * index returns the original string unchanged.
 *
 *   removeCharAtIndex("Hello, World!", 9) → "Hello, Wold!"   (index 9 is 'r')
 *
 * PATTERN:
 * - **Slice and rejoin.** Strings are immutable in JS, so "removal" means
 *   building a new string from the part BEFORE the index and the part AFTER.
 *
 * COMPLEXITY: Time O(n). Space O(n) (a new string).
 * ============================================================================
 */

/**
 * `slice(0, index)` = everything up to (not including) index;
 * `slice(index + 1)` = everything after it. Concatenate to skip the char.
 *
 * DRY-RUN on ("abcde", 2):
 *   slice(0,2)="ab" + slice(3)="de" → "abde" ✓
 */
export function removeCharAtIndex(str: string, index: number): string {
  if (index < 0 || index >= str.length) {
    return str; // out of bounds → unchanged
  }
  return str.slice(0, index) + str.slice(index + 1);
}

/**
 * INTERVIEW NOTES:
 * 1. The guard matters: negative or too-large indices should be no-ops, not
 *    throw. `slice` itself is forgiving, but the explicit guard documents intent.
 * 2. Removing MANY indices? Don't call this in a loop (O(n·k), and indices
 *    shift after each removal) — build once by filtering: `[...str].filter((_, i)
 *    => !toRemove.has(i)).join("")`.
 */
