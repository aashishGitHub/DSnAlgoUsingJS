/**
 * ============================================================================
 * BIT MANIPULATION (LeetCode 191, 338, 190, 268, 371, 136, 137, 260, 50, 66)
 * ============================================================================
 *
 * PATTERN:
 * - Treat a number as an ARRAY OF 32 BITS you can test, set, clear and shift in
 *   O(1). Problems that look like counting or searching collapse to a couple of
 *   bitwise operations once you stop thinking in decimal.
 *
 * ============================================================================
 * THE FIVE IDENTITIES THAT SOLVE ALMOST EVERY BIT PROBLEM
 * ============================================================================
 *   1. x ^ x   = 0        and   x ^ 0 = x        → XOR cancels duplicates
 *   2. XOR is commutative and associative        → order of cancelling is free
 *   3. x & 1               → is the lowest bit set? (odd/even test)
 *   4. x & (x - 1)         → clears the LOWEST set bit   (Brian Kernighan)
 *   5. x & -x              → isolates the LOWEST set bit
 *
 * Identity 1+2 is the engine behind Single Number and Missing Number: pair
 * everything up, and whatever is unpaired survives. Identity 4 turns bit
 * counting from "32 steps always" into "one step per SET bit".
 *
 * ============================================================================
 * ⚠️ JAVASCRIPT-SPECIFIC TRAPS (these do not exist in C++/Java/Go)
 * ============================================================================
 * - Bitwise operators coerce to **32-bit SIGNED** integers. Anything above
 *   2³¹-1 wraps to negative, so `1 << 31` is -2147483648, not 2147483648.
 * - `>>` is ARITHMETIC (sign-propagating): -1 >> 1 is still -1, so a loop
 *   `while (n) n >>= 1` on a negative number NEVER TERMINATES.
 *   Use `>>>` (logical/zero-fill) whenever the value may be negative — this is
 *   the single most common JS bit-manipulation bug.
 * - `>>> 0` is the idiom for "reinterpret these 32 bits as unsigned", needed
 *   whenever a result should be read as a positive number (see reverseBits).
 * - Numbers are doubles: bitwise ops silently truncate past 32 bits, so these
 *   techniques do not extend to large integers without BigInt.
 *
 * RECOGNITION CUES:
 * - "every element appears twice except one"     → XOR everything
 * - "count the 1 bits / set bits"                → n & (n-1) loop
 * - "without using + or -"                       → XOR = sum, AND<<1 = carry
 * - "0..n with one missing"                      → XOR indices against values
 * - "count bits for every i up to n"             → DP on i >> 1
 *
 * REAL-WORLD ANALOGIES:
 * - Permission/feature flags packed into one integer (chmod, bitmasks).
 * - Checksums and parity bits detecting a single corrupted item.
 * - Bloom filters and bitsets for compact set membership.
 * - Subset enumeration: an n-bit number IS a subset of an n-element set.
 *
 * COMPLEXITY SUMMARY:
 *   hammingWeight        O(set bits)  Space O(1)
 *   countBits            O(n)         Space O(n) output
 *   reverseBits          O(32)        Space O(1)
 *   missingNumberXOR     O(n)         Space O(1)
 *   getSum               O(32)        Space O(1)
 *   singleNumberXOR      O(n)         Space O(1)
 * ============================================================================
 */

/**
 * ----------------------------------------------------------------------------
 * APPROACH 1 — NUMBER OF 1 BITS, naive (LeetCode 191)
 * ----------------------------------------------------------------------------
 * Check all 32 bits one at a time. Always exactly 32 iterations, however few
 * bits are actually set.
 *
 * ⚠️ Note `>>>` not `>>`: with a negative input (the top bit set), `>>` keeps
 * feeding in 1s and the loop never ends.
 *
 * @example
 * hammingWeightNaive(11); // 3  (1011 has three 1s)
 *
 * Time: O(32). Space: O(1).
 */
export function hammingWeightNaive(n: number): number {
  let count = 0;
  let bits = n >>> 0; // reinterpret as unsigned

  while (bits !== 0) {
    count += bits & 1; // test the lowest bit
    bits >>>= 1;       // LOGICAL shift — >> would loop forever on negatives
  }

  return count;
}

/**
 * ----------------------------------------------------------------------------
 * APPROACH 2 — NUMBER OF 1 BITS ★ OPTIMAL, Brian Kernighan (LeetCode 191)
 * ----------------------------------------------------------------------------
 * WHY `n & (n - 1)` CLEARS THE LOWEST SET BIT:
 * Subtracting 1 flips the lowest set bit to 0 and turns every 0 below it into
 * 1. ANDing with the original keeps only the bits above that position.
 *
 *     n     = 1011 0000
 *     n - 1 = 1010 1111     (lowest set bit flipped, everything below flipped up)
 *     n&n-1 = 1010 0000     ← exactly one set bit removed
 *
 * So the loop runs once per SET bit, not once per bit. For sparse numbers
 * (flags, masks) that is a large constant-factor win, and the trick reappears
 * in "is this a power of two?" (`n > 0 && (n & (n-1)) === 0`).
 *
 * DRY-RUN on n = 11 (1011):
 *   1011 & 1010 = 1010   count 1
 *   1010 & 1001 = 1000   count 2
 *   1000 & 0111 = 0000   count 3 → done in 3 steps, not 32
 *
 * @example
 * // Real-world: how many permission flags are enabled in this bitmask?
 * hammingWeight(11);         // 3
 * hammingWeight(128);        // 1
 * hammingWeight(4294967293); // 31
 *
 * Time: O(number of set bits). Space: O(1).
 */
export function hammingWeight(n: number): number {
  let count = 0;
  let bits = n >>> 0;

  while (bits !== 0) {
    bits &= bits - 1; // drop the lowest set bit
    count++;
  }

  return count;
}

/**
 * ----------------------------------------------------------------------------
 * COUNTING BITS (LeetCode 338) ★ DP ON BITS
 * ----------------------------------------------------------------------------
 * PROBLEM: return an array where result[i] is the number of 1 bits in i, for
 * every i from 0 to n.
 *
 * The brute force calls hammingWeight n times → O(n log n). The DP insight
 * makes it O(n):
 *
 *   i >> 1 is i with its LAST bit removed. So i has the same bits as i >> 1,
 *   plus possibly one more — exactly the bit `i & 1`.
 *
 *       result[i] = result[i >> 1] + (i & 1)
 *
 * Every value reuses an answer already computed for a SMALLER index, which is
 * why this is genuinely dynamic programming rather than a bit trick.
 *
 * DRY-RUN for n = 5:
 * ┌───┬────────┬───────────┬─────────────────────────┬────────┐
 * │ i │ binary │ i >> 1    │ result[i>>1] + (i & 1)  │ result │
 * ├───┼────────┼───────────┼─────────────────────────┼────────┤
 * │ 0 │ 000    │ base      │ 0                       │ 0      │
 * │ 1 │ 001    │ 0 (000)   │ 0 + 1                   │ 1      │
 * │ 2 │ 010    │ 1 (001)   │ 1 + 0                   │ 1      │
 * │ 3 │ 011    │ 1 (001)   │ 1 + 1                   │ 2      │
 * │ 4 │ 100    │ 2 (010)   │ 1 + 0                   │ 1      │
 * │ 5 │ 101    │ 2 (010)   │ 1 + 1                   │ 2   ✨ │
 * └───┴────────┴───────────┴─────────────────────────┴────────┘
 * → [0, 1, 1, 2, 1, 2]
 *
 * @example
 * countBits(2); // [0, 1, 1]
 * countBits(5); // [0, 1, 1, 2, 1, 2]
 *
 * Time: O(n) — one O(1) step per value. Space: O(n) for the output.
 */
export function countBits(n: number): number[] {
  const result = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // i >> 1 drops i's last bit; (i & 1) adds it back if it was set.
    result[i] = result[i >> 1] + (i & 1);
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * REVERSE BITS (LeetCode 190)
 * ----------------------------------------------------------------------------
 * Reverse the order of all 32 bits of an unsigned integer.
 *
 * MECHANISM: pull bits off the BOTTOM of the input and push them onto the
 * BOTTOM of the result, shifting the result left each round. The first bit
 * pulled ends up highest — a reversal, the same way reversing a string by
 * popping from one end and pushing to the other.
 *
 * ⚠️ The loop must run all 32 times even after n hits 0, because leading zeros
 * in the input are TRAILING zeros in the output and still need shifting in.
 * Stopping early is the classic wrong answer here.
 *
 * ⚠️ `>>> 0` on the return is mandatory in JS: without it, a result whose top
 * bit is set comes back NEGATIVE, because `<<` produces a signed 32-bit value.
 *
 * DRY-RUN (shown on 8 bits for readability; the real loop does 32):
 *   n = 0000 0011
 *   step 1: result = 0000 0001,  n = 0000 0001
 *   step 2: result = 0000 0011,  n = 0000 0000
 *   steps 3-8: result keeps shifting left, appending 0s → 1100 0000
 *
 * @example
 * reverseBits(43261596); // 964176192
 * reverseBits(1);        // 2147483648  (needs the >>> 0 to stay positive)
 *
 * Time: O(32). Space: O(1).
 */
export function reverseBits(n: number): number {
  let result = 0;
  let bits = n >>> 0;

  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (bits & 1); // shift result up, append n's low bit
    bits >>>= 1;                          // LOGICAL shift, never >>
  }

  return result >>> 0; // reinterpret as unsigned, or the top bit reads negative
}

/**
 * ----------------------------------------------------------------------------
 * MISSING NUMBER (LeetCode 268) — the XOR solution
 * ----------------------------------------------------------------------------
 * Given n distinct numbers from the range [0, n], find the missing one.
 *
 * Named `missingNumberXOR` because the repo already solves this two other ways:
 * `CyclicSort/cyclicSort.ts` → `missingNumber` (index placement) and
 * `HashMap/hashSetPatterns.ts` → `missingNumberSet`. Three solutions, three
 * patterns, same problem — a good self-test of pattern recognition.
 *
 * THE INSIGHT: XOR every INDEX (0..n) and every VALUE together. Each number
 * that IS present appears exactly twice — once as an index, once as a value —
 * and cancels via x ^ x = 0. The missing number appears only as an index, so it
 * is the sole survivor.
 *
 * WHY XOR BEATS THE GAUSS SUM: the arithmetic solution n(n+1)/2 - sum is also
 * O(n)/O(1) and is worth mentioning, but it can OVERFLOW for large n in
 * fixed-width languages. XOR never overflows. Naming that trade-off is the
 * point of the question.
 *
 * DRY-RUN on [3, 0, 1] (n = 3, so indices 0..3):
 *   start 0
 *   ^0 ^3 → 3        (index 0, value 3)
 *   ^1 ^0 → 2        (index 1, value 0)
 *   ^2 ^1 → 1        (index 2, value 1)
 *   ^3    → 2        (final index 3, no value)
 *   → 2  ✨   0,1,3 each cancelled themselves; 2 was never a value.
 *
 * @example
 * // Real-world: which sequence number never arrived in this batch?
 * missingNumberXOR([3, 0, 1]);          // 2
 * missingNumberXOR([0, 1]);             // 2
 * missingNumberXOR([9,6,4,2,3,5,7,0,1]);// 8
 *
 * Time: O(n) single pass. Space: O(1) — no set, no sort.
 */
export function missingNumberXOR(nums: number[]): number {
  let result = nums.length; // seed with n: the one index the loop cannot reach

  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i]; // every present number cancels itself out
  }

  return result;
}

/**
 * ----------------------------------------------------------------------------
 * SUM OF TWO INTEGERS (LeetCode 371) — add without + or -
 * ----------------------------------------------------------------------------
 * REBUILD ADDITION FROM ITS TWO HALVES:
 *   a ^ b        = the sum of each column IGNORING carries
 *   (a & b) << 1 = the carries, shifted into the column they belong to
 * Add those two together — which means repeating the same step — until there
 * is nothing left to carry.
 *
 * This works unchanged for NEGATIVE numbers because two's complement makes
 * subtraction just addition of a negative, and JS's 32-bit wrapping matches
 * the hardware exactly.
 *
 * DRY-RUN on a = 2 (0010), b = 3 (0011):
 *   round 1: sum = 0010 ^ 0011 = 0001    carry = (0010 & 0011) << 1 = 0100
 *   round 2: sum = 0001 ^ 0100 = 0101    carry = (0001 & 0100) << 1 = 0000
 *   carry is 0 → answer 0101 = 5  ✨
 *
 * @example
 * getSum(1, 2);   // 3
 * getSum(2, 3);   // 5
 * getSum(-2, 3);  // 1
 * getSum(-1, -1); // -2
 *
 * Time: O(32) — at most one round per bit position. Space: O(1).
 */
export function getSum(a: number, b: number): number {
  let sum = a;
  let carry = b;

  while (carry !== 0) {
    const withoutCarry = sum ^ carry;       // column sums, carries ignored
    carry = (sum & carry) << 1;             // where carries land
    sum = withoutCarry;
  }

  return sum;
}

/**
 * ----------------------------------------------------------------------------
 * SINGLE NUMBER (LeetCode 136) — the XOR solution
 * ----------------------------------------------------------------------------
 * Every element appears twice except one. Find it in O(1) space.
 *
 * Named `singleNumberXOR` because `HashMap/hashSetPatterns.ts` already has
 * `singleNumber` using a Set — whose own comment admits "optimal uses XOR".
 * This is that version.
 *
 * THE INSIGHT: XOR the whole array. Pairs annihilate (x ^ x = 0) and, because
 * XOR is commutative and associative, they cancel no matter how they are
 * scattered — no sorting or grouping needed. The lone element survives.
 *
 * DRY-RUN on [4, 1, 2, 1, 2]:
 *   0 ^ 4 = 4
 *   4 ^ 1 = 5
 *   5 ^ 2 = 7
 *   7 ^ 1 = 6      (the two 1s have now cancelled)
 *   6 ^ 2 = 4  ✨  (the two 2s have now cancelled) → 4 remains
 *
 * @example
 * // Real-world: which transaction in this batch was not reconciled by a pair?
 * singleNumberXOR([2, 2, 1]);       // 1
 * singleNumberXOR([4, 1, 2, 1, 2]); // 4
 *
 * Time: O(n). Space: O(1) — the Set solution needs O(n).
 */
export function singleNumberXOR(nums: number[]): number {
  let result = 0;
  for (const num of nums) result ^= num;
  return result;
}

/**
 * ----------------------------------------------------------------------------
 * SINGLE NUMBER II (LeetCode 137) — every element appears THREE times but one
 * ----------------------------------------------------------------------------
 * Plain XOR fails here: it cancels PAIRS, and three of a kind leaves one copy
 * behind. Two ways to fix it — know both.
 *
 * (a) COUNT BITS MOD 3 (the one to explain): for each of the 32 positions,
 *     count how many numbers have that bit set. Every tripled number
 *     contributes 3 (or 0), so `count % 3` leaves exactly the lone number's
 *     bits. Easy to reason about, O(32n).
 *
 * (b) TWO-STATE MACHINE (the one implemented below): `ones` holds bits seen
 *     1 mod 3 times, `twos` holds bits seen 2 mod 3 times. A bit entering the
 *     third time is masked out of both, resetting it to 0. O(n) with two
 *     variables.
 *
 *       ones = (ones ^ x) & ~twos
 *       twos = (twos ^ x) & ~ones
 *
 * DRY-RUN on [2, 2, 3, 2] tracking bit 1 (value 2):
 *   x=2: ones gains bit → ones=2, twos=0     (seen once)
 *   x=2: ones loses it, twos gains → ones=0, twos=2   (seen twice)
 *   x=3: bit0 enters ones; bit1 of 3 also set → interacts, see below
 *   x=2: bit1 seen a third time → cleared from both  → ones=3 ✨
 *
 * @example
 * singleNumberII([2, 2, 3, 2]);          // 3
 * singleNumberII([0, 1, 0, 1, 0, 1, 99]); // 99
 *
 * Time: O(n). Space: O(1).
 */
export function singleNumberII(nums: number[]): number {
  let ones = 0; // bits that have appeared 1 time (mod 3)
  let twos = 0; // bits that have appeared 2 times (mod 3)

  for (const num of nums) {
    // A bit already in `twos` is blocked from entering `ones`.
    ones = (ones ^ num) & ~twos;
    // Then a bit now in `ones` is blocked from staying in `twos`.
    // On a bit's THIRD appearance both masks clear it — back to zero.
    twos = (twos ^ num) & ~ones;
  }

  return ones; // the lone number was seen exactly once
}

/**
 * ----------------------------------------------------------------------------
 * SINGLE NUMBER III (LeetCode 260) — TWO elements appear once, rest twice
 * ----------------------------------------------------------------------------
 * XOR of everything gives `a ^ b` — the two answers tangled together. The trick
 * is to SPLIT the array so a and b land in different halves, then XOR each half
 * separately.
 *
 * HOW TO SPLIT: any set bit in `a ^ b` marks a position where a and b DIFFER.
 * Take the lowest such bit with `x & -x`. Partitioning by that bit puts a and b
 * on opposite sides, while every duplicate pair stays together (both copies
 * have identical bits) and cancels within its own half.
 *
 * WHY `x & -x` ISOLATES THE LOWEST SET BIT: in two's complement, -x is
 * ~x + 1, which inverts everything above the lowest set bit and leaves that bit
 * set — so the AND keeps exactly that one bit.
 *
 *     x    = 1011 0100
 *     -x   = 0100 1100
 *     x&-x = 0000 0100   ← only the lowest set bit survives
 *
 * DRY-RUN on [1, 2, 1, 3, 2, 5]:
 *   XOR all → 3 ^ 5 = 6 (0110)
 *   lowest set bit of 6 → 2 (0010)
 *   bucket with bit set:   2, 3, 2  → XOR = 3
 *   bucket without:        1, 1, 5  → XOR = 5
 *   → [3, 5]  ✨
 *
 * @example
 * singleNumberIII([1, 2, 1, 3, 2, 5]); // [3, 5]  (order not guaranteed)
 *
 * Time: O(n) — two passes. Space: O(1).
 */
export function singleNumberIII(nums: number[]): number[] {
  // Pass 1: everything cancels except the two singletons, XORed together.
  let xorBoth = 0;
  for (const num of nums) xorBoth ^= num;

  // A bit where the two answers differ — the lowest one will do.
  const differingBit = xorBoth & -xorBoth;

  // Pass 2: split by that bit. Duplicates always land in the same bucket
  // as their twin and cancel; the two singletons are separated.
  let first = 0;
  let second = 0;
  for (const num of nums) {
    if ((num & differingBit) !== 0) first ^= num;
    else second ^= num;
  }

  return [first, second];
}

/**
 * ============================================================================
 * INTERVIEW NOTES (quick revision)
 * ============================================================================
 * 1. Recognition cue: "appears twice except one" → XOR. "Count set bits" →
 *    n & (n-1). "Without + or -" → XOR is the sum, (a & b) << 1 is the carry.
 *    "0..n, one missing" → XOR indices against values.
 * 2. The two identities to be able to DERIVE, not just recite:
 *      n & (n - 1) clears the lowest set bit → also the O(1) power-of-two test
 *                                              `n > 0 && (n & (n-1)) === 0`.
 *      n & -n      isolates the lowest set bit → the splitter in LC260.
 * 3. JS-specific and worth saying out loud: bitwise ops are 32-bit SIGNED.
 *    Use `>>>` not `>>` whenever a value may be negative (`>>` on a negative
 *    loops forever), and `>>> 0` to read a result as unsigned.
 * 4. XOR vs Gauss sum for Missing Number: both O(n)/O(1); XOR cannot overflow.
 *    Mentioning the overflow trade-off is the differentiator on that question.
 * 5. Plain XOR only cancels PAIRS. Three-of-a-kind (LC137) needs either
 *    bit-counting mod 3 or the ones/twos state machine; two singletons (LC260)
 *    need a partition on a differing bit.
 * 6. Complexity talking point: Brian Kernighan turns bit counting from a fixed
 *    32 iterations into one per SET bit — same O, much better on sparse masks.
 * 7. Follow-ups you may get: subset enumeration (iterate 0..2ⁿ-1, bit i means
 *    "include element i" — the bitmask route to LC78 Subsets), swapping without
 *    a temp via XOR, and bitmask DP for travelling-salesman-style problems.
 */

/**
 * ============================================================================
 * POW(X, N) — EXPONENTIATION BY SQUARING (LeetCode 50)
 * ============================================================================
 * PROBLEM: compute x raised to the power n, where n may be negative.
 *
 * WHY IT BELONGS IN A BIT FILE: the fast algorithm is literally reading n's
 * BINARY EXPANSION. Multiplying x by itself n times is O(n); squaring the base
 * while halving the exponent is O(log n), and "halve the exponent" is `n >> 1`
 * while "is this bit set" is `n & 1`. Identities 3 and 4 from the top of this
 * file, applied to arithmetic instead of to a mask.
 *
 * ============================================================================
 * 🔑 THE IDEA
 * ============================================================================
 *   x¹⁰ = (x²)⁵            — an EVEN exponent just squares the base
 *   x⁵  = x · (x²)²        — an ODD exponent peels off one factor of x first
 *
 * So walk n's bits from the bottom: every step squares the base, and whenever
 * the current bit is 1 you multiply that base into the answer. That is exactly
 * "sum of powers of two" turned into "product of squarings".
 *
 * DRY-RUN x = 2, n = 10 (binary 1010):
 *   result = 1, base = 2
 *   n=1010, bit 0 = 0 → skip;      base = 4     n → 101
 *   n=101,  bit 0 = 1 → result = 4; base = 16   n → 10
 *   n=10,   bit 0 = 0 → skip;      base = 256   n → 1
 *   n=1,    bit 0 = 1 → result = 4·256 = 1024   n → 0   ✓ (2¹⁰ = 1024)
 *   Four iterations instead of ten multiplications — and 30 instead of a
 *   billion when n is large, which is the whole point.
 *
 * ============================================================================
 * ⚠️ THE TRAPS, in the order they bite
 * ============================================================================
 * 1. NEGATIVE n: x⁻ⁿ = 1/xⁿ. Invert x and negate n up front, and do it
 *    BEFORE the loop — `n >> 1` on a negative number sign-extends and never
 *    reaches 0, so the loop would spin forever (see the JS traps section at
 *    the top of this file).
 * 2. n = -2³¹: negating it overflows a 32-bit signed int. Because this
 *    function works in JS doubles rather than int32 arithmetic, plain
 *    `n = -n` is safe here — but say the word "overflow" in an interview,
 *    because in C++/Java you must widen to a 64-bit type first.
 * 3. Do NOT use `>>` for the halving here for the same reason as (1); the
 *    code below divides explicitly with Math.floor so the intent is obvious
 *    and n is known non-negative by then.
 *
 * @example
 * myPow(2, 10);    // 1024
 * myPow(2, -2);    // 0.25
 * myPow(2.1, 3);   // 9.261000000000001
 * myPow(5, 0);     // 1
 *
 * Time:  O(log n) — one squaring per bit of n.
 * Space: O(1) — iterative, no recursion stack.
 */
export function myPow(x: number, n: number): number {
    // Handle a negative exponent FIRST, so the loop only ever sees n >= 0.
    if (n < 0) {
        x = 1 / x;
        n = -n;
    }

    let result = 1;
    let base = x;

    while (n > 0) {
        // Bit set → this power of two is part of the exponent, so fold it in.
        if (n & 1) {
            result *= base;
        }
        base *= base;              // move to the next power of two
        n = Math.floor(n / 2);     // consume that bit
    }

    return result;
}

/**
 * ============================================================================
 * PLUS ONE — INCREMENT A DIGIT ARRAY (LeetCode 66)
 * ============================================================================
 * PROBLEM: a non-negative integer is given as an array of decimal digits, most
 * significant first. Add one and return the resulting digit array.
 *
 * WHY IT IS HERE: it is CARRY PROPAGATION in base 10, and `getSum` above is
 * the same algorithm in base 2. Seeing them side by side is the point — one
 * uses XOR and AND to find the sum and carry bits, this one uses %10 and /10.
 * "Addition is digits plus a carry" is the shared idea; the base is a detail.
 *
 * ============================================================================
 * 🔑 THE ONLY INTERESTING CASE IS ALL NINES
 * ============================================================================
 * Walk from the LAST digit backwards:
 *   - digit < 9 → increment it and you are done. Return immediately; every
 *     digit to its left is unchanged, so there is nothing else to do.
 *   - digit === 9 → it becomes 0 and the carry moves left.
 *
 * If the loop finishes without returning, every digit was a 9. The number grew
 * a digit: [9,9,9] → [1,0,0,0]. That length change is the whole problem, and
 * it is why you cannot just mutate in place and return.
 *
 * DRY-RUN [1,2,9]:
 *   i=2: 9 → set to 0, carry on
 *   i=1: 2 < 9 → 3, return [1,3,0]  ✓
 *
 * DRY-RUN [9,9]:
 *   i=1: 9 → 0
 *   i=0: 9 → 0
 *   loop ends, all were nines → prepend 1 → [1,0,0]  ✓
 *
 * ⚠️ WHY NOT CONVERT TO A NUMBER, ADD ONE, AND CONVERT BACK? Because the
 * array can be longer than JavaScript's exact integer range (2⁵³ ≈ 16 digits),
 * and the conversion silently loses precision. LeetCode's constraints allow
 * 100 digits. Digit-wise carrying has no such limit — worth saying out loud,
 * since it is the reason the problem is posed with an array at all.
 *
 * @example
 * plusOne([1, 2, 3]); // [1, 2, 4]
 * plusOne([1, 2, 9]); // [1, 3, 0]
 * plusOne([9, 9, 9]); // [1, 0, 0, 0]  — the array grows
 * plusOne([0]);       // [1]
 *
 * Time:  O(n) — worst case (all nines) touches every digit.
 * Space: O(1) extra if mutating in place; O(n) on the all-nines path, which
 *        must allocate a longer array.
 */
export function plusOne(digits: number[]): number[] {
    const result = [...digits]; // do not mutate the caller's array

    for (let i = result.length - 1; i >= 0; i--) {
        if (result[i] < 9) {
            result[i]++;
            return result; // no carry out — everything left of here is final
        }
        result[i] = 0;     // 9 + 1 = 10 → write 0, carry left
    }

    // Fell out of the loop, so every digit was 9 and the number gained a digit.
    return [1, ...result];
}
