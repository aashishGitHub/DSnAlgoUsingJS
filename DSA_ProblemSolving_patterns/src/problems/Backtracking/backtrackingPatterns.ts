/**
 * ============================================================================
 * BACKTRACKING PATTERNS
 * ============================================================================
 *
 * PATTERN:
 * - **Systematic exhaustive search as a recursion tree.** At every level:
 *   CHOOSE a candidate → EXPLORE deeper → UN-CHOOSE (restore state). The
 *   un-choose step is what lets one shared `path` array walk the entire tree.
 *
 * THE BRUTE-FORCE → OPTIMIZED STORY:
 * - You cannot write the brute force as nested loops when the nesting DEPTH is
 *   variable (subsets of n items would need n nested loops). Recursion IS the
 *   variable-depth loop — so here the "brute force" and the pattern coincide.
 * - The optimization is therefore never asymptotic; it is PRUNING: detect that
 *   a branch cannot succeed as high up the tree as possible and return early.
 *   Sorting the input first often converts a `continue` into a `break`
 *   (everything after an overshoot also overshoots) — see combinationSum.
 *
 * RECOGNITION CUES:
 * - "ALL subsets / permutations / combinations / ways to place / paths."
 * - "Generate every valid X" where validity depends on choices so far.
 *
 * REAL-WORLD ANALOGIES:
 * - Configuration search: every valid feature-flag combination.
 * - Test-case generation: all input shapes satisfying constraints.
 * - Scheduling/placement: assign tasks/queens/seats subject to conflicts.
 *
 * COMPLEXITY (inherent — the OUTPUT is exponential):
 *   subsets: O(n · 2ⁿ) | permutations: O(n · n!) | combinationSum: O(k · 2ᵗᵃʳᵍᵉᵗ)-ish
 *   Space: O(depth) recursion + the output itself.
 *
 * THE TWO CLASSIC BUGS (memorize):
 *   1. `result.push(path)` pushes a REFERENCE that later mutates — always
 *      push a copy: `result.push([...path])`.
 *   2. Forgetting `path.pop()` (un-choose) corrupts every sibling branch.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * 1. SUBSETS (LeetCode 78) — the template every other problem dials
 * ----------------------------------------------------------------------------
 * Every node of the recursion tree IS a subset (record on entry). The `start`
 * index enforces "each element used at most once, no reordering" — which is
 * exactly what makes these subsets rather than permutations.
 *
 * @example
 * subsets([1, 2, 3]);
 * // [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
 *
 * Time: O(n · 2ⁿ) — 2ⁿ subsets, O(n) to copy each. Space: O(n) recursion depth.
 */
export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(start: number): void {
    result.push([...path]); // record the current node's state (copy!)

    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);   // choose
      backtrack(i + 1);     // explore — i+1: never reuse or go backwards
      path.pop();           // un-choose
    }
  }

  backtrack(0);
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * 2. PERMUTATIONS (LeetCode 46) — dial: loop from 0 + a `used` marker
 * ----------------------------------------------------------------------------
 * Order now matters, so every level may pick ANY unused element (loop from 0,
 * not `start`) and we track what the current path already consumed.
 *
 * @example
 * permute([1, 2, 3]);
 * // [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * Time: O(n · n!). Space: O(n) for path + used.
 */
export function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(nums.length).fill(false);

  function backtrack(): void {
    if (path.length === nums.length) {
      result.push([...path]); // a leaf = one complete permutation
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;  // prune: already in the current path

      used[i] = true;         // choose
      path.push(nums[i]);
      backtrack();            // explore
      path.pop();             // un-choose — BOTH markers must be restored
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * 3. COMBINATION SUM (LeetCode 39) — dial: reuse allowed + sorted-break pruning
 * ----------------------------------------------------------------------------
 * Unlimited reuse of each candidate → recurse with `i` (NOT `i + 1`).
 * The pruning upgrade: sort first, so the first candidate that overshoots the
 * remaining target lets us `break` the whole level (every later candidate is
 * larger) instead of `continue`-ing through it.
 *
 * @example
 * combinationSum([2, 3, 6, 7], 7);
 * // [[2,2,3],[7]]
 *
 * Time: exponential in target/min(candidate); pruning is what keeps it usable.
 */
export function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const sorted = [...candidates].sort((a, b) => a - b);

  function backtrack(start: number, remaining: number): void {
    if (remaining === 0) {
      result.push([...path]); // exact hit — one valid combination
      return;
    }

    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break; // PRUNE the level: sorted ⇒ all later overshoot too

      path.push(sorted[i]);             // choose
      backtrack(i, remaining - sorted[i]); // explore — `i` again: reuse allowed
      path.pop();                       // un-choose
    }
  }

  backtrack(0, target);
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * 4. LETTER COMBINATIONS OF A PHONE NUMBER (LeetCode 17) — cartesian product
 * ----------------------------------------------------------------------------
 * One recursion level per digit; the "candidates" at each level come from a
 * lookup table instead of the input array. The same choose/explore/un-choose
 * shape — shown here with string concatenation (strings are immutable, so
 * passing `path + letter` down IS the copy; no explicit pop needed).
 *
 * @example
 * letterCombinations("23");
 * // ["ad","ae","af","bd","be","bf","cd","ce","cf"]
 *
 * Time: O(n · 4ⁿ) — up to 4 letters per digit. Space: O(n) recursion.
 */
export function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];

  const keypad: Record<string, string> = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
  };

  const result: string[] = [];

  function backtrack(index: number, path: string): void {
    if (index === digits.length) {
      result.push(path); // complete combination (immutable string = free copy)
      return;
    }
    for (const letter of keypad[digits[index]]) {
      backtrack(index + 1, path + letter); // choose+explore; unwinding un-chooses
    }
  }

  backtrack(0, "");
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * 5. SUBSETS II — WITH DUPLICATE INPUT (LeetCode 90) — dial: sort + same-depth skip
 * ----------------------------------------------------------------------------
 * With duplicates in the input, two equal elements chosen at the SAME tree
 * depth produce identical subtrees. Sort, then skip `nums[i] === nums[i-1]`
 * when `i > start` — "the first copy at each depth may be used; later copies
 * at the same depth are redundant."
 *
 * @example
 * subsetsWithDup([1, 2, 2]);
 * // [[], [1], [1,2], [1,2,2], [2], [2,2]]   — no duplicate [1,2] / [2]
 */
export function subsetsWithDup(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const sorted = [...nums].sort((a, b) => a - b);

  function backtrack(start: number): void {
    result.push([...path]);

    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue; // skip dup at same depth

      path.push(sorted[i]);
      backtrack(i + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. One template, four dials:
 *      subsets        → `start = i + 1`, record every node
 *      permutations   → loop from 0 + `used[]`, record at leaves
 *      reuse allowed  → recurse with `i` (combinationSum)
 *      dup input      → sort + skip equal siblings at the same depth
 * 2. State the output-size complexity up front (2ⁿ / n!) — interviewers want
 *    to hear you know the exponential cost is inherent, then discuss pruning.
 * 3. Pruning talking points: sort-then-break beats continue; feasibility
 *    checks (remaining < 0) belong BEFORE the recursive call, not inside it.
 * 4. Follow-ups this template unlocks: N-Queens (choose = column per row,
 *    prune = attacked squares), Word Search (grid + visited un-marking),
 *    Palindrome Partitioning (choose = next cut point).
 */
