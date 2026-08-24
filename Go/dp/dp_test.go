package dp

import "testing"

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
