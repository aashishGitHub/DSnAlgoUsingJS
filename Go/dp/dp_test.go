package dp

import (
	"math/big"
	"testing"
)

func TestClimbStairs(t *testing.T) {
	cases := []struct{ n, want int }{{1, 1}, {2, 2}, {3, 3}, {4, 5}, {5, 8}, {10, 89}}
	for _, c := range cases {
		if got := ClimbStairs(c.n); got != c.want {
			t.Errorf("ClimbStairs(%d) = %d, want %d", c.n, got, c.want)
		}
	}
}

func TestRob(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{1, 2, 3, 1}, 4},
		{[]int{2, 7, 9, 3, 1}, 12},
		{[]int{5}, 5},
		{nil, 0},
		{[]int{2, 1, 1, 2}, 4},
	}
	for _, c := range cases {
		if got := Rob(c.nums); got != c.want {
			t.Errorf("Rob(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestRobCircular(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 3, 2}, 3}, // cannot take both 2s: they are adjacent in a circle
		{[]int{1, 2, 3, 1}, 4},
		{[]int{1, 2, 3}, 3},
		{[]int{1}, 1}, // the single-house case the slicing trick cannot handle
		{nil, 0},
	}
	for _, c := range cases {
		if got := RobCircular(c.nums); got != c.want {
			t.Errorf("RobCircular(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestCoinChange(t *testing.T) {
	cases := []struct {
		coins  []int
		amount int
		want   int
	}{
		{[]int{1, 2, 5}, 11, 3},
		{[]int{2}, 3, -1},
		{[]int{1}, 0, 0},
		{[]int{1, 3, 4}, 6, 2}, // greedy would answer 3 (4+1+1)
		{nil, 5, -1},
	}
	for _, c := range cases {
		if got := CoinChange(c.coins, c.amount); got != c.want {
			t.Errorf("CoinChange(%v,%d) = %d, want %d", c.coins, c.amount, got, c.want)
		}
	}
}

func TestLengthOfLISBothVersionsAgree(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{10, 9, 2, 5, 3, 7, 101, 18}, 4},
		{[]int{0, 1, 0, 3, 2, 3}, 4},
		{[]int{7, 7, 7, 7}, 1}, // equal values do not form an INCREASING run
		{[]int{1}, 1},
		{nil, 0},
		{[]int{5, 4, 3, 2, 1}, 1},
	}
	for _, c := range cases {
		if got := LengthOfLIS(c.nums); got != c.want {
			t.Errorf("LengthOfLIS(%v) = %d, want %d", c.nums, got, c.want)
		}
		if got := LengthOfLISPatience(c.nums); got != c.want {
			t.Errorf("LengthOfLISPatience(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestWordBreak(t *testing.T) {
	cases := []struct {
		s     string
		words []string
		want  bool
	}{
		{"leetcode", []string{"leet", "code"}, true},
		{"applepenapple", []string{"apple", "pen"}, true}, // words may repeat
		{"catsandog", []string{"cats", "dog", "sand", "and", "cat"}, false},
		{"", []string{"a"}, true},
		{"a", nil, false},
	}
	for _, c := range cases {
		if got := WordBreak(c.s, c.words); got != c.want {
			t.Errorf("WordBreak(%q,%v) = %v, want %v", c.s, c.words, got, c.want)
		}
	}
}

func TestMaxProduct(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 3, -2, 4}, 6},
		{[]int{-2, 0, -1}, 0},
		{[]int{-2, 3, -4}, 24}, // two negatives make the best answer
		{[]int{-2}, -2},
		{[]int{0, 2}, 2},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxProduct(c.nums); got != c.want {
			t.Errorf("MaxProduct(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestNumDecodings(t *testing.T) {
	cases := []struct {
		s    string
		want int
	}{
		{"12", 2},
		{"226", 3},
		{"06", 0}, // a leading zero decodes to nothing
		{"10", 1},
		{"100", 0}, // the second 0 has no valid partner
		{"2101", 1},
		{"27", 1}, // 27 is out of range, so only 2 then 7
		{"11106", 2},
	}
	for _, c := range cases {
		if got := NumDecodings(c.s); got != c.want {
			t.Errorf("NumDecodings(%q) = %d, want %d", c.s, got, c.want)
		}
	}
}

func TestCanPartition(t *testing.T) {
	cases := []struct {
		nums []int
		want bool
	}{
		{[]int{1, 5, 11, 5}, true},
		{[]int{1, 2, 3, 5}, false}, // odd total
		{[]int{1, 1}, true},
		{[]int{1}, false},
		{[]int{2, 2, 3, 5}, false},
		{[]int{3, 3, 3, 4, 5}, true},
	}
	for _, c := range cases {
		if got := CanPartition(c.nums); got != c.want {
			t.Errorf("CanPartition(%v) = %v, want %v", c.nums, got, c.want)
		}
	}
}

func TestLongestPalindrome(t *testing.T) {
	cases := []struct {
		s, want string
	}{
		{"babad", "bab"}, // "aba" is equally valid; this impl finds "bab" first
		{"cbbd", "bb"},   // even length
		{"a", "a"},
		{"", ""},
		{"ac", "a"},
		{"aaaa", "aaaa"},
	}
	for _, c := range cases {
		if got := LongestPalindrome(c.s); got != c.want {
			t.Errorf("LongestPalindrome(%q) = %q, want %q", c.s, got, c.want)
		}
	}
}

func TestCountSubstrings(t *testing.T) {
	cases := []struct {
		s    string
		want int
	}{
		{"abc", 3}, // just the single characters
		{"aaa", 6}, // 3 singles + 2 doubles + 1 triple
		{"", 0},
		{"aba", 4},
	}
	for _, c := range cases {
		if got := CountSubstrings(c.s); got != c.want {
			t.Errorf("CountSubstrings(%q) = %d, want %d", c.s, got, c.want)
		}
	}
}

func TestUniquePaths(t *testing.T) {
	cases := []struct{ m, n, want int }{
		{3, 7, 28}, {3, 2, 3}, {1, 1, 1}, {1, 10, 1}, {2, 2, 2},
	}
	for _, c := range cases {
		if got := UniquePaths(c.m, c.n); got != c.want {
			t.Errorf("UniquePaths(%d,%d) = %d, want %d", c.m, c.n, got, c.want)
		}
	}
}

func TestLongestCommonSubsequence(t *testing.T) {
	cases := []struct {
		a, b string
		want int
	}{
		{"abcde", "ace", 3},
		{"abc", "abc", 3},
		{"abc", "def", 0},
		{"", "abc", 0},
		{"bsbininm", "jmjkbkjkv", 1},
	}
	for _, c := range cases {
		if got := LongestCommonSubsequence(c.a, c.b); got != c.want {
			t.Errorf("LCS(%q,%q) = %d, want %d", c.a, c.b, got, c.want)
		}
	}
}

func TestCoinChange2(t *testing.T) {
	cases := []struct {
		amount int
		coins  []int
		want   int
	}{
		{5, []int{1, 2, 5}, 4},
		{3, []int{2}, 0},
		{10, []int{10}, 1},
		{0, []int{1}, 1}, // exactly one way to make nothing
		// Counts COMBINATIONS: {1,2} and {2,1} are one answer, not two.
		{3, []int{1, 2}, 2},
	}
	for _, c := range cases {
		if got := CoinChange2(c.amount, c.coins); got != c.want {
			t.Errorf("CoinChange2(%d,%v) = %d, want %d", c.amount, c.coins, got, c.want)
		}
	}
}

func TestMinDistance(t *testing.T) {
	cases := []struct {
		a, b string
		want int
	}{
		{"horse", "ros", 3},
		{"intention", "execution", 5},
		{"", "abc", 3},
		{"abc", "", 3},
		{"", "", 0},
		{"same", "same", 0},
	}
	for _, c := range cases {
		if got := MinDistance(c.a, c.b); got != c.want {
			t.Errorf("MinDistance(%q,%q) = %d, want %d", c.a, c.b, got, c.want)
		}
	}
}

func TestMaxProfitCooldown(t *testing.T) {
	cases := []struct {
		prices []int
		want   int
	}{
		{[]int{1, 2, 3, 0, 2}, 3}, // buy 1 sell 2, cool down, buy 0 sell 2
		{[]int{1}, 0},
		{nil, 0},
		{[]int{6, 1, 3, 2, 4, 7}, 6},
		{[]int{5, 4, 3, 2, 1}, 0}, // only losses: do nothing
	}
	for _, c := range cases {
		if got := MaxProfitCooldown(c.prices); got != c.want {
			t.Errorf("MaxProfitCooldown(%v) = %d, want %d", c.prices, got, c.want)
		}
	}
}

func TestLowerBoundHelper(t *testing.T) {
	// The patience-sort helper: first index whose value is >= target.
	xs := []int{1, 3, 5, 7}
	cases := []struct{ target, want int }{{0, 0}, {1, 0}, {4, 2}, {7, 3}, {9, 4}}
	for _, c := range cases {
		if got := lowerBound(xs, c.target); got != c.want {
			t.Errorf("lowerBound(%v,%d) = %d, want %d", xs, c.target, got, c.want)
		}
	}
	if got := lowerBound(nil, 1); got != 0 {
		t.Errorf("lowerBound(nil,1) = %d, want 0", got)
	}
}

// ---------------------------------------------------------------------------
// PARITY BLOCK tests — the problems mirrored from the JavaScript side.
// ---------------------------------------------------------------------------

func TestMinPathSum(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{1, 3, 1}, {1, 5, 1}, {4, 2, 1}}, 7},
		{[][]int{{1, 2, 3}, {4, 5, 6}}, 12},
		{[][]int{{5}}, 5},
		{[][]int{{1, 2}, {1, 1}}, 3},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MinPathSum(c.grid); got != c.want {
			t.Errorf("MinPathSum(%v) = %d, want %d", c.grid, got, c.want)
		}
	}
}

func TestMinPathSumDoesNotMutateInput(t *testing.T) {
	grid := [][]int{{1, 3, 1}, {1, 5, 1}, {4, 2, 1}}
	MinPathSum(grid)
	want := [][]int{{1, 3, 1}, {1, 5, 1}, {4, 2, 1}}
	for r := range grid {
		for c := range grid[r] {
			if grid[r][c] != want[r][c] {
				t.Fatalf("MinPathSum mutated the caller's grid at [%d][%d]", r, c)
			}
		}
	}
}

func TestNumSquares(t *testing.T) {
	cases := []struct{ n, want int }{
		{0, 0}, {1, 1}, {4, 1}, {12, 3}, {13, 2}, {43, 3}, {100, 1},
	}
	for _, c := range cases {
		if got := NumSquares(c.n); got != c.want {
			t.Errorf("NumSquares(%d) = %d, want %d", c.n, got, c.want)
		}
	}
}

func TestMaximalSquare(t *testing.T) {
	cases := []struct {
		matrix [][]byte
		want   int
	}{
		{[][]byte{
			[]byte("10100"),
			[]byte("10111"),
			[]byte("11111"),
			[]byte("10010"),
		}, 4},
		{[][]byte{[]byte("01"), []byte("10")}, 1},
		{[][]byte{[]byte("0")}, 0},
		{[][]byte{[]byte("111"), []byte("111"), []byte("111")}, 9},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaximalSquare(c.matrix); got != c.want {
			t.Errorf("MaximalSquare(%s) = %d, want %d", c.matrix, got, c.want)
		}
	}
}

func TestLongestPalindromeSubseq(t *testing.T) {
	cases := []struct {
		s    string
		want int
	}{
		{"bbbab", 4}, {"cbbd", 2}, {"a", 1}, {"abcde", 1}, {"racecar", 7}, {"", 0},
	}
	for _, c := range cases {
		if got := LongestPalindromeSubseq(c.s); got != c.want {
			t.Errorf("LongestPalindromeSubseq(%q) = %d, want %d", c.s, got, c.want)
		}
	}
}

func TestNumTrees(t *testing.T) {
	cases := []struct{ n, want int }{
		{0, 1}, {1, 1}, {2, 2}, {3, 5}, {4, 14}, {5, 42}, {6, 132},
	}
	for _, c := range cases {
		if got := NumTrees(c.n); got != c.want {
			t.Errorf("NumTrees(%d) = %d, want %d", c.n, got, c.want)
		}
	}
}

func TestMaxCoins(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{3, 1, 5, 8}, 167},
		{[]int{1, 5}, 10},
		{[]int{5}, 5},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxCoins(c.nums); got != c.want {
			t.Errorf("MaxCoins(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestMaxCoinsDoesNotMutateInput(t *testing.T) {
	nums := []int{3, 1, 5, 8}
	MaxCoins(nums)
	want := []int{3, 1, 5, 8}
	for i := range nums {
		if nums[i] != want[i] {
			t.Fatalf("MaxCoins mutated the caller's slice at %d: %v", i, nums)
		}
	}
}

func TestUniquePathsWithObstacles(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}}, 2},
		{[][]int{{0, 1}, {0, 0}}, 1},
		{[][]int{{1}}, 0},                    // start blocked
		{[][]int{{0, 0}, {1, 1}, {0, 0}}, 0}, // fully walled off
		{[][]int{{0, 0, 0}, {0, 0, 0}}, 3},   // no obstacles at all
		{nil, 0},
	}
	for _, c := range cases {
		if got := UniquePathsWithObstacles(c.grid); got != c.want {
			t.Errorf("UniquePathsWithObstacles(%v) = %d, want %d", c.grid, got, c.want)
		}
	}
}

func TestCanJump(t *testing.T) {
	cases := []struct {
		nums []int
		want bool
	}{
		{[]int{2, 3, 1, 1, 4}, true},
		{[]int{3, 2, 1, 0, 4}, false},
		{[]int{0}, true},
		{[]int{2, 0, 0}, true},
		{[]int{1, 0, 1, 0}, false},
	}
	for _, c := range cases {
		if got := CanJump(c.nums); got != c.want {
			t.Errorf("CanJump(%v) = %v, want %v", c.nums, got, c.want)
		}
	}
}

func TestJump(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{2, 3, 1, 1, 4}, 2},
		{[]int{2, 3, 0, 1, 4}, 2},
		{[]int{0}, 0},
		{[]int{1, 2}, 1},
	}
	for _, c := range cases {
		if got := Jump(c.nums); got != c.want {
			t.Errorf("Jump(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestMaxSubArray(t *testing.T) {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}, 6},
		{[]int{1}, 1},
		{[]int{5, 4, -1, 7, 8}, 23},
		{[]int{-3, -1, -2}, -1}, // all negative: the least-bad single element
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxSubArray(c.nums); got != c.want {
			t.Errorf("MaxSubArray(%v) = %d, want %d", c.nums, got, c.want)
		}
	}
}

func TestMinCostClimbingStairs(t *testing.T) {
	cases := []struct {
		cost []int
		want int
	}{
		{[]int{10, 15, 20}, 15},
		{[]int{1, 100, 1, 1, 1, 100, 1, 1, 100, 1}, 6},
		{[]int{5}, 0},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MinCostClimbingStairs(c.cost); got != c.want {
			t.Errorf("MinCostClimbingStairs(%v) = %d, want %d", c.cost, got, c.want)
		}
	}
}

func TestCombinationSum4(t *testing.T) {
	cases := []struct {
		nums   []int
		target int
		want   int
	}{
		{[]int{1, 2, 3}, 4, 7}, // ORDER matters: 1+2 and 2+1 both count
		{[]int{9}, 3, 0},
		{[]int{1, 2, 3}, 0, 1},
	}
	for _, c := range cases {
		if got := CombinationSum4(c.nums, c.target); got != c.want {
			t.Errorf("CombinationSum4(%v, %d) = %d, want %d", c.nums, c.target, got, c.want)
		}
	}
}

// CombinationSum4 counts permutations, CoinChange2 counts combinations — the
// only difference is loop order. Pinning the contrast stops a future "fix" of
// one from silently turning it into the other.
func TestCombinationSum4VsCoinChange2LoopOrder(t *testing.T) {
	nums := []int{1, 2, 3}
	if perms, combos := CombinationSum4(nums, 4), CoinChange2(4, nums); perms == combos {
		t.Errorf("permutations (%d) should differ from combinations (%d) for %v/target 4",
			perms, combos, nums)
	}
}

func TestKnapsack01(t *testing.T) {
	cases := []struct {
		weights, values []int
		capacity, want  int
	}{
		{[]int{1, 3, 4, 5}, []int{1, 4, 5, 7}, 7, 9},
		{[]int{1, 2, 3}, []int{6, 10, 12}, 5, 22},
		{[]int{5}, []int{10}, 4, 0}, // does not fit
		{[]int{1, 2}, []int{1, 2}, 0, 0},
		{[]int{1, 2}, []int{1}, 5, 0}, // mismatched lengths guard
	}
	for _, c := range cases {
		if got := Knapsack01(c.weights, c.values, c.capacity); got != c.want {
			t.Errorf("Knapsack01(%v, %v, %d) = %d, want %d",
				c.weights, c.values, c.capacity, got, c.want)
		}
	}
}

// Each item may be taken ONCE. With an upward capacity loop this returns 4
// (item reused four times); the downward loop is what keeps it at 1.
func TestKnapsack01DoesNotReuseItems(t *testing.T) {
	if got := Knapsack01([]int{1}, []int{1}, 4); got != 1 {
		t.Errorf("Knapsack01 reused a 0/1 item: got %d, want 1", got)
	}
}

func TestFindTargetSumWays(t *testing.T) {
	cases := []struct {
		nums   []int
		target int
		want   int
	}{
		{[]int{1, 1, 1, 1, 1}, 3, 5},
		{[]int{1}, 1, 1},
		{[]int{1}, 2, 0},    // unreachable
		{[]int{1, 2}, 2, 0}, // parity: target+total is odd
	}
	for _, c := range cases {
		if got := FindTargetSumWays(c.nums, c.target); got != c.want {
			t.Errorf("FindTargetSumWays(%v, %d) = %d, want %d",
				c.nums, c.target, got, c.want)
		}
	}
}

// MaxProductPath returns the RAW best product (matching the JS maxProductPath).
func TestMaxProductPath(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{1, -2, 1}, {1, -2, 1}, {3, -4, 1}}, 8}, // two negatives cancel
		{[][]int{{1, 3}, {0, -4}}, 0},
		{[][]int{{2, 3}, {4, 5}}, 40}, // 2→4→5 beats 2→3→5
		{[][]int{{5}}, 5},
		// Every path here multiplies the same five values, so all routes tie
		// at -36; the raw version reports it, LC1594 would report -1.
		{[][]int{{-1, -2, -3}, {-2, -3, -3}, {-3, -3, -2}}, -36},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MaxProductPath(c.grid); got != c.want {
			t.Errorf("MaxProductPath(%v) = %d, want %d", c.grid, got, c.want)
		}
	}
}

// MaxProductPathMod applies the LeetCode 1594 contract instead: -1 for a
// negative best product, otherwise the product mod 1e9+7.
func TestMaxProductPathMod(t *testing.T) {
	cases := []struct {
		grid [][]int
		want int
	}{
		{[][]int{{-1, -2, -3}, {-2, -3, -3}, {-3, -3, -2}}, -1}, // negative → -1
		{[][]int{{1, -2, 1}, {1, -2, 1}, {3, -4, 1}}, 8},
		{[][]int{{1, 3}, {0, -4}}, 0},
		{[][]int{{2, 3}, {4, 5}}, 40},
		{nil, -1},
	}
	for _, c := range cases {
		if got := MaxProductPathMod(c.grid); got != c.want {
			t.Errorf("MaxProductPathMod(%v) = %d, want %d", c.grid, got, c.want)
		}
	}
}

// The big.Int path must stay exact where the plain int path silently wraps.
// A 4x4 grid of 1000s has product 1000^7 = 1e21, well past 2^63.
func TestMaxProductPathModExactBeyondInt64(t *testing.T) {
	grid := [][]int{
		{1000, 1000, 1000, 1000},
		{1000, 1000, 1000, 1000},
		{1000, 1000, 1000, 1000},
		{1000, 1000, 1000, 1000},
	}
	// 1000^7 mod (1e9+7): computed independently below with big.Int so the
	// assertion does not just re-run the implementation's own arithmetic.
	want := new(big.Int).Mod(
		new(big.Int).Exp(big.NewInt(1000), big.NewInt(7), nil),
		big.NewInt(1_000_000_007),
	)
	if got := MaxProductPathMod(grid); int64(got) != want.Int64() {
		t.Errorf("MaxProductPathMod(1000s) = %d, want %d", got, want.Int64())
	}
}
