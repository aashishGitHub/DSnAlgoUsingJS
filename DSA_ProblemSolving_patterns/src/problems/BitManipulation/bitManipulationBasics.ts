/**
 * ============================================================================
 * BIT MANIPULATION — masks, shifts, typed arrays
 * ============================================================================
 *
 * A self-contained reference. Explanations live as doc comments next to the
 * code they explain, so the file is useful both as reading material and as a
 * working module.
 *
 * Run the built-in tests:
 *     npx tsx bit-manipulation.ts
 *     # or
 *     npx ts-node bit-manipulation.ts
 *
 * Contents
 *   0.  Mental model: positional value
 *   1.  Shifts
 *   2.  Masks
 *   3.  Classic idioms (clear/isolate lowest bit, popcount, power of two)
 *   4.  Typed arrays and ArrayBuffer
 *   5.  SeatBitset — all three combined
 *   6.  Tests
 *   7.  Exercises
 *
 * ----------------------------------------------------------------------------
 * ARCHITECTURE NOTE
 *
 * Everything here exists to serve one pattern: separate immutable structure
 * from volatile state, and send only the volatile part over the wire.
 *
 * In a seat-booking system:
 *   - Static layout (coordinates, row, section, tier) never changes.
 *     Version it, put it on a CDN, cache it for a year.
 *   - Dynamic availability (free/held/sold) changes constantly.
 *     Pack it into 2 bits per seat and push deltas over WebSocket.
 *
 * 50,000 seats as JSON is ~2 MB. As a bitset it is 12.5 KB, ~1.5 KB gzipped.
 * At 500,000 concurrent viewers that is the difference between 6 GB and 6 MB
 * of egress per full refresh.
 *
 * The advantage is not "clever bit tricks". It is that the read path becomes
 * cheap enough to fan out to an unbounded number of viewers, which is what
 * lets you keep the write path small and strictly correct.
 * ----------------------------------------------------------------------------
 */

// ============================================================================
// 0. MENTAL MODEL — POSITIONAL VALUE
// ============================================================================

/**
 * Every bit position is worth a power of two.
 *
 *     position:   7    6    5    4    3    2    1    0
 *     value:    128   64   32   16    8    4    2    1
 *
 * So 5 = 0b0101 decomposes as:
 *
 *     bit 2 (value 4) = 1  ->  4
 *     bit 0 (value 1) = 1  ->  1
 *                             ---
 *                              5
 *
 * Formally, a binary number is a sum:
 *
 *     x = b0*2^0 + b1*2^1 + b2*2^2 + ...
 *
 * Every operation below is a statement about that sum. Keep the table in your
 * head and nothing here is mysterious.
 *
 * JAVASCRIPT / TYPESCRIPT CAVEAT
 * Numbers are IEEE-754 doubles. Before any bitwise operation the runtime
 * coerces to a 32-bit SIGNED integer, operates, then converts back. Three
 * consequences, all covered below:
 *   - bit 31 is the sign bit
 *   - shift counts are taken modulo 32
 *   - `~5` is -6, not 10
 */

/** Format a number as a binary string, unsigned, zero-padded. Debug helper. */
export const bin = (n: number, width = 8): string =>
  (n >>> 0).toString(2).padStart(width, '0');

/** Format as grouped binary: 0b1010_1100. Easier to read at 16/32 bits. */
export const binGrouped = (n: number, width = 8): string =>
  '0b' + (bin(n, width).match(/.{1,4}/g) ?? []).join('_');

// ============================================================================
// 1. SHIFTS
// ============================================================================

/**
 * Q: How does `x << n` multiply by 2^n?
 *
 * A: Same trick as adding a zero in decimal.
 *
 *      5 x 10  =  50    <- shift digits left 1, pad with 0
 *      5 x 100 = 500    <- shift digits left 2, pad with 00
 *
 *    You did not multiply. You moved digits and padded. Multiplying by 10^n
 *    is a left shift of n places, BECAUSE DECIMAL IS BASE 10.
 *
 *    Binary is base 2, so the same rule gives a factor of 2 per place.
 *
 *      0b0101  =  5
 *      0b1010  = 10   <- shifted left 1
 *      0b10100 = 20   <- shifted left 2
 *
 *    Why it works, via positional value. Take 5 = 0b0101:
 *
 *      bit 2 (value 4) = 1  ->  4
 *      bit 0 (value 1) = 1  ->  1   total 5
 *
 *    Shift left by 1. Every bit moves up one position, and every position is
 *    worth twice the one below it:
 *
 *      bit 3 (value 8) = 1  ->  8
 *      bit 1 (value 2) = 1  ->  2   total 10
 *
 *    Each contribution doubled, so the total doubled. That is the whole proof.
 *
 *    Formally:
 *      x      = b0*2^0     + b1*2^1     + b2*2^2     + ...
 *      x << n = b0*2^(0+n) + b1*2^(1+n) + b2*2^(2+n) + ...
 *             = 2^n * (b0*2^0 + b1*2^1 + b2*2^2 + ...)
 *             = 2^n * x
 *
 *    2^n factors out of every term. Done.
 *
 *    WHY THE CPU CARES
 *    Multiplication is a real circuit taking multiple cycles. A shift is just
 *    wiring — bits routed to different output lines. Roughly one cycle, often
 *    folded into an addressing mode. In JS it also skips the float path, since
 *    `*` and `/` operate on doubles.
 *
 *    THE LIMIT
 *    Only powers of two. There is no shift that gives `x * 7`. You can compose
 *    (`(x << 3) - x`), but do not write that by hand — the JIT already does it.
 *    Know it so you recognise it in disassembly.
 *
 * @param n must be 0..30. At 31 you hit the sign bit; at 32 the count wraps.
 */
export const timesPowerOfTwo = (x: number, n: number): number => x << n;

/**
 * Q: How does `x >> n` divide by 2^n?
 *
 * A: The inverse. Bits move down one position, so every contribution halves.
 *    Bits falling off the bottom are discarded, and that discard IS the floor.
 *
 *      0b0111 = 7
 *      0b0011 = 3    <- 7 >> 1. The low 1 fell off. 7/2 = 3.5 -> floor 3.
 *
 *    Only valid for non-negative x if you want plain floor division. For
 *    negative x, `>>` still floors (rounds toward negative infinity), which is
 *    NOT what `Math.trunc` or C-style integer division do.
 *
 *      -7 >> 1        === -4     (floor)
 *      Math.trunc(-7/2) === -3   (toward zero)
 */
export const divPowerOfTwo = (x: number, n: number): number => x >> n;

/**
 * Q: What is the difference between >>, >>> and <<?
 *
 * A:  op    name                          fills from the left with
 *     ---------------------------------------------------------------
 *     <<    left shift                    always 0
 *     >>    arithmetic / sign-propagating copy of the sign bit
 *     >>>   logical / unsigned right      always 0
 *
 *    The difference only shows on negative numbers:
 *
 *      -8 >> 1   === -4            sign preserved
 *      -8 >>> 1  === 2147483644    sign bit treated as ordinary data
 *
 *    RULE: use `>>` when the value is a signed number, `>>>` when the bits are
 *    data rather than a number. For a seat bitset every byte is 0..255 and
 *    positive, so `>>` is safe there.
 */

/**
 * Q: Why is `1 << 31` negative?
 *
 * A: Bit 31 is the sign bit of a 32-bit signed integer. Setting it makes the
 *    value negative under two's complement.
 *
 *      1 << 31          === -2147483648
 *      (1 << 31) >>> 0  ===  2147483648
 *
 *    `>>> 0` shifts by zero but forces the unsigned interpretation on the way
 *    back to a double. It is the standard "view these 32 bits as unsigned" cast.
 *
 *    PRACTICAL RULE: keep flag bits in positions 0..30. If you need more, use
 *    two numbers or BigInt.
 */
export const asUnsigned32 = (x: number): number => x >>> 0;

/**
 * Q: Why does `1 << 32` equal 1 instead of 4294967296?
 *
 * A: JavaScript masks the shift count with `& 31`, so the count wraps at 32.
 *
 *      1 << 32  === 1
 *      1 << 33  === 2
 *
 *    Silent wrong answer, no error thrown. This is the single most common bug
 *    in hand-rolled bit code. Guard the shift count at the boundary.
 */
export const shiftCountIsSafe = (n: number): boolean =>
  Number.isInteger(n) && n >= 0 && n <= 31;

// ============================================================================
// 2. MASKS
// ============================================================================

/**
 * A mask is a number whose SET BITS MARK THE POSITIONS YOU CARE ABOUT.
 *
 * Four operations. Memorise these — everything else is composition.
 *
 *     x & mask     TEST    keep only masked bits
 *     x | mask     SET     turn masked bits on
 *     x & ~mask    CLEAR   turn masked bits off
 *     x ^ mask     TOGGLE  flip masked bits
 *
 * TRUTH TABLES — one data bit `x` against one mask bit `m`
 *
 *     AND (the TEST/CLEAR primitive)        OR (SET)
 *     x  m | x&m                            x  m | x|m
 *     -------                               -------
 *     0  0 |  0   0 always kills            0  0 |  0
 *     0  1 |  0   0 always kills            0  1 |  1   1 always forces on
 *     1  0 |  0   0 always kills            1  0 |  1
 *     1  1 |  1   only 1&1 survives         1  1 |  1
 *
 *     XOR (TOGGLE)
 *     x  m | x^m
 *     -------
 *     0  0 |  0   0 leaves x alone
 *     0  1 |  1   1 flips x
 *     1  0 |  1   0 leaves x alone
 *     1  1 |  0   1 flips x
 *
 *    Read the tables as the proof, not just a mnemonic:
 *      AND is a FILTER — a mask bit of 0 always wins and kills the data bit;
 *      a mask bit of 1 always lets the data bit through unchanged.
 *      OR is the mirror — a mask bit of 1 always wins and forces the data
 *      bit on; a mask bit of 0 lets the data bit through unchanged.
 *      XOR never forces a fixed value — a mask bit of 1 always flips the
 *      data bit, a mask bit of 0 never touches it.
 *    CLEAR is not a fifth primitive. It is AND with an inverted mask, so
 *    "0 kills" becomes "positions marked in mask become 0, everything else
 *    survives" — that is why `revoke` below is `flags & ~mask`, not a new op.
 *
 * WHY EACH WORKS
 *   & with 1 keeps, & with 0 kills          -> AND selects
 *   | with 1 forces on, | with 0 leaves     -> OR sets
 *   ~mask inverts, then & kills those bits  -> AND-NOT clears
 *   ^ with 1 flips, ^ with 0 leaves         -> XOR toggles
 *
 * BUILDING MASKS
 *     1 << n                     single bit at position n
 *     (1 << width) - 1           `width` ones at the bottom
 *     ((1 << width) - 1) << n    `width` ones starting at position n
 *
 * The middle one is the workhorse. Understand why:
 *     1 << 3       = 0b1000
 *     (1 << 3) - 1 = 0b0111   subtracting 1 from a power of 2 fills below it
 *
 * CONTROL FLOW / DATA FLOW — traced through SeatBitset.set() (full class in
 * section 5 below). `set(i, state)` is CLEAR-then-SET composed into one call
 * on a single byte. Trace `set(5, SOLD)` where byte 1 (seats 4-7) currently
 * holds [seat4=SOLD, seat5=HELD, seat6=FREE, seat7=BLOCKED]:
 *
 *   packed byte, MSB to LSB:  seat7 seat6 seat5 seat4
 *                                11    00    01    10   = 0b1100_0110
 *
 *   1. locate(5)                                        (CONTROL: which byte,
 *      -> { byte: 1, shift: 2 }                           which bit offset —
 *                                                          O(1), no branching
 *                                                          on the seat count)
 *
 *   2. mask = SEAT_MASK << shift                         (DATA: build a mask
 *      = 0b11 << 2 = 0b0000_1100                          naming seat 5's slot)
 *
 *   3. data[1] & ~mask                                    (DATA: CLEAR — zero
 *      0b1100_0110 & 0b1111_0011 = 0b1100_0010             out seat 5's 2 bits,
 *                                                           bits above/below
 *                                                           the mask survive
 *                                                           because they are
 *                                                           ANDed with 1)
 *
 *   4. (state << shift) & mask                            (DATA: SET — shift
 *      (0b10 << 2) & 0b0000_1100 = 0b0000_1000             SOLD into position,
 *                                                           then clip so an
 *                                                           out-of-range value
 *                                                           can never bleed
 *                                                           into seat 4 or 6)
 *
 *   5. step3 | step4 = 0b1100_1010                        (DATA: merge — OR
 *                                                           is safe here only
 *                                                           because step 3
 *                                                           guaranteed those
 *                                                           bits were 0)
 *
 *   6. data[1] = result                                   (CONTROL: exactly
 *                                                           one byte written)
 *
 *   Decode the result: seat7=11 BLOCKED, seat6=00 FREE, seat5=10 SOLD (new),
 *   seat4=10 SOLD — both untouched neighbours (seat4, seat6, seat7) come out
 *   byte-identical to how they went in. That is not a coincidence you have to
 *   trust; step 3's `& ~mask` and step 4's `& mask` are what make it provable.
 *
 *   `get(i)` runs only the TEST half of this: shift the field to bit 0, AND
 *   with SEAT_MASK to drop everything above it. No CLEAR/SET because a read
 *   does not mutate `data`.
 *
 *   Why trace this at all: every seat write touches exactly one byte, runs in
 *   O(1) with no loop or branch on `i`, and cannot corrupt a neighbour by
 *   construction — which is the whole reason a 50,000-seat map can be mutated
 *   at 60fps instead of rebuilt.
 */

/** Build a mask of `width` consecutive 1 bits starting at bit `shift`. */
export function makeMask(shift: number, width: number): number {
  if (width <= 0 || width > 31) throw new RangeError(`width ${width} out of range 1..31`);
  if (!shiftCountIsSafe(shift)) throw new RangeError(`shift ${shift} out of range 0..31`);
  if (shift + width > 32) throw new RangeError(`field ${shift}+${width} exceeds 32 bits`);
  return ((1 << width) - 1) << shift;
}

/**
 * Q: Why compare with `!== 0` and never `=== true`?
 *
 * A: `flags & WRITE` returns the VALUE of the bit, not a boolean.
 *    With WRITE = 0b0010, a match returns 2, not 1. `=== true` is always false.
 *
 *    Wrapping this in a helper is the DRY boundary. Every call site uses the
 *    helper; nobody writes a raw `&` comparison twice and gets it wrong once.
 */

/** True if `flags` contains AT LEAST ONE bit in `mask`. */
export const hasAny = (flags: number, mask: number): boolean => (flags & mask) !== 0;

/** True if `flags` contains EVERY bit in `mask`. */
export const hasAll = (flags: number, mask: number): boolean => (flags & mask) === mask;

/** Turn on every bit in `mask`. Idempotent. */
export const grant = (flags: number, mask: number): number => flags | mask;

/** Turn off every bit in `mask`. Idempotent. */
export const revoke = (flags: number, mask: number): number => flags & ~mask;

/** Flip every bit in `mask`. Applying twice is a no-op. */
export const toggle = (flags: number, mask: number): number => flags ^ mask;

/**
 * Read `width` bits starting at bit `shift` out of `x`.
 * Shift down so the field sits at the bottom, then mask off everything above.
 */
export const getField = (x: number, shift: number, width: number): number =>
  (x >> shift) & ((1 << width) - 1);

/**
 * Write `value` into `width` bits starting at `shift`.
 *
 * Two steps: clear the slot, then OR the new value in.
 *
 * The trailing `& mask` clips an out-of-range `value` so it cannot bleed into
 * neighbouring fields. Defensive, one instruction, always worth it — a silent
 * neighbour corruption is far more expensive to debug than this costs to run.
 */
export function setField(x: number, shift: number, width: number, value: number): number {
  const mask = makeMask(shift, width);
  return (x & ~mask) | ((value << shift) & mask);
}

/**
 * WORKED EXAMPLE — permission flags.
 *
 * `as const` + a derived union type gives you compile-time safety over what is
 * really just an integer. This is the TypeScript idiom for bit flags.
 */
export const Perm = {
  NONE:   0,
  READ:   1 << 0, // 0b0001
  WRITE:  1 << 1, // 0b0010
  DELETE: 1 << 2, // 0b0100
  ADMIN:  1 << 3, // 0b1000
} as const;

export type Perm = (typeof Perm)[keyof typeof Perm];

/**
 * A set of permissions is a plain number, but branding it stops you from
 * accidentally passing a seat index where a permission set is expected.
 * Zero runtime cost — the brand is erased at compile time.
 */
export type PermSet = number & { readonly __brand: 'PermSet' };

export const permSet = (...perms: Perm[]): PermSet =>
  perms.reduce<number>((acc, p) => acc | p, 0) as PermSet;

/** Decode a PermSet back to readable names. For logs and debugging only. */
export function describePerms(flags: PermSet): string[] {
  return Object.entries(Perm)
    .filter(([name, bit]) => name !== 'NONE' && hasAny(flags, bit))
    .map(([name]) => name);
}

// ============================================================================
// 3. CLASSIC IDIOMS
// ============================================================================

/**
 * THE FOUNDATION: what `n - 1` does in binary.
 *
 * Subtracting 1 finds the LOWEST SET BIT, turns it off, and turns on every bit
 * below it. Bits above it are untouched.
 *
 *     n     = 0b0101_1000   (88)
 *     n - 1 = 0b0101_0111   (87)
 *                  ^ ^^^
 *                  |  \--- zeros below became ones
 *                  \------ lowest 1 became 0
 *
 * Why? Ordinary borrowing. To subtract 1 from `...1000` you cannot take 1 from
 * the last digit, so you borrow from the nearest 1 to the left. That 1 becomes
 * 0 and everything it passes over becomes 1.
 *
 * Same as decimal: 3000 - 1 = 2999.
 *
 * Three idioms fall out of this, and they are the whole family:
 *
 *     n & (n - 1)     clear the lowest set bit
 *     n & -n          isolate the lowest set bit (keep only it)
 *     n | (n - 1)     set all bits below the lowest set bit
 */

/**
 * Clear the lowest set bit.
 *
 *     n      = 0b0101_1000
 *     n - 1  = 0b0101_0111
 *     AND    = 0b0101_0000    <- n with its lowest set bit removed
 *
 * High bits survive because they are identical in both operands. The lowest
 * set bit dies because it is 1 in n and 0 in n-1. Everything below dies because
 * it is 0 in n.
 */
export const clearLowestSetBit = (n: number): number => n & (n - 1);

/**
 * Isolate the lowest set bit — return a number with ONLY that bit set.
 *
 *     n    = 0b0101_1000
 *     -n   = 0b1010_1000     (two's complement: ~n + 1)
 *     AND  = 0b0000_1000     <- just the lowest set bit
 *
 * Works because ~n + 1 makes exactly one bit position agree with n.
 */
export const lowestSetBit = (n: number): number => n & -n;

/**
 * Q: Explain `n > 0 && (n & (n - 1)) === 0`.
 *
 * A: A power of two has EXACTLY ONE set bit. That is the definition.
 *
 *      1 = 0b0001
 *      2 = 0b0010
 *      4 = 0b0100
 *      8 = 0b1000
 *
 *    `n & (n - 1)` clears the lowest set bit. Clear the only set bit and
 *    nothing is left, so the result is 0.
 *
 *      n     = 0b1000  (8)
 *      n - 1 = 0b0111  (7)
 *      AND   = 0b0000  -> power of two
 *
 *    Anything else has two or more set bits. Clear one, others remain:
 *
 *      n     = 0b1100  (12)
 *      n - 1 = 0b1011  (11)
 *      AND   = 0b1000  -> not a power of two
 *
 *    WHY `n > 0` IS LOAD-BEARING, not a style guard:
 *
 *    Zero:  0 & (0 - 1)  =  0 & -1  =  0. `-1` is all ones, AND with 0 is 0.
 *           The bit test would say yes. Wrong — zero is not a power of two.
 *
 *    Negatives: in two's complement -2147483648 is 0b1000...0, exactly one set
 *           bit. It passes the bit test. Still wrong — powers of two are
 *           positive.
 *
 *    WHY THIS BEATS A LOOP
 *    The obvious version is O(log n) with a modulo and a float divide each
 *    pass. This is two CPU instructions, constant time, no branch, no loop.
 */
export const isPowerOfTwo = (n: number): boolean => n > 0 && (n & (n - 1)) === 0;

/**
 * Count set bits — Brian Kernighan's algorithm.
 *
 * Each pass removes exactly one set bit, so the loop runs once per 1 bit
 * rather than once per bit position. For a sparse number that is much faster
 * than checking all 32 positions.
 *
 * REAL USE: counting available seats in a section straight from the packed
 * bitset, without decoding every seat into an object first.
 */
export function popcount(n: number): number {
  let count = 0;
  let v = n >>> 0; // treat as unsigned so bit 31 is counted, not sign-extended
  while (v !== 0) {
    v &= v - 1;
    count++;
  }
  return count;
}

/** Round up to the next power of two. Useful for sizing buffers and hash tables. */
export function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;
  // Smear the highest set bit downward, then add 1.
  let v = (n - 1) >>> 0;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return (v + 1) >>> 0;
}

// ============================================================================
// 4. TYPED ARRAYS
// ============================================================================

/**
 * Q: Why not a normal array?
 *
 * A: A normal JS array is a boxed, heterogeneous, resizable object. Elements
 *    may be pointers. Memory use is unpredictable. Terrible for bulk numerics.
 *
 *    A typed array is a FIXED-WIDTH VIEW OVER CONTIGUOUS RAW MEMORY.
 *
 * THE TWO-LAYER MODEL
 *
 *     ArrayBuffer   raw bytes. No type. Cannot be read directly.
 *          |
 *        a view     Uint8Array / Uint32Array / DataView
 *
 *     const buf = new ArrayBuffer(16);    // 16 raw bytes
 *     const u8  = new Uint8Array(buf);    // 16 elements
 *     const u32 = new Uint32Array(buf);   //  4 elements, SAME BYTES
 *
 *    Both views alias the same memory. Write through one, read through the
 *    other.
 *
 * THE TYPES
 *
 *     view               bytes each   range
 *     ---------------------------------------------------
 *     Uint8Array              1       0..255
 *     Int8Array               1       -128..127
 *     Uint8ClampedArray       1       0..255, CLAMPS instead of wrapping
 *     Uint16Array             2       0..65535
 *     Uint32Array             4       0..4294967295
 *     Float64Array            8       doubles
 *
 *    Uint8ClampedArray is what canvas ImageData uses. Assigning 300 gives 255,
 *    not 44.
 *
 * WHY THIS MATTERS ARCHITECTURALLY
 *
 *  1. Memory is predictable. 50,000 seats x 2 bits = 12,500 bytes. Exactly.
 *     Not "roughly 2 MB depending on V8's mood".
 *
 *  2. ZERO-COPY TRANSFER TO A WEB WORKER. This is the big one.
 *
 *       worker.postMessage(bitset.buffer, [bitset.buffer]);
 *       //                                ^ transfer list
 *
 *     Without the transfer list the buffer is structured-cloned: a full copy.
 *     With it, only ownership moves and the source buffer is DETACHED
 *     (byteLength becomes 0). For a 60fps seat map with a worker doing diffing,
 *     this is the difference between smooth and janky.
 *
 *  3. It goes straight into WebGL. `gl.bufferData` takes a typed array
 *     directly. No marshalling step.
 *
 * THE ENDIANNESS TRAP
 *
 *     const buf = new ArrayBuffer(4);
 *     new Uint32Array(buf)[0] = 1;
 *     new Uint8Array(buf)[0];   // 1 on little-endian, 0 on big-endian
 *
 *    Multi-byte typed arrays use the PLATFORM's byte order. Your Go backend
 *    may pack differently. Two safe options:
 *
 *    A. Use Uint8Array only. One byte has no byte order. Unambiguous, always.
 *       This is why SeatBitset below uses Uint8Array.
 *
 *    B. Use DataView, which makes byte order explicit per access:
 *         dv.setUint32(0, value, true);   // true = little-endian
 *       Slower per access, but explicit.
 *
 *    DESIGN RULE
 *      Uint8Array  for cross-system payloads
 *      Uint32Array for in-process hot loops
 *      DataView    for protocol headers, at the wire boundary
 */

/** True if this runtime is little-endian. Computed once. */
export const IS_LITTLE_ENDIAN: boolean = (() => {
  const buf = new ArrayBuffer(2);
  new Uint16Array(buf)[0] = 1;
  return new Uint8Array(buf)[0] === 1;
})();

/** Bytes needed to pack `count` items of `bitsPerItem` bits each. */
export const bytesNeeded = (count: number, bitsPerItem: number): number =>
  Math.ceil((count * bitsPerItem) / 8);

// ============================================================================
// 5. SEAT BITSET — ALL THREE COMBINED
// ============================================================================

export const SeatState = {
  FREE: 0,
  HELD: 1,
  SOLD: 2,
  BLOCKED: 3,
} as const;

export type SeatState = (typeof SeatState)[keyof typeof SeatState];

/**
 * A packed array of seat states, 2 bits per seat, 4 seats per byte.
 *
 * LAYOUT — seat 0 occupies the LOW bits of byte 0.
 *
 *     byte index 0        byte index 1
 *     +---+---+---+---+  +---+---+---+---+
 *     | 3 | 2 | 1 | 0 |  | 7 | 6 | 5 | 4 |   <- seat index
 *     +---+---+---+---+  +---+---+---+---+
 *      bit 7.........0
 *
 *     seat 0 -> bits 1-0  (lowest)
 *     seat 1 -> bits 3-2
 *     seat 2 -> bits 5-4
 *     seat 3 -> bits 7-6  (highest)
 *
 * DESIGN NOTES
 *
 * `#locate` is the SINGLE SOURCE OF TRUTH for the packing layout. BITS_PER_SEAT
 * is the only constant to change if you move from 2 bits to 4. That is DRY
 * applied to bit layout — the rule people usually violate by scattering `>> 2`
 * and `& 3` across a file, after which changing the layout is a bug hunt.
 *
 * Note `(i / PER_BYTE) | 0` and `i % PER_BYTE` instead of `i >> 2` and `i & 3`.
 * Identical machine code after JIT, but these survive a change to
 * BITS_PER_SEAT. Readability wins wherever the compiler does not care.
 *
 * CRITICAL: the server must pack identically. Bit-order mismatches are SILENT —
 * you get plausible-looking wrong data, never an exception. Agree the layout
 * once, version the payload, and keep a round-trip test against a known vector.
 */
export class SeatBitset {
  private static readonly BITS_PER_SEAT = 2;
  private static readonly SEATS_PER_BYTE = 8 / SeatBitset.BITS_PER_SEAT;
  private static readonly SEAT_MASK = (1 << SeatBitset.BITS_PER_SEAT) - 1;

  /** Bumped whenever the wire layout changes. Clients reject mismatches. */
  static readonly WIRE_VERSION = 1;

  private readonly data: Uint8Array;
  readonly count: number;

  constructor(count: number, buffer?: ArrayBuffer) {
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError(`count must be a non-negative integer, got ${count}`);
    }
    this.count = count;
    const bytes = bytesNeeded(count, SeatBitset.BITS_PER_SEAT);
    if (buffer) {
      if (buffer.byteLength < bytes) {
        throw new RangeError(`buffer holds ${buffer.byteLength} bytes, need ${bytes}`);
      }
      this.data = new Uint8Array(buffer, 0, bytes);
    } else {
      this.data = new Uint8Array(bytes);
    }
  }

  get buffer(): ArrayBuffer {
    return this.data.buffer as ArrayBuffer;
  }

  get byteLength(): number {
    return this.data.byteLength;
  }

  /** Map a seat index to its byte and its bit offset within that byte. */
  private locate(i: number): { byte: number; shift: number } {
    if (!Number.isInteger(i) || i < 0 || i >= this.count) {
      throw new RangeError(`seat ${i} out of range 0..${this.count - 1}`);
    }
    return {
      byte: (i / SeatBitset.SEATS_PER_BYTE) | 0,
      shift: (i % SeatBitset.SEATS_PER_BYTE) * SeatBitset.BITS_PER_SEAT,
    };
  }

  /** Shift the field down to the bottom, then mask off everything above it. */
  get(i: number): SeatState {
    const { byte, shift } = this.locate(i);
    return ((this.data[byte] >> shift) & SeatBitset.SEAT_MASK) as SeatState;
  }

  /** Clear the 2-bit slot, then OR the new state in. Neighbours untouched. */
  set(i: number, state: SeatState): void {
    const { byte, shift } = this.locate(i);
    const mask = SeatBitset.SEAT_MASK << shift;
    this.data[byte] = (this.data[byte] & ~mask) | ((state << shift) & mask);
  }

  fill(state: SeatState): void {
    // Replicate the 2-bit pattern across all 8 bits of one byte, then memset.
    let pattern = 0;
    for (let k = 0; k < SeatBitset.SEATS_PER_BYTE; k++) {
      pattern |= state << (k * SeatBitset.BITS_PER_SEAT);
    }
    this.data.fill(pattern);
  }

  /**
   * Indices where this differs from `other`. This is how you build a WebSocket
   * delta instead of resending the whole map.
   *
   * The byte-level early exit is the point: one comparison skips 4 seats. On a
   * mostly-unchanged 50,000-seat map you touch a handful of the 12,500 bytes.
   */
  diff(other: SeatBitset): number[] {
    if (other.count !== this.count) {
      throw new Error(`cannot diff ${this.count} seats against ${other.count}`);
    }
    const out: number[] = [];
    for (let b = 0; b < this.data.length; b++) {
      if (this.data[b] === other.data[b]) continue;
      const base = b * SeatBitset.SEATS_PER_BYTE;
      for (let k = 0; k < SeatBitset.SEATS_PER_BYTE; k++) {
        const i = base + k;
        if (i < this.count && this.get(i) !== other.get(i)) out.push(i);
      }
    }
    return out;
  }

  /** Apply a delta in place. The receiving half of the WebSocket protocol. */
  applyDelta(changes: ReadonlyArray<readonly [index: number, state: SeatState]>): void {
    for (const [i, state] of changes) this.set(i, state);
  }

  countOf(state: SeatState): number {
    let n = 0;
    for (let i = 0; i < this.count; i++) if (this.get(i) === state) n++;
    return n;
  }

  /**
   * Serialise with an explicit header so the receiver can validate before
   * decoding. DataView with an explicit `littleEndian` argument means the
   * format does not depend on whichever machine happened to write it.
   *
   * Header: [u16 version][u32 count][payload bytes...]
   */
  serialize(): ArrayBuffer {
    const HEADER = 6;
    const out = new ArrayBuffer(HEADER + this.data.byteLength);
    const dv = new DataView(out);
    dv.setUint16(0, SeatBitset.WIRE_VERSION, true);
    dv.setUint32(2, this.count, true);
    new Uint8Array(out, HEADER).set(this.data);
    return out;
  }

  static deserialize(buf: ArrayBuffer): SeatBitset {
    const HEADER = 6;
    if (buf.byteLength < HEADER) throw new Error('payload too short for header');
    const dv = new DataView(buf);
    const version = dv.getUint16(0, true);
    if (version !== SeatBitset.WIRE_VERSION) {
      throw new Error(`wire version ${version}, expected ${SeatBitset.WIRE_VERSION}`);
    }
    const count = dv.getUint32(2, true);
    const bs = new SeatBitset(count);
    bs.data.set(new Uint8Array(buf, HEADER));
    return bs;
  }

  /**
   * Hand the backing buffer to a Web Worker with no copy.
   * After this call THIS INSTANCE IS UNUSABLE — the buffer is detached.
   */
  transferTo(target: { postMessage(msg: unknown, transfer: Transferable[]): void }): void {
    const buf = this.buffer;
    target.postMessage({ kind: 'seat-bitset', count: this.count, buffer: buf }, [buf]);
  }
}

// ============================================================================
// 6. TESTS
// ============================================================================

interface TestResult { pass: number; fail: number }

function runTests(): TestResult {
  let pass = 0;
  let fail = 0;

  const eq = (actual: unknown, expected: unknown, msg: string): void => {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) throw new Error(`${msg}: expected ${e}, got ${a}`);
  };

  const throws = (fn: () => unknown, msg: string): void => {
    try { fn(); } catch { return; }
    throw new Error(`${msg}: expected a throw, got none`);
  };

  const test = (name: string, fn: () => void): void => {
    try { fn(); pass++; console.log(`  ok   ${name}`); }
    catch (e) { fail++; console.log(`  FAIL ${name}\n       ${(e as Error).message}`); }
  };

  console.log('\nshifts');
  test('timesPowerOfTwo', () => {
    eq(timesPowerOfTwo(5, 1), 10, '5<<1');
    eq(timesPowerOfTwo(5, 3), 40, '5<<3');
    eq(timesPowerOfTwo(1, 10), 1024, '1<<10');
  });
  test('divPowerOfTwo floors', () => {
    eq(divPowerOfTwo(40, 3), 5, '40>>3');
    eq(divPowerOfTwo(7, 1), 3, '7>>1 floors');
  });
  test('asUnsigned32', () => {
    eq(asUnsigned32(-1), 4294967295, '-1');
    eq(asUnsigned32(1 << 31), 2147483648, 'sign bit');
  });
  test('shift count wraps at 32 (documented trap)', () => {
    eq(1 << 32, 1, 'wraps');
    eq(shiftCountIsSafe(32), false, 'guard catches it');
  });

  console.log('\nmasks');
  test('makeMask', () => {
    eq(makeMask(0, 2), 0b11, 'low 2');
    eq(makeMask(2, 2), 0b1100, 'shifted');
    eq(makeMask(0, 8), 0xff, 'full byte');
  });
  test('test / set / clear / toggle', () => {
    const f = Perm.READ | Perm.WRITE;
    eq(hasAll(f, Perm.READ | Perm.WRITE), true, 'hasAll both');
    eq(hasAll(f, Perm.READ | Perm.ADMIN), false, 'hasAll missing');
    eq(hasAny(f, Perm.ADMIN), false, 'hasAny none');
    eq(grant(f, Perm.ADMIN), f | Perm.ADMIN, 'grant');
    eq(revoke(f, Perm.READ), Perm.WRITE, 'revoke');
    eq(toggle(toggle(f, Perm.ADMIN), Perm.ADMIN), f, 'toggle twice is identity');
    eq(grant(Perm.READ, Perm.READ), Perm.READ, 'grant idempotent');
  });
  test('getField / setField', () => {
    const x = 0b11_10_01_00;
    eq(getField(x, 0, 2), 0b00, 'field 0');
    eq(getField(x, 6, 2), 0b11, 'field 3');
    eq(setField(0b0000_0000, 2, 2, 0b11), 0b0000_1100, 'write');
    eq(setField(0b1111_1111, 2, 2, 0b00), 0b1111_0011, 'clear');
    eq(setField(0b0000_0000, 2, 2, 0b111), 0b0000_1100, 'overflow is clipped');
  });
  test('describePerms', () => {
    eq(describePerms(permSet(Perm.READ, Perm.ADMIN)), ['READ', 'ADMIN'], 'decode');
  });

  console.log('\nidioms');
  test('clearLowestSetBit', () => {
    eq(clearLowestSetBit(0b0101_1000), 0b0101_0000, 'removes lowest');
    eq(clearLowestSetBit(0b1000), 0, 'single bit to zero');
  });
  test('lowestSetBit', () => {
    eq(lowestSetBit(0b0101_1000), 0b0000_1000, 'isolates lowest');
  });
  test('isPowerOfTwo', () => {
    eq(isPowerOfTwo(1), true, '1');
    eq(isPowerOfTwo(1024), true, '1024');
    eq(isPowerOfTwo(65), false, '65');
    eq(isPowerOfTwo(0), false, 'zero guard');
    eq(isPowerOfTwo(-2147483648), false, 'negative guard');
  });
  test('popcount', () => {
    eq(popcount(0b1011_0110), 5, 'five bits');
    eq(popcount(0), 0, 'zero');
    eq(popcount(-1), 32, 'all 32 bits');
  });
  test('nextPowerOfTwo', () => {
    eq(nextPowerOfTwo(1), 1, '1');
    eq(nextPowerOfTwo(5), 8, '5 -> 8');
    eq(nextPowerOfTwo(1024), 1024, 'already a power');
  });

  console.log('\ntyped arrays');
  test('views alias the same bytes', () => {
    const buf = new ArrayBuffer(4);
    new Uint32Array(buf)[0] = 0xaabbccdd;
    const u8 = new Uint8Array(buf);
    eq(u8[IS_LITTLE_ENDIAN ? 0 : 3], 0xdd, 'low byte position');
  });
  test('DataView pins byte order', () => {
    const buf = new ArrayBuffer(4);
    const dv = new DataView(buf);
    dv.setUint32(0, 0xaabbccdd, false);           // big-endian, explicit
    eq(new Uint8Array(buf)[0], 0xaa, 'MSB first');
    eq(dv.getUint32(0, false), 0xaabbccdd, 'round-trip');
  });
  test('bytesNeeded rounds up', () => {
    eq(bytesNeeded(4, 2), 1, 'exact');
    eq(bytesNeeded(5, 2), 2, 'rounds up');
    eq(bytesNeeded(50_000, 2), 12_500, '50k seats');
  });

  console.log('\nSeatBitset');
  test('get / set round-trip, neighbours untouched', () => {
    const s = new SeatBitset(10);
    eq(s.get(0), SeatState.FREE, 'default free');
    s.set(0, SeatState.SOLD);
    s.set(1, SeatState.HELD);
    s.set(7, SeatState.SOLD);
    eq(s.get(0), SeatState.SOLD, 'seat 0');
    eq(s.get(1), SeatState.HELD, 'seat 1');
    eq(s.get(7), SeatState.SOLD, 'seat 7');
    eq(s.get(2), SeatState.FREE, 'neighbour clean');
    eq(s.get(6), SeatState.FREE, 'neighbour clean');
  });
  test('overwrite clears the old value', () => {
    const s = new SeatBitset(4);
    s.set(2, SeatState.BLOCKED); // 0b11
    s.set(2, SeatState.FREE);    // 0b00
    eq(s.get(2), SeatState.FREE, 'fully cleared');
  });
  test('fill', () => {
    const s = new SeatBitset(9);
    s.fill(SeatState.SOLD);
    eq(s.countOf(SeatState.SOLD), 9, 'all sold');
  });
  test('packing density', () => {
    eq(new SeatBitset(50_000).byteLength, 12_500, '12.5 KB');
  });
  test('bounds are checked', () => {
    const s = new SeatBitset(4);
    throws(() => s.get(4), 'upper bound');
    throws(() => s.set(-1, SeatState.FREE), 'lower bound');
  });
  test('diff produces a delta list', () => {
    const a = new SeatBitset(20);
    const b = new SeatBitset(20);
    b.set(3, SeatState.SOLD);
    b.set(17, SeatState.HELD);
    eq(a.diff(b), [3, 17], 'two changes');
    eq(a.diff(a), [], 'no changes');
  });
  test('applyDelta', () => {
    const a = new SeatBitset(20);
    const b = new SeatBitset(20);
    b.set(3, SeatState.SOLD);
    b.set(17, SeatState.HELD);
    a.applyDelta([[3, SeatState.SOLD], [17, SeatState.HELD]]);
    eq(a.diff(b), [], 'converged');
  });
  test('serialize / deserialize round-trip', () => {
    const a = new SeatBitset(100);
    a.set(0, SeatState.SOLD);
    a.set(42, SeatState.HELD);
    a.set(99, SeatState.BLOCKED);
    const b = SeatBitset.deserialize(a.serialize());
    eq(b.count, 100, 'count preserved');
    eq(a.diff(b), [], 'contents preserved');
  });
  test('deserialize rejects a bad version', () => {
    const a = new SeatBitset(8).serialize();
    new DataView(a).setUint16(0, 999, true);
    throws(() => SeatBitset.deserialize(a), 'version check');
  });
  test('countOf', () => {
    const s = new SeatBitset(100);
    for (let i = 0; i < 30; i++) s.set(i, SeatState.SOLD);
    eq(s.countOf(SeatState.SOLD), 30, 'sold');
    eq(s.countOf(SeatState.FREE), 70, 'free');
  });

  return { pass, fail };
}

// ============================================================================
// 7. EXERCISES
// ============================================================================

/**
 * Work through these in order. Each one exercises a different part.
 *
 * 1.  Change BITS_PER_SEAT from 2 to 4 (16 seat states). Every test should
 *     still pass except the packing-density one, which you update to 25,000.
 *     If anything else breaks, the layout leaked out of `locate()`. That is
 *     the DRY payoff, and the specific failure mode these classes rot into.
 *
 * 2.  Implement `countOf` using popcount instead of a per-seat loop.
 *     Hint: build a per-byte lookup table of 256 entries at module load.
 *     Measure both with `performance.now()` on 50,000 seats. Write down the
 *     ratio — an architect quotes measured numbers, not expected ones.
 *
 * 3.  Implement `firstFree(fromIndex)` that finds the next FREE seat.
 *     Skip whole bytes equal to 0xFF-equivalent patterns. This backs the
 *     "best available" flow, which doubles as the accessible booking path for
 *     screen reader users who cannot use a canvas seat map.
 *
 * 4.  Move `diff` into a Web Worker. Transfer with
 *     `postMessage(buf, [buf])` and assert `buf.byteLength === 0` afterward.
 *     That assertion is how you PROVE the transfer was zero-copy rather than a
 *     structured clone.
 *
 * 5.  Write the Go encoder for `serialize()` and a round-trip test against a
 *     fixed golden vector. This is where bit-order and endianness bugs surface,
 *     and they are silent if you skip it.
 *
 * 6.  Add a `rangeSet(from, to, state)` that writes whole bytes for the
 *     interior and only does bit-level work at the two ragged ends. This is the
 *     standard shape for every bulk bitset operation.
 */

// ============================================================================

const isMain =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  /bit-manipulation\.(ts|js|mjs)$/.test(process.argv[1] ?? '');

if (isMain) {
  console.log('bit manipulation — masks, shifts, typed arrays');
  console.log(`platform is ${IS_LITTLE_ENDIAN ? 'little' : 'big'}-endian`);

  const { pass, fail } = runTests();

  // The size comparison that justifies all of the above.
  const N = 50_000;
  const json = JSON.stringify(
    Array.from({ length: N }, (_, i) => ({ seatId: `A-${i}`, status: 'free' })),
  );
  const packed = bytesNeeded(N, 2);
  console.log('\nwhy bother');
  console.log(`  JSON:   ${(json.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  bitset: ${(packed / 1024).toFixed(1)} KB`);
  console.log(`  ratio:  ${Math.round(json.length / packed)}x smaller`);

  console.log(`\n${pass} passed, ${fail} failed\n`);
  if (fail > 0) process.exitCode = 1;
}

export { runTests };