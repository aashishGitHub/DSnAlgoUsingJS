/**
 * MOVE ZEROS PATTERN - GENERALIZED PARTITION VARIATIONS
 *
 * The core problem (LeetCode 283, "move zeros to the end") lives in
 * `moveZeros.ts` with the full brute-force → optimized writeup. Every
 * function below is the SAME write-pointer partitioning idea, just with a
 * different predicate: "is this element zero?" becomes "is it negative?",
 * "is it even?", "does it match a caller-supplied condition?", etc.
 * Recognizing that they're all one pattern (see `partitionByCondition`,
 * which makes the predicate a parameter) is the real skill being practiced.
 *
 * Practice versions of these problems (with blanked-out bodies) live in
 * `moveZeros_practice_problems.ts` — try those first, then compare here.
 */

// ========== BASIC VARIATIONS - SOLUTIONS ==========

/**
 * Solution 1: Move Negative Numbers to End
 * Pattern: Same as move zeros, but condition is num < 0 — with one crucial
 * difference from moveZeros: negatives are DISTINCT values, not interchangeable
 * zeros, so their relative order must be tracked explicitly, not just refilled.
 *
 * BUG FOUND while adding tests for this file: the original version of this
 * function did a naive "two overwrite passes over the same array" — but the
 * second pass re-reads `nums[i]` AFTER the first pass already overwrote part
 * of the array, silently losing negative values. e.g. on [1,-2,3,-4,5], pass 1
 * produces [1,3,5,-4,5] (note: the -2 is already gone, clobbered by the `3`
 * written over it) before pass 2 even starts looking for negatives. Collecting
 * the negatives into a side list DURING the first pass (like `moveMultipleValues`
 * already does) fixes this.
 *
 * Time: O(n). Space: O(k) where k = count of negatives (needed to remember
 * their values+order — see `moveNegativesToEndSwap` for the O(1)-space
 * alternative and the trade-off it makes instead).
 */
function moveNegativesToEnd(nums: number[]): void {
    let writeIndex = 0;
    const negatives: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] >= 0) {
            nums[writeIndex++] = nums[i];
        } else {
            negatives.push(nums[i]);
        }
    }

    for (const val of negatives) {
        nums[writeIndex++] = val;
    }
}

/**
 * Solution 1 Alternative: Using swap approach (O(1) space)
 *
 * TRADE-OFF vs `moveNegativesToEnd` above: this reliably preserves the
 * relative order of the KEPT group (non-negatives end up in their original
 * order), but does NOT guarantee the relative order of the DISPLACED group
 * (negatives can end up reordered). e.g. [1,-2,3,-4,5] → [1,3,5,-4,-2], not
 * [1,3,5,-2,-4]. This is the same reason `moveZeroes`'s swap trick "just
 * works" for zeros — zeros are interchangeable, so nobody can observe them
 * being "out of order." Once the displaced values are distinct, single-pass
 * swapping can no longer promise that for free; only use this version when
 * the displaced group's internal order genuinely doesn't matter.
 */
function moveNegativesToEndSwap(nums: number[]): void {
    let left = 0;

    for (let right = 0; right < nums.length; right++) {
        if (nums[right] >= 0) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
        }
    }
}

/**
 * Solution 2: Move Even Numbers to Front
 *
 * Uses the same "collect the displaced group into a side list" fix as
 * `moveNegativesToEnd` — a single-pass swap (like `moveNegativesToEndSwap`)
 * would NOT reliably preserve the relative order of the displaced odd
 * numbers (verified: swapping [1,2,3,4,5,6] scrambles the odds to [1,5,3]
 * instead of [1,3,5]), which would break the "maintaining relative order of
 * odd numbers" guarantee this problem explicitly asks for.
 *
 * Time: O(n). Space: O(k) where k = count of odd numbers.
 */
function moveEvensToFront(nums: number[]): void {
    let evenIndex = 0;
    const odds: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] % 2 === 0) {
            nums[evenIndex++] = nums[i];
        } else {
            odds.push(nums[i]);
        }
    }

    for (const val of odds) {
        nums[evenIndex++] = val;
    }
}

/**
 * Solution 3: Move Specific Value to End
 */
function moveValueToEnd(nums: number[], val: number): void {
    let writeIndex = 0;
    
    // Move all non-target values to front
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Fill remaining with target value
    while (writeIndex < nums.length) {
        nums[writeIndex++] = val;
    }
}

// ========== OPTIMIZED SOLUTIONS ==========

/**
 * Solution 6: Move Zeros - Minimize Swaps
 * Only swap when necessary (when we encounter a zero followed by non-zero)
 */
function moveZerosMinSwaps(nums: number[]): number {
    let swaps = 0;
    let writePos = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            if (i !== writePos) {
                [nums[writePos], nums[i]] = [nums[i], nums[writePos]];
                swaps++;
            }
            writePos++;
        }
    }
    
    return swaps;
}

/**
 * Solution 7: Move Zeros - No Swaps (Overwrite Method)
 */
function moveZerosNoSwaps(nums: number[]): void {
    let writeIndex = 0;
    
    // First pass: overwrite with non-zeros
    // it shifts non zeros to left even if there are multiple non zeros
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Second pass: fill remaining with zeros
    while (writeIndex < nums.length) {
        nums[writeIndex++] = 0;
    }
}

// ========== ADVANCED VARIATIONS ==========

/**
 * Solution 8: Move Multiple Values
 *
 * @example
 * const nums = [1, 2, 3, 2, 4, 2, 5];
 * moveMultipleValues(nums, [2, 4]);
 * // nums is now [1, 3, 5, 2, 2, 4, 2] — 2's and 4's moved to the end, in the
 * // order they were originally encountered (not grouped by distinct value)
 */
function moveMultipleValues(nums: number[], toMove: number[]): void {
    const toMoveSet = new Set(toMove); // O(1) membership checks below
    let writeIndex = 0;
    const moved: number[] = [];

    // Collect non-target values and target values separately
    for (let i = 0; i < nums.length; i++) {
        if (!toMoveSet.has(nums[i])) {
            nums[writeIndex++] = nums[i];
        } else {
            moved.push(nums[i]);
        }
    }

    // Append moved values at the end
    for (const val of moved) {
        nums[writeIndex++] = val;
    }
}

/**
 * Solution 9: Partition Array by Condition — the general form every solution
 * above specializes (moveZeros = `condition: n => n !== 0`, moveEvensToFront
 * = `condition: n => n % 2 === 0`, etc). Uses the same side-list fix as
 * `moveNegativesToEnd`/`moveEvensToFront` so it genuinely preserves relative
 * order on BOTH sides of the partition for an arbitrary predicate — a plain
 * single-pass swap can't promise that in general (see `moveNegativesToEndSwap`).
 *
 * @example
 * partitionByCondition([1, 8, 3, 9, 2, 7], n => n > 5);
 * // [8, 9, 7, 1, 3, 2]
 */
function partitionByCondition(nums: number[], condition: (n: number) => boolean): void {
    let writeIndex = 0;
    const rest: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        if (condition(nums[i])) {
            nums[writeIndex++] = nums[i];
        } else {
            rest.push(nums[i]);
        }
    }

    for (const val of rest) {
        nums[writeIndex++] = val;
    }
}

/**
 * Solution 10: Move Zeros - Return New Array
 */
function moveZerosNewArray(nums: number[]): number[] {
    const result: number[] = [];
    let zeroCount = 0;
    
    // Add non-zeros first
    for (const num of nums) {
        if (num !== 0) {
            result.push(num);
        } else {
            zeroCount++;
        }
    }
    
    // Add zeros at the end
    for (let i = 0; i < zeroCount; i++) {
        result.push(0);
    }
    
    return result;
}

// ========== STRING VARIATIONS ==========

/**
 * Solution 11: Move Spaces to End
 */
function moveSpacesToEnd(chars: string[]): void {
    let writeIndex = 0;
    
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== ' ') {
            [chars[writeIndex], chars[i]] = [chars[i], chars[writeIndex]];
            writeIndex++;
        }
    }
}

/**
 * Solution 12: Move Vowels to Front
 *
 * Side-list fix again: a single-pass swap here scrambles the consonant
 * order (verified: ['h','e','l','l','o'] swaps to ['e','o','l','l','h'], not
 * ['e','o','h','l','l']) for the same reason `moveEvensToFront`'s swap
 * version would — consonants are distinct, unlike moveZeroes' zeros.
 */
function moveVowelsToFront(chars: string[]): void {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    let writeIndex = 0;
    const consonants: string[] = [];

    for (let i = 0; i < chars.length; i++) {
        if (vowels.has(chars[i])) {
            chars[writeIndex++] = chars[i];
        } else {
            consonants.push(chars[i]);
        }
    }

    for (const c of consonants) {
        chars[writeIndex++] = c;
    }
}

// ========== KEY INSIGHTS AND PATTERNS ==========

/**
 * PATTERN RECOGNITION GUIDE:
 *
 * 1. TWO-POINTER TECHNIQUE:
 *    - Use when you need to partition/rearrange array elements
 *    - One pointer tracks "write position", other scans the array
 *    - Reliably maintains relative order of the FRONT (kept/matched) group
 *
 * 2. SWAP vs OVERWRITE-WITH-SIDE-LIST — the real trade-off (found while
 *    adding tests for this file; both this guide and a couple of the
 *    functions above originally overstated what plain swapping guarantees):
 *    - Swap (`moveNegativesToEndSwap`): O(1) extra space, but the DISPLACED
 *      group's relative order is NOT guaranteed once its values are distinct.
 *      It "just works" for `moveZeroes` specifically because zeros are
 *      interchangeable — there's no such thing as zeros being "out of order."
 *    - Overwrite + side list (`moveNegativesToEnd`, `moveEvensToFront`,
 *      `partitionByCondition`, `moveVowelsToFront`): O(k) extra space
 *      (k = size of the displaced group), but preserves relative order on
 *      BOTH sides of the partition — the correct choice whenever the
 *      displaced group's order actually matters.
 *    - True in-place (O(1) space) stable partitioning of BOTH groups is a
 *      known hard problem in general — it needs more than a single swap-pass
 *      (e.g. block-rotation techniques), which is why the honest answer here
 *      is "pick O(1) space or full stability, not both," not a free lunch.
 *
 * 3. WHEN TO USE EACH APPROACH:
 *    - Swap: displaced group's order doesn't matter, or space is critical.
 *    - Overwrite + side list: displaced group's order must be preserved.
 *
 * 4. COMPLEXITY ANALYSIS:
 *    - Time: O(n) for all approaches — single pass through the array.
 *    - Space: O(1) for swap-based; O(k) for overwrite-with-side-list.
 *
 * 5. EDGE CASES TO ALWAYS TEST:
 *    - Empty array
 *    - Single element (target and non-target)
 *    - All elements are target
 *    - No target elements
 *    - Target elements at beginning/end/scattered
 *    - Multiple functions solving "the same" problem should be cross-tested
 *      against EACH OTHER, not just against a hand-picked example — that's
 *      exactly what surfaced the bugs documented above.
 */

export {
    moveNegativesToEnd,
    moveNegativesToEndSwap,
    moveEvensToFront,
    moveValueToEnd,
    moveZerosMinSwaps,
    moveZerosNoSwaps,
    moveMultipleValues,
    partitionByCondition,
    moveZerosNewArray,
    moveSpacesToEnd,
    moveVowelsToFront
};
