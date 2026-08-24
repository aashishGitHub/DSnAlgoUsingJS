/**
 * ============================================================================
 * CAN PLACE FLOWERS (LeetCode 605)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * A flowerbed is an array of 0s (empty) and 1s (planted). Flowers can't be
 * planted in ADJACENT plots. Given `n`, return true if `n` new flowers can be
 * planted without violating the no-adjacent rule.
 *
 *   Input:  flowerbed = [1,0,0,0,1], n = 1   → true  (plant at index 2)
 *   Input:  flowerbed = [1,0,0,0,1], n = 2   → false (only one safe slot)
 *
 * BUG FIXED DURING REWORK: the original file had a `canPlaceFlowers_NotWorking`
 * with hard-coded first-element handling and a loop bound of `length - 3` that
 * skipped valid slots near the end. The clean version below handles the edges
 * uniformly by treating out-of-bounds neighbors as empty.
 *
 * PATTERN:
 * - **Greedy single pass.** Plant as EARLY as possible: the first valid empty
 *   plot you find, take it. Greedy is safe here because planting earlier never
 *   blocks more future slots than planting later would — a standard exchange
 *   argument.
 *
 * COMPLEXITY: Time O(len). Space O(1) (mutates the bed; see note 3 to avoid that).
 * ============================================================================
 */

/**
 * A plot is plantable when it AND both neighbors are empty. The edge trick:
 * an out-of-bounds neighbor (before index 0 / after the last index) counts as
 * empty — so the first and last plots need no special-casing.
 *
 * DRY-RUN on [1,0,0,0,1], n=1:
 *   i=0: planted (1) → skip
 *   i=1: left=1 → not plantable
 *   i=2: left=bed[1]=0, right=bed[3]=0 → plant! bed[2]=1, n→0
 *   i=3: left=bed[2]=1 → not plantable
 *   i=4: planted → skip
 *   toPlant reached 0 → true ✓
 *
 * @param flowerbed - mutated in place (see note 3 for a non-mutating variant)
 */
export function canPlaceFlowers(flowerbed: number[], n: number): boolean {
  if (n === 0) return true; // nothing to plant → trivially possible

  let toPlant = n;

  for (let i = 0; i < flowerbed.length; i++) {
    if (flowerbed[i] === 1) continue; // occupied — skip

    // Out-of-bounds neighbors are treated as empty (0).
    const leftEmpty = i === 0 || flowerbed[i - 1] === 0;
    const rightEmpty = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;

    if (leftEmpty && rightEmpty) {
      flowerbed[i] = 1; // plant greedily, as early as possible
      toPlant--;
      if (toPlant === 0) return true; // early exit — done
    }
  }

  return toPlant <= 0;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. The edge trick — treat out-of-bounds as empty — removes the messy
 *    first/last special cases the original buggy version tried to hand-code.
 * 2. Why greedy is correct (be ready to justify): planting at the earliest
 *    empty triple never forecloses a placement that planting later would have
 *    allowed. Classic greedy exchange argument.
 * 3. Mutation: this plants into the input. To avoid side effects, either work
 *    on a copy, or count "gaps of consecutive zeros" (a run of g zeros bounded
 *    by flowers/edges fits (g-1)/2 flowers) without writing to the array.
 * 4. Early-exit on `toPlant === 0` matters for large beds — don't scan the
 *    rest once you've succeeded.
 */
