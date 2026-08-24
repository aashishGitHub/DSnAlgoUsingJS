package mathbits

import (
	"math"
	"slices"
	"testing"
)

func TestSingleNumber(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 2, 1}, 1},
		{[]int{4, 1, 2, 1, 2}, 4},
		{[]int{1}, 1},
		{[]int{-1, -1, -3}, -3}, // XOR handles negatives without special cases
	}
	for _, c := range cases {
		if got := SingleNumber(c.nums); got != c.want {
			t.Errorf("SingleNumber(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestHammingWeight(t *testing.T) {
	cases := []struct {
		n    uint32
		want int
	}{
		{11, 3},  // 1011
		{128, 1}, // 10000000
		{0, 0},
		{4294967295, 32}, // all ones
	}
	for _, c := range cases {
		if got := HammingWeight(c.n); got != c.want {
			t.Errorf("HammingWeight(%d) = %d, want %d", c.n, got, c.want)
		}
	}
}

func TestCountBits(t *testing.T) {
	if got := CountBits(5); !slices.Equal(got, []int{0, 1, 1, 2, 1, 2}) {
		t.Errorf("CountBits(5) = %v, want [0 1 1 2 1 2]", got)
	}
	if got := CountBits(0); !slices.Equal(got, []int{0}) {
		t.Errorf("CountBits(0) = %v", got)
	}
	// Cross-check the DP recurrence against the independent bit-clearing count.
	got := CountBits(64)
	for i, c := range got {
		if want := HammingWeight(uint32(i)); c != want {
			t.Errorf("CountBits[%d] = %d, want %d", i, c, want)
		}
	}
}

func TestReverseBits(t *testing.T) {
	if got := ReverseBits(43261596); got != 964176192 {
		t.Errorf("ReverseBits(43261596) = %d, want 964176192", got)
	}
	if got := ReverseBits(0); got != 0 {
		t.Errorf("ReverseBits(0) = %d", got)
	}
	// Reversing twice is the identity — a property test that needs no oracle.
	for _, n := range []uint32{1, 2, 255, 43261596, 4294967293} {
		if got := ReverseBits(ReverseBits(n)); got != n {
			t.Errorf("double reverse of %d = %d", n, got)
		}
	}
}

func TestGetSum(t *testing.T) {
	cases := []struct{ a, b, want int }{
		{1, 2, 3},
		{2, 3, 5},
		{0, 0, 0},
		{-1, 1, 0},
		{-2, -3, -5}, // must terminate on negatives, not spin forever
		{5, -3, 2},
		{100, 250, 350},
	}
	for _, c := range cases {
		if got := GetSum(c.a, c.b); got != c.want {
			t.Errorf("GetSum(%d,%d) = %d, want %d", c.a, c.b, got, c.want)
		}
	}
}

func TestMyPow(t *testing.T) {
	cases := []struct {
		x    float64
		n    int
		want float64
	}{
		{2, 10, 1024},
		{2, 0, 1},
		{2, -2, 0.25}, // negative exponent inverts the base
		{2.1, 3, 9.261},
		{1, 999999, 1},
		{0.5, 2, 0.25},
	}
	for _, c := range cases {
		if got := MyPow(c.x, c.n); math.Abs(got-c.want) > 1e-9 {
			t.Errorf("MyPow(%v,%d) = %v, want %v", c.x, c.n, got, c.want)
		}
	}
}

func TestIsHappy(t *testing.T) {
	cases := []struct {
		n    int
		want bool
	}{
		{19, true}, // 1+81=82 -> 68 -> 100 -> 1
		{2, false}, // enters the well-known 4-16-37-58-89-145-42-20 cycle
		{1, true},
		{7, true},
	}
	for _, c := range cases {
		if got := IsHappy(c.n); got != c.want {
			t.Errorf("IsHappy(%d) = %v, want %v", c.n, got, c.want)
		}
	}
}

func TestPlusOne(t *testing.T) {
	cases := []struct {
		digits, want []int
	}{
		{[]int{1, 2, 3}, []int{1, 2, 4}},
		{[]int{4, 3, 2, 1}, []int{4, 3, 2, 2}},
		{[]int{9}, []int{1, 0}}, // carry grows the slice
		{[]int{9, 9}, []int{1, 0, 0}},
		{[]int{1, 9}, []int{2, 0}},
		{[]int{0}, []int{1}},
	}
	for _, c := range cases {
		before := slices.Clone(c.digits)
		got := PlusOne(c.digits)
		if !slices.Equal(got, c.want) {
			t.Errorf("PlusOne(%v) = %v, want %v", before, got, c.want)
		}
		if !slices.Equal(c.digits, before) {
			t.Errorf("PlusOne mutated its input: %v -> %v", before, c.digits)
		}
	}
}
