/**
 * ============================================================================
 * CONTAINER WITH MOST WATER (LeetCode 11)
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * Given n non-negative integers `height[0..n-1]`, where each represents a
 * vertical line at position i (width of each bar is 1), find two lines that,
 * together with the x-axis, form a container that holds the most water.
 *
 *   Input:  height = [1,8,6,2,5,4,8,3,7]
 *   Output: 49   (lines at index 1 (height 8) and index 8 (height 7):
 *                 min(8,7) * (8-1) = 7 * 7 = 49)
 *
 * PATTERN:
 * - **Two Pointers, closing in from both ends.** The area is bounded by the
 *   SHORTER of the two lines, so the pointer standing on the shorter line is
 *   the only one that can possibly improve the area — always move that one.
 *
 * WHEN TO USE:
 * - "Maximize something bounded by the min/smaller of two ends" over an array,
 *   where trying every pair is the naive approach but a monotonic argument
 *   lets you discard one end at a time.
 *
 * REAL-WORLD ANALOGIES:
 * - Civil engineering: widest/deepest reservoir you can form between two dam walls.
 * - UI layout: largest rectangle you can fit between two scrollable panel edges.
 *
 * COMPLEXITY SUMMARY (n = height.length):
 *   Approach 1  Brute force (every pair)         Time O(n²)   Space O(1)
 *   Approach 2  Two Pointers ★ optimal            Time O(n)    Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (try every pair of lines)
 * ----------------------------------------------------------------------------
 * Idea: the area for lines i and j is `min(height[i], height[j]) * (j - i)`.
 * Just compute it for every pair and keep the max.
 *
 * Why it's slow: most pairs are never worth checking — once you know the area
 * with the CURRENT shorter line and the farthest possible partner, moving the
 * taller line's pointer inward can only shrink the width without ever
 * increasing the bounding height. That "moving the taller side is provably
 * useless" insight is exactly what Approach 2 exploits to drop the inner loop.
 *
 * @example
 * maxAreaBruteForce([1, 8, 6, 2, 5, 4, 8, 3, 7]);
 * // 49
 *
 * Time:  O(n²)  — every pair (i, j).
 * Space: O(1)
 */
export function maxAreaBruteForce(height: number[]): number {
  if (!height || height.length < 2) {
    return 0;
  }

  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = Math.min(height[i], height[j]) * (j - i);
      maxWater = Math.max(maxWater, area);
    }
  }

  return maxWater;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — TWO POINTERS ★ OPTIMAL
 * ----------------------------------------------------------------------------
 * Pattern reasoning: start with the widest possible container (both ends).
 * The area is capped by `min(height[left], height[right])`. If we move the
 * TALLER pointer inward, width shrinks and the cap can only stay the same or
 * get smaller (bounded by the same or a shorter line) — never better. So the
 * only pointer worth moving is the one on the SHORTER line, which might reveal
 * a taller line and a genuinely larger area.
 *
 * DRY-RUN on [1,8,6,2,5,4,8,3,7]:
 *   left=0(1),right=8(7): area=min(1,7)*8=8            → move left (shorter)
 *   left=1(8),right=8(7): area=min(8,7)*7=49  ← max     → move right (shorter)
 *   left=1(8),right=7(3): area=min(8,3)*6=18            → move right (shorter)
 *   left=1(8),right=6(8): area=min(8,8)*5=40            → move right (tie→right)
 *   ... continues inward, never beats 49.
 *   → 49  ✓
 *
 * @example
 * maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]);
 * // 49
 *
 * Time:  O(n)  — each pointer moves at most n times total.
 * Space: O(1)
 */
export function maxArea(height: number[]): number {
    if (!height || height.length < 2) {
        return 0;
    }
    
    let maxWater = 0;
    let left = 0;
    let right = height.length - 1;
    
    while (left < right) {
        // Calculate current area
        const minHeight = Math.min(height[left], height[right]);
        const width = right - left;
        const currentArea = minHeight * width;
        
        maxWater = Math.max(maxWater, currentArea);
        
        // Move the pointer with smaller height
        // This is the key insight: moving the taller pointer won't increase area
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "maximize area/volume bounded by the smaller of two
 *    ends" over an array → two pointers from both ends, always move the
 *    shorter side. This exact skeleton reappears in Trapping Rain Water.
 * 2. The core proof point interviewers probe: explain WHY moving the taller
 *    pointer can never help (width shrinks, height cap can't increase).
 * 3. Pitfalls: off-by-one on width (`right - left`, not `+1` — bars have zero
 *    width themselves); forgetting `<` vs `<=` when heights tie (either
 *    pointer may move on a tie, it doesn't affect correctness).
 * 4. Follow-ups: Trapping Rain Water (LeetCode 42 — sums water at EVERY bar,
 *    not just the max between two bars; see `trappingRainWater.ts`); 3Sum
 *    Closest-style variants that also collapse an O(n²) pair search to O(n).
 */
