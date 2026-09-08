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
 *   palindromePartition: O(n · 2ⁿ) | solveNQueens: O(n!)
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
 * ----------------------------------------------------------------------------
 * WORD SEARCH (LeetCode 79) — backtracking on a GRID
 * ----------------------------------------------------------------------------
 * PROBLEM: can `word` be spelled by walking 4-directionally through adjacent
 * cells, without reusing a cell within the same path?
 *
 * WHAT CHANGES vs. the array problems above: the "choices" at each step are the
 * four neighbours rather than the remaining array slots, and the constraint is
 * spatial — a cell already used ON THE CURRENT PATH is off limits.
 *
 * THE UN-CHOOSE STEP IS THE WHOLE PROBLEM. A cell must be blocked while the
 * current path uses it and released the moment that path unwinds, because a
 * DIFFERENT path may legitimately need it. Marking cells permanently (a plain
 * visited set that is never cleared) is the classic wrong answer: it passes the
 * first sample and fails as soon as two candidate paths overlap.
 *
 * THE O(1)-SPACE TRICK: instead of a separate visited grid, overwrite the cell
 * with a sentinel ("#") on the way in and restore the original character on the
 * way out. The board itself carries the path state, and it is left exactly as
 * it was found.
 *
 * DRY-RUN on board [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],
 * word "ABCCED":
 *   (0,0)A ✓ mark → (0,1)B ✓ → (0,2)C ✓ → (1,2)C ✓ → (2,2)E ✓ → (2,1)D ✓
 *   index reaches word.length → true, unwinding restores every cell.
 * Counter-example "ABCB": A ✓ B ✓ C ✓ then needs B — the only B is (0,1),
 *   already "#" on this path → all four directions fail → backtrack → false.
 *
 * @example
 * const board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
 * exist(board, "ABCCED"); // true
 * exist(board, "SEE");    // true
 * exist(board, "ABCB");   // false — the B cannot be reused
 *
 * Time:  O(R · C · 4^L) — every cell as a start, four directions per step.
 * Space: O(L) recursion depth; O(1) auxiliary thanks to in-place marking.
 */
export function exist(board: string[][], word: string): boolean {
  if (board.length === 0 || board[0].length === 0 || word.length === 0) {
    return false;
  }

  const rows = board.length;
  const cols = board[0].length;

  function search(row: number, col: number, index: number): boolean {
    // Every character matched — done, regardless of where we are.
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    if (board[row][col] !== word[index]) return false; // includes the "#" case

    // CHOOSE: block this cell for the duration of the current path only.
    const original = board[row][col];
    board[row][col] = "#";

    const found =
      search(row + 1, col, index + 1) ||
      search(row - 1, col, index + 1) ||
      search(row, col + 1, index + 1) ||
      search(row, col - 1, index + 1);

    // UN-CHOOSE: release the cell so other paths may use it.
    board[row][col] = original;

    return found;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (search(row, col, 0)) return true;
    }
  }

  return false;
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
 * 4. Grid backtracking (Word Search, above) differs from the array problems in
 *    one way that matters: the un-choose step must RELEASE the cell, because a
 *    different path may need it. Marking cells permanently is the classic bug.
 *    The in-place sentinel ("#" then restore) avoids a separate visited grid.
 * 5. Follow-ups this template still unlocks: N-Queens (choose = column per row,
 *    prune = attacked squares), Palindrome Partitioning (choose = next cut
 *    point), Sudoku Solver (choose = digit per empty cell). See also
 *    ../Trie/triePatterns.ts → `findWords` (LC212), which is this same grid
 *    walk driven by a trie so that ALL words are searched in one pass.
 */

/**
 * ----------------------------------------------------------------------------
 * 7. PALINDROME PARTITIONING (LeetCode 131) — PRUNING IS THE WHOLE PROBLEM
 * ----------------------------------------------------------------------------
 * PROBLEM: split `s` into pieces such that EVERY piece is a palindrome, and
 * return all such splits.
 *
 * THE SHAPE: this is `combinationSum` with strings. At each position you choose
 * how long the next piece is, then recurse from the end of that piece. The
 * choice is "where does the current piece stop?", and the candidates are every
 * remaining end position.
 *
 * ⭐ WHERE THE WORK IS SAVED — and this is the reason to study this problem:
 * without the palindrome check you would enumerate all 2^(n-1) ways to cut a
 * string. The check `isPalindrome(start, end)` PRUNES a whole subtree the
 * instant a prefix is invalid, because if s[start..end] is not a palindrome,
 * no split beginning with that piece can ever be valid. As the file header
 * says: backtracking is never optimised asymptotically, only pruned — and
 * pruning as HIGH in the tree as possible is the entire craft.
 *
 * WHY CHECK PALINDROMES WITH TWO POINTERS RATHER THAN reverse()===: comparing
 * against a reversed copy allocates a new string per check. The two-pointer
 * walk allocates nothing and bails at the first mismatch, which on a random
 * string is almost immediately.
 *
 * DRY-RUN on "aab":
 *   start=0: piece "a"   ✓ palindrome → recurse from 1
 *              start=1: piece "a"  ✓ → recurse from 2
 *                         start=2: piece "b" ✓ → start===len → record [a,a,b]
 *              start=1: piece "ab" ✗ → PRUNED, never explored further
 *   start=0: piece "aa"  ✓ → recurse from 2
 *              start=2: piece "b"  ✓ → record [aa,b]
 *   start=0: piece "aab" ✗ → PRUNED
 *   → [["a","a","b"], ["aa","b"]]  ✓
 *
 * ⚠️ THE TWO CLASSIC BUGS from the file header apply here verbatim: push
 * `[...path]` not `path`, and pop after recursing.
 *
 * @example
 * palindromePartition("aab");  // [["a","a","b"], ["aa","b"]]
 * palindromePartition("a");    // [["a"]]
 * palindromePartition("");     // [[]] — one way to split nothing
 *
 * Time:  O(n · 2ⁿ) worst case (a string like "aaaa" prunes nothing, and every
 *        one of the 2^(n-1) cuts is valid). Space: O(n) recursion + output.
 *
 * 🔗 The DP cousin is Palindrome Partitioning II (LC132), which asks only for
 * the MINIMUM number of cuts — when a problem wants a count or a best rather
 * than every arrangement, stop backtracking and reach for DP.
 */
export function palindromePartition(s: string): string[][] {
    const result: string[][] = [];
    const path: string[] = [];

    // Two-pointer check on the ORIGINAL string — no substring allocated.
    function isPalindrome(left: number, right: number): boolean {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++;
            right--;
        }
        return true;
    }

    function backtrack(start: number): void {
        // Consumed the whole string — every piece on the path was a palindrome.
        if (start === s.length) {
            result.push([...path]); // COPY — pushing `path` would alias it
            return;
        }

        for (let end = start; end < s.length; end++) {
            // PRUNE: if this piece is not a palindrome, no split starting with
            // it can work, so skip the entire subtree below it.
            if (!isPalindrome(start, end)) continue;

            path.push(s.slice(start, end + 1)); // choose
            backtrack(end + 1);                 // explore
            path.pop();                         // un-choose
        }
    }

    backtrack(0);
    return result;
}

/**
 * ----------------------------------------------------------------------------
 * 8. N-QUEENS (LeetCode 51) — CONSTRAINT SETS INSTEAD OF RE-SCANNING
 * ----------------------------------------------------------------------------
 * PROBLEM: place n queens on an n×n board so that none attack another (no two
 * share a row, column, or diagonal). Return every distinct board.
 *
 * THE SHAPE: place one queen PER ROW, so the recursion depth is the row index
 * and the choice at each level is which column. That framing removes the row
 * constraint for free — you never place two queens in a row because you only
 * ever place one per level.
 *
 * ⭐ THE IDEA WORTH STEALING — O(1) CONFLICT CHECKS VIA THREE SETS.
 * The naive check scans the board for attackers, O(n) per placement. Instead
 * notice that the two diagonals have closed-form identities:
 *
 *     every cell on a "\" diagonal has the SAME  (row - col)
 *     every cell on a "/" diagonal has the SAME  (row + col)
 *
 * So three Sets — columns, row-col, row+col — answer "is this square
 * attacked?" in O(1). Deriving those two identities on the spot is what the
 * problem is really testing; once you have them the backtracking is routine.
 *
 *      row-col on a 4×4 board          row+col on a 4×4 board
 *        0  1  2  3                      0  1  2  3
 *      ┌──┬──┬──┬──┐                   ┌──┬──┬──┬──┐
 *   0  │ 0│-1│-2│-3│                0  │ 0│ 1│ 2│ 3│
 *   1  │ 1│ 0│-1│-2│                1  │ 1│ 2│ 3│ 4│
 *   2  │ 2│ 1│ 0│-1│                2  │ 2│ 3│ 4│ 5│
 *   3  │ 3│ 2│ 1│ 0│                3  │ 3│ 4│ 5│ 6│
 *      └──┴──┴──┴──┘                   └──┴──┴──┴──┘
 *      constant down-right              constant down-left
 *
 * REASONING / STEPS:
 *   1. At row r, try every column c.
 *   2. Skip c if cols, diagonal (r-c) or antiDiagonal (r+c) is already taken.
 *   3. Otherwise mark all three, write the queen, recurse to row r+1.
 *   4. Un-choose: clear the three marks and the board square.
 *   5. When r === n every row is filled — snapshot the board as strings.
 *
 * @example
 * solveNQueens(4);
 * // [[".Q..", "...Q", "Q...", "..Q."],
 * //  ["..Q.", "Q...", "...Q", ".Q.."]]
 * solveNQueens(1); // [["Q"]]
 * solveNQueens(2); // []  — provably impossible
 * solveNQueens(3); // []  — also impossible
 *
 * Time:  O(n!) — row 0 has n choices, row 1 at most n-1, and so on; the
 *        constraint sets prune far below that in practice.
 * Space: O(n) for the sets and recursion, plus the output.
 */
export function solveNQueens(n: number): string[][] {
    const result: string[][] = [];

    // O(1) attack tests — see the identities above.
    const cols = new Set<number>();
    const diagonal = new Set<number>();     // row - col  ("\" direction)
    const antiDiagonal = new Set<number>(); // row + col  ("/" direction)

    // The board as an array of char arrays, mutated in place and snapshotted.
    const board: string[][] = Array.from({ length: n }, () =>
        new Array<string>(n).fill('.')
    );

    function backtrack(row: number): void {
        if (row === n) {
            // Snapshot: join each row into a string. This is the copy step —
            // the board itself keeps being mutated by sibling branches.
            result.push(board.map((r) => r.join('')));
            return;
        }

        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diagonal.has(row - col) || antiDiagonal.has(row + col)) {
                continue; // this square is attacked — prune
            }

            // choose
            cols.add(col);
            diagonal.add(row - col);
            antiDiagonal.add(row + col);
            board[row][col] = 'Q';

            backtrack(row + 1); // explore

            // un-choose (all four pieces of state, or siblings see a ghost queen)
            board[row][col] = '.';
            cols.delete(col);
            diagonal.delete(row - col);
            antiDiagonal.delete(row + col);
        }
    }

    backtrack(0);
    return result;
}
