// Package mathbits covers bit manipulation and number tricks.
//
// PATTERN         Bit manipulation; fast exponentiation; digit iteration
// WHEN TO USE     "without extra space", "without the + operator", parity and
// pairing tricks, powers, and anything about a number's digits.
//
// THE FIVE IDENTITIES WORTH MEMORISING:
//
//	x ^ x == 0        and  x ^ 0 == x     -> XOR cancels pairs
//	n & (n-1)                             -> clears the LOWEST set bit
//	n & -n                                -> isolates the lowest set bit
//	n >> 1                                -> divide by 2 (floor, for n >= 0)
//	n & 1                                 -> the last bit, i.e. parity
//
// GO NOTE: >> on a NEGATIVE signed int is an arithmetic shift — the sign bit is
// copied, so -8 >> 1 == -4, and shifting a negative number never reaches 0.
// Use an unsigned type (uint32/uint) whenever you loop over bits.
package mathbits

import "slices"

// ---------------------------------------------------------------------------
// XOR: pairing and cancellation
// ---------------------------------------------------------------------------

// SingleNumber finds the one value appearing once when all others appear twice
// (LC136). O(n) time, O(1) space.
//
// Every pair cancels itself, so the survivor is the loner. This is why XOR beats
// the hash-set solution: same time, but constant space.
func SingleNumber(nums []int) int {
	x := 0
	for _, n := range nums {
		x ^= n
	}
	return x
}

// ---------------------------------------------------------------------------
// Counting and moving bits
// ---------------------------------------------------------------------------

// HammingWeight counts set bits (LC191). O(number of SET bits), not O(32).
//
// n & (n-1) clears the lowest set bit: subtracting 1 flips that bit to 0 and
// everything below it to 1, so the AND wipes the whole tail. Looping until zero
// therefore runs once per set bit — the answer to "can you beat 32 iterations?".
func HammingWeight(n uint32) int {
	count := 0
	for n != 0 {
		n &= n - 1
		count++
	}
	return count
}

// CountBits returns the set-bit count for every value in 0..n (LC338). O(n).
//
// THE DP INSIGHT that beats calling HammingWeight n times: i>>1 is i with its
// last bit removed, and that value is smaller, so it is already computed.
// Therefore bits(i) == bits(i>>1) + (last bit of i).
func CountBits(n int) []int {
	out := make([]int, n+1)
	for i := 1; i <= n; i++ {
		out[i] = out[i>>1] + i&1
	}
	return out
}

// ReverseBits reverses the bits of a 32-bit unsigned integer (LC190).
// Shift the result left to make room, take n's lowest bit, shift n right.
// Exactly 32 iterations — the width must be fixed, hence uint32 not int.
func ReverseBits(n uint32) uint32 {
	var out uint32
	for range 32 {
		out = out<<1 | n&1
		n >>= 1
	}
	return out
}

// GetSum adds two integers without + or - (LC371).
//
// BINARY ADDITION FROM FIRST PRINCIPLES:
//   - a ^ b is the sum ignoring carries
//   - a & b finds the positions that generate a carry; << 1 moves it to where
//     it must be added
//
// Repeat until no carry remains. This terminates on negatives too, because the
// carry keeps shifting left and eventually leaves the fixed-width word — unlike
// arbitrary-precision languages, which need explicit masking.
func GetSum(a, b int) int {
	for b != 0 {
		carry := (a & b) << 1
		a ^= b
		b = carry
	}
	return a
}

// ---------------------------------------------------------------------------
// Number tricks
// ---------------------------------------------------------------------------

// MyPow computes x^n in O(log n) by exponentiation by squaring (LC50).
//
// THE IDEA: x^10 == (x²)^5, so halving the exponent squares the base. Read the
// exponent's binary digits — multiply into the result on a 1 bit, square every
// step. The naive loop is O(n), which times out for large n.
//
// CAVEAT: n == math.MinInt would overflow at -n. LC bounds n to int32, so this
// is safe there; in production code, widen or special-case it.
func MyPow(x float64, n int) float64 {
	if n < 0 {
		x = 1 / x
		n = -n
	}
	result := 1.0
	for n > 0 {
		if n&1 == 1 {
			result *= x // this binary digit is set
		}
		x *= x
		n >>= 1
	}
	return result
}

// IsHappy reports whether repeatedly summing squared digits reaches 1 (LC202).
//
// THE PATTERN TRANSFER WORTH NOTICING: "does this sequence loop?" is exactly
// linked-list cycle detection, and the successor function replaces node.Next. So
// Floyd's fast & slow pointers apply here with O(1) space — no visited set.
func IsHappy(n int) bool {
	next := func(x int) int {
		sum := 0
		for x > 0 {
			d := x % 10
			sum += d * d
			x /= 10
		}
		return sum
	}
	slow, fast := n, next(n)
	for fast != 1 && slow != fast {
		slow = next(slow)
		fast = next(next(fast))
	}
	return fast == 1
}

// PlusOne increments a number represented as a digit slice (LC66).
//
// THE ONLY INTERESTING CASE is all nines: the carry propagates past the front
// and the result is one digit longer. Everything else returns early.
func PlusOne(digits []int) []int {
	out := slices.Clone(digits) // do not mutate the caller's slice
	for i := len(out) - 1; i >= 0; i-- {
		if out[i] < 9 {
			out[i]++
			return out // no carry: done
		}
		out[i] = 0
	}
	return append([]int{1}, out...) // 999 -> 1000
}
