/**
 * ============================================================================
 * TRAPPING RAIN WATER (LeetCode 42)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given n non-negative integers `height[0..n-1]` representing an elevation
 * map (bar width 1), compute the TOTAL water trapped after raining.
 *
 *   Input:  [0,1,0,2,1,0,1,3,2,1,2,1]
 *   Output: 6
 *
 * NOT THE SAME PROBLEM AS Container With Most Water:
 * - Container With Most Water picks TWO bars and asks for the max area
 *   BETWEEN them (water can "leak" past any bar in between).
 * - Trapping Rain Water sums the water sitting above EVERY bar, where each
 *   bar's water is capped by the tallest walls to its left AND right.
 *   (This file used to contain a mislabeled second copy of the Container-
 *   With-Most-Water algorithm — that logic already lives correctly in
 *   `ContainerWithMostWater.ts`. This file now solves the real LeetCode 42.)
 *
 * PATTERN:
 * - **Two Pointers** (optimal) or prefix/suffix max arrays (more intuitive
 *   first step). The water trapped AT index i is:
 *     water[i] = max(0, min(leftMax[i], rightMax[i]) - height[i])
 *   where leftMax[i]/rightMax[i] are the tallest bars to the left/right of i
 *   (inclusive).
 *
 * WHEN TO USE:
 * - "Value at index i depends on the max/min seen so far from BOTH
 *   directions" → precompute prefix/suffix arrays, or collapse to two
 *   pointers if you only ever need the SMALLER of the two running maxes.
 *
 * REAL-WORLD ANALOGIES:
 * - Civil/terrain engineering: how much water pools across a landscape
 *   cross-section after rainfall, given a height profile.
 * - Manufacturing: liquid retained inside a container wall profile of
 *   varying height.
 *
 * COMPLEXITY SUMMARY (n = height.length):
 *   Approach 1  Brute force (scan left/right per index)  Time O(n²)  Space O(1)
 *   Approach 2  Prefix/suffix max arrays                  Time O(n)   Space O(n)
 *   Approach 3  Two Pointers ★ optimal                    Time O(n)   Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (per index, scan both directions)
 * ----------------------------------------------------------------------------
 * Idea: for every index i, separately scan left for the tallest bar and right
 * for the tallest bar, then apply the water formula directly.
 *
 * Why it's slow: leftMax/rightMax for adjacent indices barely change, but
 * this approach re-scans the entire array from scratch for every single
 * index instead of reusing the previous index's scan.
 *
 * @example
 * trapBruteForce([0,1,0,2,1,0,1,3,2,1,2,1]);
 * // 6
 *
 * Time:  O(n²)  — O(n) scan for every one of the n indices.
 * Space: O(1)
 */
export function trapBruteForce(height: number[]): number {
  if (!height || height.length < 3) return 0;

  let total = 0;
  for (let i = 0; i < height.length; i++) {
    let leftMax = 0;
    for (let l = 0; l <= i; l++) leftMax = Math.max(leftMax, height[l]);

    let rightMax = 0;
    for (let r = i; r < height.length; r++) rightMax = Math.max(rightMax, height[r]);

    total += Math.min(leftMax, rightMax) - height[i];
  }
  return total;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — PREFIX / SUFFIX MAX ARRAYS (remove the rescanning)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: leftMax[i] only needs leftMax[i-1] and height[i] — no
 * need to rescan from index 0 every time. Precompute leftMax and rightMax
 * ONCE each in a single pass, then combine them in a final pass.
 *
 * @example
 * trapPrefixSuffix([0,1,0,2,1,0,1,3,2,1,2,1]);
 * // 6
 *
 * Time:  O(n)  — three linear passes (leftMax, rightMax, sum).
 * Space: O(n)  — the two auxiliary arrays.
 */
export function trapPrefixSuffix(height: number[]): number {
  const n = height.length;
  if (!height || n < 3) return 0;

  const leftMax = new Array(n).fill(0);
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);

  const rightMax = new Array(n).fill(0);
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);

  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  return total;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — TWO POINTERS ★ OPTIMAL (collapse both arrays to O(1) space)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: to know water[i] you technically need BOTH leftMax[i]
 * and rightMax[i] — but you only ever need the SMALLER of the two, and
 * whichever side currently has the smaller running max is the side whose
 * true final max you already know for certain (the taller side's eventual
 * max can only be ≥ what you've seen, so it can't be the limiting one).
 * That lets two pointers track just one running max each and still be correct.
 *
 * DRY-RUN on [0,1,0,2,1,0,1,3,2,1,2,1] (expected total 6):
 *   left=0,right=11, lMax=0,rMax=0
 *   h[0]=0 <= h[11]=1 → lMax=max(0,0)=0; water+=0        → left=1
 *   h[1]=1 <= h[11]=1 → lMax=max(0,1)=1; water+=0        → left=2
 *   h[2]=0 <= h[11]=1 → lMax=max(1,0)=1; water+=1  (=1)  → left=3
 *   h[3]=2 >  h[11]=1 → rMax=max(0,1)=1; water+=0        → right=10
 *   h[3]=2 <= h[10]=2 → lMax=max(1,2)=2; water+=0        → left=4
 *   h[4]=1 <= h[10]=2 → lMax=max(2,1)=2; water+=1  (=2)  → left=5
 *   h[5]=0 <= h[10]=2 → lMax=max(2,0)=2; water+=2  (=4)  → left=6
 *   h[6]=1 <= h[10]=2 → lMax=max(2,1)=2; water+=1  (=5)  → left=7
 *   h[7]=3 >  h[10]=2 → rMax=max(1,2)=2; water+=0        → right=9
 *   h[7]=3 >  h[9]=1  → rMax=max(2,1)=2; water+=1  (=6)  → right=8
 *   h[7]=3 >  h[8]=2  → rMax=max(2,2)=2; water+=0        → right=7
 *   left===right → stop.  Total = 6  ✓
 *
 * @example
 * trap([0,1,0,2,1,0,1,3,2,1,2,1]);
 * // 6
 *
 * Time:  O(n)  — each pointer moves at most n times total.
 * Space: O(1)
 */
export function trap(height: number[]): number {
  if (!height || height.length < 3) return 0;

  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }

  return water;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "water trapped ABOVE every bar" (not just between two
 *    chosen bars) → per-index formula min(leftMax,rightMax) - height[i],
 *    summed. That formula IS the problem; every approach here just computes
 *    leftMax/rightMax more or less efficiently.
 * 2. The two-pointer leap (Approach 2 → 3) is the one interviewers most want
 *    to see justified: explain why tracking only the smaller running max on
 *    each side is still correct (the taller side's true max can only get
 *    taller, so it was never the binding constraint).
 * 3. Pitfalls: guard n < 3 (need at least 3 bars to trap anything); the
 *    formula can't go negative in practice (height[i] ≤ min(leftMax,rightMax)
 *    always holds once leftMax/rightMax include height[i] itself), so no
 *    Math.max(0, ...) clamp is actually needed here — DON'T confuse this
 *    with Container With Most Water's area formula.
 * 4. Follow-ups: Trapping Rain Water II (LeetCode 407) generalizes this to a
 *    2D height map — solved with a min-heap expanding inward from the
 *    border, a very different technique (heap/BFS, not two pointers).
 */
