/**
 * ============================================================================
 * 3SUM (LeetCode 15) — plus a simpler "first triplet to target" warm-up
 * ============================================================================
 *
 * PROBLEM STATEMENT (the real problem — LeetCode 15):
 * Given an integer array `nums`, return ALL unique triplets [nums[i],nums[j],nums[k]]
 * (i != j != k) such that nums[i] + nums[j] + nums[k] === 0. No duplicate triplets.
 *
 *   Input:  [-1,0,1,2,-1,-4]
 *   Output: [[-1,-1,2],[-1,0,1]]
 *
 * This file also keeps a simpler WARM-UP variant (`findSumOfThree1`): given an
 * arbitrary `target` (not necessarily 0), return just the FIRST triplet found
 * that sums to it. Useful as the "can I even do 3Sum with two pointers" check
 * before tackling the harder all-unique-triplets version.
 *
 * PATTERN:
 * - **Two Pointers**, applied one level up: 3Sum reduces to "fix one element,
 *   then solve 2Sum on the rest with two pointers on a SORTED array."
 *   Sorting is what makes two pointers possible (monotonic left/right moves).
 *
 * WHEN TO USE:
 * - "Find k numbers that sum to X" on an array → sort, fix (k-2) of them with
 *   loops/recursion, solve the last 2 with two pointers. Same idea powers 4Sum.
 *
 * REAL-WORLD ANALOGIES:
 * - Budgeting: "find 3 expense categories whose costs cancel out a refund."
 * - Chemistry/finance triads: find 3 measurements that net to a target balance.
 * - Combinatorial testing: find 3 config flags whose numeric effects cancel out.
 *
 * COMPLEXITY SUMMARY (n = nums.length):
 *   Approach 1  Brute force (triple loop)          Time O(n³)          Space O(n)
 *   Approach 2  findSumOfThree1 (two pointers)      Time O(n²)          Space O(1)
 *   Approach 3  threeSum ★ optimal (two pointers)   Time O(n²)          Space O(1)*
 *   Approach 4  threeSum2 (3Sum → repeated 2Sum)    Time O(n²)          Space O(n)
 *   (*) excluding the O(n) sort; output itself is O(n) in the worst case.
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — BRUTE FORCE (the naive baseline: try every triplet)
 * ----------------------------------------------------------------------------
 * Idea: three nested loops enumerate every combination i < j < k and check the
 * sum directly. Dedup by normalizing each matching triplet (sort it) and
 * tracking seen keys in a Set — otherwise [-1,-1,2] could be recorded twice
 * from different index combinations.
 *
 * Why it's slow: it re-examines every (j, k) pair for every i, even though
 * once nums is sorted, moving from one candidate pair to the next is a simple
 * pointer shift, not a fresh scan. That repeated pair-scanning is exactly what
 * Approach 2 removes.
 *
 * @example
 * threeSumBruteForce([-1, 0, 1, 2, -1, -4]);
 * // [[-1,-1,2],[-1,0,1]]  (order not guaranteed)
 *
 * Time:  O(n³)  — three nested index loops.
 * Space: O(n)   — `seen` keys + result triplets.
 */
export function threeSumBruteForce(nums: number[]): number[][] {
  const result: number[][] = [];
  const seen = new Set<string>();
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = triplet.join(",");
          if (!seen.has(key)) {
            seen.add(key);
            result.push(triplet);
          }
        }
      }
    }
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — WARM-UP: first triplet summing to an arbitrary target
 * ----------------------------------------------------------------------------
 * Simplification vs. the real 3Sum: only ONE match is needed (return as soon
 * as found), and `target` can be any number, not just 0. Sort, fix `nums[i]`,
 * then walk `low`/`high` inward on the remainder — classic two-pointer 2Sum.
 *
 * @example
 * // Real-world: "which 3 expense line items add up to exactly $10?"
 * findSumOfThree1([3, 7, 1, 2, 8, 4, 5], 10);
 * // [1, 2, 7]  (or any valid triplet — first one found)
 *
 * Time:  O(n²)  — O(n log n) sort + O(n) outer loop × O(n) two-pointer scan.
 * Space: O(1)   — in-place two pointers (ignoring the sort).
 */
export function findSumOfThree1(nums: number[], target: number): number[] {
  if (!Array.isArray(nums) || typeof target !== "number") {
    return [];
  }

  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    let low = i + 1;
    let high = nums.length - 1;

    while (low < high) {
      if (nums[i] + nums[low] + nums[high] < target) {
        low++;
      } else if (nums[i] + nums[low] + nums[high] === target) {
        return [nums[i], nums[low], nums[high]];
      } else {
        high--;
      }
    }
  }

  return [];
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 3 — TWO POINTERS ★ OPTIMAL (LeetCode 15: all unique triplets = 0)
 * ----------------------------------------------------------------------------
 * Pattern reasoning: after sorting, fix `nums[i]` and the remaining task is
 * exactly 2Sum on a sorted subarray — which two pointers solve in one pass
 * without rescanning. Skipping duplicates at BOTH the `i` level and the
 * `j`/`k` level is what keeps the output unique without a Set.
 *
 * DRY-RUN on [-1,0,1,2,-1,-4] → sorted [-4,-1,-1,0,1,2]:
 *   i=0 (-4): j=1..4, k=5 → every sum < 0 (best case -4-1+2=-3) → no match.
 *   i=1 (-1): j=2(-1),k=5(2) → sum=0 ✓ push [-1,-1,2]; shrink → j=3,k=4
 *             j=3(0), k=4(1) → sum=0 ✓ push [-1,0,1]; shrink → j=4,k=3 → stop.
 *   i=2 (-1): same as nums[i-1] → SKIP (avoids duplicate triplets from i).
 *   i=3 (0):  j=4(1),k=5(2) → sum=3 > 0 → k--; j<k fails → no match.
 *   → [[-1,-1,2],[-1,0,1]]  ✓ matches expected output.
 *
 * @example
 * threeSum([-1, 0, 1, 2, -1, -4]);
 * // [[-1,-1,2],[-1,0,1]]
 *
 * Time:  O(n²)  — O(n log n) sort + O(n) outer loop × O(n) inner two-pointer scan.
 * Space: O(1)   — extra space beyond the output (sort is in-place).
 */
export function threeSum(arr: number[]): number[][] {
  if (arr.length < 3) {
    return [];
  }
  let result: number[][] = [];
  arr.sort((a, b) => a - b);

  for (let i = 0; i < arr.length - 2; i++) {
    if (i == 0 || arr[i] != arr[i - 1]) {
      // skip duplicate `i` values → avoids duplicate triplets
      let j = i + 1;
      let k = arr.length - 1;

      while (j < k) {
        let sum = arr[i] + arr[j] + arr[k];

        if (sum == 0) {
          result.push([arr[i], arr[j], arr[k]]);

          while (j < k && arr[j] == arr[j + 1]) j++; // skip dup `j`
          while (j < k && arr[k] == arr[k - 1]) k--; // skip dup `k`
          j++;
          k--;
        } else if (sum > 0) {
          k--;
        } else {
          j++;
        }
      }
    }
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 4 — 3Sum REDUCED TO REPEATED 2Sum (alternate decomposition)
 * ----------------------------------------------------------------------------
 * Mental model: instead of inlining the two-pointer scan, name it. "3Sum" IS
 * "for each fixed first element, find all pairs that 2Sum to `-first`."
 * Making that explicit (via `twoSumAll`) is a good way to generalize toward
 * 4Sum/kSum later: kSum = fix one element + recurse into (k-1)Sum.
 *
 * @example
 * threeSum2([-1, 0, 1, 2, -1, -4]);
 * // [[-1,-1,2],[-1,0,1]]
 *
 * Time:  O(n²)  — O(n) outer loop × O(n) `twoSumAll` scan.
 * Space: O(n)   — `.slice()` per outer iteration (the trade-off for readability;
 *                 Approach 2 avoids this by scanning the same array in place).
 */
export function threeSum2(nums: number[]): number[][] {
  if (!nums || nums.length < 3) {
    return [];
  }

  const result: number[][] = [];

  const sortedNums = nums.sort((a, b) => a - b);
  for (let i = 0; i < sortedNums.length - 2; i++) {
    const first = sortedNums[i];

    // Skip duplicates for the first element
    if (i > 0 && sortedNums[i] === sortedNums[i - 1]) {
      continue;
    }

    // find all pairs whose sum is -first (so that first + second + third = 0)
    const twoSumResults = twoSumAll(sortedNums.slice(i + 1), -first);

    for (const pair of twoSumResults) {
      result.push([first, ...pair]);
    }
  }
  return result;
}

/**
 * Helper for Approach 3: find all unique pairs in a SORTED array that sum to
 * `target`, using the classic two-pointer 2Sum-II scan.
 * @param nums - already sorted ascending
 */
function twoSumAll(nums: number[], target: number): number[][] {
  const result: number[][] = [];
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) {
      const leftVal = nums[left];
      const rightVal = nums[right] === 0 ? 0 : nums[right]; // Handle -0 vs 0
      result.push([leftVal, rightVal]);

      // Skip duplicates
      while (left < right && nums[left] === leftVal) left++;
      while (left < right && nums[right] === rightVal) right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * RELATED — 3SUM CLOSEST (LeetCode 16)
 * ----------------------------------------------------------------------------
 * Same skeleton as `threeSum` (sort + fix `i` + two pointers), but instead of
 * looking for an EXACT target we track the sum closest to it. On each step we
 * compare |sum - target| against the best seen and move the pointer that
 * pushes the sum toward the target (sum < target → left++, else right--).
 * (Migrated here from the mis-categorized SlidingWindow folder — it's Two
 * Pointers, not a window.)
 *
 * @example
 * threeSumClosest([-1, 2, 1, -4], 1); // 2  (the triplet [-1,2,1] sums to 2)
 *
 * Time: O(n²). Space: O(1).
 */
export function threeSumClosest(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let closestSum = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
        closestSum = sum;
      }

      if (sum < target) {
        left++;
      } else if (sum > target) {
        right--;
      } else {
        return sum; // exact hit — can't get closer than 0 distance
      }
    }
  }

  return closestSum;
}

/**
 * ----------------------------------------------------------------------------
 * RELATED — 4SUM (LeetCode 18)
 * ----------------------------------------------------------------------------
 * The k-Sum generalization: fix the outer TWO elements with nested loops, then
 * two-pointer the remaining pair — exactly `threeSum` with one more fixed level.
 * Same duplicate-skipping discipline at every level keeps the output unique.
 * (Migrated here from SlidingWindow — same Two Pointers family as 3Sum.)
 *
 * @example
 * fourSum([1, 0, -1, 0, -2, 2], 0);
 * // [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]  (any order)
 *
 * Time: O(n³). Space: O(1) excluding output.
 */
export function fourSum(nums: number[], target: number): number[][] {
  const result: number[][] = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dup first element

    for (let j = i + 1; j < nums.length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue; // skip dup second element

      let left = j + 1;
      let right = nums.length - 1;
      const targetSum = target - nums[i] - nums[j];

      while (left < right) {
        const sum = nums[left] + nums[right];

        if (sum === targetSum) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);

          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;

          left++;
          right--;
        } else if (sum < targetSum) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  return result;
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "k numbers that sum to X" → sort + fix (k-2) elements +
 *    two pointers for the last 2. 3Sum is the base case interviewers build on
 *    (4Sum, k-Sum, "closest sum" variants all reuse this skeleton).
 * 2. Why sort first: two pointers only work because sorting makes the array
 *    monotonic — moving `left` right strictly increases the sum, moving
 *    `right` left strictly decreases it. No sort ⇒ no valid pointer direction.
 * 3. The TWO dedup rules are the classic interview trip-up:
 *      - skip duplicate `i` (outer fixed element) → prevents duplicate triplets
 *        rooted at the same value.
 *      - skip duplicate `j`/`k` AFTER a match is found → prevents the same
 *        pair being recorded twice while shrinking the window.
 * 4. Complexity talking point: O(n²) is the accepted optimal for 3Sum (no
 *    known sub-quadratic general solution) — the O(n³) brute force is the
 *    thing to name and then improve upon, not the thing to submit.
 * 5. Follow-ups you may get:
 *      - 4Sum: fix 2 elements, two-pointer the rest → O(n³).
 *      - 3Sum Closest: same skeleton, track min |sum - target| instead of
 *        exact matches.
 *      - 3Sum Smaller: count triplets with sum < target (two pointers, but
 *        count `right - left` matches per step instead of collecting them).
 */
