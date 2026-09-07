# Bit Manipulation Pattern

**When to Use**: "appears twice except one", counting set bits, "without using
`+`", packed flags, subset enumeration.
**Time Complexity**: O(1)–O(32) per op | **Space Complexity**: O(1)

## The five identities that solve almost everything

| Identity | Meaning |
|---|---|
| `x ^ x = 0`, `x ^ 0 = x` | XOR cancels duplicates |
| XOR is commutative + associative | duplicates cancel wherever they sit |
| `x & 1` | is the lowest bit set? |
| `x & (x - 1)` | clear the lowest set bit (Brian Kernighan) |
| `x & -x` | isolate the lowest set bit |

## ⚠️ JavaScript-specific traps

These do **not** exist in C++/Java/Go and cause most of the bugs here:

- Bitwise operators coerce to **32-bit signed** ints — `1 << 31` is negative.
- `>>` is arithmetic (sign-propagating), so `while (n) n >>= 1` on a negative
  number **never terminates**. Use `>>>` whenever the value may be negative.
- `>>> 0` is the idiom for "read these 32 bits as unsigned" (see `reverseBits`).
- Numbers are doubles; bitwise ops silently truncate past 32 bits.

## Files

- **`bitPatterns.ts`** — `hammingWeightNaive` → `hammingWeight` (LC191),
  `countBits` (LC338, DP on `i >> 1`), `reverseBits` (LC190),
  `missingNumberXOR` (LC268), `getSum` (LC371), `singleNumberXOR` (LC136),
  `singleNumberII` (LC137), `singleNumberIII` (LC260)

## Naming note — the same problem, three patterns

`missingNumber` and `singleNumber` already exist elsewhere in this repo, so the
bit versions carry a `XOR` suffix. That is deliberate: comparing them is a good
self-test of pattern recognition.

| Problem | Cyclic Sort | Hash Set | Bit |
|---|---|---|---|
| LC268 Missing Number | `missingNumber` | `missingNumberSet` | `missingNumberXOR` |
| LC136 Single Number | — | `singleNumber` | `singleNumberXOR` |

## Related

- [`../CyclicSort/`](../CyclicSort/), [`../HashMap/`](../HashMap/) — the other
  two routes to the same two problems

> **Tests:** no vitest file yet; verified against LeetCode samples only.
